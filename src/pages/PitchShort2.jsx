// /pitch-short-2 — same slides as /pitch-short, but rendered as a vertical
// scrollable page (one slide per viewport-height section). No top bar, no
// bottom nav, no keyboard handlers, no animated transitions. Designed for
// recipients who prefer scrolling over slide-by-slide presentation chrome.
import { Helmet } from "react-helmet-async";
import { SHORT_SLIDES } from "./PitchShort";
import { OnePager2Slide } from "./OnePager2";
import BrandMark from "../components/BrandMark";

// Slide 1 in /pitch-short uses SlideOnePagerSummary which wraps OnePager2Slide
// with deck-specific negative margins. In scroll mode there's no deck padding
// to cancel, so render OnePager2Slide directly here.
function ScrollOnePagerOpener() {
  return <OnePager2Slide showHeader={false} showFooter={false} />;
}

const SCROLL_SLIDES = SHORT_SLIDES.map((s, i) =>
  i === 0 ? { ...s, component: ScrollOnePagerOpener } : s
);

export default function PitchShort2() {
  return (
    <>
      <Helmet>
        <title>Traigent — Pitch (Scroll)</title>
      </Helmet>
      {/* Suppress HubSpot chat widget + cookie banner. NOTE: do NOT include
          `.hs-messages-mobile` — that selector matches React's own root in
          some dev builds and blanks the entire page on mobile. */}
      <style>{`
        #hubspot-messages-iframe-container,
        .hs-banner-iframe,
        #hs-eu-cookie-confirmation,
        #hs-eu-cookie-confirmation-inner { display: none !important; }
      `}</style>
      <div className="bg-[#080808] text-white">
        {SCROLL_SLIDES.map((slide, i) => {
          const Slide = slide.component;
          return (
            <section
              key={`${i}-${slide.title}`}
              className="min-h-screen flex items-center justify-center bg-[#080808] border-b border-slate-900/60 last:border-b-0 px-4 md:px-12 py-12"
            >
              <div className="relative w-full max-w-[1280px] mx-auto border border-slate-600 rounded-lg pt-16 pb-12 px-4 md:px-10 min-h-[500px] md:min-h-[700px]">
                <a
                  href="https://www.traigent.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-4 left-4 z-10 hover:opacity-80 transition-opacity"
                  aria-label="Traigent.ai"
                >
                  <BrandMark size="md" />
                </a>
                <div className="flex items-center justify-center">
                  <Slide />
                </div>
                <span className="absolute bottom-3 right-4 text-slate-500 text-xs md:text-sm font-mono">
                  {i + 1} / {SCROLL_SLIDES.length}
                </span>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
