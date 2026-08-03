#!/usr/bin/env node
// Fail-closed gate for the time-boxed accepted risk recorded in
// docs/security/accepted-risk-aikido-429046601.md
// (Aikido #429046601 / GHSA-qwww-vcr4-c8h2 — React Router RSC-mode CSRF bypass).
//
// The deferral rests on two claims. This gate enforces both:
//   1. the deferral is time-boxed  -> fail on or after the record's expires_utc
//   2. this app never touches React Router's unstable RSC/server surface
//      -> fail if an RSC/server entrypoint, RSC API, framework/server package,
//         framework config file, or react-server resolve condition appears
//
// Fail-closed: a missing, unparseable, or tampered record is a failure, not a pass.
// Usage: node scripts/check_accepted_risk.mjs [--root <dir>]

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RECORD_PATH = 'docs/security/accepted-risk-aikido-429046601.md';

// Identity of the record this gate is bound to. A record that does not carry these
// exact values is not the accepted risk this gate was reviewed against.
const EXPECTED = {
  control_id: 'accepted-risk-aikido-429046601',
  aikido_issue: '429046601',
  advisory: 'GHSA-qwww-vcr4-c8h2',
  owner: 'nimrodbusany',
};
const REQUIRED_KEYS = [
  'control_id',
  'aikido_issue',
  'advisory',
  'packages',
  'resolved_versions',
  'decision',
  'owner',
  'authority',
  'decided_utc',
  'expires_utc',
];

// Files whose whole purpose is to name these patterns. Excluding them is what keeps
// the gate from matching itself; tampering with either one breaks the gate anyway.
const SELF_EXCLUDED = new Set([
  'scripts/check_accepted_risk.mjs',
  'scripts/tests/check_accepted_risk.test.mjs',
]);
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'coverage', '.vite']);
const SCAN_EXTENSIONS = new Set(['.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx', '.html']);

// Module specifiers that only exist to reach RSC / server / framework-mode React Router.
const FORBIDDEN_SPECIFIERS = [
  { re: /^@react-router\/.+$/, why: 'React Router framework/server package' },
  { re: /^react-router(-dom)?\/rsc(\/.*)?$/, why: 'React Router RSC entrypoint' },
  { re: /^react-router(-dom)?\/internal(\/.*)?$/, why: 'React Router internal/react-server entrypoint' },
  {
    re: /^react-router(-dom)?\/(server|node|express|serve|architect|cloudflare)(\/.*)?$/,
    why: 'React Router server entrypoint',
  },
];

// Exported names of the unstable RSC/server surface in react-router 7.18.1
// (derived from the installed package's type declarations).
const RSC_API_NAMES = [
  'unstable_RSCHydratedRouter',
  'unstable_RSCHydratedRouterProps',
  'unstable_RSCStaticRouter',
  'unstable_RSCStaticRouterProps',
  'unstable_RSCPayload',
  'unstable_RSCManifestPayload',
  'unstable_RSCRenderPayload',
  'unstable_RSCMatch',
  'unstable_RSCRouteConfig',
  'unstable_RSCRouteConfigEntry',
  'unstable_RSCRouteManifest',
  'unstable_RSCRouteMatch',
  'unstable_createCallServer',
  'unstable_getRSCStream',
  'unstable_matchRSCServerRequest',
  'unstable_routeRSCServerRequest',
  'unstable_DecodeActionFunction',
  'unstable_DecodeFormStateFunction',
  'unstable_DecodeReplyFunction',
  'unstable_EncodeReplyFunction',
  'unstable_LoadServerActionFunction',
  'unstable_BrowserCreateFromReadableStreamFunction',
  'unstable_SSRCreateFromReadableStreamFunction',
  'RSCHydratedRouter',
  'RSCStaticRouter',
  'createCallServer',
  'getRSCStream',
  'routeRSCServerRequest',
  'matchRSCServerRequest',
];
const RSC_API_SET = new Set(RSC_API_NAMES);

const REACT_ROUTER_SPECIFIER = /^react-router(-dom)?(\/.*)?$/;
const FRAMEWORK_CONFIG_FILE = /^react-router\.config\.(js|jsx|mjs|cjs|ts|tsx)$/;
const FRAMEWORK_CLI = /\breact-router\s+(build|dev|serve|typegen|reveal)\b/;

const violations = [];
const notes = [];

const fail = (code, where, detail) => violations.push({ code, where, detail });

// --- record checks ---------------------------------------------------------

