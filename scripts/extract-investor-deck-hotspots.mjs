#!/usr/bin/env node
// ---------------------------------------------------------------------------
// extract-investor-deck-hotspots.mjs
//
// Reads the unpacked PPTX at:
//   <SOURCE_ROOT>\investor-deck-source\pptx-unpacked\ppt\
// Finds every shape on every slide that contains a hyperlink (either
// shape-level <a:hlinkClick> on <p:cNvPr> or text-run-level inside <a:rPr>),
// and emits a JSON manifest at:
//   src/pages/pitch/investor-hotspots.json
//
// The manifest is then used by PitchInvestor.jsx to overlay invisible <a>
// rectangles on top of the flattened slide PNGs so the source deck's
// hyperlinks survive the PowerPoint -> PNG export pass.
//
// Heuristics:
//   - Per shape we emit ONE hotspot covering the shape's bounding box.
//   - If a shape has multiple hyperlinks (e.g. an email + a LinkedIn link in
//     the same contact-card text line), we use the LAST hyperlink as the
//     primary target. This matches the convention "click anywhere on the
//     contact row → LinkedIn" and matches the user's complaint that the
//     LinkedIn links were the noticeably-missing ones.
//   - Coordinates are emitted as fractions of slide width/height (0..1) so
//     the React canvas can multiply by 1280/720 without re-running this
//     script if the canvas size changes.
//
// Re-run after editing the source deck (and after re-exporting slide PNGs):
//   node scripts/extract-investor-deck-hotspots.mjs
// ---------------------------------------------------------------------------
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { isAbsolute, relative, resolve } from "node:path";

const SOURCE_ROOT = "C:/Users/amirb/Documents/Kingston D drive/2026 job search/TRAIGENT-AI/investor-deck-source/pptx-unpacked/ppt";
const SLIDE_COUNT = 11;
const OUT_PATH = resolve(import.meta.dirname, "..", "src", "pages", "pitch", "investor-hotspots.json");

function sourcePath(...segments) {
  for (const segment of segments) {
    if (segment.includes("..") || isAbsolute(segment)) {
      throw new Error(`Invalid source path segment: ${segment}`);
    }
  }

  const path = resolve(SOURCE_ROOT, ...segments);
  const withinSourceRoot = relative(SOURCE_ROOT, path);
  if (withinSourceRoot.startsWith("..") || isAbsolute(withinSourceRoot)) {
    throw new Error(`Refusing to read outside source deck root: ${path}`);
  }
  return path;
}

function readSourceXml(...segments) {
  const path = sourcePath(...segments);
  if (!existsSync(path)) throw new Error(`Missing: ${path}`);
  return readFileSync(path, "utf-8");
}

function isXmlWhitespace(char) {
  return char === " " || char === "\n" || char === "\r" || char === "\t";
}

function parseAttributes(source) {
  const attrs = {};
  let index = 0;

  while (index < source.length) {
    while (index < source.length && isXmlWhitespace(source[index])) index++;

    const nameStart = index;
    while (
      index < source.length &&
      source[index] !== "=" &&
      !isXmlWhitespace(source[index])
    ) {
      index++;
    }
    const name = source.slice(nameStart, index);
    while (index < source.length && isXmlWhitespace(source[index])) index++;
    if (!name || source[index] !== "=") {
      index++;
      continue;
    }

    index++;
    while (index < source.length && isXmlWhitespace(source[index])) index++;
    const quote = source[index];
    if (quote !== '"' && quote !== "'") {
      index++;
      continue;
    }

    const valueStart = index + 1;
    const valueEnd = source.indexOf(quote, valueStart);
    if (valueEnd === -1) break;
    attrs[name] = source.slice(valueStart, valueEnd);
    index = valueEnd + 1;
  }

  return attrs;
}

// Parse the <Relationships> file for a slide → { rId: { type, target } }.
function parseRels(xml) {
  const rels = {};
  let index = 0;

  while (index < xml.length) {
    const start = xml.indexOf("<Relationship", index);
    if (start === -1) break;

    const tagNameEnd = start + "<Relationship".length;
    if (!isXmlWhitespace(xml[tagNameEnd]) && xml[tagNameEnd] !== ">") {
      index = tagNameEnd;
      continue;
    }

    const openEnd = xml.indexOf(">", tagNameEnd);
    if (openEnd === -1) break;
    const rawAttributes = xml.slice(tagNameEnd, openEnd).trimEnd();
    const attributeSource = rawAttributes.endsWith("/")
      ? rawAttributes.slice(0, -1)
      : rawAttributes;
    const attrs = parseAttributes(attributeSource);
    if (attrs.Id) rels[attrs.Id] = { type: attrs.Type, target: attrs.Target };
    index = openEnd + 1;
  }
  return rels;
}

