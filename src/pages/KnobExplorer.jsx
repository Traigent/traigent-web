// /knob-explorer — interactive search-space configurator.
// User picks models, agent knobs, common model knobs, and per-model specific
// knobs, then picks values for each. A giant combinatorics counter ticks up
// as selections multiply. Each knob row shows its impact on A / C / L as
// color-coded pills so the user can see which knobs are worth tuning.
//
// Reachable via the hidden ▸ menu in TopNav.
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp, Clock, DollarSign, Sparkles } from "lucide-react";
import { useSharedSetting } from "../lib/useSharedSetting";
import { useCustomSearchSpace } from "../lib/useCustomSearchSpace";
import { useRemoveChatWidget } from "../lib/useRemoveChatWidget";
import ChatKillerStyle from "../lib/ChatKillerStyle";
import GuidedTour from "../lib/GuidedTour";

// Tour sequence used by Act 2 of /story. Walks legend → counter → sort →
// expands each BIRD vendor group → clicks 6 BIRD models → enables 8 knobs
// whose default value counts multiply to 9,720, so the counter lands on
// exactly 58,320 — the same number the Live Demo (Act 4) uses for its
// search-space headline. Knob choices are semantic best-effort matches
// for the demo's 9 axes:
//   kShot          ↔ few-shot-k         (5)
//   exampleSel     ↔ example-selection  (4)
//   cot            ↔ cot                (3)
//   selfConsist    ↔ self-consistency   (3)
//   selfCorrect    ↔ self-correction    (3)
//   decomposition  ↔ decomposition      (3)
//   hints/valueRet ↔ reflection         (3)
//   schemaPrune    ↔ tool-execution     (2)
// Product: 5×4×3×3×3×3×3×2 = 9,720; ×6 models = 58,320.
const BIRD_TOUR_STEPS = [
  // Intro: orient on the controls (no clicks)
  { selector: '[data-tour="legend"]',       dwellMs: 1700 },
  { selector: '[data-tour="counter"]',      dwellMs: 1700 },
  { selector: '[data-tour="sort-toggle"]',  dwellMs: 1500 },

  // Expand OpenAI; select GPT-4o and GPT-4o mini (highlight: full grid row)
  { selector: '[data-tour="vendor-OpenAI"]', click: true, dwellMs: 700 },
  { selector: '[data-tour="vendor-grid-OpenAI"]',
    clickSelector: '[data-tour="model-gpt-4o"]',     dwellMs: 700 },
  { selector: '[data-tour="vendor-grid-OpenAI"]',
    clickSelector: '[data-tour="model-gpt-4o-mini"]', dwellMs: 700 },

  // Expand Anthropic; select Sonnet + Haiku
  { selector: '[data-tour="vendor-Anthropic"]', click: true, dwellMs: 700 },
  { selector: '[data-tour="vendor-grid-Anthropic"]',
    clickSelector: '[data-tour="model-claude-3.5-sonnet"]', dwellMs: 700 },
  { selector: '[data-tour="vendor-grid-Anthropic"]',
    clickSelector: '[data-tour="model-claude-3.5-haiku"]',  dwellMs: 700 },

  // Expand Google; select Gemini Flash
  { selector: '[data-tour="vendor-Google"]', click: true, dwellMs: 700 },
  { selector: '[data-tour="vendor-grid-Google"]',
    clickSelector: '[data-tour="model-gemini-1.5-flash"]', dwellMs: 700 },

  // Expand Meta; select Llama 70B
  { selector: '[data-tour="vendor-Meta"]', click: true, dwellMs: 700 },
  { selector: '[data-tour="vendor-grid-Meta"]',
    clickSelector: '[data-tour="model-llama-3.1-70b"]', dwellMs: 700 },

  // Enable 12 knobs to multiply the search space toward ~8.4M.
  // For few-shot-k we ALSO demo value clicks (deselect 10, reselect 10) so
  // the viewer sees value-level interaction. The other knobs use defaults.
  { selector: '[data-tour="knob-row-few-shot-k"]',
    clickSelector: '[data-tour="knob-toggle-few-shot-k"]', dwellMs: 600 },
  { selector: '[data-tour="knob-row-few-shot-k"]',
    clickSelector: '[data-tour="value-few-shot-k-10"]',    dwellMs: 450 },
  { selector: '[data-tour="knob-row-few-shot-k"]',
    clickSelector: '[data-tour="value-few-shot-k-10"]',    dwellMs: 450 },

  { selector: '[data-tour="knob-row-example-selection"]',
    clickSelector: '[data-tour="knob-toggle-example-selection"]', dwellMs: 500 },
  { selector: '[data-tour="knob-row-cot"]',
    clickSelector: '[data-tour="knob-toggle-cot"]', dwellMs: 500 },
  { selector: '[data-tour="knob-row-self-consistency"]',
    clickSelector: '[data-tour="knob-toggle-self-consistency"]', dwellMs: 500 },
  { selector: '[data-tour="knob-row-self-correction"]',
    clickSelector: '[data-tour="knob-toggle-self-correction"]', dwellMs: 500 },
  { selector: '[data-tour="knob-row-decomposition"]',
    clickSelector: '[data-tour="knob-toggle-decomposition"]', dwellMs: 500 },
  { selector: '[data-tour="knob-row-reflection"]',
    clickSelector: '[data-tour="knob-toggle-reflection"]', dwellMs: 500 },
  { selector: '[data-tour="knob-row-tool-execution"]',
    clickSelector: '[data-tour="knob-toggle-tool-execution"]', dwellMs: 500 },

  // Outro — pan back to the counter to land on the big config number.
  { selector: '[data-tour="counter"]', dwellMs: 1000 },
];

// =============================================================================
// Knob catalog — generic across agent types (not text-to-SQL specific).
// Impact magnitudes: 0 = none, 1 = low, 2 = medium, 3 = high.
// =============================================================================