const parseRecordBlock = (text) => {
  const blocks = [...text.matchAll(/^```accepted-risk[ \t]*\r?\n([\s\S]*?)^```[ \t]*$/gm)];
  if (blocks.length !== 1) {
    return { error: `expected exactly 1 \`\`\`accepted-risk metadata block, found ${blocks.length}` };
  }

  const fields = new Map();
  const lines = blocks[0][1].split(/\r?\n/).filter((line) => line.trim() !== '');
  for (const line of lines) {
    const match = /^([a-z_]+):[ \t]*(\S.*?)[ \t]*$/.exec(line);
    if (!match) return { error: `unparseable metadata line: ${JSON.stringify(line)}` };
    if (fields.has(match[1])) return { error: `duplicate metadata key: ${match[1]}` };
    fields.set(match[1], match[2]);
  }
  return { fields };
};

const checkRecord = (root) => {
  const abs = path.join(root, RECORD_PATH);
  if (!fs.existsSync(abs)) {
    fail('RECORD_MISSING', RECORD_PATH, 'accepted-risk record not found — the deferral has no owner record');
    return;
  }

  const { fields, error } = parseRecordBlock(fs.readFileSync(abs, 'utf8'));
  if (error) {
    fail('RECORD_UNPARSEABLE', RECORD_PATH, error);
    return;
  }

  const missing = REQUIRED_KEYS.filter((key) => !fields.has(key));
  if (missing.length > 0) {
    fail('RECORD_INCOMPLETE', RECORD_PATH, `missing required field(s): ${missing.join(', ')}`);
    return;
  }

  for (const [key, expected] of Object.entries(EXPECTED)) {
    if (fields.get(key) !== expected) {
      fail(
        'RECORD_IDENTITY',
        RECORD_PATH,
        `${key} is ${JSON.stringify(fields.get(key))}, expected ${JSON.stringify(expected)}`
      );
    }
  }

  const raw = fields.get('expires_utc');
  const expires = new Date(raw);
  if (Number.isNaN(expires.getTime())) {
    fail('RECORD_EXPIRY_INVALID', RECORD_PATH, `expires_utc is not a valid date: ${JSON.stringify(raw)}`);
    return;
  }

  const now = new Date();
  if (now.getTime() >= expires.getTime()) {
    fail(
      'RISK_ACCEPTANCE_EXPIRED',
      RECORD_PATH,
      `accepted risk expired at ${expires.toISOString()} (now ${now.toISOString()}); ` +
        'the deferral of Aikido #429046601 / GHSA-qwww-vcr4-c8h2 must be re-decided by ' +
        `${fields.get('owner')} — see the "Required next actions" section`
    );
    return;
  }

  const daysLeft = (expires.getTime() - now.getTime()) / 86400000;
  notes.push(
    `record ok: ${fields.get('advisory')} deferred by ${fields.get('owner')} ` +
      `(${fields.get('authority')}), expires ${expires.toISOString()} — ${daysLeft.toFixed(1)} day(s) left`
  );
};

// --- source surface checks -------------------------------------------------

// Strip // and /* */ comments while preserving string/template literals, so that
// prose mentioning an RSC entrypoint is not treated as usage of one.
const stripJsComments = (src) => {
  let out = '';
  let i = 0;
  let quote = null;
  while (i < src.length) {
    const ch = src[i];
    const next = src[i + 1];
    if (quote) {
      out += ch;
      if (ch === '\\') {
        out += next ?? '';
        i += 2;
        continue;
      }
      if (ch === quote) quote = null;
      i += 1;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      quote = ch;
      out += ch;
      i += 1;
      continue;
    }
    if (ch === '/' && next === '/') {
      while (i < src.length && src[i] !== '\n') i += 1;
      continue;
    }
    if (ch === '/' && next === '*') {
      i += 2;
      while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) {
        if (src[i] === '\n') out += '\n'; // keep line numbers stable
        i += 1;
      }
      i += 2;
      continue;
    }
    out += ch;
    i += 1;
  }
  return out;
};

const lineOf = (text, index) => text.slice(0, index).split('\n').length;

const SPECIFIER_PATTERNS = [
  /\bfrom\s*['"]([^'"]+)['"]/g, // import ... from 'x' / export ... from 'x'
  /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g, // import('x')
  /\brequire\s*\(\s*['"]([^'"]+)['"]\s*\)/g, // require('x')
  /\bimport\s+['"]([^'"]+)['"]/g, // import 'x'
];

// import/export clause bound to a react-router specifier, e.g. `import { a, b } from "react-router"`.
// The clause body is restricted to binding syntax (identifiers, braces, commas, `*`, `as`,
// whitespace) so a match cannot run across a preceding semicolon-less statement.
const REACT_ROUTER_CLAUSE = /\b(?:import|export)\s+([\w$*{},\s]*?)\s*from\s*['"](react-router[^'"]*)['"]/g;

