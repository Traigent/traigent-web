---
title: "Agent Knobs 101"
subtitle: "The hidden settings that decide your agent's accuracy — and your bill."
slug: "agent-knobs-101"
date: "2026-06-04"
summary: "Most agents in production hardcode about 25 settings their authors barely thought about. This post shows you three of them, what they do, and how much they move accuracy and cost. If you build agents and the word 'knob' sounds like a stretch, start here."
author: "Amir Barnea"
readingTime: "3 min read"
tags: "primer,configuration,knobs,beginners"
featured: true
order: 0
---

**TL;DR.** Every agent has a few dozen settings — what we call *knobs* — that change how it answers and what it costs. Most teams hardcode them and never look again. The right combination can swing accuracy 10–30 points and cost 10× or more on the same workload. Below: three concrete knobs, what they actually look like, and what they actually do.

**See it in action:** [▶ Agent Optimization Demo · 1-min](/#/story) · [Explore the configuration space →](/#/knob-explorer)

---

## What's a knob?

A *knob* is any choice in your agent that you could plausibly turn one way or the other and get a different answer. Some live in your code, some in your prompt, some in the model's request body. They feel like implementation detail. They're not — most of them swing your numbers.

Two examples will make this concrete.

---

## Knob 1: Few-shot examples (k)

You're writing a system prompt. Do you stuff in 0 example Q&As? 1? 5? 10? That number is a knob — usually called `k`.

```
k = 0 (zero-shot)
─────────────────
"Answer the user's question using only the
provided context. Be concise."

USER: <their question>
```

```
k = 5 (few-shot)
────────────────
"Answer the user's question using only the
provided context. Be concise. Examples:

Q: What's our refund window for SaaS?
A: 30 days from invoice date.

Q: ... (four more examples)

USER: <their question>
```

**Effect on accuracy:** 0 → 5 typically buys you 3–8 percentage points on a real task. Diminishing returns after that.

**Effect on cost:** every example you add inflates the input token count of *every* call. Five thoughtful examples at ~200 tokens each = 1,000 extra input tokens per request. Across 10,000 requests a day, that's a measurable line item.

**What most teams do:** pick `k = 3` because some tutorial said so, ship it, never check whether `k = 1` would have been just as accurate at a third of the cost.

---

## Knob 2: Chain-of-thought (CoT)

You can ask the model to "think step by step" before answering, or not.

```
CoT = off                          CoT = brief                  CoT = extended
─────────                          ────────────                 ──────────────
"Give the answer."                 "Briefly note your           "Walk through your
                                    reasoning, then              reasoning step by step,
                                    answer."                     then answer."
```

**Effect on accuracy:** off → brief is usually +2 to +4 points on reasoning-heavy workloads. brief → extended is another +2 to +6 on multi-hop tasks, often nothing on lookup tasks.

**Effect on cost:** extended CoT roughly doubles output tokens. Output tokens cost 3–5× input tokens at most providers. That's a real bump.

**What most teams do:** copy "Let's think step by step" from a 2022 paper into every agent, regardless of whether the workload actually benefits.

---

## Knob 3: Self-consistency (SC)

For tough questions, you can run the same prompt 3 or 5 times and take the majority answer.

| Votes | Typical accuracy on hard reasoning | Typical cost |
|---|---|---|
| 1 (default) | baseline | 1× |
| 3 | +2 to +5 pts | ~3× |
| 5 | +3 to +7 pts | ~5× |

It linearly costs more (you really do call the LLM N times), but on certain workloads — math, code, structured extraction — it's the cheapest accuracy bump available.

**What most teams do:** leave SC = 1, because the API client doesn't expose it as a setting. You have to implement it in your agent code.

---

## Why "lots of knobs" is a hard problem

You have far more than three. Real agents have around 25: tool selection, retrieval `top_k`, embedding model, reranker, memory window, output schema enforcement, retry budget, temperature, top-p, max_tokens, system-prompt template, response_format, parallel_tool_calls — and so on, two tiers worth.

Each knob has 2 to 5 reasonable settings. Multiplied out, the configuration space for a single agent on a single workload is in the **millions**. Most teams pick one point in that space by gut and ship.

That's the thing Traigent is built to solve — sweep the space efficiently, find the configurations that win on accuracy at the lowest cost. The math, the full knob catalog, and how the sweep works are in the longer companion post:

→ [**The Magnitude of the AI Agent Optimization Problem**](/blog/the-config-multiverse) — the deep dive · 13 min

---

## What to do next

- [▶ Watch the 1-minute story](/#/story) — sees the search space getting built and the optimizer finding the good points
- [Open the Knob Explorer](/#/knob-explorer) — click around the catalog, watch the combinatorics counter blow up
- [Book a demo](https://meetings-eu1.hubspot.com/amir8) — run Traigent on your agent and see your own numbers