// Resolve a hyperlink rels target → final URL. Slides reference internal +
// external URLs through the same `Target` attribute (TargetMode="External"
// for external, otherwise relative path) — we just take Target as-is when
// the rel type is hyperlink.
function decodeXmlEntities(s) {
  return s
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&amp;", "&");
}

function normalizeHref(target) {
  const href = decodeXmlEntities(target.trim());
  if (!/^(https?:\/\/|mailto:)/i.test(href)) return null;
  return href;
}

function resolveHref(rels, rId) {
  const rel = rels[rId];
  if (!rel) return null;
  if (!rel.type?.endsWith("/hyperlink")) return null;
  return normalizeHref(rel.target);
}

// Read the slide-size from presentation.xml (EMUs).
function getSlideSize() {
  const presXml = readSourceXml("presentation.xml");
  const sizeStart = presXml.indexOf("<p:sldSz");
  if (sizeStart === -1) {
    throw new Error("Could not find <p:sldSz> in presentation.xml");
  }
  const sizeEnd = presXml.indexOf(">", sizeStart);
  if (sizeEnd === -1) {
    throw new Error("Could not parse <p:sldSz> in presentation.xml");
  }
  const attrs = parseAttributes(presXml.slice(sizeStart + "<p:sldSz".length, sizeEnd));
  // Standard 16:9 is cx=12192000 cy=6858000.
  const cx = Number.parseInt(attrs.cx, 10);
  const cy = Number.parseInt(attrs.cy, 10);
  if (!Number.isFinite(cx) || !Number.isFinite(cy)) {
    throw new Error("Could not parse slide dimensions in presentation.xml");
  }
  return { cx, cy };
}

function shapeBlocks(slideXml) {
  const tags = ["sp", "pic", "graphicFrame"];
  const blocks = [];
  let index = 0;

  while (index < slideXml.length) {
    let next = null;
    for (const tag of tags) {
      const start = slideXml.indexOf(`<p:${tag}`, index);
      if (start !== -1 && (next === null || start < next.start)) {
        next = { tag, start };
      }
    }
    if (next === null) break;

    const openEnd = slideXml.indexOf(">", next.start);
    if (openEnd === -1) break;
    const closeTag = `</p:${next.tag}>`;
    const closeStart = slideXml.indexOf(closeTag, openEnd + 1);
    if (closeStart === -1) {
      index = openEnd + 1;
      continue;
    }
    blocks.push(slideXml.slice(openEnd + 1, closeStart));
    index = closeStart + closeTag.length;
  }

  return blocks;
}

function hyperlinkIds(innerXml) {
  const ids = [];
  let index = 0;

  while (index < innerXml.length) {
    const start = innerXml.indexOf("<a:hlinkClick", index);
    if (start === -1) break;
    const openEnd = innerXml.indexOf(">", start);
    if (openEnd === -1) break;
    const attrs = parseAttributes(
      innerXml.slice(start + "<a:hlinkClick".length, openEnd),
    );
    if (attrs["r:id"]) ids.push(attrs["r:id"]);
    index = openEnd + 1;
  }

  return ids;
}

// Pull the rId from a shape-level <a:hlinkClick> on <p:cNvPr>, if any.
// Shape-level links cover the whole shape (e.g. wrapping an image).
function shapeLevelLinkRId(innerXml) {
  const cnvStart = innerXml.indexOf("<p:cNvPr");
  if (cnvStart === -1) return null;
  const cnvClose = innerXml.indexOf("</p:cNvPr>", cnvStart);
  // Self-closing <p:cNvPr .../> has no children, so no shape-level link.
  if (cnvClose === -1) return null;
  const inside = innerXml.slice(cnvStart, cnvClose);
  const ids = hyperlinkIds(inside);
  return ids[0] ?? null;
}

// Return the inner XML of <p:txBody>, or null if there is none.
function txBodyContents(innerXml) {
  const start = innerXml.indexOf("<p:txBody");
  if (start === -1) return null;
  const openEnd = innerXml.indexOf(">", start);
  if (openEnd === -1) return null;
  const closeStart = innerXml.indexOf("</p:txBody>", openEnd);
  if (closeStart === -1) return null;
  return innerXml.slice(openEnd + 1, closeStart);
}

