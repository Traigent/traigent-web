// /pitch-short-2 - same slides as /pitch-short, but rendered as a vertical
// scrollable page. Each slide is a fixed 1280x720 canvas scaled down to fit
// the viewport, which keeps it readable on iPhone landscape without clipping.
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { SHORT_SLIDES } from "./PitchShort";
import { OnePager2Slide } from "./OnePager2";
import BrandMark from "../components/BrandMark";

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

export default function PitchShort2() {
  const scale = useViewportScale();
  useRemoveChatWidget();

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
        {SCROLL_SLIDES.map((slide, i) => (
          <SlideCanvas
            key={`${i}-${slide.title}`}
            slide={slide}
            index={i}
            total={SCROLL_SLIDES.length}
            scale={scale}
          />
        ))}
      </div>
    </>
  );
}
