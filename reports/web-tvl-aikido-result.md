# traigent-web Aikido security slice

## Scope checked

- Worktree: `/home/nimrodbu/Traigent_enterprise/worktrees/aikido-20260619/traigent-web-main`
- Branch/base: `codex/aikido-web-main` on `origin/main`
- CSV rows covered:
  - `18505949` / `159243564`, `159243565` - missing HSTS on `https://traigent.ai`
  - `18827090` / `123050799`, `123153492` - CSP allows inline javascript
  - `28961600` / `283627037`, `283627026` - CSP does not block `eval()`
  - `18807977` / `123050798`, `122226555` - CSP not restrictive enough
  - `18505948` / `185000779`, `117151068` - missing anti-clickjacking header
  - `29752503` / `271511145` - `dangerouslySetInnerHTML` in `src/pages/Pricing.jsx`
- `218184141` - overly broad workflow permissions
  - `31032834` / `294827597` - `react-router` in `package-lock.json`
  - `31144885` / `298525862` - `@ungap/structured-clone` in `package-lock.json`

## Files intentionally changed

- `.github/workflows/deploy-gh-pages.yml`
- `index.html`
- `package.json`
- `package-lock.json`
- `src/pages/Pricing.jsx`

## What changed

- Tightened the repo-owned CSP meta tag:
  - removed `'unsafe-inline'` and `'unsafe-eval'` from `script-src`
  - set `script-src-attr 'none'`
  - added `manifest-src 'self'`
- Removed HTML string injection from the pricing page:
  - pricing tier feature lists now render JSX directly
  - FAQ answers now render JSX directly
- Switched the deploy workflow from branch-push Pages publishing to the native GitHub Pages artifact flow:
  - permission scope reduced from `contents: write` to `contents: read` + `pages: write` + `id-token: write`
  - pinned all used actions to exact SHAs
- Refreshed npm resolution for the scoped package findings:
  - `react-router-dom` / `react-router` now resolve to `6.30.4`
  - added an override so `@ungap/structured-clone` resolves to `1.3.1`

## External-only rows

- `18505949` HSTS and `18505948` anti-clickjacking are not fixable from this repo while the site is served by GitHub Pages behind the apex domain.
- Required owner action:
  - set `Strict-Transport-Security` as a real response header at the edge/CDN layer
  - set clickjacking protection as a real response header (`Content-Security-Policy: frame-ancestors ...` and/or `X-Frame-Options`)
- The CSP meta tag can tighten client-side script policy, but it cannot replace those response-header-only protections.

## Validation commands

- `npm install --package-lock-only react-router-dom@^6.30.4`
  - success
- `npm install --package-lock-only`
  - success
- `npm ci`
  - success
- `npm run build`
  - success
  - warnings only:
    - Vite warned that `spa-github-pages.js` is a non-module script in `index.html`
    - chunk-size warning for the main bundle
- `npm run lint`
  - failed before linting code because the repo does not contain an ESLint config in this worktree

## Remaining / deferred

- External owner follow-up for HSTS and anti-clickjacking headers.
- `npm audit` still reports unrelated vulnerabilities outside this CSV slice; they were not part of the assigned rows.

## PR-ready

- `yes` for the repo-owned fixes in this slice.
- Caveat: external header rows still need domain/CDN owner action and lint is not runnable until the repo restores an ESLint config.
