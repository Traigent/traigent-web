import { useEffect, useRef } from "react";
import { checkKnownContact } from "./hubspotIdentify";
import { getUnlockedEmail, shouldNotifyForGate } from "./startNowGate";
import { trackEvent } from "./analytics";

/**
 * One-shot known-contact notification hook. Drop into any page that
 * should NOT be gated (no email form), but where the founder still wants
 * a HubSpot notification when a *known* contact lands on it.
 *
 * Two paths to "we know who this visitor is":
 *
 *   1. localStorage — the visitor previously submitted Start Now /
 *      Get Started / Portal, so their email is in `traigent_start_now_unlocked`.
 *      This works WITHOUT the hsutk Worker being deployed.
 *
 *   2. hsutk Worker — the visitor's hubspotutk cookie maps to a known
 *      HubSpot contact via the Cloudflare Worker. Catches contacts who
 *      came in via Contact Us, meeting bookings, BCC-to-HubSpot, etc.,
 *      WITHOUT ever touching one of our gates.
 *
 * Per-gate throttle (1h) is applied so visiting Pricing twice in a row
 * doesn't fire two notifications.
 *
 *   useKnownContactNotify({
 *     notify: notifyPricingViewed,
 *     location: "pricing_page",
 *     eventName: "pricing_viewed_known",
 *     gateKey: "pricing",         // required — used for the per-gate throttle
 *   });
 *
 * `enabled` (default true) lets a caller suppress the notification without
 * breaking the rules of hooks — e.g. the Knob Explorer passes `enabled:
 * !embedded` so the /story embed doesn't double-notify (the story page fires
 * its own notifyStoryWatched).
 */
export function useKnownContactNotify({ notify, location, eventName, gateKey, enabled = true }) {
  const firedRef = useRef(false);
  useEffect(() => {
    if (!enabled) return;
    if (firedRef.current) return;
    const key = gateKey || location || "unknown_gate";

    // Path 1: localStorage-first — covers the "I'm already a known visitor
    // on this browser" case without needing the Worker.
    const localEmail = getUnlockedEmail();
    if (localEmail) {
      if (!shouldNotifyForGate(key)) {
        firedRef.current = true; // avoid Path 2 firing too
        return;
      }
      firedRef.current = true;
      try { notify({ email: localEmail, location }); } catch { /* noop */ }
      if (eventName) trackEvent(eventName, { location });
      return;
    }

    // Path 2: Worker check — covers known HubSpot contacts who haven't
    // touched any of our gates on this browser.
    let cancelled = false;
    checkKnownContact().then((result) => {
      if (cancelled) return;
      if (!(result && result.known && result.email)) return;
      if (!shouldNotifyForGate(key)) return;
      firedRef.current = true;
      try { notify({ email: result.email, location }); } catch { /* noop */ }
      if (eventName) trackEvent(eventName, { location });
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
