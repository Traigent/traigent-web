# Resources Section Handoff

This note is for the team working on `traigent-web`.

Goal:
- add a `Resources` surface to the public website
- use it to house thought leadership, evidence, and educational material
- do not block product/optimizer work on this repo while the web team takes implementation

Use Galileo's `Resources` interaction as inspiration only.
- Good reference: desktop mega-menu with clear grouping and 1-2 featured cards
- Do not copy Galileo's styling or information density directly
- Keep the Traigent voice more technical, evidence-first, and cleaner

## Current Deployment Facts

Repository:
- source repo: `/home/nimrodbu/Traigent_enterprise/traigent-web`
- GitHub remote: `git@github-traigent:Traigent/traigent-web.git`

Deploy path:
- production build output: `dist/`
- publish command: `npm run deploy`
- deploy mechanism: `gh-pages -d dist`
- effective deployment branch: `gh-pages`

Important nuance:
- `gh-pages` is the publish target, not the branch the team should edit directly
- normal development should happen on a source branch and then be deployed via `npm run deploy`
- local checkout at the time of writing is on `improvements/one-pager-enhancements`, but that is a working branch, not a guaranteed long-term source branch
- safest default is to branch from `main` unless the current website owner says otherwise

## Current App Structure

Relevant files:
- app routes: `src/App.jsx`
- top-level shell: `src/layout.jsx`
- current homepage nav/header: `src/pages/Homepage.jsx`

Important implementation note:
- the visible top nav is currently embedded inside `Homepage.jsx`
- it is not yet a real shared site header
- before adding `Resources`, extract the header into a reusable component

Recommended first refactor:
- add `src/components/SiteHeader.jsx`
- move the current homepage nav into that component
- use it across `Homepage`, `OnePager`, `Manifesto`, and the new `Resources` page

## What To Build

Build 2 things together:

1. `Resources` nav item
- desktop: mega-menu
- mobile: accordion or simple expanded list

2. standalone `/resources` page
- this matters for SEO, direct linking, and future growth
- the mega-menu should be a shortcut into this page, not the only way to find the content

## Information Architecture

Recommended top-level groups for the mega-menu and page:

### Learn
- Blog
- Research Notes
- Benchmarks & Evidence
- Case Studies
- Release Notes

### Explore
- What is TVL?
- What is Smartopt?
- One-pager
- Manifesto
- Getting Started

### Featured
- 2-3 editorial cards only
- one must be the Smartopt evidence brief
- one should be the One-pager or Manifesto
- optional third card can be a TVL foundations item

Do not overload the menu.
- Galileo can support a denser menu than we need right now
- Traigent should launch with a smaller, sharper resource surface

## Recommended Initial Resource Catalog

### Publish Now

These are ready enough to anchor the first version:

1. Smartopt client evidence brief
- source: `/home/nimrodbu/Traigent_enterprise/TraigentPaper/industry_publications/artifacts/smartopt_client_evidence_2026_q1/smartopt_client_evidence_brief.md`
- supporting README: `/home/nimrodbu/Traigent_enterprise/TraigentPaper/industry_publications/artifacts/smartopt_client_evidence_2026_q1/README.md`
- plots:
  - `/home/nimrodbu/Traigent_enterprise/TraigentPaper/industry_publications/artifacts/smartopt_client_evidence_2026_q1/plots/spider_frontier_tradeoff.svg`
  - `/home/nimrodbu/Traigent_enterprise/TraigentPaper/industry_publications/artifacts/smartopt_client_evidence_2026_q1/plots/spider_recall_vs_spend.svg`
  - `/home/nimrodbu/Traigent_enterprise/TraigentPaper/industry_publications/artifacts/smartopt_client_evidence_2026_q1/plots/spider_scoring_signal.svg`
  - `/home/nimrodbu/Traigent_enterprise/TraigentPaper/industry_publications/artifacts/smartopt_client_evidence_2026_q1/plots/live_confirmation_tradeoff.svg`

2. One-pager
- existing page: `src/pages/OnePager.jsx`

3. Manifesto
- existing page: `src/pages/Manifesto.jsx`

4. TVL campaign index
- source: `/home/nimrodbu/Traigent_enterprise/TraigentPaper/industry_publications/campaigns/tvl_big_reveal_2026_q1/README.md`

### Good Candidates, But Review Before Publishing

These exist and are useful, but should be treated as editorial drafts until someone explicitly approves them for the website:

