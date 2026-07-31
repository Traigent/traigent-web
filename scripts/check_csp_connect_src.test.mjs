import assert from "node:assert/strict";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";

import {
  LEAD_API_PATHS,
  LEAD_CAPTURE_PATH,
  LEAD_VERIFY_PATH,
} from "../src/lib/leadApiContract.js";
import {
  BUILD_MODE,
  CspGuardError,
  connectSources,
  extractMetaCspPolicies,
  leadApiEndpoints,
  parseApiBase,
  resolveBuildEnvironment,
  runGuard,
  sourceAllowsUrl,
  validateMetaCsp,
} from "./check_csp_connect_src.mjs";

const SELF_ORIGIN = "https://traigent.ai";
const API_ORIGIN = "https://api.example.test";
const META = (connectSrc) =>
  `<meta content="default-src 'self'; connect-src ${connectSrc}" ` +
  `http-equiv="Content-Security-Policy">`;
const DOCUMENT = (...headContent) =>
  `<!doctype html><html><head>${headContent.join("\n")}</head><body></body></html>`;

function withFixture(files, callback) {
  const root = mkdtempSync(join(tmpdir(), "traigent-csp-"));
  try {
    for (const [relativePath, content] of Object.entries(files)) {
      const target = resolve(root, relativePath);
      mkdirSync(resolve(target, ".."), { recursive: true });
      writeFileSync(target, content, "utf8");
    }
    return callback(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test("parseApiBase accepts origin-only HTTP(S) URLs and valid ports", () => {
  assert.equal(parseApiBase("https://api.example.test").href, `${API_ORIGIN}/`);
  assert.equal(
    parseApiBase("https://api.example.test:443/").href,
    `${API_ORIGIN}/`,
  );
  assert.equal(
    parseApiBase("http://api.example.test:8080").href,
    "http://api.example.test:8080/",
  );
});

test("parseApiBase rejects unusable or non-origin values", () => {
  for (const invalid of [
    "wss://api.example.test",
    "ftp://api.example.test",
    "https://user:password@api.example.test",
    "https://api.example.test/prefix",
    "https://api.example.test?mode=wrong",
    "https://api.example.test#fragment",
    "https://api.example.test:65536",
    "https://1.1.1.1",
    "https://[::1]",
    "http://127.1:5000",
    "http://2130706433:5000",
    "http://0x7f000001:5000",
    "not-a-url",
  ]) {
    assert.throws(() => parseApiBase(invalid), CspGuardError, invalid);
  }
  assert.equal(
    parseApiBase("http://127.0.0.1:5000").href,
    "http://127.0.0.1:5000/",
  );
});

test("leadApiEndpoints returns both exact client request URLs", () => {
  assert.deepEqual(LEAD_API_PATHS, [LEAD_CAPTURE_PATH, LEAD_VERIFY_PATH]);
  assert.deepEqual(
    leadApiEndpoints(parseApiBase(API_ORIGIN)).map((url) => url.href),
    [`${API_ORIGIN}/api/v1/leads`, `${API_ORIGIN}/api/v1/leads/verify`],
  );
});

test("source matching handles self, exact hosts, and wildcard subdomains", () => {
  const selfTarget = new URL(`${SELF_ORIGIN}/api/v1/leads`);
  const apiTarget = new URL(`${API_ORIGIN}/api/v1/leads`);

  assert.equal(sourceAllowsUrl("'self'", selfTarget, SELF_ORIGIN), true);
  assert.equal(sourceAllowsUrl("'SELF'", selfTarget, SELF_ORIGIN), true);
  assert.equal(sourceAllowsUrl("'self'", apiTarget, SELF_ORIGIN), false);
  assert.equal(sourceAllowsUrl(API_ORIGIN, apiTarget, SELF_ORIGIN), true);
  assert.equal(
    sourceAllowsUrl(
      "https://*.example.test",
      new URL("https://sub.example.test/api/v1/leads"),
      SELF_ORIGIN,
    ),
    true,
  );
  assert.equal(
    sourceAllowsUrl(
      "https://*.example.test",
      new URL("https://example.test/api/v1/leads"),
      SELF_ORIGIN,
    ),
    false,
  );
  // CSP3 host-part matching deliberately rejects IP literals other than the
  // explicit 127.0.0.1 exception. URL() itself accepts and canonicalizes them,
  // so this must not be delegated to the generic URL host comparison.
  assert.equal(
    sourceAllowsUrl(
      "https://1.1.1.1",
      new URL("https://1.1.1.1/api/v1/leads"),
      SELF_ORIGIN,
    ),
    false,
  );
  assert.equal(
    sourceAllowsUrl(
      "http://127.0.0.1:5000",
      new URL("http://127.0.0.1:5000/api/v1/leads"),
      SELF_ORIGIN,
    ),
    true,
  );
  for (const nonCanonicalLoopback of [
    "http://127.1:5000",
    "http://2130706433:5000",
    "http://0x7f000001:5000",
  ]) {
    assert.equal(
      sourceAllowsUrl(
        nonCanonicalLoopback,
        new URL("http://127.0.0.1:5000/api/v1/leads"),
        SELF_ORIGIN,
      ),
      false,
      nonCanonicalLoopback,
    );
  }
});

test("bare wildcard host sources respect scheme, port, path, and IP rules", () => {
  const capture = new URL(`${API_ORIGIN}/api/v1/leads`);
  const verify = new URL(`${API_ORIGIN}/api/v1/leads/verify`);
  const customPort = new URL("https://other.example.test:8443/api/v1/leads");

  assert.equal(sourceAllowsUrl("https://*", capture, SELF_ORIGIN), true);
  assert.equal(sourceAllowsUrl("http://*", capture, SELF_ORIGIN), true);
  assert.equal(
    sourceAllowsUrl(
      "https://*",
      new URL("http://api.example.test/api/v1/leads"),
      SELF_ORIGIN,
    ),
    false,
  );

  assert.equal(
    sourceAllowsUrl("https://*:8443", customPort, SELF_ORIGIN),
    true,
  );
  assert.equal(
    sourceAllowsUrl("https://*:443", customPort, SELF_ORIGIN),
    false,
  );
  assert.equal(sourceAllowsUrl("https://*:*", customPort, SELF_ORIGIN), true);
  assert.equal(sourceAllowsUrl("*:443", capture, SELF_ORIGIN), true);
  assert.equal(
    sourceAllowsUrl(
      "https://*:*/api/*",
      new URL("https://other.example.test:8443/api/*"),
      SELF_ORIGIN,
    ),
    true,
  );
  assert.equal(
    sourceAllowsUrl(
      "https://*:*/api/*",
      new URL("https://other.example.test:8443/api/value"),
      SELF_ORIGIN,
    ),
    false,
  );

  assert.equal(
    sourceAllowsUrl("https://*/api/v1/leads", capture, SELF_ORIGIN),
    true,
  );
  assert.equal(
    sourceAllowsUrl("https://*/api/v1/leads", verify, SELF_ORIGIN),
    false,
  );
  assert.equal(sourceAllowsUrl("https://*/api/v1/", verify, SELF_ORIGIN), true);

  assert.equal(
    sourceAllowsUrl(
      "http://*:5000",
      new URL("http://127.0.0.1:5000/api/v1/leads"),
      SELF_ORIGIN,
    ),
    false,
  );
  assert.equal(
    sourceAllowsUrl(
      "https://*",
      new URL("https://1.1.1.1/api/v1/leads"),
      SELF_ORIGIN,
    ),
    false,
  );
});

test("source matching rejects URL spellings outside CSP host-source grammar", () => {
  for (const [source, target] of [
    ["https://%61pi.example.test", `${API_ORIGIN}/api/v1/leads`],
    ["https://éxample.test", "https://éxample.test/api/v1/leads"],
    ["https://api_example.test", "https://api_example.test/api/v1/leads"],
    ["https://api.example.test:", `${API_ORIGIN}/api/v1/leads`],
  ]) {
    assert.equal(
      sourceAllowsUrl(source, new URL(target), SELF_ORIGIN),
      false,
      source,
    );
  }
});

test("meta validation rejects URL-canonicalized loopback host sources", () => {
  const apiBase = parseApiBase("http://127.0.0.1:5000");
  for (const nonCanonicalLoopback of [
    "http://127.1:5000",
    "http://2130706433:5000",
    "http://0x7f000001:5000",
  ]) {
    assert.throws(
      () =>
        validateMetaCsp({
          html: DOCUMENT(META(nonCanonicalLoopback)),
          apiBase,
          selfOrigin: SELF_ORIGIN,
        }),
      /meta CSP policy 1 blocks/,
      nonCanonicalLoopback,
    );
  }
});

test("source matching respects schemes and effective ports", () => {
  const secureDefault = new URL("https://api.example.test/api/v1/leads");
  const secureCustom = new URL("https://api.example.test:8443/api/v1/leads");

  assert.equal(
    sourceAllowsUrl("https://api.example.test:443", secureDefault, SELF_ORIGIN),
    true,
  );
  assert.equal(
    sourceAllowsUrl("https://api.example.test:8443", secureCustom, SELF_ORIGIN),
    true,
  );
  assert.equal(
    sourceAllowsUrl("https://api.example.test:9443", secureCustom, SELF_ORIGIN),
    false,
  );
  assert.equal(
    sourceAllowsUrl("https://api.example.test:*", secureCustom, SELF_ORIGIN),
    true,
  );
  assert.equal(
    sourceAllowsUrl("http://api.example.test:8443", secureCustom, SELF_ORIGIN),
    true,
  );
  assert.equal(
    sourceAllowsUrl("http://api.example.test:80", secureDefault, SELF_ORIGIN),
    true,
  );
  assert.equal(
    sourceAllowsUrl(
      "https://api.example.test:8443",
      new URL("http://api.example.test:8443/api/v1/leads"),
      SELF_ORIGIN,
    ),
    false,
  );
  assert.equal(
    sourceAllowsUrl("wss://api.example.test:8443", secureCustom, SELF_ORIGIN),
    true,
  );
  assert.equal(sourceAllowsUrl("http:", secureDefault, SELF_ORIGIN), true);
  assert.equal(sourceAllowsUrl("https:", secureDefault, SELF_ORIGIN), true);
});

test("source matching applies CSP path restrictions to the real endpoints", () => {
  const [capture, verify] = leadApiEndpoints(parseApiBase(API_ORIGIN));

  assert.equal(
    sourceAllowsUrl(`${API_ORIGIN}/api/v1/leads`, capture, SELF_ORIGIN),
    true,
  );
  assert.equal(
    sourceAllowsUrl(`${API_ORIGIN}/api/v1/leads`, verify, SELF_ORIGIN),
    false,
  );
  assert.equal(
    sourceAllowsUrl(`${API_ORIGIN}/api/v1/`, verify, SELF_ORIGIN),
    true,
  );
});

test("meta parser accepts attribute order and intersects multiple policies", () => {
  const html = DOCUMENT(
    "<title>\u0130</title>",
    '<meta name="description" content="2 > 1">',
    META(`${API_ORIGIN} 'self'`),
    `<meta http-equiv='Content-Security-Policy' content="connect-src ${API_ORIGIN}">`,
  );
  const unquotedName = DOCUMENT(
    `<meta data-guard http-equiv=Content-Security-Policy ` +
      `content='connect-src ${API_ORIGIN}' />`,
  );

  assert.equal(extractMetaCspPolicies(html).length, 2);
  assert.deepEqual(extractMetaCspPolicies(unquotedName), [
    `connect-src ${API_ORIGIN}`,
  ]);
  assert.equal(
    validateMetaCsp({
      html,
      apiBase: parseApiBase(API_ORIGIN),
      selfOrigin: SELF_ORIGIN,
    }).policyCount,
    2,
  );

  assert.throws(
    () =>
      validateMetaCsp({
        html: DOCUMENT(META(API_ORIGIN), META("'self'")),
        apiBase: parseApiBase(API_ORIGIN),
        selfOrigin: SELF_ORIGIN,
      }),
    /policy 2 blocks/,
  );
});

test("inert meta-like markup cannot satisfy the committed CSP guard", () => {
  const inertCandidates = [
    `<!-- ${META(API_ORIGIN)} -->`,
    `<script type="text/plain">${META(API_ORIGIN)}</script>`,
    `<template>${META(API_ORIGIN)}</template>`,
    `<noscript>${META(API_ORIGIN)}</noscript>`,
    `<div>${META(API_ORIGIN)}</div>`,
  ];

  for (const inert of inertCandidates) {
    assert.throws(
      () => extractMetaCspPolicies(DOCUMENT(inert)),
      /No Content-Security-Policy|complete head element/,
      inert,
    );
    // A body-only element implicitly closes <head>; a later literal meta tag is
    // therefore also outside the browser's enforced head and must not rescue
    // the document. The other inert contexts leave <head> open, so a real
    // sibling policy remains enforceable.
    if (inert.startsWith("<div>")) {
      assert.throws(
        () => extractMetaCspPolicies(DOCUMENT(inert, META(API_ORIGIN))),
        /No Content-Security-Policy|complete head element/,
        inert,
      );
    } else {
      assert.deepEqual(
        extractMetaCspPolicies(DOCUMENT(inert, META(API_ORIGIN))),
        [`default-src 'self'; connect-src ${API_ORIGIN}`],
        inert,
      );
    }
  }
});

test("malformed or ambiguous meta CSP fails closed", () => {
  assert.throws(() => extractMetaCspPolicies(DOCUMENT()), /No Content/);
  assert.throws(
    () =>
      extractMetaCspPolicies(
        DOCUMENT('<meta http-equiv="Content-Security-Policy" content="">'),
      ),
    /non-empty content/,
  );
  assert.throws(
    () =>
      extractMetaCspPolicies(
        DOCUMENT(
          "<meta http-equiv=Content-Security-Policy content=>",
          META(API_ORIGIN),
        ),
      ),
    /invalid attribute value/,
  );
  assert.throws(
    () => extractMetaCspPolicies(DOCUMENT(`<meta /oops>${META(API_ORIGIN)}`)),
    /invalid attribute/,
  );
  assert.throws(
    () =>
      extractMetaCspPolicies(
        DOCUMENT(
          `<meta http-equiv="Content-Security-Policy" ` +
            `content="connect-src ${API_ORIGIN}>`,
        ),
      ),
    /unterminated attribute|complete head element/,
  );
  assert.throws(
    () =>
      extractMetaCspPolicies(
        DOCUMENT(
          `<meta http-equiv="Content-Security-Policy" ` +
            `content="connect-src 'none'" content="connect-src ${API_ORIGIN}">`,
        ),
      ),
    /repeats the content attribute/,
  );
  assert.throws(
    () =>
      extractMetaCspPolicies(`<html><body>${META(API_ORIGIN)}</body></html>`),
    /complete head element/,
  );
  assert.throws(
    () => connectSources("default-src 'self'"),
    /declare connect-src explicitly/,
  );
  assert.throws(() => connectSources("connect-src"), /empty/);
  assert.throws(
    () => connectSources("connect-src 'self'; connect-src https:"),
    /more than once/,
  );
  assert.throws(
    () => connectSources("connect-src 'none' https:"),
    /mixes 'none'/,
  );
});

test("build environment is pinned to Vite production mode and process wins", () => {
  let observedMode;
  const result = resolveBuildEnvironment({
    root: "/unused",
    processEnv: {
      VITE_API_BASE_URL: "https://process.example.test",
      FUNNEL_REQUIRED: "YES",
    },
    loadEnvFn: (mode) => {
      observedMode = mode;
      return {
        VITE_API_BASE_URL: "https://file.example.test",
        FUNNEL_REQUIRED: "false",
      };
    },
  });

  assert.equal(observedMode, BUILD_MODE);
  assert.deepEqual(result, {
    base: "https://process.example.test",
    funnelRequired: true,
  });
});

test("build environment trims the runtime URL and rejects a required-flag typo", () => {
  assert.deepEqual(
    resolveBuildEnvironment({
      root: "/unused",
      processEnv: {
        VITE_API_BASE_URL: `  ${API_ORIGIN}  `,
        FUNNEL_REQUIRED: " false ",
      },
      loadEnvFn: () => ({}),
    }),
    { base: API_ORIGIN, funnelRequired: false },
  );

  assert.throws(
    () =>
      resolveBuildEnvironment({
        root: "/unused",
        processEnv: { FUNNEL_REQUIRED: "tru" },
        loadEnvFn: () => ({}),
      }),
    /FUNNEL_REQUIRED must be/,
  );
});

test("real Vite env precedence uses production.local over lower layers", () => {
  withFixture(
    {
      ".env": "VITE_API_BASE_URL=https://base.example.test\n",
      ".env.local": "VITE_API_BASE_URL=https://local.example.test\n",
      ".env.production": "VITE_API_BASE_URL=https://production.example.test\n",
      ".env.production.local":
        "VITE_API_BASE_URL=https://production-local.example.test\n",
    },
    (root) => {
      const original = process.env.VITE_API_BASE_URL;
      delete process.env.VITE_API_BASE_URL;
      try {
        assert.equal(
          resolveBuildEnvironment({ root, processEnv: {} }).base,
          "https://production-local.example.test",
        );
      } finally {
        if (original === undefined) {
          delete process.env.VITE_API_BASE_URL;
        } else {
          process.env.VITE_API_BASE_URL = original;
        }
      }
    },
  );
});

test("runGuard distinguishes dormant, required, allowed, and blocked builds", () => {
  const html = DOCUMENT(META(`${API_ORIGIN} 'self'`));
  withFixture(
    {
      "index.html": "this caller-controlled file must never be read",
      "public/CNAME": "attacker.example.test\n",
    },
    (root) => {
      const messages = [];
      const logger = (...args) => {
        assert.equal(args.length, 1, "each diagnostic must be one clean line");
        messages.push(args[0]);
      };
      const loadEnvFn = () => ({});

      assert.equal(
        runGuard({
          root,
          html,
          selfOrigin: SELF_ORIGIN,
          processEnv: {},
          loadEnvFn,
          log: logger,
          error: logger,
        }),
        0,
      );
      assert.match(messages.at(-1), /intentionally dormant/);

      messages.length = 0;
      assert.equal(
        runGuard({
          root,
          html,
          selfOrigin: SELF_ORIGIN,
          processEnv: { FUNNEL_REQUIRED: "1" },
          loadEnvFn,
          log: logger,
          error: logger,
        }),
        1,
      );
      assert.match(messages[0], /FUNNEL_REQUIRED/);

      messages.length = 0;
      assert.equal(
        runGuard({
          root,
          html,
          selfOrigin: SELF_ORIGIN,
          processEnv: { FUNNEL_REQUIRED: "tru" },
          loadEnvFn,
          log: logger,
          error: logger,
        }),
        1,
      );
      assert.match(messages[0], /FUNNEL_REQUIRED must be/);

      messages.length = 0;
      assert.equal(
        runGuard({
          root,
          html,
          selfOrigin: SELF_ORIGIN,
          processEnv: {
            FUNNEL_REQUIRED: "1",
            VITE_API_BASE_URL: "http://api.example.test",
          },
          loadEnvFn,
          log: logger,
          error: logger,
        }),
        1,
      );
      assert.match(messages[0], /must use an HTTPS/);

      messages.length = 0;
      assert.equal(
        runGuard({
          root,
          html,
          selfOrigin: SELF_ORIGIN,
          processEnv: {
            FUNNEL_REQUIRED: "1",
            VITE_API_BASE_URL: API_ORIGIN,
          },
          loadEnvFn,
          log: logger,
          error: logger,
        }),
        0,
      );
      assert.match(messages[0], /2 lead endpoints/);
      assert.ok(messages.some((message) => /Cloudflare CSP/.test(message)));

      messages.length = 0;
      assert.equal(
        runGuard({
          root,
          html,
          selfOrigin: SELF_ORIGIN,
          processEnv: {
            FUNNEL_REQUIRED: "1",
            VITE_API_BASE_URL: "https://blocked.example.test",
          },
          loadEnvFn,
          log: logger,
          error: logger,
        }),
        1,
      );
      assert.match(messages[0], /meta CSP policy 1 blocks/);
    },
  );
});

test("the repository meta CSP admits both endpoints for a safe CI origin", () => {
  const root = resolve(import.meta.dirname, "..");
  const html = readFileSync(resolve(root, "index.html"), "utf8");

  assert.deepEqual(
    validateMetaCsp({
      html,
      apiBase: parseApiBase("https://otp.traigent.ai"),
      selfOrigin: SELF_ORIGIN,
    }).endpoints.map((url) => url.pathname),
    ["/api/v1/leads", "/api/v1/leads/verify"],
  );
});
