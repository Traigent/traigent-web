const CONSENT_KEY = 'traigent_marketing_consent';
const listeners = new Set();

export function hasMarketingConsent() {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem(CONSENT_KEY);
  return stored === 'true';
}

export function setConsent(granted) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONSENT_KEY, granted ? 'true' : 'false');
  listeners.forEach(listener => listener(granted));
}

export function subscribeConsent(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
