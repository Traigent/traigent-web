import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../lib/analytics";

// Fires a GA4 page_view event on every route change.
// Mounted once in Layout (and Pitch/PitchFull/Investors via their own roots if we want them tracked).
export default function RouteTracker() {
  const location = useLocation();
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);
  return null;
}