// license: "closed" = API-only / proprietary; "open" = open-weights or
// permissively licensed (Llama community license, Apache, MIT, Gemma, etc.).
const MODELS = [
  // -- Closed / API-only --
  // OpenAI
  { id: "gpt-5",             name: "GPT-5",              provider: "OpenAI",    license: "closed", impact: { a: 3, c: 3, l: 2 } },
  { id: "gpt-4o",            name: "GPT-4o",             provider: "OpenAI",    license: "closed", impact: { a: 3, c: 3, l: 2 } },
  { id: "gpt-4o-mini",       name: "GPT-4o mini",        provider: "OpenAI",    license: "closed", impact: { a: 2, c: 1, l: 1 } },
  { id: "o3",                name: "o3 (reasoning)",     provider: "OpenAI",    license: "closed", impact: { a: 3, c: 3, l: 3 } },
  { id: "o4-mini",           name: "o4-mini (reasoning)",provider: "OpenAI",    license: "closed", impact: { a: 3, c: 2, l: 3 } },
  // Anthropic
  { id: "claude-opus-4.7",   name: "Claude Opus 4.7",    provider: "Anthropic", license: "closed", impact: { a: 3, c: 3, l: 2 } },
  { id: "claude-sonnet-4.6", name: "Claude Sonnet 4.6",  provider: "Anthropic", license: "closed", impact: { a: 3, c: 2, l: 2 } },
  { id: "claude-haiku-4.5",  name: "Claude Haiku 4.5",   provider: "Anthropic", license: "closed", impact: { a: 2, c: 1, l: 1 } },
  { id: "claude-3.5-sonnet", name: "Claude 3.5 Sonnet",  provider: "Anthropic", license: "closed", impact: { a: 3, c: 3, l: 2 } },
  { id: "claude-3.5-haiku",  name: "Claude 3.5 Haiku",   provider: "Anthropic", license: "closed", impact: { a: 2, c: 1, l: 1 } },
  // Google + Mistral
  { id: "gemini-1.5-pro",    name: "Gemini 1.5 Pro",     provider: "Google",    license: "closed", impact: { a: 3, c: 2, l: 2 } },
  { id: "gemini-1.5-flash",  name: "Gemini 1.5 Flash",   provider: "Google",    license: "closed", impact: { a: 2, c: 1, l: 1 } },
  { id: "mistral-large",     name: "Mistral Large",      provider: "Mistral",   license: "closed", impact: { a: 2, c: 2, l: 2 } },
  // -- Open-weights --
  { id: "llama-3.1-405b",    name: "Llama 3.1 405B",     provider: "Meta",      license: "open",   impact: { a: 3, c: 3, l: 3 } },
  { id: "llama-3.3-70b",     name: "Llama 3.3 70B",      provider: "Meta",      license: "open",   impact: { a: 3, c: 1, l: 2 } },
  { id: "llama-3.1-70b",     name: "Llama 3.1 70B",      provider: "Meta",      license: "open",   impact: { a: 2, c: 1, l: 2 } },
  { id: "llama-3.1-8b",      name: "Llama 3.1 8B",       provider: "Meta",      license: "open",   impact: { a: 1, c: 1, l: 1 } },
  { id: "mixtral-8x22b",     name: "Mixtral 8x22B",      provider: "Mistral",   license: "open",   impact: { a: 2, c: 2, l: 2 } },
  { id: "mistral-nemo-12b",  name: "Mistral Nemo 12B",   provider: "Mistral",   license: "open",   impact: { a: 1, c: 1, l: 1 } },
  { id: "qwen-2.5-72b",      name: "Qwen 2.5 72B",       provider: "Alibaba",   license: "open",   impact: { a: 2, c: 1, l: 2 } },
  { id: "deepseek-v3",       name: "DeepSeek V3",        provider: "DeepSeek",  license: "open",   impact: { a: 2, c: 1, l: 1 } },
  { id: "deepseek-r1",       name: "DeepSeek R1",        provider: "DeepSeek",  license: "open",   impact: { a: 3, c: 2, l: 3 } },
  { id: "gemma-2-27b",       name: "Gemma 2 27B",        provider: "Google",    license: "open",   impact: { a: 2, c: 1, l: 1 } },
  { id: "phi-4",             name: "Phi 4",              provider: "Microsoft", license: "open",   impact: { a: 2, c: 1, l: 1 } },
  { id: "command-r-plus",    name: "Command R+",         provider: "Cohere",    license: "open",   impact: { a: 2, c: 2, l: 2 } },
];

// Display order for vendor groups in the Models section. Anything not listed
// here is dropped to the end alphabetically.
const VENDOR_ORDER = [
  "OpenAI",
  "Anthropic",
  "Google",
  "Meta",
  "Mistral",
  "DeepSeek",
  "Alibaba",
  "Microsoft",
  "Cohere",
];

const AGENT_KNOBS = [
  { id: "few-shot-k",         name: "In-context examples (k)",         values: [0, 1, 3, 5, 10],                                            impact: { a: 3, c: 2, l: 1 } },
  { id: "example-selection",  name: "Example selection strategy",      values: ["random", "BM25", "dense-embedding", "task-aware"],         impact: { a: 3, c: 0, l: 0 } },
  { id: "cot",                name: "Chain-of-thought",                values: ["off", "brief", "extended"],                                impact: { a: 3, c: 3, l: 2 } },
  { id: "self-consistency",   name: "Self-consistency (votes)",        values: [1, 3, 5],                                                   impact: { a: 3, c: 3, l: 3 } },
  { id: "self-correction",    name: "Self-correction passes",          values: [0, 1, 2],                                                   impact: { a: 3, c: 3, l: 2 } },
  { id: "decomposition",      name: "Decomposition / multi-step",      values: ["single-shot", "plan-then-execute", "iterative"],           impact: { a: 3, c: 2, l: 2 } },
  { id: "reflection",         name: "Reflection / self-critique",      values: ["off", "post-step", "end-of-task"],                         impact: { a: 2, c: 2, l: 2 } },
  { id: "system-prompt",      name: "System prompt template",          values: ["concise", "verbose", "persona", "rule-based"],             impact: { a: 3, c: 1, l: 0 } },
  { id: "tool-format",        name: "Tool-calling format",             values: ["native", "JSON-mode", "function-call", "unstructured"],    impact: { a: 2, c: 0, l: 1 } },
  { id: "tool-selection",     name: "Tool selection strategy",         values: ["all-in-context", "top-k-retrieved", "hierarchical"],       impact: { a: 2, c: 2, l: 1 } },
  { id: "tool-description",   name: "Tool description verbosity",      values: ["terse", "standard", "rich-with-examples"],                 impact: { a: 2, c: 1, l: 0 } },
  { id: "tool-execution",     name: "Tool execution mode",             values: ["sequential", "parallel"],                                  impact: { a: 1, c: 0, l: 3 } },
  { id: "output-schema",      name: "Output schema enforcement",       values: ["free-form", "JSON-mode", "structured-generation"],         impact: { a: 2, c: 0, l: 0 } },
  { id: "retry-budget",       name: "Error retry budget",              values: [0, 1, 2, 3],                                                impact: { a: 2, c: 2, l: 2 } },
  { id: "context-management", name: "Long-context management",         values: ["truncate", "summarize", "RAG-windowed", "full-context"],   impact: { a: 3, c: 2, l: 1 } },
];

