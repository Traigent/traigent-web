import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Handles scroll behavior on route change.
//
// Priority order:
//   1. If `pendingScroll` is queued in sessionStorage (cross-page anchor
//      from TopNav), let the destination page handle the scroll — do nothing.
//   2. If the URL has a `#hash` portion (e.g. /roi#references), scroll
//      to the element with that id. Retried briefly to handle pages that
//      lazy-mount their target.
//   3. Otherwise scroll to top.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (sessionStorage.getItem("pendingScroll")) return;

    if (hash) {
      const targetId = hash.replace(/^#/, "");
      // Retry up to ~600ms so animated/lazy sections have time to mount.
      let tries = 0;
      const tryScroll = () => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
        if (++tries < 6) setTimeout(tryScroll, 100);
      };
      tryScroll();
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);

  return null;
}
