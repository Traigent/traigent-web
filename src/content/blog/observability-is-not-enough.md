---
title: "Observability Is Necessary But Not Sufficient"
slug: "observability-is-not-enough"
date: "2026-05-16"
summary: "Observability tools tell you what happened on each agent call. That's the prerequisite for optimization, not the substitute. If your stack ends at 'we have traces,' you're paying for instrumentation while making configuration decisions on gut feel."
author: "Amir Barzelay"
readingTime: "5 min read"
tags: "optimization,observability,tracing"
---

*A common position from technically-mature teams:*

> "We use Langfuse / Helicone / Arize. We have full traces, costs, latency per call. We have everything we need."

You have the **prerequisite**. You don't have the **answer**.

Observability tools tell you, in granular detail, **what happened**. They don't tell you **what to do next**. That gap is where agent ROI gets stuck — and it's the gap most teams don't see because their dashboards look so impressive.

This post is for engineering leads who've already invested in observability and assume the optimization story is therefore "handled."

## What observability actually solves

Observability platforms give you, for every agent run:

- The full span tree (which function called which, in what order)
- Per-call request and response payloads
- Latency at each step
- Token counts and cost per LLM call
- Error rates and failure modes
- Custom traces for retrieval, tool calls, and intermediate steps

This is genuinely valuable. With it, you can:

- **Debug.** When agent X failed on customer Y's question, you can replay the trace and find the broken step.
- **Monitor.** Dashboards show production health in real time.
- **Audit.** Compliance reviews have the data they need.

These are real outcomes. **But none of them are optimization.**

## What observability does *not* solve

Observability tells you that yesterday's agent run cost $0.0006 with 740ms latency on configuration C₁. It does not tell you:

- That configuration C₂ would have cost $0.0002 with similar accuracy
- That configuration C₃ would have hit your latency budget at the same accuracy
- Which dimension of C₁ is the dominant driver of cost
- Which dimension is the dominant driver of accuracy on the *next* question type your users are about to ask
- Whether to try C₂ or C₃ first

In other words: observability is the rearview mirror. It's a perfect record of where you've been. It doesn't drive the car.

## The "we'll just look at the data" gap

The standard defense: *"With this much trace data, my senior engineers will spot the patterns and tune accordingly."*

They won't. Three reasons:

**1. The configuration space has too many dimensions.** A modern agent has 10–15+ tunable variables (model, temperature, top-p, max tokens, prompt template, few-shot count, retrieval top-k, chunk size, reranker, self-consistency samples…). A human can hold 3–5 in working memory and reason about them. The other 7–10 dimensions get *fixed at defaults* and ignored. Your trace data covers all of them; your decision-making process only uses a handful.

**2. Production traces are run-time data, not search-time data.** Traces tell you what your *current* configuration did. They don't tell you what an *unexplored* configuration would do. To know that, you have to actually run the unexplored configuration — which means you need a search loop, not a dashboard.

**3. Trace volume swamps signal.** With 10,000 production runs/day, no human can manually inspect enough of them to identify configuration-space patterns. You'd need to aggregate, score, compare, and iterate — which is just describing an optimization platform with extra steps.

## The integration problem

Some teams accept this gap and try to build optimization on top of their observability stack. *"We have the trace data; we'll just write the optimizer that decides what to try next."*

The naive version takes a weekend. The production version takes 6 months and never quite ships.

The reason: an optimizer needs more than trace data. It needs:

- A clean way to **inject** a new configuration into the agent for each experiment
- A consistent **benchmark** to score each configuration against (separate from production traffic, which has self-selection bias)
- A **scoring function** that aggregates multi-objective KPIs into a comparable signal
- A **search strategy** that's sample-efficient (running 720 configs against a 500-question benchmark is days of compute — you can't afford grid search)
- **State management** across runs so the optimizer learns rather than restarting cold every time

Your observability stack provides exactly one of those (trace data, which becomes scoring data). The other four are net-new infrastructure.

This is why teams who try the "we'll just bolt optimization on top of Langfuse" path end up with a half-built internal product, not an optimized agent.

## What Traigent does that observability alone doesn't

Traigent ships observability **and** optimization in one platform — because the optimization engine *consumes* trace data, the two capabilities are designed to work together rather than be assembled.

The split of work:

| | Observability platform alone | Traigent |
|---|---|---|
| Records traces, costs, latency | ✅ | ✅ |
| Surfaces them in dashboards | ✅ | ✅ |
| Decides which configuration to try next | ❌ | ✅ |
| Runs that configuration against your benchmark | ❌ | ✅ |
| Aggregates results across runs to converge to an optimum | ❌ | ✅ |
| Refines your benchmark over time | ❌ | ✅ |

If your team is already invested in an observability tool, you don't have to throw it away. You can keep using it for production monitoring while Traigent handles the optimization loop. They occupy different stages of the lifecycle.

But if your reasoning is *"we have observability, so we don't need Traigent,"* you're conflating the prerequisite with the answer.

## The cost of stopping at observability

For a modest agent doing 1M calls/month, the gap between *current configuration* and *optimal configuration* is typically **30–60% in cost** at comparable accuracy, or several accuracy points at comparable cost. On a $20k/month bill, that's $6,000–$12,000/month — every month, indefinitely — flowing to a frontier-model provider when a cheaper configuration would have served the same workload.

Observability tells you exactly how that money is being spent. It doesn't recover any of it. Recovery requires the optimization loop.

## The takeaway

Observability is the rearview mirror. Beautiful, detailed, indispensable. But you can't drive a car with only a rearview mirror.

If you've invested in observability, **you've done the hard part of the data plumbing.** The next investment — actually deciding what to try next — is where the ROI lives.

---

*See it on your own agent in under a minute: `uv tool install "traigent[recommended]" && traigent quickstart` — or [book a 15-minute walkthrough](https://meetings-eu1.hubspot.com/amir8).*
