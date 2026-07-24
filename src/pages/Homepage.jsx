import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Check,
  GaugeCircle,
  DatabaseZap,
  FlaskConical,
  GitBranch,
  LockKeyhole,
  Radar,
  Workflow,
  ShieldCheck,
  Sparkles,
  TimerReset,
} from "lucide-react";
import StartNowModal from "../components/StartNowModal";
import ContactSection from "../components/ContactSection";
import { trackEvent } from "../lib/analytics";

const DEMO_URL = "https://meetings-eu1.hubspot.com/amir8";

const pillars = [
  {
    number: "01",
    icon: DatabaseZap,
    title: "Evaluation dataset",
    short: "Improve what you test",
    description:
      "Find weak labels, trivial examples, blind spots, and missing production failures. Evolve the questions and answers that define success.",
    accent: "#55d6be",
  },
  {
    number: "02",
    icon: GaugeCircle,
    title: "Evaluation strategy",
    short: "Improve how you judge",
    description:
      "Detect noisy scores, biased judges, brittle rubrics, and metrics that reward the wrong behavior before they select a winner.",
    accent: "#f6c85f",
  },
  {
    number: "03",
    icon: GitBranch,
    title: "Agent design",
    short: "Improve what you build",
    description:
      "Explore prompts, models, retrieval, routing, cascades, tools, and composite agent architectures—not only configuration values.",
    accent: "#8da2fb",
  },
  {
    number: "04",
    icon: Radar,
    title: "Optimization strategy",
    short: "Improve how you search",
    description:
      "Use efficient sequential and Pareto-aware experiments to find quality, cost, and latency trade-offs without brute-force waste.",
    accent: "#ff8f70",
  },
];

const lifecycle = ["Screen", "Build", "Evaluate", "Optimize", "Validate", "Deploy", "Adapt"];

const outcomes = [
  {
    icon: TimerReset,
    title: "Move faster",
    body: "Compress repetitive weeks of manual experiments into a guided, reviewable improvement loop.",
  },
  {
    icon: BarChart3,
    title: "Raise quality",
    body: "Improve held-out accuracy against the difficult cases that actually separate useful agents from convincing demos.",
  },
  {
    icon: BrainCircuit,
    title: "Control cost",
    body: "Find architectures that spend expert-model capacity only where the task needs it.",
  },
  {
    icon: ShieldCheck,
    title: "Earn trust",
    body: "Keep the dataset, evaluator, failures, trade-offs, and final validation visible before anything ships.",
  },
];

function Reveal({ children, className = "", delay = 0 }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function LifecycleCore() {
  const reduceMotion = useReducedMotion();
  return (
    <>
      <div className="mx-auto grid max-w-md grid-cols-2 gap-3 sm:hidden" aria-label="Four development pillars leading to a trusted agent">
        <div className="col-span-2 mx-auto mb-2 flex h-40 w-40 flex-col items-center justify-center rounded-full border border-blue-300/40 bg-[#071325] text-center shadow-[0_0_60px_rgba(45,123,255,0.25)]">
          <ShieldCheck className="mb-3 h-7 w-7 text-blue-300" aria-hidden="true" />
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-blue-300">Outcome</span>
          <strong className="mt-2 text-lg text-white">Trusted agent</strong>
          <span className="mt-1 text-xs text-slate-400">measured · efficient · ready</span>
        </div>
        {pillars.map(({ icon: Icon, short, accent }, index) => (
          <div key={short} className="rounded-2xl border bg-slate-950/90 p-3" style={{ borderColor: `${accent}55` }}>
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ color: accent, backgroundColor: `${accent}18` }}>
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-slate-500">Pillar {index + 1}</span>
            </div>
            <p className="text-xs font-semibold leading-snug text-slate-100">{short}</p>
          </div>
        ))}
      </div>

      <div className="relative mx-auto hidden aspect-square w-full max-w-[540px] sm:block" aria-label="Four pillars orbiting a trusted agent">
      <div className="absolute inset-[9%] rounded-full border border-blue-400/20" />
      <div className="absolute inset-[18%] rounded-full border border-dashed border-slate-600/50" />
      <motion.div
        className="absolute inset-[9%] rounded-full border-t border-blue-400/80"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
      />

      <div className="absolute left-1/2 top-1/2 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-blue-300/40 bg-[#071325]/95 text-center shadow-[0_0_80px_rgba(45,123,255,0.28)] sm:h-48 sm:w-48">
        <ShieldCheck className="mb-3 h-7 w-7 text-blue-300" aria-hidden="true" />
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-blue-300">Outcome</span>
        <strong className="mt-2 text-lg leading-tight text-white sm:text-xl">Trusted agent</strong>
        <span className="mt-2 text-xs text-slate-400">measured · efficient · ready</span>
      </div>

      {pillars.map(({ icon: Icon, short, accent }, index) => {
        const positions = [
          "left-[2%] top-[10%]",
          "right-[0%] top-[14%]",
          "bottom-[10%] left-[1%]",
          "bottom-[6%] right-[1%]",
        ];
        return (
          <div
            key={short}
            className={`absolute ${positions[index]} w-[42%] max-w-[190px] rounded-2xl border bg-slate-950/90 p-3 shadow-2xl backdrop-blur sm:p-4`}
            style={{ borderColor: `${accent}55` }}
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ color: accent, backgroundColor: `${accent}18` }}>
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500">Pillar {index + 1}</span>
            </div>
            <p className="text-xs font-semibold leading-snug text-slate-100 sm:text-sm">{short}</p>
          </div>
        );
      })}
      </div>
    </>
  );
}

