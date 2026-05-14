import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Scrolls to the top of the page whenever the route changes.
// React Router (v6) does NOT do this by default — without this component,
// clicking a link from a scrolled position keeps the same scroll on the
// new page, which feels broken to users.
//
// Skips the scroll-to-top if a `pendingScroll` is queued by TopNav for
// cross-page anchor navigation (e.g. "Customers" link from /value-proposition),
// so anchor-jumps still work cleanly.
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (sessionStorage.getItem("pendingScroll")) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}