const COMMON_MODEL_KNOBS = [
  { id: "temperature",       name: "Temperature",                values: [0.0, 0.2, 0.5, 0.7, 1.0], impact: { a: 2, c: 0, l: 0 } },
  { id: "top-p",             name: "Top-p (nucleus)",            values: [0.9, 0.95, 1.0],          impact: { a: 1, c: 0, l: 0 } },
  { id: "max-tokens",        name: "Max output tokens",          values: [256, 512, 1024, 2048],    impact: { a: 1, c: 2, l: 1 } },
  { id: "frequency-penalty", name: "Frequency penalty",          values: [0.0, 0.3, 0.6, 1.0],      impact: { a: 1, c: 0, l: 0 } },
  { id: "stop-sequences",    name: "Stop sequences",             values: ["none", "task-specific"], impact: { a: 1, c: 1, l: 0 } },
];

// Specific knobs keyed by model id. Each model exposes 3–5 distinctive knobs
// that don't generalize to other providers (or whose semantics differ enough
// that lumping them in with the common knobs would be misleading).
const SPECIFIC_MODEL_KNOBS = {
  "gpt-5": [
    { id: "reasoning-effort",    name: "reasoning_effort",        values: ["low", "medium", "high"],                            impact: { a: 3, c: 3, l: 3 } },
    { id: "seed",                name: "Seed (reproducibility)",  values: ["none", "fixed"],                                    impact: { a: 0, c: 0, l: 0 } },
    { id: "response-format",     name: "response_format",         values: ["text", "json_object", "json_schema"],               impact: { a: 2, c: 0, l: 0 } },
    { id: "parallel-tool-calls", name: "parallel_tool_calls",     values: ["off", "on"],                                        impact: { a: 1, c: 0, l: 3 } },
  ],
  "gpt-4o": [
    { id: "seed",                  name: "Seed (reproducibility)",         values: ["none", "fixed"],                                    impact: { a: 0, c: 0, l: 0 } },
    { id: "system-placement",      name: "System prompt placement",        values: ["system-role", "user-prefix", "developer-role"],     impact: { a: 1, c: 0, l: 0 } },
    { id: "response-format",       name: "response_format",                values: ["text", "json_object", "json_schema"],               impact: { a: 2, c: 0, l: 0 } },
    { id: "parallel-tool-calls",   name: "parallel_tool_calls",            values: ["off", "on"],                                        impact: { a: 1, c: 0, l: 3 } },
    { id: "logprobs",              name: "Return logprobs",                values: ["off", "on"],                                        impact: { a: 0, c: 1, l: 0 } },
  ],
  "o3": [
    { id: "reasoning-effort", name: "reasoning_effort",       values: ["low", "medium", "high"],              impact: { a: 3, c: 3, l: 3 } },
    { id: "max-output",       name: "Max completion tokens",  values: [1024, 4096, 16384, 65536],             impact: { a: 1, c: 3, l: 3 } },
    { id: "response-format",  name: "response_format",        values: ["text", "json_object", "json_schema"], impact: { a: 2, c: 0, l: 0 } },
  ],
  "o4-mini": [
    { id: "reasoning-effort", name: "reasoning_effort",       values: ["low", "medium", "high"],              impact: { a: 3, c: 3, l: 3 } },
    { id: "max-output",       name: "Max completion tokens",  values: [1024, 4096, 16384],                    impact: { a: 1, c: 2, l: 2 } },
    { id: "response-format",  name: "response_format",        values: ["text", "json_object", "json_schema"], impact: { a: 2, c: 0, l: 0 } },
  ],
  "claude-opus-4.7": [
    { id: "thinking-budget", name: "Extended thinking budget", values: ["off", "1024", "4096", "16384", "32768"], impact: { a: 3, c: 3, l: 3 } },
    { id: "prompt-cache",    name: "System prompt cache",      values: ["off", "ephemeral"],                       impact: { a: 0, c: 3, l: 1 } },
    { id: "tool-choice",     name: "tool_choice",              values: ["auto", "any", "tool", "none"],            impact: { a: 2, c: 1, l: 0 } },
    { id: "top-k",           name: "top_k",                    values: [0, 10, 40, 100],                           impact: { a: 1, c: 0, l: 0 } },
  ],
  "claude-sonnet-4.6": [
    { id: "thinking-budget", name: "Extended thinking budget", values: ["off", "1024", "4096", "16384"], impact: { a: 3, c: 3, l: 3 } },
    { id: "prompt-cache",    name: "System prompt cache",      values: ["off", "ephemeral"],             impact: { a: 0, c: 3, l: 1 } },
    { id: "tool-choice",     name: "tool_choice",              values: ["auto", "any", "tool", "none"],  impact: { a: 2, c: 1, l: 0 } },
    { id: "top-k",           name: "top_k",                    values: [0, 10, 40, 100],                 impact: { a: 1, c: 0, l: 0 } },
  ],
  "claude-haiku-4.5": [
    { id: "prompt-cache", name: "System prompt cache", values: ["off", "ephemeral"],            impact: { a: 0, c: 3, l: 1 } },
    { id: "tool-choice",  name: "tool_choice",         values: ["auto", "any", "tool", "none"], impact: { a: 2, c: 1, l: 0 } },
    { id: "top-k",        name: "top_k",               values: [0, 10, 40, 100],                impact: { a: 1, c: 0, l: 0 } },
  ],
  "gpt-4o-mini": [
    { id: "seed",                name: "Seed (reproducibility)", values: ["none", "fixed"],                       impact: { a: 0, c: 0, l: 0 } },
    { id: "response-format",     name: "response_format",        values: ["text", "json_object", "json_schema"],  impact: { a: 2, c: 0, l: 0 } },
    { id: "parallel-tool-calls", name: "parallel_tool_calls",    values: ["off", "on"],                           impact: { a: 1, c: 0, l: 3 } },
  ],
  "claude-3.5-sonnet": [
    { id: "thinking-budget", name: "Extended thinking budget", values: ["off", "1024", "4096", "16384"],   impact: { a: 3, c: 3, l: 3 } },
    { id: "prompt-cache",    name: "System prompt cache",      values: ["off", "ephemeral"],               impact: { a: 0, c: 3, l: 1 } },
    { id: "tool-choice",     name: "tool_choice",              values: ["auto", "any", "tool", "none"],    impact: { a: 2, c: 1, l: 0 } },
    { id: "top-k",           name: "top_k",                    values: [0, 10, 40, 100],                   impact: { a: 1, c: 0, l: 0 } },
  ],
  "claude-3.5-haiku": [
    { id: "prompt-cache", name: "System prompt cache", values: ["off", "ephemeral"],            impact: { a: 0, c: 3, l: 1 } },
    { id: "tool-choice",  name: "tool_choice",         values: ["auto", "any", "tool", "none"], impact: { a: 2, c: 1, l: 0 } },
    { id: "top-k",        name: "top_k",               values: [0, 10, 40, 100],                impact: { a: 1, c: 0, l: 0 } },
  ],
  "gemini-1.5-pro": [
    { id: "safety",          name: "Safety threshold",   values: ["BLOCK_ONLY_HIGH", "BLOCK_MED_AND_ABOVE", "BLOCK_NONE"], impact: { a: 1, c: 0, l: 0 } },
    { id: "response-mime",   name: "Response MIME type", values: ["text/plain", "application/json"],                       impact: { a: 2, c: 0, l: 0 } },
    { id: "candidate-count", name: "candidate_count",    values: [1, 2, 4],                                                impact: { a: 2, c: 3, l: 1 } },
    { id: "code-execution",  name: "Code execution",     values: ["off", "on"],                                            impact: { a: 3, c: 2, l: 2 } },
  ],
  "gemini-1.5-flash": [
    { id: "safety",        name: "Safety threshold", values: ["BLOCK_ONLY_HIGH", "BLOCK_MED_AND_ABOVE"], impact: { a: 1, c: 0, l: 0 } },
    { id: "candidate-count", name: "candidate_count", values: [1, 2, 4],                                  impact: { a: 2, c: 3, l: 1 } },
    { id: "code-execution",  name: "Code execution",   values: ["off", "on"],                              impact: { a: 3, c: 2, l: 2 } },
  ],
  "llama-3.1-70b": [
    { id: "inference-provider", name: "Inference provider",     values: ["Fireworks", "Together", "Groq", "Replicate"], impact: { a: 0, c: 3, l: 3 } },
    { id: "quantization",       name: "Quantization",           values: ["fp16", "fp8", "int4"],                        impact: { a: 1, c: 2, l: 2 } },
    { id: "speculative",        name: "Speculative decoding",   values: ["off", "on"],                                  impact: { a: 0, c: 0, l: 2 } },
  ],
  "llama-3.1-8b": [
    { id: "inference-provider", name: "Inference provider", values: ["Fireworks", "Together", "Groq", "self-hosted"], impact: { a: 0, c: 2, l: 3 } },
    { id: "quantization",       name: "Quantization",       values: ["fp16", "fp8", "int4"],                          impact: { a: 1, c: 2, l: 2 } },
    { id: "speculative",        name: "Speculative decoding", values: ["off", "on"],                                  impact: { a: 0, c: 0, l: 2 } },
  ],
  "mistral-large": [
    { id: "response-format", name: "Response format", values: ["text", "json_object"],         impact: { a: 1, c: 0, l: 0 } },
    { id: "safe-prompt",     name: "Safe prompt",     values: ["off", "on"],                   impact: { a: 1, c: 0, l: 0 } },
    { id: "tool-choice",     name: "tool_choice",     values: ["auto", "any", "none"],         impact: { a: 2, c: 1, l: 0 } },
  ],
  "deepseek-v3": [
    { id: "cache",          name: "Context cache",       values: ["off", "on"],     impact: { a: 0, c: 2, l: 1 } },
    { id: "function-call",  name: "function_call",       values: ["off", "auto"],   impact: { a: 1, c: 0, l: 0 } },
    { id: "inference-provider", name: "Inference provider", values: ["DeepSeek", "Fireworks", "Together"], impact: { a: 0, c: 2, l: 3 } },
  ],
  // -- New open-weight models --
  "llama-3.1-405b": [
    { id: "inference-provider", name: "Inference provider",    values: ["Fireworks", "Together", "Replicate"], impact: { a: 0, c: 3, l: 3 } },
    { id: "quantization",       name: "Quantization",          values: ["fp16", "fp8", "int8"],                impact: { a: 1, c: 2, l: 2 } },
    { id: "batch-size",         name: "Inference batch size",  values: [1, 4, 16, 32],                          impact: { a: 0, c: 3, l: 2 } },
  ],
  "llama-3.3-70b": [
    { id: "inference-provider", name: "Inference provider",     values: ["Fireworks", "Together", "Groq", "Replicate"], impact: { a: 0, c: 3, l: 3 } },
    { id: "quantization",       name: "Quantization",           values: ["fp16", "fp8", "int4"],                        impact: { a: 1, c: 2, l: 2 } },
    { id: "speculative",        name: "Speculative decoding",   values: ["off", "on"],                                  impact: { a: 0, c: 0, l: 2 } },
  ],
  "mixtral-8x22b": [
    { id: "inference-provider", name: "Inference provider",   values: ["Fireworks", "Together", "Mistral", "self-hosted"], impact: { a: 0, c: 3, l: 3 } },
    { id: "quantization",       name: "Quantization",         values: ["fp16", "fp8", "int4"],                            impact: { a: 1, c: 2, l: 2 } },
    { id: "expert-routing",     name: "Expert routing",       values: ["top-2", "top-4"],                                 impact: { a: 2, c: 2, l: 1 } },
  ],
  "mistral-nemo-12b": [
    { id: "inference-provider", name: "Inference provider", values: ["Mistral", "self-hosted", "Together"], impact: { a: 0, c: 2, l: 3 } },
    { id: "quantization",       name: "Quantization",       values: ["fp16", "fp8", "int4"],                impact: { a: 1, c: 2, l: 2 } },
  ],
  "qwen-2.5-72b": [
    { id: "inference-provider", name: "Inference provider", values: ["Together", "Fireworks", "DashScope", "self-hosted"], impact: { a: 0, c: 3, l: 3 } },
    { id: "quantization",       name: "Quantization",       values: ["fp16", "fp8", "int4"],                                impact: { a: 1, c: 2, l: 2 } },
    { id: "response-format",    name: "Response format",    values: ["text", "json_object"],                                impact: { a: 1, c: 0, l: 0 } },
  ],
  "deepseek-r1": [
    { id: "thinking-tokens",    name: "Max thinking tokens",  values: [2048, 8192, 32768],          impact: { a: 3, c: 3, l: 3 } },
    { id: "inference-provider", name: "Inference provider",   values: ["DeepSeek", "Fireworks", "Together"], impact: { a: 0, c: 2, l: 3 } },
    { id: "show-reasoning",     name: "Show reasoning trace", values: ["off", "on"],                impact: { a: 0, c: 1, l: 0 } },
  ],
  "gemma-2-27b": [
    { id: "inference-provider", name: "Inference provider", values: ["Together", "Replicate", "self-hosted"], impact: { a: 0, c: 2, l: 3 } },
    { id: "quantization",       name: "Quantization",       values: ["fp16", "fp8", "int4"],                  impact: { a: 1, c: 2, l: 2 } },
    { id: "safety",             name: "Safety threshold",   values: ["strict", "balanced", "permissive"],     impact: { a: 1, c: 0, l: 0 } },
  ],
  "phi-4": [
    { id: "inference-provider", name: "Inference provider", values: ["Azure", "Together", "self-hosted"], impact: { a: 0, c: 2, l: 2 } },
    { id: "quantization",       name: "Quantization",       values: ["fp16", "fp8", "int4"],              impact: { a: 1, c: 2, l: 2 } },
  ],
  "command-r-plus": [
    { id: "connector-mode", name: "RAG connector mode", values: ["off", "web-search", "documents", "both"], impact: { a: 3, c: 2, l: 2 } },
    { id: "citation-mode",  name: "Citation mode",      values: ["off", "fast", "accurate"],                impact: { a: 1, c: 1, l: 1 } },
    { id: "safety-mode",    name: "Safety mode",        values: ["off", "contextual", "strict"],            impact: { a: 1, c: 0, l: 0 } },
  ],
};

