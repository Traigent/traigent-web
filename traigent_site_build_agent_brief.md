# Build brief for the agent that will create the Traigent website expansion

## Role
You are a senior product-marketing, developer-relations, website, and technical-content agent.

Your job is to expand **traigent.ai** into a product-led growth surface that does four things at once:

1. explains what Traigent does in plain language,
2. proves the value with credible demos,
3. educates the market with a free course about agents in production,
4. converts qualified visitors into demo requests, trials, or GitHub engagement.

Keep the **homepage product-first**. Put educational content and demos into dedicated sections. Treat **TVL** as a separate initiative with its own site and book; mention it only where it helps explain formal specification and governed optimization.

---

## Strategic context and motivation
Traigent should own the story that matters most to teams shipping agents:

- many teams can build an impressive demo,
- very few teams can trust an agent in production,
- the hard part is not just model choice,
- the hard part is setting goals, measuring behavior, exploring trade-offs, governing change, and promoting improvements safely.

The site must teach this category and make Traigent the natural platform for it.

The educational framing should revolve around:

- agents as systems, not prompts,
- goals and metrics beyond accuracy,
- trade-offs across quality, latency, cost, safety, and policy,
- experimentation and rollout in production,
- versioning, provenance, reproducibility, and governance,
- technical debt from ad hoc agent tuning.

This is the narrative that powers the website, course, demos, and GitHub repository.

---

## Non-negotiable positioning rules

### What Traigent is
Traigent is the platform for **measuring, optimizing, governing, and promoting AI agents in production**.

### What Traigent is not
Traigent is not just an eval dashboard, not just a prompt playground, and not just a TVL documentation host.

### What TVL is
TVL is a **broader, standalone language and initiative** for formal agent specification. It should be referenced as a specification layer or related initiative, not collapsed into the Traigent product narrative.

### Relationship between Traigent and TVL
Use language like this:

- "Traigent helps teams optimize and govern agent systems in production."
- "Formal specifications can make objectives, constraints, and tunable variables explicit."
- "TVL is one broader initiative for formal agent specification; learn more at tvl-lang.org."

Do **not** position Traigent as if it is merely a thin wrapper around TVL.
Do **not** recreate TVL docs, examples, reference pages, or book content on Traigent.
Do **not** make the Traigent site compete with TVL for documentation SEO.

---

## Primary audiences

### 1. Engineering leaders and CTOs
They care about production trust, quality, cost, latency, governance, and operational risk.

### 2. Applied AI / ML / platform teams
They care about tuning surfaces, evaluation, rollout policy, reproducibility, and tooling.

### 3. Product and innovation teams
They care about use cases, trade-offs, faster iteration, and business outcomes.

### 4. Researchers / technical evaluators
They care about formalism, clear assumptions, methodology, reproducibility, and evidence.

Write for intelligent technical readers who appreciate rigor but do not want jargon-heavy academic writing.

---

## Core site architecture
Build the following structure on **traigent.ai**.

### 1. Homepage: `/`
Purpose: explain the product quickly and convert.

### 2. Demos hub: `/demos`
Purpose: show proof with reproducible examples.

### 3. Individual demo pages
Suggested launch set:
- `/demos/rag-support-optimizer`
- `/demos/tier-aware-router`
- `/demos/promotion-gates`

### 4. Academy landing page: `/academy`
Purpose: host and promote educational content.

### 5. Course landing page
Suggested slug:
- `/academy/agents-in-production`

### 6. Individual course lesson pages
Suggested slugs:
- `/academy/agents-in-production/01-from-demos-to-systems`
- `/academy/agents-in-production/02-goals-and-tradeoffs`
- `/academy/agents-in-production/03-tunable-systems`
- `/academy/agents-in-production/04-evaluation-and-telemetry`
- `/academy/agents-in-production/05-rollout-and-promotion`
- `/academy/agents-in-production/06-governance-provenance-and-debt`

### 7. Resources hub: `/resources`
Purpose: articles, essays, and thought-leadership.

### 8. Specification bridge page
Use a bridge slug such as:
- `/specifications`
- or `/formal-specs`

Prefer **not** to use `/tvl` on Traigent unless there is a strong reason. A bridge page is better than a duplicate brand surface.

