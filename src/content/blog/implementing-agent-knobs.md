---
title: "Agent Knobs: How to Implement Each One"
subtitle: "A working reference for every agent and LLM knob worth tuning — what it does, when it matters, and the code to wire it in."
slug: "implementing-agent-knobs"
date: "2026-06-04"
summary: "Twenty-five agent and model knobs, one section each: what the knob does, its accuracy / cost / latency impact, the typical settings, and a minimal code snippet you can drop into your agent. Plus deeper examples for five non-obvious model-specific knobs (reasoning_effort, thinking_budget, seed, response_format, prompt cache)."
author: "Amir Barnea"
readingTime: "18 min read"
tags: "configuration,knobs,implementation,agent,llm,reference"
featured: true
order: 2
---

**Prereqs:** if "knob" still sounds vague, start with [Agent Knobs 101](/blog/agent-knobs-101) first. For the *math* of why the space gets so big and the full catalog as tables, see [The Configuration Multiverse](/blog/the-config-multiverse).

**This post is the working reference.** It walks every knob worth tuning, says what to set it to, and shows the code. Snippets are minimal — Python and pseudocode, easy to translate into TypeScript / Java / Go.

Conventions:
- **A** = accuracy impact, **C** = cost impact, **L** = latency impact. Magnitudes are *high / medium / low / none*.
- "Most teams" = what we see in production agents before tuning.
- Code snippets assume you've already got an LLM client object (e.g. `client = OpenAI()`).

---

## Quick map

| Layer | Knob | A | C | L |
|---|---|---|---|---|
| Agent | Few-shot k | high | medium | low |
| Agent | Example selection strategy | high | none | none |
| Agent | Chain-of-thought | high | high | medium |
| Agent | Self-consistency | high | high | high |
| Agent | Self-correction passes | high | high | medium |
| Agent | Decomposition strategy | high | medium | medium |
| Agent | Reflection | medium | medium | medium |
| Agent | System prompt template | high | low | none |
| Agent | Tool-calling format | medium | none | low |
| Agent | Tool selection strategy | medium | medium | low |
| Agent | Tool description verbosity | medium | low | none |
| Agent | Tool execution mode | low | none | high |
| Agent | Output schema enforcement | medium | none | none |
| Agent | Retry budget | medium | medium | medium |
| Agent | Long-context management | high | medium | low |
| Model | Temperature | medium | none | none |
| Model | Top-p | low | none | none |
| Model | Max output tokens | low | medium | low |
| Model | Frequency penalty | low | none | none |
| Model | Stop sequences | low | low | none |

Then five non-obvious model-specific knobs at the end — `reasoning_effort`, `thinking_budget`, `seed`, `response_format`, prompt cache — each with a deeper example.

---

# Part 1: Agent-level knobs

These live in *your* code. The model provider doesn't know about them. They dominate accuracy by a wide margin because they're built for *your* workload.

---

### 1. Few-shot k

**What it is.** Number of input/output examples you put in the prompt before the user's actual question.
**Impact.** A: high · C: medium · L: low
**Typical settings.** 0, 1, 3, 5, 10
**Most teams.** Pick `k=3` from a tutorial. Never check if `k=1` would be just as good at 1/3 the cost.

```python
FEW_SHOT_EXAMPLES = [
    {"q": "What's our refund window?", "a": "30 days."},
    {"q": "Where's our HQ?",            "a": "Tel Aviv."},
    # ... up to 10
]

def build_messages(question, k):
    examples = FEW_SHOT_EXAMPLES[:k]                  # ← knob
    rendered = "\n\n".join(
        f"Q: {ex['q']}\nA: {ex['a']}" for ex in examples
    )
    return [
        {"role": "system", "content": f"{SYSTEM_PROMPT}\n\nExamples:\n{rendered}"},
        {"role": "user",   "content": question},
    ]
```

---

### 2. Example selection strategy

