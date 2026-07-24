import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronRight,
  GaugeCircle,
  DatabaseZap,
  FlaskConical,
  GitBranch,
  Pause,
  Play,
  Radar,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";
import { trackEvent } from "../lib/analytics";

const stages = [
  {
    id: "diagnose",
    eyebrow: "Stage 01 · Baseline diagnosis",
    title: "The agent looks good—until the quality gate examines the evidence.",
    summary:
      "A single aggregate score hid three separate problems: weak coverage, an unreliable judge, and an architecture that spends too much on easy requests while failing hard ones.",
    scores: { dataset: 42, evaluator: 51, agent: 63, trust: 38 },
    findings: [
      { type: "critical", area: "Evaluation dataset", text: "18% of labels conflict with the stated answer policy." },
      { type: "warning", area: "Evaluation dataset", text: "31 examples are too easy; every candidate passes them." },
      { type: "critical", area: "Evaluator", text: "Judge agreement falls to 61% on tool-use and refusal cases." },
      { type: "warning", area: "Agent", text: "One expensive model handles every request, but still misses multi-hop cases." },
    ],
    event: "Quality gate blocked · 3 systems need repair",
  },
  {
    id: "dataset",
    eyebrow: "Stage 02 · Strengthen the evidence",
    title: "Repair the dataset before asking the optimizer to trust it.",
    summary:
      "Contradictory labels are corrected, trivial examples are retired from the decision set, and difficult production-shaped cases are added with a holdout reserved before search.",
    scores: { dataset: 89, evaluator: 51, agent: 63, trust: 60 },
    findings: [
      { type: "success", area: "Label audit", text: "12 contradictory labels corrected with an explicit answer policy." },
      { type: "success", area: "Difficulty", text: "31 non-discriminating examples moved out of the decision set." },
      { type: "success", area: "Coverage", text: "24 edge cases added across retrieval, tools, and ambiguous intent." },
      { type: "info", area: "Isolation", text: "20% holdout sealed before the first optimization experiment." },
    ],
    event: "Dataset v2 admitted · hard-case coverage +34 points",
  },
  {
    id: "evaluator",
    eyebrow: "Stage 03 · Calibrate the judge",
    title: "The evaluator must earn the right to choose a winner.",
    summary:
      "Exact requirements move to deterministic checks, subjective quality receives a clearer rubric, and the LLM judge is calibrated against expert-reviewed disagreements.",
    scores: { dataset: 89, evaluator: 91, agent: 63, trust: 75 },
    findings: [
      { type: "success", area: "Deterministic checks", text: "Schema, citation, and required-tool assertions no longer rely on an LLM opinion." },
      { type: "success", area: "Rubric", text: "Vague ‘helpfulness’ split into correctness, completeness, and groundedness." },
      { type: "success", area: "Calibration", text: "Judge agreement rises from 61% to 90% on reviewed cases." },
      { type: "info", area: "Stability", text: "Repeated judging confirms the remaining variance stays below the gate." },
    ],
    event: "Evaluator v3 calibrated · quality signal now decision-grade",
  },
  {
    id: "experiments",
    eyebrow: "Stage 04 · Multi-strategy optimization",
    title: "Let architectures compete—not just temperatures and model names.",
    summary:
      "Traigent tests model and prompt variants alongside routing, cascades, retrieval policy, and a verification pass, then keeps the non-dominated quality–cost trade-offs visible.",
    scores: { dataset: 89, evaluator: 91, agent: 89, trust: 86 },
    findings: [
      { type: "info", area: "Experiment 01", text: "Prompt + model sweep raises quality but misses the cost target." },
      { type: "success", area: "Experiment 02", text: "Intent router sends straightforward work to a smaller model." },
      { type: "success", area: "Experiment 03", text: "Binary cascade escalates only low-confidence responses." },
      { type: "success", area: "Experiment 04", text: "Retrieval policy + verifier wins the current Pareto trade-off." },
    ],
    event: "4 experiment families compared · finalist selected for holdout",
  },
  {
    id: "validate",
    eyebrow: "Stage 05 · Independent validation",
    title: "A trusted agent earns its status on cases it never competed on.",
    summary:
      "The finalist clears the quality, cost, and evaluator-reliability gates on the sealed holdout. Remaining failures stay visible, and the full evidence package is ready for a human shipping decision.",
    scores: { dataset: 89, evaluator: 91, agent: 93, trust: 94 },
    findings: [
      { type: "success", area: "Held-out quality", text: "92.4% quality score clears the 88% release threshold." },
      { type: "success", area: "Cost", text: "Estimated request cost falls 58% from the baseline in this simulation." },
      { type: "success", area: "Reliability", text: "All hard constraints pass; three residual failures remain documented." },
      { type: "success", area: "Decision", text: "Evidence package generated with dataset, evaluator, experiment, and holdout lineage." },
    ],
    event: "Quality gate passed · trusted-agent candidate ready for review",
  },
];

