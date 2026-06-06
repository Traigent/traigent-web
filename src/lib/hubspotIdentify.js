// Client-side check: is the current visitor already a known HubSpot
// contact? Calls the traigent-hsutk-check Cloudflare Worker which proxies
// HubSpot's Contacts API.
//
// Returns:
//   { known: true,  email: "..." }   when matched
//   { known: false }                 when no match
//   null                             when the check is unconfigured,
//                                    times out, or errors — caller should
//                                    fall back to showing the gate
//
// The result is cached in localStorage for 1 hour so we don't hit the
// Worker on every page load. A change in identity is rare; an hour stale
// is fine.

const CHECK_URL = import.meta.env.VITE_HSUTK_CHECK_URL || "";
const CACHE_KEY = "traigent_hsutk_check";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const REQUEST_TIMEOUT_MS = 1500;

function readHubSpotCookie() {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

function readCache(utk) {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.utk !== utk) return null;
    if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
    return parsed.result;
  } catch {
    return null;
  }
}

function writeCache(utk, result) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ utk, ts: Date.now(), result })
    );
  } catch {
    /* private mode / quota — silent */
  }
}

/**
 * Race the Worker call against a short timeout so the gate doesn't sit
 * spinning if the network is slow. Caller treats `null` as "couldn't
 * decide — show the form".
 */
export async function checkKnownContact() {
  if (!CHECK_URL) return null;
  const utk = readHubSpotCookie();
  if (!utk) return { known: false };

  const cached = readCache(utk);
  if (cached) return cached;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    const res = await fetch(
      `${CHECK_URL}/check?utk=${encodeURIComponent(utk)}`,
      { signal: controller.signal }
    );
    clearTimeout(timer);

    if (!res.ok) return null;
    const result = await res.json();
    // Shape guard — the Worker is supposed to return { known: boolean,
    // email?: string }. Anything else, treat as no answer.
    if (typeof result?.known !== "boolean") return null;

    writeCache(utk, result);
    return result;
  } catch {
    return null;
  }
}
