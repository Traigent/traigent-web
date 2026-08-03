# Accepted risk: Aikido #429046601 — GHSA-qwww-vcr4-c8h2 (react-router)

This is the durable record for a **time-boxed, fail-closed accepted risk**. It is machine-read by
`scripts/check_accepted_risk.mjs`, which runs on every `npm run build` (and therefore on every
deploy) and fails the build once this record expires or once the "not exploitable here" premise
below stops holding.

Nothing in this file suppresses the finding. The Aikido issue stays open, `npm audit` keeps
reporting the advisory, and no ignore/allowlist/override was added.

```accepted-risk
control_id: accepted-risk-aikido-429046601
aikido_issue: 429046601
advisory: GHSA-qwww-vcr4-c8h2
packages: react-router,react-router-dom
resolved_versions: react-router@7.18.1,react-router-dom@7.18.1
decision: defer
owner: nimrodbusany
authority: overnight-campaign-captain-decision-2026-08-03
decided_utc: 2026-08-03
expires_utc: 2026-08-23T00:00:00Z
```

## The finding

| Field | Value |
| --- | --- |
| Scanner issue | Aikido #429046601 |
| Advisory | [GHSA-qwww-vcr4-c8h2](https://github.com/advisories/GHSA-qwww-vcr4-c8h2) |
| Title | React Router: RSC Mode CSRF Bypass Allows Action Execution Before 400 Response |
| Weakness | CWE-352 (CSRF) |
| Severity | High (no CVSS vector published) |
| Affected range | `>=7.12.0 <8.3.0` |
| Direct dependency | `react-router-dom@^7.18.1` (`package.json`) |
| Resolved by the committed lockfile | `react-router 7.18.1`, `react-router-dom 7.18.1` |
| Reachability in this repo | Not reachable — RSC-only code path, see below |

`npm audit` at this commit reports 6 vulnerabilities (4 high, 2 low). This advisory accounts for two
of the four high rows (`react-router` and the `react-router-dom` dependent row); the other two highs
(`brace-expansion`, `js-yaml`) are unrelated build-time dependencies and out of scope for this record.

## Why it is not exploitable in traigent-web

The advisory is confined to React Router's **unstable React Server Components (RSC) mode**: the CSRF
bypass happens in the RSC server request handler, which executes a server action before returning the
400 response. Reaching it requires an app to run React Router's RSC/server entrypoints.

traigent-web is a static, client-only Vite SPA:

- `src/main.jsx` mounts `HashRouter`; `src/App.jsx` declares `Routes`/`Route`. Every one of the ~38
  `react-router-dom` imports in `src/` is a client-side primitive (`Link`, `Outlet`, `useLocation`,
  `useNavigate`, `useParams`, `useSearchParams`, `Navigate`).
- There is no server runtime at all. The build output is static assets published to the `gh-pages`
  branch and served by GitHub Pages; there is no Node process, no request handler, no server action.
- No RSC entrypoint, no `@react-router/*` framework/server package, no `react-router.config.*`, and
  no `react-server` resolve condition exists anywhere in the repo.

The vulnerable code therefore ships in the dependency tree but has no call path from this app.

**That premise is enforced, not asserted.** `scripts/check_accepted_risk.mjs` fails the build if any
RSC/server entrypoint, RSC API import, framework/server package, framework config file, or
`react-server` resolve condition is introduced. If someone adds RSC to this app, the deploy breaks
until this record is re-decided.

## Alternatives that were evaluated and rejected

**Downgrade to `react-router@7.11.0` (below the affected range) — rejected.**
Reproduced against this exact base: the tree goes from 4 distinct high findings to 10. It removes
this RSC advisory but introduces 7 new highs, including an unauthenticated RCE and a
client-reachable XSS. A client-reachable XSS is directly exploitable in this SPA, unlike the RSC
CSRF, so the downgrade strictly increases real exposure.

**Upgrade to `react-router@8.3.0`+ (the fixed range) — rejected for this change, deferred to a
planned migration.**
Router v8 requires React and React DOM `>=19.2.7` (repo is on React 18.2) and Node `>=22.22` (CI
workflows pin Node 20/22), forces ~37 import-path rewrites across `src/`, and pulls major-version
peer upgrades of `framer-motion` and `lucide-react`. That is a multi-day framework migration with
broad regression surface on the public marketing site — not an in-scope security patch, and not
something to land unreviewed in an overnight campaign.

**Scanner ignore / `npm audit` allowlist / lockfile override — rejected.**
Those hide the finding instead of time-boxing it. The finding stays visible in Aikido and in
`npm audit` on purpose.

## Ownership and authority

- **Responsible owner:** `nimrodbusany`.
- **Authority for this deferral:** the 2026-08-03 overnight campaign **captain decision**. This is an
  agent-campaign engineering decision recorded for owner review.
- **This is explicitly NOT a recorded owner sign-off.** No owner approval has been obtained; do not
  read this record as one. Owner acceptance is the first required next action below.

## Expiry

- **Decided:** 2026-08-03 (UTC)
- **Expires:** 2026-08-23T00:00:00Z

On or after the expiry instant the gate fails closed: `npm run build` — and therefore the
`Deploy to GitHub Pages` and `Code Quality` workflows, which both run `npm run build` — will fail
until this record is re-decided. Extending the date is a deliberate, reviewable edit to this file,
not a silent lapse.

## Required next actions before expiry

1. **Owner decision (`nimrodbusany`):** accept, reject, or re-scope this deferral, and record the
   outcome here. Until then this record carries campaign authority only.
2. **Re-check the advisory** for a fix backported into the 7.x line. If a patched 7.x exists, take it
   and delete this record plus its gate.
3. **Plan the Router v8 migration** as its own tracked change (React 19 + Node 22 floor + import
   rewrites + `framer-motion`/`lucide-react` peer majors), since v8 is currently the only fixed range.
4. **Re-verify the resolved versions** in `package-lock.json` still match `resolved_versions` above.
   The gate does not enforce version drift; if react-router moves, the exploitability analysis above
   must be redone.
5. **If none of the above land by 2026-08-23,** either re-decide with a new expiry (with the reason
   for the extension written down) or accept the build failure.

## Verifying this control locally

```bash
npm run gate:accepted-risk   # runs the gate against the working tree
npm test                     # runs the gate's own test suite (node --test)
npm run build                # prebuild runs the gate; build fails if the gate fails
```