const scanSource = (relPath, source) => {
  const isHtml = path.extname(relPath) === '.html';
  const code = isHtml ? source : stripJsComments(source);

  for (const pattern of SPECIFIER_PATTERNS) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(code)) !== null) {
      const specifier = match[1];
      const forbidden = FORBIDDEN_SPECIFIERS.find((entry) => entry.re.test(specifier));
      if (forbidden) {
        fail(
          'RSC_ENTRYPOINT',
          `${relPath}:${lineOf(code, match.index)}`,
          `imports ${JSON.stringify(specifier)} — ${forbidden.why}`
        );
      }
    }
  }

  REACT_ROUTER_CLAUSE.lastIndex = 0;
  let clause;
  while ((clause = REACT_ROUTER_CLAUSE.exec(code)) !== null) {
    if (!REACT_ROUTER_SPECIFIER.test(clause[2])) continue;
    const bound = clause[1].match(/[A-Za-z_$][\w$]*/g) ?? [];
    for (const name of bound) {
      if (RSC_API_SET.has(name)) {
        fail(
          'RSC_API',
          `${relPath}:${lineOf(code, clause.index)}`,
          `imports RSC/server API ${name} from ${JSON.stringify(clause[2])}`
        );
      }
    }
  }
};

const walk = (root, dir, onFile) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const abs = path.join(dir, entry.name);
    const rel = path.relative(root, abs).split(path.sep).join('/');
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) walk(root, abs, onFile);
      continue;
    }
    if (!entry.isFile()) continue;
    if (SELF_EXCLUDED.has(rel)) continue;
    if (!SCAN_EXTENSIONS.has(path.extname(entry.name))) continue;
    onFile(rel, abs);
  }
};

const checkSurface = (root) => {
  let scanned = 0;
  walk(root, root, (rel, abs) => {
    scanned += 1;
    scanSource(rel, fs.readFileSync(abs, 'utf8'));
  });
  notes.push(`scanned ${scanned} source file(s) for React Router RSC/server usage`);
};

const checkConfig = (root) => {
  for (const entry of fs.readdirSync(root)) {
    if (FRAMEWORK_CONFIG_FILE.test(entry)) {
      fail('RSC_CONFIG', entry, 'React Router framework-mode config file present — this app is an SPA');
    }
  }

  const pkgPath = path.join(root, 'package.json');
  if (fs.existsSync(pkgPath)) {
    let pkg;
    try {
      pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    } catch (error) {
      fail('PACKAGE_UNPARSEABLE', 'package.json', String(error.message));
      pkg = null;
    }
    if (pkg) {
      for (const field of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
        for (const name of Object.keys(pkg[field] ?? {})) {
          if (name.startsWith('@react-router/')) {
            fail('RSC_PACKAGE', `package.json:${field}`, `${name} is a React Router framework/server package`);
          }
        }
      }
      for (const [name, script] of Object.entries(pkg.scripts ?? {})) {
        if (typeof script === 'string' && FRAMEWORK_CLI.test(script)) {
          fail('RSC_CLI', `package.json:scripts.${name}`, 'invokes the React Router framework CLI');
        }
      }
    }
  }

  for (const entry of fs.readdirSync(root)) {
    if (!/^vite\.config\.(js|mjs|cjs|ts)$/.test(entry)) continue;
    const source = stripJsComments(fs.readFileSync(path.join(root, entry), 'utf8'));
    const match = /['"`]react-server['"`]/.exec(source);
    if (match) {
      fail('RSC_CONDITION', `${entry}:${lineOf(source, match.index)}`, "declares the 'react-server' resolve condition");
    }
  }
};

// --- main ------------------------------------------------------------------

const parseArgs = (argv) => {
  let root = REPO_ROOT;
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--root') {
      root = path.resolve(argv[i + 1] ?? '');
      i += 1;
    } else {
      console.error(`check_accepted_risk: unknown argument ${JSON.stringify(argv[i])}`);
      process.exit(2);
    }
  }
  return root;
};

const root = parseArgs(process.argv.slice(2));
if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
  console.error(`check_accepted_risk: root is not a directory: ${root}`);
  process.exit(2);
}

checkRecord(root);
checkSurface(root);
checkConfig(root);

for (const note of notes) console.log(`check_accepted_risk: ${note}`);

if (violations.length > 0) {
  console.error('');
  console.error(`check_accepted_risk: FAIL — ${violations.length} violation(s)`);
  for (const { code, where, detail } of violations) {
    console.error(`  [${code}] ${where}: ${detail}`);
  }
  console.error('');
  console.error(`See ${RECORD_PATH} — this gate fails closed by design; do not bypass it.`);
  process.exit(1);
}

console.log('check_accepted_risk: PASS — accepted risk for Aikido #429046601 is in date and RSC-free');
