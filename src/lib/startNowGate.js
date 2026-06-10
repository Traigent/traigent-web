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
// One notification per visitor per surface per 24h. Prevents tab-discard
// reloads, link-preview bots, and multi-device visits from spamming the
// founder's inbox with repeat-visit submissions.
const REPEAT_NOTIFY_THROTTLE_MS = 24 * 60 * 60 * 1000;

function readEntry() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    // Backward compat: old format was a plain timestamp string.
    if (/^\d+$/.test(raw)) return { ts: Number(raw), email: "", lastNotifiedTs: 0, lastNotifiedByGate: {} };
    const parsed = JSON.parse(raw);
    return {
      ts: Number(parsed.ts) || 0,
      email: typeof parsed.email === "string" ? parsed.email : "",
      // Legacy single-field throttle from the early per-visitor (not per-gate) design.
      lastNotifiedTs: Number(parsed.lastNotifiedTs) || 0,
      // New per-gate throttle map: { startnow: ts, portal: ts, pricing: ts, ... }
      // so a Portal visit doesn't throttle a Start Now visit and vice versa.
      lastNotifiedByGate:
        parsed.lastNotifiedByGate && typeof parsed.lastNotifiedByGate === "object"
          ? parsed.lastNotifiedByGate
          : {},
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
  const prev = readEntry() || {};
  writeEntry({
    ts: Date.now(),
    email,
    lastNotifiedTs: Date.now(),
    // Preserve any prior per-gate stamps so a re-submit doesn't reset
    // throttles on other gates the visitor hit recently.
    lastNotifiedByGate: prev.lastNotifiedByGate || {},
  });
}

export function getUnlockedEmail() {
  return readEntry()?.email || "";
}

/**
 * Per-gate throttle. Returns true at most once per hour PER gateKey, so a
 * Portal visit doesn't block a subsequent Start Now / Pricing / Story
 * notification (and vice versa). Stamps lastNotifiedByGate[gateKey] on success.
 *
 *   shouldNotifyForGate("portal")    // → true (first call this hour)
 *   shouldNotifyForGate("startnow")  // → true (independent of portal)
 *   shouldNotifyForGate("portal")    // → false (within the portal throttle)
 */
export function shouldNotifyForGate(gateKey, throttleMs = REPEAT_NOTIFY_THROTTLE_MS) {
  if (!gateKey) return false;
  const entry = readEntry();
  if (!entry || !entry.email) return false;
  const now = Date.now();
  const stamps = entry.lastNotifiedByGate || {};
  const lastTs = Number(stamps[gateKey]) || 0;
  if (now - lastTs < throttleMs) return false;
  writeEntry({
    ...entry,
    lastNotifiedByGate: { ...stamps, [gateKey]: now },
  });
  return true;
}

/**
 * Legacy alias kept for any caller that hasn't been migrated to the
 * per-gate API. New code should use `shouldNotifyForGate(gateKey)`.
 */
export function shouldNotifyRepeatVisit() {
  return shouldNotifyForGate("legacy");
}
