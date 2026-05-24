---
title: "The Magnitude of the AI Agent Optimization Problem"
slug: "the-config-multiverse"
date: "2026-05-24"
summary: "Every AI agent in production is the product of ~25 configuration decisions across two layers — agent-level decisions you designed yourself, and model-level knobs your provider exposes. Each has a handful of reasonable values. Multiplied out, the space is in the millions per model per workload. This post explains the math, then catalogs every knob in seven sorted tables."
author: "Amir Barnea"
readingTime: "13 min read"
tags: "optimization,configuration,models,benchmarks,reasoning"
order: 7
---

*The Configuration Multiverse explained in detail.*

**See it on your numbers:** [ROI Calculator →](/roi) · [TTM Calculator →](/ttm)

---

## The problem in one paragraph

Every AI agent in production is the product of roughly twenty-five configuration decisions — about fifteen at the agent layer you designed yourself, about ten at the model layer your provider exposes. Each decision has a small handful of reasonable values. Multiplied out, this gives a configuration space in the millions, per model, per workload. Most teams pick one point in that space by gut and ship; many of them ship the wrong one and never find out.

The rest of this post does three things. **First**, it shows the math of *why* the configuration space is that big — the two-tier structure, the multiplication, the way small effects compound. **Second**, it provides a directory — seven tables, sorted by impact — covering the agent-layer knobs you build on top plus every model-layer knob the major providers expose. **Third**, it explains what to do about all this without spending a quarter on grid search.

---

## The configuration space, in two tiers

The first thing to understand is that there are two distinct layers of configuration, and they're not equal.

**Agent-level knobs** are decisions you make when you build the agent: system prompt structure, few-shot examples, retrieval top_k, embedding model, reranker, memory window, retry policy, tool selection, caching. They live in your code, not in the model's API. They are mostly invisible to the model provider's docs.

**Model-level knobs** are decisions the provider exposes: temperature, top_p, max_tokens, response_format, tool_choice, reasoning_effort, thinking_budget. They live in the request body. The provider's docs enumerate them; their defaults are picked for the median customer, who is not you.

**Agent-level knobs dominate model-level knobs in impact, by a wide margin.** Changing the system prompt structure, the few-shot count, or retrieval top_k reliably swings accuracy 10–30 percentage points on the same eval. Changing temperature on the same agent rarely moves it more than 3–5. The model is the engine; the agent layer is the chassis, the transmission, the route, and the driver. The engine matters; everything else matters more, in aggregate.

Why the agent layer dominates:

1. **Agent-level knobs are workload-specific.** Your retrieval index, your tool catalog, your prompt template — these were built for *your* task. The provider's temperature default was built for everyone's task. Workload-specific decisions are where the leverage is.
2. **Agent-level knobs change the model's *input*.** Model-level knobs change how the model decodes a *given* input. Changing the input is almost always more powerful than re-decoding the same input differently.
3. **Agent-level knobs interact with the model's strengths and weaknesses.** A good system prompt on a mediocre model often beats a mediocre system prompt on a flagship model — and costs a third as much.

### The math, with realistic numbers

Take a *modest* production agent: GPT-4o (chat-completion, no reasoning model), plus a basic RAG pipeline.

**Model side** — 7 reasonable knobs × ~5 reasonable values each:

- temperature ∈ {0, 0.2, 0.4, 0.7, 1.0}
- top_p ∈ {0.5, 0.8, 0.95, 1.0, "off"}
- max_tokens ∈ {256, 512, 1024, 2048, 4096}
- presence_penalty ∈ {-0.5, 0, 0.5, 1, 1.5}
- response_format ∈ {text, json_object, json_schema}
- parallel_tool_calls ∈ {true, false}
- tool_choice ∈ {auto, required}

5 × 5 × 5 × 5 × 3 × 2 × 2 = **15,000** combinations.

**Agent side** — 5 knobs × ~4 values each:

- System prompt template ∈ {v1, v2, v3, v4}
- Few-shot count ∈ {0, 2, 4, 8}
- RAG top_k ∈ {3, 5, 10, 20}
- Embedding model ∈ {ada-3-small, ada-3-large, voyage-3, cohere-v3}
- Reranker ∈ {none, cross-encoder, LLM}

4 × 4 × 4 × 4 × 3 = **768** combinations.