// =============================================================================
// UI components
// =============================================================================

const METRIC_COLORS = {
  A: { bg: "bg-emerald-500/15", text: "text-emerald-300", border: "border-emerald-600/40" },
  C: { bg: "bg-rose-500/15",    text: "text-rose-300",    border: "border-rose-600/40" },
  L: { bg: "bg-amber-500/15",   text: "text-amber-300",   border: "border-amber-600/40" },
};

function ImpactPill({ metric, magnitude }) {
  if (magnitude <= 0) {
    return (
      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold border bg-slate-800/40 text-slate-600 border-slate-700/40">
        {metric}-
      </span>
    );
  }
  const c = METRIC_COLORS[metric];
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold border ${c.bg} ${c.text} ${c.border}`}
      style={{ opacity: 0.6 + 0.15 * magnitude }}
    >
      {metric}
      {"↑".repeat(magnitude)}
    </span>
  );
}

function ImpactBlock({ impact }) {
  return (
    <div className="flex gap-1 flex-shrink-0">
      <ImpactPill metric="A" magnitude={impact.a} />
      <ImpactPill metric="C" magnitude={impact.c} />
      <ImpactPill metric="L" magnitude={impact.l} />
    </div>
  );
}

function ValueChip({ value, active, onClick, tourId }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-tour={tourId}
      className={`px-2.5 py-1 text-xs font-mono rounded-md border transition-colors ${
        active
          ? "bg-blue-500/20 text-blue-200 border-blue-500/50"
          : "bg-slate-900/60 text-slate-400 border-slate-700/60 hover:border-slate-500 hover:text-slate-200"
      }`}
    >
      {String(value)}
    </button>
  );
}

function KnobRow({ knob, selectedValues, onToggleValue, onToggleEnabled, enabled, tourKey }) {
  return (
    <div
      data-tour={tourKey ? `knob-row-${tourKey}` : undefined}
      className={`rounded-xl border transition-colors ${
        enabled ? "bg-slate-900/60 border-slate-700" : "bg-slate-900/30 border-slate-800/60"
      } p-3 md:p-4`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <label className="flex items-start gap-3 cursor-pointer flex-1">
          <input
            type="checkbox"
            checked={enabled}
            onChange={onToggleEnabled}
            data-tour={tourKey ? `knob-toggle-${tourKey}` : undefined}
            className="mt-0.5 w-4 h-4 accent-blue-500 cursor-pointer"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-sm font-medium ${enabled ? "text-white" : "text-slate-400"}`}>
                {knob.name}
              </span>
              <ImpactBlock impact={knob.impact} />
            </div>
          </div>
        </label>
      </div>
      {enabled && (
        <div className="flex flex-wrap gap-1.5 mt-2 pl-7">
          {knob.values.map((v) => (
            <ValueChip
              key={String(v)}
              value={v}
              active={selectedValues.includes(v)}
              onClick={() => onToggleValue(v)}
              tourId={tourKey ? `value-${tourKey}-${String(v)}` : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Renders a sorted list of KnobRow controls for one knob catalog. Lifts the
// repeated mapping + value/enabled binding out of the page body so the three
// knob sections (agent / common / per-model specific) all use the same code.
function KnobList({ knobs, sortBy, knobValues, onToggleEnabled, onToggleValue, idFor = (k) => k.id }) {
  return (
    <div className="space-y-2.5">
      {sortKnobsByImpact(knobs, sortBy).map((k) => {
        const key = idFor(k);
        return (
          <KnobRow
            key={key}
            knob={k}
            enabled={!!knobValues[key]}
            selectedValues={knobValues[key] || []}
            onToggleEnabled={() => onToggleEnabled(key, k.values)}
            onToggleValue={(v) => onToggleValue(key, v)}
            tourKey={key}
          />
        );
      })}
    </div>
  );
}

function ModelCard({ model, selected, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      data-tour={`model-${model.id}`}
      className={`text-left p-3 rounded-xl border transition-colors ${
        selected
          ? "bg-blue-500/10 border-blue-500/50"
          : "bg-slate-900/60 border-slate-700/60 hover:border-slate-500"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="min-w-0">
          <div className={`text-sm font-semibold ${selected ? "text-white" : "text-slate-200"}`}>
            {model.name}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
              {model.provider}
            </span>
            {model.license === "open" && (
              <span className="text-[9px] font-mono uppercase tracking-wider px-1 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-600/30">
                open
              </span>
            )}
          </div>
        </div>
        <ImpactBlock impact={model.impact} />
      </div>
    </button>
  );
}

// Single segmented-control button. Colored when active, grey when not.
// Kept inline next to its siblings (in the `Rank knobs by` toggle row).
const SORT_TONES = {
  emerald: "bg-emerald-500/20 text-emerald-200",
  rose:    "bg-rose-500/20 text-rose-200",
  indigo:  "bg-indigo-500/20 text-indigo-200",
  amber:   "bg-amber-500/20 text-amber-200",
};
function SortButton({ value, current, onChange, tone, label }) {
  const active = value === current;
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
        active ? SORT_TONES[tone] : "text-slate-400 hover:text-slate-200"
      }`}
    >
      {label}
    </button>
  );
}

// Small pill rendering api/open license counts inside a vendor header.
// Full words ("api"/"open") at both sizes — abbreviations like "5A" / "1O"
// looked like "5A" and "10" respectively and confused users.
function LicenseBadges({ closedCount, openCount, size = "expanded" }) {
  const cls =
    size === "expanded"
      ? "text-[9px] px-1 py-0.5"
      : "text-[9px] px-1";
  return (
    <>
      {closedCount > 0 && (
        <span
          className={`${cls} font-mono tracking-wide rounded bg-slate-800/60 text-slate-400 border border-slate-700/40`}
        >
          {closedCount} api
        </span>
      )}
      {openCount > 0 && (
        <span
          className={`${cls} font-mono tracking-wide rounded bg-emerald-500/15 text-emerald-300 border border-emerald-600/30`}
        >
          {openCount} open
        </span>
      )}
    </>
  );
}

function VendorGroup({ vendor, models, selectedIds, onToggle, open, onToggleOpen }) {
  const total = models.length;
  const selected = models.filter((m) => selectedIds.includes(m.id)).length;
  const openCount = models.filter((m) => m.license === "open").length;
  const closedCount = total - openCount;

  return (
    <div className="border border-slate-800/80 rounded-xl overflow-hidden bg-slate-900/30 h-full">
      <button
        type="button"
        onClick={onToggleOpen}
        data-tour={`vendor-${vendor}`}
        className={`w-full px-2.5 py-2 hover:bg-slate-900/60 transition-colors text-left ${
          open ? "flex items-center justify-between" : "flex flex-col gap-1"
        }`}
      >
        {open ? (
          // Expanded header — wider, horizontal layout.
          <>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-white">{vendor}</span>
              <span className="text-xs font-mono text-slate-500">
                {selected} / {total}
              </span>
              <span className="flex gap-1.5">
                <LicenseBadges closedCount={closedCount} openCount={openCount} size="expanded" />
              </span>
            </div>
            <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0" />
          </>
        ) : (
          // Collapsed compact header — vertical, fits in a small grid cell.
          <>
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-semibold text-white truncate">{vendor}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-[10px] font-mono text-slate-500">
                {selected ? `${selected}/${total}` : `${total}`}
              </span>
              <LicenseBadges closedCount={closedCount} openCount={openCount} size="compact" />
            </div>
          </>
        )}
      </button>
      {open && (
        <div
          data-tour={`vendor-grid-${vendor}`}
          className="px-3 pb-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5"
        >
          {models.map((m) => (
            <ModelCard
              key={m.id}
              model={m}
              selected={selectedIds.includes(m.id)}
              onToggle={() => onToggle(m.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Section({ title, count, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="mb-6">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 mb-3 py-2 group"
      >
        <div className="flex items-center gap-3">
          <h2 className="text-xl md:text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">
            {title}
          </h2>
          {typeof count === "number" && (
            <span className="text-xs font-mono text-slate-500 px-2 py-0.5 rounded bg-slate-900/60 border border-slate-700/60">
              {count} selected
            </span>
          )}
        </div>
        {open ? (
          <ChevronUp className="w-5 h-5 text-slate-500 group-hover:text-slate-300" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-500 group-hover:text-slate-300" />
        )}
      </button>
      {open && children}
    </section>
  );
}

// =============================================================================
// Page
// =============================================================================

// Returns a fresh copy of `knobs` sorted descending by impact on the given
// metric. Supported values:
//   "a"  → accuracy impact only
//   "c"  → cost impact only
//   "l"  → latency impact only
//   "ac" → accuracy + cost combined (simple sum, so knobs that hit BOTH
//          dials rise to the top; a knob with no effect on either drops out)
// Ties resolved by name for stability.
function sortKnobsByImpact(knobs, metric) {
  const score = (k) =>
    metric === "ac" ? (k.impact.a || 0) + (k.impact.c || 0) : (k.impact[metric] || 0);
  return [...knobs].sort((x, y) => {
    const d = score(y) - score(x);
    return d !== 0 ? d : x.name.localeCompare(y.name);
  });
}

export default function KnobExplorer() {
  // Persist selections + sort preference across reloads / tabs so the user
  // can leave the page and come back to the same configuration.
  const [selectedModels, setSelectedModels] = useSharedSetting(
    "traigent_knob_explorer_models",
    [],
  );
  // knobValues maps knob-id (or `${modelId}.${knobId}` for specific) → array of selected values.
  // Presence in the map (with at least one value) = "enabled".
  const [knobValues, setKnobValues] = useSharedSetting(
    "traigent_knob_explorer_knob_values",
    {},
  );
  // Which impact metric to rank knobs by. Doesn't affect the Models section.
  const [sortBy, setSortBy] = useSharedSetting("traigent_knob_explorer_sort_by", "a");
  // Bidirectional link with the TTM + ROI calculators.
  const [, applySearchSpace] = useCustomSearchSpace();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cameFrom = searchParams.get("from"); // "ttm" | "roi" | null
  // /story uses ?guided=BIRD&chrome=hidden to embed this page as Act 2.
  // ?final=1 (with guided=BIRD) skips the tour and renders the FINAL state
  // immediately — used by the "End Act 2" jump button on /story.
  const guided = searchParams.get("guided");
  const chromeHidden = searchParams.get("chrome") === "hidden";
  const showFinal = searchParams.get("final") === "1";
  useRemoveChatWidget();

  // Set of vendor names currently expanded in the Models section. Lifted here
  // so the grid wrapper can apply col-span-full to expanded cells. Default
  // matches BIRD final state when ?guided=BIRD&final=1 so the model section
  // opens already expanded.
  const [expandedVendors, setExpandedVendors] = useState(
    guided === "BIRD" && showFinal
      ? new Set(["OpenAI", "Anthropic", "Google", "Meta"])
      : new Set()
  );

  // Always open with a CLEAN slate (nothing selected, counter = 1) unless the
  // user arrived from TTM/ROI for an explicit configure-then-return flow, OR
  // we're in ?guided=BIRD&final=1 mode where we pre-fill the final BIRD
  // configuration directly so the counter shows 58,320 without running the
  // tour.
  useEffect(() => {
    if (cameFrom) return; // configure-then-return flow — preserve state
    if (guided === "BIRD" && showFinal) {
      setSelectedModels([
        "gpt-4o",
        "gpt-4o-mini",
        "claude-3.5-sonnet",
        "claude-3.5-haiku",
        "gemini-1.5-flash",
        "llama-3.1-70b",
      ]);
      // 8 knobs at full default values → 5×4×3×3×3×3×3×2 = 9,720 × 6 = 58,320.
      setKnobValues({
        "few-shot-k":         [0, 1, 3, 5, 10],
        "example-selection":  ["random", "BM25", "dense-embedding", "task-aware"],
        "cot":                ["off", "brief", "extended"],
        "self-consistency":   [1, 3, 5],
        "self-correction":    [0, 1, 2],
        "decomposition":      ["single-shot", "plan-then-execute", "iterative"],
        "reflection":         ["off", "post-step", "end-of-task"],
        "tool-execution":     ["sequential", "parallel"],
      });
      return;
    }
    setSelectedModels([]);
    setKnobValues({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleVendor(vendor) {
    setExpandedVendors((prev) => {
      const next = new Set(prev);
      if (next.has(vendor)) next.delete(vendor);
      else next.add(vendor);
      return next;
    });
  }

  function toggleModel(modelId) {
    setSelectedModels((prev) =>
      prev.includes(modelId) ? prev.filter((m) => m !== modelId) : [...prev, modelId]
    );
    // Don't auto-prune specific-model knobs on deselect — let them stick around
    // so the user can re-pick the model without losing their value choices.
  }

  function toggleKnobEnabled(key, defaultValues) {
    setKnobValues((prev) => {
      if (prev[key]) {
        const { [key]: _gone, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: [...defaultValues] };
    });
  }

  function toggleKnobValue(key, value) {
    setKnobValues((prev) => {
      const current = prev[key] || [];
      if (current.includes(value)) {
        return { ...prev, [key]: current.filter((v) => v !== value) };
      }
      return { ...prev, [key]: [...current, value] };
    });
  }

  const total = useMemo(() => {
    const factor = (vals) => Math.max(1, vals?.length || 0);
    let product = factor(selectedModels);
    for (const knob of AGENT_KNOBS) {
      if (knobValues[knob.id]) product *= factor(knobValues[knob.id]);
    }
    for (const knob of COMMON_MODEL_KNOBS) {
      if (knobValues[knob.id]) product *= factor(knobValues[knob.id]);
    }
    for (const modelId of selectedModels) {
      for (const knob of SPECIFIC_MODEL_KNOBS[modelId] || []) {
        const k = `${modelId}.${knob.id}`;
        if (knobValues[k]) product *= factor(knobValues[k]);
      }
    }
    return product;
  }, [selectedModels, knobValues]);

  const enabledAgentCount = AGENT_KNOBS.filter((k) => knobValues[k.id]).length;
  const enabledCommonCount = COMMON_MODEL_KNOBS.filter((k) => knobValues[k.id]).length;
  const enabledSpecificCount = selectedModels.reduce((sum, m) => {
    return sum + (SPECIFIC_MODEL_KNOBS[m] || []).filter((k) => knobValues[`${m}.${k.id}`]).length;
  }, 0);

  return (
    <>
      <Helmet>
        <title>Knob Explorer · Traigent</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <ChatKillerStyle />
      <GuidedTour active={guided === "BIRD" && !showFinal} steps={BIRD_TOUR_STEPS} />

      <section className="bg-[#080808] text-white min-h-screen py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {!chromeHidden && (
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to traigent.ai
              </Link>
            )}

            {/* Return banner — when arriving from /ttm or /roi via "Configure
                custom search space", offer one-click return that also writes
                the current combinatorics to the shared setting so the calc
                picks it up. */}
            {cameFrom && (
              <button
                type="button"
                onClick={() => {
                  applySearchSpace(total);
                  navigate(`/${cameFrom}`);
                }}
                className="w-full mb-5 flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/40 text-blue-200 hover:bg-blue-500/20 transition-colors text-left"
              >
                <span className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Return to{" "}
                  <span className="font-semibold uppercase">{cameFrom}</span>{" "}
                  calculator with this search space
                </span>
                <span className="font-mono text-xs text-blue-300">
                  {total.toLocaleString()} configs →
                </span>
              </button>
            )}

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-mono tracking-wider mb-3 text-[#4D8EF8]">
              <Sparkles className="w-3.5 h-3.5" />
              KNOB EXPLORER
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight">
              Configure your optimization search space
            </h1>
            <p className="text-base md:text-lg text-slate-400 mb-5 max-w-3xl leading-relaxed">
              Pick models. Pick knobs. Pick values. Watch the combinatorics blow
              up. Color-coded <span className="text-emerald-300 font-mono">A</span>{" "}
              <span className="text-rose-300 font-mono">C</span>{" "}
              <span className="text-amber-300 font-mono">L</span> pills tell you how each
              knob affects Accuracy, Cost, and Latency.
            </p>

            {/* Legend */}
            <div
              data-tour="legend"
              className="mb-6 bg-slate-900/40 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-400 flex flex-wrap items-center gap-3 leading-relaxed"
            >
              <span className="font-mono uppercase tracking-wider text-slate-500">Legend:</span>
              <span className="inline-flex items-center gap-1.5">
                <ImpactPill metric="A" magnitude={3} />
                <span>high accuracy impact</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ImpactPill metric="C" magnitude={3} />
                <span>high cost impact</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ImpactPill metric="L" magnitude={3} />
                <span>high latency impact</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ImpactPill metric="A" magnitude={0} />
                <span>no effect</span>
              </span>
              <span className="text-slate-600 hidden sm:inline">·</span>
              <span className="text-slate-500">
                magnitude: <span className="font-mono text-slate-400">↑ low</span> ·{" "}
                <span className="font-mono text-slate-400">↑↑ medium</span> ·{" "}
                <span className="font-mono text-slate-400">↑↑↑ high</span>
              </span>
            </div>

            {/* Combinatorics counter */}
            <div className="sticky top-2 z-40 mb-10">
              <div
                data-tour="counter"
                className="bg-slate-900/95 backdrop-blur border border-slate-700 rounded-2xl px-5 py-4 shadow-xl"
              >
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">
                      Total possible configurations
                    </div>
                    <div className="text-3xl md:text-5xl font-bold text-white font-mono tabular-nums">
                      {total.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap text-xs">
                    <span className="px-2 py-1 rounded bg-slate-800/60 border border-slate-700 text-slate-300">
                      {selectedModels.length} models
                    </span>
                    <span className="px-2 py-1 rounded bg-slate-800/60 border border-slate-700 text-slate-300">
                      {enabledAgentCount} agent knobs
                    </span>
                    <span className="px-2 py-1 rounded bg-slate-800/60 border border-slate-700 text-slate-300">
                      {enabledCommonCount} common knobs
                    </span>
                    <span className="px-2 py-1 rounded bg-slate-800/60 border border-slate-700 text-slate-300">
                      {enabledSpecificCount} model-specific
                    </span>
                  </div>
                </div>

                {/* Apply buttons — write the current combinatorics to the shared
                    setting (TTM + ROI both pick it up automatically) and jump
                    to the chosen calculator. */}
                <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mr-1">
                    Apply to →
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      applySearchSpace(total);
                      navigate("/ttm");
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/15 text-blue-200 border border-blue-500/40 hover:bg-blue-500/25 transition-colors text-xs font-medium"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    TTM calculator
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      applySearchSpace(total);
                      navigate("/roi");
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/15 text-blue-200 border border-blue-500/40 hover:bg-blue-500/25 transition-colors text-xs font-medium"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    ROI calculator
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] text-slate-500">
                    (updates both; opens only the one clicked)
                  </span>
                </div>
              </div>
            </div>

            {/* Sort-by toggle — affects knob ranking, NOT the Models section. */}
            <div data-tour="sort-toggle" className="mb-6 flex items-center gap-3 flex-wrap">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
                Rank knobs by:
              </span>
              <div className="inline-flex rounded-lg bg-slate-900/60 border border-slate-700 p-0.5">
                <SortButton value="a"  current={sortBy} onChange={setSortBy} tone="emerald" label="Accuracy impact ↓" />
                <SortButton value="c"  current={sortBy} onChange={setSortBy} tone="rose"    label="Cost impact ↓" />
                <SortButton value="ac" current={sortBy} onChange={setSortBy} tone="indigo"  label="Accuracy + Cost ↓" />
                <SortButton value="l"  current={sortBy} onChange={setSortBy} tone="amber"   label="Latency impact ↓" />
              </div>
              <span className="text-[10px] text-slate-500">
                (highest first; Models section is unaffected)
              </span>
            </div>

            {/* Models — vendors render as a compact grid; click one to expand */}
            <Section title="Models" count={selectedModels.length}>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {VENDOR_ORDER.map((vendor) => {
                  const models = MODELS.filter((m) => m.provider === vendor);
                  if (!models.length) return null;
                  const open = expandedVendors.has(vendor);
                  return (
                    <div key={vendor} className={open ? "col-span-full" : ""}>
                      <VendorGroup
                        vendor={vendor}
                        models={models}
                        selectedIds={selectedModels}
                        onToggle={toggleModel}
                        open={open}
                        onToggleOpen={() => toggleVendor(vendor)}
                      />
                    </div>
                  );
                })}
              </div>
            </Section>

            {/* Agent knobs */}
            <Section title="Agent knobs" count={enabledAgentCount}>
              <KnobList
                knobs={AGENT_KNOBS}
                sortBy={sortBy}
                knobValues={knobValues}
                onToggleEnabled={toggleKnobEnabled}
                onToggleValue={toggleKnobValue}
              />
            </Section>

            {/* Common model knobs */}
            <Section title="Common model knobs" count={enabledCommonCount}>
              <KnobList
                knobs={COMMON_MODEL_KNOBS}
                sortBy={sortBy}
                knobValues={knobValues}
                onToggleEnabled={toggleKnobEnabled}
                onToggleValue={toggleKnobValue}
              />
            </Section>

            {/* Specific model knobs */}
            <Section title="Specific model knobs" count={enabledSpecificCount}>
              {selectedModels.length === 0 ? (
                <div className="text-sm text-slate-500 italic bg-slate-900/30 border border-slate-800/60 rounded-xl p-4">
                  Pick at least one model above to reveal its model-specific knobs.
                </div>
              ) : (
                <div className="space-y-5">
                  {selectedModels.map((mid) => {
                    const model = MODELS.find((m) => m.id === mid);
                    const knobs = SPECIFIC_MODEL_KNOBS[mid] || [];
                    if (!knobs.length) {
                      return (
                        <div
                          key={mid}
                          className="text-xs text-slate-500 italic bg-slate-900/30 border border-slate-800/60 rounded-xl p-3"
                        >
                          <span className="text-slate-300 font-semibold">{model?.name}</span> has
                          no model-specific knobs in v1.
                        </div>
                      );
                    }
                    return (
                      <div key={mid}>
                        <div className="flex items-baseline gap-2 mb-2">
                          <h3 className="text-sm font-semibold text-slate-200">{model?.name}</h3>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                            {model?.provider}
                          </span>
                        </div>
                        <KnobList
                          knobs={knobs}
                          sortBy={sortBy}
                          knobValues={knobValues}
                          onToggleEnabled={toggleKnobEnabled}
                          onToggleValue={toggleKnobValue}
                          idFor={(k) => `${mid}.${k.id}`}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </Section>

          </motion.div>
        </div>
      </section>
    </>
  );
}