- `/home/nimrodbu/Traigent_enterprise/TraigentPaper/industry_publications/blog/AI engineer.md`
- `/home/nimrodbu/Traigent_enterprise/TraigentPaper/industry_publications/blog/CEO.md`
- `/home/nimrodbu/Traigent_enterprise/TraigentPaper/industry_publications/blog/CTO.md`
- `/home/nimrodbu/Traigent_enterprise/TraigentPaper/industry_publications/blog/PRD.md`
- `/home/nimrodbu/Traigent_enterprise/TraigentPaper/industry_publications/blog/SE engineer.md`

Recommendation:
- do not launch a broad blog index immediately
- start by curating 2-3 resources with strong proof and clean positioning

## Suggested Featured Cards

### Card 1
Title:
- `Smartopt: finding the right agent frontier faster`

Description:
- `Evidence from real Spider replay and live confirmation runs showing conservative certification and lower evaluation spend.`

CTA:
- `Read the evidence`

Visual:
- use `spider_recall_vs_spend.svg` or `spider_frontier_tradeoff.svg`

### Card 2
Title:
- `The Traigent One-pager`

Description:
- `Specification-driven agent engineering with TVL, evaluation gates, and governed optimization.`

CTA:
- `Explore the one-pager`

### Card 3
Title:
- `The Manifesto`

Description:
- `Why agent engineering needs specs, measurable release decisions, and rollback discipline.`

CTA:
- `Read the manifesto`

## Messaging: What To Emphasize

The strongest externally supported message right now is:
- Traigent helps teams find the right quality/cost/latency operating point faster
- Traigent optimizes full agent configurations, not just model choice
- final promotion/certification stays conservative and benchmark-grounded

Use these proof points:
- on real Spider replay, Smartopt recovered the correct frontier with about `68%` less represented evaluation spend at the `30%` budget
- on fresh live confirmation, certified frontier matched empirical frontier exactly
- Spider frontier evidence shows tuned agent configurations surviving on the frontier, not only model swaps

## Messaging: What Not To Overclaim

Do not lead with:
- `our example scoring is best-in-class`
- `the combined scoring heuristic is already the main moat`
- `we have fully proven fresh benchmark-native Spider execution through Smartopt alone`

Why:
- the current evidence is strongest for efficient frontier recovery and governed tuning
- example scoring has signal, but it is not the cleanest headline yet

## Tone and Claims Policy

Use the publication voice guide:
- `/home/nimrodbu/Traigent_enterprise/TraigentPaper/industry_publications/campaigns/tvl_big_reveal_2026_q1/voice_guide.md`

Most important rules:
- stay evidence-first
- avoid unsupported absolutes
- distinguish governance/validation claims from optimization claims
- if a visual is synthetic, say so clearly

## Suggested UI Shape

Desktop:
- `Resources` in the main nav
- hover or click reveals a mega-menu
- 3 columns:
  - `Learn`
  - `Explore`
  - `Featured`

Mobile:
- no complicated mega-menu behavior
- use a simple expandable section or a dedicated `/resources` link

Resources page:
- hero with a short statement:
  - `Evidence, guides, and research for governed agent engineering.`
- then 3 sections:
  - `Featured`
  - `Evidence`
  - `Guides and essays`

## Recommended File-Level Implementation

Minimum clean implementation:
- `src/components/SiteHeader.jsx`
- `src/pages/Resources.jsx`
- `src/content/resources.js`
- update `src/App.jsx` with `/resources`
- update `src/layout.jsx` to render the shared header

Recommended data shape for `src/content/resources.js`:
- `slug`
- `title`
- `category`
- `summary`
- `href`
- `kind` (`internal`, `external`, `artifact`)
- `featured`
- `image`
- `status` (`ready`, `draft`)

## Recommended Analytics Events

Add simple tracking only:
- `nav_click` with `target: "resources"`
- `resource_open`
- `resource_featured_click`
- `resources_filter_click` if filters are added later

Do not build a heavy content analytics system in this pass.

## Rollout Order

Phase 1:
- shared header
- `Resources` nav
- `/resources` page
- 3 featured cards
- 4-6 curated links total

Phase 2:
- real blog index
- evidence library page
- simple search or filters

Phase 3:
- richer resource CMS or automation, if needed

## Recommended Editorial Selection for Launch

Ship these first:
- Smartopt evidence brief
- One-pager
- Manifesto
- TVL campaign index

Optional fifth item:
- one reviewed role-specific article, probably `AI engineer.md` or `SE engineer.md`

## Final Recommendation

The team should treat this as a product-marketing feature, not just a nav tweak.

The right first release is:
- one reusable site header
- one Resources mega-menu
- one standalone Resources page
- a small set of high-confidence assets

That gives Traigent a cleaner public story now, without waiting for the full editorial system.
