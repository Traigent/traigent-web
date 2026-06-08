// Shared chrome for the vertical-scroll, fixed-1280x720-canvas deck format.
// Used by /pitch-short-2 et al. and by /investor-pitch.
// Centralising this means viewport scaling, HubSpot widget hiding, and the
// outer canvas frame (border, brand mark, slide counter) stay consistent
// across decks and avoid SonarCloud code-duplication warnings.
import { useEffect, useState } from "react";
import BrandMark from "../../components/BrandMark";

export const SLIDE_W = 1280;
export const SLIDE_H = 720;
export const VIEWPORT_MARGIN = 16;

export function getScrollDeckScale() {
  if (typeof window === "undefined") return 1;
  const availableW = Math.max(320, window.innerWidth - VIEWPORT_MARGIN);
  const availableH = Math.max(240, window.innerHeight - VIEWPORT_MARGIN);
  return Math.min(1, availableW / SLIDE_W, availableH / SLIDE_H);
}

export function useScrollDeckScale() {
  const [scale, setScale] = useState(getScrollDeckScale);
  useEffect(() => {
    const update = () => setScale(getScrollDeckScale());
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);
  return scale;
}

export function useRemoveHubSpotChatWidget() {
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

// Global CSS rules every scroll-mode deck needs — hide HubSpot widgets +
// cookie banner so they don't cover the slide canvas, and make `100svh`
// reliable on iOS.
export const SCROLL_DECK_GLOBAL_CSS = `
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
`;

// Outer 1280x720 canvas frame: scaled wrapper, dark background, border, the
// Traigent brand mark in the top-left, and the slide counter in the bottom
// right. The actual slide content goes in `children`. `extraSlideClassName`
// lets a deck add extra classes to the inner slide element (used by
// /pitch-short-2 for the one-pager grid override).
export function ScrollCanvasFrame({
  index,
  total,
  scale,
  children,
  extraSlideClassName = "",
}) {
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
          className={`relative bg-[#080808] text-white overflow-hidden border border-slate-600 ${extraSlideClassName}`}
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

          {children}

          <span className="absolute bottom-3 right-4 text-slate-500 text-sm font-mono">
            {index + 1} / {total}
          </span>
        </div>
      </div>
    </section>
  );
}