// Split a <p:txBody> body into paragraph inner-XML strings, in document
// order. Handles both <a:p>...</a:p> and the rare <a:p/> (empty paragraph).
function paragraphBlocks(txBodyXml) {
  const blocks = [];
  let index = 0;
  while (index < txBodyXml.length) {
    const start = txBodyXml.indexOf("<a:p", index);
    if (start === -1) break;
    const afterTag = start + "<a:p".length;
    // Empty <a:p/> contributes an empty paragraph block (preserves vertical
    // spacing so the per-row split tracks the source layout).
    if (txBodyXml[afterTag] === "/" && txBodyXml[afterTag + 1] === ">") {
      blocks.push("");
      index = afterTag + 2;
      continue;
    }
    const openEnd = txBodyXml.indexOf(">", afterTag);
    if (openEnd === -1) break;
    const closeStart = txBodyXml.indexOf("</a:p>", openEnd);
    if (closeStart === -1) break;
    blocks.push(txBodyXml.slice(openEnd + 1, closeStart));
    index = closeStart + "</a:p>".length;
  }
  return blocks;
}

// Extract the text runs of a paragraph as { text, rId } in document order.
// rId is null when the run is not hyperlinked. Text is XML-entity-decoded.
function paragraphRuns(paraXml) {
  const runs = [];
  let index = 0;
  while (index < paraXml.length) {
    const start = paraXml.indexOf("<a:r", index);
    if (start === -1) break;
    const afterTag = start + "<a:r".length;
    // Only match the <a:r> run element, not e.g. <a:rPr>. Next char must
    // be whitespace (attributes) or > (no attributes).
    if (
      paraXml[afterTag] !== ">" &&
      paraXml[afterTag] !== " " &&
      paraXml[afterTag] !== "\n" &&
      paraXml[afterTag] !== "\r" &&
      paraXml[afterTag] !== "\t"
    ) {
      index = afterTag;
      continue;
    }
    const openEnd = paraXml.indexOf(">", afterTag);
    if (openEnd === -1) break;
    const closeStart = paraXml.indexOf("</a:r>", openEnd);
    if (closeStart === -1) break;
    const runInner = paraXml.slice(openEnd + 1, closeStart);

    // Collect every <a:t>...</a:t> text fragment in the run (usually one).
    let text = "";
    let ti = 0;
    while (ti < runInner.length) {
      const tStart = runInner.indexOf("<a:t", ti);
      if (tStart === -1) break;
      const tOpenEnd = runInner.indexOf(">", tStart);
      if (tOpenEnd === -1) break;
      const tCloseStart = runInner.indexOf("</a:t>", tOpenEnd);
      if (tCloseStart === -1) break;
      text += decodeXmlEntities(runInner.slice(tOpenEnd + 1, tCloseStart));
      ti = tCloseStart + "</a:t>".length;
    }

    // First hyperlinkClick in the run (lives inside <a:rPr>) defines this
    // run's link target. Runs without one are plain text.
    const rId = hyperlinkIds(runInner)[0] ?? null;
    runs.push({ text, rId });
    index = closeStart + "</a:r>".length;
  }
  return runs;
}

function firstTransform(innerXml) {
  const xfrmStart = innerXml.indexOf("<a:xfrm");
  if (xfrmStart === -1) return null;
  const xfrmEnd = innerXml.indexOf("</a:xfrm>", xfrmStart);
  if (xfrmEnd === -1) return null;
  const xfrmXml = innerXml.slice(xfrmStart, xfrmEnd);

  const offStart = xfrmXml.indexOf("<a:off");
  const offEnd = offStart === -1 ? -1 : xfrmXml.indexOf(">", offStart);
  const extStart = xfrmXml.indexOf("<a:ext", offEnd);
  const extEnd = extStart === -1 ? -1 : xfrmXml.indexOf(">", extStart);
  if (offEnd === -1 || extEnd === -1) return null;

  const off = parseAttributes(xfrmXml.slice(offStart + "<a:off".length, offEnd));
  const ext = parseAttributes(xfrmXml.slice(extStart + "<a:ext".length, extEnd));
  const x = Number.parseInt(off.x, 10);
  const y = Number.parseInt(off.y, 10);
  const w = Number.parseInt(ext.cx, 10);
  const h = Number.parseInt(ext.cy, 10);
  if (![x, y, w, h].every(Number.isFinite)) return null;
  return { x, y, w, h };
}