### 9. Portal / product CTA destination
Use the existing product portal / registration experience as the action surface for:
- try product,
- request access,
- start optimizing.

---

## Navigation and linking rules
Top navigation should prioritize:

- Product
- Demos
- Academy
- Resources
- Try Traigent

The course must be visible from:

- top nav,
- homepage hero or near-hero,
- homepage mid-page educational section,
- all demo pages,
- all resources articles,
- footer.

The demos must be visible from:

- homepage,
- academy course landing,
- relevant lessons,
- resources hub,
- footer.

The specifications bridge page should be visible from:

- footer,
- selected technical pages,
- relevant lesson sidebars,
- demo pages where a spec file is part of the artifact.

Do not put deep TVL links in the primary conversion path. Use them as technical enrichment.

---

## Deliverables the agent must produce

1. A clean sitemap and internal linking plan.
2. Final page copy drafts for homepage, demos hub, each demo page, academy landing, course landing, six lesson pages, resources hub, three launch articles, and the specifications bridge page.
3. A reusable demo page template.
4. A public GitHub repository for demos.
5. Demo assets: scripts, sample datasets, specs, diagrams, result charts, screenshots, and README files.
6. Course assets: lesson copy, visuals, exercises, worksheets or checklists.
7. SEO assets: titles, descriptions, social cards, schema markup recommendations.
8. Analytics event plan.
9. Launch checklist and acceptance checklist.

---

## Homepage requirements
The homepage should remain concise, conversion-oriented, and evidence-led.

### Homepage structure
1. Hero
2. Trust / proof strip
3. Why agents fail in production
4. What Traigent does
5. Featured demos
6. Free course block
7. Light formal-specification block
8. Final CTA

### Homepage draft copy
#### Eyebrow
Trust your AI agents in production

#### Headline
Measure, optimize, and promote agents with confidence

#### Subheadline
Traigent helps teams turn fragile agent prototypes into governed production systems across quality, cost, latency, and policy constraints.

#### Primary CTA
Try Traigent

#### Secondary CTA
See demos

#### Tertiary CTA
Take the free course

### Homepage section draft: Why agents fail in production
Most teams do not fail because they picked the wrong model. They fail because the agent is under-specified, success is vague, trade-offs are invisible, and changes are rolled out without enough evidence. Traigent gives teams a system for measuring behavior, exploring the configuration space, enforcing constraints, and promoting better versions safely.

### Homepage section draft: What Traigent does
Use Traigent to define what matters, compare candidate configurations, optimize across competing objectives, and move changes from offline evaluation to governed rollout. Stop shipping prompt changes on intuition alone.

### Homepage section draft: Formal specifications
Better agent systems start with clearer requirements. Traigent can work with explicit objectives, constraints, and tunable variables. For teams going deeper into formal agent specification, visit TVL at tvl-lang.org.

### Homepage section draft: Free course
Free course: **Agents in Production**. Learn how to move from demos to measurable, governed, production-ready agent systems.

---

## Demos hub requirements
The demos hub must prove that the product works in practice.

### Demos hub structure
1. Hero
2. What these demos show
3. Demo cards
4. Methodology / reproducibility statement
5. GitHub CTA
6. Final product CTA

### Demos hub draft copy
#### Headline
See governed agent engineering in practice

#### Subheadline
Explore reproducible demos that show how Traigent helps teams optimize quality, latency, cost, routing, and promotion decisions in production-like agent systems.

#### Reproducibility statement
Every demo must include the problem definition, the tunable variables, the objectives, the constraints, the dataset, the scripts, and the resulting artifacts. If a visitor cannot inspect the method, the demo is not credible.

---

## Demo page template
Every demo page must contain these sections in this order.

1. Title and one-sentence value proposition
2. The production problem
3. System diagram
4. What is tunable
5. What is optimized
6. What constraints are enforced
7. Dataset and data card
8. Baseline configuration
9. Candidate / optimized configurations
10. Results and charts
11. Failure analysis
12. What this means for a real team
13. GitHub repo links
14. Related lesson links
15. CTA to Try Traigent
16. Caveats and limitations

Each demo page must link to:
- the repo root,
- the demo subdirectory,
- the dataset documentation,
- the spec file,
- the scripts used to generate the result,
- a short methodology note.

