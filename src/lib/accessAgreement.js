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

export const AGREEMENT_VERSION = "1.0";
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
