// ChatKillerStyle — render this inside a page's JSX to suppress the HubSpot
// chat widget. Mirrors the inline-<style> pattern used by PitchShort2/3,
// which is the only one that actually persists (DOM-injected style tags get
// out-competed by HubSpot's re-injection cycle). Pair with useRemoveChatWidget
// for belt-and-braces coverage.
export default function ChatKillerStyle() {
  return (
    <style>{`
      #hubspot-messages-iframe-container,
      #hubspot-conversations-iframe,
      .hs-shadow-container,
      .hs-banner-iframe,
      #hs-eu-cookie-confirmation,
      #hs-eu-cookie-confirmation-inner,
      iframe[src*="conversations-visitor"],
      iframe[src*="hubspot.com"],
      iframe[src*="usemessages.com"],
      iframe[src*="hs-banner"],
      [id*="hubspot-messages"],
      [id*="hubspot-conversations"],
      [class*="hs-shadow"] {
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
    `}</style>
  );
}