---

## Launch demo set
Launch with three demos.

### Demo 1: RAG Support Optimizer
#### Goal
Show how a support or documentation agent can be optimized across answer quality, citation quality, latency, and cost.

#### Suggested tunables
- model
- retriever top-k
- chunk size
- reranker on/off
- prompt strategy
- output format
- confidence threshold
- fallback policy

#### Suggested objectives
- answer quality
- citation correctness
- latency
- cost

#### Suggested constraints
- must cite at least one source when answering factual questions
- hallucination rate must remain below a threshold
- p95 latency must remain below a threshold
- abstain or escalate on low-confidence cases

#### Dataset
Use a public or synthetic support corpus with a clear data card.
Preferred option: a synthetic but realistic product help center corpus plus labeled evaluation questions and reference answers.

#### Draft hero copy
Optimize a support agent across quality, speed, and cost

#### Draft summary
This demo shows how a retrieval-based support agent stops being a collection of guesses and becomes a governed system. Inspect the tunable variables, compare the baseline and optimized candidates, and see how better trade-offs emerge when objectives and constraints are explicit.

---

### Demo 2: Tier-Aware Router
#### Goal
Show how routing policies differ across user tiers, request complexity, and budget constraints.

#### Suggested tunables
- model per tier
- routing threshold
- escalation threshold
- context budget
- fallback behavior
- retry policy
- retrieval depth

#### Suggested objectives
- quality by tier
- cost
- latency
- resolution rate

#### Suggested constraints
- enterprise tier quality floor
- free tier cost ceiling
- protected intents must escalate
- unsafe outputs must be blocked

#### Dataset
Synthetic ticket or request dataset labeled by tier, intent, difficulty, and expected handling path.

#### Draft hero copy
Route the right requests to the right path at the right cost

#### Draft summary
This demo shows that routing is not just an implementation detail. It is part of the governed decision surface of an agent system. Compare policies for free and enterprise tiers, inspect the constraints, and see how cost and quality trade-offs change when routing becomes explicit.

---

### Demo 3: Promotion Gates
#### Goal
Show how a candidate configuration can be promoted or rejected based on offline and online evidence, with rollback criteria.

#### Suggested tunables
- promotion alpha
- minimum effect size
- traffic split
- rollback thresholds
- guardrail metrics
- canary duration

#### Suggested objectives
- improvement over baseline
- regression risk minimization
- complaint-rate minimization
- stability

#### Suggested constraints
- no degradation on critical guardrail metrics
- latency cap
- cost cap
- rollback on statistically meaningful regression or threshold breach

#### Dataset
Synthetic replay dataset or production-like trace log with offline scores and online guardrail metrics.

#### Draft hero copy
Promote agent changes with evidence, not hope

#### Draft summary
This demo shows the difference between experimentation and governance. A new configuration is not promoted because it looks better in one chart. It is promoted because it clears explicit gates, beats the baseline under defined criteria, and remains reversible.

---

## GitHub repository requirements
Create a public GitHub repository for the demos.

### Preferred repo name
- `traigent/demos`

If unavailable, use:
- `traigent/agent-demos`
- or `traigent/agents-in-production-demos`

### Repo principles
- every demo must be inspectable,
- every demo must be runnable on a sample dataset,
- every dataset must have provenance and usage notes,
- every result shown on the website must be traceable to scripts in the repo,
- no secrets,
- no proprietary customer data,
- no copyrighted datasets without redistribution rights.

### Recommended repo structure
```text
README.md
LICENSE
CONTRIBUTING.md
.env.example
Makefile
pyproject.toml / requirements.txt
Dockerfile

common/
  utils/
  plotting/
  eval/
  schemas/

demos/
  rag-support-optimizer/
    README.md
    specs/
      problem.md
      config.yaml
      config.tvl.yml            # optional if appropriate
    datasets/
      README.md
      sample/
      full/
      data_card.md
    scripts/
      prepare_data.py
      run_baseline.py
      run_optimize.py
      evaluate.py
      generate_report.py
    results/
      report.md
      metrics.json
      plots/
      screenshots/

  tier-aware-router/
    ...

  promotion-gates/
    ...

docs/
  methodology.md
  metrics.md
  reproducibility.md
```

