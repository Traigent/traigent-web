# Vibe Agent Building — launch kit

Companion to the shipped page,
[`src/pages/VibeAgentBuilding.jsx`](../src/pages/VibeAgentBuilding.jsx) (`/vibe-agent-building`,
short alias `/vibe`).

## Recommended post

**Platform:** LinkedIn (primary), cross-post to X.
**Voice:** founder, coining the term.

> Every agent demos well. Ask what it scores, and the room goes quiet.
>
> Vibe coding made building easy — and made "looks good to me" the entire test suite. Agents
> raise the stakes: they answer your customers, spend your budget, act in your name.
>
> So here's the practice, named: **Vibe Agent Building.**
>
> You describe the agent. You define what "good" means — real examples, evaluators you'd trust
> to grade a person. A coding agent builds; Traigent tests every candidate against your evaluation set and shows you exactly where each lands — on accuracy and cost, including whether any clear your bar.
>
> You bring the taste. The loop brings the proof.
>
> Full definition, and what the loop looks like in practice → traigent.ai/vibe-agent-building

**Alternate first line** if the owner wants a softer opener: *"Vibe coding had a great year. It
also shipped a lot of software nobody trusts."* (the prior hook — proven shape, less tension).
Everything else stands.

**Why this one:** it stages the exact gap the page resolves (demo ≠ score), it's an observation
the practitioner audience will self-recognize rather than a fear claim, and it contains no
number, no vendor disparagement, and no absolute. The CTA promises what the click delivers — a
definition and a working loop — which matches the page's manifesto-first structure.

## Variant 1 — contrarian hook (X, quote-tweet bait)

> Unpopular opinion: the problem with vibe coding was never the vibes.
>
> It was that "looks good to me" was the entire test suite.
>
> Vibe Agent Building keeps the vibes and fixes the test suite: your feedback becomes evaluation
> examples, and every candidate agent has to pass them again.
>
> Your thumbs-down is a test now. → traigent.ai/vibe-agent-building

## Variant 2 — process walkthrough (LinkedIn, longer)

> Here's what it looks like to build an agent this way, without tuning a single parameter by hand:
>
> 1. Tell a coding agent what you want, in plain English.
> 2. Give it real examples of great (and terrible) outcomes — that becomes the evaluation set.
> 3. It scaffolds the agent and declares what's tunable: models, prompts, retrieval depth.
> 4. Traigent runs the candidates against your evaluation set and surfaces the best
>    accuracy/cost tradeoff it finds.
> 5. You review the failures, leave notes, and your notes become new tests.
>
> There's a name for this now: **Vibe Agent Building.** You bring the taste. The loop brings the
> proof. → traigent.ai/vibe-agent-building

## Image + alt text — attaching the screenshot is mandatory

This is a client-rendered SPA on GitHub Pages, using a `HashRouter`. The page's `<Helmet>` tags
(title, description, `og:*`, Twitter card) are set by JavaScript after the app mounts — social
crawlers do not execute that JavaScript. In practice:

- A crawler fetching the clean path URL (`https://traigent.ai/vibe-agent-building`) gets an HTTP
  404 and `public/404.html` (the redirect page), which carries no page-specific Open Graph tags.
- A crawler fetching the hash URL (`https://traigent.ai/#/vibe-agent-building`) gets the same
  static `index.html` every route ships, whose Open Graph tags are the site's generic
  homepage ones (no page-specific title/description, and the site has no `og:image` set anywhere).

Either way, the post will **not** get a page-specific link-preview card. There is no "no image"
fallback that still looks intentional — a bare link renders with a generic or missing preview on
both LinkedIn and X.

**Required:** screenshot the on-page dictionary card (`§2` of the shipped page, or the miniature
repeat in the footer) at publish time and attach it as the post's image. This is what makes the
post visual; do not post without it.

Dismiss the cookie banner before taking the screenshot — on first visit it dims the page and
covers the card's closing line ("You bring the taste. The loop brings the proof."), which is
the half of the card the post needs most.

**Alt text:** "Dictionary-style definition card: 'vibe agent building (n.) — Building an AI
agent by describing what you want and reacting to what you get, while a coding agent and
Traigent handle the repetitive building, testing, and improving, and trustworthy evaluation
sets and evaluators decide what good actually means. You bring the taste. The loop brings the
proof.'"

**Link in post copy:** the clean human-facing URL (`traigent.ai/vibe-agent-building`) is fine to
use in the visible post text if desired — clicking it works, since `404.html`'s script redirects
the path to the `/#/vibe-agent-building` route that `HashRouter` resolves. That redirect is what
makes the clean URL clickable; it is not what a social-media link-preview crawler will follow, per
the caveat above. If a fallback link is needed anywhere a redirect can't run (e.g. a platform that
only shows the raw URL), give the direct hash form instead:
`https://traigent.ai/#/vibe-agent-building`.

Do not use a stock/AI-generated "robot" or abstract-gradient image — it contradicts the page's own
visual-direction rule (no purple gradients, no robot art) and would undercut the post. Do not
claim a page-specific Open Graph/Twitter-card preview will render until this page (or the site)
has a static or pre-rendered social route — it doesn't exist today.

## Honest notes — no traction guarantee

- These are draft copy and a screenshot suggestion, not a media plan or a guaranteed-reach claim.
  Nothing here promises engagement, clicks, or signups.
- All three variants were checked against the same red lines as the page itself: no planner/
  algorithm internals, no invented numbers (no "10x", no unqualified percentages), "evaluation
  set" never "benchmark," and the human's three jobs (describe, define good, judge) stay visible
  in every summary of the loop.
- Posting cadence, paid boost, and which variant runs first are owner calls — not made here.
- If the "vibe coding" wave has cooled by the time this posts, Variant 1's contrarian hook leans
  hardest on the term still being current; the recommended post and Variant 2 age more gracefully
  since they define the term on its own merits.
