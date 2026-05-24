---
title: "The Configuration Multiverse: A Directory of Every Knob in Every Major Model — and Why Skeptics Are Still Wrong"
slug: "the-config-multiverse"
date: "2026-05-24"
summary: "Every chat or reasoning model exposes a dozen knobs, your agent layer adds half a dozen more, and each knob has a handful of reasonable values. The product is millions of valid configurations — and the 'temperature doesn't matter' skeptic isn't wrong about temperature alone. They're wrong about the math."
author: "Amir Barnea"
readingTime: "12 min read"
tags: "optimization,configuration,models,benchmarks,reasoning"
order: 7
---

**See it on your numbers:** [ROI Calculator →](/roi) · [TTM Calculator →](/ttm)

---

> *"Temperature doesn't matter much."*
>
> *"top_p? Same thing as temperature. Skip it."*
>
> *"I just pick `gpt-4o` at temperature 0 and ship. Done."*

You've heard a version of this in every Slack channel that ships AI agents. It's not a stupid take. Any *one* of the knobs the major providers expose, taken in isolation, on a typical benchmark, will usually move a single metric by a handful of percentage points at most. Sometimes less.

The trap is the word "isolation." You don't ship one knob. You ship *all* of them, at once, against a real workload, and the values you didn't think about get picked by your SDK's defaults — which were chosen by someone who has no idea what your agent does.

This post is two things at once. The first half is a directory: every model knob the major providers expose, the valid range or value set, and a qualitative tag for how much it can move accuracy (**A**), cost (**C**), and latency (**L**). The second half is the math that makes the skeptic's argument collapse — even when each individual claim about each individual knob is correct.

## How to read the tables

For each knob you'll see three impact tags:

- **L (Low)** — typical effect of changing this one knob, holding everything else fixed, is under ~3 percentage points on the relevant metric for most workloads.
- **M (Medium)** — typical effect is 3–15 percentage points. Big enough that you'd notice if you A/B-tested it. Small enough that nobody fights about it.
- **H (High)** — typical effect can exceed 15 percentage points, sometimes substantially. Order-of-magnitude swings on certain workloads.

A few rules of thumb before you read the tables:

1. **No global percentages.** Anyone who tells you "temperature shifts accuracy by 4.2%" without naming a benchmark and a workload is selling you something. Temperature can move accuracy 0% on a deterministic classification task and 25% on a creative-writing eval. The L/M/H tags below are *typical ranges across the kinds of agent workloads we see in production* — not promises for your specific use case.
2. **The skeptic is right about each knob, individually.** Most knobs are L or M in isolation. The point of this directory is what happens when you multiply.
3. **A, C, and L impact are independent.** A knob can be L for accuracy but H for cost (e.g., `max_tokens`), and that asymmetry is itself a configuration decision worth optimizing.
4. **Newer model families introduce new knob classes.** Reasoning models added a whole tier (`reasoning_effort`, `thinking_budget`) that didn't exist three years ago. The dimension count keeps climbing — your config grid doesn't shrink with time, it grows.

Let's start with the universal tier and work outward.

---

## Tier 1: Knobs nearly every chat model exposes

If you've used any chat completion API in the last five years, you've seen most of these. Defaults vary wildly between SDKs.

| Knob | Range / values | A | C | L | Why it matters |
|---|---|---|---|---|---|
| `temperature` | 0 to 2 (most sane in 0–1) | M | none | none | Controls sampling determinism. Bigger effect on free-form generation than on classification. Reasoning models tolerate it less. |
| `top_p` (nucleus sampling) | 0 to 1 | L–M | none | none | Often substitutes for temperature; varying both at once is usually redundant. |
| `top_k` | 1 to vocab size | L | none | none | Hard cap on candidate tokens. Most providers default it sensibly; rarely worth tuning. |
| `max_tokens` / `max_output_tokens` | 1 to model max | L (truncation only) | **H** | **H** | The single biggest cost knob. Halving the cap can halve the bill — and sometimes the answer along with it. |
| `stop` / `stop_sequences` | array of strings | L–M | L | L | Can dramatically change streaming behavior and parsing reliability. Often the difference between "JSON parses" and "doesn't." |
| `seed` (where supported) | integer | 0 *on average* | none | none | Determinism, not quality. Critical for reproducible evals — irrelevant for users. |
| `n` / `candidate_count` | integer ≥ 1 | M | **H** | **H** | Best-of-n sampling. Real accuracy gains, brutal cost multiplier. |

