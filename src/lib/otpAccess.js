// Client for the access-OTP Worker (workers/access-otp) — email verification
// for the Start Now gate.
//
// Feature switch: the whole flow is dormant until VITE_OTP_WORKER_URL is set
// in .env.local and the site rebuilt. While dormant, gates use the legacy
// email-form flow and this module is never consulted.
//
// The "verified" stamp is deliberately SEPARATE from (and stronger than) the
// shared startNowGate unlock: a visitor who left their email at the knob
// explorer, or whom HubSpot recognizes, still does the one-time code check
// the first time they hit Start Now. Recognition says who they claim to be;
// the code proves they control the mailbox. The stamp is per-browser, so
// every device that ever reaches the SDK has its own server-side receipt.

import { AGREEMENT_VERSION } from "./accessAgreement";

const WORKER_URL = (import.meta.env.VITE_OTP_WORKER_URL || "").replace(/\/+$/, "");
const VERIFIED_KEY = "traigent_verified_access";
const TTL_MS = 90 * 24 * 60 * 60 * 1000; // mirrors startNowGate's horizon

export function isOtpEnabled() {
  return Boolean(WORKER_URL);
}

function readStamp() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(VERIFIED_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Verified = code entered on THIS browser, within TTL, for the CURRENT
 * agreement version. A version bump therefore re-runs the full email+code
 * flow — each new acceptance gets its own fresh server-side receipt.
 */
export function isVerified() {
  const stamp = readStamp();
  if (!stamp) return false;
  if (Date.now() - (Number(stamp.ts) || 0) > TTL_MS) return false;
  return stamp.version === AGREEMENT_VERSION;
}

export function getVerifiedEmail() {
  const stamp = readStamp();
  return stamp && typeof stamp.email === "string" ? stamp.email : "";
}

function markVerified(email, receiptId) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      VERIFIED_KEY,
      JSON.stringify({ email, receiptId, version: AGREEMENT_VERSION, ts: Date.now() }),
    );
  } catch {
    /* private mode — the worst case is a re-verify next visit */
  }
}

async function post(path, body) {
  const res = await fetch(`${WORKER_URL}${path}`, {
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

/** Ask the Worker to email a 6-digit code. Returns { ok, error? }. */
export async function requestCode(email) {
  try {
    const { ok, data } = await post("/otp/start", { email });
    return ok ? { ok: true } : { ok: false, error: data.error || "send_failed" };
  } catch {
    return { ok: false, error: "network" };
  }
}

/**
 * Verify the code. On success the Worker has already written the permanent
 * acceptance receipt; we stamp this browser and return the receiptId.
 */
export async function verifyCode({ email, code, surface }) {
  try {
    const { ok, data } = await post("/otp/verify", {
      email,
      code,
      agreementVersion: AGREEMENT_VERSION,
      surface,
    });
    if (!ok) return { ok: false, error: data.error || "invalid_code", remaining: data.remaining };
    markVerified(email, data.receiptId || "");
    return { ok: true, receiptId: data.receiptId || "" };
  } catch {
    return { ok: false, error: "network" };
  }
}

/** Friendly copy for Worker / network error codes. */
export function otpErrorMessage(error, remaining) {
  switch (error) {
    case "business_email_required":
      return "Please use your work email — personal email domains aren't accepted.";
    case "rate_limited":
      return "Too many code requests — please try again in an hour.";
    case "invalid_code":
      return remaining > 0
        ? `That code didn't match — ${remaining} attempt${remaining === 1 ? "" : "s"} left.`
        : "That code didn't match.";
    case "too_many_attempts":
      return "Too many wrong attempts — request a fresh code.";
    case "expired":
      return "That code expired — request a fresh one.";
    case "otp_unavailable":
    case "send_failed":
    case "network":
    default:
      return "We couldn't reach the verification service. Please try again in a few minutes.";
  }
}
