// /pitch-short-2 — same slides as /pitch-short, but rendered as a vertical
// scrollable page (one slide per viewport-height section). No top bar, no
// bottom nav, no keyboard handlers, no animated transitions. Designed for
// recipients who prefer scrolling over slide-by-slide presentation chrome.
import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { SHORT_SLIDES } from "./PitchShort";
import { OnePager2Slide } from "./OnePager2";

// Slide 1 in /pitch-short uses SlideOnePagerSummary which wraps OnePager2Slide
// with deck-specific negative margins. In scroll mode there's no deck padding
// to cancel, so render OnePager2Slide directly here.
function ScrollOnePagerOpener() {
  return <OnePager2Slide showHeader={false} showFooter={false} />;
}

// Auto-shrink content to fit its parent's 16:9 box without clipping. Measures
// the natural size of children, then applies CSS transform: scale to fit.
// Re-measures on window/parent resize.
function FitToBox({ children }) {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    const compute = () => {
      // Measure natural size by temporarily resetting the scale
      const prev = inner.style.transform;
      inner.style.transform = "translate(-50%, -50%)";
      const naturalW = inner.scrollWidth;
      const naturalH = inner.scrollHeight;
      inner.style.transform = prev;
      if (!naturalW || !naturalH) return;
      const outerRect = outer.getBoundingClientRect();
      const s = Math.min(1, outerRect.width / naturalW, outerRect.height / naturalH);
      setScale(s);
    };
    compute();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(compute) : null;
    if (ro) ro.observe(outer);
    window.addEventListener("resize", compute);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, []);
  return (
    <div ref={outerRef} className="absolute inset-0 overflow-hidden">
      <div
        ref={innerRef}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
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
              <div className="relative w-full max-w-[1280px] mx-auto border border-slate-600 rounded-lg aspect-[16/9] overflow-hidden">
                {/* Auto-fit the slide content inside the 16:9 box without
                    clipping — content is measured and scaled down via CSS
                    transform to fit both width and height. */}
                <FitToBox>
                  <div className="px-4 md:px-10 py-16">
                    <Slide />
                  </div>
                </FitToBox>
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
                <span className="absolute bottom-3 right-4 z-10 text-slate-500 text-xs md:text-sm font-mono">
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
