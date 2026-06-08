// ===================================================================
// PitchInvestor — vertical-scroll React render of the canonical
// Pitch Deck 2026-06 Google Slides presentation.
//
// Source of truth (preserved out-of-tree):
//   ...\Kingston D drive\2026 job search\TRAIGENT-AI\investor-deck-source\
//     pitch-deck-2026-06.pptx
//     pitch-deck-2026-06.pdf
//
// Each slide is exported pixel-perfect via PowerPoint COM at 2560x1440
// and rendered here as a full-bleed image inside the standard 1280x720
// canvas frame shared with /pitch-short-2. No re-implementation in
// React — the deck IS the source slides.
//
// To re-export the slide PNGs (e.g. after the source deck is edited):
//   pwsh -Command "& {
//     $src = '...\Kingston D drive\2026 job search\TRAIGENT-AI\investor-deck-source\pitch-deck-2026-06.pptx'
//     $out = 'C:\Users\amirb\Documents\traigent-workspace\traigent-web\public\investor-deck\slides'
//     $ppt = New-Object -ComObject PowerPoint.Application
//     $pres = $ppt.Presentations.Open($src, $true, $false, $false)
//     for ($i = 1; $i -le $pres.Slides.Count; $i++) {
//       $pres.Slides.Item($i).Export((Join-Path $out ('slide-{0:D2}.png' -f $i)), 'PNG', 2560, 1440)
//     }
//     $pres.Close(); $ppt.Quit()
//   }"
// ===================================================================
import { Helmet } from "react-helmet-async";
import { useKnownContactNotify } from "../lib/useKnownContactNotify";
import { notifyPitchDeckViewed } from "../lib/hubspotForms";
import { usePageView } from "../lib/usePageView";
import {
  SLIDE_W,
  SLIDE_H,
  SCROLL_DECK_GLOBAL_CSS,
  ScrollCanvasFrame,
  useRemoveHubSpotChatWidget,
  useScrollDeckScale,
} from "./pitch/scrollCanvas";
// Hotspot manifest — invisible <a> rectangles overlaid on each flattened
// slide PNG so the source deck's hyperlinks (LinkedIn, mailto, scholar,
// source citations, demo video) survive the PowerPoint -> PNG export.
// Regenerate with: node scripts/extract-investor-deck-hotspots.mjs
import HOTSPOTS from "./pitch/investor-hotspots.json";

// Slide order is intentionally identical to the source deck.
// Titles are used only for alt text / aria labels — visible content
// is entirely the exported PNG.
const INVESTOR_SLIDES = [
  { file: "slide-01.png", title: "Trust your AI agent at scale." },
  { file: "slide-02.png", title: "Team — Dr. Nimrod Busany & Amir Barnea" },
  { file: "slide-03.png", title: "The Execution Gap" },
  { file: "slide-04.png", title: "Defining the Optimization Category" },
  { file: "slide-05.png", title: "Our Value Proposition" },
  { file: "slide-06.png", title: "Before / After" },
  { file: "slide-07.png", title: "Market Opportunity" },
  { file: "slide-08.png", title: "They Report, We Fix." },
  { file: "slide-09.png", title: "Go-To-Market & Traction" },
  { file: "slide-10.png", title: "Financial Projections" },
  { file: "slide-11.png", title: "Questions?" },
];

export default function PitchInvestor() {
  usePageView();
  useKnownContactNotify({
    notify: notifyPitchDeckViewed,
    location: "pitch_investor",
    eventName: "pitch_deck_viewed_known",
    gateKey: "pitch_deck",
  });
  useRemoveHubSpotChatWidget();
  const scale = useScrollDeckScale();
  return (
    <>
      <Helmet>
        <title>Traigent — Investor presentation</title>
        <meta
          name="description"
          content="Traigent investor presentation — Trust your AI agent at scale. The Continuous Optimization Infrastructure for Enterprise GenAI."
        />
      </Helmet>
      <style>{SCROLL_DECK_GLOBAL_CSS}</style>
      <div className="bg-[#080808] text-white">
        {INVESTOR_SLIDES.map((slide, i) => {
          const hotspots = HOTSPOTS[slide.file] || [];
          return (
            <ScrollCanvasFrame
              key={slide.file}
              index={i}
              total={INVESTOR_SLIDES.length}
              scale={scale}
            >
              <img
                src={`${import.meta.env.BASE_URL}investor-deck/slides/${slide.file}`}
                alt={slide.title}
                width={SLIDE_W}
                height={SLIDE_H}
                loading={i < 2 ? "eager" : "lazy"}
                decoding="async"
                className="absolute inset-0 w-full h-full object-contain"
                draggable={false}
              />
              {/* Transparent <a> rectangles overlaid at the source-deck shape
                  coordinates. Same href targets as the PPTX. */}
              {hotspots.map((h, hi) => (
                <a
                  key={`${h.href}-${h.x}-${h.y}-${h.w}-${h.h}`}
                  href={h.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={h.href}
                  className="absolute z-20 cursor-pointer"
                  style={{
                    left: `${h.x * 100}%`,
                    top: `${h.y * 100}%`,
                    width: `${h.w * 100}%`,
                    height: `${h.h * 100}%`,
                  }}
                />
              ))}
            </ScrollCanvasFrame>
          );
        })}
      </div>
    </>
  );
}
