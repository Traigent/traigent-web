# Traigent Coding-Agent Playbook

Version: v1
Date: 2026-06-05
Audience: hosted coding agents reading this at runtime

Traigent optimizes agent behavior by evaluating candidate configurations against a task-local dataset.
It is useful only when the evaluator, tunable configuration space, cost controls, and evidence loop are
real enough to support an honest decision.

## Prime Directives

1. Dry-run first. Validate the dataset, wiring, and result path in mock mode before any real run.
2. Never spend real model tokens without explicit human approval for this run.
3. Make only honest, task-local claims. Report "on this dataset slice", not universal improvement.
4. Treat scaffolded evals as drafts until a human approves or replaces them.
5. Finish with evidence, changed files, test results, cost spent, and a PR-ready summary.

The `traigent first-prompt` command points coding agents here. Read this guide before changing code.

## Decision Tree

Start by answering one question:

Does this project already have an evaluation dataset?

If yes, use Track A.
If no, use Track B.

## Track A: Project Has An Eval

1. Locate the evaluation source.
   - Pytest goldens: tests that compare outputs to expected values.
   - Promptfoo: prompt/eval cases with expected outputs or assertions.
   - CSV: rows with inputs and labels, targets, scores, or expected answers.
   - JSONL: one example per line.
   - Existing application fixtures, golden files, or replay logs.

2. Convert the source to Traigent JSONL.

```jsonl
{"input": {"question": "What is the refund policy?"}, "output": "refund policy answer"}
{"input": {"ticket": "I was charged twice"}, "output": "billing"}
```

Use structured `input` values when the application needs more than one field.
Preserve the expected answer, class, score target, or assertion payload in `output`.
Keep provenance notes: file path, fixture source, owner, date, and whether the data is user-provided.

3. Validate the dataset.

```bash
traigent validate eval.jsonl
```

Do not optimize until validation passes.

4. Detect tunables already present in the code.
   - Model, provider, temperature, top-p, max tokens.
   - Prompt template, system message, examples, tool instructions.
   - Retrieval depth, retriever, context order, evidence filters.
   - Schema context, routing, self-consistency, repair policy, generation path.
   - Any runtime branch that could be controlled by `cfg = traigent.get_config()`.

5. Ask Traigent for catalog-backed recommendations.

```bash
traigent recommend
```

For Python code, prefer:

```python
configuration_space = traigent.recommend_configuration_space(agent_type)
```

Use the current catalog families when they match the task:
`code_gen` and `rag`.

6. Wire the optimizer.

```python
import traigent

configuration_space = {
    "model": ["gpt-4o-mini", "gpt-4o"],
    "retrieval_k": [2, 4, 8],
}

@traigent.optimize(
    configuration_space=configuration_space,
    eval_dataset="eval.jsonl",
    objectives=["accuracy", "cost"],
    algorithm="random",
    max_trials=4,
    execution_mode="local",
)
async def answer(example):
    cfg = traigent.get_config()
    return await run_agent(
        example["input"],
        model=cfg["model"],
        retrieval_k=cfg["retrieval_k"],
    )
```

Every structural knob must change real runtime behavior. Declaring a knob is not enough.
If a catalog entry is guidance rather than executable wiring, branch manually on `cfg`.

7. Run a baseline on the eval.
   - Use the current production/default configuration.
   - Record dataset size, metric definitions, cost if any, and failures.
   - Keep this separate from optimization results.

8. Run mock optimization at zero cost.
   - Use `traigent quickstart` for the packaged mock path when starting from the CLI.
   - Use `execution_mode="local"` and `algorithm="random"` or `algorithm="grid"` for local checks.
   - Keep `max_trials` small until the pipeline is proven.
   - Confirm the decorated function runs, scores, and returns usable result tables.

9. Estimate real cost.
   - Upper bound: `max_trials * eval_rows * model_calls_per_example`.
   - Include reruns, retries, held-out checks, and provider price assumptions.
   - State the configured `TRAIGENT_RUN_COST_LIMIT`.

10. Stop for human approval.
    - Show the mock result and cost estimate.
    - Ask for explicit go/no-go before any paid run.
    - Do not infer approval from vague acceptance.

11. Run the real optimization only after approval.
    - Set the run cost limit.
    - Set `TRAIGENT_COST_APPROVED=true`.
    - Use fresh process state after mock mode.
    - Authenticate if backend-backed algorithms are needed.