Already, before any provider-specific knobs, you have 7 dimensions × maybe 5 reasonable values each = **~78,000 configurations**. And we've barely started.

---

## OpenAI

OpenAI now ships two distinct families, with different knob surfaces. Worth treating them separately.

### Chat / completion models (GPT-4o, GPT-4o-mini, GPT-4-turbo, GPT-3.5-turbo)

| Knob | Range / values | A | C | L | Why it matters |
|---|---|---|---|---|---|
| `presence_penalty` | -2 to 2 | L | none | none | Pushes the model toward (or away from) novel tokens. Subtle effect on most chat tasks. |
| `frequency_penalty` | -2 to 2 | L | none | none | Suppresses repetition. Bigger effect on long outputs. |
| `response_format` | `{type: "text" \| "json_object" \| "json_schema"}` | **M–H** (on JSON tasks) | L | L | Schema-enforced JSON dramatically reduces parsing-failure cost on extraction agents. |
| `tool_choice` | `"auto"`, `"none"`, `"required"`, `{specific}` | **H** | M | M | Forcing a specific tool changes the agent's behavior class — not just a tweak. |
| `parallel_tool_calls` | bool | M | M | **M–H** (sequential blocks) | Off forces serial reasoning; can double latency on multi-tool plans. |
| `logprobs` / `top_logprobs` | bool, integer | none | L | L (overhead) | Critical for self-consistency / confidence routing; otherwise noise. |
| `service_tier` (where available) | `"auto"` / `"default"` / `"flex"` | L (if any) | M | M | Trades cost for predictable latency. |

### Reasoning models (o1, o3, o3-mini, o3-pro, o4-mini, GPT-5, GPT-5-mini, GPT-5-nano)

A new tier of knobs that don't exist on chat models. These often *dominate* everything else.

| Knob | Range / values | A | C | L | Why it matters |
|---|---|---|---|---|---|
| `reasoning_effort` | `"minimal"`, `"low"`, `"medium"`, `"high"` | **H** | **H** | **H** | The biggest knob in the OpenAI catalog right now. `high` can double an o-series model's accuracy on hard tasks — and 10× its bill. |
| `verbosity` (GPT-5 family) | `"low"`, `"medium"`, `"high"` | M | M | M | Affects how much the model says, independent of how much it thinks. |
| `max_completion_tokens` (replaces `max_tokens`) | 1 to model max | L | **H** | **H** | Reasoning tokens count against this budget. Underestimating clips the answer. |
| `reasoning.summary` (where available) | `"auto"`, `"detailed"`, `null` | L | L | M | Whether to expose a reasoning summary. Affects payload size and parsing. |
| `store` | bool | none | L (long term) | none | Whether responses persist for evals. No runtime impact, but matters for your eval pipeline. |

OpenAI alone: **~12 reasonable knobs × ~4–5 values each** ≈ 4M+ combinations before agent-level configuration.

---

## Anthropic (Claude 3.5 / 3.7 / 4 / 4.5 — Haiku, Sonnet, Opus)

