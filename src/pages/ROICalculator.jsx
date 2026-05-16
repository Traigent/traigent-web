import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, TrendingDown, Clock, DollarSign } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { trackEvent } from "../lib/analytics";

const BLUE = "#1A6BF5";

// Savings assumptions. These are the published ranges we stand behind.
// Tune in one place.
const COST_SAVINGS = { conservative: 0.30, typical: 0.45, optimistic: 0.60 };
const HOURLY_RATE = 150;            // Senior ML engineer fully-loaded hourly cost
const HOURS_RECLAIMED_PCT = 0.7;    // Fraction of tuning hours Traigent removes

// Traigent pricing tiers — kept in sync with /pricing.
const TIERS = {
  free:    { label: "Free POC",       monthly: 0,   blurb: "Full optimization, no spend" },
  starter: { label: "Starter",        monthly: 99,  blurb: "1 agent · 1 team · flat" },
  pro:     { label: "Pro",            monthly: 249, blurb: "Up to 5 agents · 5 teams · flat" },
};

function formatUSD(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

function Card({ children, accent }) {
  return (
    <div
      className="bg-slate-900/60 border rounded-2xl p-6 md:p-8"
      style={{ borderColor: `${accent}66` }}
    >
      {children}
    </div>
  );
}

function Stat({ label, value, sublabel, icon: Icon, accent }) {
  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {label}
      </div>
      <div className="text-3xl md:text-4xl font-bold mb-1" style={{ color: accent }}>{value}</div>
      {sublabel && <div className="text-sm text-slate-400">{sublabel}</div>}
    </div>
  );
}

