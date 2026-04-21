import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackEvent } from "../utils/analytics";

const routeTitles = {
  "/": "Traigent - Trust Your AI Agents at Scale",
  "/get-started": "Get started - Traigent",
  "/one-pager": "Traigent One Pager",
  "/value-proposition": "Traigent Value Proposition",
  "/investors": "Traigent - Investor Overview",
  "/table-demo": "Traigent - Trust Your AI Agents at Scale",
  "/demos": "Demos - Traigent",
  "/academy": "Academy - Agents in Production - Traigent",
  "/academy/agents-in-production": "Agents in Production Course - Traigent Academy",
  "/resources": "Resources - Traigent",
  "/specifications": "Specifications - Traigent",
  "/privacy": "Redirecting - Traigent",
  "/terms": "Redirecting - Traigent",
  "/refund": "Redirecting - Traigent",
  "/pricing": "Redirecting - Traigent",
};

export default function RouteAnalytics() {
  const location = useLocation();

  useEffect(() => {
    trackEvent("page_view", {
      page: location.pathname,
      title: routeTitles[location.pathname] || document.title,
    });
  }, [location.pathname]);

  return null;
}