| Knob | Range / values | A | C | L | Why it matters |
|---|---|---|---|---|---|
| `temperature` | 0 to 1 | M | none | none | Same role as OpenAI's. Reasoning Claude tolerates it less. |
| `top_p` | 0 to 1 | L–M | none | none | |
| `top_k` | integer ≥ 1 | L | none | none | |
| `max_tokens` | 1 to model max | L | **H** | **H** | Required parameter on Claude — there is no "model default." |
| `system` | string | **H** | M | M | The system prompt is far more load-bearing on Claude than on most providers; longer, more structured systems consistently outperform terse ones on agent tasks. |
| `stop_sequences` | array | L–M | L | L | |
| `tools` | array of definitions | **H** | M | M | Tool count + descriptions strongly bias which path the model takes. |
| `tool_choice` | `"auto"`, `"any"`, `"tool"`, `"none"` | **H** | M | M | |
| `disable_parallel_tool_use` | bool | M | M | **M–H** | Same shape as OpenAI's `parallel_tool_calls=false`. |
| `thinking` (extended thinking — 3.7, 4, 4.5) | `{type: "enabled", budget_tokens: 1024+}` | **H** | **H** | **H** | Same family as OpenAI's reasoning_effort. Budget can range from 1K to many tens of thousands of tokens. |
| `metadata.user_id` | string | none | none | none | Compliance/abuse routing. Not a quality knob. |

Anthropic adds the system-prompt knob category, which is interesting: on Claude, the *structure* of the system prompt (XML tags, ordered sections, explicit role definition) reliably swings accuracy more than temperature does. There is no single value to put in a table — but if you treat "system prompt template" as a knob with, say, 5 candidate variants, you've added another 5× to your search space.

---

## Google (Gemini 1.5 / 2.0 / 2.5 — Pro / Flash / Flash-Lite)

| Knob | Range / values | A | C | L | Why it matters |
|---|---|---|---|---|---|
| `temperature` | 0 to 2 | M | none | none | |
| `top_p` | 0 to 1 | L–M | none | none | |
| `top_k` | integer | L | none | none | |
| `max_output_tokens` | 1 to model max | L | **H** | **H** | |
| `candidate_count` | integer ≥ 1 | M | **H** | **H** | Best-of-n. |
| `response_mime_type` | `"text/plain"`, `"application/json"` | **M–H** (JSON tasks) | L | L | |
| `response_schema` | OpenAPI-flavor JSON schema | M | L | L | Structured output enforcement. Massively reduces parsing failure on extraction tasks. |
| `thinking_config` / `thinking_budget` (2.5) | integer tokens (0 disables) | **H** | **H** | **H** | Same family as reasoning_effort / thinking on the other providers. |
| `safety_settings` | array of {category, threshold} | L (rejection rate) | none | none | Affects how often the model refuses, not how well it answers. |
| `cached_content` | string handle | M (consistency) | **H** (savings) | M | Context caching can dramatically cut cost for long-context agents. A real knob, not just an optimization. |

Gemini's `cached_content` deserves its own callout. If your agent ships a long, mostly-static system prompt and/or tool catalog, *not* caching is leaving real money on the table — sometimes 50%+ savings on inference, with measurable latency improvement on cache hits.

---

## Open-source models served via vLLM / TGI / llama.cpp / Ollama (Llama / Mistral / Qwen / DeepSeek / Yi)

You inherit all the Tier 1 knobs, plus a set the closed providers don't expose:

