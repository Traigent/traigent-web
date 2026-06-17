// /pitch-short-2 - same slides as /pitch-short, but rendered as a vertical
// scrollable page. Each slide is a fixed 1280x720 canvas scaled down to fit
// the viewport, which keeps it readable on iPhone landscape without clipping.
//
// Subset filtering: `?range=N-M` (1-based, inclusive) renders only that slice.
// Used by the hidden presentations menu in the top nav to share narrowly-
// targeted versions of the deck (short summary, market opportunity, etc.).
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useSearchParams } from "react-router-dom";
import { SHORT_SLIDES } from "./PitchShort";
import { OnePager2Slide } from "./OnePager2";
import BrandMark from "../components/BrandMark";
import { useKnownContactNotify } from "../lib/useKnownContactNotify";
import { notifyPitchDeckViewed } from "../lib/hubspotForms";
import { usePageView } from "../lib/usePageView";

// Named presets — URLs like /pitch-short-2/extended-product-presentation map
// onto specific range/exclude filters here, so each deck has a readable URL
// matching its menu label. Update both this map and src/components/TopNav.jsx
// PITCH_DECK_OPTIONS when adding a new preset.
const PRESETS = {
  // Slide 24 of SHORT_SLIDES (SlideMarketOpportunity — Wave / Pain / Play)
  // leads every product + investor deck. It's the highest-signal opener and
  // the slide that immediately frames the market + Traigent's play.
  // Position 1 (SlideOnePagerTextTestV2) is dropped — it's redundant with the
  // redesigned SlideParetoFrontier at position 2.
  "extended-product-presentation": { range:   "24,2-23,27-29" },
  // Mirrors the Ness recipient deck's slide range (minus its cover slide).
  // Lifecycle close: moving-target (30) + continuous-optimization (31) land
  // right before the final CTA (29) — the lifecycle argument sets up the ask.
  "short-summary":                 { range:   "24,2,4-5,20,28,27,30,31,32,29" },
  "market-opportunity":            { range:   "24-27" },
  // Same slide range as market-opportunity for now — kept as a separate
  // preset so /investor-pitch can diverge later without touching the
  // /market-opportunity preset.
  "investor-pitch":                { range:   "24-29" },
};

const SLIDE_W = 1280;
const SLIDE_H = 720;
const VIEWPORT_MARGIN = 16;

function getScale() {
  if (typeof window === "undefined") return 1;
  const availableW = Math.max(320, window.innerWidth - VIEWPORT_MARGIN);
  const availableH = Math.max(240, window.innerHeight - VIEWPORT_MARGIN);
  return Math.min(1, availableW / SLIDE_W, availableH / SLIDE_H);
}

