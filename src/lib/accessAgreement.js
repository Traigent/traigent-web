// Access & Evaluation Agreement acceptance state.
//
// Every IP-gated surface (Start Now / SDK, Portal, Academy) requires the
// visitor to accept the agreement at /access-agreement before entry — in
// addition to leaving a business email. Acceptance is versioned: bumping
// AGREEMENT_VERSION re-prompts every visitor on their next gate.
//
// Evidence trail: alongside this localStorage stamp, each acceptance fires a
// HubSpot form submission (see notifyAgreementAccepted in hubspotForms.js)
// whose pageName records the version + surface — a per-contact, timestamped
// acceptance record on the CRM side.

// 1.1 (2026-06-13): personal-capacity acceptance only (no binding the
// employer); use restricted to the signee alone on a personal computer
// under their sole control; no disclosure to anyone (employee/advisor
// exception removed). Version bump re-prompts all v1.0 acceptors.
// 1.2 (2026-06-13): SDK-specific terms — install/use on the signee's own
// PC only; no copying/installing/distributing the SDK (or derivatives) to
// other computers; reverse-engineering clause covers the SDK as provided;
// explicit PERMISSION to demonstrate the SDK and share Traigent's results/
// demos (not the SDK itself). Open-source carve-out reworded to dual-track.
export const AGREEMENT_VERSION = "1.2";
export const AGREEMENT_PATH = "/access-agreement";

const STORAGE_KEY = "traigent_access_agreement";

export function hasAcceptedCurrent() {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return parsed && parsed.version === AGREEMENT_VERSION;
  } catch {
    return false;
  }
}

export function markAccepted(email = "") {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: AGREEMENT_VERSION, email, ts: Date.now() }),
    );
  } catch {
    /* private mode — soft-degrade; the gate will just re-prompt */
  }
}