const experiments = [
  { name: "Baseline", architecture: "Single expert model", quality: 72.1, cost: 0.031, latency: 2.8, status: "failed" },
  { name: "Model + prompt", architecture: "Prompt family sweep", quality: 84.6, cost: 0.039, latency: 3.2, status: "cost" },
  { name: "Adaptive router", architecture: "Intent-based specialists", quality: 88.3, cost: 0.019, latency: 2.1, status: "frontier" },
  { name: "Cascade + RAG", architecture: "Cheap-first · retrieve · verify", quality: 92.4, cost: 0.013, latency: 2.4, status: "winner" },
];

const scoreTracks = [
  { key: "dataset", label: "Dataset quality", icon: DatabaseZap, color: "#55d6be" },
  { key: "evaluator", label: "Evaluator reliability", icon: GaugeCircle, color: "#f6c85f" },
  { key: "agent", label: "Agent performance", icon: BrainCircuit, color: "#8da2fb" },
];

const techniqueGroups = [
  {
    icon: DatabaseZap,
    title: "Evolve the evidence",
    items: ["Label conflict detection", "Too-easy and always-fail examples", "Coverage and redundancy analysis", "Search / holdout isolation"],
  },
  {
    icon: GaugeCircle,
    title: "Audit the evaluator",
    items: ["Deterministic checks", "Rubric decomposition", "Judge agreement calibration", "Variance and bias screening"],
  },
  {
    icon: GitBranch,
    title: "Build agent architectures",
    items: ["Model and prompt families", "Routers and binary cascades", "N-stage escalation", "RAG, tools, and verification"],
  },
  {
    icon: Radar,
    title: "Optimize the trade-off",
    items: ["Sequential experimentation", "Pareto-frontier selection", "Quality constraints", "Cost and latency objectives"],
  },
];

function ScoreRing({ value, label }) {
  const color = value >= 88 ? "#55d6be" : value >= 70 ? "#f6c85f" : "#ff7869";
  return (
    <div
      className="relative flex h-36 w-36 shrink-0 items-center justify-center rounded-full sm:h-44 sm:w-44"
      style={{ background: `conic-gradient(${color} ${value * 3.6}deg, rgba(148,163,184,.12) 0deg)` }}
      role="progressbar"
      aria-label={label}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={value}
    >
      <div className="absolute inset-[7px] rounded-full border border-white/10 bg-[#080c13]" />
      <div className="relative text-center">
        <motion.div key={value} initial={false} animate={{ opacity: 1, scale: 1 }} className="font-mono text-4xl font-semibold tabular-nums text-white sm:text-5xl">
          {value}
        </motion.div>
        <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.24em] text-slate-500">Trust index</div>
      </div>
    </div>
  );
}

