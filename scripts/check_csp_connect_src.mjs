#!/usr/bin/env node
/**
 * Build-time guard for the lead funnel's committed CSP meta policy.
 *
 * This module deliberately checks one boundary only: both browser fetches that
 * `src/lib/leadApi.js` builds must be admitted by every Content-Security-Policy
 * meta tag committed in `index.html`. Production also sends an independently
 * enforced CSP response header from Cloudflare. CORS, backend feature flags,
 * secret bindings, and that edge header remain deployment/IaC gates and must be
 * verified separately before the funnel is activated.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";

import { LEAD_API_PATHS } from "../src/lib/leadApiContract.js";

export const BUILD_MODE = "production";

const TRUE_VALUES = new Set(["1", "true", "yes"]);
const FALSE_VALUES = new Set(["", "0", "false", "no"]);
const HEAD_ELEMENT = /<head\b[^>]*>([\s\S]*?)<\/head>/i;
const SCHEME_ONLY_SOURCE = /^([a-z][a-z0-9+.-]*):$/i;
const EXPLICIT_SOURCE_SCHEME = /^[a-z][a-z0-9+.-]*:\/\//i;
const ATTRIBUTE_NAME = /[^\s=/>]+/y;
const UNQUOTED_ATTRIBUTE_VALUE = /[^\s"'=<>`]+/y;
const TAG_NAME_BOUNDARIES = new Set([" ", "\t", "\n", "\f", "\r", "/", ">"]);
const META_TAG_PREFIX = "<meta";
const WILDCARD_HOST_PLACEHOLDER = "csp-wildcard-placeholder";
const WILDCARD_PORT_PLACEHOLDER = "65535";

const modulePath = fileURLToPath(import.meta.url);
const moduleRoot = resolve(dirname(modulePath), "..");

export class CspGuardError extends Error {
  constructor(message) {
    super(message);
    this.name = "CspGuardError";
  }
}

/** Parse the origin-only HTTP(S) base required by leadApi's URL construction. */
export function parseApiBase(rawBase) {
  const base = String(rawBase ?? "").trim();
  let url;

  try {
    url = new URL(base);
  } catch {
    throw new CspGuardError(
      `VITE_API_BASE_URL must be a valid absolute HTTP(S) origin: ${base || "(empty)"}`,
    );
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new CspGuardError(
      `VITE_API_BASE_URL must use http: or https:, not ${url.protocol}`,
    );
  }
  if (url.username || url.password) {
    throw new CspGuardError(
      "VITE_API_BASE_URL must not contain user information.",
    );
  }
  if (url.pathname !== "/") {
    throw new CspGuardError(
      "VITE_API_BASE_URL must be an origin only; paths are not supported.",
    );
  }
  if (url.search) {
    throw new CspGuardError(
      "VITE_API_BASE_URL must be an origin only; query strings are not supported.",
    );
  }
  if (url.hash) {
    throw new CspGuardError(
      "VITE_API_BASE_URL must be an origin only; fragments are not supported.",
    );
  }

  return new URL(url.origin);
}

/** Build the exact URLs used by captureLead and verifyLead. */
export function leadApiEndpoints(apiBase) {
  return LEAD_API_PATHS.map((path) => new URL(path, apiBase));
}

/**
 * Resolve build settings with Vite's production-mode file precedence and then
 * overlay the process environment, matching Vite's documented priority.
 */
export function resolveBuildEnvironment({
  root,
  processEnv = process.env,
  loadEnvFn = loadEnv,
} = {}) {
  const fileEnv = loadEnvFn(BUILD_MODE, root, "");
  const base = String(
    processEnv.VITE_API_BASE_URL ?? fileEnv.VITE_API_BASE_URL ?? "",
  ).trim();
  const rawRequiredValue = String(
    processEnv.FUNNEL_REQUIRED ?? fileEnv.FUNNEL_REQUIRED ?? "",
  ).trim();
  const requiredValue = rawRequiredValue.toLowerCase();
  if (!TRUE_VALUES.has(requiredValue) && !FALSE_VALUES.has(requiredValue)) {
    throw new CspGuardError(
      "FUNNEL_REQUIRED must be empty/0/false/no or 1/true/yes; " +
        `received ${JSON.stringify(rawRequiredValue)}.`,
    );
  }

  return {
    base,
    funnelRequired: TRUE_VALUES.has(requiredValue),
  };
}