**Combined: ~11.5 million configurations.**

This is the *conservative* version — five agent knobs out of the fifteen catalogued in Table 1 below. Drop in a reasoning model with reasoning_effort (×4 more), use all fifteen agent-level knobs, and you're well into the billions. None of this counts running the search against multiple evaluation datasets, different seeds, retry policies, fallback models, or caching layers.

A single LLM eval pass on a serious benchmark takes seconds to minutes. Eleven million seconds is four months. *Per model. Per benchmark.*

You can't grid-search this. You can't even random-search it meaningfully — sparse random sampling in a 12-dimensional space hits sub-1% coverage almost immediately. **The only sane response is empirical optimization that converges** — picks the next configuration based on what previous configurations revealed, instead of sampling blindly.

### The compounding problem

A common objection at this point is that yes, the space is big, but each individual knob is small — so picking sensible defaults and moving on is fine. The math doesn't agree.

**The agent-level tier breaks the objection on its own.** The typical agent has roughly fifteen knobs above the model layer (Table 1), and most of them are individually in the H column for accuracy. The agent layer doesn't need compounding for its effect to be large; one knob — a better system prompt, a better few-shot strategy, a better retrieval top_k — often delivers an H-magnitude swing by itself.

**The model-level tier doesn't survive compounding either.** A few percent here, a few percent there, stacked across the model knobs in Tables 2–7, routinely compounds to 2–5× on cost and 10–30 percentage points on accuracy. That's the well-known gap between a bad model-tier config and an optimized one.

**And the knobs aren't independent.** Raising reasoning_effort changes which temperature is optimal. Increasing RAG top_k changes which top_p is optimal. Swapping the embedding model changes which system prompt variant works best. These interactions are exactly what makes the space too big to navigate by intuition — and exactly what an optimizer with memory of prior runs can exploit.

The mistake isn't believing individual knobs are minor. It's believing the consequences are minor.

The full directory of every knob, sorted by impact, follows in **Tables 1–7 below**. If you want the punchline before the reference material:

## What to do about it

Three options, in increasing order of seriousness:

1. **Acknowledge the space.** Stop shipping "we set temperature to 0 and called it a day." Treat configuration as a real engineering surface and write it down — which knobs, which values, which trade-offs. Tables 1–7 below are a starting template.
2. **Sweep a small subset by hand.** Pick the 3–4 highest-leverage agent-level knobs for your specific workload (almost always: system prompt, few-shot count, RAG top_k, model choice). Run a manual A/B/C/D. Document what you found and why. This will get you most of the way there for the cost of a sprint.
3. **Use an optimizer.** Outsource the search to a system that picks the next configuration intelligently, converges on the cost-performance frontier, and re-optimizes when the world changes. That's exactly what Traigent does — and it's why we exist.

There is no fourth option where you pick a config by gut and the math works out.

---

## The directory: seven tables, sorted by impact

For each knob below you'll see three impact tags:

- **L (Low)** — typical isolated effect under ~3 percentage points on the relevant metric for most workloads.
- **M (Medium)** — typical isolated effect 3–15 percentage points. Big enough to notice on an A/B test.
- **H (High)** — typical isolated effect can exceed 15 percentage points. Order-of-magnitude swings on specific workloads are routine.

A few caveats before you read them:

- **No global percentages.** Anyone who quotes "temperature shifts accuracy by 4.2%" without naming a benchmark and a workload is selling something. The L/M/H tags are typical ranges across the kinds of agent workloads we see — not promises for your specific use case.
- **A, C, and L are independent dimensions.** A knob can be L on accuracy and H on cost (e.g., max_tokens), and that asymmetry is itself a configuration decision.
- **Tables are sorted by impact within each tier.** Knobs at the top affect multiple dimensions (accuracy *and* cost, or accuracy *and* latency). Knobs at the bottom typically affect only one dimension — often accuracy alone, which makes them important when you have the budget to optimize but easy to deprioritize when you don't.

### Table 1 — Agent-level knobs

The dominant tier. Fifteen knobs covering system-prompt design, few-shot strategy, retrieval pipeline, memory, retries, tool routing, and caching. The last three rows (embedding model, few-shot selection, few-shot ordering) are listed last *not because they're unimportant* — they all swing accuracy heavily — but because their effect is concentrated on accuracy with no direct cost or latency impact, which makes them easy to overlook in a quarterly review focused on the bill.