export default function Homepage() {
  const [showStartNow, setShowStartNow] = useState(false);

  useEffect(() => {
    const pending = sessionStorage.getItem("pendingScroll");
    if (!pending) return undefined;

    sessionStorage.removeItem("pendingScroll");
    const timer = window.setTimeout(() => {
      document.getElementById(pending)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-[#05070b] text-white [font-family:'Avenir_Next','Segoe_UI',sans-serif]">
      <Helmet>
        <title>Traigent — Vibe Code AI Agents You Can Trust</title>
        <meta
          name="description"
          content="Build, evaluate, optimize, and continuously improve AI agents across the full development lifecycle."
        />
        <meta property="og:title" content="Vibe Code Your Agents. Prove They Work." />
        <meta
          property="og:description"
          content="Traigent turns agent development into a measured lifecycle across data, evaluation, architecture, and optimization."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://traigent.ai" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Vibe Code Your Agents. Prove They Work." />
        <meta
          name="twitter:description"
          content="Higher quality, lower cost, faster iteration, and evidence you can trust."
        />
      </Helmet>

      {showStartNow && <StartNowModal onClose={() => setShowStartNow(false)} location="homepage_lifecycle" />}

      <section className="relative isolate min-h-[850px] overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(120,150,190,.11)_1px,transparent_1px),linear-gradient(90deg,rgba(120,150,190,.11)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" />
        <div className="pointer-events-none absolute left-[8%] top-24 h-72 w-72 rounded-full bg-blue-600/15 blur-[110px]" />
        <div className="pointer-events-none absolute right-[5%] top-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-[130px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pb-20 pt-20 sm:px-8 md:pt-28 lg:grid-cols-[1.08fr_.92fr] lg:px-10 lg:pb-28">
          <div className="relative z-10">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-300/[0.07] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.26em] text-emerald-200 sm:text-xs">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              The full development lifecycle for AI agents
            </div>
            <h1 className="max-w-4xl text-[clamp(3.25rem,7vw,6.7rem)] font-semibold leading-[0.91] tracking-[-0.055em] text-white">
              Vibe Code
              <span className="mt-1 block bg-gradient-to-r from-[#6da9ff] via-[#80e0d0] to-[#f4d27a] bg-clip-text text-transparent">
                Your Agents.
              </span>
              <span className="mt-2 block text-[0.72em] tracking-[-0.045em] text-slate-300">Prove They Work.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl">
              Build, evaluate, optimize, and continuously improve AI agents across their full lifecycle—so you reach higher quality faster, control LLM cost, and ship with evidence you can trust.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/onboarding-simulation"
                onClick={() => trackEvent("lifecycle_demo_clicked", { location: "homepage_hero" })}
                className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#eaf2ff] px-6 py-3 font-semibold text-[#07101f] transition duration-200 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-300"
              >
                Experience the lifecycle
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <button
                type="button"
                onClick={() => {
                  trackEvent("start_now_clicked", { location: "homepage_lifecycle_hero" });
                  setShowStartNow(true);
                }}
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-slate-600 bg-slate-900/60 px-6 py-3 font-semibold text-white transition duration-200 hover:border-slate-400 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-300"
              >
                Connect your agent
              </button>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-4 border-t border-white/10 pt-6 text-sm text-slate-400 sm:grid-cols-4">
              {["Faster iteration", "Higher accuracy", "Lower LLM cost", "Visible evidence"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-emerald-300" aria-hidden="true" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <LifecycleCore />
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#080b11] py-10" aria-label="Development outcomes">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-10">
          {outcomes.map(({ icon: Icon, title, body }) => (
            <div key={title} className="group border-l border-slate-700 px-5 py-3 transition-colors hover:border-blue-400">
              <Icon className="mb-4 h-5 w-5 text-blue-300" aria-hidden="true" />
              <h2 className="text-base font-semibold text-white">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="product" className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <Reveal className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-blue-300">One system · four pillars</p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
              Optimization is one powerful pillar.
              <span className="block text-slate-500">The lifecycle is the product.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
              Traigent improves the quality bar and the agent together. A better candidate never wins against stale data or an unreliable evaluator.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-2">
            {pillars.map(({ number, icon: Icon, title, short, description, accent }, index) => (
              <Reveal key={title} delay={index * 0.06} className="group relative bg-[#080b11] p-7 sm:p-9">
                <div className="absolute right-7 top-7 font-mono text-xs tracking-[0.25em] text-slate-600">{number}</div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ color: accent, backgroundColor: `${accent}16` }}>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="mt-7 font-mono text-xs uppercase tracking-[0.2em]" style={{ color: accent }}>{short}</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">{title}</h3>
                <p className="mt-4 max-w-xl leading-relaxed text-slate-400">{description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-y border-white/10 bg-[#080b11] py-24 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(41,106,210,.12),transparent_56%)]" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <Reveal className="text-center">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-emerald-300">A continuous improvement loop</p>
            <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
              Your agent changes. The world changes. The evidence keeps up.
            </h2>
          </Reveal>

          <div className="mt-16 grid gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {lifecycle.map((stage, index) => (
              <Reveal key={stage} delay={index * 0.05} className="relative">
                <div className={`h-full min-h-28 rounded-2xl border p-4 ${index === lifecycle.length - 1 ? "border-emerald-300/40 bg-emerald-300/[0.07]" : "border-white/10 bg-white/[0.025]"}`}>
                  <span className="font-mono text-[10px] text-slate-600">{String(index + 1).padStart(2, "0")}</span>
                  <p className="mt-8 font-semibold text-white">{stage}</p>
                </div>
                {index < lifecycle.length - 1 && (
                  <ArrowRight className="absolute -right-2 top-1/2 z-10 hidden h-4 w-4 -translate-y-1/2 text-slate-600 lg:block" aria-hidden="true" />
                )}
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12 flex flex-col items-center justify-between gap-6 rounded-3xl border border-blue-300/20 bg-blue-300/[0.045] p-7 sm:flex-row sm:p-9">
            <div>
              <div className="flex items-center gap-3">
                <FlaskConical className="h-6 w-6 text-blue-300" aria-hidden="true" />
                <h3 className="text-xl font-semibold">See the full loop improve one agent</h3>
              </div>
              <p className="mt-3 max-w-2xl text-slate-400">
                Start with a failed quality gate. Repair the dataset, calibrate the evaluator, compare agent architectures, and validate the finalist on unseen cases.
              </p>
            </div>
            <Link
              to="/onboarding-simulation"
              className="group inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-300"
            >
              Run the simulation
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:px-10">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/25 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-emerald-300">
              <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" />
              Enterprise trust
            </div>
            <h2 className="mt-6 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Your quality bar. Your environment. Your decision.</h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-400">
              Run optimization inside the customer environment, keep sensitive content private, and preserve a reviewable trail from every experiment to the final shipping decision.
            </p>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Screen before search", "Identify weak datasets, unreliable evaluation, and architectural bottlenecks before spending on a large optimization run."],
              ["Validate out of sample", "Judge finalists on held-out examples they never competed on so search optimism does not masquerade as progress."],
              ["Make trade-offs explicit", "Keep quality, cost, latency, constraints, and remaining failures together in the final decision."],
              ["Compound what you learn", "Reuse prior experiments, team knowledge, and governed specifications instead of rediscovering the same lessons."],
            ].map(([title, body], index) => (
              <Reveal key={title} delay={index * 0.05} className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-gradient-to-b from-[#0a101b] to-[#06080c] py-24">
        <Reveal className="mx-auto max-w-4xl px-5 text-center sm:px-8">
          <Workflow className="mx-auto h-8 w-8 text-blue-300" aria-hidden="true" />
          <h2 className="mt-6 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">Build the agent. Strengthen the bar. Keep improving both.</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Start with the agent and evidence you have today. Traigent shows the next highest-value improvement—and what it changed.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/onboarding-simulation" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-slate-950 transition hover:bg-blue-50">
              Explore the onboarding demo <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a href={DEMO_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-600 px-6 py-3 font-semibold text-white transition hover:border-slate-400">
              Book a demo
            </a>
          </div>
        </Reveal>
      </section>

      <ContactSection />

      <footer className="border-t border-white/10 bg-[#030406] py-10 text-sm text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-5 sm:flex-row sm:items-center sm:px-8 lg:px-10">
          <div>
            <span className="font-semibold text-slate-200">Traigent</span>
            <span className="ml-3">Vibe code agents you can trust.</span>
          </div>
          <div className="flex flex-wrap gap-5">
            <Link to="/pricing" className="transition hover:text-white">Pricing</Link>
            <Link to="/research" className="transition hover:text-white">Research</Link>
            <Link to="/privacy" className="transition hover:text-white">Privacy</Link>
            <a href="mailto:support@traigent.ai" className="transition hover:text-white">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
