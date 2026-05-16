import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Target,
  TrendingDown,
  Clock,
  RefreshCw,
  Layers,
  CheckCircle2,
} from "lucide-react";

const BLUE = "#1A6BF5";

const FadeIn = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

// The four sub-disciplines that define what Agent Optimization actually is.
// Each maps to a real Traigent capability so the category page doubles as a
// product map.
const PILLARS = [
  {
    icon: Layers,
    title: "Configuration-space search",
    body:
      "Treat your agent's configuration — model, prompt, temperature, retrieval-k, chunk size, max tokens, tool-selection policy, and dozens more — as a single high-dimensional search space. Optimization means searching it intelligently, not picking knobs one at a time.",
  },
  {
    icon: TrendingDown,
    title: "Cost-performance trade-off",
    body:
      "Every configuration sits somewhere on a Pareto frontier between accuracy, latency, and inference cost. Agent Optimization finds the operating point that meets your quality bar at the lowest run cost — not just the cheapest model, and not just the most accurate one.",
  },
  {
    icon: Clock,
    title: "Time-to-market compression",
    body:
      "Manual tuning takes engineering weeks per release. A real Agent Optimization platform runs the loop unattended — engineer sets up the search space in ~1 hour, the system explores it in a few hours, returns a tested, ready-to-ship configuration with quantified confidence.",
  },
  {
    icon: RefreshCw,
    title: "Continuous re-optimization",
    body:
      "Models update. Costs change. Your traffic mix drifts. Yesterday's optimum is today's leak. Agent Optimization is not a one-shot exercise — it's a continuous loop that keeps your agent on its current optimum as the world changes underneath it.",
  },
];

// Symptoms a team has when they don't do Agent Optimization. These are the
// 'before' state — what the user is feeling when they land here from a search.
const SYMPTOMS = [
  "Inference costs that scale linearly (or worse) with usage.",
  "Weeks of engineer-time per release just to evaluate config changes.",
  "Picking the premium model 'to be safe' — paying 10× for marginal quality.",
  "Silent quality regressions when you tweak prompts for a new use case.",
  "No principled answer to 'have we actually found the best configuration?'",
  "Fear of trying new models because re-tuning is too expensive.",
];

// Outcomes a team gets when they do it well. The 'after' state.
const OUTCOMES = [
  { value: "30–60%", label: "Inference cost reduction at equal or better quality." },
  { value: "Hours", label: "Per optimization pass, not engineer-weeks." },
  { value: "100%", label: "Coverage of the chosen search space — no untested configs." },
  { value: "Day-0", label: "Ship new models the day they drop." },
];

