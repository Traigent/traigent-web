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

// Parse the <Relationships> file for a slide → { rId: { type, target } }.
function parseRels(xml) {
  const rels = {};
  // Note: `[^/>]+` would stop at the first `/` inside URLs like
  // Target="https://..." — match everything up to the self-closing `/>`
  // instead.
  const re = /<Relationship\s+([^>]*?)\s*\/>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const attrs = {};
    for (const attr of m[1].matchAll(/(\w+)="([^"]*)"/g)) {
      attrs[attr[1]] = attr[2];
    }
    if (attrs.Id) rels[attrs.Id] = { type: attrs.Type, target: attrs.Target };
  }
  return rels;
}

// Resolve a hyperlink rels target → final URL. Slides reference internal +
// external URLs through the same `Target` attribute (TargetMode="External"
// for external, otherwise relative path) — we just take Target as-is when
// the rel type is hyperlink.
function decodeXmlEntities(s) {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function normalizeHref(target) {
  const href = decodeXmlEntities(target.trim());
  if (!/^(https?:\/\/|mailto:)/i.test(href)) return null;
  return href;
}

function resolveHref(rels, rId) {
  const rel = rels[rId];
  if (!rel) return null;
  if (!rel.type.endsWith("/hyperlink")) return null;
  return normalizeHref(rel.target);
}

// Read the slide-size from presentation.xml (EMUs).
function getSlideSize() {
  const presXml = readSourceXml("presentation.xml");
  const m = /<p:sldSz\s+cy="(\d+)"\s+cx="(\d+)"\/>/.exec(presXml) ||
            /<p:sldSz\s+cx="(\d+)"\s+cy="(\d+)"\/>/.exec(presXml);
  if (!m) throw new Error("Could not find <p:sldSz> in presentation.xml");
  // PPTX is cy-first when CX/CY order varies; both regexes try both orders.
  // Standard 16:9 is cx=12192000 cy=6858000.
  const a = parseInt(m[1], 10);
  const b = parseInt(m[2], 10);
  const [cx, cy] = a > b ? [a, b] : [b, a];
  return { cx, cy };
}

// Walk shapes (<p:sp>, <p:pic>, <p:graphicFrame>) in a slide and pull out
// each one's bounding box + the hyperlinks referenced inside it.
function extractShapeHotspots(slideXml, rels, slideSize) {
  const hotspots = [];

  // Match each top-level shape-ish element. We're tolerant about which tag
  // (sp/pic/graphicFrame) since position + hyperlinks live the same way in
  // all of them. Using a non-greedy match between open and close.
  //
  // PPTX shapes can nest inside <p:grpSp> — we'd descend into those too,
  // but the investor deck doesn't use grouped shapes for hyperlinked text
  // so we keep this flat for now.
  const shapeRe = /<p:(sp|pic|graphicFrame)\b[^>]*>([\s\S]*?)<\/p:\1>/g;
  let m;
  while ((m = shapeRe.exec(slideXml)) !== null) {
    const inner = m[2];

    // Hyperlinks inside this shape, in document order. Both shape-level
    // (in <p:nvSpPr><p:cNvPr>) and text-run-level (<a:rPr>) link refs
    // share the same <a:hlinkClick r:id="rIdN" ...> form.
    const hlinks = [...inner.matchAll(/<a:hlinkClick\s+[^>]*?r:id="([^"]+)"/g)].map(
      (h) => h[1],
    );
    if (hlinks.length === 0) continue;

    // First <a:xfrm><a:off/><a:ext/> inside the shape is the shape's bbox.
    // <a:bodyPr> may also contain offsets but we want spPr's xfrm — that's
    // the one that appears first inside each <p:sp>/<p:pic>/<p:graphicFrame>.
    const xfrmMatch = /<a:xfrm[^>]*>\s*<a:off\s+x="(\d+)"\s+y="(\d+)"\/>\s*<a:ext\s+cx="(\d+)"\s+cy="(\d+)"\/>\s*<\/a:xfrm>/.exec(
      inner,
    );
    if (!xfrmMatch) continue;
    const x = parseInt(xfrmMatch[1], 10);
    const y = parseInt(xfrmMatch[2], 10);
    const w = parseInt(xfrmMatch[3], 10);
    const h = parseInt(xfrmMatch[4], 10);

    // Use the LAST link in document order — that's the LinkedIn target on
    // each contact-card row, the trailing source citation on the market
    // slide, etc.
    const primaryRId = hlinks[hlinks.length - 1];
    const href = resolveHref(rels, primaryRId);
    if (!href) continue;

    hotspots.push({
      href,
      x: +(x / slideSize.cx).toFixed(5),
      y: +(y / slideSize.cy).toFixed(5),
      w: +(w / slideSize.cx).toFixed(5),
      h: +(h / slideSize.cy).toFixed(5),
    });
  }

  return hotspots;
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