| Knob | Range / values | A | C | L | Why it matters |
|---|---|---|---|---|---|
| Few-shot example count | 0 to N | **H** | **M–H** | **M–H** | More examples raise accuracy until they overflow attention. The optimum is workload-specific. Token cost compounds quickly. |
| Caching layer (semantic / exact) | TTL settings | M (consistency) | **H** (savings) | **H** | Same-cache-key hits are essentially free. The single biggest cost optimization on a high-traffic agent. |
| RAG top_k (retrieved chunks) | 1 to ~100 | **H** | **M–H** | M | More chunks → more context → more accuracy, until precision collapses and cost balloons. |
| Memory window | turns or tokens | **H** | **M–H** | M | Trade context cost for conversational accuracy. Critical for multi-turn agents. |
| System prompt template | variants | **H** | M (token count) | M | The single most under-optimized dimension in production agents. |
| RAG chunk size | 100 to 2000 tokens | **H** | M | M | The biggest knob inside your retrieval pipeline. |
| Fallback model | other model | **H** (failure mode) | M | M | What you fall back to when the primary refuses, errors, or times out. |
| Reranker | none / cross-encoder / LLM-as-ranker | M–H | M | M | Cheap accuracy bump, especially when top_k is generous. |
| Confidence threshold | 0 to 1 | M–H | M | M | When to ask a human, when to retry, when to fall back. |
| Tool selection strategy | greedy / heuristic / learned | M–H | M | M | How the agent decides *which* tool to consider when many are exposed. |
| Retry policy | none / fixed / exponential / on-schema-failure | M | L–M | M | Big effect on robustness; sneaks into your cost surface. |
| RAG chunk overlap | 0 to chunk size | M | M | L | Mitigates boundary loss between chunks. |
| Embedding model | various | **H** (retrieval) | L | L | Different embeddings → different retrieval results → different downstream accuracy. Pure-accuracy knob. |
| Few-shot selection method | random / semantic-similar / hard-coded / diverse | **H** | none | none | Free upgrade for retrieval-augmented few-shotting. Pure-accuracy knob. |
| Few-shot ordering | first, last, random | M | none | none | "Lost in the middle" is real: position matters. Pure-accuracy knob. |

### Table 2 — Universal tier (chat models, all providers)

The knobs nearly every chat model exposes. Defaults vary wildly between SDKs and you've probably never thought about most of them. The top entries — n / candidate_count (best-of-n) and max_tokens — are special: both are H on cost and latency. They're the model-level knobs most directly tied to your bill and your p99. Everything below the line is mostly an accuracy/determinism trade.

| Knob | Range / values | A | C | L | Why it matters |
|---|---|---|---|---|---|
| n / candidate_count | integer ≥ 1 | M | **H** | **H** | Best-of-n sampling. Real accuracy gains, brutal cost multiplier. |
| max_tokens / max_output_tokens | 1 to model max | L (truncation only) | **H** | **H** | The single biggest cost knob. Halving the cap can halve the bill — sometimes the answer along with it. |
| stop / stop_sequences | array of strings | L–M | L | L | Can dramatically change streaming behavior and parsing reliability. |
| temperature | 0 to 2 (most sane in 0–1) | M | none | none | Controls sampling determinism. Pure-accuracy knob in isolation. |
| top_p (nucleus sampling) | 0 to 1 | L–M | none | none | Often substitutes for temperature; varying both at once is usually redundant. |
| top_k | 1 to vocab size | L | none | none | Hard cap on candidate tokens. Most providers default it sensibly. |
| seed (where supported) | integer | 0 *on average* | none | none | Determinism, not quality. Critical for reproducible evals — irrelevant for users. |

### Table 3 — OpenAI chat models (GPT-4o, GPT-4o-mini, GPT-3.5-turbo)

For the OpenAI chat family, tool_choice and parallel_tool_calls are the action-shaping knobs that change the agent's behavior class, not just its decoding. Forcing tool_choice: required versus auto is the difference between a deterministic pipeline and an open-ended agent. Disabling parallel_tool_calls serializes a plan that would otherwise run concurrently — commonly a 2× latency hit on multi-tool agents.

