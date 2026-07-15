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
> to grade a person. A coding agent builds it. Then something has to test every candidate
> against your evaluation set and show where each lands — on accuracy and cost, including
> whether any clear your bar.
>
> You bring the taste. The loop brings the proof.
>
> Four of the five steps run today with any coding agent. Step four needs an engine — that's
> what we build at Traigent.
>
> Full definition, and what the loop looks like in practice → traigent.ai/vibe-agent-building

## First comment

> No signup needed to try the method: the playbook our own coding-agent integration follows is
> public at traigent.ai/agent.md — the decorator, the eval-set format, the dry-run-first cost
> rules, and a section on what doesn't work yet. Point your coding agent at it and bring ~10
> real examples. The first run is a mock; it spends nothing.

## Prepared replies

1. **"How is this not a grid search?"** It picks what to try next from run history, so it tests
   a fraction of the combinations instead of all of them — and the playbook it follows is
   public: traigent.ai/agent.md, including the section on what doesn't work yet.
2. **"Doesn't this overfit the eval set?"** It would if you scored the winner on the examples it
   was chosen from — that's the oldest trap in model selection. The playbook's answer is the
   classic one: hold a slice back and judge the finalist on cases it never competed on
   (agent.md, step 14). A margin that doesn't survive that isn't a win.
3. **"Where does our data go?"** **Do not improvise.** One agreed sentence must be signed off by
   the owner before the post goes live (see the pre-post gate in the adjudication); until then
   the reply is: "fair question — that's exactly what the demo call walks through against your
   environment," and nothing more.

**Alternate first line** if the owner wants a softer opener: *"Vibe coding had a great year. It
also shipped a lot of software nobody trusts."* (the prior hook — proven shape, less tension).
Everything else stands.

**Why this one:** it stages the exact gap the page resolves (demo ≠ score), it's an observation
the practitioner audience will self-recognize rather than a fear claim, and it contains no
number, no vendor disparagement, and no absolute. The CTA promises what the click delivers — a
definition and a working loop — which matches the page's manifesto-first structure.

## Variant 1 — retired

Do not publish the former "Unpopular opinion" version. It led with the automatic-feedback claim
that this revision corrects and used a fatigued contrarian opener.

## Variant 2 — process walkthrough (LinkedIn, longer)

> Here's what it looks like to build an agent this way — the parts you do, and the parts you stop
> doing:
>
> 1. Tell a coding agent what you want, in plain English.
> 2. Give it real examples of great (and terrible) outcomes — that's the seed of your evaluation
>    set; you decide what's in it.
> 3. It scaffolds the agent and declares what's tunable: models, prompts, retrieval depth.
> 4. Traigent runs the candidates against your evaluation set and surfaces the best
>    accuracy/cost tradeoff it finds.
> 5. You review the failures, leave notes, and the notes you approve become new tests.
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
an optimization engine handle the repetitive building, testing, and improving, and trustworthy evaluation
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
- The recommended post and live process variant were checked against the same red lines as the
  page itself: no planner/
  algorithm internals, no invented numbers (no "10x", no unqualified percentages), "evaluation
  set" never "benchmark," and the human's three jobs (describe, define good, judge) stay visible
  in every summary of the loop.
- Do not add deployment, retention, privacy, compliance, data-egress, or safe-pilot claims to
  launch copy or comment replies unless sourced from approved security material.
- Posting cadence, paid boost, and which variant runs first are owner calls — not made here.
- The recommended post and Variant 2 age gracefully because they define the term on its own
  merits instead of relying on a contrarian hook.
