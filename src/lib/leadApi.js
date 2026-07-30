// Client for the TraigentBackend lead funnel — the marketing-site front door
// into the backend lead capture + verification flow (Marketing front door
// unit A2). Modelled on src/lib/otpAccess.js.
//
// MERGED BACKEND CONTRACT (TraigentBackend, src/routes/lead_routes.py):
//   POST /api/v1/leads        { email, website, elapsed_seconds }
//       -> 202 with { data: { accepted, run_id, resend_after_seconds } }, a
//          BYTE-IDENTICAL shape on every outcome (accepted / honeypot /
//          too-fast / ineligible / suppressed / throttled — lead_routes.py:174).
//          This is anti-enumeration: the client can never tell whether a
//          submission was accepted or silently dropped, so we never branch on
//          it — a dropped submission simply never receives a code email. A
//          6-digit CONFIRMATION CODE is emailed (it is in the subject line).
//   POST /api/v1/leads/verify { email, run_id, code }
//       -> 200 with { data: { run_id, expires_at, email_sent } }. On success the
//          backend EMAILS a single-use ACCESS CODE — it deliberately never
//          returns the credential to the browser (lead_routes.py:91-98,:469-483).
//          So the marketing site's job ends at "verified": the user continues by
//          typing that access code on the portal's registration page.
//
// ERROR ENVELOPE. Both routes answer failures through
// ``src/utils/response_handler.error_response``, which emits
//   { success: false, message, error, error_code }
// where BOTH ``message`` and ``error`` are human sentences and ``error_code`` is
// the only machine-readable token. Two properties make ``error_code`` the ONLY
// field worth branching on:
//   * ``error``/``message`` are prose and are not part of any contract;
//   * every 5xx is masked (response_handler.py:124-131 + :477-496) — the wire
//     body for a 500/503 from these routes is literally
//     { message: "Internal server error", error: "Internal server error",
//       error_code: "<the real code, preserved>" }.
//     So the human strings CANNOT be used as display copy on the failure paths
//     that matter most, while ``error_code`` survives intact.
// The one exception is the shared auth limiter (auth_routes.py:944-966), reached
// via ``check_rate_limit_and_respond`` at lead_routes.py:298 and :408. It answers
// 429 (or 503 when failing closed) with a THIRD shape —
//   { success: false, error, rate_limit: {...} }  — no ``message``, no
// ``error_code`` — so that one is normalized from the HTTP status instead.
//
// Base URL comes from VITE_API_BASE_URL. Empty = funnel dormant (no relative
// POSTs to the marketing origin — the UI shows a "not available yet" message).
//
// ┌─ DEPLOY PREREQUISITES (ALL FOUR gate go-live) ───────────────────────────┐
// │ 1. The backend must run with ENABLE_LEAD_ACCESS_ONBOARDING=true. It      │
// │    defaults to FALSE (config.py:807-808) and both routes answer a plain  │
// │    404 while it is off (lead_routes.py:266-267, :389-390), so without it │
// │    every request fails no matter how the client is configured.           │
// │ 2. VITE_API_BASE_URL must point at the prod backend host that serves     │
// │    /api/v1/leads reachable from a browser. The host is env-configured on │
// │    the backend, not hardcoded — the owner / IaC knows the exact hostname │
// │    (likely portal.traigent.ai or an api.* host). DO NOT guess it here.   │
// │    Vite inlines VITE_* at BUILD time, so it must be set for the build    │
// │    that produces the deployed bundle — see the `Build` step's env block  │
// │    in .github/workflows/deploy-gh-pages.yml, not just a runtime setting. │
// │ 3. The backend's CORS_ORIGINS must include https://traigent.ai AND       │
// │    https://www.traigent.ai (a different origin from the portal FE) or    │
// │    the browser fetch is blocked. This is a backend / IaC config change   │
// │    and cannot be confirmed from anything checked into this repo.         │
// │ 4. index.html's Content-Security-Policy is a COMMITTED <meta> tag with a │
// │    static connect-src allowlist. The backend origin from (2) must be     │
// │    added to that list in index.html and committed, or the browser blocks │
// │    the fetch before it is made. There is no placeholder to swap — you    │
// │    are editing a real, live allowlist.                                   │
// └──────────────────────────────────────────────────────────────────────────┘

