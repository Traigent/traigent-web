const CONSENT_KEY = 'traigent_marketing_consent';
export const CONSENT_POLICY_REV = '2026-06-06 rev. 4';
const listeners = new Set();

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