### Required files in each demo
- `README.md`
- `problem.md`
- config or spec file
- sample dataset
- data card
- scripts to reproduce outputs
- a checked-in report artifact
- at least one chart
- at least one screenshot or architecture diagram

### Required run experience
Visitors should be able to:
- understand the demo by reading the README,
- run a sample pipeline,
- inspect a static results artifact without running anything,
- compare baseline vs optimized output.

### Reproducibility standard
The repo must support either:
- `make demo-rag-support`
- or one clearly documented command sequence.

Do not publish a demo page until the repo artifacts exist.

---

## Academy requirements
The academy is the educational surface.

### Academy goals
- educate the market,
- define the category,
- earn trust,
- create top-of-funnel demand,
- move readers into demos and product evaluation.

### Academy positioning
This is not a generic intro to agents.
It is a practical course about **agents in production**.

### Academy landing page draft
#### Headline
Agents in Production

#### Subheadline
A free practical course on measurement, optimization, telemetry, rollout, and governance for AI agents.

#### Who it is for
Engineering leaders, applied AI teams, platform teams, and technical product builders who want to move from prototype agents to production systems.

#### What learners will get
- a systems view of agents,
- a framework for defining objectives and constraints,
- guidance for evaluation and telemetry,
- rollout and promotion patterns,
- reproducible demos and artifacts.

#### CTA
Start the course

### Academy page sections
1. Course hero
2. Why this course exists
3. Who it is for
4. Learning outcomes
5. Lesson list
6. Demo connections
7. CTA to start lesson 1
8. CTA to Try Traigent

---

## Free course: initial draft
Course title:
**Agents in Production: Measurement, Optimization, and Governance**

Target length:
- 6 lessons
- each lesson 8 to 15 minutes to read
- each lesson includes one diagram, one short exercise, one checklist, and one pointer to a related demo

### Lesson 1: From Demos to Systems
#### Purpose
Explain why prototype success does not equal production readiness.

#### Draft intro
Most agent projects look impressive in a controlled walkthrough and disappoint in real use. The reason is simple: a production agent is not just a model call or a prompt. It is a system with inputs, policies, routing choices, retrieval behavior, fallback logic, users, costs, latency targets, and operational consequences. This lesson introduces the shift from “can we make it work?” to “can we trust it in production?”

#### Learning outcomes
- distinguish a prototype from a production system,
- identify the hidden moving parts in an agent stack,
- define the production questions a team must answer before rollout.

#### Exercise
Take one existing agent idea and list all system-level choices that affect its behavior.

#### Related demo
RAG Support Optimizer

---

### Lesson 2: Goals and Trade-offs
#### Purpose
Teach that accuracy alone is not enough.

#### Draft intro
A team says it wants a “better” agent. Better in what sense? More accurate, faster, cheaper, safer, more polite, more compliant, or more likely to escalate when it should? Production work begins when vague preferences become explicit objectives and constraints. In this lesson, learners define what success means and where the trade-offs live.

#### Learning outcomes
- separate objectives from constraints,
- identify the key metrics for a production agent,
- write a first pass at a measurable success definition.

#### Exercise
Create a scorecard for one agent with 3 objectives and 3 non-negotiable constraints.

#### Related demo
Tier-Aware Router

---

### Lesson 3: Tunable Systems
#### Purpose
Show that prompts are only one part of the design space.

#### Draft intro
Teams often talk about agent tuning as if it means changing a prompt, but production behavior depends on many choices: model selection, retrieval depth, chunking, router thresholds, tool permissions, retry logic, output format, and escalation rules. Treating these choices as a governed search space turns guesswork into engineering.

#### Learning outcomes
- identify tunable variables across the full system,
- separate fixed architecture from tunable configuration,
- understand why ad hoc tweaking creates technical debt.

#### Exercise
Map the tunable variables in your current or imagined agent system.

#### Related demo
RAG Support Optimizer

---

### Lesson 4: Evaluation and Telemetry
#### Purpose
Teach how to connect offline evaluation and online observation.

#### Draft intro
A benchmark score is useful, but it is not the whole story. Production teams need offline tests, online metrics, failure taxonomies, trace inspection, user feedback, and guardrail monitoring. This lesson shows how to build a measurement layer that helps teams learn from real behavior instead of relying on anecdotes.

