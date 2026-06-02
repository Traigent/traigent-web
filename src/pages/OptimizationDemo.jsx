// /demo — live optimization demo (the 5-scene video material from the PRD).
//
// One self-contained page that plays five scenes in sequence:
//   Scene 1: weights snap to A=1 / C=0 / L=0 (find peak accuracy)
//   Scene 2: knob-space catalog with the ~9.3M combinations headline
//   Scene 3: Excel-style table populates row-by-row to a gold-highlighted peak
//   Scene 4: weights animate to A=0.5 / C=0.5 / L=0 + accuracy floor pinned
//   Scene 5: table re-populates with multiple green-highlighted feasible configs
//
// Data is scripted, not live. Each trial row is deterministically generated
// from a (model, knob) tuple so the recording is reproducible. The same shape
// will accept real BIRD-run data later — just swap the data source.
//
// Reachable via the hidden ▸ menu in TopNav.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowLeft, Pause, Play, RotateCcw, Sparkles } from "lucide-react";

// =============================================================================
// Models — v1 set per the PRD (§16.1). Each carries base accuracy + cost so
// trial-row generation feels like a real run.
// =============================================================================

// baseAcc: realistic baseline execution accuracy on BIRD-dev with simple
// prompting. Real public-leaderboard data lives in the 40–68% range for the
// dev set; SOTA is ~75% with heavily-tuned agent pipelines. Our Phase-1
// peak in this demo lands around 72%, which matches what an optimized run
// could plausibly achieve.
//
// avgCostCents: average per-question cost in cents on BIRD-dev with a typical
// schema prompt (~3k input tokens, ~120 output tokens), using public per-token
// pricing as of 2025. Multipliers in computeCost() compound on top.
const MODELS = [
  { id: "gpt-4o",            name: "GPT-4o",         provider: "OpenAI",    baseAcc: 60, avgCostCents: 1.40 },
  { id: "gpt-4o-mini",       name: "GPT-4o mini",    provider: "OpenAI",    baseAcc: 50, avgCostCents: 0.08 },
  { id: "claude-3.5-sonnet", name: "Claude Sonnet",  provider: "Anthropic", baseAcc: 66, avgCostCents: 1.80 },
  { id: "claude-3.5-haiku",  name: "Claude Haiku",   provider: "Anthropic", baseAcc: 53, avgCostCents: 0.35 },
  { id: "gemini-1.5-flash",  name: "Gemini Flash",   provider: "Google",    baseAcc: 45, avgCostCents: 0.06 },
  { id: "llama-3.1-70b",     name: "Llama 70B",      provider: "Meta",      baseAcc: 55, avgCostCents: 0.10 },
];

const MODEL_COLORS = {
  OpenAI:    "bg-emerald-500/20 text-emerald-200 border-emerald-600/40",
  Anthropic: "bg-orange-500/20 text-orange-200 border-orange-600/40",
  Google:    "bg-sky-500/20 text-sky-200 border-sky-600/40",
  Meta:      "bg-indigo-500/20 text-indigo-200 border-indigo-600/40",
};

// =============================================================================
// Knob axes — same shape as the BIRD demo agent. Values are integer indexes
// into these lists so the trial table renders compactly.
// =============================================================================

const KNOB_AXES = {
  kShot:        { label: "k",       values: [0, 1, 3, 5, 10] },
  cot:          { label: "CoT",     values: ["off", "brief", "extended"] },
  selfConsist:  { label: "SC",      values: [1, 3, 5] },
  selfCorrect:  { label: "Correct", values: [0, 1, 2] },
  schemaPrune:  { label: "Prune",   values: ["full", "two-step"] },
  exampleSel:   { label: "Sel",     values: ["random", "BM25", "dense"] },
  hints:        { label: "Hints",   values: ["off", "on"] },
};

// Theoretical knob-space size shown in Scene 2. Pulled from the PRD §6.4.
const THEORETICAL_COMBINATIONS = 9_300_000;