**What it is.** *Which* examples you put in the prompt, given a pool of hundreds you could pick from.
**Impact.** A: high · C: none · L: none (you ship the same `k`, just better-chosen ones)
**Typical settings.** `random`, `BM25` (lexical similarity to the user's question), `dense-embedding` (vector similarity), `task-aware` (retrieve by task family)
**Most teams.** Hard-code 3 generic examples. Lose 5–10 accuracy points vs retrieving question-relevant examples on every call.

```python
def pick_examples(question, k, strategy):
    if strategy == "random":
        return random.sample(POOL, k)
    if strategy == "BM25":
        return bm25_rank(POOL, question)[:k]
    if strategy == "dense-embedding":
        q_vec = embed(question)
        return sorted(POOL, key=lambda ex: -cosine(q_vec, ex["vec"]))[:k]
    if strategy == "task-aware":
        task = classify_task(question)               # cheap classifier
        return [ex for ex in POOL if ex["task"] == task][:k]
```

---

### 3. Chain-of-thought (CoT)

**What it is.** Whether and how the model is asked to write out reasoning before answering.
**Impact.** A: high · C: high (more output tokens) · L: medium
**Typical settings.** `off` · `brief` ("Briefly note your reasoning, then answer.") · `extended` ("Walk through your reasoning step by step, then answer.")
**Most teams.** Copy "Let's think step by step" from a 2022 paper into every agent. Pay 2× output token cost on lookup tasks that don't benefit.

```python
COT_INSTRUCTIONS = {
    "off":      "",
    "brief":    "Briefly note your reasoning, then answer.",
    "extended": "Walk through your reasoning step by step before answering.",
}

def system_prompt(base, cot_mode):
    return f"{base}\n\n{COT_INSTRUCTIONS[cot_mode]}"
```

---

### 4. Self-consistency (SC)

**What it is.** Call the LLM N times with the same prompt (or sampling temperature) and take the majority answer.
**Impact.** A: high (on hard reasoning / extraction) · C: high (literally N× the calls) · L: high
**Typical settings.** 1, 3, 5
**Most teams.** Stuck at SC=1 because the API client doesn't expose it. You have to wrap your call in a loop.

```python
from collections import Counter

def self_consistent_answer(prompt, n, temperature=0.7):
    if n == 1:
        return llm(prompt, temperature=0)            # deterministic
    answers = [llm(prompt, temperature=temperature) for _ in range(n)]
    return Counter(answers).most_common(1)[0][0]
```

---

### 5. Self-correction passes

**What it is.** After getting an answer, ask the model to critique its own output and revise. Repeat *n* times.
**Impact.** A: high · C: high (each pass is another full call) · L: medium-high
**Typical settings.** 0, 1, 2
**Most teams.** Don't do this. Big leverage on tasks where the first draft is often "almost right".

```python
def with_self_correction(prompt, passes):
    answer = llm(prompt)
    for _ in range(passes):
        critique = llm(f"Critique this answer for errors:\n\n{answer}")
        answer = llm(f"Revise the answer using this critique:\n{critique}\n\nAnswer:\n{answer}")
    return answer
```

---

### 6. Decomposition strategy

**What it is.** Whether the agent answers in one shot or breaks the task into sub-tasks.
**Impact.** A: high on multi-step tasks · C: medium · L: medium
**Typical settings.** `single-shot` · `plan-then-execute` (plan steps first, then execute each) · `iterative` (interleave plan/act/observe loop)
**Most teams.** Single-shot everything because it was easiest to ship. Multi-step tasks suffer.

```python
def answer(task, mode):
    if mode == "single-shot":
        return llm(task)

    if mode == "plan-then-execute":
        plan = llm(f"List 2-5 numbered subtasks to solve: {task}")
        results = [llm(f"Subtask: {step}") for step in parse_steps(plan)]
        return llm(f"Synthesize final answer from:\n{results}")

    if mode == "iterative":
        history = []
        while not done(history):
            action = llm(f"Next step? Context: {history}")
            obs = execute(action)
            history.append((action, obs))
        return synthesize(history)
```

---

### 7. Reflection

**What it is.** Periodic self-evaluation — the agent checks its own progress and decides whether to continue, retry, or quit.
**Impact.** A: medium · C: medium · L: medium
**Typical settings.** `off` · `post-step` (reflect after each tool call) · `end-of-task` (one big reflection at the end)
**Most teams.** Off, because nobody asked for it. Most useful on agentic loops that risk going in circles.

```python
def agent_loop(task, reflection_mode):
    for step in range(MAX_STEPS):
        action = llm(f"Task: {task}\nNext action:")
        result = execute(action)

        if reflection_mode == "post-step":
            decision = llm(f"On track? task={task} result={result}. yes/no/abort")
            if decision == "abort":
                break
        # ...

    if reflection_mode == "end-of-task":
        critique = llm(f"Was the goal met? Task: {task}, Final: {result}")
        if "no" in critique.lower():
            return retry(task)
    return result
```

---

### 8. System prompt template

**What it is.** The structure / persona / rules the system message follows.
**Impact.** A: high · C: low · L: none
**Typical settings.** `concise` · `verbose` · `persona` ("You are a senior tax attorney…") · `rule-based` (numbered rules)
**Most teams.** One bespoke prompt per agent, never A/B tested against a different style.

```python
SYSTEM_TEMPLATES = {
    "concise":    "Answer accurately. Cite sources when relevant.",
    "verbose":    "You are an assistant... [paragraph explaining role + context + tone + constraints]",
    "persona":    "You are a senior {role}. Reply in that voice.",
    "rule-based": "Follow these rules:\n1. ...\n2. ...\n3. ...",
}

def system_message(template_name, **kwargs):
    return SYSTEM_TEMPLATES[template_name].format(**kwargs)
```

---

### 9. Tool-calling format

**What it is.** How the agent communicates intent to call a tool.
**Impact.** A: medium · C: none · L: low
**Typical settings.** `native` (provider's tool-calling API) · `JSON-mode` (model emits a JSON object) · `function-call` (legacy) · `unstructured` (parse the text yourself)
**Most teams.** Use `native` because it's documented. Sometimes JSON-mode works better with weaker models.

```python
def call_with_tools(question, tools, fmt):
    if fmt == "native":
        return client.chat.completions.create(
            model=MODEL, messages=msgs, tools=tools
        )
    if fmt == "JSON-mode":
        return client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "system", "content": f"Available tools:\n{tools_json(tools)}\nReply ONLY with a JSON object like {{\"tool\": ..., \"args\": ...}}"}, ...],
            response_format={"type": "json_object"},
        )
    if fmt == "unstructured":
        out = llm(question + "\n\nIf you need a tool, write `TOOL(name, args)`.")
        return parse_tool_call(out)
```

---

### 10. Tool selection strategy

**What it is.** How you decide *which* tools to expose to the model on a given call.
**Impact.** A: medium · C: medium (tools eat input tokens) · L: low
**Typical settings.** `all-in-context` (always pass every tool — what most teams do) · `top-k-retrieved` (retrieve tools by relevance) · `hierarchical` (router model → sub-toolset)
**Most teams.** Dump every tool definition into the prompt every call. Pay 1–3K input tokens for tools the model never picks.

```python
def select_tools(question, all_tools, strategy):
    if strategy == "all-in-context":
        return all_tools
    if strategy == "top-k-retrieved":
        q_vec = embed(question)
        return sorted(all_tools, key=lambda t: -cosine(q_vec, t["vec"]))[:5]
    if strategy == "hierarchical":
        category = classify(question)            # cheap router
        return TOOLS_BY_CATEGORY[category]
```

---

### 11. Tool description verbosity

**What it is.** How much you write in each tool's description string.
**Impact.** A: medium · C: low (per-tool overhead × N tools) · L: none
**Typical settings.** `terse` (one-sentence) · `standard` (sentence + param list) · `rich-with-examples` (sentence + params + 1–2 example invocations)
**Most teams.** Whatever they typed first. Mostly *terse* and it costs accuracy.

```python
TOOL_DESCRIPTIONS = {
    "terse": {
        "search_orders": "Look up an order by ID.",
    },
    "rich-with-examples": {
        "search_orders": (
            "Look up an order by ID. Use when the user gives a numeric "
            "or alphanumeric order reference. "
            "Example: search_orders(order_id='A8-1942')."
        ),
    },
}
```

---

### 12. Tool execution mode

**What it is.** When the model wants multiple tool calls, do you run them one-by-one or all at once?
**Impact.** A: low · C: none · L: high (this is where you actually save real time)
**Typical settings.** `sequential` · `parallel`
**Most teams.** Sequential because it was easier to implement. Lose 30–70% of wall-clock time on parallelizable workflows.

```python
import asyncio

async def run_tools(calls, mode):
    if mode == "sequential":
        return [await execute(c) for c in calls]
    if mode == "parallel":
        return await asyncio.gather(*(execute(c) for c in calls))
```

(For LLMs that support it, also set the provider-side `parallel_tool_calls=True`.)

---

### 13. Output schema enforcement

**What it is.** How strictly the model's output is constrained to a structure (JSON shape, regex, grammar).
**Impact.** A: medium · C: none · L: none
**Typical settings.** `free-form` · `JSON-mode` (model is asked for valid JSON, but no schema) · `structured-generation` (provider enforces a JSON Schema or grammar)
**Most teams.** Free-form + a fragile regex parser → 5–15% of responses fail to parse. Use structured-generation when the provider supports it.

```python
# OpenAI structured outputs
response = client.chat.completions.create(
    model="gpt-4o",
    messages=msgs,
    response_format={
        "type": "json_schema",
        "json_schema": {
            "name": "answer",
            "schema": {
                "type": "object",
                "properties": {
                    "answer": {"type": "string"},
                    "confidence": {"type": "number"},
                },
                "required": ["answer", "confidence"],
                "additionalProperties": False,
            },
            "strict": True,
        },
    },
)
```

---

### 14. Retry budget

**What it is.** On parse failure, tool error, or model error, how many times you retry before giving up.
**Impact.** A: medium · C: medium · L: medium
**Typical settings.** 0, 1, 2, 3
**Most teams.** Hard-code 3 with no backoff or budget. Burns money on calls that were going to fail anyway.

```python
def with_retries(fn, budget):
    for attempt in range(budget + 1):
        try:
            return fn()
        except (ParseError, ToolError, RateLimitError) as e:
            if attempt == budget:
                raise
            time.sleep(2 ** attempt)              # exponential backoff
```

---

### 15. Long-context management

**What it is.** What you do when conversation history + retrieved context exceeds the model's window.
**Impact.** A: high · C: medium · L: low
**Typical settings.** `truncate` (drop oldest) · `summarize` (LLM-summarize old turns) · `RAG-windowed` (drop everything, retrieve relevant chunks per turn) · `full-context` (use a long-context model)
**Most teams.** Truncate. Lose information that mattered three turns ago.

```python
def fit_to_window(messages, mode, target_tokens):
    if mode == "truncate":
        return messages[-fit_count(messages, target_tokens):]
    if mode == "summarize":
        keep = messages[-4:]
        summary = llm(f"Summarize: {messages[:-4]}")
        return [{"role": "system", "content": f"Earlier:\n{summary}"}, *keep]
    if mode == "RAG-windowed":
        return [messages[0], retrieve_relevant(latest_user(messages))]
```

---

# Part 2: Common LLM knobs

The provider exposes these on every request. Defaults are picked for the median customer, which is not you.

---

### 16. Temperature

**What it is.** Randomness of token sampling. 0 = deterministic, higher = more varied.
**Impact.** A: medium · C: none · L: none
**Typical settings.** 0.0, 0.2, 0.5, 0.7, 1.0
**When to set what.** Use 0 for extraction / lookup / classification. Use 0.7 if you want diversity (creative writing, brainstorming). Use 0.3–0.5 for "natural" replies. Self-consistency requires temperature > 0.

```python
response = client.chat.completions.create(
    model="gpt-4o",
    messages=msgs,
    temperature=0.0,                                    # ← knob
)
```

---

### 17. Top-p (nucleus sampling)

**What it is.** Alternative to temperature — only sample from tokens whose cumulative probability is ≤ p.
**Impact.** A: low · C: none · L: none
**Typical settings.** 0.9, 0.95, 1.0
**Most teams.** Leave at default (1.0). Rarely worth tuning if temperature is already set.

```python
response = client.chat.completions.create(
    model="gpt-4o",
    messages=msgs,
    top_p=0.95,                                         # ← knob
)
```

---

### 18. Max output tokens

**What it is.** Hard cap on response length.
**Impact.** A: low · C: medium (caps your worst-case bill) · L: low
**Typical settings.** 256, 512, 1024, 2048
**Most teams.** Leave at the model's default (often 4096+). Pay the full bill when the model rambles.

```python
response = client.chat.completions.create(
    model="gpt-4o",
    messages=msgs,
    max_tokens=512,                                     # ← knob
)
```

---

### 19. Frequency penalty

**What it is.** Discourage the model from repeating tokens it's already used.
**Impact.** A: low · C: none · L: none
**Typical settings.** 0.0, 0.3, 0.6, 1.0
**Most teams.** Leave at 0. Mildly useful for creative tasks that loop on the same phrase.

```python
response = client.chat.completions.create(
    model="gpt-4o",
    messages=msgs,
    frequency_penalty=0.3,                              # ← knob
)
```

---

### 20. Stop sequences

**What it is.** Strings that, if generated, terminate the response immediately.
**Impact.** A: low · C: low (stops early on chatty models) · L: none
**Typical settings.** none, or task-specific tokens like `\n\nUser:` for chat-style agents.
**Most teams.** Don't set any. Models occasionally hallucinate role markers and keep going.

```python
response = client.chat.completions.create(
    model="gpt-4o",
    messages=msgs,
    stop=["\n\nUser:", "\nQ:"],                         # ← knob
)
```

---

# Part 3: Five non-obvious specific-LLM knobs

These exist on specific providers and *don't* generalize. They're worth understanding individually because the leverage is high and the defaults are often bad for your task.

---

### 21. `reasoning_effort` (OpenAI o-series, GPT-5)

**What it is.** Tells reasoning models how hard to think before answering.
**Impact.** A: high · C: high · L: high (extended reasoning runs invisibly before the response)
**Settings.** `low` · `medium` · `high`
**When it matters.** Multi-step math, code generation, planning. On a lookup task, `high` triples cost for zero gain.

```python
response = client.responses.create(
    model="o4-mini",
    input="Prove that there are infinitely many primes.",
    reasoning={"effort": "high"},                       # ← knob
)
```

---

### 22. `thinking_budget` (Anthropic Claude with extended thinking)

**What it is.** Token budget Claude can spend on internal reasoning before producing the visible answer.
**Impact.** A: high · C: high (you pay for the thinking tokens) · L: high
**Settings.** `off` · `1024` · `4096` · `16384` · `32768`
**When it matters.** Math, complex planning, multi-document synthesis. `off` is fine for short Q&A.

```python
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=4096,
    thinking={
        "type": "enabled",
        "budget_tokens": 16384,                         # ← knob
    },
    messages=[{"role": "user", "content": prompt}],
)
```

---

### 23. `seed` (OpenAI, others)

**What it is.** Reproducibility. Same `seed` + same input + same params → very likely the same output.
**Impact.** A: none directly, but huge for testing and A/B comparing other knobs cleanly. C: none. L: none.
**Settings.** `none` (default), or any fixed integer.
**When it matters.** Any time you're comparing two prompts or two configurations and don't want sampling variance to muddy the result. **This is the underrated knob.**

```python
response = client.chat.completions.create(
    model="gpt-4o",
    messages=msgs,
    seed=42,                                            # ← knob
    temperature=0.7,
)
# system_fingerprint in the response tells you if the model version changed.
```

---

### 24. `response_format` (OpenAI, Anthropic, Google)

**What it is.** Constrains the response to a specific structure at the provider level — JSON, a JSON Schema, or a free-form grammar.
**Impact.** A: medium (eliminates parse errors as a failure mode). C: none. L: none.
**Settings.** `text` · `json_object` · `json_schema` (strict)
**When it matters.** Any time the next step in your pipeline expects structured output.

```python
# Strict schema — provider rejects any output that doesn't match
response = client.chat.completions.create(
    model="gpt-4o",
    messages=msgs,
    response_format={
        "type": "json_schema",
        "json_schema": {
            "name": "extraction",
            "schema": {
                "type": "object",
                "properties": {
                    "category":   {"type": "string", "enum": ["billing", "support", "spam"]},
                    "priority":   {"type": "integer", "minimum": 1, "maximum": 5},
                    "summary":    {"type": "string"},
                },
                "required": ["category", "priority", "summary"],
                "additionalProperties": False,
            },
            "strict": True,
        },
    },
)
data = json.loads(response.choices[0].message.content)  # guaranteed to parse
```

---

### 25. Prompt caching (Anthropic, OpenAI)

**What it is.** Reuse expensive parts of the prompt across calls. The provider stores the prefix and only charges full input rate the first time.
**Impact.** A: none · C: high (50–90% off the cached portion) · L: medium (cached tokens skip the full forward pass)
**Settings.** `off` · `ephemeral` (5-min TTL, Anthropic) · `persistent`-ish (provider-specific)
**When it matters.** Any long system prompt or tool catalog you send on every request — system prompts, embeddings tables, glossaries, long instructions.

```python
# Anthropic — mark the long, stable prefix as a cache breakpoint.
response = client.messages.create(
    model="claude-opus-4-7",
    system=[
        {
            "type": "text",
            "text": LONG_SYSTEM_PROMPT_AND_TOOL_CATALOG,
            "cache_control": {"type": "ephemeral"},     # ← knob
        }
    ],
    messages=[{"role": "user", "content": user_question}],
)
# First call: full price on the cached portion + write fee.
# Subsequent calls within the TTL: ~10% the price on that portion.
```

---

## Where the leverage hides

If you read every section above and felt your eyes glaze around knob #11, that's the point. There are *too many* knobs and *too many* combinations for a human to tune by hand. A typical real agent ships with maybe 5–8 of these knobs at non-default values, the rest left wherever the SDK defaulted them. The math from [the configuration multiverse](/blog/the-config-multiverse) says the answer your agent gives today is one point in a space of millions. It almost certainly isn't the right point.

That's what [Traigent](/) is built to handle — sweep the space efficiently, evaluate the candidates against *your* eval set, and surface the configurations that win on accuracy at the lowest cost.

---

## Next steps

- [▶ Watch the 1-minute story](/#/story) — sees the sweep + convergence in action
- [Open the Knob Explorer](/#/knob-explorer) — click through the catalog, watch the combinatorics
- [Book a demo](https://meetings-eu1.hubspot.com/amir8) — run it on your agent and see your numbers
