// /pitch-short-2 — same slides as /pitch-short, but rendered as a vertical
// scrollable page (one slide per viewport-height section). No top bar, no
// bottom nav, no keyboard handlers, no animated transitions. Designed for
// recipients who prefer scrolling over slide-by-slide presentation chrome.
import { Helmet } from "react-helmet-async";
import { SHORT_SLIDES } from "./PitchShort";
import { OnePager2Slide } from "./OnePager2";

// Slide 1 in /pitch-short uses SlideOnePagerSummary which wraps OnePager2Slide
// with deck-specific negative margins (-my-24) to cancel the PitchDeck's
// py-24 padding. In scroll mode there's no parent padding to cancel, so
// render OnePager2Slide directly here.
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
      {/* Suppress HubSpot chat widget + cookie banner — this is a clean
          presentation surface, no chat needed. */}
      <style>{`
        #hubspot-messages-iframe-container,
        .hs-messages-mobile,
        .hs-banner-iframe,
        #hs-eu-cookie-confirmation,
        #hs-eu-cookie-confirmation-inner { display: none !important; visibility: hidden !important; }
      `}</style>
      <div className="bg-[#080808] text-white">
        {SCROLL_SLIDES.map((slide, i) => {
          const Slide = slide.component;
          return (
            <section
              key={`${i}-${slide.title}`}
              className="min-h-screen flex items-center justify-center bg-[#080808] border-b border-slate-900/60 last:border-b-0"
            >
              {/* Visible 16:9 grey-framed rectangle (1280x720) consistent
                  across every slide. Traigent.ai brand mark sits at its
                  top-left corner; the slide content fills the rest of the box. */}
              <div className="relative w-[1280px] h-[720px] max-w-full border border-slate-600 rounded-lg">
                <a
                  href="https://www.traigent.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-4 left-4 z-10 flex items-center gap-2 hover:opacity-80 transition-opacity"
                  aria-label="Traigent.ai"
                >
                  <img src="/images/traigent-logo-icon.png" alt="" aria-hidden="true" className="h-6 w-auto" />
                  <span className="text-white text-base md:text-lg font-bold tracking-tight">Traigent.ai</span>
                </a>
                <div className="absolute inset-0 flex items-center justify-center px-6 md:px-10">
                  <Slide />
                </div>
                {/* Slide number at bottom-right of the frame */}
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