export default function AgentOptimization() {
  return (
    <>
      <Helmet>
        <title>Agent Optimization — the category, defined · Traigent</title>
        <meta
          name="description"
          content="Agent Optimization is the discipline of systematically searching an AI agent's configuration space to find the best cost-performance operating point. Definition, pillars, outcomes, and how Traigent leads the category."
        />
        <meta name="keywords" content="agent optimization, AI agent optimization, LLM agent optimization, agent cost optimization, agent performance tuning, AI configuration search, Traigent" />
        <link rel="canonical" href="https://traigent.ai/agent-optimization" />
        <meta property="og:title" content="Agent Optimization — the category, defined" />
        <meta property="og:description" content="The discipline of systematically searching an AI agent's configuration space to find the best cost-performance operating point." />
        <meta property="og:url" content="https://traigent.ai/agent-optimization" />
      </Helmet>

      <section className="bg-[#080808] text-white min-h-screen py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Hero — the definition */}
          <FadeIn className="text-center mb-16 md:mb-20">
            <div
              className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-mono tracking-wider mb-6"
              style={{ color: BLUE }}
            >
              THE CATEGORY
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span style={{ color: BLUE }}>Agent Optimization</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto leading-snug mb-8">
              The discipline of systematically searching an AI agent's{" "}
              <span className="text-white font-semibold">configuration space</span> to find the best{" "}
              <span style={{ color: BLUE }} className="font-semibold">cost-performance operating point</span>
              {" "}— and continuously re-finding it as models, prices, and usage patterns drift.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm md:text-base">
              <Link
                to="/roi"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1A6BF5] hover:bg-[#4D8EF8] text-white font-medium transition-colors"
              >
                See it on your numbers
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-700 hover:border-[#4D8EF8] text-slate-300 hover:text-white font-medium transition-colors"
              >
                Traigent platform
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>

          {/* What it is — the pillars */}
          <FadeIn delay={0.05} className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center">What it actually is</h2>
            <p className="text-slate-400 text-center max-w-2xl mx-auto mb-10">
              Agent Optimization isn't a buzzword. It's four concrete sub-disciplines:
            </p>
            <div className="grid md:grid-cols-2 gap-5">
              {PILLARS.map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.title}
                    className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-7"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${BLUE}1A`, color: BLUE }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-white">{p.title}</h3>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-sm md:text-base">{p.body}</p>
                  </div>
                );
              })}
            </div>
          </FadeIn>

          {/* Why it matters — symptoms */}
          <FadeIn delay={0.05} className="mb-16">
            <div className="bg-gradient-to-br from-amber-500/5 to-slate-900/0 border border-amber-500/30 rounded-2xl p-7 md:p-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Without it, teams hit the same wall</h2>
              <p className="text-slate-400 mb-6">
                If any of these sound familiar, you have an Agent Optimization problem:
              </p>
              <ul className="space-y-3">
                {SYMPTOMS.map((s) => (
                  <li key={s} className="flex items-start gap-3 text-slate-200">
                    <Target className="w-5 h-5 mt-0.5 text-amber-400 flex-shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-slate-800/80">
                <Link
                  to="/value-proposition"
                  className="inline-flex items-center gap-1.5 text-[#4D8EF8] hover:text-white font-medium"
                >
                  Read the 6-truth logic chain
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </FadeIn>

          {/* Outcomes — what changes when you do it */}
          <FadeIn delay={0.05} className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center">When you do it well</h2>
            <p className="text-slate-400 text-center max-w-2xl mx-auto mb-10">
              Numbers Traigent customers see on a typical optimization pass:
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {OUTCOMES.map((o) => (
                <div
                  key={o.label}
                  className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center"
                >
                  <div className="text-4xl md:text-5xl font-extrabold mb-2" style={{ color: BLUE }}>
                    {o.value}
                  </div>
                  <p className="text-sm text-slate-300 leading-snug">{o.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/roi"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-700 hover:border-[#4D8EF8] text-slate-300 hover:text-white text-sm font-medium transition-colors"
              >
                ROI Calculator
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/ttm"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-700 hover:border-[#4D8EF8] text-slate-300 hover:text-white text-sm font-medium transition-colors"
              >
                TTM Calculator
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>

          {/* Where Traigent fits */}
          <FadeIn delay={0.05} className="mb-16">
            <div
              className="bg-gradient-to-br from-blue-500/10 to-slate-900/0 border-2 rounded-2xl p-7 md:p-10"
              style={{ borderColor: BLUE }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Traigent: the Agent Optimization platform
              </h2>
              <p className="text-slate-200 leading-relaxed mb-5 md:text-lg">
                Most tools you've seen in this space are either{" "}
                <span className="text-white font-semibold">observability dashboards</span> (they tell you what happened)
                or <span className="text-white font-semibold">eval frameworks</span> (they grade one config at a time).
                Neither searches the configuration space. Neither finds an optimum.
              </p>
              <p className="text-slate-200 leading-relaxed mb-6 md:text-lg">
                Traigent does. It treats your agent as a high-dimensional system,
                runs a principled search across the configurations you care about,
                returns the cost-performance optimum with quantified confidence,
                and re-runs the loop on a cadence — so you stay on the optimum as models and prices change.
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                {[
                  "Configuration search, not just evals",
                  "Multi-KPI Pareto-aware",
                  "Continuous re-optimization",
                  "Math you can audit",
                ].map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-700 text-xs md:text-sm text-slate-300"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4D8EF8]" />
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/get-started"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#1A6BF5] hover:bg-[#4D8EF8] text-white font-medium transition-colors"
                >
                  Get started
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/compare"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-slate-700 hover:border-[#4D8EF8] text-slate-300 hover:text-white font-medium transition-colors"
                >
                  How Traigent compares
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </FadeIn>

          {/* Further reading */}
          <FadeIn delay={0.05}>
            <h2 className="text-2xl font-bold mb-4 text-center">Read deeper</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link
                to="/blog/the-business-case"
                className="block bg-slate-900/40 hover:bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition-colors"
              >
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">Blog</div>
                <div className="text-sm text-slate-200 font-medium leading-snug">
                  The business case for Agent Optimization
                </div>
              </Link>
              <Link
                to="/blog/the-model-myth"
                className="block bg-slate-900/40 hover:bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition-colors"
              >
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">Blog</div>
                <div className="text-sm text-slate-200 font-medium leading-snug">
                  The Model Myth — why picking GPT-5 isn't optimization
                </div>
              </Link>
              <Link
                to="/blog/the-agent-operating-point"
                className="block bg-slate-900/40 hover:bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition-colors"
              >
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">Blog</div>
                <div className="text-sm text-slate-200 font-medium leading-snug">
                  The Agent Operating Point
                </div>
              </Link>
            </div>
          </FadeIn>

        </div>
      </section>
    </>
  );
}
