// Direct HubSpot Forms API — used for SILENT re-submissions when a known
// (already-unlocked) visitor opens a gated surface again. The user-visible
// first-submit goes through the HubSpot embed v2 script, not this.
//
// The Forms API endpoint is CORS-enabled and our CSP already allows
// api.hsforms.com via the *.hsforms.com connect-src entry.

const HUBSPOT_PORTAL_ID = "148486827";
const STARTNOW_FORM_ID = "35384a3e-7386-45b0-924e-84e5d6f637e4";
const PORTAL_FORM_ID = "692b03aa-e984-411c-8792-2e86baed2614";
// Tracking-only forms — surfaces are intentionally NOT gated (anyone can
// view), but a known HubSpot contact viewing fires a silent submission so
// the founder gets an intent notification. One form per surface so the
// HubSpot notification surfaces the right context.
const STORY_FORM_ID = "3af25090-75c0-4291-8889-3221ea0e3f2d";
const PRICING_FORM_ID = "57287a7b-6d54-4fcd-8eae-6336100ca57e";
const TTM_FORM_ID = "157b3560-f3c7-428e-af44-73d9326d839f";
const ROI_FORM_ID = "b1a8947a-65bf-4da1-a2a9-7c6748d43d25";
const KNOB_EXPLORER_FORM_ID = "a9bc858e-add8-4094-995a-188ae08fd56e";
const PITCH_DECK_FORM_ID = "728ef1b3-0a23-476b-9a3d-bcae6ec6ba64";

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

export function notifyStoryWatched({ email, location }) {
  return notifyRepeatVisit({ email, formId: STORY_FORM_ID, location, label: "Story watched" });
}

export function notifyPricingViewed({ email, location }) {
  return notifyRepeatVisit({ email, formId: PRICING_FORM_ID, location, label: "Pricing intent" });
}

export function notifyTtmCalcViewed({ email, location }) {
  return notifyRepeatVisit({ email, formId: TTM_FORM_ID, location, label: "TTM calculator" });
}

export function notifyRoiCalcViewed({ email, location }) {
  return notifyRepeatVisit({ email, formId: ROI_FORM_ID, location, label: "ROI calculator" });
}

export function notifyKnobExplorerViewed({ email, location }) {
  return notifyRepeatVisit({ email, formId: KNOB_EXPLORER_FORM_ID, location, label: "Knob Explorer" });
}

export function notifyPitchDeckViewed({ email, location }) {
  return notifyRepeatVisit({ email, formId: PITCH_DECK_FORM_ID, location, label: "Slide deck viewed" });
}

/**
 * Acceptance-evidence record for the Access & Evaluation Agreement: fires a
 * silent submission whose pageName carries the version + surface, giving the
 * contact a timestamped acceptance entry in HubSpot.
 */
export function notifyAgreementAccepted({ email, location, version }) {
  return notifyRepeatVisit({
    email,
    formId: STARTNOW_FORM_ID,
    location,
    label: `Access Agreement v${version} accepted`,
  });
}

export { PORTAL_FORM_ID };