```bash
traigent onboard
traigent auth device-login  # if available; otherwise traigent auth login (API key from portal.traigent.ai); TRAIGENT_API_KEY works non-interactively
```

For backend access, prefer `traigent auth device-login` when the installed SDK has it; otherwise use `traigent auth login` and paste an API key from `portal.traigent.ai`; `TRAIGENT_API_KEY` works in both paths for non-interactive environments.

12. Use the appropriate algorithm and mode.
    - `random`: local.
    - `grid`: local.
    - `tpe`: backend hybrid, with `traigent auth device-login` if available; otherwise `traigent auth login` (API key from `portal.traigent.ai`); `TRAIGENT_API_KEY` works in both paths for non-interactive use.

13. Read completed trials from the result table.

```python
result = await answer.optimize(
    algorithm="tpe",
    max_trials=80,
    timeout=1800.0,
)
trials_df = result.to_dataframe()
```

Use `result.to_dataframe()` as the source of record for reporting.

14. Check held-out performance.
    - Keep a held-out slice separate from the optimization slice whenever possible.
    - Compare baseline vs optimized on that held-out slice.
    - Report failures, excluded rows, and sample counts.

15. Inspect and export results.

```bash
traigent results list
traigent results show
traigent results compare
traigent results rerank
traigent export
```

## Track B: No Eval Yet

1. Do not run paid optimization.
2. Ask the user for 15-30 representative input/output examples.
3. If the user cannot provide examples yet, scaffold a draft JSONL from the codebase.
4. Mark the dataset provenance as `draft`.
5. Mark all downstream measurements as `DRAFT EVIDENCE`.
6. Validate the draft dataset with `traigent validate eval.jsonl`.
7. Wire the decorator and config space as in Track A.
8. Run mock-only checks to prove the plumbing.
9. Stop and ask the human to approve or replace the dataset.
10. Never run paid optimization on an unapproved eval.

Draft evidence may support integration work. It does not certify improvement.

## Honesty Rules

1. Impacts are task-dependent.
2. Say "on this eval slice" or "on this held-out slice".
3. Do not claim universal gains, SOTA, or model superiority from one local run.
4. Do not claim a single knob caused the gain unless held-out evidence isolates that effect.
5. Report the selected configuration jointly: dataset, model family, wiring, objectives, and search mode.
6. Generated evals never certify improvement until user-approved data is used.
7. Mock scores prove plumbing only. They are not product evidence.
8. If a run has too few trials, call variable attribution directional.
9. If rows were removed, failed, retried, or manually scored, say so.
10. If evidence is absent, stale, or unapproved, report the work as not ready.

## Operational Guardrails

1. Set `TRAIGENT_RUN_COST_LIMIT` before any real run.
2. Set `TRAIGENT_COST_APPROVED=true` only after the user approves this run.
3. Start a fresh study directory per run if your integration sets one.
4. Use a fresh interpreter/process after mock mode before real execution.
5. Use large `timeout` values for real optimization so the run is not silently truncated.
6. Prefer local `random` or `grid` until the evaluator is stable.
7. Use backend hybrid `tpe` only when authenticated with `traigent auth device-login` if available; otherwise `traigent auth login` (API key from `portal.traigent.ai`); `TRAIGENT_API_KEY` works in both paths for non-interactive use.
8. Keep provider API keys out of code, docs, diffs, and logs.
9. Keep baseline, optimization, rerank, and held-out evidence separate.
10. Read reporting data from `result.to_dataframe()`.

## Finish-Line Contract

When you finish, deliver:

1. Decorated function path and the final `configuration_space`.
2. Every `cfg = traigent.get_config()` branch you wired.
3. Eval dataset path and provenance: user-provided, existing project eval, or draft scaffold.
4. Baseline metrics and optimized metrics on the optimization slice.
5. Baseline vs optimized metrics on held-out data, if available.
6. Total cost spent and configured cost limit.
7. Significant tuned variables ranking, if available, with confidence labels.
8. Changed files.
9. Test commands and results.
10. PR-ready summary with open risks and whether human approval is still required.

Use the significant tuned variables report for post-run attribution when trials are available.
Keep the language observational: "in this run, on this slice".

## Capabilities Not Yet Available

The following are rolling out and must not be assumed available everywhere:

1. `traigent mcp` local MCP server.
2. Backend-generated example datasets.
3. Free self-service signup and device-login general availability are rolling out; device-login exists in newer SDKs, so check `traigent auth device-login --help` before relying on it.

This file is versioned. If SDK behavior changes, update this playbook with the new current surface.