// Walk shapes (<p:sp>, <p:pic>, <p:graphicFrame>) in a slide and pull out
// every hyperlinked region. Two link kinds are emitted:
//
//   - Shape-level <a:hlinkClick> on <p:cNvPr>: a hotspot covering the whole
//     shape bounding box (e.g. an image-wrapping link on slide 6).
//   - Text-run-level <a:hlinkClick> inside <a:r><a:rPr>: a hotspot
//     positioned at the cumulative character offset of that run within its
//     paragraph, with width proportional to its character count, and
//     height equal to one paragraph row of the shape. Character widths are
//     approximated as uniform — not pixel-perfect, but on the short
//     single-line shapes on slides 7 and 11 it lands within a few percent
//     of the visible link text.
//
// PPTX shapes can nest inside <p:grpSp> — we don't descend into those.
// The investor deck doesn't use grouped hyperlinked shapes.
function extractShapeHotspots(slideXml, rels, slideSize) {
  const hotspots = [];

  for (const inner of shapeBlocks(slideXml)) {
    if (hyperlinkIds(inner).length === 0) continue;
    const transform = firstTransform(inner);
    if (!transform) continue;

    const toFraction = (xEmu, yEmu, wEmu, hEmu, href) => ({
      href,
      x: +(xEmu / slideSize.cx).toFixed(5),
      y: +(yEmu / slideSize.cy).toFixed(5),
      w: +(wEmu / slideSize.cx).toFixed(5),
      h: +(hEmu / slideSize.cy).toFixed(5),
    });

    // Shape-level link: covers the whole bbox.
    const shapeRId = shapeLevelLinkRId(inner);
    if (shapeRId) {
      const href = resolveHref(rels, shapeRId);
      if (href) {
        hotspots.push(
          toFraction(transform.x, transform.y, transform.w, transform.h, href),
        );
      }
    }

    // Text-run links: chop the bbox into one row per paragraph, then size
    // each linked run inside its row by character count.
    const txBody = txBodyContents(inner);
    if (!txBody) continue;
    const paragraphs = paragraphBlocks(txBody).map(paragraphRuns);
    if (paragraphs.length === 0) continue;
    const rowH = transform.h / paragraphs.length;

    paragraphs.forEach((runs, pi) => {
      const totalChars = runs.reduce((sum, r) => sum + r.text.length, 0) || 1;
      let cumulative = 0;
      for (const run of runs) {
        const runChars = run.text.length;
        if (run.rId) {
          const href = resolveHref(rels, run.rId);
          if (href) {
            const xEmu = transform.x + (transform.w * cumulative) / totalChars;
            const wEmu = (transform.w * runChars) / totalChars;
            const yEmu = transform.y + rowH * pi;
            hotspots.push(toFraction(xEmu, yEmu, wEmu, rowH, href));
          }
        }
        cumulative += runChars;
      }
    });
  }

  // Dedupe identical hotspots (a shape-level link plus a single-run text
  // link in the same shape can collide).
  const seen = new Set();
  return hotspots.filter((h) => {
    const k = `${h.href}|${h.x}|${h.y}|${h.w}|${h.h}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function main() {
  const slideSize = getSlideSize();
  console.log(`Slide canvas: ${slideSize.cx} x ${slideSize.cy} EMU`);

  const manifest = {};
  for (let i = 1; i <= SLIDE_COUNT; i++) {
    const slideXml = readSourceXml("slides", `slide${i}.xml`);
    const relsXml = readSourceXml("slides", "_rels", `slide${i}.xml.rels`);
    const rels = parseRels(relsXml);
    const hotspots = extractShapeHotspots(slideXml, rels, slideSize);
    if (hotspots.length > 0) {
      const key = `slide-${String(i).padStart(2, "0")}.png`;
      manifest[key] = hotspots;
      console.log(`Slide ${i}: ${hotspots.length} hotspot(s)`);
      for (const h of hotspots) {
        console.log(
          `  -> ${h.href}  (${(h.x * 100).toFixed(1)}%, ${(h.y * 100).toFixed(1)}%, ${(h.w * 100).toFixed(1)}% x ${(h.h * 100).toFixed(1)}%)`,
        );
      }
    } else {
      console.log(`Slide ${i}: no hyperlinks`);
    }
  }

  writeFileSync(OUT_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf-8");
  console.log(`\nWrote ${OUT_PATH}`);
}

main();
