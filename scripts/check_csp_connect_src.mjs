#!/usr/bin/env node
/**
 * Build-time guard: the funnel's API origin must be allowed by the page's CSP.
 *
 * WHY THIS EXISTS. Turning the lead funnel on looks like one switch --
 * `VITE_API_BASE_URL` -- but it is two. `index.html` ships a
 * `Content-Security-Policy` meta tag whose `connect-src` is a STATIC allowlist.
 * Point `VITE_API_BASE_URL` at a host that is not on it and every symptom lies:
 * the page renders, the funnel looks live, the button responds, and the fetch is
 * killed by the browser before it leaves. `leadApi` cannot tell a CSP block from
 * a dead network, so the visitor gets a generic "network error" and the operator
 * gets nothing. Nothing else in the build, the tests or the deploy workflow
 * catches it. The failure mode is a fully deployed, plausible-looking,
 * non-functional funnel; this turns it into a build error naming both values.
 *
 * Deliberately NOT doing the "helpful" thing of rewriting the CSP to include the
 * host: widening a security header as a silent side effect of setting an
 * unrelated env var is exactly the kind of thing a reviewer should have to see.
 *
 * READ THE SAME INPUT THE BUNDLER READS. An earlier version read
 * `process.env.VITE_API_BASE_URL`, which Vite does NOT use as its only source:
 * it resolves `.env`, `.env.local`, `.env.[mode]` and `.env.[mode].local` from
 * the project root as well. `.env.example` in this repo instructs developers to
 * "copy this file to .env.local", so the documented developer path produced a
 * guard that printed "funnel dormant, skipping" and exited 0 while Vite inlined
 * a real URL into the bundle -- the exact false green this script exists to
 * prevent, in the script itself. `.gitignore` lists a bare `.env`, so a
 * committed `.env.production` is not ignored and would carry that false green
 * into the deploy. `loadEnv` is the bundler's own resolution, so the two cannot
 * diverge again.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { loadEnv } from "vite";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const indexHtml = resolve(root, "index.html");

const mode = process.env.NODE_ENV || "production";
const base = (loadEnv(mode, root, "VITE_").VITE_API_BASE_URL || "").trim();

/**
 * The page's own origin, for resolving `'self'`.
 *
 * A GitHub Pages custom domain is declared in `public/CNAME`, so this is known
 * at build time. Resolving it matters: a same-origin API is legitimately covered
 * by `'self'` and must not be reported as blocked. Treating `'self'` as
 * "unknown, therefore no match" is a false RED, which teaches people to bypass
 * the guard -- the more corrosive of the two failure directions, because nobody
 * files it as a bug.
 */
const cnamePath = resolve(root, "public", "CNAME");
const selfOrigin = existsSync(cnamePath)
  ? `https://${readFileSync(cnamePath, "utf8").trim()}`
  : null;

// Dormant is a supported, deliberate state: `leadApi` makes no cross-origin call
// at all without a base URL. But "dormant" and "someone cleared the Actions
// variable" are indistinguishable from here, and both ship a funnel that never
// captures a lead -- so allow a build to DECLARE that it expects a live funnel
// and fail when it is not.
const funnelRequired = /^(1|true|yes)$/i.test((process.env.FUNNEL_REQUIRED || "").trim());

if (!base) {
  if (funnelRequired) {
    console.error("");
    console.error("[csp-check] BUILD BLOCKED — FUNNEL_REQUIRED is set but VITE_API_BASE_URL is empty.");
    console.error("  This build declared a live funnel and would have deployed a dormant one:");
    console.error("  the page renders and the CTA opens, but no lead is ever captured.");
    console.error("");
    process.exit(1);
  }
  console.log("[csp-check] VITE_API_BASE_URL is unset — funnel dormant, skipping.");
  process.exit(0);
}

let apiUrl;
try {
  apiUrl = new URL(base);
} catch {
  console.error(`[csp-check] VITE_API_BASE_URL is not a valid absolute URL: ${base}`);
  process.exit(1);
}
const apiOrigin = apiUrl.origin;

