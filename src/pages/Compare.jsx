import { motion } from "framer-motion";
import { Check, X, Minus, ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { trackEvent } from "../lib/analytics";

const BLUE = "#1A6BF5";

// === The comparison matrix ===
// Edit this and the rest of the page updates accordingly.
// Status: "yes" | "no" | "partial"
const COMPETITORS = [
  { key: "traigent", name: "Traigent", isUs: true },
  { key: "langfuse", name: "Langfuse" },
  { key: "arize", name: "Arize" },
  { key: "helicone", name: "Helicone" },
  { key: "braintrust", name: "Braintrust" },
  { key: "langsmith", name: "LangSmith" },
];

const ROWS = [
  {
    capability: "Automatic configuration optimization",
    detail: "Searches the full config space and converges to the best cost/performance combo",
    by: { traigent: "yes", langfuse: "no", arize: "no", helicone: "no", braintrust: "no", langsmith: "no" },
  },
  {
    capability: "Multi-KPI weighted optimization",
    detail: "Optimize for any weighted blend of accuracy, cost, latency, safety, custom",
    by: { traigent: "yes", langfuse: "no", arize: "no", helicone: "no", braintrust: "no", langsmith: "no" },
  },
  {
    capability: "Benchmark refinement",
    detail: "Flags easy / always-fail / redundant test cases as patterns emerge",
    by: { traigent: "yes", langfuse: "no", arize: "no", helicone: "no", braintrust: "no", langsmith: "no" },
  },
  {
    capability: "Full observability & tracing",
    detail: "Span trees, tokens, costs, errors — captured per run",
    by: { traigent: "yes", langfuse: "yes", arize: "yes", helicone: "yes", braintrust: "yes", langsmith: "yes" },
  },
  {
    capability: "Evaluation framework",
    detail: "Run agents against test sets, measure quality metrics",
    by: { traigent: "yes", langfuse: "partial", arize: "yes", helicone: "no", braintrust: "yes", langsmith: "yes" },
  },
  {
    capability: "Provider-agnostic",
    detail: "Works with OpenAI, Anthropic, Google, Bedrock, open-source",
    by: { traigent: "yes", langfuse: "yes", arize: "yes", helicone: "yes", braintrust: "yes", langsmith: "partial" },
  },
  {
    capability: "Configurable optimization weights at runtime",
    detail: "Change KPI priorities and re-run without rebuilding",
    by: { traigent: "yes", langfuse: "no", arize: "no", helicone: "no", braintrust: "no", langsmith: "no" },
  },
  {
    capability: "Continuous re-optimization across model releases",
    detail: "Re-converge when new models drop or pricing shifts",
    by: { traigent: "yes", langfuse: "no", arize: "no", helicone: "no", braintrust: "no", langsmith: "no" },
  },
];

function CellIcon({ status }) {
  if (status === "yes")
    return <Check className="w-5 h-5 mx-auto" style={{ color: "#4ade80" }} />;
  if (status === "no")
    return <X className="w-5 h-5 mx-auto text-slate-600" />;
  return <Minus className="w-5 h-5 mx-auto text-amber-400" />;
}

export default function Compare() {
  return (
    <>
      <Helmet>
        <title>Traigent vs. Langfuse, Arize, Helicone, Braintrust · Compare</title>
        <meta
          name="description"
          content="See how Traigent compares to Langfuse, Arize, Helicone, and Braintrust. Observability tools tell you what happened. Traigent tells you what configuration to use next."
        />
        <meta property="og:title" content="Traigent vs Langfuse / Arize / Helicone / Braintrust" />
        <meta property="og:description" content="Observability tools tell you what happened. Traigent tells you what configuration to use next." />
      </Helmet>

      <section className="bg-[#080808] text-white min-h-screen py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-mono tracking-wider mb-4" style={{ color: BLUE }}>
              COMPARE
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span style={{ color: BLUE }}>Traigent</span> vs. the others
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-3xl leading-relaxed">
              Observability tools tell you <span className="text-white font-semibold">what happened</span> on each agent run. Evaluation tools tell you <span className="text-white font-semibold">how well it scored</span>. Traigent tells you <span className="text-white font-semibold">what configuration to use next</span> — and converges to the optimum across the full configuration space.
            </p>
          </motion.div>

          {/* Comparison matrix */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-x-auto mb-16"
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left p-4 md:p-5 font-semibold text-slate-400 min-w-[260px]">Capability</th>
                  {COMPETITORS.map((c) => (
                    <th
                      key={c.key}
                      className={`text-center p-4 md:p-5 font-semibold ${c.isUs ? "" : "text-slate-300"}`}
                      style={c.isUs ? { color: BLUE } : {}}
                    >
                      {c.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, i) => (
                  <tr key={i} className="border-b border-slate-800 last:border-b-0 hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 md:p-5 align-top">
                      <div className="text-white font-medium mb-0.5">{row.capability}</div>
                      <div className="text-xs text-slate-500">{row.detail}</div>
                    </td>
                    {COMPETITORS.map((c) => (
                      <td
                        key={c.key}
                        className={`p-4 md:p-5 text-center align-top ${c.isUs ? "bg-blue-500/5" : ""}`}
                      >
                        <CellIcon status={row.by[c.key]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          {/* Legend */}
          <div className="text-xs text-slate-500 font-mono mb-16 flex flex-wrap gap-x-6 gap-y-2">
            <span className="inline-flex items-center gap-2"><Check className="w-3.5 h-3.5" style={{ color: "#4ade80" }} /> built-in</span>
            <span className="inline-flex items-center gap-2"><Minus className="w-3.5 h-3.5 text-amber-400" /> partial</span>
            <span className="inline-flex items-center gap-2"><X className="w-3.5 h-3.5 text-slate-600" /> not supported</span>
          </div>

          {/* Narrative section: per-competitor positioning */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8 mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white">Where each tool excels — and where the gap is</h2>

            <p className="text-sm text-slate-400 max-w-3xl">
              Several of these vendors have added prompt-version comparison, eval-driven prompt tuning, or single-axis experimentation. None of them automate the <span className="text-white font-semibold">full multi-variable search across model · prompt · retrieval · tools · constraints · drift</span> — that's Traigent's optimization loop.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  name: "Langfuse",
                  excels: "Open-source LLM observability and tracing. Solid debugging tool with prompt-version tracking and offline evals.",
                  gap: "Tracks and evaluates configurations you propose. Doesn't search the configuration space across model/prompt/retrieval/tools/constraints — Traigent's optimization engine sits on top of the kind of tracing Langfuse provides.",
                },
                {
                  name: "Arize",
                  excels: "Enterprise AI observability with strong eval support, including their Phoenix OSS project. Adds prompt-iteration workflows.",
                  gap: "Measures and monitors, with manual prompt iteration. Doesn't automate the full multi-variable optimization loop across model/retrieval/tools/drift — Traigent closes that loop.",
                },
                {
                  name: "Helicone",
                  excels: "Lightweight LLM observability proxy. Easy drop-in for usage and cost monitoring.",
                  gap: "Pure observability — no evaluation, no optimization. Useful as a complement; insufficient if your goal is automated cost-performance optimization.",
                },
                {
                  name: "Braintrust",
                  excels: "End-to-end LLM evaluation with strong tooling for experiment tracking, human review, and prompt-version comparison.",
                  gap: "Excellent for measurement and manual experimentation. Doesn't automate the multi-axis search; configuration choices remain engineer-driven. Traigent takes the evaluations and converges to the best configuration.",
                },
                {
                  name: "LangSmith",
                  excels: "LangChain's hosted observability + eval + prompt-management platform. Tight LangChain/LangGraph integration; useful prompt-version tracking.",
                  gap: "Strong on tracing and evaluation. Doesn't run a continuous multi-variable optimization loop across model/prompt/retrieval/tools/constraints/drift — Traigent does that on top.",
                },
              ].map((c) => (
                <div key={c.name} className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-3">{c.name}</h3>
                  <p className="text-sm text-slate-300 mb-3"><span className="text-white font-semibold">Strength:</span> {c.excels}</p>
                  <p className="text-sm text-slate-400"><span className="text-white font-semibold">Gap:</span> {c.gap}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Why Traigent — closing pitch */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gradient-to-br from-blue-500/10 to-slate-900/0 border-2 rounded-2xl p-8 md:p-10"
            style={{ borderColor: BLUE }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Why Traigent ships these capabilities together</h2>
            <p className="text-slate-300 leading-relaxed mb-3">
              Optimization needs <span className="text-white font-semibold">traces</span> (to know what each configuration costs) and <span className="text-white font-semibold">benchmarks</span> (to know what each configuration achieves). That's why the platform ships all three as a single coherent system rather than three disconnected vendors.
            </p>
            <p className="text-slate-300 leading-relaxed mb-8">
              Most competitors solve one piece. Traigent is the only platform that closes the loop.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://meetings-eu1.hubspot.com/amir8"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("demo_booking_clicked", { location: "compare" })}
                className="inline-flex items-center bg-[#1A6BF5] hover:bg-[#4D8EF8] text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                Book a 15-min call
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <a
                href="/#/roi"
                onClick={() => trackEvent("roi_calculator_opened", { location: "compare" })}
                className="inline-flex items-center border border-slate-600 hover:border-slate-400 text-slate-200 hover:text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                See your ROI
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