| Knob | Range / values | A | C | L | Why it matters |
|---|---|---|---|---|---|
| `min_p` | 0 to 1 | L–M | none | none | Newer sampling method; some teams prefer over top_p/top_k. |
| `repetition_penalty` | ~0.5 to 2 | L–M | none | none | Independent of presence/frequency penalty. |
| `typical_p` | 0 to 1 | L | none | none | Locally typical sampling. Rarely worth tuning. |
| `mirostat_mode` / `mirostat_eta` / `mirostat_tau` | mode 0/1/2, floats | M | none | none | Adaptive sampling. llama.cpp / text-generation-webui only. |
| `repeat_last_n` | integer | L | none | none | How far back the repetition penalty looks. |
| `enable_thinking` (Qwen 3, DeepSeek R1, others) | bool | **H** | **H** | **H** | Newer open models have a reasoning toggle similar to OpenAI/Anthropic. |
| Quantization (server-side) | fp16, fp8, int8, int4, awq, gptq, etc. | L–M | **H** (compute) | M | Not a runtime knob, but a deploy-time configuration that dominates cost. |
| Speculative decoding draft model | model name | none | L | **M–H** | Speed without accuracy loss, *if* the draft model agrees often enough. |
| `n_ctx` allocation | tokens | L (if you have enough) | M (VRAM) | M | Bigger context allocation costs memory and can slow attention. |
| Sampler order | list (e.g. `["top_k", "tfs", "typical_p", "top_p", "min_p", "temp"]`) | L–M | none | none | llama.cpp-style fine control. |
| `prompt_format` template | provider-specific | **H** | none | none | Using the wrong chat template (Llama instruct vs Mistral instruct vs ChatML) is a silent accuracy killer. |

The open-source surface area is *much* larger than the closed providers — because nothing is hidden behind a SaaS facade. That's a strength and a liability.

---

## Agent-level knobs (these often dwarf the model-level ones)

Everything above is what the model exposes. But the agent layer you build on top of it adds its own dimensions, and in our experience these are often where *most* of the accuracy and cost variance hides.

| Knob | Range / values | A | C | L | Why it matters |
|---|---|---|---|---|---|
| System prompt template | variants | **H** | M (token count) | M | The single most under-optimized dimension in production agents. Same model, different system prompt, 20+ point swings on the same eval. |
| Few-shot example count | 0 to N | **H** | **M–H** (token cost) | **M–H** | More examples raise accuracy until they overflow attention. The optimum is workload-specific. |
| Few-shot selection method | random / semantic-similar / hard-coded / diverse | **H** | none | none | Free upgrade for retrieval-augmented few-shotting. |
| Few-shot ordering | first, last, random | M | none | none | "Lost in the middle" is real: position matters. |
| RAG `top_k` (retrieved chunks) | 1 to ~100 | **H** | **M–H** | M | More chunks → more context → more accuracy, until precision collapses. |
| RAG chunk size | 100 to 2000 tokens | **H** | M | M | The biggest knob in your retrieval pipeline. |
| RAG chunk overlap | 0 to chunk size | M | M | L | Mitigates boundary loss. |
| Embedding model | various | **H** (retrieval) | L | L | Different embeddings = different retrieval results = different downstream accuracy. |
| Reranker | none / cross-encoder / LLM-as-ranker | M–H | M | M | Cheap accuracy bump, especially when `top_k` is generous. |
| Memory window | turns or tokens | **H** | M–H | M | Trade context cost for conversational accuracy. |
| Retry policy | none / fixed / exponential / on-schema-failure | M | L–M | M | Big effect on robustness, sneaks into your cost surface. |
| Fallback model | other model | **H** (failure mode) | M | M | What you fall back to when the primary refuses, errors, or times out. |
| Confidence threshold | 0 to 1 | M–H | M | M | When to ask a human, when to retry, when to fall back. |
| Caching layer (semantic / exact) | TTL settings | M (consistency) | **H** (savings) | **H** | Same-cache-key hits are essentially free. |
| Tool selection strategy | greedy / heuristic / learned | M–H | M | M | How the agent decides *which* tool to consider when many are exposed. |

It's not unusual for a real agent to expose 10–15 of these dimensions, on top of the 10–15 model-level knobs. The product of two double-digit dimension counts is a five-or-six-digit dimension count. We haven't even multiplied yet.

---

## The cardinality, with the math actually written out

Take a *modest* production agent: GPT-4o with chat-completion knobs only (no reasoning model, no fancy tool routing), plus a basic RAG pipeline.

**Model side (7 knobs × ~5 reasonable values each):**