function FindingIcon({ type }) {
  const styles = {
    critical: [XCircle, "text-rose-300 bg-rose-400/10"],
    warning: [AlertTriangle, "text-amber-300 bg-amber-400/10"],
    success: [CheckCircle2, "text-emerald-300 bg-emerald-400/10"],
    info: [Activity, "text-blue-300 bg-blue-400/10"],
  };
  const [Icon, className] = styles[type] || styles.info;
  return (
    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${className}`}>
      <Icon className="h-4 w-4" aria-hidden="true" />
    </span>
  );
}

function ExperimentTable({ visible }) {
  return (
    <div className={`overflow-hidden rounded-2xl border transition duration-500 ${visible ? "border-blue-300/25 bg-[#080d16] opacity-100" : "border-white/5 bg-white/[0.015] opacity-45"}`}>
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-blue-300">Experiment matrix</p>
          <h3 className="mt-1 font-semibold text-white">Architecture frontier</h3>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 font-mono text-[9px] uppercase tracking-wider text-slate-500">simulated</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[670px] text-left text-sm">
          <thead className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-600">
            <tr>
              <th className="px-5 py-3 font-medium">Run</th>
              <th className="px-4 py-3 font-medium">Agent design</th>
              <th className="px-4 py-3 text-right font-medium">Quality</th>
              <th className="px-4 py-3 text-right font-medium">Cost / req</th>
              <th className="px-4 py-3 text-right font-medium">Latency</th>
              <th className="px-5 py-3 font-medium">Decision</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {experiments.map((row, index) => {
              const isWinner = row.status === "winner";
              return (
                <motion.tr
                  key={row.name}
                  initial={visible ? { opacity: 0, x: -12 } : false}
                  animate={{ opacity: visible ? 1 : 0.45, x: 0 }}
                  transition={{ delay: visible ? index * 0.11 : 0 }}
                  className={isWinner && visible ? "bg-emerald-300/[0.055]" : ""}
                >
                  <td className="px-5 py-4 font-medium text-white">{row.name}</td>
                  <td className="px-4 py-4 text-slate-400">{row.architecture}</td>
                  <td className="px-4 py-4 text-right font-mono tabular-nums text-slate-200">{row.quality.toFixed(1)}%</td>
                  <td className="px-4 py-4 text-right font-mono tabular-nums text-slate-200">${row.cost.toFixed(3)}</td>
                  <td className="px-4 py-4 text-right font-mono tabular-nums text-slate-200">{row.latency.toFixed(1)}s</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider ${
                      row.status === "winner"
                        ? "bg-emerald-300/10 text-emerald-300"
                        : row.status === "frontier"
                          ? "bg-blue-300/10 text-blue-300"
                          : row.status === "cost"
                            ? "bg-amber-300/10 text-amber-300"
                            : "bg-rose-300/10 text-rose-300"
                    }`}>
                      {row.status === "winner" ? "finalist" : row.status}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function OnboardingSimulation() {
  const [stageIndex, setStageIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const reduceMotion = useReducedMotion();
  const stage = stages[stageIndex];
  const isComplete = stageIndex === stages.length - 1;

  useEffect(() => {
    if (!isRunning || isComplete) return undefined;
    const timer = window.setTimeout(() => setStageIndex((current) => Math.min(current + 1, stages.length - 1)), 4200);
    return () => window.clearTimeout(timer);
  }, [isRunning, isComplete, stageIndex]);

  useEffect(() => {
    if (isComplete) setIsRunning(false);
  }, [isComplete]);

  const gateStatus = useMemo(() => {
    if (isComplete) return { label: "PASS · READY FOR REVIEW", color: "text-emerald-300", border: "border-emerald-300/30", icon: ShieldCheck };
    if (stageIndex >= 3) return { label: "VALIDATING FINALIST", color: "text-blue-300", border: "border-blue-300/30", icon: Radar };
    return { label: "BLOCKED · IMPROVEMENT REQUIRED", color: "text-rose-300", border: "border-rose-300/30", icon: AlertTriangle };
  }, [isComplete, stageIndex]);
  const GateStatusIcon = gateStatus.icon;

  const setStage = (index) => {
    setStageIndex(index);
    setIsRunning(false);
    trackEvent("onboarding_simulation_stage_selected", { stage: stages[index].id });
  };

  const restart = () => {
    setStageIndex(0);
    setIsRunning(false);
    trackEvent("onboarding_simulation_restarted", {});
  };

  const startOrPause = () => {
    if (isComplete) {
      setStageIndex(0);
      setIsRunning(true);
      trackEvent("onboarding_simulation_replayed", {});
      return;
    }
    setIsRunning((value) => !value);
    trackEvent("onboarding_simulation_toggled", { running: !isRunning, stage: stage.id });
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#040609] text-white [font-family:'Avenir_Next','Segoe_UI',sans-serif]">
      <Helmet>
        <title>Agent Lifecycle Onboarding Simulation · Traigent</title>
        <meta
          name="description"
          content="Watch Traigent diagnose and improve an evaluation dataset, evaluator, and agent architecture into a trusted-agent candidate."
        />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://traigent.ai/#/onboarding-simulation" />
      </Helmet>

      <section className="relative isolate border-b border-white/10 px-5 pb-16 pt-16 sm:px-8 md:pb-24 md:pt-24">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(99,137,185,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(99,137,185,.1)_1px,transparent_1px)] [background-size:52px_52px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-600/15 blur-[140px]" />
        <div className="relative mx-auto max-w-6xl text-center">
          <Link to="/" className="mx-auto mb-10 flex w-fit items-center gap-2 text-sm text-slate-500 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to the lifecycle
          </Link>
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-blue-300/25 bg-blue-300/[0.06] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-blue-200 sm:text-xs">
            <FlaskConical className="h-4 w-4" aria-hidden="true" /> Interactive onboarding simulation
          </div>
          <h1 className="mx-auto mt-7 max-w-5xl text-[clamp(3rem,7vw,6.2rem)] font-semibold leading-[0.94] tracking-[-0.055em]">
            From failed quality gate
            <span className="block bg-gradient-to-r from-rose-300 via-blue-300 to-emerald-300 bg-clip-text text-transparent">to trusted agent.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-3xl text-lg leading-relaxed text-slate-400 sm:text-xl">
            Watch one agent move through diagnosis, dataset repair, evaluator calibration, structural optimization, and independent validation.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 rounded-lg border border-amber-300/20 bg-amber-300/[0.055] px-4 py-2 text-xs text-amber-100/80">
            <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Illustrative workflow and simulated metrics—not a customer result.
          </div>
        </div>
      </section>

      <section className="relative py-14 sm:py-20">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-7 lg:px-10">
          <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div className="flex flex-wrap items-center gap-2" aria-label="Simulation stages">
              {stages.map((item, index) => {
                const active = index === stageIndex;
                const completed = index < stageIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={active}
                    aria-label={`Stage ${index + 1}: ${item.id}${completed ? ", completed" : active ? ", current" : ""}`}
                    onClick={() => setStage(index)}
                    className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-3.5 py-2 font-mono text-[10px] uppercase tracking-wider transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 ${
                      active
                        ? "border-blue-300/50 bg-blue-300/10 text-blue-200"
                        : completed
                          ? "border-emerald-300/25 bg-emerald-300/[0.055] text-emerald-300"
                          : "border-white/10 bg-white/[0.02] text-slate-500 hover:border-white/20 hover:text-slate-300"
                    }`}
                  >
                    {completed ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <span>{String(index + 1).padStart(2, "0")}</span>}
                    <span className="hidden sm:inline">{item.id}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={restart}
                className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-400 transition hover:border-white/25 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
              >
                <RefreshCcw className="h-4 w-4" aria-hidden="true" /> Restart
              </button>
              <button
                type="button"
                onClick={startOrPause}
                className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
              >
                {isRunning ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
                {isComplete ? "Run again" : isRunning ? "Pause" : stageIndex === 0 ? "Run simulation" : "Continue"}
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#070a10] shadow-[0_50px_140px_rgba(0,0,0,.55)]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/70 to-transparent" />
            <div className="grid min-h-[720px] xl:grid-cols-[320px_1fr_400px]">
              <aside className="border-b border-white/10 bg-[#06090e] p-5 sm:p-7 xl:border-b-0 xl:border-r">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-slate-600">Onboarding run</p>
                    <p className="mt-1 font-mono text-xs text-slate-300">AGENT-ALPHA / 0042</p>
                  </div>
                  <span className={`h-2.5 w-2.5 rounded-full ${isRunning ? "bg-blue-300 shadow-[0_0_16px_#7db4ff]" : isComplete ? "bg-emerald-300" : "bg-slate-600"}`} aria-hidden="true" />
                </div>

                <div className="mt-10 flex justify-center">
                  <ScoreRing value={stage.scores.trust} label={`Trust index ${stage.scores.trust} out of 100`} />
                </div>

                <div className="mt-9 space-y-5">
                  {scoreTracks.map(({ key, label, icon: Icon, color }) => (
                    <div key={key}>
                      <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                        <span className="flex items-center gap-2 text-slate-400">
                          <Icon className="h-3.5 w-3.5" style={{ color }} aria-hidden="true" /> {label}
                        </span>
                        <motion.span key={stage.scores[key]} initial={false} animate={{ opacity: 1 }} className="font-mono tabular-nums text-slate-200">
                          {stage.scores[key]}
                        </motion.span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]" role="progressbar" aria-label={label} aria-valuemin="0" aria-valuemax="100" aria-valuenow={stage.scores[key]}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: color }}
                          initial={false}
                          animate={{ width: `${stage.scores[key]}%` }}
                          transition={reduceMotion ? { duration: 0 } : { duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className={`mt-9 rounded-xl border p-4 ${gateStatus.border}`}>
                  <div className={`flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.17em] ${gateStatus.color}`}>
                    <GateStatusIcon className="h-4 w-4" aria-hidden="true" />
                    {gateStatus.label}
                  </div>
                </div>

                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-600">Objectives</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["Quality ≥ 88", "Cost ≤ $0.020", "Hard gates = 100%"].map((objective) => (
                      <span key={objective} className="rounded-md border border-white/10 bg-white/[0.025] px-2.5 py-1.5 font-mono text-[9px] text-slate-400">{objective}</span>
                    ))}
                  </div>
                </div>
              </aside>

              <section className="relative min-w-0 p-5 sm:p-8 lg:p-10" aria-live="polite">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={stage.id}
                    initial={false}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-blue-300">{stage.eyebrow}</p>
                    <h2 className="mt-4 max-w-4xl text-3xl font-semibold tracking-[-0.035em] text-white sm:text-5xl">{stage.title}</h2>
                    <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-400 sm:text-lg">{stage.summary}</p>

                    <div className="mt-9 grid gap-3 sm:grid-cols-3">
                      {scoreTracks.map(({ key, label, icon: Icon, color }) => {
                        const passed = stage.scores[key] >= 88;
                        return (
                          <div key={key} className="rounded-2xl border border-white/10 bg-white/[0.022] p-4">
                            <div className="flex items-center justify-between">
                              <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ color, backgroundColor: `${color}15` }}>
                                <Icon className="h-4 w-4" aria-hidden="true" />
                              </span>
                              <span className={`font-mono text-[9px] uppercase tracking-wider ${passed ? "text-emerald-300" : "text-slate-600"}`}>{passed ? "gate passed" : "improving"}</span>
                            </div>
                            <p className="mt-5 text-sm text-slate-400">{label}</p>
                            <motion.p key={stage.scores[key]} initial={false} animate={{ opacity: 1, y: 0 }} className="mt-1 font-mono text-3xl tabular-nums text-white">{stage.scores[key]}<span className="text-sm text-slate-600">/100</span></motion.p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-6">
                      <ExperimentTable visible={stageIndex >= 3} />
                    </div>

                    {isComplete && (
                      <motion.div
                        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 overflow-hidden rounded-2xl border border-emerald-300/30 bg-emerald-300/[0.055]"
                      >
                        <div className="grid gap-px bg-emerald-300/10 sm:grid-cols-3">
                          {[
                            ["92.4%", "held-out quality"],
                            ["−58%", "simulated request cost"],
                            ["100%", "hard constraints passed"],
                          ].map(([value, label]) => (
                            <div key={label} className="bg-[#08110f] p-5 text-center">
                              <p className="font-mono text-2xl tabular-nums text-emerald-200">{value}</p>
                              <p className="mt-1 text-xs text-slate-500">{label}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </section>

              <aside className="border-t border-white/10 bg-[#06090e] p-5 sm:p-7 xl:border-l xl:border-t-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-slate-600">Evidence stream</p>
                    <h3 className="mt-1 font-semibold text-white">What Traigent found</h3>
                  </div>
                  <Activity className={`h-5 w-5 ${isRunning ? "text-blue-300" : "text-slate-600"}`} aria-hidden="true" />
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={stage.id}
                    initial={false}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, x: -8 }}
                    className="mt-7 space-y-3"
                  >
                    {stage.findings.map((finding, index) => (
                      <motion.div
                        key={finding.text}
                        initial={false}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                        className="flex gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5"
                      >
                        <FindingIcon type={finding.type} />
                        <div>
                          <p className="font-mono text-[9px] uppercase tracking-wider text-slate-600">{finding.area}</p>
                          <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{finding.text}</p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                <div className="mt-7 rounded-xl border border-blue-300/20 bg-blue-300/[0.04] p-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-blue-300">Latest event</p>
                  <AnimatePresence mode="wait">
                    <motion.p key={stage.event} initial={false} animate={{ opacity: 1 }} className="mt-2 text-sm leading-relaxed text-slate-300">{stage.event}</motion.p>
                  </AnimatePresence>
                </div>

                {!isComplete ? (
                  <button
                    type="button"
                    onClick={() => {
                      setStageIndex((value) => Math.min(value + 1, stages.length - 1));
                      setIsRunning(false);
                    }}
                    className="mt-7 inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.035] px-4 py-3 text-sm font-semibold text-white transition hover:border-blue-300/40 hover:bg-blue-300/[0.07] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
                  >
                    Advance to {stages[stageIndex + 1].id}
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : (
                  <Link to="/get-started" className="mt-7 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-300 px-4 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-200">
                    Connect your agent <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                )}
              </aside>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#070a0f] py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-xs uppercase tracking-[0.27em] text-blue-300">What the simulation represents</p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">One onboarding. Four systems improving together.</h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-400">The visual uses simulated values, but the improvement families map to real Traigent workflows and composite agent techniques.</p>
          </div>
          <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-2">
            {techniqueGroups.map(({ icon: Icon, title, items }, groupIndex) => (
              <motion.div
                key={title}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: groupIndex * 0.06 }}
                className="bg-[#070a0f] p-7 sm:p-9"
              >
                <Icon className="h-6 w-6 text-blue-300" aria-hidden="true" />
                <h3 className="mt-5 text-xl font-semibold text-white">{title}</h3>
                <ul className="mt-5 space-y-3">
                  {items.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-slate-400">
                      <Check className="h-4 w-4 shrink-0 text-emerald-300" aria-hidden="true" /> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[140px]" />
        <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
          <ShieldCheck className="mx-auto h-9 w-9 text-emerald-300" aria-hidden="true" />
          <h2 className="mt-7 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">A trusted agent is not a feeling. It is a chain of evidence.</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">Bring the agent and evaluation setup you have. Traigent diagnoses the weak links and guides the next improvement.</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/get-started" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-slate-950 transition hover:bg-blue-50">
              Connect your agent <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link to="/" className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-600 px-6 py-3 font-semibold text-white transition hover:border-slate-400">Explore the lifecycle</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
