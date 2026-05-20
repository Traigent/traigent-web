import { useEffect, useRef, useState } from "react";
import { trackEvent } from "../../lib/analytics";

// Configuration read at build time. The HubSpot Forms embed script is already
// CSP-allowlisted (*.hsforms.net + *.hsforms.com + *.hubspot.com). If
// VITE_HUBSPOT_ACADEMY_FORM_ID is unset, the gate degrades to a friendly
// "coming soon" message rather than a broken embed — safe to ship before the
// HubSpot form is created.
const HUBSPOT_PORTAL_ID = import.meta.env.VITE_HUBSPOT_PORTAL_ID;
const HUBSPOT_REGION = import.meta.env.VITE_HUBSPOT_REGION || "";
const ACADEMY_FORM_ID = import.meta.env.VITE_HUBSPOT_ACADEMY_FORM_ID;

// LocalStorage key — namespaced per course so different academy modules each
// gate independently. Value is the email the user submitted (also useful for
// later analytics attribution).
function storageKey(courseSlug) {
  return `traigent_academy_unlock:${courseSlug}`;
}

function loadHubSpotFormsScript() {
  return new Promise((resolve, reject) => {
    if (window.hbspt && window.hbspt.forms) {
      resolve();
      return;
    }
    const existing = document.querySelector(
      'script[src*="hsforms.net/forms/embed/v2.js"]'
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", reject);
      return;
    }
    const s = document.createElement("script");
    s.charset = "utf-8";
    s.type = "text/javascript";
    // EU-region accounts serve the embed from a region-specific subdomain;
    // js.hsforms.net works for both with a region querystring on the form
    // create call below.
    s.src = "https://js.hsforms.net/forms/embed/v2.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

/**
 * Wraps gated academy course content. If the visitor hasn't yet given an email
 * for this course, shows a HubSpot form. Once submitted (which creates/updates
 * the contact in HubSpot and fires any workflows attached to that form), the
 * page reveals `children`.
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
  const [scriptStatus, setScriptStatus] = useState("idle"); // idle | loading | ready | error
  const formContainerRef = useRef(null);

  // Configure the embed once the HubSpot script is loaded and we have a form ID.
  useEffect(() => {
    if (unlocked) return;
    if (!HUBSPOT_PORTAL_ID || !ACADEMY_FORM_ID) return;
    if (!formContainerRef.current) return;

    setScriptStatus("loading");
    loadHubSpotFormsScript()
      .then(() => {
        if (!formContainerRef.current) return;
        // Clear any previous mount so HMR + re-renders don't stack iframes.
        formContainerRef.current.innerHTML = "";
        window.hbspt.forms.create({
          portalId: HUBSPOT_PORTAL_ID,
          formId: ACADEMY_FORM_ID,
          region: HUBSPOT_REGION || "na1",
          target: `#${formContainerRef.current.id}`,
          onFormSubmit: (form) => {
            // Capture the email for analytics + storage. HubSpot's form forwards
            // the submission to the HubSpot backend on its own; we just record
            // the unlock.
            const email = (() => {
              try {
                const data = form.serializeArray();
                const entry = data.find((d) => d.name === "email");
                return entry?.value || "";
              } catch {
                return "";
              }
            })();
            try {
              window.localStorage.setItem(storageKey(courseSlug), email || "1");
            } catch { /* private mode — soft-degrade */ }
            trackEvent("academy_email_submitted", { course: courseSlug });
            // HubSpot redirects/unmounts the form by default; we override by
            // setting unlocked and rendering the children below.
            setUnlocked(true);
          },
        });
        setScriptStatus("ready");
      })
      .catch(() => setScriptStatus("error"));
  }, [courseSlug, unlocked]);

  if (unlocked) return <>{children}</>;

  // Configuration not yet set: show a friendly placeholder rather than a broken
  // embed. Lets us ship the route before the HubSpot form exists.
  if (!HUBSPOT_PORTAL_ID || !ACADEMY_FORM_ID) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          {courseTitle}
        </h2>
        <p className="text-slate-400 mb-2">
          This course is coming soon. We're finalizing the materials.
        </p>
        <p className="text-slate-500 text-sm">
          In the meantime, drop us a note at{" "}
          <a className="text-[#4D8EF8] hover:text-white underline" href="mailto:amir@traigent.ai">
            amir@traigent.ai
          </a>{" "}
          and we'll let you know the moment it's live.
        </p>
      </div>
    );
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
          Drop your work email below to get the access code. We'll send it to
          your inbox right away — no spam, just the code and the link back here.
        </p>
        <div
          id={`hs-academy-form-${courseSlug}`}
          ref={formContainerRef}
          className="academy-hs-form"
        />
        {scriptStatus === "error" && (
          <p className="text-amber-400 text-sm mt-4">
            Couldn't load the signup form. Refresh the page, or email{" "}
            <a className="underline" href="mailto:amir@traigent.ai">
              amir@traigent.ai
            </a>{" "}
            and we'll send you the access code directly.
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
