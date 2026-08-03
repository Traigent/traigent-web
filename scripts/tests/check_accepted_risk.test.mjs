// Tests for the fail-closed accepted-risk gate (Aikido #429046601 / GHSA-qwww-vcr4-c8h2).
//
// Every case builds a throwaway fixture tree in os.tmpdir() and runs the real gate
// against it with --root, so the assertions never depend on this repo's own contents
// (except the two cases that deliberately check the live wiring).
//
// Run with: npm test

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const GATE = path.join(REPO_ROOT, 'scripts', 'check_accepted_risk.mjs');
const RECORD_PATH = 'docs/security/accepted-risk-aikido-429046601.md';

const runGate = (root) => {
  const result = spawnSync(process.execPath, [GATE, '--root', root], { encoding: 'utf8' });
  return { status: result.status, output: `${result.stdout}${result.stderr}` };
};

const recordBody = (fields) =>
  ['# fixture record', '', '```accepted-risk', ...Object.entries(fields).map(([k, v]) => `${k}: ${v}`), '```', ''].join(
    '\n'
  );

const validFields = (expiresUtc) => ({
  control_id: 'accepted-risk-aikido-429046601',
  aikido_issue: '429046601',
  advisory: 'GHSA-qwww-vcr4-c8h2',
  packages: 'react-router,react-router-dom',
  resolved_versions: 'react-router@7.18.1,react-router-dom@7.18.1',
  decision: 'defer',
  owner: 'nimrodbusany',
  authority: 'overnight-campaign-captain-decision-2026-08-03',
  decided_utc: '2026-08-03',
  expires_utc: expiresUtc,
});

const inOneHour = () => new Date(Date.now() + 3600_000).toISOString();

// Builds a clean, passing fixture: valid in-date record, an SPA-style source file,
// a package.json with no framework/server packages.
const makeFixture = (t, files = {}, { record = recordBody(validFields(inOneHour())) } = {}) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'accepted-risk-'));
  const write = (rel, content) => {
    const abs = path.join(root, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content);
  };

  if (record !== null) write(RECORD_PATH, record);
  write('package.json', JSON.stringify({ name: 'fixture', dependencies: { 'react-router-dom': '^7.18.1' } }, null, 2));
  write('src/App.jsx', 'import { Routes, Route } from "react-router-dom";\nexport default function App() { return null; }\n');
  write('index.html', '<!doctype html>\n<script type="module" src="/src/main.jsx"></script>\n');
  for (const [rel, content] of Object.entries(files)) write(rel, content);

  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
};

test('passes on a clean tree with an in-date record', (t) => {
  const { status, output } = runGate(makeFixture(t));
  assert.equal(status, 0, output);
  assert.match(output, /PASS/);
  assert.match(output, /scanned \d+ source file\(s\)/);
});

test('the clean fixture is non-vacuous: files are actually scanned', (t) => {
  const { output } = runGate(makeFixture(t));
  const scanned = Number(/scanned (\d+) source file/.exec(output)[1]);
  assert.ok(scanned >= 2, `expected the fixture sources to be scanned, got ${scanned}: ${output}`);
});

test('fails once the record has expired', (t) => {
  // Pinned to an unambiguously past instant so the assertion is deterministic
  // whenever it runs, independent of the live record's own expiry date.
  const root = makeFixture(t, {}, { record: recordBody(validFields('2020-01-01T00:00:00Z')) });
  const { status, output } = runGate(root);
  assert.equal(status, 1, output);
  assert.match(output, /RISK_ACCEPTANCE_EXPIRED/);
  assert.match(output, /2020-01-01T00:00:00\.000Z/);
  assert.match(output, /nimrodbusany/);
});

test('fails at the expiry instant, not only after it (one second past = fail)', (t) => {
  const oneSecondAgo = new Date(Date.now() - 1000).toISOString();
  const { status, output } = runGate(makeFixture(t, {}, { record: recordBody(validFields(oneSecondAgo)) }));
  assert.equal(status, 1, output);
  assert.match(output, /RISK_ACCEPTANCE_EXPIRED/);
});

