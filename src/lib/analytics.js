// ===================================================================
// Analytics helpers — single integration point for GA4 + Microsoft
// Clarity + any other tracking we add later.
//
// To activate: drop your IDs into the two env vars below.
//   VITE_GA4_ID         e.g. "G-XXXXXXXXXX"
//   VITE_CLARITY_ID     e.g. "abcdefghij"
//
// These are read from .env / .env.local at build time (Vite). When
// they're unset, all calls become no-ops — safe to leave in production
// until the IDs are ready.
// ===================================================================

const GA4_ID = import.meta.env.VITE_GA4_ID;
const CLARITY_ID = import.meta.env.VITE_CLARITY_ID;

let initialized = false;

export function initAnalytics() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  // ---- Google Analytics 4 (gtag.js) ----
  if (GA4_ID) {
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag("js", new Date());
    // SPA: we'll send page_view manually on route change via trackPageView()
    gtag("config", GA4_ID, { send_page_view: false });
  }

  // ---- Microsoft Clarity ----
  if (CLARITY_ID) {
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1;
      t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", CLARITY_ID);
  }
}

/** Fire on every route change. Call this from a router listener. */
export function trackPageView(path) {
  if (typeof window === "undefined") return;
  if (GA4_ID && window.gtag) {
    window.gtag("event", "page_view", {
      page_path: path,
      page_location: window.location.href,
    });
  }
}

/**
 * Generic event tracker — wrap every meaningful CTA in this.
 *   trackEvent("start_now_clicked", { location: "hero" })
 *   trackEvent("demo_booking_clicked", { location: "topnav" })
 */
export function trackEvent(name, params = {}) {
  if (typeof window === "undefined") return;
  if (GA4_ID && window.gtag) {
    window.gtag("event", name, params);
  }
  // Clarity custom events
  if (CLARITY_ID && window.clarity) {
    try { window.clarity("event", name); } catch { /* noop */ }
  }
  // Dev-time visibility — comment out for production noise reduction.
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug("[track]", name, params);
  }
}