// =============================================================================
// Trial-row generation — believable accuracy / cost per (model, knob) tuple.
// The numbers are deterministic given the same inputs so the demo recording
// is reproducible.
// =============================================================================

// Deterministic noise via a simple mulberry32 PRNG seeded by row index.
function rng(seed) {
  let t = seed + 0x6D2B79F5;
  return function () {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function computeAccuracy(model, knobs, noiseSeed) {
  let acc = model.baseAcc;
  // k-shot examples: +0.5 per shot, diminishing returns above 5
  const k = knobs.kShot;
  acc += k <= 5 ? k * 0.6 : 3 + (k - 5) * 0.25;
  // Example-selection: smart selectors add more
  if (knobs.exampleSel === "BM25") acc += 1.2;
  if (knobs.exampleSel === "dense") acc += 1.8;
  // CoT
  if (knobs.cot === "brief") acc += 2.5;
  if (knobs.cot === "extended") acc += 3.8;
  // Self-consistency
  if (knobs.selfConsist === 3) acc += 1.8;
  if (knobs.selfConsist === 5) acc += 2.5;
  // Self-correction
  acc += knobs.selfCorrect * 1.5;
  // Schema two-step
  if (knobs.schemaPrune === "two-step") acc += 1.2;
  // BIRD evidence hints — biggest single-knob lift on this benchmark
  if (knobs.hints === "on") acc += 3.0;
  // Deterministic noise
  const r = rng(noiseSeed)();
  acc += (r - 0.5) * 1.6;
  return Math.max(28, Math.min(75, acc));
}

// Returns average cost per question in CENTS, given a (model, knobs) tuple.
function computeCost(model, knobs) {
  let mult = 1;
  // More examples = more input tokens
  mult *= 1 + knobs.kShot * 0.15;
  // CoT extended doubles output tokens
  if (knobs.cot === "brief") mult *= 1.3;
  if (knobs.cot === "extended") mult *= 2.0;
  // Self-consistency multiplies cost ~linearly
  mult *= knobs.selfConsist;
  // Self-correction adds another pass per loop
  mult *= 1 + knobs.selfCorrect * 0.8;
  // Two-step schema doubles up the linker call
  if (knobs.schemaPrune === "two-step") mult *= 1.4;
  // Hints add a small token cost
  if (knobs.hints === "on") mult *= 1.05;
  return model.avgCostCents * mult;
}

// Format an average per-question cost (in cents) for display.
function formatCents(c) {
  if (c < 0.1)  return `${c.toFixed(3)}¢`;
  if (c < 10)   return `${c.toFixed(2)}¢`;
  return `${c.toFixed(1)}¢`;
}

// Pick a knob tuple with bias toward certain options. `bias` is keyed by knob
// name and contains the preferred index/value with higher probability.
function pickKnobs(prng, bias = {}) {
  function choose(axisKey, weights) {
    const vals = KNOB_AXES[axisKey].values;
    if (!weights) return vals[Math.floor(prng() * vals.length)];
    const total = weights.reduce((s, w) => s + w, 0);
    let r = prng() * total;
    for (let i = 0; i < weights.length; i++) {
      r -= weights[i];
      if (r <= 0) return vals[i];
    }
    return vals[vals.length - 1];
  }
  return {
    kShot:       choose("kShot",       bias.kShot       || [1, 1, 1, 1, 1]),
    cot:         choose("cot",         bias.cot         || [1, 1, 1]),
    selfConsist: choose("selfConsist", bias.selfConsist || [1, 1, 1]),
    selfCorrect: choose("selfCorrect", bias.selfCorrect || [1, 1, 1]),
    schemaPrune: choose("schemaPrune", bias.schemaPrune || [1, 1]),
    exampleSel:  choose("exampleSel",  bias.exampleSel  || [1, 1, 1]),
    hints:       choose("hints",       bias.hints       || [1, 1]),
  };
}

// Build Phase 1 trials: an optimizer that gradually finds higher-accuracy
// configurations. We bias early trials uniform, later trials toward the
// known peak (Claude Sonnet + k=5/10 + extended CoT + SC=3).
function buildPhase1Trials(count = 80) {
  const trials = [];
  const prng = rng(7);
  for (let i = 0; i < count; i++) {
    // First 1/3 random; remaining biased toward better configs.
    const earlyPhase = i < Math.floor(count / 3);
    let model;
    if (earlyPhase) {
      model = MODELS[Math.floor(prng() * MODELS.length)];
    } else {
      // Bias toward Sonnet and GPT-4o for the later trials.
      const r = prng();
      if (r < 0.45) model = MODELS[2]; // Claude Sonnet
      else if (r < 0.7) model = MODELS[0]; // GPT-4o
      else model = MODELS[Math.floor(prng() * MODELS.length)];
    }
    const knobs = earlyPhase
      ? pickKnobs(prng)
      : pickKnobs(prng, {
          kShot:       [1, 1, 2, 4, 4],
          cot:         [1, 2, 5],
          selfConsist: [1, 4, 3],
          schemaPrune: [1, 4],
          exampleSel:  [1, 2, 5],
          hints:       [1, 4],
        });
    const accuracy = computeAccuracy(model, knobs, i + 1);
    const cost = computeCost(model, knobs);
    trials.push({ id: i + 1, model, knobs, accuracy, cost });
  }
  // Make sure the LAST trial is a clear winner ~72% — matches plausible
  // Phase-1 peak on BIRD-dev with a heavily-tuned Sonnet pipeline.
  const winnerModel = MODELS[2]; // Claude Sonnet
  const winnerKnobs = {
    kShot: 5, cot: "extended", selfConsist: 3, selfCorrect: 1,
    schemaPrune: "two-step", exampleSel: "dense", hints: "on",
  };
  trials.push({
    id: count + 1,
    model: winnerModel,
    knobs: winnerKnobs,
    accuracy: 72.0,
    cost: computeCost(winnerModel, winnerKnobs),
    isPhase1Winner: true,
  });
  return trials;
}

// Build Phase 2 trials: search for cheaper configs that match accuracy ≥ floor.
// Show a wide spread of feasible configurations across model families.
function buildPhase2Trials(count = 60, accuracyFloor = 68) {
  const trials = [];
  const prng = rng(42);
  // Seed with a hand-picked set of "feasible cheaper" configs spread across
  // model families. The rest are exploration trials around them. Floor at
  // 68% mirrors Phase-1 peak (72%) − 4pt slack.
  const seeds = [
    // Haiku + smart prompting
    { model: MODELS[3], knobs: { kShot: 5,  cot: "brief",    selfConsist: 1, selfCorrect: 1, schemaPrune: "two-step", exampleSel: "dense", hints: "on" }, accuracy: 68.7 },
    // Gemini Flash + few-shot heavy
    { model: MODELS[4], knobs: { kShot: 10, cot: "extended", selfConsist: 1, selfCorrect: 0, schemaPrune: "two-step", exampleSel: "BM25",  hints: "on" }, accuracy: 69.2 },
    // GPT-4o mini + decomposition
    { model: MODELS[1], knobs: { kShot: 5,  cot: "brief",    selfConsist: 1, selfCorrect: 1, schemaPrune: "two-step", exampleSel: "dense", hints: "on" }, accuracy: 68.9 },
    // Llama 70B + tuned
    { model: MODELS[5], knobs: { kShot: 5,  cot: "extended", selfConsist: 1, selfCorrect: 1, schemaPrune: "two-step", exampleSel: "dense", hints: "on" }, accuracy: 68.4 },
    // Haiku alternate
    { model: MODELS[3], knobs: { kShot: 3,  cot: "extended", selfConsist: 1, selfCorrect: 0, schemaPrune: "two-step", exampleSel: "dense", hints: "on" }, accuracy: 69.6 },
  ];
  // Generate exploration trials around / between the seeds.
  for (let i = 0; i < count - seeds.length; i++) {
    // Bias toward cheaper models more often in Phase 2.
    const r = prng();
    let model;
    if (r < 0.3) model = MODELS[3]; // Haiku
    else if (r < 0.55) model = MODELS[4]; // Gemini Flash
    else if (r < 0.75) model = MODELS[1]; // GPT-4o mini
    else if (r < 0.9) model = MODELS[5]; // Llama 70B
    else model = MODELS[Math.floor(prng() * MODELS.length)];
    const knobs = pickKnobs(prng, {
      kShot:       [1, 2, 3, 4, 3],
      cot:         [2, 4, 4],
      selfConsist: [5, 2, 1],
      selfCorrect: [3, 3, 1],
      schemaPrune: [1, 4],
      exampleSel:  [1, 3, 4],
      hints:       [1, 5],
    });
    const accuracy = computeAccuracy(model, knobs, i + 100);
    const cost = computeCost(model, knobs);
    trials.push({ id: i + 1, model, knobs, accuracy, cost });
  }
  // Mix in the seeded feasible configs at known offsets so users see them
  // appear during the run rather than all at once at the end.
  for (let i = 0; i < seeds.length; i++) {
    const seed = seeds[i];
    const cost = computeCost(seed.model, seed.knobs);
    const insertAt = 10 + i * 10;
    trials.splice(insertAt, 0, {
      id: -1, // re-numbered below
      model: seed.model,
      knobs: seed.knobs,
      accuracy: seed.accuracy,
      cost,
    });
  }
  // Re-number after splicing + tag feasibility.
  trials.forEach((t, i) => {
    t.id = i + 1;
    t.feasible = t.accuracy >= accuracyFloor;
  });
  return trials;
}

// =============================================================================
// Sub-components
// =============================================================================

function WeightSlider({ label, value, color }) {
  return (
    <div className="flex flex-col items-center gap-1 w-full">
      <span className="text-xs font-mono uppercase tracking-widest text-slate-500">
        {label}
      </span>
      <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className={`absolute inset-y-0 left-0 ${color}`}
          initial={false}
          animate={{ width: `${value * 100}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>
      <motion.span
        className="text-2xl font-bold text-white font-mono tabular-nums"
        initial={false}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 0.4 }}
        key={value}
      >
        {value.toFixed(1)}
      </motion.span>
    </div>
  );
}

function KnobValuePill({ value }) {
  return (
    <span className="inline-block px-1.5 py-0.5 mx-0.5 text-[10px] font-mono rounded bg-slate-800/70 text-slate-300 border border-slate-700/60">
      {String(value)}
    </span>
  );
}

function TrialRow({ trial, isPhase2, accuracyFloor }) {
  const isWinner = trial.isPhase1Winner;
  const isFeasible = isPhase2 && trial.feasible;
  const modelColor = MODEL_COLORS[trial.model.provider] || "bg-slate-800/60 text-slate-200";

  let rowClass = "transition-colors";
  if (isWinner) rowClass += " bg-yellow-500/10 border-yellow-500/60 border-l-4";
  else if (isFeasible) rowClass += " bg-emerald-500/10 border-emerald-500/40 border-l-4";
  else rowClass += " border-l-4 border-transparent";

  return (
    <motion.tr
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={rowClass}
    >
      <td className="px-2 py-1 text-xs font-mono text-slate-400 text-right tabular-nums">
        {trial.id}
      </td>
      <td className="px-2 py-1">
        <span className={`inline-block px-1.5 py-0.5 text-[10px] font-mono rounded border ${modelColor}`}>
          {trial.model.name}
        </span>
      </td>
      <td className="px-2 py-1 text-xs text-slate-400 text-center tabular-nums">{trial.knobs.kShot}</td>
      <td className="px-2 py-1 text-xs text-slate-400 text-center">{trial.knobs.cot}</td>
      <td className="px-2 py-1 text-xs text-slate-400 text-center tabular-nums">{trial.knobs.selfConsist}</td>
      <td className="px-2 py-1 text-xs text-slate-400 text-center tabular-nums">{trial.knobs.selfCorrect}</td>
      <td className="px-2 py-1 text-xs text-slate-400 text-center">{trial.knobs.exampleSel}</td>
      <td className="px-2 py-1 text-xs text-slate-400 text-center">{trial.knobs.schemaPrune === "two-step" ? "2-step" : "full"}</td>
      <td className="px-2 py-1 text-xs text-slate-400 text-center">{trial.knobs.hints}</td>
      <td className={`px-2 py-1 text-xs font-mono font-semibold text-right tabular-nums ${
        isWinner ? "text-yellow-300" : isFeasible ? "text-emerald-300" : "text-slate-200"
      }`}>
        {trial.accuracy.toFixed(1)}%
      </td>
      <td className="px-2 py-1 text-xs font-mono text-right tabular-nums text-slate-300">
        {formatCents(trial.cost)}
      </td>
      {isWinner && (
        <td className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-yellow-300 whitespace-nowrap">
          Phase-1 winner
        </td>
      )}
      {!isWinner && isFeasible && (
        <td className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-emerald-300 whitespace-nowrap">
          Feasible
        </td>
      )}
      {!isWinner && !isFeasible && <td className="px-2 py-1"></td>}
    </motion.tr>
  );
}

function TrialTable({ visibleTrials, isPhase2, accuracyFloor, sortByCost }) {
  // For Phase 2 we sort by cost ascending; for Phase 1 by accuracy descending.
  const sorted = useMemo(() => {
    const rows = [...visibleTrials];
    if (sortByCost) rows.sort((a, b) => a.cost - b.cost);
    else rows.sort((a, b) => b.accuracy - a.accuracy);
    return rows;
  }, [visibleTrials, sortByCost]);
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40 max-h-[520px] overflow-y-auto">
      <table className="w-full min-w-[800px]">
        <thead className="sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <tr className="border-b border-slate-800">
            {["#", "Model", "k", "CoT", "SC", "Correct", "Sel", "Schema", "Hints", "Accuracy", "Avg cost / Q", ""].map((h) => (
              <th key={h} className="px-2 py-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 text-left">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((t) => (
            <TrialRow key={t.id} trial={t} isPhase2={isPhase2} accuracyFloor={accuracyFloor} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SceneHeader({ scene, title, subtitle }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <span className="inline-block px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-200 border border-blue-500/40 text-xs font-mono uppercase tracking-widest">
          Scene {scene}
        </span>
        {subtitle && <span className="text-xs font-mono uppercase tracking-widest text-slate-500">{subtitle}</span>}
      </div>
      <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight">{title}</h2>
    </div>
  );
}

function WeightsPanel({ a, c, l, accuracyFloor, runLabel }) {
  return (
    <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <span className="text-xs font-mono uppercase tracking-widest text-blue-300">
          {runLabel}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-6 mb-4">
        <WeightSlider label="Accuracy" value={a} color="bg-emerald-500" />
        <WeightSlider label="Cost"     value={c} color="bg-rose-500" />
        <WeightSlider label="Latency"  value={l} color="bg-amber-500" />
      </div>
      {accuracyFloor != null && (
        <div className="text-center mt-6 pt-4 border-t border-slate-700">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-500 mr-2">
            Accuracy floor
          </span>
          <span className="text-xl font-bold text-white font-mono">≥ {accuracyFloor}%</span>
        </div>
      )}
    </div>
  );
}

function KnobCatalog() {
  const knobEntries = Object.entries(KNOB_AXES);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4">
        <div className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-3">
          Models · 6
        </div>
        <div className="space-y-1.5">
          {MODELS.map((m) => (
            <div key={m.id} className="flex items-center justify-between text-sm">
              <span className="text-slate-200">{m.name}</span>
              <span className="text-xs font-mono text-slate-500">{m.provider}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4">
        <div className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-3">
          Knobs · {knobEntries.length}
        </div>
        <div className="space-y-2">
          {knobEntries.map(([key, axis]) => (
            <div key={key}>
              <div className="text-sm text-slate-200 mb-1">{axis.label}</div>
              <div className="flex flex-wrap">
                {axis.values.map((v) => (
                  <KnobValuePill key={String(v)} value={v} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="md:col-span-2 text-center bg-slate-900/60 border border-blue-500/40 rounded-xl py-6">
        <div className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-2">
          Total possible configurations
        </div>
        <div className="text-5xl md:text-6xl font-bold text-white font-mono tabular-nums">
          {THEORETICAL_COMBINATIONS.toLocaleString()}
        </div>
        <div className="text-sm text-slate-400 mt-2">
          We don't sweep them all. We don't need to.
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Main page
// =============================================================================

// Scenes and their target durations (at 1× speed, ms).
const SCENES = [
  { id: 1, durationMs: 7000  },  // Set Run #1 weights
  { id: 2, durationMs: 16000 },  // Knob catalog
  { id: 3, durationMs: 30000 },  // Phase-1 trials roll in
  { id: 4, durationMs: 7000  },  // Set Run #2 weights
  { id: 5, durationMs: 32000 },  // Phase-2 trials roll in + winner card
];

const SPEED_OPTIONS = [
  { label: "1×",  multiplier: 1 },
  { label: "2×",  multiplier: 2 },
  { label: "4×",  multiplier: 4 },
];

export default function OptimizationDemo() {
  const phase1Trials = useMemo(() => buildPhase1Trials(80), []);
  const phase2Trials = useMemo(() => buildPhase2Trials(50, 68), []);

  const [scene, setScene] = useState(0);          // 0 = idle / not started
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(2);
  const [phase1Visible, setPhase1Visible] = useState(0);
  const [phase2Visible, setPhase2Visible] = useState(0);
  const sceneStartedAtRef = useRef(null);
  const timerRef = useRef(null);

  const reset = useCallback(() => {
    setScene(0);
    setIsPlaying(false);
    setPhase1Visible(0);
    setPhase2Visible(0);
    sceneStartedAtRef.current = null;
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const start = useCallback(() => {
    reset();
    setScene(1);
    setIsPlaying(true);
  }, [reset]);

  const togglePause = useCallback(() => setIsPlaying((p) => !p), []);

  // Scene-advance timer.
  useEffect(() => {
    if (!isPlaying || scene === 0 || scene > SCENES.length) return;
    const def = SCENES[scene - 1];
    const duration = def.durationMs / speedMultiplier;
    timerRef.current = setTimeout(() => {
      setScene((s) => (s < SCENES.length ? s + 1 : s));
    }, duration);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [scene, isPlaying, speedMultiplier]);

  // Phase-1 trial reveal during Scene 3.
  useEffect(() => {
    if (!isPlaying || scene !== 3) return;
    const interval = (SCENES[2].durationMs / phase1Trials.length) / speedMultiplier;
    const tick = setInterval(() => {
      setPhase1Visible((n) => (n < phase1Trials.length ? n + 1 : n));
    }, interval);
    return () => clearInterval(tick);
  }, [scene, isPlaying, speedMultiplier, phase1Trials.length]);

  // Phase-2 trial reveal during Scene 5.
  useEffect(() => {
    if (!isPlaying || scene !== 5) return;
    const interval = (SCENES[4].durationMs / phase2Trials.length) / speedMultiplier;
    const tick = setInterval(() => {
      setPhase2Visible((n) => (n < phase2Trials.length ? n + 1 : n));
    }, interval);
    return () => clearInterval(tick);
  }, [scene, isPlaying, speedMultiplier, phase2Trials.length]);

  const phase1Winner = phase1Trials.find((t) => t.isPhase1Winner);
  const phase2Best = useMemo(() => {
    const visible = phase2Trials.slice(0, phase2Visible).filter((t) => t.feasible);
    if (!visible.length) return null;
    return visible.reduce((best, t) => (t.cost < best.cost ? t : best), visible[0]);
  }, [phase2Trials, phase2Visible]);

  return (
    <>
      <Helmet>
        <title>Live Optimization Demo · Traigent</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <section className="bg-[#080808] text-white min-h-screen py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to traigent.ai
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-mono tracking-wider mb-3 text-[#4D8EF8]">
            <Sparkles className="w-3.5 h-3.5" />
            LIVE OPTIMIZATION DEMO
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            Same accuracy. 10× lower cost. Eight minutes.
          </h1>
          <p className="text-base md:text-lg text-slate-400 mb-3 max-w-3xl leading-relaxed">
            Watch the optimizer find the accuracy ceiling, then find the same
            accuracy at a fraction of the cost — across different models and
            knob combinations. Scripted playback against the BIRD text-to-SQL
            benchmark.
          </p>
          <p className="text-xs text-slate-500 mb-8 max-w-3xl">
            Accuracy = execution match on a 200-question BIRD-dev subset.
            Cost = average per-question cost at 2025 public API prices.
            Numbers calibrated to realistic Text-to-SQL agent performance
            (BIRD-dev SOTA ≈ 75%; Phase-1 peak in this demo ≈ 72%).
          </p>

          {/* Playback controls */}
          <div className="sticky top-2 z-40 mb-8">
            <div className="bg-slate-900/95 backdrop-blur border border-slate-700 rounded-2xl px-5 py-3 flex items-center gap-3 flex-wrap shadow-xl">
              {scene === 0 ? (
                <button
                  type="button"
                  onClick={start}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-100 border border-blue-500/50 hover:bg-blue-500/30 transition-colors font-medium"
                >
                  <Play className="w-4 h-4" />
                  Start demo
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={togglePause}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/80 text-slate-100 border border-slate-700 hover:bg-slate-800 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isPlaying ? "Pause" : "Resume"}
                  </button>
                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/80 text-slate-100 border border-slate-700 hover:bg-slate-800 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Restart
                  </button>
                </>
              )}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Speed</span>
                {SPEED_OPTIONS.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setSpeedMultiplier(opt.multiplier)}
                    className={`px-2 py-1 text-xs font-mono rounded transition-colors ${
                      speedMultiplier === opt.multiplier
                        ? "bg-blue-500/30 text-blue-100"
                        : "bg-slate-800/60 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 ml-2">
                Scene {scene || "—"} / 5
              </span>
            </div>
          </div>

          {/* Idle screen */}
          {scene === 0 && (
            <div className="text-center py-16 border border-dashed border-slate-700 rounded-2xl bg-slate-900/20">
              <Play className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">Hit <strong>Start demo</strong> to play the five-scene sequence.</p>
              <p className="text-xs text-slate-500 mt-2">
                Recommended speed: <strong>1×</strong> for sales calls · <strong>4×</strong> for screen recording.
              </p>
            </div>
          )}

          {/* Scene 1 — Run #1 weights */}
          {scene === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <SceneHeader scene={1} title="Find the accuracy ceiling" subtitle="Run #1 · Phase 1" />
              <WeightsPanel a={1.0} c={0.0} l={0.0} runLabel="Run #1 — Find the accuracy ceiling" />
              <p className="text-center text-slate-400 mt-6 italic">
                "Step one. Find out how accurate this agent can be — ignore cost."
              </p>
            </motion.div>
          )}

          {/* Scene 2 — Knob catalog */}
          {scene === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <SceneHeader scene={2} title="Six models. Twelve knobs. Nine million configurations." subtitle="Search space" />
              <KnobCatalog />
              <p className="text-center text-slate-400 mt-6 italic">
                "Most teams pick a handful by hand. Watch what we do."
              </p>
            </motion.div>
          )}

          {/* Scene 3 — Phase 1 trials live */}
          {scene === 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <SceneHeader scene={3} title="Run #1 — searching for peak accuracy" subtitle="Phase 1 · live" />
              <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
                <div className="text-sm font-mono text-slate-400">
                  Evaluated:{" "}
                  <span className="text-white font-semibold tabular-nums">{phase1Visible}</span>{" "}
                  / 9,300,000 · ({((phase1Visible / THEORETICAL_COMBINATIONS) * 100).toFixed(4)}% of space)
                </div>
                <div className="text-sm font-mono text-slate-400">
                  Best accuracy so far:{" "}
                  <span className="text-emerald-300 font-semibold tabular-nums">
                    {phase1Visible > 0
                      ? Math.max(...phase1Trials.slice(0, phase1Visible).map((t) => t.accuracy)).toFixed(1)
                      : "—"}
                    %
                  </span>
                </div>
              </div>
              <TrialTable visibleTrials={phase1Trials.slice(0, phase1Visible)} isPhase2={false} />
            </motion.div>
          )}

          {/* Scene 4 — Run #2 weights */}
          {scene === 4 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <SceneHeader scene={4} title="Keep the accuracy. Cut the cost." subtitle="Run #2 · Phase 2" />
              <WeightsPanel a={0.5} c={0.5} l={0.0} accuracyFloor={68} runLabel="Run #2 — Cut the cost at parity" />
              <p className="text-center text-slate-400 mt-6 italic">
                "Step two. Lock in that accuracy. Now find the cheapest way to get there."
              </p>
            </motion.div>
          )}

          {/* Scene 5 — Phase 2 trials + winner card */}
          {scene === 5 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <SceneHeader scene={5} title="Same accuracy. 10× lower cost. Many ways to get there." subtitle="Phase 2 · live" />
              <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
                <div className="text-sm font-mono text-slate-400">
                  Evaluated:{" "}
                  <span className="text-white font-semibold tabular-nums">{phase2Visible}</span>{" "}
                  · feasible:{" "}
                  <span className="text-emerald-300 font-semibold tabular-nums">
                    {phase2Trials.slice(0, phase2Visible).filter((t) => t.feasible).length}
                  </span>
                </div>
                <div className="text-sm font-mono text-slate-400">
                  Cheapest feasible:{" "}
                  <span className="text-emerald-300 font-semibold tabular-nums">
                    {phase2Best ? formatCents(phase2Best.cost) : "—"}
                  </span>
                </div>
              </div>
              <TrialTable visibleTrials={phase2Trials.slice(0, phase2Visible)} accuracyFloor={68} isPhase2 sortByCost />

              {/* Phase-2 winner side-by-side card */}
              {phase2Best && phase2Visible >= phase2Trials.length - 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="bg-yellow-500/10 border border-yellow-500/40 rounded-2xl p-5">
                    <div className="text-xs font-mono uppercase tracking-widest text-yellow-300 mb-2">
                      Phase-1 winner
                    </div>
                    <div className="text-3xl md:text-4xl font-extrabold text-white tabular-nums">
                      {phase1Winner?.accuracy.toFixed(1)}%
                    </div>
                    <div className="text-sm text-slate-300 mt-1">{phase1Winner?.model.name} · {phase1Winner ? formatCents(phase1Winner.cost) : "—"} / Q</div>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-2xl p-5">
                    <div className="text-xs font-mono uppercase tracking-widest text-emerald-300 mb-2">
                      Phase-2 winner
                    </div>
                    <div className="text-3xl md:text-4xl font-extrabold text-white tabular-nums">
                      {phase2Best.accuracy.toFixed(1)}%
                    </div>
                    <div className="text-sm text-slate-300 mt-1">{phase2Best.model.name} · {formatCents(phase2Best.cost)} / Q</div>
                    <div className="text-xs font-mono uppercase tracking-widest text-emerald-300 mt-3">
                      {(phase1Winner ? (phase1Winner.cost / phase2Best.cost) : 1).toFixed(1)}× cheaper · same accuracy band
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* End-of-demo */}
          {scene > SCENES.length && (
            <div className="text-center py-16 border border-dashed border-emerald-500/40 rounded-2xl bg-emerald-500/5 mt-8">
              <div className="text-3xl font-bold text-white mb-2">Demo complete.</div>
              <p className="text-slate-400">Use the Restart button above to play it again.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