test('passes while the expiry is still in the future', (t) => {
  const { status, output } = runGate(makeFixture(t, {}, { record: recordBody(validFields(inOneHour())) }));
  assert.equal(status, 0, output);
});

test('fails closed when the record is missing', (t) => {
  const { status, output } = runGate(makeFixture(t, {}, { record: null }));
  assert.equal(status, 1, output);
  assert.match(output, /RECORD_MISSING/);
});

test('fails closed when the metadata block is absent', (t) => {
  const { status, output } = runGate(makeFixture(t, {}, { record: '# no metadata here\n' }));
  assert.equal(status, 1, output);
  assert.match(output, /RECORD_UNPARSEABLE/);
});

test('fails closed on a malformed metadata line', (t) => {
  const record = ['```accepted-risk', 'control_id accepted-risk-aikido-429046601', '```'].join('\n');
  const { status, output } = runGate(makeFixture(t, {}, { record }));
  assert.equal(status, 1, output);
  assert.match(output, /RECORD_UNPARSEABLE/);
});

test('fails closed when a required field is dropped', (t) => {
  const fields = validFields(inOneHour());
  delete fields.expires_utc;
  const { status, output } = runGate(makeFixture(t, {}, { record: recordBody(fields) }));
  assert.equal(status, 1, output);
  assert.match(output, /RECORD_INCOMPLETE.*expires_utc/s);
});

test('fails closed when the record is swapped for a different advisory', (t) => {
  const fields = validFields(inOneHour());
  fields.advisory = 'GHSA-0000-0000-0000';
  const { status, output } = runGate(makeFixture(t, {}, { record: recordBody(fields) }));
  assert.equal(status, 1, output);
  assert.match(output, /RECORD_IDENTITY/);
});

test('fails closed when expires_utc is not a date', (t) => {
  const { status, output } = runGate(makeFixture(t, {}, { record: recordBody(validFields('whenever')) }));
  assert.equal(status, 1, output);
  assert.match(output, /RECORD_EXPIRY_INVALID/);
});

test('fails when an RSC entrypoint is imported', (t) => {
  const { status, output } = runGate(
    makeFixture(t, { 'src/rsc.jsx': 'import { unstable_RSCStaticRouter } from "react-router/rsc";\n' })
  );
  assert.equal(status, 1, output);
  assert.match(output, /RSC_ENTRYPOINT.*src\/rsc\.jsx:1/);
});

test('fails when a framework/server package is imported', (t) => {
  const { status, output } = runGate(
    makeFixture(t, { 'src/server.js': 'const { createRequestHandler } = require("@react-router/express");\n' })
  );
  assert.equal(status, 1, output);
  assert.match(output, /RSC_ENTRYPOINT.*@react-router\/express/);
});

test('fails on a dynamic import of the react-server client entrypoint', (t) => {
  const { status, output } = runGate(
    makeFixture(t, { 'src/lazy.js': 'export const load = () => import("react-router/internal/react-server-client");\n' })
  );
  assert.equal(status, 1, output);
  assert.match(output, /RSC_ENTRYPOINT/);
});

test('fails when an RSC API is imported from the main react-router entrypoint', (t) => {
  const { status, output } = runGate(
    makeFixture(t, { 'src/hydrate.jsx': 'import { Link, unstable_routeRSCServerRequest } from "react-router";\n' })
  );
  assert.equal(status, 1, output);
  assert.match(output, /RSC_API.*unstable_routeRSCServerRequest/);
});

test('reports the right line when imports are semicolon-less and stacked', (t) => {
  // Regression guard: the import-clause matcher must not run across earlier statements.
  const source = [
    "import { Link } from 'react-router-dom'",
    "import { useLocation } from 'react-router-dom'",
    'export const noop = () => null',
    "import { unstable_RSCStaticRouter } from 'react-router'",
    '',
  ].join('\n');
  const { status, output } = runGate(makeFixture(t, { 'src/stacked.jsx': source }));
  assert.equal(status, 1, output);
  assert.match(output, /RSC_API\] src\/stacked\.jsx:4:/);
  assert.equal(output.match(/RSC_API/g).length, 1, output);
});

