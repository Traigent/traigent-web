import { useEffect, useState } from "react";
import { trackEvent } from "../../lib/analytics";
import { checkKnownContact } from "../../lib/hubspotIdentify";
import ConsentGate from "../ConsentGate";
import ConsentCheckbox from "../ConsentCheckbox";
import AgreementCheckbox from "../AgreementCheckbox";
import AgreementGate from "../AgreementGate";
import { hasAcceptedCurrent, markAccepted, AGREEMENT_VERSION } from "../../lib/accessAgreement";

// One notification per visitor per course per 24h. Matches the global
// gate's throttle window so the inbox volume stays sane in prod.
const REPEAT_NOTIFY_THROTTLE_MS = 24 * 60 * 60 * 1000;

// Configuration read at build time. The Forms API is CORS-enabled and our
// CSP already allows api.hsforms.com via the *.hsforms.com entry.
const HUBSPOT_PORTAL_ID = import.meta.env.VITE_HUBSPOT_PORTAL_ID;
const ACADEMY_FORM_ID = import.meta.env.VITE_HUBSPOT_ACADEMY_FORM_ID;

// LocalStorage key — namespaced per course so different academy modules each
// gate independently. Value is JSON { email, ts, lastNotifiedTs }.
function storageKey(courseSlug) {
  return `traigent_academy_unlock:${courseSlug}`;
}

function readUnlockEntry(courseSlug) {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey(courseSlug));
    if (!raw) return null;
    // Backward compat: old format was the raw email string (or "1").
    if (!raw.startsWith("{")) {
      return { email: raw === "1" ? "" : raw, ts: 0, lastNotifiedTs: 0 };
    }
    const parsed = JSON.parse(raw);
    return {
      email: typeof parsed.email === "string" ? parsed.email : "",
      ts: Number(parsed.ts) || 0,
      lastNotifiedTs: Number(parsed.lastNotifiedTs) || 0,
    };
  } catch {
    return null;
  }
}

function writeUnlockEntry(courseSlug, entry) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey(courseSlug), JSON.stringify(entry));
  } catch {
    /* private mode — soft-degrade */
  }
}

