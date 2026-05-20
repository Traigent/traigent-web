# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Traigent-web is the public marketing site at https://www.traigent.ai. React + Vite + Tailwind + Framer Motion + React Router (HashRouter). Deployed via GitHub Actions to the `gh-pages` branch on push to `main`.

## Architecture

Standard Vite React SPA:
- `index.html` — entry HTML (carries the baseline CSP meta tag)
- `src/main.jsx` — bootstraps the app, calls `initAnalytics()`, mounts `<App />`
- `src/App.jsx` — React Router routes (HashRouter)
- `src/layout.jsx` — page chrome (TopNav + outlet + footer)
- `src/pages/*.jsx` — top-level routes
- `src/components/*.jsx` — shared UI
- `src/lib/analytics.js` — HubSpot + PostHog + GA4 + Clarity loaders
- `src/content/blog/*.md` — markdown blog posts, bundled via `import.meta.glob`

## Deploy

`.github/workflows/deploy-gh-pages.yml` runs on push to `main`:
1. `npm ci`
2. `npm run build` — reads `VITE_*` env vars from repo Actions Variables (see `.env.example`)
3. Publishes `dist/` to the `gh-pages` branch via `peaceiris/actions-gh-pages`

GitHub Pages serves `gh-pages` at the apex domain (`CNAME = traigent.ai`).

## Codacy Integration

Configured for Codacy MCP Server (see `.github/instructions/codacy.instructions.md`):
- Provider: `gh` · Organization: `gilrose4` · Repository: `traigent-web`

When editing files, run `codacy_cli_analyze` after changes if Codacy MCP is available.