test('fails when an RSC API is imported from react-router/dom', (t) => {
  const { status, output } = runGate(
    makeFixture(t, { 'src/call.js': 'import { unstable_createCallServer } from "react-router/dom";\n' })
  );
  assert.equal(status, 1, output);
  assert.match(output, /RSC_API.*unstable_createCallServer/);
});

test('fails when an RSC entrypoint is loaded from an HTML module script', (t) => {
  const html = '<script type="module">import "react-router/rsc";</script>\n';
  const { status, output } = runGate(makeFixture(t, { 'index.html': html }));
  assert.equal(status, 1, output);
  assert.match(output, /RSC_ENTRYPOINT.*index\.html/);
});

test('fails when a framework-mode config file appears', (t) => {
  const { status, output } = runGate(makeFixture(t, { 'react-router.config.ts': 'export default { ssr: true };\n' }));
  assert.equal(status, 1, output);
  assert.match(output, /RSC_CONFIG.*react-router\.config\.ts/);
});

test('fails when a framework/server package is added to package.json', (t) => {
  const root = makeFixture(t);
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  pkg.devDependencies = { '@react-router/dev': '^7.18.1' };
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(pkg, null, 2));
  const { status, output } = runGate(root);
  assert.equal(status, 1, output);
  assert.match(output, /RSC_PACKAGE.*@react-router\/dev/);
});

test('fails when a script invokes the React Router framework CLI', (t) => {
  const root = makeFixture(t);
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  pkg.scripts = { build: 'react-router build' };
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(pkg, null, 2));
  const { status, output } = runGate(root);
  assert.equal(status, 1, output);
  assert.match(output, /RSC_CLI.*scripts\.build/);
});

test("fails when vite declares the 'react-server' resolve condition", (t) => {
  const config = 'export default { resolve: { conditions: ["react-server"] } };\n';
  const { status, output } = runGate(makeFixture(t, { 'vite.config.js': config }));
  assert.equal(status, 1, output);
  assert.match(output, /RSC_CONDITION.*vite\.config\.js/);
});

test('does not fire on incidental prose that merely names the RSC surface', (t) => {
  const { status, output } = runGate(
    makeFixture(t, {
      // Comments, docs and unrelated identifiers must not be treated as usage.
      'src/notes.jsx':
        '// This SPA never imports react-router/rsc and never calls unstable_RSCHydratedRouter.\n' +
        '/* @react-router/dev is deliberately absent; see the accepted-risk record. */\n' +
        'import { Link } from "react-router-dom";\n' +
        'export const label = "react-router/rsc";\n' +
        'export default Link;\n',
      'docs/why.md': 'We defer GHSA-qwww-vcr4-c8h2 because react-router/rsc is unused.\n',
      'src/unrelated.js': 'export function createCallServer() { return null; }\n',
    })
  );
  assert.equal(status, 0, output);
});

test('scanning skips node_modules and dist so vendored RSC code is not a false positive', (t) => {
  const { status, output } = runGate(
    makeFixture(t, {
      'node_modules/react-router/rsc.js': 'import "react-router/rsc";\n',
      'dist/assets/bundle.js': 'import "@react-router/node";\n',
    })
  );
  assert.equal(status, 0, output);
});

test('rejects an unknown argument instead of silently passing', (t) => {
  const result = spawnSync(process.execPath, [GATE, '--skip'], { encoding: 'utf8' });
  assert.equal(result.status, 2, `${result.stdout}${result.stderr}`);
});

// --- live wiring -----------------------------------------------------------

test('the live repository currently satisfies the gate', (t) => {
  const { status, output } = runGate(REPO_ROOT);
  assert.equal(status, 0, output);
  assert.match(output, /PASS/);
});

test('the gate is wired into the production build path', (t) => {
  const pkg = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'package.json'), 'utf8'));
  // prebuild runs on every `npm run build`, which is what both the deploy and
  // code-quality workflows execute — so the gate cannot be skipped on the way to production.
  assert.match(pkg.scripts.prebuild, /npm run gate:accepted-risk/);
  assert.match(pkg.scripts['gate:accepted-risk'], /check_accepted_risk\.mjs/);
});
