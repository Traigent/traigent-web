// ===================================================================
// Analytics helpers — single integration point for GA4 + Microsoft
// Clarity + HubSpot + PostHog.
//
// To activate, fill these into .env.local:
//   VITE_GA4_ID            e.g. "G-XXXXXXXXXX"
//   VITE_CLARITY_ID        e.g. "abcdefghij"
//   VITE_HUBSPOT_PORTAL_ID e.g. "148486827"
//   VITE_HUBSPOT_REGION    "eu1" for EU accounts, blank for US (default: blank)
//   VITE_POSTHOG_KEY       starts with "phc_..."
//   VITE_POSTHOG_HOST      "https://eu.i.posthog.com" or "https://us.i.posthog.com"
//                          (ingestion host, not the dashboard URL)
//
// Any var left unset turns its corresponding integration into a no-op.
// ===================================================================

const GA4_ID = import.meta.env.VITE_GA4_ID;
const CLARITY_ID = import.meta.env.VITE_CLARITY_ID;
const HUBSPOT_PORTAL_ID = import.meta.env.VITE_HUBSPOT_PORTAL_ID;
const HUBSPOT_REGION = import.meta.env.VITE_HUBSPOT_REGION || "";
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com";

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

  // ---- HubSpot tracking ----
  // _hsq is a stub queue that the HubSpot script drains on load, so calls
  // made before the script arrives still get processed in order.
  if (HUBSPOT_PORTAL_ID) {
    window._hsq = window._hsq || [];
    const host = HUBSPOT_REGION ? `js-${HUBSPOT_REGION}.hs-scripts.com` : "js.hs-scripts.com";
    const s = document.createElement("script");
    s.async = true;
    s.defer = true;
    s.id = "hs-script-loader";
    s.src = `https://${host}/${HUBSPOT_PORTAL_ID}.js`;
    document.head.appendChild(s);
  }

  // ---- PostHog ----
  // Standard PostHog snippet: stubs the API surface, async-loads the real lib.
  // Calls made before the lib arrives are queued.
  if (POSTHOG_KEY) {
    /* eslint-disable */
    !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    window.posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      // HashRouter routes don't trigger PostHog's auto-pageview reliably,
      // so we send manually from trackPageView() on every route change.
      capture_pageview: false,
      persistence: "localStorage+cookie",
      // Tag the surface so cross-property funnels (web vs portal) work
      // without manual tagging on every event.
      loaded: (ph) => { ph.register({ surface: "marketing" }); },
    });
    /* eslint-enable */
  }

  // ---- First-touch UTM attribution ----
  // PostHog/HubSpot auto-capture utm_* on the landing event, but lose them
  // once the user navigates away. Persist the first set we see for 90 days
  // and re-attach to every PostHog event + the next HubSpot form submit.
  captureFirstTouchUtms();
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
  if (HUBSPOT_PORTAL_ID && window._hsq) {
    window._hsq.push(["setPath", path]);
    window._hsq.push(["trackPageView"]);
  }
  if (POSTHOG_KEY && window.posthog && window.posthog.capture) {
    window.posthog.capture("$pageview", { $current_url: window.location.href });
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
  if (CLARITY_ID && window.clarity) {
    try { window.clarity("event", name); } catch { /* noop */ }
  }
  if (POSTHOG_KEY && window.posthog && window.posthog.capture) {
    window.posthog.capture(name, params);
  }
  // HubSpot custom behavioral events require Enterprise tier — skip here.
  // Form submissions, meetings, and chat are still captured by HubSpot automatically.
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug("[track]", name, params);
  }
}

/**
 * Bind the current anonymous visitor to a known identity. Call this:
 *   - On portal login (with userId + email)
 *   - After any form submission that captures email (HubSpot's own forms auto-stitch)
 *   - After chat email capture (HubSpot's chat auto-stitches too)
 *
 * Same userId + traits go to HubSpot AND PostHog so the two views of the
 * same person stay aligned. HubSpot back-fills prior anonymous activity onto
 * the contact timeline automatically once email is known.
 *
 *   identify("user_42", { email: "amir@example.com", name: "Amir" })
 */
export function identify(userId, traits = {}) {
  if (typeof window === "undefined") return;
  if (!userId && !traits.email) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn("[identify] needs at least userId or traits.email");
    }
    return;
  }
  if (HUBSPOT_PORTAL_ID) {
    window._hsq = window._hsq || [];
    const hubspotTraits = { ...traits };
    if (userId) hubspotTraits.id = userId; // HubSpot's external-id property
    window._hsq.push(["identify", hubspotTraits]);
    window._hsq.push(["trackPageView"]); // flush so the identify takes effect immediately
  }
  if (POSTHOG_KEY && window.posthog && window.posthog.identify) {
    const distinctId = userId || traits.email;
    window.posthog.identify(distinctId, traits);
  }
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug("[identify]", userId || traits.email, traits);
  }
}

// ===================================================================
// First-touch UTM helper (used by initAnalytics)
// ===================================================================

const UTM_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",  // Google Ads click ID
  "fbclid", // Facebook click ID
  "li_fat_id", // LinkedIn click ID
];
const UTM_TTL_MS = 90 * 24 * 60 * 60 * 1000; // 90 days
const UTM_STORAGE_KEY = "traigent_utms";

function captureFirstTouchUtms() {
  if (typeof window === "undefined") return;

  // Pull anything UTM-shaped out of the current URL.
  let fresh = {};
  try {
    const params = new URL(window.location.href).searchParams;
    for (const p of UTM_PARAMS) {
      const v = params.get(p);
      if (v) fresh[p] = v;
    }
  } catch { /* malformed URL — skip */ }

  // Fresh UTMs overwrite stored ones (last campaign wins for re-attribution).
  // No UTMs in URL → hydrate from storage if still within TTL.
  let active = null;
  if (Object.keys(fresh).length > 0) {
    active = fresh;
    try {
      window.localStorage.setItem(
        UTM_STORAGE_KEY,
        JSON.stringify({ ...fresh, ts: Date.now() })
      );
    } catch { /* private mode / quota — silently degrade */ }
  } else {
    try {
      const raw = window.localStorage.getItem(UTM_STORAGE_KEY);
      if (raw) {
        const stored = JSON.parse(raw);
        if (stored && typeof stored.ts === "number" && Date.now() - stored.ts < UTM_TTL_MS) {
          // eslint-disable-next-line no-unused-vars
          const { ts, ...rest } = stored;
          if (Object.keys(rest).length > 0) active = rest;
        }
      }
    } catch { /* corrupted entry — ignore */ }
  }

  if (!active) return;

  // PostHog: register as super-properties so every future event carries them.
  // Stub's register() queues the call until the real lib loads — safe to call early.
  if (POSTHOG_KEY && window.posthog && window.posthog.register) {
    const superProps = {};
    for (const [k, v] of Object.entries(active)) {
      superProps[`first_${k}`] = v;
    }
    window.posthog.register(superProps);
  }

  // HubSpot: attach to the visitor session so the next form submit / meeting
  // booking carries them onto the contact record. _hsq is a queue, safe pre-load.
  if (HUBSPOT_PORTAL_ID && window._hsq) {
    window._hsq.push(["identify", active]);
  }

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug("[utm] first-touch", active);
  }
}
