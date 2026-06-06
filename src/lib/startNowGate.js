// Lead-capture gate for the "Start Now" SDK reveal.
//
// First visit  → visitor sees the HubSpot form before the install command.
// On submit    → we stamp localStorage with a 90-day TTL and remember the email.
// Subsequent visits within TTL → modal opens directly to install (no form),
//   AND we silently re-submit the email to HubSpot so the founder gets a
//   notification that the same person came back. Re-submission is throttled
//   to once per 24 hours per visitor to keep the inbox sane.
//
// 90 days mirrors the first-touch UTM TTL in src/lib/analytics.js — same
// retention horizon for "we know who this person is" signal.

const STORAGE_KEY = "traigent_start_now_unlocked";
const TTL_MS = 90 * 24 * 60 * 60 * 1000;
const REPEAT_NOTIFY_THROTTLE_MS = 24 * 60 * 60 * 1000;

function readEntry() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    // Backward compat: old format was a plain timestamp string.
    if (/^\d+$/.test(raw)) return { ts: Number(raw), email: "", lastNotifiedTs: 0 };
    const parsed = JSON.parse(raw);
    return {
      ts: Number(parsed.ts) || 0,
      email: typeof parsed.email === "string" ? parsed.email : "",
      lastNotifiedTs: Number(parsed.lastNotifiedTs) || 0,
    };
  } catch {
    return null;
  }
}

function writeEntry(entry) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
  } catch {
    // Private mode / quota — silent degrade.
  }
}

export function isUnlocked() {
  const entry = readEntry();
  if (!entry) return false;
  return Date.now() - entry.ts < TTL_MS;
}

export function markUnlocked(email = "") {
  writeEntry({ ts: Date.now(), email, lastNotifiedTs: Date.now() });
}

export function getUnlockedEmail() {
  return readEntry()?.email || "";
}

/**
 * Returns true at most once per 24h. Side effect: stamps the lastNotifiedTs
 * so the next call within the window returns false. Use this to gate the
 * silent re-submit so we don't spam HubSpot on every modal open.
 */
export function shouldNotifyRepeatVisit() {
  const entry = readEntry();
  if (!entry || !entry.email) return false;
  const now = Date.now();
  if (now - entry.lastNotifiedTs < REPEAT_NOTIFY_THROTTLE_MS) return false;
  writeEntry({ ...entry, lastNotifiedTs: now });
  return true;
}