const html = readFileSync(indexHtml, "utf8");
// The quote char is captured and back-referenced rather than using a character
// class: the CSP value itself contains single quotes (`'self'`, `'none'`), so a
// naive [^"']+ terminates at the first source expression and silently reports
// "no connect-src directive".
const cspMatch = html.match(
  /http-equiv=(["'])Content-Security-Policy\1[^>]*?content=(["'])([\s\S]*?)\2/i,
);
if (!cspMatch) {
  console.error(`[csp-check] No Content-Security-Policy meta tag found in ${indexHtml}.`);
  console.error("[csp-check] If the CSP moved to a header, update or retire this check deliberately.");
  process.exit(1);
}

const connectDirective = cspMatch[3]
  .split(";")
  .map((d) => d.trim())
  .find((d) => d === "connect-src" || d.startsWith("connect-src "));

if (connectDirective === undefined) {
  console.error("[csp-check] CSP declares no connect-src; it falls back to default-src, which this");
  console.error("[csp-check] check cannot reason about. Declare connect-src explicitly.");
  process.exit(1);
}

const connectSrc = connectDirective.split(/\s+/).slice(1);
if (connectSrc.length === 0) {
  // An EMPTY connect-src blocks every connection outright — it does not fall
  // back to default-src. Fail closed, and say the right thing about why.
  console.error("[csp-check] connect-src is present but empty, which blocks every connection.");
  process.exit(1);
}

/** Does one connect-src source expression admit this origin? */
function admits(source, url) {
  if (source === "*") return true;

  if (source.startsWith("'")) {
    // Only `'self'` names an origin; `'none'`, `'unsafe-inline'` etc. never
    // admit a fetch target.
    return source === "'self'" && selfOrigin !== null && url.origin === selfOrigin;
  }

  // A scheme-only source such as `https:` admits every origin on that scheme.
  const schemeOnly = source.match(/^([a-z][a-z0-9+.-]*):$/i);
  if (schemeOnly) return url.protocol === `${schemeOnly[1].toLowerCase()}:`;

  const hasScheme = source.includes("://");
  const withScheme = hasScheme ? source : `https://${source}`;
  let parsed;
  try {
    parsed = new URL(withScheme.replace("*.", "wildcard-placeholder."));
  } catch {
    return false;
  }

  // Scheme must match when the source states one. Without this, `wss://*.x.com`
  // green-lights an `https://api.x.com` base URL that the browser will block —
  // and this CSP really does carry wss-only entries.
  if (hasScheme && parsed.protocol !== url.protocol) return false;

  if (source.includes("*.")) {
    const suffix = parsed.host.replace("wildcard-placeholder.", "");
    // `*.example.com` matches `a.example.com`, and NOT bare `example.com`.
    return url.host.endsWith(`.${suffix}`);
  }
  return url.host === parsed.host;
}

if (connectSrc.some((source) => admits(source, apiUrl))) {
  console.log(`[csp-check] OK — ${apiOrigin} is allowed by connect-src.`);
  process.exit(0);
}

console.error("");
console.error("[csp-check] BUILD BLOCKED — the funnel would deploy dead.");
console.error("");
console.error(`  VITE_API_BASE_URL origin : ${apiOrigin}`);
console.error(`  page origin ('self')     : ${selfOrigin ?? "unknown (no public/CNAME)"}`);
console.error(`  connect-src allows       : ${connectSrc.join(" ")}`);
console.error("");
console.error("  Every lead-funnel fetch would be blocked by the browser before it left the");
console.error("  page, and would surface to the visitor as a generic network error.");
console.error("");
console.error("  Fix ONE of these, deliberately:");
console.error("    - point VITE_API_BASE_URL at a host already on connect-src, or");
console.error(`    - add ${apiOrigin} to connect-src in index.html (a reviewed CSP change).`);
console.error("");
process.exit(1);