#### Learning outcomes
- distinguish offline and online evaluation,
- define telemetry worth capturing for agents,
- build a failure taxonomy for iterative improvement.

#### Exercise
Write down the telemetry you would capture for one customer-facing agent.

#### Related demo
Tier-Aware Router

---

### Lesson 5: Rollout and Promotion
#### Purpose
Explain safe experimentation and promotion criteria.

#### Draft intro
The hard part of improvement is not just finding a promising candidate. It is deciding whether that candidate should replace the baseline. Safe rollout requires explicit promotion gates, guardrails, rollback conditions, and evidence thresholds. This lesson shows how to move from experimentation to governed deployment.

#### Learning outcomes
- explain canary, shadow, staged rollout, and rollback patterns,
- define promotion rules for a candidate configuration,
- understand why “looks better” is not enough.

#### Exercise
Write a simple promotion policy for one agent update.

#### Related demo
Promotion Gates

---

### Lesson 6: Governance, Provenance, and Technical Debt
#### Purpose
Close the course with operational discipline.

#### Draft intro
As agent systems grow, teams inherit a new kind of technical debt: undocumented prompt changes, unclear routing logic, weak traceability, irreproducible evaluations, and hand-tuned configurations that only one person understands. Production maturity means knowing what changed, why it changed, how it was evaluated, and when to reverse it. This lesson ties governance, provenance, and maintainability together.

#### Learning outcomes
- define provenance requirements for agent changes,
- identify common forms of agent-related technical debt,
- create a minimum governance checklist for future iterations.

#### Exercise
Audit an existing workflow for reproducibility and governance gaps.

#### Related demo
Promotion Gates

---

### Optional bonus lesson / outbound enrichment
#### Title
Formal agent specification with TVL

#### Rule
This should not be a full Traigent-hosted TVL tutorial. It should be a short bridge lesson or sidebar block that explains why formal specifications matter and points readers to tvl-lang.org for the deeper material.

#### Draft copy
Want to go deeper into formal agent specification? TVL is a broader language for describing tunable variables, constraints, objectives, and promotion policies in AI systems. Explore the guide, reference, examples, and book at tvl-lang.org.

---

## Resources hub and launch article set
Create `/resources` and launch with three substantial articles.

### Article 1
#### Title
From Prompt Engineering to Governed Optimization

#### Abstract draft
Prompt engineering is a useful starting point, but it breaks down when teams need reproducibility, controlled trade-offs, and safe rollout. This article explains how production agent work shifts from prompt tweaking toward explicit objectives, constraints, and governed exploration of the configuration space.

### Article 2
#### Title
Accuracy Is Not Enough for Production Agents

#### Abstract draft
The best-looking demo can still be too slow, too expensive, too brittle, or too risky to ship. This article explains how quality, latency, cost, safety, and escalation behavior interact in production systems, and why teams need a broader scorecard.

### Article 3
#### Title
Why Every Production Agent Needs Promotion Gates

#### Abstract draft
Many agent regressions happen because teams replace a baseline without explicit promotion criteria. This article explains staged rollout, guardrails, minimum effect sizes, rollback conditions, and the difference between experimentation and governance.

Every article must end with:
- a demo CTA,
- a course CTA,
- a Try Traigent CTA.

---

## Specifications bridge page requirements
Create a short page at `/specifications` or `/formal-specs`.

### Purpose
Explain why agent systems benefit from explicit objectives, constraints, and tunable variables, while sending deeper formal-spec readers to TVL.

### Length
Target 400 to 800 words.

### Must include
- why agents are often under-specified,
- why explicit objectives and constraints help,
- how this relates to Traigent’s governed optimization narrative,
- a brief mention of TVL,
- prominent outbound links to:
  - `https://tvl-lang.org/`
  - `https://tvl-lang.org/getting-started/`
  - `https://tvl-lang.org/reference/language/`
  - `https://tvl-lang.org/examples/walkthroughs/`
  - `https://tvl-lang.org/book/`

### Must not include
- copied TVL docs,
- copied TVL examples,
- copied TVL reference tables,
- duplicated book content,
- SEO-heavy keyword stuffing around TVL terms.

