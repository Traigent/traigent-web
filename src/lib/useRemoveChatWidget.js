// useRemoveChatWidget — kill the HubSpot chat widget on pages where it's
// distracting (slide decks, demo pages, embedded recordings). Combines three
// strategies so the widget never appears, even momentarily:
//
//   (1) Inject aggressive CSS up front so anything HubSpot-shaped is hidden
//       before the React tree even paints (no flash).
//   (2) Call HubSpotConversations.widget.remove() if the API is available.
//   (3) Install a MutationObserver that nukes any matching node HubSpot re-
//       injects later (it tries multiple times during page lifetime).
import { useEffect } from "react";

const CHAT_SELECTORS = [
  "#hubspot-messages-iframe-container",
  "#hubspot-conversations-iframe",
  ".hs-shadow-container",
  "iframe[src*='conversations-visitor']",
  "iframe[src*='hubspot.com']",
  "iframe[src*='usemessages.com']",
  "iframe[src*='hs-banner']",
  ".hs-banner-iframe",
  "#hs-eu-cookie-confirmation",
  "#hs-eu-cookie-confirmation-inner",
  "[id*='hubspot-messages']",
  "[id*='hubspot-conversations']",
  "[class*='hs-shadow']",
];

const HIDE_CSS = `
  ${CHAT_SELECTORS.join(",\n  ")} {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
    width: 0 !important;
    height: 0 !important;
    position: absolute !important;
    left: -99999px !important;
    top: -99999px !important;
  }
`;

export function useRemoveChatWidget() {
  useEffect(() => {
    // (1) Inject the always-hidden CSS first so any widget that appears in
    //     the next browser paint is invisible.
    const style = document.createElement("style");
    style.setAttribute("data-traigent-chat-killer", "1");
    style.textContent = HIDE_CSS;
    document.head.appendChild(style);

    const removeChat = () => {
      try {
        window.HubSpotConversations?.widget?.remove?.();
      } catch {
        /* widget API not loaded yet — ignore */
      }
      document.querySelectorAll(CHAT_SELECTORS.join(",")).forEach((node) => node.remove());
    };

    // (2) Remove anything already there.
    removeChat();

    // (3) Observer for late injections.
    const observer = new MutationObserver(removeChat);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      style.remove();
    };
  }, []);
}
