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
// canvas frame used by /pitch-short-2 et al. No re-implementation in
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
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import BrandMark from "../components/BrandMark";
import { useKnownContactNotify } from "../lib/useKnownContactNotify";
import { notifyPitchDeckViewed } from "../lib/hubspotForms";
import { usePageView } from "../lib/usePageView";

const SLIDE_W = 1280;
const SLIDE_H = 720;
const VIEWPORT_MARGIN = 16;

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
      document
        .querySelectorAll(
          [
            "#hubspot-messages-iframe-container",
            "#hubspot-conversations-iframe",
            ".hs-shadow-container",
            "iframe[src*='conversations-visitor']",
          ].join(","),
        )
        .forEach((node) => node.remove());
    };
    removeChat();
    const observer = new MutationObserver(removeChat);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
}

function SlideCanvas({ slide, index, total, scale }) {
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
          className="relative bg-[#080808] text-white overflow-hidden border border-slate-600"
          style={{
            width: SLIDE_W,
            height: SLIDE_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {/* The slide IS the source PNG, full-bleed in the canvas. */}
          <img
            src={`${import.meta.env.BASE_URL}investor-deck/slides/${slide.file}`}
            alt={slide.title}
            width={SLIDE_W}
            height={SLIDE_H}
            loading={index < 2 ? "eager" : "lazy"}
            decoding="async"
            className="absolute inset-0 w-full h-full object-contain"
            draggable={false}
          />
          {/* Brand mark sits on top of the slide image, mirroring the
              treatment in /pitch-short-2 so the deck is recognisable. */}
          <a
            href="https://www.traigent.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-4 left-4 z-10 hover:opacity-80 transition-opacity"
            aria-label="Traigent.ai"
          >
            <BrandMark size="md" />
          </a>
          <span className="absolute bottom-3 right-4 text-slate-400 text-sm font-mono bg-black/40 px-2 py-0.5 rounded">
            {index + 1} / {total}
          </span>
        </div>
      </div>
    </section>
  );
}

export default function PitchInvestor() {
  usePageView();
  useKnownContactNotify({
    notify: notifyPitchDeckViewed,
    location: "pitch_investor",
    eventName: "pitch_deck_viewed_known",
    gateKey: "pitch_deck",
  });
  useRemoveChatWidget();
  const scale = useViewportScale();
  return (
    <>
      <Helmet>
        <title>Traigent — Investor presentation</title>
        <meta
          name="description"
          content="Traigent investor presentation — Trust your AI agent at scale. The Continuous Optimization Infrastructure for Enterprise GenAI."
        />
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
      `}</style>
      <div className="bg-[#080808] text-white">
        {INVESTOR_SLIDES.map((slide, i) => (
          <SlideCanvas
            key={slide.file}
            slide={slide}
            index={i}
            total={INVESTOR_SLIDES.length}
            scale={scale}
          />
        ))}
      </div>
    </>
  );
}