function skipWhitespace(input, start) {
  let cursor = start;
  while (cursor < input.length && /\s/.test(input[cursor])) {
    cursor += 1;
  }
  return cursor;
}

function matchAt(pattern, input, start) {
  pattern.lastIndex = start;
  return pattern.exec(input);
}

function readAttributeValue(tag, afterName) {
  let cursor = skipWhitespace(tag, afterName);
  if (tag[cursor] !== "=") {
    return { value: "", next: cursor };
  }

  cursor = skipWhitespace(tag, cursor + 1);
  const quote = tag[cursor];
  if (quote === '"' || quote === "'") {
    const closingQuote = tag.indexOf(quote, cursor + 1);
    if (closingQuote === -1) {
      throw new CspGuardError(
        "Content-Security-Policy meta tag contains an unterminated attribute.",
      );
    }
    return {
      value: tag.slice(cursor + 1, closingQuote),
      next: closingQuote + 1,
    };
  }

  const valueMatch = matchAt(UNQUOTED_ATTRIBUTE_VALUE, tag, cursor);
  if (valueMatch === null) {
    throw new CspGuardError(
      "Content-Security-Policy meta tag contains an invalid attribute value.",
    );
  }
  return {
    value: valueMatch[0],
    next: cursor + valueMatch[0].length,
  };
}

function parseMetaAttributes(tag) {
  const attributes = new Map();
  let cursor = META_TAG_PREFIX.length;

  while (cursor < tag.length) {
    cursor = skipWhitespace(tag, cursor);
    if (tag[cursor] === ">" || tag.startsWith("/>", cursor)) {
      break;
    }

    const nameMatch = matchAt(ATTRIBUTE_NAME, tag, cursor);
    if (nameMatch === null) {
      throw new CspGuardError(
        "Content-Security-Policy meta tag contains an invalid attribute.",
      );
    }
    const rawName = nameMatch[0];
    const name = rawName.toLowerCase();
    if (attributes.has(name)) {
      throw new CspGuardError(
        `Content-Security-Policy meta tag repeats the ${name} attribute.`,
      );
    }

    const { value, next } = readAttributeValue(tag, cursor + rawName.length);
    attributes.set(name, value);
    cursor = next;
  }

  return attributes;
}

function findTagEnd(markup, start) {
  let quote = null;

  for (let cursor = start; cursor < markup.length; cursor += 1) {
    const character = markup[cursor];
    if (quote !== null) {
      if (character === quote) quote = null;
    } else if (character === '"' || character === "'") {
      quote = character;
    } else if (character === ">") {
      return cursor;
    }
  }

  return -1;
}

function extractMetaTags(head) {
  const tags = [];
  let cursor = 0;

  while (cursor < head.length) {
    const start = head.indexOf("<", cursor);
    if (start === -1) break;

    const candidate = head.slice(start, start + META_TAG_PREFIX.length);
    if (candidate.toLowerCase() !== META_TAG_PREFIX) {
      cursor = start + 1;
      continue;
    }

    const boundary = head[start + META_TAG_PREFIX.length];
    if (!TAG_NAME_BOUNDARIES.has(boundary)) {
      cursor = start + META_TAG_PREFIX.length;
      continue;
    }

    const end = findTagEnd(head, start + META_TAG_PREFIX.length);
    if (end === -1) {
      throw new CspGuardError(
        "Content-Security-Policy meta tag contains an unterminated attribute.",
      );
    }
    tags.push(head.slice(start, end + 1));
    cursor = end + 1;
  }

  return tags;
}

/** Return every enforced CSP meta policy; browsers apply their intersection. */
export function extractMetaCspPolicies(html) {
  const head = HEAD_ELEMENT.exec(String(html))?.[1];
  if (head === undefined) {
    throw new CspGuardError(
      "index.html must contain a complete head element for its CSP meta policy.",
    );
  }

  const policies = [];

  for (const tag of extractMetaTags(head)) {
    const attributes = parseMetaAttributes(tag);
    if (
      attributes.get("http-equiv")?.toLowerCase() === "content-security-policy"
    ) {
      const content = attributes.get("content");
      if (!content?.trim()) {
        throw new CspGuardError(
          "Content-Security-Policy meta tag has no non-empty content attribute.",
        );
      }
      policies.push(content);
    }
  }

  if (policies.length === 0) {
    throw new CspGuardError(
      "No Content-Security-Policy meta tag was found in index.html.",
    );
  }

  return policies;
}

