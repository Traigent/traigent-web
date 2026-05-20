import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Zap, Layers, FileText, SlidersHorizontal } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { trackEvent } from "../lib/analytics";
import { useSharedSetting } from "../lib/useSharedSetting";
import CalculatorTopBar from "../components/CalculatorTopBar";

const BLUE = "#1A6BF5";
const BLUE_LIGHT = "#4D8EF8";
const AMBER = "#f59e0b";          // "your engineering parameters" accent

// Time the engineer actually spends per config test (setup + run + score + decide + log).
// This is the headline lever — slider lets the user own it.
const MIN_PER_CONFIG_DEFAULT = 30;

// Default fully-loaded engineer hourly rate. Maps to a ~$250k total-comp
// US mid-tier senior ML engineer. User can adjust via slider.
const DEFAULT_HOURLY_RATE = 100;

function formatUSD(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

// What Traigent costs the engineer in hours, regardless of search size:
//   ~1 hr to wrap the agent + define KPIs
//   ~1 hr to review the converged optimum and ship it
const TRAIGENT_ENGINEER_HOURS = 1;

const FTE_HOURS_PER_WEEK = 40;

function formatHours(h) {
  if (h < 1) return `${Math.round(h * 60)} min`;
  const rounded = Math.round(h);
  if (h < 100) return `${rounded} ${rounded === 1 ? "hr" : "hrs"}`;
  return `${rounded.toLocaleString()} hrs`;
}

function formatWeeks(weeks) {
  if (weeks < 0.25) return "under a day";
  if (weeks < 1) return `${Math.round(weeks * 5)} days`;
  if (weeks < 12) return `${weeks.toFixed(1)} weeks`;
  return `${(weeks / 4.33).toFixed(1)} months`;
}

function Card({ children, accent = BLUE }) {
  return (
    <div className="bg-slate-900/60 border rounded-2xl p-6 md:p-8 h-full flex flex-col" style={{ borderColor: `${accent}66` }}>
      {children}
    </div>
  );
}

function SliderRow({ icon: Icon, label, value, valuePrefix = "", suffix, min, max, step, onChange, minLabel, maxLabel, examples, accent = BLUE }) {
  return (
    <Card accent={accent}>
      <div className="flex items-start gap-2 text-xs font-mono uppercase tracking-wider mb-3 min-h-[2.5rem]" style={{ color: accent === BLUE ? "#94a3b8" : accent }}>
        <Icon className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
        <span>{label}</span>
      </div>
      <div className="flex items-baseline gap-2 mb-4 min-h-[3.5rem]">
        <span className="text-4xl md:text-5xl font-bold text-white">{valuePrefix}{value}</span>
        {suffix && <span className="text-slate-500 text-sm">{suffix}</span>}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        style={{ accentColor: accent }}
      />
      <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
      {examples && (
        <div
          className="mt-auto pt-3 border-t border-slate-800/80 text-xs text-slate-400 font-mono leading-snug min-h-[4.5rem]"
          title={examples}
        >
          <span className="text-slate-500 uppercase tracking-wider text-[10px] mr-2">e.g.</span>
          {examples}
        </div>
      )}
    </Card>
  );
}

// ----- Example value generators per dimension --------------------------------
// These produce illustrative values so the prospect sees what "5 temperatures"
// or "4 top_p variants" actually looks like in practice.

function temperatureExamples(n) {
  if (n <= 1) return ["0.7"];
  const out = [];
  for (let i = 0; i < n; i++) {
    out.push((i / (n - 1)).toFixed(2));
  }
  return out;
}

function retrievalKExamples(n) {
  // Typical retrieval-k values tested in RAG pipelines.
  const ladder = [1, 3, 5, 8, 10, 15, 20, 30];
  return ladder.slice(0, n).map(String);
}

function maxTokensExamples(n) {
  // Doubling sequence starting at 256
  const out = [];
  let v = 256;
  for (let i = 0; i < n; i++) {
    out.push(v.toLocaleString());
    v *= 2;
  }
  return out;
}

function modelExamples(n) {
  const candidates = [
    "gpt-4o", "gpt-4o-mini", "claude-3.5-sonnet", "claude-3.5-haiku",
    "gemini-2.0-flash", "gemini-1.5-pro", "o1-mini", "deepseek-r1",
    "llama-3.3-70b", "mistral-large", "command-r-plus", "qwen-2.5-72b",
  ];
  return candidates.slice(0, n);
}

function promptExamples(n) {
  const candidates = [
    "system-v1 (terse)", "system-v2 (verbose)", "system-v3 (chain-of-thought)",
    "system-v4 (role-play)", "system-v5 (few-shot)", "system-v6 (structured)",
    "system-v7 (concise)", "system-v8 (analytical)", "system-v9 (creative)",
    "system-v10 (formal)", "system-v11 (technical)", "system-v12 (casual)",
  ];
  return candidates.slice(0, n);
}

// All the OTHER dimensions a real production agent has — covered by the
// catch-all slider so the user can multiply the search space by however
// much extra knob-space their setup actually has.
const OTHER_DIMENSIONS = [
  "chunk size", "chunk overlap", "embedding model",
  "reranker choice", "query-rewrite strategy", "hybrid-search weights",
  "few-shot example count", "output format (JSON / text / structured)",
  "tool-selection strategy", "max tool-call iterations",
  "frequency penalty", "presence penalty", "top_p", "stop sequences",
  "retry policy", "timeout", "fallback model", "cache policy",
  "streaming behavior", "validation / repair logic",
];

function otherDimensionsExamples() {
  // Always show the full list — it's the whole point of this slider:
  // a reminder of how many additional dimensions a real agent has.
  return OTHER_DIMENSIONS;
}

export default function TTMCalculator() {
  const [models, setModels] = useState(6);
  const [prompts, setPrompts] = useState(3);
  const [temperatures, setTemperatures] = useState(5);
  const [retrievalK, setRetrievalK] = useState(4);
  const [maxTokensVariants, setMaxTokensVariants] = useState(2);
  const [otherDims, setOtherDims] = useState(1);
  const [minPerConfig, setMinPerConfig] = useState(MIN_PER_CONFIG_DEFAULT);
  // Shared across TTM + ROI calculators via localStorage.
  const [hourlyRate, setHourlyRate] = useSharedSetting("traigent_hourly_rate", DEFAULT_HOURLY_RATE);
  // We publish TTM's computed per-pass manual engineer hours so the ROI
  // calculator can derive its monthly engineering savings from the same math.
  // eslint-disable-next-line no-unused-vars
  const [_manualPerPass, setManualPerPass] = useSharedSetting("traigent_manual_hours_per_pass", 72);
  // Real teams don't exhaust the search space — they settle after testing a small
  // fraction. This slider lets the user reflect that reality and surfaces the
  // confidence they're sacrificing in return.
  const [manualCoveragePct, setManualCoveragePct] = useState(20);

  function resetToDefaults() {
    setModels(6);
    setPrompts(3);
    setTemperatures(5);
    setRetrievalK(4);
    setMaxTokensVariants(2);
    setOtherDims(1);
    setMinPerConfig(MIN_PER_CONFIG_DEFAULT);
    setHourlyRate(DEFAULT_HOURLY_RATE);
    setManualCoveragePct(20);
    trackEvent("ttm_reset_clicked");
  }

  const r = useMemo(() => {
    const totalConfigs = models * prompts * temperatures * retrievalK * maxTokensVariants * otherDims;
    const manualConfigsTested = Math.max(1, Math.round(totalConfigs * manualCoveragePct / 100));
    const manualEngineerHours = (manualConfigsTested * minPerConfig) / 60;
    const manualFteWeeks = manualEngineerHours / FTE_HOURS_PER_WEEK;
    // Full-sweep scenario: what it'd cost to test EVERY config in the search space.
    // This is what teams "should" do to have full confidence — but never do.
    const manualFullSweepHours = (totalConfigs * minPerConfig) / 60;
    const manualFullSweepWeeks = manualFullSweepHours / FTE_HOURS_PER_WEEK;
    const traigentHours = TRAIGENT_ENGINEER_HOURS;
    const traigentFteWeeks = traigentHours / FTE_HOURS_PER_WEEK;
    const hoursSaved = manualEngineerHours - traigentHours;
    const weeksSaved = manualFteWeeks - traigentFteWeeks;
    const fullSweepHoursSaved = manualFullSweepHours - traigentHours;
    const fullSweepWeeksSaved = manualFullSweepWeeks - traigentFteWeeks;
    const confidenceSacrificedPct = 100 - manualCoveragePct;
    // Dollarize the engineer time using the user-set hourly rate.
    const manualCostUSD = manualEngineerHours * hourlyRate;
    const manualFullSweepCostUSD = manualFullSweepHours * hourlyRate;
    const traigentCostUSD = traigentHours * hourlyRate;
    const dollarsSaved = manualCostUSD - traigentCostUSD;
    const fullSweepDollarsSaved = manualFullSweepCostUSD - traigentCostUSD;
    return {
      totalConfigs,
      manualConfigsTested,
      manualEngineerHours,
      manualFteWeeks,
      manualFullSweepHours,
      manualFullSweepWeeks,
      traigentHours,
      traigentFteWeeks,
      hoursSaved,
      weeksSaved,
      fullSweepHoursSaved,
      fullSweepWeeksSaved,
      confidenceSacrificedPct,
      manualCostUSD,
      manualFullSweepCostUSD,
      traigentCostUSD,
      dollarsSaved,
      fullSweepDollarsSaved,
    };
  }, [models, prompts, temperatures, retrievalK, maxTokensVariants, otherDims, minPerConfig, manualCoveragePct, hourlyRate]);

  // Republish the per-pass manual hours whenever it changes — ROI Calculator
  // listens on this key for its engineering-hours derivation.
  useEffect(() => {
    setManualPerPass(r.manualEngineerHours);
  }, [r.manualEngineerHours, setManualPerPass]);

  return (
    <>
      <Helmet>
        <title>Time-to-Market Calculator · Traigent</title>
        <meta
          name="description"
          content="Manual config testing takes hundreds of engineer-hours. Traigent converges in ~1. See how many FTE weeks of engineering time you save per optimization pass."
        />
        <meta property="og:title" content="Traigent Time-to-Market Calculator" />
        <meta
          property="og:description"
          content="See how many engineer-weeks Traigent saves you per optimization pass — and how much earlier you ship."
        />
      </Helmet>

      <section className="bg-[#080808] text-white min-h-screen py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculatorTopBar onReset={resetToDefaults} />

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 md:mb-16"
          >
            <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-mono tracking-wider mb-4" style={{ color: BLUE }}>
              TIME-TO-MARKET CALCULATOR
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              How many weeks of <span style={{ color: BLUE }}>Agent tuning and optimization</span> does Traigent save you?
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
              Manual testing of the configuration space would take <span className="text-white font-semibold">hundreds of engineer-hours per optimization pass</span>. Traigent needs <span className="text-[#4D8EF8] font-semibold">~1 hour of engineer time to set up</span> — the rest runs unattended for a few hours, depending on the search space size.
            </p>
            <div className="text-base md:text-lg text-slate-200 font-medium max-w-2xl mx-auto mt-4 space-y-1">
              <div>
                <a
                  href="#dimension-sliders"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("dimension-sliders")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="inline-flex items-center gap-1 hover:text-[#4D8EF8] transition-colors"
                >
                  Set the size of your search space.
                  <span className="text-[#4D8EF8]" aria-hidden="true">↓</span>
                </a>
              </div>
              <div>
                <a
                  href="#engineering-parameters"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("engineering-parameters")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="inline-flex items-center gap-1 hover:text-amber-400 transition-colors"
                >
                  Set your engineering parameter assumptions.
                  <span style={{ color: AMBER }} aria-hidden="true">↓</span>
                </a>
              </div>
              <div className="pt-1">
                <span className="font-semibold" style={{ color: BLUE_LIGHT }}>See how many FTE weeks of engineering time you reclaim.</span>
              </div>
            </div>
          </motion.div>

          {/* Configs computed — ON TOP so the headline number is the first thing the eye lands on */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mb-3"
          >
            <div className="flex flex-col items-center gap-4 px-8 md:px-10 py-10 md:py-12 bg-slate-900/60 border-2 border-slate-500 rounded-2xl">
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                <div className="text-sm md:text-base font-mono font-bold uppercase tracking-widest text-slate-300 leading-tight text-right">
                  <div>Configurations</div>
                  <div>to explore</div>
                </div>
                <span className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white tracking-tight">{r.totalConfigs.toLocaleString()}</span>
                <span className="text-sm md:text-base text-slate-300 font-mono font-semibold">= {models} × {prompts} × {temperatures} × {retrievalK} × {maxTokensVariants} × {otherDims}</span>
              </div>
              <a
                href="#dimension-sliders"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("dimension-sliders")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="inline-flex items-center gap-1.5 text-base md:text-lg font-medium text-slate-400 hover:text-[#4D8EF8] transition-colors"
              >
                See and set details below
                <span aria-hidden="true">↓</span>
              </a>
            </div>
          </motion.div>

          {/* Headline result — moved up so it lives right under the configs total */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.09 }}
            className="bg-gradient-to-br from-blue-500/10 to-slate-900/0 border-2 rounded-2xl p-8 md:p-10 text-center mb-6 mt-4"
            style={{ borderColor: BLUE }}
          >
            <div className="text-sm font-mono uppercase tracking-wider text-slate-400 mb-2">
              Engineering FTE weeks saved
            </div>
            <div className="flex items-baseline justify-center gap-4 flex-wrap mb-3">
              <div className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight" style={{ color: BLUE }}>
                <span className="text-base md:text-lg text-white font-medium align-middle mr-2">up to</span>
                {formatWeeks(r.fullSweepWeeksSaved)}
              </div>
              <div className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight" style={{ color: AMBER }}>
                ≈ {formatUSD(r.fullSweepDollarsSaved)}
              </div>
            </div>
            <p className="text-slate-400 text-base md:text-lg max-w-3xl mx-auto">
              <span className="text-white font-semibold">{formatHours(r.manualFullSweepHours)}</span> ({formatUSD(r.manualFullSweepCostUSD)}) to test the full {r.totalConfigs.toLocaleString()}-config space
              <span className="text-slate-600"> − </span>
              <span className="text-white font-semibold">~{formatHours(r.traigentHours)}</span> ({formatUSD(r.traigentCostUSD)}) with Traigent
              <span className="text-slate-600"> = </span>
              <span className="text-[#4D8EF8] font-bold">{formatHours(r.fullSweepHoursSaved)}</span> / <span className="font-bold" style={{ color: AMBER }}>{formatUSD(r.fullSweepDollarsSaved)}</span> reclaimed
            </p>
            <div className="mt-8 pt-6 border-t border-slate-800/80 max-w-3xl mx-auto">
              <p className="text-base md:text-lg text-slate-300 leading-relaxed mb-4" style={{ textWrap: "balance" }}>
                In reality, teams may stop at <span className="text-white font-semibold">{manualCoveragePct}% coverage</span> and ship <span className="text-red-300 font-semibold">without confidence</span> — sacrificing <span className="text-red-300 font-semibold">{r.confidenceSacrificedPct}%</span> of the search space.
              </p>
              <p className="text-xl md:text-2xl font-bold leading-tight" style={{ textWrap: "balance" }}>
                So, Traigent saves{" "}
                <span className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight whitespace-nowrap" style={{ color: BLUE }}>{formatWeeks(r.weeksSaved)}</span>
                {" "}
                <span className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight whitespace-nowrap" style={{ color: AMBER }}>≈ {formatUSD(r.dollarsSaved)}</span>
              </p>
              <p className="text-xl md:text-2xl font-bold leading-tight mt-2" style={{ textWrap: "balance" }}>
                But increases your confidence to <span style={{ color: BLUE }}>100%</span>
              </p>
            </div>
          </motion.div>

          {/* Note: real config spaces have many more dimensions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center mb-12"
          >
            <p className="text-xs md:text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
              The sliders below reflect <span className="text-slate-300">the most common choices</span>, but many other selection dimensions exist — to keep things simple, we've embodied them all in <span className="text-slate-300">"Other tunable options"</span>.{" "}
              <Link
                to="/blog/the-business-case"
                className="text-[#4D8EF8] hover:text-[#1A6BF5] underline underline-offset-2 transition-colors"
              >
                See the full inventory and cost ratios →
              </Link>
            </p>
          </motion.div>

          {/* Section header: Search space dimensions */}
          <motion.div
            id="dimension-sliders"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.13 }}
            className="flex items-center gap-3 mb-4 scroll-mt-20"
          >
            <span className="text-xs font-mono uppercase tracking-widest text-[#4D8EF8] font-bold">
              Search-space dimensions
            </span>
            <div className="flex-1 h-px bg-slate-800" />
          </motion.div>

          {/* Inputs — search-space sliders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.14 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
          >
            <SliderRow
              icon={Layers}
              label="Models to evaluate"
              value={models}
              suffix="models"
              min={2}
              max={10}
              step={1}
              onChange={setModels}
              minLabel="2"
              maxLabel="10"
              examples={modelExamples(models).join(", ")}
            />
            <SliderRow
              icon={FileText}
              label="Prompt variants"
              value={prompts}
              suffix="variants"
              min={1}
              max={10}
              step={1}
              onChange={setPrompts}
              minLabel="1"
              maxLabel="10"
              examples={promptExamples(prompts).join(", ")}
            />
            <SliderRow
              icon={SlidersHorizontal}
              label="Temperature values"
              value={temperatures}
              suffix="settings"
              min={1}
              max={10}
              step={1}
              onChange={setTemperatures}
              minLabel="1"
              maxLabel="10"
              examples={temperatureExamples(temperatures).join(", ")}
            />
            <SliderRow
              icon={SlidersHorizontal}
              label="Retrieval k values"
              value={retrievalK}
              suffix="settings"
              min={1}
              max={8}
              step={1}
              onChange={setRetrievalK}
              minLabel="1"
              maxLabel="8"
              examples={retrievalKExamples(retrievalK).join(", ")}
            />
            <SliderRow
              icon={SlidersHorizontal}
              label="max_tokens values"
              value={maxTokensVariants}
              suffix="settings"
              min={1}
              max={6}
              step={1}
              onChange={setMaxTokensVariants}
              minLabel="1"
              maxLabel="6"
              examples={maxTokensExamples(maxTokensVariants).join(", ")}
            />
            <SliderRow
              icon={SlidersHorizontal}
              label="Other tunable options"
              value={otherDims}
              suffix="options ×"
              min={1}
              max={100}
              step={1}
              onChange={setOtherDims}
              minLabel="1"
              maxLabel="100"
              examples={otherDimensionsExamples().join(", ")}
            />
          </motion.div>

          {/* Section header: Your engineering parameters */}
          <motion.div
            id="engineering-parameters"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="flex items-center gap-3 mb-4 scroll-mt-20"
          >
            <span className="text-xs font-mono uppercase tracking-widest font-bold" style={{ color: AMBER }}>
              Your engineering parameters
            </span>
            <div className="flex-1 h-px bg-slate-800" />
          </motion.div>

          {/* Inputs — engineering parameter sliders (your-team variables) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            <SliderRow
              icon={Clock}
              label="Engineer time per config test"
              value={minPerConfig}
              suffix="min (setup + run + score + decide)"
              min={15}
              max={120}
              step={5}
              onChange={setMinPerConfig}
              minLabel="15 min"
              maxLabel="2 hrs"
              examples={`${minPerConfig} min × ${r.totalConfigs.toLocaleString()} configs ≈ ${Math.round((minPerConfig * r.totalConfigs) / 60).toLocaleString()} hrs to sweep the full space.`}
              accent={AMBER}
            />
            <SliderRow
              icon={Clock}
              label="Manual coverage you'd settle for"
              value={manualCoveragePct}
              suffix="% of the space tested manually"
              min={1}
              max={100}
              step={1}
              onChange={setManualCoveragePct}
              minLabel="1%"
              maxLabel="100%"
              examples={`${r.manualConfigsTested.toLocaleString()} of ${r.totalConfigs.toLocaleString()} configs tested · ${r.confidenceSacrificedPct}% confidence sacrificed`}
              accent={AMBER}
            />
            <SliderRow
              icon={Clock}
              label="Engineer hourly rate (fully-loaded)"
              value={hourlyRate}
              valuePrefix="$"
              suffix="per hour"
              min={50}
              max={400}
              step={5}
              onChange={setHourlyRate}
              minLabel="$50"
              maxLabel="$400"
              examples={`Default $${DEFAULT_HOURLY_RATE}/hr ≈ $200k/yr ÷ 2,000 hrs. Synced with ROI Calc.`}
              accent={AMBER}
            />
          </motion.div>

          {/* What this means callout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8 mb-12"
          >
            <div className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-3">What this really means</div>
            <p className="text-base md:text-lg text-slate-200 leading-relaxed mb-3">
              Real teams settle for testing <span className="text-white font-semibold">~{manualCoveragePct}%</span> of the space ({r.manualConfigsTested.toLocaleString()} of {r.totalConfigs.toLocaleString()} configs) and ship the best they found — sacrificing <span className="text-red-300 font-semibold">{r.confidenceSacrificedPct}% confidence</span> that they actually picked the optimum.
            </p>
            <p className="text-base md:text-lg text-slate-200 leading-relaxed">
              Traigent collapses that <span className="text-white font-semibold">{formatWeeks(r.manualFteWeeks)}</span> of FTE work into <span className="text-[#4D8EF8] font-semibold">1 hour of setup</span> and a few hours of <span className="text-[#4D8EF8] font-semibold">automated background run</span> — and converges on the real optimum, not just the best of the few that got tested.
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-8 md:p-10 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Want to see this on your specific agent?
            </h2>
            <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
              The Free POC carries zero investment. Wrap one agent, define one KPI, let the optimizer run overnight, and see what it finds.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://meetings-eu1.hubspot.com/amir8"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("demo_booking_clicked", {
                  location: "ttm_calculator",
                  configs: r.totalConfigs,
                  hours_saved: Math.round(r.hoursSaved),
                  weeks_saved: Math.round(r.weeksSaved * 10) / 10,
                })}
                className="inline-flex items-center gap-2 bg-[#1A6BF5] hover:bg-[#4D8EF8] text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Book a 15-min call <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                to="/roi"
                className="inline-flex items-center gap-2 border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                See the cost ROI calculator
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