### Draft bridge-page copy
Better agent systems start with clearer specifications. Teams struggle when goals are vague, constraints are implicit, and important choices live in scattered prompts and code. Formal specification helps make tunable variables, quality targets, guardrails, and promotion criteria explicit. For readers who want to go deeper, TVL is a broader initiative for formal agent specification. Explore TVL at tvl-lang.org.

---

## Editorial and UX instructions

### Tone
- technical,
- credible,
- concrete,
- practical,
- calm,
- evidence-led.

### Avoid
- hype,
- vague superiority claims,
- hand-wavy benchmarks,
- “revolutionary” language,
- empty agent buzzwords.

### Preferred style
- short paragraphs,
- explicit trade-offs,
- diagrams over fluff,
- before/after structure,
- clear CTAs,
- visible methodology.

### Visual guidance
Use:
- system diagrams,
- Pareto frontier charts,
- rollout gate diagrams,
- trace / provenance screenshots,
- concise callout boxes.

Do not hide the evidence behind decorative marketing visuals.

---

## SEO and structured data requirements

### SEO goals
- rank for terms around agents in production, agent optimization, governed agent rollout, agent evaluation in production, and production AI agent architecture,
- avoid competing directly with TVL docs and reference queries,
- create strong internal linking between educational and product pages.

### Structured data to use where relevant
- `Course`
- `TechArticle`
- `SoftwareSourceCode`
- `Dataset`
- `BreadcrumbList`

### Metadata requirements
Every page needs:
- title tag,
- meta description,
- canonical URL,
- Open Graph title,
- Open Graph description,
- Open Graph image.

---

## Analytics requirements
Track at least these events:
- homepage demo CTA click,
- homepage academy CTA click,
- demo page GitHub click,
- demo page Try Traigent click,
- lesson start,
- lesson completion,
- article CTA click,
- specifications page outbound click to TVL,
- portal sign-up CTA click.

Create a simple funnel view:
- homepage -> demos / academy / resources -> Try Traigent / GitHub / contact / register.

---

## Success criteria

### Content success criteria
- the homepage remains product-first,
- the course is easy to find,
- the demos are evidence-led,
- the site clearly teaches the production-agent category,
- TVL is mentioned without being duplicated.

### Demo success criteria
- each demo has a public repo artifact,
- each demo includes scripts, specs, datasets, and results,
- each demo page explains the methodology,
- each demo can be inspected without running code,
- at least a sample run is reproducible.

### UX success criteria
- a visitor can understand the offer in under 30 seconds,
- a visitor can find the course in one click from the homepage,
- a visitor can find the GitHub repo in one click from a demo page,
- a technical reader can inspect a credible methodology trail.

### Technical success criteria
- internal links work,
- all CTAs work,
- pages are indexable,
- pages are fast and accessible,
- repo instructions are tested,
- assets load correctly.

### Positioning success criteria
- Traigent is clearly the production optimization and governance platform,
- TVL is clearly a broader, separate formal-specification initiative,
- the relationship is complementary and understandable.

---

## Definition of done checklist
Do not call this finished until all of the following are true:

- homepage updated,
- `/demos` live,
- 3 demo pages live,
- demo GitHub repo public,
- `/academy` live,
- course landing page live,
- 6 lesson pages live,
- `/resources` live,
- 3 launch articles live,
- `/specifications` or `/formal-specs` live,
- all pages interlinked,
- TVL links added,
- metadata added,
- analytics events instrumented,
- screenshots / diagrams included,
- repo run instructions verified,
- no unverifiable claims remain.

---

## Recommended execution order

### Phase 1
Information architecture, homepage updates, academy and demos landing pages.

### Phase 2
Create demo repo structure, produce first demo, then second and third demos.

### Phase 3
Publish course landing page and six lessons.

### Phase 4
Publish the three launch articles and the specifications bridge page.

### Phase 5
Add analytics, polish visuals, tighten internal links, and refine CTAs.

---

## Final instruction to the building agent
Build a site that teaches the market how to think about agents in production and makes Traigent the obvious product for teams that take that challenge seriously.

Do not over-explain TVL on Traigent.
Do not replace evidence with slogans.
Do not ship pages without reproducible assets.

Make the educational surface strong enough to earn trust, and the product surface clear enough to convert.
