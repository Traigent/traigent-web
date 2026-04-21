import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { routeMeta } from "../content/siteContent";
import { trackEvent } from "../utils/analytics";

export default function RouteAnalytics() {
  const location = useLocation();

  useEffect(() => {
    const meta = routeMeta[location.pathname];

    trackEvent("page_view", {
      page: location.pathname,
      title: meta?.title || document.title,
    });
  }, [location.pathname]);

  return null;
}
