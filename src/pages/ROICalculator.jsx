import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, TrendingDown, Clock, DollarSign, Github } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { trackEvent } from "../lib/analytics";
import { useSharedSetting } from "../lib/useSharedSetting";
import StartNowModal from "../components/StartNowModal";

const BLUE = "#1A6BF5";

// Savings assumptions. These are the published ranges we stand behind.
// Tune in one place.
const COST_SAVINGS = { conservative: 0.20, typical: 0.40, optimistic: 0.60 };
const DEFAULT_HOURLY_RATE = 100;   // $200k fully-loaded engineer ÷ 2,000 work hours/year
const DEFAULT_MANUAL_HOURS_PER_PASS = 72;  // matches TTM defaults (720 × 20% × 30 min)
const TRAIGENT_HOURS_PER_PASS = 1;  // matches TTM: engineer involvement per optimization pass
const DEFAULT_PASSES_PER_YEAR = 1;  // conservative: one optimization pass per year
const DEFAULT_MONTHLY_SPEND = 3000;  // matches the '$3k Early prod' preset on the spend slider

// Logarithmic mapping for the LLM-spend slider. Linear would push 95% of the
// real-world range into the bottom 5% of the slider. We use 1000 'positions'
// mapped log-scale onto [$100, $200K], rounded to nice round-number $ values.
const SPEND_MIN = 100;
const SPEND_MAX = 200000;
const SPEND_POSITIONS = 1000;
function spendFromPosition(pos) {
  const raw = SPEND_MIN * Math.pow(SPEND_MAX / SPEND_MIN, pos / SPEND_POSITIONS);
  if (raw < 1000)   return Math.round(raw / 50) * 50;
  if (raw < 10000)  return Math.round(raw / 100) * 100;
  if (raw < 100000) return Math.round(raw / 500) * 500;
  return Math.round(raw / 1000) * 1000;
}
function positionFromSpend(spend) {
  const s = Math.max(SPEND_MIN, Math.min(SPEND_MAX, spend));
  return Math.round(
    (Math.log(s / SPEND_MIN) / Math.log(SPEND_MAX / SPEND_MIN)) * SPEND_POSITIONS
  );
}

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
      className="bg-slate-900/60 border rounded-2xl p-6 md:p-8 h-full flex flex-col"
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
  const [showStartNow, setShowStartNow] = useState(false);
  const [monthlySpend, setMonthlySpend] = useState(DEFAULT_MONTHLY_SPEND);
  // Engineering side is now derived from the TTM Calculator's per-pass figure
  // multiplied by a user-set optimization cadence. Both are shared via localStorage.
  const [hourlyRate, setHourlyRate] = useSharedSetting("traigent_hourly_rate", DEFAULT_HOURLY_RATE);
  const [manualHoursPerPass] = useSharedSetting("traigent_manual_hours_per_pass", DEFAULT_MANUAL_HOURS_PER_PASS);
  const [passesPerYear, setPassesPerYear] = useSharedSetting("traigent_passes_per_year", DEFAULT_PASSES_PER_YEAR);
  const [tier, setTier] = useState("starter");
  // Which savings scenario drives the headline math. 'custom' lets the user
  // dial in their own % rather than commit to one of the three published ranges.
  const [savingsScenario, setSavingsScenario] = useState("conservative");
  const [customSavingsPct, setCustomSavingsPct] = useState(15);

  function resetToDefaults() {
    setMonthlySpend(DEFAULT_MONTHLY_SPEND);
    setHourlyRate(DEFAULT_HOURLY_RATE);
    setPassesPerYear(DEFAULT_PASSES_PER_YEAR);
    setTier("starter");
    setSavingsScenario("conservative");
    setCustomSavingsPct(15);
    trackEvent("roi_reset_clicked");
  }

  const results = useMemo(() => {
    const llm = {
      conservative: monthlySpend * COST_SAVINGS.conservative * 12,
      typical: monthlySpend * COST_SAVINGS.typical * 12,
      optimistic: monthlySpend * COST_SAVINGS.optimistic * 12,
    };
    // Pick the LLM savings rate based on the user's chosen scenario.
    const chosenRate =
      savingsScenario === "conservative" ? COST_SAVINGS.conservative :
      savingsScenario === "optimistic"   ? COST_SAVINGS.optimistic :
      savingsScenario === "custom"       ? customSavingsPct / 100 :
      COST_SAVINGS.typical;
    const chosenPctLabel = Math.round(chosenRate * 100);
    const llmChosen = monthlySpend * chosenRate * 12;
    // Engineering savings = (manual hours per pass − Traigent hours per pass)
    //                      × passes per year × hourly rate.
    // Per-pass figures come from the TTM Calculator (shared via localStorage).
    const annualEngineerHoursSaved = Math.max(0, (manualHoursPerPass - TRAIGENT_HOURS_PER_PASS) * passesPerYear);
    const engineering = annualEngineerHoursSaved * hourlyRate;
    // Equivalent monthly hours (for display only).
    const derivedMonthlyHours = (manualHoursPerPass * passesPerYear) / 12;
    const grossChosen = llmChosen + engineering;
    const traigentAnnual = TIERS[tier].monthly * 12;
    const netChosen = grossChosen - traigentAnnual;
    // ROI = net return ÷ investment. For Free POC (cost=0) we display "Pure win".
    const roiPct = traigentAnnual > 0 ? (netChosen / traigentAnnual) * 100 : null;
    return {
      llm,
      llmChosen,
      chosenRate,
      chosenPctLabel,
      engineering,
      annualEngineerHoursSaved,
      derivedMonthlyHours,
      grossChosen,
      // Kept for the floor-vs-bonus block which still anchors on the typical 45%.
      grossTypical: llm.typical + engineering,
      traigentAnnual,
      netChosen,
      // Alias kept for any older reference; net under the chosen scenario.
      netTypical: netChosen,
      roiPct,
    };
  }, [monthlySpend, manualHoursPerPass, passesPerYear, hourlyRate, tier, savingsScenario, customSavingsPct]);

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
          {/* Top action bar — reset button up here so users see they can wipe their inputs anytime */}
          <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 mb-4">
            <p className="text-xs text-slate-400">
              Both <Link to="/ttm" className="text-[#4D8EF8] hover:text-white underline underline-offset-2">TTM</Link> and <Link to="/roi" className="text-[#4D8EF8] hover:text-white underline underline-offset-2">ROI</Link> calculators are always in sync per your inputs. Reset to default settings if you want to start over.
            </p>
            <button
              onClick={resetToDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-700 bg-slate-900/60 text-xs font-mono text-slate-400 hover:text-[#4D8EF8] hover:border-[#4D8EF8]/50 transition-colors flex-shrink-0"
            >
              ↺ Reset all settings to defaults
            </button>
          </div>

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
              Plug in your numbers. Pick a tier. Calculate your 12-month savings.
            </p>
          </motion.div>

          {/* Inputs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            <Card accent={BLUE}>
              <div className="flex items-start gap-2 text-xs font-mono uppercase tracking-wider text-slate-500 mb-3 min-h-[2.5rem]">
                <DollarSign className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span>Monthly LLM spend</span>
              </div>
              <div className="flex items-baseline gap-2 mb-3 min-h-[3.5rem]">
                <span className="text-4xl md:text-5xl font-bold text-white">{formatUSD(monthlySpend)}</span>
                <span className="text-slate-500 text-sm">/ month</span>
              </div>
              {/* Quick presets — let visitors self-segment in one click instead of dragging */}
              <div className="flex flex-wrap gap-1.5 mb-4 min-h-[1.75rem]">
                {[
                  { value: 1000, label: "$1k POC" },
                  { value: 3000, label: "$3k Early prod" },
                  { value: 10000, label: "$10k Mid" },
                ].map((p) => {
                  const active = monthlySpend === p.value;
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => {
                        setMonthlySpend(p.value);
                        trackEvent("roi_spend_preset_clicked", { preset: p.value });
                      }}
                      className={`text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-md border transition-colors ${
                        active
                          ? "border-[#1A6BF5] bg-[#1A6BF5]/15 text-white"
                          : "border-slate-700 text-slate-400 hover:border-[#4D8EF8] hover:text-white"
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-2">
                Or drag to fine-tune
              </div>
              <input
                type="range"
                min="0"
                max={SPEND_POSITIONS}
                step="1"
                value={positionFromSpend(monthlySpend)}
                onChange={(e) => setMonthlySpend(spendFromPosition(Number(e.target.value)))}
                className="w-full accent-[#1A6BF5]"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
                <span>$100</span>
                <span>$1k</span>
                <span>$10k</span>
                <span>$200k</span>
              </div>
              <div className="mt-auto pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 leading-snug min-h-[3.5rem]">
                Your blended monthly inference + embeddings spend across providers and all the agents you've licensed for.
              </div>
            </Card>
            <Card accent={BLUE}>
              <div className="flex items-start gap-2 text-xs font-mono uppercase tracking-wider text-slate-500 mb-3 min-h-[2.5rem]">
                <Clock className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span>Engineering hours / year tuning agents</span>
              </div>
              <div className="flex items-baseline gap-2 mb-3 min-h-[3.5rem]">
                <span className="text-4xl md:text-5xl font-bold text-white">{Math.round(manualHoursPerPass * passesPerYear)}</span>
                <span className="text-slate-500 text-sm">hrs / year</span>
              </div>
              <div className="text-xs text-slate-500 mb-4 leading-snug min-h-[3.5rem] flex items-center">
                <span>= <span className="text-slate-300">{Math.round(manualHoursPerPass)} hrs/pass</span> × <span className="text-white font-bold tabular-nums">{passesPerYear}</span> <span className="text-slate-300">{passesPerYear === 1 ? "pass" : "passes"} / year</span></span>
              </div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-2">
                Optimization passes / year · <span className="text-white font-bold tabular-nums">{passesPerYear} / yr</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                step="1"
                value={passesPerYear}
                onChange={(e) => setPassesPerYear(Number(e.target.value))}
                className="w-full accent-[#1A6BF5]"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
                <span>1 / yr</span>
                <span>12 / yr</span>
              </div>
              <div className="mt-auto pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 leading-snug min-h-[3.5rem]">
                Per-pass hours come from your <Link to="/ttm" className="text-[#4D8EF8] hover:text-[#1A6BF5] underline underline-offset-2">TTM Calculator</Link> settings — adjust the search space there.
              </div>
            </Card>
            <Card accent={BLUE}>
              <div className="flex items-start gap-2 text-xs font-mono uppercase tracking-wider text-slate-500 mb-3 min-h-[2.5rem]">
                <DollarSign className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span>Engineer hourly rate (fully-loaded)</span>
              </div>
              <div className="flex items-baseline gap-2 mb-3 min-h-[3.5rem]">
                <span className="text-4xl md:text-5xl font-bold text-white">${hourlyRate}</span>
                <span className="text-slate-500 text-sm">/ hour</span>
              </div>
              <div className="text-xs mb-4 leading-snug invisible min-h-[3.5rem]" aria-hidden="true">spacer</div>
              <div className="text-[10px] font-mono uppercase tracking-wider mb-2 invisible" aria-hidden="true">spacer</div>
              <input
                type="range"
                min="50"
                max="400"
                step="5"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full accent-[#1A6BF5]"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
                <span>$50</span>
                <span>$400</span>
              </div>
              <div className="mt-auto pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 leading-snug min-h-[3.5rem]">
                Synced with the <Link to="/ttm" className="text-[#4D8EF8] hover:text-[#1A6BF5] underline underline-offset-2">TTM Calculator</Link>.
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
            <p className="text-xs text-slate-500 mt-3 leading-relaxed">
              <span className="text-slate-300 font-semibold">Enterprise ROI is custom-modeled.</span>{" "}
              For high-volume, regulated, or on-prem deployments, the calculator above is illustrative only —{" "}
              <a
                href="https://meetings-eu1.hubspot.com/amir8"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4D8EF8] hover:text-white underline underline-offset-2"
              >
                book 15 min with sales
              </a>{" "}
              and we'll size it to your actual usage, contract terms, and SLA.
            </p>
          </motion.div>

          {/* LLM cost-savings scenario — drives the headline math */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-wider text-slate-500 mb-3">
              <span>LLM savings scenario</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { key: "conservative", label: "Conservative", pct: 20, blurb: "First optimization pass" },
                { key: "typical",      label: "Typical",      pct: 40, blurb: "What we typically target" },
                { key: "optimistic",   label: "Optimistic",   pct: 60, blurb: "Continuous re-optimization" },
                { key: "custom",       label: "Custom",       pct: null, blurb: "Set your own % below" },
              ].map((opt) => {
                const isActive = savingsScenario === opt.key;
                const isCustom = opt.key === "custom";
                // Custom card: show "XX%" placeholder when inactive; show the live customSavingsPct when active.
                const displayPct = isCustom
                  ? (isActive ? `${customSavingsPct}%` : "XX%")
                  : `${opt.pct}%`;
                return (
                  <button
                    key={opt.key}
                    onClick={() => {
                      setSavingsScenario(opt.key);
                      // When Custom is clicked, always reset to 15% so it opens at a clean default.
                      if (isCustom) setCustomSavingsPct(15);
                    }}
                    className={`text-left rounded-xl p-4 border transition-all ${
                      isActive
                        ? "bg-[#1A6BF5]/15 border-[#1A6BF5]/60 shadow-[0_0_25px_rgba(26,107,245,0.12)]"
                        : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className={`text-sm font-bold ${isActive ? "text-[#4D8EF8]" : "text-white"}`}>
                      {opt.label}
                    </div>
                    <div className="text-lg font-extrabold text-white mt-1">
                      {displayPct}
                      <span className="text-xs text-slate-500 font-normal ml-1">savings</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 leading-tight">{opt.blurb}</div>
                  </button>
                );
              })}
            </div>

            {savingsScenario === "custom" && (
              <div className="mt-4 bg-slate-900/40 border border-[#1A6BF5]/30 rounded-xl p-5">
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-500">Custom savings %</span>
                </div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-3xl md:text-4xl font-bold" style={{ color: BLUE }}>{customSavingsPct}%</span>
                  <span className="text-slate-500 text-sm">of monthly LLM spend</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={customSavingsPct}
                  onChange={(e) => setCustomSavingsPct(Number(e.target.value))}
                  className="w-full accent-[#1A6BF5]"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            )}
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
              {formatUSD(results.netChosen)}
            </div>
            <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto mb-4">
              <span className="text-white font-semibold">{formatUSD(results.grossChosen)}</span> gross savings
              <span className="text-slate-600"> − </span>
              <span className="text-white font-semibold">{formatUSD(results.traigentAnnual)}</span> Traigent annual cost
              <span className="text-slate-600"> = </span>
              <span className="text-[#4D8EF8] font-bold">{formatUSD(results.netChosen)}</span>
              <span className="text-slate-600"> · at </span>
              <span className="text-white font-semibold">{results.chosenPctLabel}%</span> LLM savings
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
              Gross savings = LLM cost reduction <span className="text-slate-400">{formatUSD(results.llmChosen)}</span> + reclaimed engineer time <span className="text-slate-400">{formatUSD(results.engineering)}</span>.
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
                  Reclaimed engineer time at ${hourlyRate}/hr.
                  {results.traigentAnnual > 0 && (
                    <>
                      {" "}Covers the {TIERS[tier].label} tier{" "}
                      ({formatUSD(results.traigentAnnual)}/yr) when you save more than{" "}
                      <span className="text-white font-semibold">
                        {Math.ceil(results.traigentAnnual / hourlyRate)} hr/year
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
                  {formatUSD(results.llmChosen)}
                </div>
                <div className="text-sm text-slate-400 leading-relaxed">
                  <span className="text-white font-semibold">{results.chosenPctLabel}%</span> savings on your <span className="text-white font-semibold">{formatUSD(monthlySpend)}/mo</span> LLM spend. Published range: <span className="text-white font-semibold">{formatUSD(results.llm.conservative)}–{formatUSD(results.llm.optimistic)}</span>.
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
              label="Engineer hours reclaimed / year"
              value={`${Math.round(results.annualEngineerHoursSaved)} hrs`}
              sublabel={`(${Math.round(manualHoursPerPass)} − ${TRAIGENT_HOURS_PER_PASS}) hrs/pass × ${passesPerYear} passes`}
              icon={Clock}
              accent="#a78bfa"
            />
            <Stat
              label="Equivalent FTE saved"
              value={`${(results.annualEngineerHoursSaved / 2000).toFixed(2)}`}
              sublabel="full-time engineer equivalent"
              icon={Clock}
              accent="#a78bfa"
            />
            <Stat
              label={`At $${hourlyRate}/hr loaded cost`}
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
                  manual_hours_per_pass: Math.round(manualHoursPerPass),
                  passes_per_year: passesPerYear,
                  gross_savings: Math.round(results.grossChosen),
                  net_savings: Math.round(results.netChosen),
                  tier,
                  savings_scenario: savingsScenario,
                  savings_pct: results.chosenPctLabel,
                })}
                className="inline-flex items-center bg-[#1A6BF5] hover:bg-[#4D8EF8] text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                Book a 15-min call
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={() => {
                  trackEvent("start_now_clicked", { location: "roi_calculator" });
                  setShowStartNow(true);
                }}
                className="inline-flex items-center border border-slate-600 hover:border-slate-400 text-slate-200 hover:text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                <Github className="mr-2 h-4 w-4" />
                Start Now — Free
              </button>
              <Link
                to="/ttm"
                className="inline-flex items-center border border-slate-600 hover:border-slate-400 text-slate-200 hover:text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                See the TTM calculator
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <p className="text-xs text-slate-500 mt-6 max-w-2xl mx-auto">
              Estimates assume typical observed savings ranges across early-adopter deployments. Actual savings depend on baseline configuration, accuracy requirements, and traffic volume. Engineering rate is configurable — default {`$${DEFAULT_HOURLY_RATE}`}/hr ≈ $200k fully-loaded engineer ÷ 2,000 work hours/year.
            </p>
          </motion.div>
        </div>
      </section>
      {showStartNow && <StartNowModal onClose={() => setShowStartNow(false)} />}
    </>
  );
}
