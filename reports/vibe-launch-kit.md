# Vibe Agent Building — launch kit

Companion to the shipped page,
[`src/pages/VibeAgentBuilding.jsx`](../src/pages/VibeAgentBuilding.jsx) (`/vibe-agent-building`,
short alias `/vibe`).

## Canonical LinkedIn post

**Platform:** LinkedIn (primary), cross-post to X.
**Voice:** founder, coining the term.
**Publish from:** the founder's personal profile; mention the Traigent company page once.

> You've tuned your agent.
>
> When did you last tune the thing grading it?
>
> Most teams already have an agent. Many have evals. But the test set and the judge often stay
> frozen while the agent keeps changing.
>
> That's the gap behind a practice we're calling:
>
> **Vibe Agent Building.**
>
> Three artifacts decide what ships:
>
> **The examples.** Are they hard enough to separate good from convincing?
>
> **The evaluator.** Does it agree with your experts and stay consistent?
>
> **The agent.** Can a challenger beat what runs today on cases it never competed on — at a cost
> you can see?
>
> Start with the agent and evals you already have. Missing one — or both? Start there. No
> coding-agent plugin. No AGENT.md edits.
>
> **You bring the taste. The loop brings the proof.**
>
> That's the lifecycle we're building at @Traigent.
>
> The full definition — and what the loop looks like in practice:
>
> https://traigent.ai/vibe-agent-building
>
> What evidence would you need before trusting an agent to act in your name?
>
> #VibeAgentBuilding

## First comment — publish within two minutes

> No new agent is required, and no coding-agent setup file has to change.
>
> The SDK is public at https://github.com/Traigent/Traigent. Connect it around the agent function
> you already run, bring the evals or real cases you already trust, and begin in mock mode.
>
> The mock run calls no models, so it spends nothing.

## Launch runbook

### Hard gate before posting

Do not publish until `https://traigent.ai/vibe-agent-building` works in a fresh private browser
window on both desktop and mobile. As of 2026-07-16, the page exists locally but has not been
pushed or deployed; the clean production URL still returns 404.

Complete these checks at least two hours before the planned post:

1. Deploy the page and confirm the clean URL redirects to the correct HashRouter route.
2. Test all three audience routes, the SDK CTA, GitHub link, demo CTA, and mobile navigation.
3. Dismiss the cookie banner and capture the three-artifact lifecycle visual for the post image.
4. Confirm the person posting can stay in the comments for the next 60–90 minutes.
5. Brief anyone answering comments on the approved security response below.

### When to post

**Primary slot:** Wednesday at **18:00 Israel time**. This overlaps 11:00 US Eastern, 08:00 US
Pacific, 16:00 UK, and 17:00 Central Europe during northern-hemisphere daylight-saving time.

**US-first alternative:** Wednesday at **23:00 Israel time** (16:00 Eastern, 13:00 Pacific), but
only if the founder can remain available to reply afterward.

**Initial launch opportunity:** if the page is live and fully verified by 16:00 on Thursday,
2026-07-16, publish at 18:00 that day. Otherwise use Wednesday, 2026-07-22, at 18:00.

These are starting hypotheses, not universal rules. Buffer's 2026 analysis of 4.8 million posts
favors Wednesday and late afternoon, while Sprout Social's 2026 analysis favors Tuesday through
Thursday from late morning through afternoon. After launch, use the founder profile's own
LinkedIn analytics to choose future slots.

- Buffer timing study: https://buffer.com/resources/best-time-to-post-on-linkedin/
- Sprout Social timing study: https://sproutsocial.com/insights/best-times-to-post-on-linkedin/

### Image and alt text

Attach the three-artifact lifecycle screenshot rather than depending on a URL preview. Export a crisp PNG
at approximately **1200 × 627 px** or another LinkedIn-supported ratio. Keep the text large enough
to read on a phone. LinkedIn's current photo guidance recommends at least 1080 px width and accepts
ratios from 3:1 through 4:5:
https://www.linkedin.com/help/linkedin/answer/a527229/share-photos-or-videos?lang=en

Use this alt text:

> Three-artifact lifecycle for Vibe Agent Building: the examples ask whether the cases are hard
> enough, the evaluator asks whether the judge agrees with experts, and the agent asks whether a
> challenger beats what runs today. Three artifacts, one loop. You approve every change.

### First 90 minutes

1. Add the first comment above within two minutes.
2. Reply to every substantive comment; answer the point and ask a genuine follow-up question.
3. Invite informed disagreement. Ask AI leaders, evaluation engineers, founders, domain experts,
   and coding-agent users for their real view — never give them canned comments.
4. Do not ask for generic likes or coordinate an engagement pod.
5. Have the Traigent company page join with a useful comment, not a duplicate of the post.
6. Capture repeated objections and phrases people use; they become material for the follow-ups.