| Knob | Range / values | A | C | L | Why it matters |
|---|---|---|---|---|---|
| tool_choice | `"auto"`, `"none"`, `"required"`, `{specific}` | **H** | M | M | Forcing a specific tool changes the agent's behavior class — not just a tweak. |
| parallel_tool_calls | bool | M | M | **M–H** (sequential blocks) | Off forces serial reasoning; can double latency on multi-tool plans. |
| service_tier (where available) | `"auto"` / `"default"` / `"flex"` | L (if any) | M | M | Trades cost for predictable latency. |
| response_format | `{type: "text" \| "json_object" \| "json_schema"}` | **M–H** (on JSON tasks) | L | L | Schema-enforced JSON dramatically reduces parsing-failure cost on extraction agents. |
| logprobs / top_logprobs | bool, integer | none | L | L (overhead) | Critical for self-consistency / confidence routing; otherwise noise. |
| presence_penalty | -2 to 2 | L | none | none | Pushes the model toward (or away from) novel tokens. Subtle on most chat tasks. Pure-accuracy. |
| frequency_penalty | -2 to 2 | L | none | none | Suppresses repetition. Bigger effect on long outputs. Pure-accuracy. |

### Table 4 — OpenAI reasoning models (o1, o3, o3-mini, o4-mini, GPT-5, GPT-5-mini, GPT-5-nano)

The reasoning family adds a knob — reasoning_effort — that typically swamps every other model-level knob in this whole directory. Moving from `"low"` to `"high"` on a hard math or code benchmark can double accuracy and 10× the bill. There is no other model-level decision in this post with that kind of leverage.

| Knob | Range / values | A | C | L | Why it matters |
|---|---|---|---|---|---|
| reasoning_effort | `"minimal"`, `"low"`, `"medium"`, `"high"` | **H** | **H** | **H** | The biggest knob in the OpenAI catalog. `high` can double accuracy on hard tasks — and 10× the bill. |
| max_completion_tokens (replaces max_tokens) | 1 to model max | L | **H** | **H** | Reasoning tokens count against this budget. Underestimating clips the answer. |
| verbosity (GPT-5 family) | `"low"`, `"medium"`, `"high"` | M | M | M | Affects how much the model says, independent of how much it thinks. |
| reasoning.summary | `"auto"`, `"detailed"`, `null` | L | L | M | Whether to expose a reasoning summary. Affects payload size and parsing. |
| store | bool | none | L (long term) | none | Whether responses persist for evals. Indirect knob. |

### Table 5 — Anthropic (Claude 3.5 / 3.7 / 4 / 4.5 — Haiku / Sonnet / Opus)

Claude is unique in two ways. First, the `system` field is far more load-bearing than on most providers — its structure and length consistently swing accuracy more than temperature does. Second, the extended-thinking knob on 3.7+ and Sonnet 4.5 has the same kind of dominance as OpenAI's reasoning_effort.

| Knob | Range / values | A | C | L | Why it matters |
|---|---|---|---|---|---|
| thinking (extended thinking — 3.7, 4, 4.5) | `{type: "enabled", budget_tokens: 1024+}` | **H** | **H** | **H** | Budget can range from 1K to many tens of thousands of tokens. Same family as OpenAI's reasoning_effort. |
| system | string | **H** | M | M | The system prompt is far more load-bearing on Claude than on most providers. |
| tools | array of definitions | **H** | M | M | Tool count + descriptions strongly bias which path the model takes. |
| tool_choice | `"auto"`, `"any"`, `"tool"`, `"none"` | **H** | M | M | |
| max_tokens | 1 to model max | L | **H** | **H** | Required parameter on Claude — there is no "model default." |
| disable_parallel_tool_use | bool | M | M | **M–H** | Same shape as OpenAI's parallel_tool_calls=false. |
| stop_sequences | array | L–M | L | L | |
| temperature | 0 to 1 | M | none | none | Same role as OpenAI's. Reasoning Claude tolerates it less. Pure-accuracy. |
| top_p | 0 to 1 | L–M | none | none | Pure-accuracy. |
| top_k | integer ≥ 1 | L | none | none | Pure-accuracy. |
| metadata.user_id | string | none | none | none | Compliance/abuse routing. Not a quality knob. |

### Table 6 — Google Gemini (1.5 / 2.0 / 2.5 — Pro / Flash / Flash-Lite)

