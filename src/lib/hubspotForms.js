// Direct HubSpot Forms API — used for SILENT re-submissions when a known
// (already-unlocked) visitor opens a gated surface again. The user-visible
// first-submit goes through the HubSpot embed v2 script, not this.
//
// The Forms API endpoint is CORS-enabled and our CSP already allows
// api.hsforms.com via the *.hsforms.com connect-src entry.

const HUBSPOT_PORTAL_ID = "148486827";
const STARTNOW_FORM_ID = "35384a3e-7386-45b0-924e-84e5d6f637e4";
const PORTAL_FORM_ID = "692b03aa-e984-411c-8792-2e86baed2614";

function readHubSpotCookie() {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

/**
 * Silently re-submit a HubSpot form for an already-known visitor — fires
 * the form's notification workflow ("amir@traigent.ai came back") without
 * making the visitor fill the form again. No-op when email is empty.
 *
 * @param {object} opts
 * @param {string} opts.email   — visitor email
 * @param {string} opts.formId  — HubSpot form GUID to submit to
 * @param {string} opts.location — surface (topnav / homepage_hero / etc)
 * @param {string} opts.label    — short label for the pageName ("Start Now", "Portal")
 */
export async function notifyRepeatVisit({ email, formId, location, label }) {
  if (!email || !formId) return;
  const url = `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${formId}`;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        submittedAt: Date.now(),
        fields: [{ objectTypeId: "0-1", name: "email", value: email }],
        context: {
          hutk: readHubSpotCookie(),
          pageUri: typeof window !== "undefined" ? window.location.href : "",
          pageName: `Traigent — ${label || "Repeat visit"} (repeat: ${location || "unknown"})`,
        },
      }),
    });
  } catch {
    // Silent — the unlock flow must continue even if HubSpot is unreachable.
  }
}

/** Convenience wrappers so call sites don't have to remember form IDs. */
export function notifyStartNowRepeat({ email, location }) {
  return notifyRepeatVisit({ email, formId: STARTNOW_FORM_ID, location, label: "Start Now" });
}

export function notifyPortalRepeat({ email, location }) {
  return notifyRepeatVisit({ email, formId: PORTAL_FORM_ID, location, label: "Portal" });
}

export { PORTAL_FORM_ID };
