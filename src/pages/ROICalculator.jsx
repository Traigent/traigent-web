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

  const results = useMemo(() => {
    const llm = {
      conservative: monthlySpend * COST_SAVINGS.conservative * 12,
      typical: monthlySpend * COST_SAVINGS.typical * 12,
      optimistic: monthlySpend * COST_SAVINGS.optimistic * 12,
    };
    const engineering = hoursTuningPerMonth * HOURS_RECLAIMED_PCT * HOURLY_RATE * 12;
    const totalTypical = llm.typical + engineering;
    return { llm, engineering, totalTypical };
  }, [monthlySpend, hoursTuningPerMonth]);

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
              Plug in two numbers. See your projected 12-month savings on LLM spend and engineering time.
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

          {/* Headline result */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-br from-blue-500/10 to-slate-900/0 border-2 rounded-2xl p-8 md:p-10 text-center mb-12"
            style={{ borderColor: BLUE }}
          >
            <div className="text-sm font-mono uppercase tracking-wider text-slate-400 mb-2">
              Projected 12-month savings
            </div>
            <div className="text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-3" style={{ color: BLUE }}>
              {formatUSD(results.totalTypical)}
            </div>
            <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
              Combined: <span className="text-white font-semibold">{formatUSD(results.llm.typical)}</span> in LLM cost reduction + <span className="text-white font-semibold">{formatUSD(results.engineering)}</span> in reclaimed engineer time.
            </p>
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
              Range reflects what we typically observe across design partners. Conservative = first optimization pass. Optimistic = after re-optimizing across the agent lifecycle.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Stat
                label="Conservative · 30%"
                value={formatUSD(results.llm.conservative)}
                sublabel="first optimization run"
                icon={TrendingDown}
                accent="#94a3b8"
              />
              <Stat
                label="Typical · 45%"
                value={formatUSD(results.llm.typical)}
                sublabel="recommended target"
                icon={TrendingDown}
                accent={BLUE}
              />
              <Stat
                label="Optimistic · 60%"
                value={formatUSD(results.llm.optimistic)}
                sublabel="continuous re-optimization"
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
                  projected_savings: Math.round(results.totalTypical),
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