/** Parse one policy's explicit connect-src source list. */
export function connectSources(policy) {
  let sources;

  for (const rawDirective of policy.split(";")) {
    const directive = rawDirective.trim();
    if (!directive) continue;

    const [rawName, ...values] = directive.split(/\s+/);
    if (rawName.toLowerCase() !== "connect-src") continue;
    if (sources !== undefined) {
      throw new CspGuardError(
        "Content-Security-Policy meta tag declares connect-src more than once.",
      );
    }
    sources = values;
  }

  if (sources === undefined) {
    throw new CspGuardError(
      "Content-Security-Policy meta tag must declare connect-src explicitly.",
    );
  }
  if (sources.length === 0) {
    throw new CspGuardError(
      "Content-Security-Policy meta connect-src is empty and blocks every connection.",
    );
  }
  if (
    sources.some((source) => source.toLowerCase() === "'none'") &&
    sources.length !== 1
  ) {
    throw new CspGuardError(
      "Content-Security-Policy meta connect-src mixes 'none' with other sources.",
    );
  }

  return sources;
}

function effectivePort(url) {
  if (url.port) return url.port;
  if (url.protocol === "https:" || url.protocol === "wss:") return "443";
  if (url.protocol === "http:" || url.protocol === "ws:") return "80";
  return "";
}

function schemePartMatches(sourceProtocol, targetProtocol) {
  const source = sourceProtocol.replace(/:$/, "").toLowerCase();
  const target = targetProtocol.replace(/:$/, "").toLowerCase();
  return (
    source === target ||
    (source === "http" && target === "https") ||
    (source === "ws" && ["wss", "http", "https"].includes(target)) ||
    (source === "wss" && target === "https")
  );
}

function portPartMatches(source, target, hasWildcardPort) {
  if (hasWildcardPort) return true;

  const sourcePort = effectivePort(source);
  const targetPort = effectivePort(target);
  if (sourcePort === targetPort) return true;

  // CSP3 treats an insecure default-port source as matching the corresponding
  // secure default-port upgrade (http/ws :80 -> https/wss :443).
  return (
    sourcePort === "80" &&
    targetPort === "443" &&
    schemePartMatches(source.protocol, target.protocol)
  );
}

function hostSourceParts(source, selfOrigin) {
  if (source.includes("@") || source.includes("?") || source.includes("#")) {
    return null;
  }

  const hasScheme = EXPLICIT_SOURCE_SCHEME.test(source);
  if (!hasScheme && !selfOrigin) return null;

  const authorityAndPath = hasScheme
    ? source.slice(source.indexOf("://") + 3)
    : source;
  const slashIndex = authorityAndPath.indexOf("/");
  const authority =
    slashIndex === -1
      ? authorityAndPath
      : authorityAndPath.slice(0, slashIndex);
  const sourcePath =
    slashIndex === -1 ? null : authorityAndPath.slice(slashIndex);
  const hasWildcardHost = authority.startsWith("*.");
  const hasWildcardPort = authority.endsWith(":*");

  if (authority.includes("*") && !hasWildcardHost && !hasWildcardPort) {
    return null;
  }

  const schemePrefix = hasScheme ? "" : `${new URL(selfOrigin).protocol}//`;
  const parseableSource = `${schemePrefix}${source}`
    .replace("*.", `${WILDCARD_HOST_PLACEHOLDER}.`)
    .replace(/:\*(?=\/|$)/, `:${WILDCARD_PORT_PLACEHOLDER}`);

  let parsed;
  try {
    parsed = new URL(parseableSource);
  } catch {
    return null;
  }

  return {
    parsed,
    hasScheme,
    hasWildcardHost,
    hasWildcardPort,
    sourcePath,
  };
}

function selfSourceAllowsUrl(source, target, selfOrigin) {
  if (source.toLowerCase() !== "'self'" || selfOrigin === null) return false;

  const ownOrigin = new URL(selfOrigin);
  const portsMatch =
    effectivePort(ownOrigin) === effectivePort(target) ||
    (!ownOrigin.port && !target.port);
  return (
    ownOrigin.hostname === target.hostname &&
    schemePartMatches(ownOrigin.protocol, target.protocol) &&
    portsMatch
  );
}

function hostPartMatches(parsed, target, hasWildcardHost) {
  if (!hasWildcardHost) return parsed.hostname === target.hostname;

  const suffix = parsed.hostname.replace(`${WILDCARD_HOST_PLACEHOLDER}.`, "");
  return target.hostname.endsWith(`.${suffix}`);
}

