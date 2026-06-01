import { useState } from "react";
import { trackEvent } from "../../lib/analytics";

// Configuration read at build time. The Forms API is CORS-enabled and our
// CSP already allows api.hsforms.com via the *.hsforms.com entry.
const HUBSPOT_PORTAL_ID = import.meta.env.VITE_HUBSPOT_PORTAL_ID;
const ACADEMY_FORM_ID = import.meta.env.VITE_HUBSPOT_ACADEMY_FORM_ID;

// LocalStorage key — namespaced per course so different academy modules each
// gate independently. Value is the email the user submitted.
function storageKey(courseSlug) {
  return `traigent_academy_unlock:${courseSlug}`;
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

async function submitToHubSpot({ email, courseTitle }) {
  // Forms API — public, CORS-enabled, accepts direct browser POSTs. Submission
  // creates/updates the contact in HubSpot and triggers any workflow attached
  // to the form (where the welcome email is sent).
  const url = `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${ACADEMY_FORM_ID}`;
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
    const text = await res.text().catch(() => "");
    throw new Error(`HubSpot ${res.status}: ${text || res.statusText}`);
  }
}

/**
 * Wraps gated academy course content. If the visitor hasn't yet given an email
 * for this course, shows an inline email form that POSTs directly to HubSpot's
 * Forms API. On success it persists an unlock flag in localStorage and reveals
 * `children`.
 *
 *   <AcademyEmailGate courseSlug="agents-in-production" courseTitle="...">
 *     <CourseContent />
 *   </AcademyEmailGate>
 */
export default function AcademyEmailGate({ courseSlug, courseTitle, children }) {
  const [unlocked, setUnlocked] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return !!window.localStorage.getItem(storageKey(courseSlug));
    } catch {
      return false;
    }
  });
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (unlocked) return <>{children}</>;

  // No HubSpot form wired yet (dev, preview, or pre-launch): render the course
  // content directly rather than a placeholder. Better UX, and lets us preview
  // the page locally without configuring HubSpot for every developer.
  if (!HUBSPOT_PORTAL_ID || !ACADEMY_FORM_ID) {
    return <>{children}</>;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await submitToHubSpot({ email, courseTitle });
      try {
        window.localStorage.setItem(storageKey(courseSlug), email || "1");
      } catch {
        /* private mode — soft-degrade */
      }
      trackEvent("academy_email_submitted", { course: courseSlug });
      setUnlocked(true);
    } catch {
      setError(
        "Something went wrong sending you the link. Try again, or email amir@traigent.ai and we'll send it directly."
      );
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
          <button
            type="submit"
            disabled={submitting || !email}
            className="w-full bg-[#1A6BF5] hover:bg-[#4D8EF8] disabled:opacity-60 disabled:cursor-not-allowed text-white px-5 py-3 rounded-lg font-medium transition-colors"
          >
            {submitting ? "Sending…" : "Send me the access link"}
          </button>
        </form>
        {error && (
          <p className="text-amber-400 text-sm mt-4" role="alert">
            {error}
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
