// ===================================================================
// Single source of truth for the PUBLIC HubSpot portal ID + region.
//
// The portal ID ships in HubSpot's public embed snippet, so the literal
// below is a safe fallback default (not a secret). Setting
// VITE_HUBSPOT_PORTAL_ID / VITE_HUBSPOT_REGION now flips EVERY HubSpot
// path together — analytics tracking (src/lib/analytics.js reads the same
// VITE_* vars) and every lead-capture form path (hubspotForms.js,
// HubSpotStartNowForm.jsx, ContactSection.jsx import from here).
//
// Previously each form path redeclared the "148486827" / "eu1" literals,
// so an env-var change silently updated analytics but not lead capture.
// ===================================================================

export const HUBSPOT_PORTAL_ID =
  import.meta.env.VITE_HUBSPOT_PORTAL_ID || "148486827";

export const HUBSPOT_REGION =
  import.meta.env.VITE_HUBSPOT_REGION || "eu1";

// HubSpot's embed v2 script host is region-scoped (js-eu1.hsforms.net, …).
export const HUBSPOT_EMBED_SCRIPT_SRC = `https://js-${HUBSPOT_REGION}.hsforms.net/forms/embed/v2.js`;