LinkedIn recommends treating posts as conversations and using thoughtful replies to keep them
going:
https://www.linkedin.com/business/talent/blog/talent-acquisition/how-to-write-engaging-post-in-linkedin-feed

### Follow-up sequence

- **Day 1:** the category-defining post above.
- **Day 2:** a short clip about checking the evaluator before trusting its score.
- **Day 3:** a short clip about strengthening the examples with real failures and hard cases.
- **Day 5:** a short product clip showing the agent-challenge step and its accuracy/cost evidence.
- **Week 2:** answer the strongest serious objection from the launch comments.
- **Week 3:** publish a real customer or internal example only when the evidence is ready.

Do not repost the same copy repeatedly. Each follow-up should add evidence, a useful example, or a
clear answer to an objection.

### What to measure after 72 hours

- Substantive comments from the target personas, not total reactions alone.
- People independently using or repeating the phrase "Vibe Agent Building."
- Founder-profile views and relevant connection requests.
- Unique visitors to the page, SDK starts, and public-repository clicks.
- Demo requests and security-review conversations.
- Impressions, members reached, comments, reposts, and viewer demographics from LinkedIn analytics.

Record the numbers and the three strongest objections before publishing the next post.

## Prepared replies

1. **"How is this not a grid search?"** It picks what to try next from run history, so it tests
   a fraction of the combinations instead of all of them.
2. **"Doesn't this overfit the eval set?"** It would if you scored the winner on the examples it
   was chosen from — that's the oldest trap in model selection. Hold a slice back and judge the
   finalist on cases it never competed on. A margin that doesn't survive that isn't a win.
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

## Variant 2 — lifecycle walkthrough (LinkedIn, longer)

> Here's what the lifecycle looks like when you already have an agent:
>
> 1. Connect the agent you run today.
> 2. Bring the evals, goldens, fixtures, or real cases you already trust.
> 3. Check the examples and the evaluator before trusting the score; you approve every change.
> 4. Challenge the current agent with candidates, then judge the finalist on held-back cases.
> 5. See the margin, the cost, and what still fails. You decide whether to ship or loop again.
>
> There's a name for this now: **Vibe Agent Building.** You bring the taste. The loop brings the
> proof. → traigent.ai/vibe-agent-building

## Image + alt text — attaching the screenshot is mandatory

This is a client-rendered SPA on GitHub Pages, using a `HashRouter`. The clean path
(`https://traigent.ai/vibe-agent-building`) is backed by a static metadata document so social and
search crawlers can read the page-specific title, description, canonical URL, and text-card tags
without executing JavaScript. Browsers are then redirected to the interactive
`/#/vibe-agent-building` route.

The static document does not declare an `og:image`, so platforms may render a text-only preview.
The attached lifecycle screenshot remains the launch asset and should not be replaced by an
assumed generated preview.

**Required:** screenshot the on-page three-artifact lifecycle visual at publish time and attach it
as the post's image. This is what makes the argument tangible; do not post without it. The
dictionary card (`§2` or its footer repeat) is the alternate asset.

Dismiss the cookie banner before taking the screenshot — on first visit it dims the page and
covers the card's closing line ("You bring the taste. The loop brings the proof."), which is
the half of the card the post needs most.

**Alt text:** "Three-artifact lifecycle for Vibe Agent Building: the examples ask whether the
cases are hard enough, the evaluator asks whether the judge agrees with experts, and the agent
asks whether a challenger beats what runs today. Three artifacts, one loop. You approve every
change."

**Link in post copy:** use the clean human-facing URL (`traigent.ai/vibe-agent-building`). Its
static document carries the crawlable metadata and redirects browsers to the HashRouter route.

Do not use a stock/AI-generated "robot" or abstract-gradient image — it contradicts the page's own
visual-direction rule (no purple gradients, no robot art) and would undercut the post. Do not
claim that a platform will render the attached screenshot as the link-card image; the static route
provides text-card metadata but deliberately has no `og:image`.

## Honest notes — no traction guarantee

- These are draft copy and a screenshot suggestion, not a media plan or a guaranteed-reach claim.
  Nothing here promises engagement, clicks, or signups.
- The recommended post and live process variant were checked against the same red lines as the
  page itself: no planner/
  algorithm internals, no invented numbers (no "10x", no unqualified percentages), "evaluation
  set" never "benchmark," and the human's jobs (bring the bar, approve changes, decide what
  ships) stay visible in every summary of the loop.
- Do not add deployment, retention, privacy, compliance, data-egress, or safe-pilot claims to
  launch copy or comment replies unless sourced from approved security material.
- Posting cadence, paid boost, and which variant runs first are owner calls — not made here.
- The recommended post and Variant 2 age gracefully because they define the term on its own
  merits instead of relying on a contrarian hook.
