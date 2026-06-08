const CONSENT_KEY = 'traigent_marketing_consent';
export const CONSENT_POLICY_REV = '2026-06-06 rev. 4';
const listeners = new Set();

// Window CustomEvent name dispatched when any UI surface wants the cookie
// banner re-opened (e.g. a "Cookies required" block on a gated form whose
// visitor previously chose Reject and now wants to revisit that choice).
// CookieConsent.jsx listens for it.
export const OPEN_BANNER_EVENT = 'traigent:open-cookie-banner';

export function getConsentRecord() {
  if (typeof window === 'undefined') return null;
  let stored;
  try {
    stored = localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
  if (!stored) return null;
  if (stored === 'true') return { granted: true, ts: null, policyRev: null };
  if (stored === 'false') return { granted: false, ts: null, policyRev: null };
  try {
    const parsed = JSON.parse(stored);
    if (typeof parsed?.granted !== 'boolean') return null;
    return {
      granted: parsed.granted,
      ts: typeof parsed.ts === 'string' ? parsed.ts : null,
      policyRev: typeof parsed.policyRev === 'string' ? parsed.policyRev : null,
    };
  } catch {
    return null;
  }
}

export function hasMarketingConsent() {
  return getConsentRecord()?.granted === true;
}

// True only when the visitor explicitly chose Reject. Distinct from "no
// decision yet" — undecided returns false here so the cookie banner (not
// the rejection-block UI) is what they see first.
export function hasRejectedConsent() {
  return getConsentRecord()?.granted === false;
}

// Re-open the cookie banner from anywhere (e.g. the "Review cookie
// preferences" button on a gated-form rejection block). CookieConsent.jsx
// subscribes to OPEN_BANNER_EVENT and flips its banner state on.
export function openCookieBanner() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(OPEN_BANNER_EVENT));
}

export function setConsent(granted) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      CONSENT_KEY,
      JSON.stringify({
        granted: Boolean(granted),
        ts: new Date().toISOString(),
        policyRev: CONSENT_POLICY_REV,
      })
    );
  } catch {
    /* privacy mode / storage disabled — consent remains session-only */
  }
  listeners.forEach(listener => listener(granted));
}

export function subscribeConsent(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