// hubspotutk cookie is set by the HubSpot tracking script (loaded site-wide
// via src/lib/analytics.js). Forwarding it on submission lets HubSpot stitch
// this academy signup to the visitor's prior pageview history on the same
// contact record.
function readHubSpotCookie() {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

// Thrown when HubSpot rejects the email because the form has a "blocked free
// email domains" rule turned on (the "business emails only" setting). The
// component shows a specific "use your business email" message in this case.
class BusinessEmailRequiredError extends Error {
  constructor(message) {
    super(message);
    this.name = "BusinessEmailRequiredError";
  }
}

async function submitToHubSpot({ email, courseTitle, formId }) {
  // Forms API — public, CORS-enabled, accepts direct browser POSTs. Submission
  // creates/updates the contact in HubSpot and triggers any workflow attached
  // to the form (where the welcome email is sent).
  const url = `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${formId}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      submittedAt: Date.now(),
      fields: [{ objectTypeId: "0-1", name: "email", value: email }],
      context: {
        hutk: readHubSpotCookie(),
        pageUri: window.location.href,
        pageName: `Traigent Academy — ${courseTitle}`,
      },
    }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    if (isBlockedEmailDomainError(res.status, body)) {
      throw new BusinessEmailRequiredError("blocked email domain");
    }
    const text = body ? JSON.stringify(body) : await res.text().catch(() => "");
    throw new Error(`HubSpot ${res.status}: ${text || res.statusText}`);
  }
}

// HubSpot returns 400 + an errors[] entry whose errorType / message references
// a blocked domain when the form's "block free email providers" rule rejects
// the submission. Matching on either signal — errorType varies across the API.
function isBlockedEmailDomainError(status, body) {
  if (status !== 400 || !body || !Array.isArray(body.errors)) return false;
  return body.errors.some((e) => {
    const t = String(e.errorType || "").toUpperCase();
    const m = String(e.message || "").toLowerCase();
    return (
      t === "BLOCKED_EMAIL_DOMAIN" ||
      t === "EMAIL_INVALID" ||
      m.includes("blocked from form submissions") ||
      m.includes("free email") ||
      m.includes("business email")
    );
  });
}

/**
 * Wraps gated academy course content. If the visitor hasn't yet given an email
 * for this course, shows an inline email form that POSTs directly to HubSpot's
 * Forms API. On success it persists an unlock flag in localStorage and reveals
 * `children`.
 *
 *   <AcademyEmailGate
 *     courseSlug="agents-in-production"
 *     courseTitle="..."
 *     formId="cfc1cc3c-..."   // optional; falls back to VITE_HUBSPOT_ACADEMY_FORM_ID
 *   >
 *     <CourseContent />
 *   </AcademyEmailGate>
 */
// Final fallback: the Start Now form (always configured, always notifies).
// Guarantees a course page can never ship "dead-bolted" (gate shown but
// submissions failing) if neither a per-course formId nor the academy env
// var is set. The submission's pageName carries the course title, so
// attribution survives even on the shared form.
const STARTNOW_FALLBACK_FORM_ID = "35384a3e-7386-45b0-924e-84e5d6f637e4";

export default function AcademyEmailGate({ courseSlug, courseTitle, formId, children }) {
  const effectiveFormId = formId || ACADEMY_FORM_ID || STARTNOW_FALLBACK_FORM_ID;
  const [unlocked, setUnlocked] = useState(() => !!readUnlockEntry(courseSlug));
  // Access & Evaluation Agreement acceptance (site-wide, versioned).
  const [acceptedAgreement, setAcceptedAgreement] = useState(() => hasAcceptedCurrent());

  // When an already-unlocked visitor reopens a course, silently re-submit
  // their stored email to HubSpot — gives the founder a notification that
  // the same person came back. Throttled to once per 24h per course.
  useEffect(() => {
    if (!unlocked) return;
    const entry = readUnlockEntry(courseSlug);
    if (!entry || !entry.email) return;
    const now = Date.now();
    if (now - entry.lastNotifiedTs < REPEAT_NOTIFY_THROTTLE_MS) return;
    // Inline the configured check — `isConfigured` is declared after the
    // early-return below, so it isn't in scope when unlocked === true.
    if (!HUBSPOT_PORTAL_ID || !effectiveFormId) return;
    writeUnlockEntry(courseSlug, { ...entry, lastNotifiedTs: now });
    // Fire and forget — the unlock flow doesn't depend on it succeeding.
    submitToHubSpot({
      email: entry.email,
      courseTitle: `${courseTitle} (repeat visit)`,
      formId: effectiveFormId,
    }).catch(() => {});
    trackEvent("academy_repeat_visit", { course: courseSlug });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Identity check via the hsutk Worker — auto-unlock known contacts for
  // this course (they may have submitted Start Now, opened a meeting, or
  // shown up via BCC linkage without ever touching this academy gate).
  useEffect(() => {
    if (unlocked) return;
    if (!HUBSPOT_PORTAL_ID || !effectiveFormId) return;
    let cancelled = false;
    checkKnownContact().then((result) => {
      if (cancelled) return;
      if (!(result && result.known && result.email)) return;
      writeUnlockEntry(courseSlug, {
        email: result.email,
        ts: Date.now(),
        lastNotifiedTs: Date.now(),
      });
      // Fire the per-course re-notify so HubSpot sees "they came back
      // for this course" specifically.
      submitToHubSpot({
        email: result.email,
        courseTitle: `${courseTitle} (auto-unlock — known contact)`,
        formId: effectiveFormId,
      }).catch(() => {});
      trackEvent("academy_auto_unlocked", { course: courseSlug });
      setUnlocked(true);
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (unlocked && acceptedAgreement) return <>{children}</>;

  // Email-unlocked (returning / auto-recognized) but the current agreement
  // version hasn't been accepted yet — agreement-only step, no email re-entry.
  if (unlocked && !acceptedAgreement) {
    const entry = readUnlockEntry(courseSlug);
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 md:p-10">
          <AgreementGate
            email={(entry && entry.email) || ""}
            surface={`academy_${courseSlug}`}
            onAccepted={() => setAcceptedAgreement(true)}
          />
        </div>
      </div>
    );
  }

  // The form is always shown. If HubSpot env vars / form id are missing in
  // this environment, submissions will surface a friendly error via setError
  // (rather than silently failing) — visitors are guided to email Amir
  // directly so we don't lose the lead while configuration is being fixed.
  const isConfigured = !!(HUBSPOT_PORTAL_ID && effectiveFormId);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (!isConfigured) {
        throw new Error("HubSpot form not configured");
      }
      // pageName carries the acceptance record: the agreement checkbox is
      // required before submit, so this submission evidences acceptance.
      await submitToHubSpot({
        email,
        courseTitle: `${courseTitle} · Access Agreement v${AGREEMENT_VERSION} accepted`,
        formId: effectiveFormId,
      });
      writeUnlockEntry(courseSlug, {
        email,
        ts: Date.now(),
        // First-submit IS the first notification — stamp it so the repeat
        // useEffect doesn't immediately re-fire on the same render cycle.
        lastNotifiedTs: Date.now(),
      });
      markAccepted(email);
      setAcceptedAgreement(true);
      trackEvent("academy_email_submitted", { course: courseSlug });
      setUnlocked(true);
    } catch (err) {
      if (err instanceof BusinessEmailRequiredError) {
        setError("business_email");
      } else {
        setError("generic");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 md:p-10">
        <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-[10px] md:text-[11px] font-mono tracking-widest mb-4 text-[#4D8EF8]">
          TRAIGENT ACADEMY
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          {courseTitle}
        </h2>
        <p className="text-slate-300 mb-6 leading-relaxed">
          Drop your work email below to get the access link. We'll send it to
          your inbox right away — no spam, just the link back to this course.
        </p>
        <ConsentGate>
          <form onSubmit={onSubmit} className="space-y-3">
            <label htmlFor={`academy-email-${courseSlug}`} className="sr-only">
              Email address
            </label>
            <input
              id={`academy-email-${courseSlug}`}
              type="email"
              required
              placeholder="you@yourcompany.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              className="w-full px-4 py-3 rounded-lg bg-slate-950/60 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#4D8EF8] transition-colors"
            />
            <ConsentCheckbox
              id={`academy-consent-${courseSlug}`}
              checked={agreed}
              onChange={setAgreed}
            />
            <AgreementCheckbox
              id={`academy-agreement-${courseSlug}`}
              checked={agreedTerms}
              onChange={setAgreedTerms}
            />
            <button
              type="submit"
              disabled={submitting || !email || !agreed || !agreedTerms}
              className="w-full bg-[#1A6BF5] hover:bg-[#4D8EF8] disabled:opacity-60 disabled:cursor-not-allowed text-white px-5 py-3 rounded-lg font-medium transition-colors"
            >
              {submitting ? "Sending…" : "Send me the access link"}
            </button>
          </form>
        </ConsentGate>
        {error === "business_email" && (
          <p className="text-amber-400 text-sm mt-4" role="alert">
            Please enter your <u>business</u> email
          </p>
        )}
        {error === "generic" && (
          <p className="text-amber-400 text-sm mt-4" role="alert">
            Something went wrong sending you the link. Try again, or email amir@traigent.ai and we&apos;ll send it directly.
          </p>
        )}
        <p className="text-xs text-slate-500 mt-6">
          By submitting, you agree to receive the course access link. We only
          email you about the course you signed up for — unsubscribe any time.
        </p>
      </div>
    </div>
  );
}
