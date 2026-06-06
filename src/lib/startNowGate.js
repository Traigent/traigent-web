// Lead-capture gate for the "Start Now" SDK reveal.
//
// First visit  → visitor sees the HubSpot form before the install command.
// On submit    → we stamp localStorage with a 90-day TTL.
// Subsequent visits within TTL → modal opens directly to install (no form).
//
// 90 days mirrors the first-touch UTM TTL in src/lib/analytics.js — same
// retention horizon for "we know who this person is" signal.

const STORAGE_KEY = "traigent_start_now_unlocked";
const TTL_MS = 90 * 24 * 60 * 60 * 1000;

export function isUnlocked() {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const stamp = Number(raw);
    if (!Number.isFinite(stamp)) return false;
    return Date.now() - stamp < TTL_MS;
  } catch {
    return false;
  }
}

export function markUnlocked() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    // Private mode / quota — visitor will just see the form again next time.
  }
}