function pathPartMatches(sourcePath, targetPath) {
  if (sourcePath === null) return true;
  if (sourcePath.endsWith("/")) return targetPath.startsWith(sourcePath);
  return targetPath === sourcePath;
}

/** Return whether one CSP source expression admits one concrete endpoint URL. */
export function sourceAllowsUrl(source, target, selfOrigin = null) {
  if (source === "*") return true;
  if (source.startsWith("'")) {
    return selfSourceAllowsUrl(source, target, selfOrigin);
  }
  const schemeOnly = SCHEME_ONLY_SOURCE.exec(source);
  if (schemeOnly) {
    return schemePartMatches(schemeOnly[1], target.protocol);
  }

  const parts = hostSourceParts(source, selfOrigin);
  if (parts === null) return false;

  const { parsed, hasWildcardHost, hasWildcardPort, sourcePath } = parts;

  if (!schemePartMatches(parsed.protocol, target.protocol)) return false;
  if (!hostPartMatches(parsed, target, hasWildcardHost)) return false;
  if (!portPartMatches(parsed, target, hasWildcardPort)) return false;
  return pathPartMatches(sourcePath, target.pathname);
}

/**
 * Verify that every exact lead endpoint is admitted by every committed meta
 * policy. Multiple policies are intersected by browsers, so one denial fails.
 */
export function validateMetaCsp({ html, apiBase, selfOrigin = null }) {
  const endpoints = leadApiEndpoints(apiBase);
  const policies = extractMetaCspPolicies(html);

  policies.forEach((policy, policyIndex) => {
    const sources = connectSources(policy);
    endpoints.forEach((endpoint) => {
      if (
        !sources.some((source) => sourceAllowsUrl(source, endpoint, selfOrigin))
      ) {
        throw new CspGuardError(
          `meta CSP policy ${policyIndex + 1} blocks ${endpoint.href}; ` +
            `connect-src allows: ${sources.join(" ")}`,
        );
      }
    });
  });

  return { endpoints, policyCount: policies.length };
}

function readSelfOrigin(root) {
  const cnamePath = resolve(root, "public", "CNAME");
  if (!existsSync(cnamePath)) return null;

  const hostname = readFileSync(cnamePath, "utf8").trim();
  return hostname ? new URL(`https://${hostname}`).origin : null;
}

function activationBoundaryLines() {
  return [
    "[csp-check] Scope: committed index.html CSP meta policy only.",
    "[csp-check] Activation also requires the Cloudflare CSP response header,",
    "[csp-check] backend/Istio CORS, feature flag + secret bindings, and the",
    "[csp-check] compatible backend/portal deploy as separate deployment/IaC gates.",
  ];
}

/** Execute the CLI behavior without terminating the importing process. */
export function runGuard({
  root = moduleRoot,
  processEnv = process.env,
  loadEnvFn = loadEnv,
  log = console.log,
  error = console.error,
} = {}) {
  try {
    const { base, funnelRequired } = resolveBuildEnvironment({
      root,
      processEnv,
      loadEnvFn,
    });

    if (!base) {
      if (funnelRequired) {
        throw new CspGuardError(
          "FUNNEL_REQUIRED is set but VITE_API_BASE_URL is empty; " +
            "this build would deploy the funnel dormant.",
        );
      }
      log(
        "[csp-check] VITE_API_BASE_URL is unset — funnel intentionally dormant.",
      );
      return 0;
    }

    const apiBase = parseApiBase(base);
    if (funnelRequired && apiBase.protocol !== "https:") {
      throw new CspGuardError(
        "FUNNEL_REQUIRED builds must use an HTTPS VITE_API_BASE_URL.",
      );
    }
    const html = readFileSync(resolve(root, "index.html"), "utf8");
    const selfOrigin = readSelfOrigin(root);
    const { endpoints, policyCount } = validateMetaCsp({
      html,
      apiBase,
      selfOrigin,
    });

    log(
      `[csp-check] OK — ${endpoints.length} lead endpoints are allowed by ` +
        `${policyCount} committed CSP meta ${policyCount === 1 ? "policy" : "policies"}.`,
    );
    activationBoundaryLines().forEach((line) => log(line));
    return 0;
  } catch (guardError) {
    const message =
      guardError instanceof Error ? guardError.message : String(guardError);
    error(`[csp-check] BUILD BLOCKED — ${message}`);
    activationBoundaryLines().forEach((line) => error(line));
    return 1;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === modulePath) {
  process.exitCode = runGuard();
}