export default function ROICalculator() {
  const [monthlySpend, setMonthlySpend] = useState(20000);
  const [hoursTuningPerMonth, setHoursTuningPerMonth] = useState(20);
  const [tier, setTier] = useState("pro");

  const results = useMemo(() => {
    const llm = {
      conservative: monthlySpend * COST_SAVINGS.conservative * 12,
      typical: monthlySpend * COST_SAVINGS.typical * 12,
      optimistic: monthlySpend * COST_SAVINGS.optimistic * 12,
    };
    const engineering = hoursTuningPerMonth * HOURS_RECLAIMED_PCT * HOURLY_RATE * 12;
    const grossTypical = llm.typical + engineering;
    const traigentAnnual = TIERS[tier].monthly * 12;
    const netTypical = grossTypical - traigentAnnual;
    // ROI = net return ÷ investment. For Free POC (cost=0) we display "Pure win".
    const roiPct = traigentAnnual > 0 ? (netTypical / traigentAnnual) * 100 : null;
    return { llm, engineering, grossTypical, traigentAnnual, netTypical, roiPct };
  }, [monthlySpend, hoursTuningPerMonth, tier]);

  return (
    <>
      <Helmet>
        <title>ROI Calculator · Traigent</title>
        <meta
          name="description"
          content="Estimate how much Traigent could save you on LLM spend and engineering time. Plug in your monthly numbers, see your projected 12-month savings."
        />
        <meta property="og:title" content="Traigent ROI Calculator" />
        <meta
          property="og:description"
          content="See your projected 12-month savings on LLM spend and engineering time."
        />
      </Helmet>

      <section className="bg-[#080808] text-white min-h-screen py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 md:mb-16"
          >
            <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-mono tracking-wider mb-4" style={{ color: BLUE }}>
              ROI CALCULATOR
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              How much could <span style={{ color: BLUE }}>Traigent</span> save you?
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
              The justification for Traigent is <span className="text-white font-semibold">reduced engineering effort</span> + <span className="text-white font-semibold">faster convergence</span> + <span className="text-white font-semibold">confidence in the outcome</span>. LLM cost savings are the <span className="text-[#4D8EF8] font-semibold">huge potential bonus</span>.
            </p>
            <p className="text-sm text-slate-500 max-w-2xl mx-auto mt-3">
              Plug in your numbers. Pick a tier. See your net 12-month ROI both with and without LLM cost reduction.
            </p>
          </motion.div>

          {/* Inputs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid md:grid-cols-2 gap-6 mb-12"
          >
            <Card accent={BLUE}>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-500 mb-3">
                <DollarSign className="w-3.5 h-3.5" />
                Monthly LLM spend
              </div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl md:text-5xl font-bold text-white">{formatUSD(monthlySpend)}</span>
                <span className="text-slate-500 text-sm">/ month</span>
              </div>
              <input
                type="range"
                min="500"
                max="200000"
                step="500"
                value={monthlySpend}
                onChange={(e) => setMonthlySpend(Number(e.target.value))}
                className="w-full accent-[#1A6BF5]"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
                <span>$500</span>
                <span>$200k</span>
              </div>
            </Card>
            <Card accent={BLUE}>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-500 mb-3">
                <Clock className="w-3.5 h-3.5" />
                Engineering hours / month tuning agents
              </div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl md:text-5xl font-bold text-white">{hoursTuningPerMonth}</span>
                <span className="text-slate-500 text-sm">hours</span>
              </div>
              <input
                type="range"
                min="0"
                max="160"
                step="5"
                value={hoursTuningPerMonth}
                onChange={(e) => setHoursTuningPerMonth(Number(e.target.value))}
                className="w-full accent-[#1A6BF5]"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
                <span>0</span>
                <span>160 (1 FTE)</span>
              </div>
            </Card>
          </motion.div>

          {/* Traigent tier selector — needed for true ROI math */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-wider text-slate-500 mb-3">
              <span>Which Traigent tier?</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(TIERS).map(([key, t]) => (
                <button
                  key={key}
                  onClick={() => setTier(key)}
                  className={`text-left rounded-xl p-4 border transition-all ${
                    tier === key
                      ? "bg-[#1A6BF5]/15 border-[#1A6BF5]/60 shadow-[0_0_25px_rgba(26,107,245,0.12)]"
                      : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className={`text-sm font-bold ${tier === key ? "text-[#4D8EF8]" : "text-white"}`}>
                    {t.label}
                  </div>
                  <div className="text-lg font-extrabold text-white mt-1">
                    {t.monthly === 0 ? "$0" : `$${t.monthly}`}
                    <span className="text-xs text-slate-500 font-normal ml-1">/ mo</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 leading-tight">{t.blurb}</div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Headline result — NET ROI after Traigent investment */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-br from-blue-500/10 to-slate-900/0 border-2 rounded-2xl p-8 md:p-10 text-center mb-12"
            style={{ borderColor: BLUE }}
          >
            <div className="text-sm font-mono uppercase tracking-wider text-slate-400 mb-2">
              Net 12-month savings <span className="text-slate-500 normal-case font-sans">(after Traigent cost)</span>
            </div>
            <div className="text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-3" style={{ color: BLUE }}>
              {formatUSD(results.netTypical)}
            </div>
            <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto mb-4">
              <span className="text-white font-semibold">{formatUSD(results.grossTypical)}</span> gross savings
              <span className="text-slate-600"> − </span>
              <span className="text-white font-semibold">{formatUSD(results.traigentAnnual)}</span> Traigent annual cost
              <span className="text-slate-600"> = </span>
              <span className="text-[#4D8EF8] font-bold">{formatUSD(results.netTypical)}</span>
            </p>
            {results.roiPct !== null ? (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A6BF5]/15 border border-[#1A6BF5]/40">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">ROI</span>
                <span className="text-lg font-extrabold" style={{ color: BLUE }}>
                  {Math.round(results.roiPct).toLocaleString()}%
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/15 border border-green-500/40">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Free POC</span>
                <span className="text-lg font-extrabold text-green-300">
                  Pure win — zero investment
                </span>
              </div>
            )}
            <p className="text-xs text-slate-500 mt-4 max-w-2xl mx-auto">
              Gross savings = LLM cost reduction <span className="text-slate-400">{formatUSD(results.llm.typical)}</span> + reclaimed engineer time <span className="text-slate-400">{formatUSD(results.engineering)}</span>.
            </p>
          </motion.div>

          {/* Floor vs bonus — Traigent is justified even at $0 LLM savings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8 mb-12"
          >
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-400 mb-4">
              <span>The floor</span>
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-slate-500">vs. the bonus</span>
            </div>

            <p className="text-base md:text-lg text-slate-200 leading-relaxed mb-6" style={{ textWrap: "balance" }}>
              <span className="text-white font-semibold">Traigent is justified before you save a single dollar on LLM costs.</span>{" "}
              You converge to better accuracy and lower latency <span className="font-semibold text-white">faster, with confidence</span>, and you reclaim engineering time you'd otherwise spend hand-tuning. LLM cost reduction is the bonus on top.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {/* The floor */}
              <div className="bg-slate-950/40 border border-slate-700/50 rounded-xl p-5">
                <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400 mb-2">
                  The floor — engineering only
                </div>
                <div className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                  {formatUSD(results.engineering)}
                </div>
                <div className="text-sm text-slate-400 leading-relaxed">
                  Reclaimed engineer time at $150/hr.
                  {results.traigentAnnual > 0 && (
                    <>
                      {" "}Covers the {TIERS[tier].label} tier{" "}
                      ({formatUSD(results.traigentAnnual)}/yr) when you save more than{" "}
                      <span className="text-white font-semibold">
                        {Math.ceil(results.traigentAnnual / HOURLY_RATE / 12)} hr/month
                      </span>{" "}
                      of tuning effort.
                    </>
                  )}
                </div>
              </div>

              {/* The bonus */}
              <div className="bg-[#1A6BF5]/10 border border-[#1A6BF5]/30 rounded-xl p-5">
                <div className="text-[11px] font-mono uppercase tracking-widest text-[#4D8EF8] mb-2">
                  The bonus — LLM cost reduction
                </div>
                <div className="text-3xl md:text-4xl font-extrabold text-[#4D8EF8] mb-2">
                  {formatUSD(results.llm.typical)}
                </div>
                <div className="text-sm text-slate-400 leading-relaxed">
                  Typical 45% savings on your <span className="text-white font-semibold">{formatUSD(monthlySpend)}/mo</span> LLM spend. Range <span className="text-white font-semibold">{formatUSD(results.llm.conservative)}–{formatUSD(results.llm.optimistic)}</span> depending on baseline.
                </div>
              </div>
            </div>
          </motion.div>

          {/* Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">LLM cost savings range</h2>
            <p className="text-sm text-slate-400 mb-6 max-w-3xl">
              <span className="text-slate-300 font-medium">Modeled estimates</span>, anchored in published research on individual techniques (see references below). Conservative = first optimization pass. Optimistic = after re-optimizing across the agent lifecycle. Actual savings vary by baseline configuration, workload, and quality constraints — a pilot is the only way to know your number.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Stat
                label="Conservative · 30% [1]"
                value={formatUSD(results.llm.conservative)}
                sublabel="matches prompt-compression studies"
                icon={TrendingDown}
                accent="#94a3b8"
              />
              <Stat
                label="Typical · 45% [2]"
                value={formatUSD(results.llm.typical)}
                sublabel="in line with model-routing results"
                icon={TrendingDown}
                accent={BLUE}
              />
              <Stat
                label="Optimistic · 60% [3]"
                value={formatUSD(results.llm.optimistic)}
                sublabel="well below cascading headline of 98%"
                icon={TrendingDown}
                accent="#4ade80"
              />
            </div>
          </motion.div>

          {/* Engineering time breakout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="grid md:grid-cols-3 gap-4 mb-12"
          >
            <Stat
              label="Engineer hours reclaimed"
              value={`${Math.round(hoursTuningPerMonth * HOURS_RECLAIMED_PCT * 12)} hrs`}
              sublabel={`${Math.round(HOURS_RECLAIMED_PCT * 100)}% of manual tuning, automated`}
              icon={Clock}
              accent="#a78bfa"
            />
            <Stat
              label="Equivalent FTE saved"
              value={`${(hoursTuningPerMonth * HOURS_RECLAIMED_PCT * 12 / 2000).toFixed(2)}`}
              sublabel="full-time engineer equivalent"
              icon={Clock}
              accent="#a78bfa"
            />
            <Stat
              label="At $150/hr loaded cost"
              value={formatUSD(results.engineering)}
              sublabel="reclaimed engineer time × rate"
              icon={DollarSign}
              accent="#a78bfa"
            />
          </motion.div>

          {/* References — academic backing for the savings tiers */}
          <motion.div
            id="references"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.37 }}
            className="bg-slate-900/40 border border-slate-800/70 rounded-2xl p-6 md:p-8 mb-12 scroll-mt-20"
          >
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4">
              References
            </div>
            <p className="text-sm text-slate-400 mb-3 max-w-3xl">
              Savings tiers are anchored in published research. Traigent applies these techniques jointly via principled optimization; the cited results show the cost-reduction potential from individual techniques alone.
            </p>
            <p className="text-sm text-slate-300 mb-5 max-w-3xl">
              Intelligently exploring multiple dimensions simultaneously increases the probability of <span className="text-white font-semibold">large cost savings at similar or better response quality</span> — which is what Traigent is all about.
            </p>
            <ol className="space-y-3 text-sm text-slate-400">
              <li>
                <span className="font-mono text-slate-300 mr-2">[1]</span>
                Jiang et al., <em className="text-slate-200">LLMLingua: Compressing Prompts for Accelerated Inference of Large Language Models</em>, Microsoft Research, EMNLP 2023.{" "}
                <a
                  href="https://arxiv.org/abs/2310.05736"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4D8EF8] hover:text-[#1A6BF5] underline underline-offset-2"
                >
                  arXiv:2310.05736
                </a>
                {" "}— up to 20× prompt compression with minimal quality loss.
              </li>
              <li>
                <span className="font-mono text-slate-300 mr-2">[2]</span>
                Ong et al., <em className="text-slate-200">RouteLLM: Learning to Route LLMs with Preference Data</em>, UC Berkeley, 2024.{" "}
                <a
                  href="https://arxiv.org/abs/2406.18665"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4D8EF8] hover:text-[#1A6BF5] underline underline-offset-2"
                >
                  arXiv:2406.18665
                </a>
                {" "}— cost reduction of 2× or more in some settings via query routing, without compromising response quality.
              </li>
              <li>
                <span className="font-mono text-slate-300 mr-2">[3]</span>
                Chen, Zaharia, Zou, <em className="text-slate-200">FrugalGPT: How to Use Large Language Models While Reducing Cost and Improving Performance</em>, Stanford, 2023.{" "}
                <a
                  href="https://arxiv.org/abs/2305.05176"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4D8EF8] hover:text-[#1A6BF5] underline underline-offset-2"
                >
                  arXiv:2305.05176
                </a>
                {" "}— up to 98% cost reduction via LLM cascading at comparable or improved quality.
              </li>
              <li>
                <span className="font-mono text-slate-300 mr-2">[4]</span>
                Bergstra & Bengio, <em className="text-slate-200">Random Search for Hyper-Parameter Optimization</em>, Université de Montréal, JMLR 2012.{" "}
                <a
                  href="https://jmlr.org/papers/v13/bergstra12a.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4D8EF8] hover:text-[#1A6BF5] underline underline-offset-2"
                >
                  JMLR v13
                </a>
                {" "}— random search across multiple hyper-parameters jointly outperforms systematic grid search, because for most problems only a few hyper-parameters matter — and which ones varies by problem.
              </li>
              <li>
                <span className="font-mono text-slate-300 mr-2">[5]</span>
                Fernando et al., <em className="text-slate-200">Promptbreeder: Self-Referential Self-Improvement Via Prompt Evolution</em>, DeepMind, 2023.{" "}
                <a
                  href="https://arxiv.org/abs/2309.16797"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4D8EF8] hover:text-[#1A6BF5] underline underline-offset-2"
                >
                  arXiv:2309.16797
                </a>
                {" "}— evolutionary joint search over prompts outperforms state-of-the-art hand-crafted prompt strategies (Chain-of-Thought, Plan-and-Solve) on arithmetic and commonsense reasoning benchmarks.
              </li>
            </ol>
            <p className="text-xs text-slate-500 mt-5 max-w-3xl">
              These papers benchmark on academic tasks (HellaSwag, MMLU, AlpacaEval, etc.) — not your production agent. Your specific savings depend on baseline configuration and workload, which is what a pilot measures.
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-8 md:p-10 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Want a detailed analysis for your specific agent?
            </h2>
            <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
              In 15 minutes we'll walk through your stack, your current cost structure, and where the optimum likely lives for your KPIs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://meetings-eu1.hubspot.com/amir8"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("demo_booking_clicked", {
                  location: "roi_calculator",
                  monthly_spend: monthlySpend,
                  hours_tuning: hoursTuningPerMonth,
                  gross_savings: Math.round(results.grossTypical),
                  net_savings: Math.round(results.netTypical),
                  tier,
                })}
                className="inline-flex items-center bg-[#1A6BF5] hover:bg-[#4D8EF8] text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                Book a 15-min call
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <a
                href="https://github.com/Traigent/Traigent"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("github_clicked", { location: "roi_calculator" })}
                className="inline-flex items-center border border-slate-600 hover:border-slate-400 text-slate-200 hover:text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                View the SDK on GitHub
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
            <p className="text-xs text-slate-500 mt-6 max-w-2xl mx-auto">
              Estimates assume typical observed savings ranges across early-adopter deployments. Actual savings depend on baseline configuration, accuracy requirements, and traffic volume. Engineering hours assume $150/hour fully-loaded senior ML engineer cost.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
