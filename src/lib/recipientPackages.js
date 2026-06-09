// Recipient-package registry — env-driven so this public repo stays clean.
//
// Source of truth: `VITE_RECIPIENT_PACKAGES_JSON` env var, set in GitHub
// Actions Variables (`gh variable set VITE_RECIPIENT_PACKAGES_JSON …`) for
// prod and in `.env.local` for local dev. Schema:
//
//   {
//     "vc"      : { "<opaque-slug>": <Package>, ... },
//     "channel" : { "<opaque-slug>": <Package>, ... },
//     "customer": { "<opaque-slug>": <Package>, ... }
//   }
//
// Package shape:
//   {
//     displayName:   "Bosch Ventures",         // shown in the admin nav
//     internalLabel: "Bosch corp-discovery",   // Amir-facing label, optional
//     dateSent:      "2026-06-09",             // ISO yyyy-mm-dd, optional
//     presetRange:   "24-29",                  // SHORT_SLIDES range to render
//     cover: {                                 // first slide of the package
//       kicker:   "For Bosch Ventures",
//       headline: "...",
//       subhead:  "...",
//       bullets:  ["...", "..."],
//       footerNote: "Sent privately ..."
//     }
//   }
//
// Privacy posture (public repo):
//   - No recipient names or slugs live in source. They live in the env var.
//   - The prod JS bundle still contains every registered package as strings
//     (visible in devtools). Opaque slugs + no inter-package links are what
//     keep this useful: a recipient cannot navigate to other recipients'
//     packages and there is no listing page that enumerates them.
//   - `/vc`, `/channel`, `/customer` (no slug) render a bland page.

const VALID_TYPES = ["vc", "channel", "customer"];

// Local override for dev: a gitignored file at the same directory can export
// `packages` and it takes precedence over the env var. This avoids the
// dotenv quoting / escaping pitfalls when iterating locally. import.meta.glob
// resolves at build time and returns `{}` if the file doesn't exist, so prod
// builds (which use the env var instead) still work fine.
const LOCAL_OVERRIDES = (() => {
  try {
    const matches = import.meta.glob("./recipientPackages.local.js", { eager: true });
    const mod = Object.values(matches)[0];
    return mod?.packages || null;
  } catch {
    return null;
  }
})();

function parseRegistry(raw) {
  if (!raw) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.info(
        "[recipientPackages] VITE_RECIPIENT_PACKAGES_JSON is not set; admin nav will show 'No recipient packages registered.'",
      );
    }
    return { vc: {}, channel: {}, customer: {} };
  }
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    const out = { vc: {}, channel: {}, customer: {} };
    for (const type of VALID_TYPES) {
      const bucket = parsed?.[type];
      if (bucket && typeof bucket === "object") {
        for (const [slug, pkg] of Object.entries(bucket)) {
          if (pkg && typeof pkg === "object" && typeof pkg.presetRange === "string") {
            out[type][slug] = pkg;
          }
        }
      }
    }
    return out;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(
      "[recipientPackages] VITE_RECIPIENT_PACKAGES_JSON failed to parse — falling back to empty registry. Raw value start:",
      typeof raw === "string" ? raw.slice(0, 80) : raw,
      err,
    );
    return { vc: {}, channel: {}, customer: {} };
  }
}

// Local override wins over env var when both are present (handy for local
// iteration without touching GitHub Actions Variables).
const REGISTRY = LOCAL_OVERRIDES
  ? parseRegistry(LOCAL_OVERRIDES)
  : parseRegistry(import.meta.env.VITE_RECIPIENT_PACKAGES_JSON);

export function isValidType(type) {
  return VALID_TYPES.includes(type);
}

export function getPackage(type, slug) {
  if (!isValidType(type) || !slug) return null;
  return REGISTRY[type]?.[slug] || null;
}

// Category-free resolution: look a slug up across every type bucket. This
// powers the bare `/:slug` route so outward-facing links carry no VC/Channel/
// Customer signal (the recipient's name is already in the slug). Slugs are
// expected to be globally unique; if the same slug somehow appears under two
// types we warn and return the first match in VALID_TYPES order.
export function getPackageBySlug(slug) {
  if (!slug) return null;
  let found = null;
  for (const type of VALID_TYPES) {
    const pkg = REGISTRY[type]?.[slug];
    if (pkg) {
      if (found) {
        // eslint-disable-next-line no-console
        console.warn(
          `[recipientPackages] slug "${slug}" is registered under multiple types; using the first match.`,
        );
        break;
      }
      found = pkg;
    }
  }
  return found;
}

// For the admin nav: returns all three sections in render order, each with
// its packages sorted by dateSent (newest first; missing dates sink). Empty
// sections are returned with an empty `items` array — the nav renders the
// header anyway so VC / Channel / Customer scaffold is always visible.
export function listAllForAdmin() {
  const sectionLabels = { vc: "VC", channel: "Channel", customer: "Customer" };
  return VALID_TYPES.map((type) => ({
    type,
    label: sectionLabels[type],
    items: Object.entries(REGISTRY[type] || {})
      .map(([slug, pkg]) => ({ slug, ...pkg }))
      .sort((a, b) => (b.dateSent || "").localeCompare(a.dateSent || "")),
  }));
}

export const TYPE_LABELS = { vc: "VC", channel: "Channel", customer: "Customer" };