Gemini has two specific knobs worth a callout: cached_content and thinking_config. Context caching is a real cost knob — if your agent ships a long, mostly-static system prompt and/or tool catalog, *not* caching can leave 30–50% savings on the table. thinking_config is the 2.5 family's reasoning toggle, same dominance pattern as OpenAI's and Anthropic's.

| Knob | Range / values | A | C | L | Why it matters |
|---|---|---|---|---|---|
| thinking_config / thinking_budget (2.5) | integer tokens (0 disables) | **H** | **H** | **H** | Same family as reasoning_effort / thinking on the other providers. |
| candidate_count | integer ≥ 1 | M | **H** | **H** | Best-of-n. |
| max_output_tokens | 1 to model max | L | **H** | **H** | |
| cached_content | string handle | M (consistency) | **H** (savings) | M | Context caching can dramatically cut cost for long-context agents. |
| response_mime_type | `"text/plain"`, `"application/json"` | **M–H** (JSON tasks) | L | L | |
| response_schema | OpenAPI-flavor JSON schema | M | L | L | Structured output enforcement. Massively reduces parsing failure on extraction tasks. |
| temperature | 0 to 2 | M | none | none | Pure-accuracy. |
| top_p | 0 to 1 | L–M | none | none | Pure-accuracy. |
| top_k | integer | L | none | none | Pure-accuracy. |
| safety_settings | array of {category, threshold} | L (rejection rate) | none | none | Affects how often the model refuses, not how well it answers. |

### Table 7 — Open-source model serving stacks (Llama / Mistral / Qwen / DeepSeek via vLLM / TGI / llama.cpp / Ollama)

Open-source servers expose a much larger surface than the closed providers — nothing is hidden behind a SaaS façade. The headline knob now is the explicit reasoning toggle on newer families (Qwen 3, DeepSeek R1). Quantization and speculative decoding aren't runtime knobs in the strict sense — they're deploy-time configuration — but they dominate cost and latency to a degree that's worth listing alongside the sampling knobs. The biggest *silent* accuracy killer on this list is prompt_format: using the wrong chat template for a model (Llama instruct vs Mistral instruct vs ChatML) commonly costs 10–30 points on benchmarks before you realize what's wrong.

| Knob | Range / values | A | C | L | Why it matters |
|---|---|---|---|---|---|
| enable_thinking (Qwen 3, DeepSeek R1, others) | bool | **H** | **H** | **H** | Reasoning toggle on newer open models. |
| Quantization (server-side) | fp16, fp8, int8, int4, awq, gptq, etc. | L–M | **H** (compute) | M | Deploy-time configuration that dominates cost. |
| n_ctx allocation | tokens | L (if you have enough) | M (VRAM) | M | Bigger context allocation costs memory and can slow attention. |
| Speculative decoding draft model | model name | none | L | **M–H** | Speed without accuracy loss, *if* the draft model agrees often enough. |
| prompt_format template | provider-specific | **H** | none | none | Wrong chat template = silent accuracy killer. Pure-accuracy knob with huge leverage. |
| mirostat_mode / mirostat_eta / mirostat_tau | mode 0/1/2, floats | M | none | none | Adaptive sampling. llama.cpp / text-generation-webui only. Pure-accuracy. |
| min_p | 0 to 1 | L–M | none | none | Newer sampling method; some teams prefer over top_p/top_k. Pure-accuracy. |
| repetition_penalty | ~0.5 to 2 | L–M | none | none | Independent of presence/frequency penalty. Pure-accuracy. |
| Sampler order | list (e.g. `["top_k", "tfs", "typical_p", "top_p", "min_p", "temp"]`) | L–M | none | none | llama.cpp-style fine control. Pure-accuracy. |
| typical_p | 0 to 1 | L | none | none | Locally typical sampling. Rarely worth tuning. Pure-accuracy. |
| repeat_last_n | integer | L | none | none | How far back the repetition penalty looks. Pure-accuracy. |

---

**See what your math looks like:** [ROI Calculator →](/roi) · [TTM Calculator →](/ttm)

**Or read more on the same theme:** [The Model Myth →](/blog/the-model-myth) · [The Eval Trap →](/blog/the-eval-trap) · [The Business Case →](/blog/the-business-case)