// Trim trailing slashes without a regex (avoids a super-linear backtracking
// smell): VITE_API_BASE_URL is joined with absolute "/api/..." paths, so a
// trailing slash would double it.
function stripTrailingSlashes(url) {
  let base = url;
  while (base.endsWith("/")) base = base.slice(0, -1);
  return base;
}

const API_BASE = stripTrailingSlashes(import.meta.env.VITE_API_BASE_URL || "");

/** True once VITE_API_BASE_URL is configured; until then the funnel is dormant. */
export function isLeadFunnelEnabled() {
  return Boolean(API_BASE);
}

// Client-side outcomes that never came from the backend. Namespaced apart from
// the backend's SCREAMING_SNAKE tokens on purpose: nothing here may be mistaken
// for a value lead_routes.py can emit.
export const CLIENT_ERROR_NETWORK = "CLIENT_NETWORK_ERROR";
export const CLIENT_ERROR_DISABLED = "CLIENT_FUNNEL_DISABLED";
export const CLIENT_ERROR_HTTP = "CLIENT_HTTP_ERROR";

/**
 * Resolve the machine-readable token for a failed response.
 *
 * Prefers the envelope's ``error_code``. Falls back to the HTTP status for the
 * shared auth limiter (auth_routes.py:944-966), which is the one failure shape
 * on these routes that carries no ``error_code`` at all: it answers 429 for an
 * ordinary rate limit and 503 when the limiter fails closed — exactly the two
 * conditions lead_routes.py names LEAD_RATE_LIMITED (:229) and
 * LEAD_RATE_LIMIT_UNAVAILABLE (:217), so they map onto the same two tokens and
 * the same two lines of copy rather than onto invented ones.
 */
function resolveErrorCode(status, data) {
  const code = data?.error_code;
  if (typeof code === "string" && code) return code;
  if (status === 429) return "LEAD_RATE_LIMITED";
  if (status === 503) return "LEAD_RATE_LIMIT_UNAVAILABLE";
  if (status === 404) return "NOT_FOUND";
  return CLIENT_ERROR_HTTP;
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
  return { ok: res.ok, status: res.status, data: data || {} };
}

/** Coerce a server-supplied seconds hint to a usable positive integer. */
function positiveSeconds(value) {
  const seconds = Number(value);
  if (!Number.isFinite(seconds) || seconds <= 0) return 0;
  return Math.ceil(seconds);
}

/**
 * Capture step. Sends the email plus two anti-bot signals:
 *   - website        a honeypot; a real human never fills it. The backend
 *                    silently drops a filled honeypot but still returns the
 *                    byte-identical 202, so we never branch on it client-side.
 *   - elapsedSeconds seconds from funnel mount to submit; implausibly fast
 *                    (bot) submits are likewise silently dropped.
 * Returns { ok, runId, resendAfterSeconds } on the 202, or { ok:false, errorCode }
 * on a failure. Because the 202 shape is identical on every outcome, ok:true only
 * means "the backend accepted the request", never "a code was actually sent".
 */
export async function captureLead({ email, website, elapsedSeconds }) {
  // Enforce the dormant guard at the API layer, not only at the render layer,
  // so no caller can accidentally issue a same-origin relative POST to the
  // marketing origin when VITE_API_BASE_URL is unset (defense in depth).
  if (!isLeadFunnelEnabled()) return { ok: false, errorCode: CLIENT_ERROR_DISABLED };
  try {
    const { ok, status, data } = await post("/api/v1/leads", {
      email,
      website,
      elapsed_seconds: elapsedSeconds,
    });
    if (!ok) return { ok: false, errorCode: resolveErrorCode(status, data) };
    return {
      ok: true,
      runId: data.data?.run_id || "",
      // Advisory resend cooldown, stated by the server on every capture 202
      // (lead_routes.py:100-106, :174-192). 0 means "not supplied" — the caller
      // applies its own default.
      resendAfterSeconds: positiveSeconds(data.data?.resend_after_seconds),
    };
  } catch {
    return { ok: false, errorCode: CLIENT_ERROR_NETWORK };
  }
}