- `temperature` ∈ {0, 0.2, 0.4, 0.7, 1.0}
- `top_p` ∈ {0.5, 0.8, 0.95, 1.0, "off"}
- `max_tokens` ∈ {256, 512, 1024, 2048, 4096}
- `presence_penalty` ∈ {-0.5, 0, 0.5, 1, 1.5}
- `response_format` ∈ {text, json_object, json_schema}
- `parallel_tool_calls` ∈ {true, false}
- `tool_choice` ∈ {auto, required}

5 × 5 × 5 × 5 × 3 × 2 × 2 = **15,000** combinations.

**Agent side (5 knobs × ~4 values each):**

- System prompt template ∈ {v1, v2, v3, v4}
- Few-shot count ∈ {0, 2, 4, 8}
- RAG `top_k` ∈ {3, 5, 10, 20}
- Embedding model ∈ {ada-3-small, ada-3-large, voyage-3, cohere-v3}
- Reranker ∈ {none, cross-encoder, LLM}

4 × 4 × 4 × 4 × 3 = **768** combinations.

**Total combined configuration space: ~11.5 million configurations.**

This is the conservative version. Drop in a reasoning model with `reasoning_effort` (×4) and a confidence threshold (×4) and you're at ~180 million. None of this counts seeds, retries, fallback policies, or any kind of caching. None of this counts running the search against multiple evaluation datasets.

A single LLM eval pass on a serious benchmark takes seconds to minutes. Eleven million seconds is four months. *Per model.* Per benchmark.

You can't grid-search this. You can't even random-search it meaningfully — sparse random sampling in a 14-dimensional space hits sub-1% coverage almost immediately. The only sane response is empirical optimization that converges — picks the next configuration based on what previous configurations revealed, instead of sampling blindly.

That's the actual rebuttal to the skeptic. Not "temperature matters more than you think." It's "you don't have time to *check* whether temperature matters more than you think."

---

## The skeptic, addressed directly

The skeptic's argument, in its strongest form:

> "Each individual knob, on a typical workload, shifts accuracy by a few percentage points at most. Engineering time spent tuning is engineering time not spent shipping. Pick reasonable defaults and move on."

The first sentence is mostly true. The second is the load-bearing one — and the math doesn't support it.

A few percent here, a few percent there, compound. Stack a handful of independent 5–10% knobs across model + agent layers and the compounded difference between a *bad* configuration and an *optimized* configuration is routinely 2–5× on cost and 10–30 percentage points on accuracy. That's not an exotic claim — it's the gap between the production agent that survives a review and the one that gets quietly killed three months in.

There's also a second-order effect that the skeptic underestimates: **the knobs aren't independent.** Raising `reasoning_effort` changes which `temperature` is optimal. Increasing RAG `top_k` changes which `top_p` is optimal. These interactions are exactly what makes the configuration space too big to navigate by intuition — and exactly what an optimizer with memory of prior runs can exploit.

The skeptic's mistake isn't believing temperature is minor. It's believing the *consequences* are minor. They aren't.

---

## What to do about it

Three options, in increasing order of seriousness:

1. **Acknowledge the space.** Stop shipping "we set temperature to 0 and called it a day." Treat configuration as a real engineering surface and write it down — which knobs, which values, which trade-offs. The directory above is a starting template.
2. **Sweep a small subset by hand.** Pick the 3–4 highest-leverage knobs for your specific workload (almost always: model selection, system prompt, few-shot count, RAG top_k). Run a manual A/B/C/D. Document what you found and why.
3. **Use an optimizer.** Outsource the search to a system that picks the next configuration intelligently, converges on the cost-performance frontier, and re-optimizes when the world changes. That's exactly what Traigent does — and it's why we exist.

There is no fourth option where you pick a config by gut and the math works out.

---

**See what your math looks like:** [ROI Calculator →](/roi) · [TTM Calculator →](/ttm)

**Or read more on the same theme:** [The Model Myth →](/blog/the-model-myth) · [The Eval Trap →](/blog/the-eval-trap) · [The Business Case →](/blog/the-business-case)