function useViewportScale() {
  const [scale, setScale] = useState(getScale);

  useEffect(() => {
    const update = () => setScale(getScale());
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return scale;
}

function useRemoveChatWidget() {
  useEffect(() => {
    const removeChat = () => {
      window.HubSpotConversations?.widget?.remove?.();
      document.querySelectorAll(
        [
          "#hubspot-messages-iframe-container",
          "#hubspot-conversations-iframe",
          ".hs-shadow-container",
          "iframe[src*='conversations-visitor']",
        ].join(",")
      ).forEach((node) => node.remove());
    };

    removeChat();
    const observer = new MutationObserver(removeChat);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);
}

// The OnePager2Slide is designed to render full-bleed inside the slide canvas
// (it has its own internal padding). For the scroll-mode deck we swap in a
// version with header + footer hidden and skip the standard canvas padding.
// Matched by title so reordering SHORT_SLIDES doesn't break it.
const ONE_PAGER_TITLE = "One-Pager Summary";

function ScrollOnePagerSlide() {
  return <OnePager2Slide showHeader={false} showFooter={false} />;
}

const SCROLL_SLIDES = SHORT_SLIDES.map((s) =>
  s.title === ONE_PAGER_TITLE ? { ...s, component: ScrollOnePagerSlide } : s
);

function SlideCanvas({ slide, index, total, scale }) {
  const Slide = slide.component;

  return (
    <section
      className="min-h-[100svh] flex items-center justify-center bg-[#080808] border-b border-slate-900/70 last:border-b-0"
      style={{ padding: `${VIEWPORT_MARGIN / 2}px` }}
    >
      <div
        className="relative shrink-0"
        style={{
          width: SLIDE_W * scale,
          height: SLIDE_H * scale,
        }}
      >
        <div
          className="pitch-short-2-slide relative bg-[#080808] text-white overflow-hidden border border-slate-600"
          style={{
            width: SLIDE_W,
            height: SLIDE_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <a
            href="https://www.traigent.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-4 left-4 z-10 hover:opacity-80 transition-opacity"
            aria-label="Traigent.ai"
          >
            <BrandMark size="md" />
          </a>

          <div
            className={`h-full w-full flex items-center justify-center ${
              slide.title === ONE_PAGER_TITLE ? "" : "px-10 pt-16 pb-12"
            }`}
          >
            <Slide />
          </div>

          <span className="absolute bottom-3 right-4 text-slate-500 text-sm font-mono">
            {index + 1} / {total}
          </span>
        </div>
      </div>
    </section>
  );
}

// Parse a comma-separated list like "1-5,7,9-12" into an array of
// [startIdx, endIdx) zero-based half-open intervals. Single numbers like
// "27" become [26, 27). Malformed parts are skipped; returns null if nothing
// parses.
function parseRangeList(s, total) {
  if (!s) return null;
  const out = [];
  for (const part of s.split(",").map((p) => p.trim()).filter(Boolean)) {
    const range = /^\s*(\d+)\s*-\s*(\d+)\s*$/.exec(part);
    const single = /^\s*(\d+)\s*$/.exec(part);
    let start;
    let end;
    if (range) {
      start = parseInt(range[1], 10) - 1;
      end = parseInt(range[2], 10);
    } else if (single) {
      start = parseInt(single[1], 10) - 1;
      end = start + 1;
    } else {
      continue;
    }
    if (Number.isNaN(start) || Number.isNaN(end)) continue;
    if (start < 0 || end <= start || start >= total) continue;
    out.push([start, Math.min(end, total)]);
  }
  return out.length ? out : null;
}

// Filter SCROLL_SLIDES per query params (1-based, inclusive both ends):
//   ?range=1-5,28   → keep only slides 1..5 and slide 28 (in that order)
//   ?exclude=25-27  → keep everything EXCEPT slides 25..27
// `range` wins when both are set. Malformed values fall back to the full deck.
function resolveSlides(rangeParam, excludeParam, allSlides) {
  const total = allSlides.length;
  const ranges = parseRangeList(rangeParam, total);
  if (ranges) {
    const out = [];
    for (const [s, e] of ranges) {
      for (let i = s; i < e; i++) out.push(allSlides[i]);
    }
    return out;
  }
  const excludes = parseRangeList(excludeParam, total);
  if (excludes) {
    return allSlides.filter(
      (_, i) => !excludes.some(([s, e]) => i >= s && i < e),
    );
  }
  return allSlides;
}

export default function PitchShort2({ forcedPreset, forcedRange, prependSlides } = {}) {
  usePageView();
  useKnownContactNotify({
    notify: notifyPitchDeckViewed,
    location: "pitch_short_2",
    eventName: "pitch_deck_viewed_known",
    gateKey: "pitch_deck",
  });
  const scale = useViewportScale();
  useRemoveChatWidget();
  // forcedPreset lets App.jsx mount this deck at a short top-level route
  // (e.g. /extended-product-presentation) without the /pitch-short-2/ prefix.
  // forcedRange + prependSlides are used by RecipientPackagePage to mount a
  // per-recipient deck (cover slide + a fixed SHORT_SLIDES range) without
  // having to register a public preset name.
  const { preset: urlPreset } = useParams();
  const preset = forcedPreset || urlPreset;
  const [searchParams] = useSearchParams();
  const slidesToRender = useMemo(() => {
    let body;
    if (forcedRange) {
      body = resolveSlides(forcedRange, null, SCROLL_SLIDES);
    } else if (preset && PRESETS[preset]) {
      const { range, exclude } = PRESETS[preset];
      body = resolveSlides(range, exclude, SCROLL_SLIDES);
    } else {
      // Raw full-deck fallback: drop the deprecated one-pager opener (redundant
      // with SlideParetoFrontier). Presets/recipient ranges already exclude it.
      body = resolveSlides(
        searchParams.get("range"),
        searchParams.get("exclude"),
        SCROLL_SLIDES,
      ).filter((s) => s.title !== "One-Pager Test — Text Only (V2)");
    }
    return prependSlides && prependSlides.length ? [...prependSlides, ...body] : body;
  }, [preset, searchParams, forcedRange, prependSlides]);

  return (
    <>
      <Helmet>
        <title>Traigent - Pitch (Scroll)</title>
      </Helmet>
      <style>{`
        #hubspot-messages-iframe-container,
        #hubspot-conversations-iframe,
        .hs-shadow-container,
        iframe[src*="conversations-visitor"],
        .hs-banner-iframe,
        #hs-eu-cookie-confirmation,
        #hs-eu-cookie-confirmation-inner { display: none !important; }
        @supports (height: 100svh) {
          html, body, #root { min-height: 100svh; }
        }
        .pitch-short-2-slide div[class*="lg:grid-cols"] {
          display: grid !important;
          grid-template-columns: minmax(0, 1fr) 180px minmax(0, 1fr) !important;
          gap: 1.5rem !important;
        }
      `}</style>
      <div className="bg-[#080808] text-white">
        {slidesToRender.map((slide, i) => (
          <SlideCanvas
            key={`${i}-${slide.title}`}
            slide={slide}
            index={i}
            total={slidesToRender.length}
            scale={scale}
          />
        ))}
      </div>
    </>
  );
}