/**
 * Verify step. Submits { email, run_id, code }. On success the backend emails a
 * single-use access code — it never returns the credential to the browser
 * (lead_routes.py:91-98) — so the caller's only job on success is to point the
 * user at their inbox and at the portal's registration page.
 *
 * Returns { ok, expiresAt } on success or { ok:false, errorCode } otherwise.
 * ``expiresAt`` is the ISO-8601 UTC instant the emailed access code stops
 * working (lead_routes.py:477); it is a timestamp, not a credential.
 */
export async function verifyLead({ email, runId, code }) {
  if (!isLeadFunnelEnabled()) return { ok: false, errorCode: CLIENT_ERROR_DISABLED };
  try {
    const { ok, status, data } = await post("/api/v1/leads/verify", {
      email,
      run_id: runId,
      code,
    });
    if (!ok) return { ok: false, errorCode: resolveErrorCode(status, data) };
    return { ok: true, expiresAt: data.data?.expires_at || "" };
  } catch {
    return { ok: false, errorCode: CLIENT_ERROR_NETWORK };
  }
}

const GENERIC_RETRY = "Something went wrong on our side. Please try again in a minute.";
const GENERIC_UNREACHABLE = "We couldn't reach the lead service. Please try again in a few minutes.";
const NOT_AVAILABLE = "Self-serve signup isn't switched on yet. Book a demo and we'll set you up.";

/**
 * Friendly copy for a token returned by captureLead / verifyLead.
 *
 * Every backend case below is a token lead_routes.py actually emits; the three
 * CLIENT_* cases never touched the network contract. The server's own ``error``
 * / ``message`` strings are deliberately NOT displayed: on all four 5xx paths
 * they are masked to "Internal server error" before they leave the backend
 * (response_handler.py:124-131), so they are useless exactly where copy matters
 * most, and on the remaining paths they are backend prose rather than
 * marketing-site voice.
 */
export function leadErrorMessage(errorCode) {
  switch (errorCode) {
    // 400, lead_routes.py:152-171. Wrong code, expired challenge, exhausted
    // attempts, unknown row and wrong run_id all collapse into this ONE token by
    // design (anti-enumeration), so the client cannot tell them apart either —
    // hence one message that names the recovery both share.
    case "LEAD_CODE_INVALID":
      return "That code didn't work. If it may have expired, request a new code and try again.";
    // 400, lead_routes.py:273 / :396 — marshmallow rejected the payload.
    case "VALIDATION_ERROR":
      return "Please check the details you entered and try again.";
    // 429, lead_routes.py:223-232 (and the shared limiter's code-less 429).
    case "LEAD_RATE_LIMITED":
      return "Too many attempts — please wait a little while and try again.";
    // 503, lead_routes.py:212-220 (and the shared limiter's fail-closed 503).
    case "LEAD_RATE_LIMIT_UNAVAILABLE":
      return "Signup is temporarily unavailable. Please try again in a minute.";
    // 503, lead_routes.py:364-376 (capture) and :448-467 (verify). The email is
    // the only channel for the code, so retrying is the genuine recovery: a
    // fresh attempt rotates the code and resends it.
    case "LEAD_CODE_DELIVERY_FAILED":
      return "We couldn't send that email just now. Please try again in a minute.";
    // 500, lead_routes.py:324-329 / :337-342 and :431-436 — masked server-side.
    case "LEAD_CAPTURE_FAILED":
    case "LEAD_VERIFY_FAILED":
      return GENERIC_RETRY;
    // 404, lead_routes.py:147-149 — ENABLE_LEAD_ACCESS_ONBOARDING is off, so the
    // routes do not exist. Same user-facing situation as the client-side dormant
    // guard, from the other end of the wire.
    case "NOT_FOUND":
    case CLIENT_ERROR_DISABLED:
      return NOT_AVAILABLE;
    case CLIENT_ERROR_NETWORK:
    case CLIENT_ERROR_HTTP:
    default:
      return GENERIC_UNREACHABLE;
  }
}
