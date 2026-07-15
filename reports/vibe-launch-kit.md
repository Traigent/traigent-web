# Vibe Agent Building — launch kit

Companion to [`vibe-fable-concept.md`](vibe-fable-concept.md) and the shipped page,
[`src/pages/VibeAgentBuilding.jsx`](../src/pages/VibeAgentBuilding.jsx) (`/vibe-agent-building`,
short alias `/vibe`).

## Recommended post

**Platform:** LinkedIn (primary), cross-post to X.
**Voice:** founder, coining the term.

> Vibe coding had a great year. It also shipped a lot of software nobody trusts.
>
> So here's the next term, for agents: **Vibe Agent Building.**
>
> You describe the agent. You define what "good" means — real examples, evaluators you'd trust to
> grade a human. Then a coding agent and an optimization loop do the repetitive building, testing,
> and improving until the numbers clear your bar.
>
> You bring the taste. The loop brings the proof. → traigent.ai/vibe-agent-building

**Why this one:** it's the founder-voice term-coin — the strongest hook for cold reach, and it
matches the page's own hero promise verbatim, so anyone who clicks through sees exactly what the
post described.

## Variant 1 — contrarian hook (X, quote-tweet bait)

> Unpopular opinion: the problem with vibe coding was never the vibes.
>
> It was that "looks good to me" was the entire test suite.
>
> Vibe Agent Building keeps the vibes and fixes the test suite: your feedback becomes evaluation
> examples, and every candidate agent has to pass them again.
>
> Your thumbs-down is a test now. → traigent.ai/vibe-agent-building

## Variant 2 — practitioner walkthrough (LinkedIn, longer)

> I built an agent last week without tuning a single parameter by hand. Here's the loop:
>
> 1. Told a coding agent what I wanted, in plain English.
> 2. Gave it real examples of great (and terrible) outcomes — that became the evaluation set.
> 3. It scaffolded the agent and declared what's tunable: models, prompts, retrieval depth.
> 4. Traigent ran the candidates against my evaluation set and converged toward the best
>    accuracy-for-cost configuration.
> 5. I reviewed the failures, left notes, and my notes became new tests.
>
> There's a name for this now: **Vibe Agent Building.** You bring the taste. The loop brings the
> proof. → traigent.ai/vibe-agent-building

## Image + alt text

No new image asset was generated for this launch — none was in the write scope and none exists
in the repo to reuse honestly. Two options, in order of preference:

1. **Screenshot the on-page dictionary card** (`§2` of the shipped page, or the miniature repeat
   in the footer) at publish time and attach it as the post's image.
   **Alt text:** "Dictionary-style definition card: 'vibe agent building (n.) — Building an AI
   agent by describing what you want and reacting to what you get, while a coding agent and
   Traigent handle the repetitive building, testing, and improving, and trustworthy evaluation
   sets and evaluators decide what good actually means. You bring the taste. The loop brings the
   proof.'"
2. **No image** — LinkedIn/X both render link-preview cards from the page's Open Graph tags
   (title + description are set in the page's `<Helmet>`), so a text-only post still gets a
   card; it just won't be the dictionary-card artwork specifically.

Do not use a stock/AI-generated "robot" or abstract-gradient image — it contradicts the page's own
visual-direction rule (no purple gradients, no robot art) and would undercut the post.

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
