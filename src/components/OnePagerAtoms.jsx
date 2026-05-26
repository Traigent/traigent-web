// Shared atoms for the outreach one-pager routes (/one-pager and /one-pager-2).
// Centralized here so each variant's page module doesn't duplicate the same
// constants and badge components.

export const BLUE = "#1A6BF5";
export const BLUE_LIGHT = "#4D8EF8";
export const AMBER = "#f59e0b";
export const RED = "#f87171";
export const SITE = "https://www.traigent.ai";

export const LOGO_SRC =
  "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/057ce2_TraigentLogoWhiteCropped.png";

// A/C badges — used inline in prose and in panel headers. Same visual language
// throughout the one-pager artifacts.
export function ATag() {
  return (
    <span
      className="inline-block text-[10px] font-mono font-bold px-1.5 py-0.5 rounded align-middle"
      style={{ color: BLUE_LIGHT, backgroundColor: `${BLUE}22`, border: `1px solid ${BLUE}55` }}
      title="Affects Accuracy"
    >
      A
    </span>
  );
}

export function CTag() {
  return (
    <span
      className="inline-block text-[10px] font-mono font-bold px-1.5 py-0.5 rounded align-middle"
      style={{ color: AMBER, backgroundColor: `${AMBER}22`, border: `1px solid ${AMBER}55` }}
      title="Affects Cost"
    >
      C
    </span>
  );
}

export function ACTag() {
  return (
    <span className="inline-flex items-center gap-1.5">
      <ATag />
      <CTag />
    </span>
  );
}

// Print/chat CSS injected on /one-pager and /one-pager-2. Suppresses the
// HubSpot chat widget (outreach artifact — no chat needed) and forces A4
// landscape with zero margins for clean PDF export.
export const ONEPAGER_STYLE = `
  #hubspot-messages-iframe-container,
  .hs-messages-mobile,
  .hs-banner-iframe,
  #hs-eu-cookie-confirmation,
  #hs-eu-cookie-confirmation-inner { display: none !important; visibility: hidden !important; }
  @media print {
    @page { size: 13.333in 7.5in; margin: 0; }
    html, body { background: #080808; margin: 0; padding: 0; }
  }
`;
