import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "./analytics";

/**
 * Fires `trackPageView` on mount and on every subsequent location change.
 *
 * For pages mounted **outside** the Layout wrapper (which is where
 * RouteTracker lives): /story, /knob-explorer, /demo, /pitch*, /one-pager*,
 * /table-demo. Without this, GA4 silently misses page_view events for those
 * routes — users still register as "active" through other events, but the
 * Pages report under-reports them by 4-5x (see the /story 49 active vs 10
 * views anomaly that surfaced the bug).
 *
 *   export default function MyPage() {
 *     usePageView();
 *     ...
 *   }
 *
 * Idiomatic placement is the first line of the component body. Safe to call
 * unconditionally — when GA4/PostHog/Clarity env vars are unset, each branch
 * inside trackPageView no-ops.
 */
export function usePageView() {
  const location = useLocation();
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);
}
