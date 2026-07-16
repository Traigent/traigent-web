# Vibe Agent Building — lifecycle media brief

**Status:** production brief · **Owner:** Traigent product marketing · **Date:** 2026-07-16

## Decision

Use a hybrid:

1. The page ships now with a scannable three-artifact lifecycle visual.
2. Produce one **50-second lifecycle film** for the page and LinkedIn.
3. Cut that master into three focused follow-ups: examples, evaluator, and agent.

Do not put the two older single-optimization recordings back on the page. They accurately show one
agent-optimization step, but their framing makes that step look like the whole lifecycle.

## Fable adjudication

Fable reviewed the shipped page, launch kit, SDK entry page, and the grounded three-artifact
lifecycle. Its verdict was **REVISE**: the craft and claim discipline were strong, but the hero
centered greenfield users, `/agent.md` and skill-bundle routes created the wrong integration
expectation, and the old video captions reduced the story to one agent-optimization experiment.

Adopted from the discussion:

- Put existing agent + existing eval users first, then existing agent/no evals, then greenfield.
- Use three explicit artifacts: examples, evaluator, and agent.
- Stop promoting `/agent.md`, skill bundles, and coding-agent plugins in this campaign's
  acquisition journey; legacy assets may remain available for developers who explicitly want them.
- Use one lifecycle master plus focused follow-up cuts, backed by a no-play static visual.
- Never fabricate dataset or evaluator UI to complete the film.

Adjusted after adjudication:

- The page keeps five lifecycle stations rather than adding a sixth; five scans faster and still
  preserves all three artifacts.
- The terminal story uses no decorative dataset counts.
- Copy promises an explicit SDK integration around existing code, not "zero code changes."
- Both old videos are removed now rather than leaving one interim clip that could still anchor the
  page on a single optimization run.

## Why 50 seconds

- LinkedIn advises B2B teams to start with the audience, use one video per point, subtitle the
  result, and make the first six seconds count. Its current guidance recommends 15–30 seconds for
  awareness and under two minutes for deeper engagement.
- Vidyard reports that 65% of viewers finish videos under one minute and that retention falls as
  runtime grows; it recommends front-loading the main takeaway.
- Wistia's 2026 report finds that shorter videos have higher engagement and that educational and
  product videos perform best when they get to the point.
- LinkedIn's analysis of more than 13,000 B2B video ads found stronger dwell or engagement when
  work used expert speakers, conversational delivery, human-centered stories, authenticity, and
  immediate relevance. Those findings choose the format; they are not Traigent performance claims.

Sources:

- https://business.linkedin.com/content/dam/me/business/en-us/marketing-solutions/case-studies/pdfs/b2b_video_top_tips.pdf
- https://www.linkedin.com/business/marketing/blog/content-marketing/13-top-tips-for-compelling-b2b-video-content-on-linkedin
- https://business.linkedin.com/content/dam/business/marketing-solutions/global/en_US/site/pdf/wp/2025/the-art-and-science-of-video.pdf
- https://www.vidyard.com/business-video-benchmarks/
- https://wistia.com/blog/video-marketing-statistics

## The one message

> You already tune the agent. Vibe Agent Building strengthens the examples and the evaluator too —
> then shows whether a challenger earns the right to ship.

Everything in the film must support that sentence. Anything else becomes a follow-up asset.

## Audience recognition

The first six seconds must make the largest audience say, "This starts with my existing agent and
evals." Greenfield viewers should still understand that missing artifacts can be created, but they
are not the headline.

## 50-second storyboard

| Time | Picture and on-screen copy | Voiceover | Evidence requirement |
| --- | --- | --- | --- |
| 0:00–0:06 | Founder, direct to camera. `You tuned the agent. What tuned the judge?` | "You keep tuning your agent. When did you last question the thing grading it?" | No product UI. Start on the human face; no logo bumper. |
| 0:06–0:14 | Three cards: `THE EXAMPLES` · `THE EVALUATOR` · `THE AGENT` | "Three artifacts decide what ships: the examples, the evaluator, and the agent itself." | Motion graphic based on the page's real three-card visual. |
| 0:14–0:24 | `Does the judge agree with your experts?` | "Before a score chooses a winner, the evaluator has to agree with the people whose judgment matters." | Use shipped evaluator UI only. If none exists, stay typographic; never fabricate a portal screen. |
| 0:24–0:33 | `Are the hard cases in the set?` | "Then the examples: keep the cases that separate good from convincing, and add the failures you actually care about." | Use shipped dataset UI only. Otherwise show approved real-case cards, not fake analytics. |
| 0:33–0:43 | Challenger versus incumbent; quality and cost visible. `Better — on cases it never competed on?` | "Only then does a challenger face what you run today, including cases it never competed on, at a cost you can see." | Reuse real portal footage only if the caption and crop match exactly what is shown. |
| 0:43–0:50 | Founder, then lifecycle lockup and URL. `You bring the taste. The loop brings the proof.` | "You decide what good means. You decide what ships. The loop does the repetitive work — and shows its evidence." | End card: `traigent.ai/vibe-agent-building`. |

## Production rules

- Master: 4:5 vertical, 1080×1350, with a safe center crop for 16:9 page placement.
- Burn in accurate subtitles; assume muted playback.
- First frame contains the hook, not a logo or title animation.
- Use founder audio and real product capture. No AI avatar, stock robot, or fabricated UI.
- Keep cuts purposeful. The lifecycle should feel like one connected decision, not three feature ads.
- Use the page's black, slate, amber, and blue system. Amber = human-owned bar; blue = machine work.
- Make every product claim visible in the footage or state it as a human principle, not product UI.
- Include a static poster that communicates the three artifacts without play.

## Page fallback — eight-second scan

The page must work without video:

| The examples | The evaluator | The agent |
| --- | --- | --- |
| Are they hard enough? | Does it agree with your experts? | Is it better than what runs today? |

> **Three artifacts. One loop. You approve every change.**

This visual is also the video's poster and the launch-post screenshot.

## Follow-up cuts

- **18 seconds — awareness:** hook + three cards + closing line.
- **20–25 seconds — evaluator:** why the judge must earn trust before its score chooses a winner.
- **20–25 seconds — examples:** real failures, hard cases, and human approval of changes.
- **20–25 seconds — agent:** challenger versus incumbent, held-back cases, quality, and cost.

Each cut makes one point. Do not stitch all three short cuts into a second pseudo-master.

## Acceptance gate

- Runtime is 45–55 seconds.
- The first six seconds mention the existing agent or evaluator.
- All three artifacts appear by second 14.
- The words `plugin`, `AGENT.md`, and `agent.md` do not appear as requirements or CTAs.
- No internal thresholds, algorithms, policies, certificates, or planner implementation details.
- No fabricated dataset or evaluator screen.
- Any numbers shown are captured from a real, reproducible run and qualified to that run.
- Captions, transcript, poster, reduced-motion fallback, and adjacent text alternative are ready.
- A staff engineer can answer, after one watch: what they bring, what the loop changes, and who
  decides whether to ship.
