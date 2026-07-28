// Client for the TraigentBackend lead funnel — the marketing-site front door
// into the backend lead capture + verification flow (Marketing front door
// unit A2). Modelled on src/lib/otpAccess.js.
//
// MERGED BACKEND CONTRACT (TraigentBackend develop):
//   POST /api/v1/leads        { email, website, elapsed_seconds }
//       -> 202 with { data: { run_id } } in the body, a BYTE-IDENTICAL shape
//          on every outcome (accepted / honeypot / too-fast). This is
//          anti-enumeration: the client can never tell whether a submission
//          was accepted or silently dropped, so we never branch on it — a
//          dropped submission simply never receives a code email. A 6-digit
//          code is emailed (the code is in the subject).
//   POST /api/v1/leads/verify { email, run_id, code }
//       -> on success the backend EMAILS a redeem link; it does NOT hand a
//          token to the browser. So the marketing site's job ends at
//          "verified": the user continues via the emailed portal link.
//
// Base URL comes from VITE_API_BASE_URL. Empty = funnel dormant (no relative
// POSTs to the marketing origin — the UI shows a "not available yet" message).
//
// ┌─ DEPLOY PREREQUISITES (config, not code — ALL THREE gate go-live) ───────┐
// │ 1. VITE_API_BASE_URL must point at the prod backend host that serves     │
// │    /api/v1/leads reachable from a browser. The host is env-configured on │
// │    the backend, not hardcoded — the owner / IaC knows the exact hostname │
// │    (likely portal.traigent.ai or an api.* host). DO NOT guess it here.   │
// │ 2. The backend's CORS_ORIGINS must include https://traigent.ai AND       │
// │    https://www.traigent.ai (a different origin from the portal FE) or    │
// │    the browser fetch is blocked. This is a backend / IaC config change.  │
// │ 3. index.html CSP connect-src must include that same backend host        │
// │    (replace the BACKEND-HOST-PLACEHOLDER token there).                   │
// └──────────────────────────────────────────────────────────────────────────┘

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

/** True once VITE_API_BASE_URL is configured; until then the funnel is dormant. */
export function isLeadFunnelEnabled() {
  return Boolean(API_BASE);
}

async function post(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "omit",
    referrerPolicy: "no-referrer",
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* non-JSON error body — fall through to generic error */
  }
  return { ok: res.ok, data: data || {} };
}

/**
 * Capture step. Sends the email plus two anti-bot signals:
 *   - website        a honeypot; a real human never fills it. The backend
 *                    silently drops a filled honeypot but still returns the
 *                    byte-identical 202, so we never branch on it client-side.
 *   - elapsedSeconds seconds from funnel mount to submit; implausibly fast
 *                    (bot) submits are likewise silently dropped.
 * Returns { ok, runId } on the 202, or { ok:false, error } on a network/HTTP
 * failure. Because the 202 shape is identical on every outcome, ok:true only
 * means "the backend accepted the request", never "a code was actually sent".
 */
export async function captureLead({ email, website, elapsedSeconds }) {
  try {
    const { ok, data } = await post("/api/v1/leads", {
      email,
      website,
      elapsed_seconds: elapsedSeconds,
    });
    if (!ok) return { ok: false, error: data.error || "send_failed" };
    return { ok: true, runId: (data.data && data.data.run_id) || "" };
  } catch {
    return { ok: false, error: "network" };
  }
}

/**
 * Verify step. Submits { email, run_id, code }. On success the backend emails
 * a redeem link — it does NOT return a token — so the caller's only job on
 * success is to tell the user to check their email for the portal link.
 * Returns { ok } on success or { ok:false, error, remaining? } otherwise.
 */
export async function verifyLead({ email, runId, code }) {
  try {
    const { ok, data } = await post("/api/v1/leads/verify", {
      email,
      run_id: runId,
      code,
    });
    if (!ok) {
      return { ok: false, error: data.error || "invalid_code", remaining: data.remaining };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "network" };
  }
}

/** Friendly copy for backend / network error codes. */
export function leadErrorMessage(error, remaining) {
  switch (error) {
    case "rate_limited":
      return "Too many requests — please try again in a little while.";
    case "invalid_code":
      return remaining > 0
        ? `That code didn't match — ${remaining} attempt${remaining === 1 ? "" : "s"} left.`
        : "That code didn't match.";
    case "too_many_attempts":
      return "Too many wrong attempts — request a fresh code.";
    case "expired":
      return "That code expired — request a fresh one.";
    case "send_failed":
    case "network":
    default:
      return "We couldn't reach the lead service. Please try again in a few minutes.";
  }
}
