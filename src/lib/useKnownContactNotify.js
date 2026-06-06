import { useEffect, useRef } from "react";
import { checkKnownContact } from "./hubspotIdentify";
import { trackEvent } from "./analytics";

/**
 * One-shot known-contact notification hook. Drop into any page that
 * should NOT be gated (no email form), but where the founder still wants
 * a HubSpot notification when a *known* contact lands on it.
 *
 * On mount: checks whether the visitor's hubspotutk cookie maps to a
 * known HubSpot contact via the hsutk Worker. If yes, silently submits
 * to the surface's tracking form and fires a PostHog/GA4 event. Fires at
 * most once per page-mount; safe to drop in without UI side effects.
 *
 *   useKnownContactNotify({
 *     notify: notifyPricingViewed,
 *     location: "pricing_page",
 *     eventName: "pricing_viewed_known",
 *   });
 */
export function useKnownContactNotify({ notify, location, eventName }) {
  const firedRef = useRef(false);
  useEffect(() => {
    if (firedRef.current) return;
    let cancelled = false;
    checkKnownContact().then((result) => {
      if (cancelled) return;
      if (!(result && result.known && result.email)) return;
      firedRef.current = true;
      try { notify({ email: result.email, location }); } catch { /* noop */ }
      if (eventName) trackEvent(eventName, { location });
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
