import { motion } from "framer-motion";
import {
  Zap,
  TrendingUp,
  Users,
  ArrowRight,
  AlertCircle,
  TrendingDown,
  GitCompare,
  GitMerge,
  SlidersHorizontal,
  LayoutGrid,
  Dices,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

// ============================================================================
// V2's 6 truths — logical chain that leads to the Traigent Solution.
// ============================================================================
const TRUTHS = [
  {
    n: 1,
    summary: "Cost compounds with usage.",
    icon: TrendingUp,
    text:
      "<strong class=\"text-[#4D8EF8]\">Running AI Agents costs money,</strong> and those costs " +
      "<strong class=\"text-white\">compound the more they are used</strong>. ROI depends on quality — but also, " +
      "most importantly, on <strong class=\"text-[#4D8EF8]\">reducing run costs</strong>.",
    blog: { href: "/blog/the-business-case", label: "See the math" },
    refs: [],
  },
  {
    n: 2,
    summary: "The model is one knob of many.",
    icon: SlidersHorizontal,
    text:
      "<strong class=\"text-[#4D8EF8]\">It's NOT all about the model.</strong> Non-model configuration options can affect both " +
      "<strong class=\"text-white\">accuracy and cost dramatically</strong> — so picking the premium model is " +
      "<strong class=\"text-white\">usually not</strong> the smartest path to better ROI.",
    blog: { href: "/blog/the-model-myth", label: "Read 'The Model Myth'" },
    refs: [1, 2, 3, 5],
  },
  {
    n: 3,
    summary: "The search space is too big to brute-force.",
    icon: LayoutGrid,
    text:
      "There are <strong class=\"text-[#4D8EF8]\">hundreds of model and non-model configuration options</strong> to consider, " +
      "so it's <strong class=\"text-[#4D8EF8]\">impractical to manually test them all</strong> before you go to market.",
    blog: { href: "/blog/the-agent-operating-point", label: "The operating-point frame" },
    refs: [4],
  },
  {
    n: 4,
    summary: "Manual tuning is guesswork.",
    icon: Dices,
    text:
      "As a result, teams scramble and resort to <strong class=\"text-[#4D8EF8]\">\"intuitive\" guesswork</strong> — " +
      "releasing whatever they can when time-to-market pressures them. It takes them " +
      "<strong class=\"text-white\">weeks of trial and error</strong> — but " +
      "<strong class=\"text-[#4D8EF8]\">they can never be confident they've found the optimum.</strong>",
    blog: { href: "/blog/the-eval-trap", label: "Why evals mislead" },
    refs: [4],
  },
  {
    n: 5,
    summary: "Untested configs = unrealized savings.",
    icon: TrendingDown,
    text:
      "As a result, it's very likely they <strong class=\"text-[#4D8EF8]\">could have saved a lot of runtime costs</strong>, " +
      "without sacrificing quality, if they could have just managed to test more configurations.",
    blog: { href: "/blog/the-business-case", label: "Quantify the savings" },
    refs: [1, 2, 3],
  },
  {
    n: 6,
    summary: "Yesterday's optimum is today's leak.",
    icon: RefreshCw,
    text:
      "During the lifecycle, <strong class=\"text-[#4D8EF8]\">models evolve</strong>, " +
      "<strong class=\"text-[#4D8EF8]\">usage patterns shift</strong>, and <strong class=\"text-[#4D8EF8]\">prices change</strong>. " +
      "You need to constantly evaluate new configurations.",
    blog: { href: "/blog/the-reoptimization-imperative", label: "Why re-optimize" },
    refs: [],
  },
];

// ============================================================================
// V2's 5 problem-pattern rows.
// ============================================================================
const PROBLEMS = [
  {
    id: "cost-explosion",
    icon: TrendingDown,
    accent: "from-red-500/15 to-orange-500/10",
    problemHeadline: "\"Our AI bill keeps doubling and no one can explain why.\"",
    problemDetail:
      "Same agent. Same product. Different month, very different invoice. The CFO is asking questions Engineering can't answer. The instinct is to throttle features — which kills the value the agent was supposed to create.",
    valueHeadline: "Find the configuration that's 30–60% cheaper at equal or better quality.",
    valueDetail:
      "Traigent searches the full model × prompt × parameter space and converges on the most cost-efficient configuration for your actual benchmark. Then re-runs automatically when prices or models shift.",
    outcome: "Predictable, optimized spend — without sacrificing quality.",
  },
  {
    id: "silent-drift",
    icon: AlertCircle,
    accent: "from-amber-500/15 to-red-500/10",
    problemHeadline: "\"Our agent's quality silently degraded last quarter — and we didn't catch it.\"",
    problemDetail:
      "Nothing alerted you. Logs looked fine. Then a customer escalation revealed answers had been getting worse for weeks. By the time you noticed, retention had taken a hit you'll spend two quarters earning back.",
    valueHeadline: "Drift detection plus automatic re-optimization.",
    valueDetail:
      "Traigent continuously evaluates your agent against the benchmark and triggers a fresh optimization run when quality moves outside tolerance. The fix lands before the support tickets do.",
    outcome: "Stays at peak quality. Always.",
  },
  {
    id: "model-paralysis",
    icon: GitCompare,
    accent: "from-violet-500/15 to-blue-500/10",
    problemHeadline: "\"We can't decide which LLM vendor/flavor to use.\"",
    problemDetail:
      "Every team has an opinion. None of them have hard data on your specific use case. So you ship whichever the loudest engineer prefers and hope. Switching costs make the decision feel permanent.",
    valueHeadline: "Run several of them with many configuration options each.",
    valueDetail:
      "Traigent treats model choice as one more tunable variable. It runs your agent across every candidate and reports cost-quality-latency tradeoffs side by side — for your workload, not a generic eval.",
    outcome: "Model selection backed by evidence, not vibes.",
  },
  {
    id: "model-refresh-pain",
    icon: Zap,
    accent: "from-blue-500/15 to-cyan-500/10",
    problemHeadline: "\"Every new model release means weeks of re-evaluation.\"",
    problemDetail:
      "GPT-5 drops. Claude releases an update. Your competitors ship faster. You can't justify another month of manual re-testing — but you also can't risk shipping on yesterday's optimum.",
    valueHeadline: "Re-converge on the new optimum in hours, not weeks.",
    valueDetail:
      "Same wrapper. Same benchmark. New model. Traigent runs the optimization loop again and returns a new optimum, fully tested, ready to ship. The marginal cost of trying a new model collapses.",
    outcome: "Ship new models the day they drop.",
  },
  {
    id: "regression-cascade",
    icon: GitMerge,
    accent: "from-pink-500/15 to-violet-500/10",
    problemHeadline: "\"Adding a new feature regressed quality on three other paths.\"",
    problemDetail:
      "You tuned for the new use case. It works. Two weeks later you discover the prompt changes you made degraded answer quality on the original use cases. Your team is now playing whack-a-mole across the agent's surface area.",
    valueHeadline: "Multi-KPI weighted optimization across all your use cases.",
    valueDetail:
      "Traigent optimizes against every KPI you care about simultaneously — not just the loudest one. It won't ship a configuration that improves one path at the cost of three others.",
    outcome: "No silent regressions when you ship new capability.",
  },
];

// ============================================================================
// V1's fade-in wrapper (used throughout)
// ============================================================================
const FadeInView = ({ children, className, delay = 0 }) => (
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

// ============================================================================
// V2's QuickScanCard + ProblemRow
// ============================================================================
function QuickScanCard({ p, idx }) {
  const Icon = p.icon;
  return (
    <a
      href={`#${p.id}`}
      onClick={(e) => {
        e.preventDefault();
        document.getElementById(p.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
      className="group block bg-slate-900/40 hover:bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors">
          <Icon className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">
            #{String(idx + 1).padStart(2, "0")}
          </div>
          <div className="text-sm text-slate-200 leading-snug line-clamp-2">
            {p.problemHeadline.replace(/^"|"$/g, "")}
          </div>
        </div>
      </div>
    </a>
  );
}

function ProblemRow({ p, idx }) {
  const Icon = p.icon;
  return (
    <FadeInView>
      <div id={p.id} className="scroll-mt-24 pt-12 pb-12 border-b border-slate-900/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-[11px] font-mono text-slate-500 tracking-widest">
              PROBLEM #{String(idx + 1).padStart(2, "0")}
            </span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>
          <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-6 items-stretch">
            <div className={`relative bg-gradient-to-br ${p.accent} border border-red-500/20 rounded-2xl p-7`}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center text-red-400">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-red-400">
                  The Problem
                </span>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-white leading-snug mb-4">
                {p.problemHeadline}
              </h3>
              <p className="text-slate-400 leading-relaxed">{p.problemDetail}</p>
            </div>
            <div className="hidden lg:flex items-center justify-center w-14">
              <ArrowRight className="w-7 h-7 text-slate-600" />
            </div>
            <div className="flex lg:hidden items-center justify-center py-2">
              <ArrowRight className="w-6 h-6 text-slate-600 rotate-90" />
            </div>
            <div className="relative bg-gradient-to-br from-[#1A6BF5]/10 to-slate-900/40 border border-[#1A6BF5]/40 rounded-2xl p-7 shadow-[0_0_30px_rgba(26,107,245,0.08)]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#1A6BF5]/15 flex items-center justify-center text-[#4D8EF8]">
                  <Zap className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#4D8EF8]">
                  Traigent's Response
                </span>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-white leading-snug mb-4">
                {p.valueHeadline}
              </h3>
              <p className="text-slate-300 leading-relaxed">{p.valueDetail}</p>
              <div className="mt-5 pt-5 border-t border-slate-800/80">
                <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">
                  Outcome
                </div>
                <div className="text-sm text-white font-medium">{p.outcome}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FadeInView>
  );
}

// ============================================================================
// Page
// ============================================================================
export default function ValueProposition() {
  return (
    <div className="bg-slate-950 text-white min-h-screen">
      <Helmet>
        <title>The Problem · Traigent</title>
        <meta name="description" content="Six truths about running AI agents in production that lead to one conclusion: optimization is not optional. Plus five specific pain patterns and how Traigent solves them." />
        <meta property="og:title" content="Traigent — The Problem" />
        <meta property="og:description" content="Six truths that lead to one conclusion. Why AI agent optimization is not optional." />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* ===== Problem section ===== */}
      <section className="relative overflow-hidden border-b border-slate-900 bg-[#080808]">
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/30 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(239,68,68,0.1),transparent_60%)] pointer-events-none" />

        {/* Section hero */}
        <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-12 text-center">
          <FadeInView>
            <div className="inline-flex items-center gap-4 mb-8">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-2xl md:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-red-400">
                The Problem
              </span>
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            </div>
          </FadeInView>
          <FadeInView delay={0.1}>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-[1.05]" style={{ textWrap: "balance" }}>
              Six truths that lead to{" "}
              <span className="text-[#1A6BF5]">one conclusion.</span>
            </h2>
          </FadeInView>
          <FadeInView delay={0.2}>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed" style={{ textWrap: "balance" }}>
              Each truth follows from the previous. Together they explain why optimizing AI agents is not optional.
            </p>
          </FadeInView>
        </div>

        {/* Truths chain */}
        <div className="relative max-w-3xl mx-auto px-6 pb-16">
          {TRUTHS.map((t, i) => {
            const Icon = t.icon;
            return (
            <FadeInView key={t.n} delay={0.05 * i}>
              <div className="relative pl-24 pb-6">
                {i < TRUTHS.length - 1 && (
                  <div className="absolute left-[39px] top-20 bottom-0 w-px bg-gradient-to-b from-slate-700 to-slate-800" />
                )}
                <div className="absolute left-0 top-0 w-20 h-20 rounded-full bg-gradient-to-br from-red-500/25 to-red-500/5 border border-red-500/50 flex flex-col items-center justify-center">
                  <span className="text-[13px] font-mono uppercase tracking-wider text-red-400 leading-tight font-bold">Truth</span>
                  <span className="text-3xl font-extrabold font-mono text-red-300 leading-tight">#{t.n}</span>
                </div>
                <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 ml-2">
                  {t.summary && (
                    <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-800/80">
                      <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-red-300" />
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-white leading-tight" style={{ textWrap: "balance" }}>
                        {t.summary}
                      </h3>
                    </div>
                  )}
                  <p className="text-base md:text-lg text-slate-200 leading-relaxed" style={{ textWrap: "pretty" }} dangerouslySetInnerHTML={{ __html: t.text }} />
                  {(t.blog || (t.refs && t.refs.length > 0)) && (
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                      {t.blog && (
                        <Link
                          to={t.blog.href}
                          className="text-[#4D8EF8] hover:text-[#1A6BF5] inline-flex items-center gap-1 transition-colors"
                        >
                          {t.blog.label} <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                      {t.refs && t.refs.length > 0 && (
                        <span className="text-slate-500 flex items-center gap-1.5 font-mono">
                          <span className="text-slate-600">backed by</span>
                          {t.refs.map((n) => (
                            <Link
                              key={n}
                              to="/roi#references"
                              className="text-slate-400 hover:text-[#4D8EF8] transition-colors"
                              title={`Academic reference ${n} (see ROI calculator)`}
                            >
                              [{n}]
                            </Link>
                          ))}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </FadeInView>
            );
          })}

          {/* The Traigent Solution divider */}
          <FadeInView delay={0.4}>
            <div className="flex flex-col items-center justify-center my-12 gap-4">
              <div className="flex items-center w-full gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#1A6BF5]/60" />
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#1A6BF5]/60" />
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-center">
                <span className="text-white">The </span>
                <span className="text-[#4D8EF8]">Traigent</span>
                <span className="text-white"> Solution</span>
              </h2>
              <div className="flex items-center w-full gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#1A6BF5]/60" />
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#1A6BF5]/60" />
              </div>
            </div>
          </FadeInView>

          {/* Conclusion card 1 — what Traigent does */}
          <FadeInView delay={0.45}>
            <div className="relative bg-gradient-to-br from-[#1A6BF5]/15 to-slate-900/40 border-2 border-[#1A6BF5]/50 rounded-2xl p-7 mb-4 shadow-[0_0_40px_rgba(26,107,245,0.12)]">
              <div className="text-3xl md:text-4xl font-extrabold text-[#4D8EF8] mb-4 tracking-tight">Traigent</div>
              <ul className="space-y-3">
                {[
                  { before: "Finds the optimum in ", blue: "hours, not weeks", after: "." },
                  { before: "", blue: "Automatically", after: ", not manually." },
                  { before: "Requiring only ", blue: "a fraction of the search space", after: " to converge." },
                  { before: "With ", blue: "confidence", after: ", not guesswork." },
                ].map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-lg md:text-xl font-bold text-white leading-snug">
                    <span className="text-[#4D8EF8] mt-1 flex-shrink-0 font-bold">✓</span>
                    <span>
                      {b.before}
                      <span className="text-[#4D8EF8]">{b.blue}</span>
                      {b.after}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeInView>

          {/* Conclusion card 2 — outcomes */}
          <FadeInView delay={0.5}>
            <div className="relative bg-gradient-to-br from-[#1A6BF5]/15 to-slate-900/40 border-2 border-[#1A6BF5]/50 rounded-2xl p-7 shadow-[0_0_40px_rgba(26,107,245,0.12)]">
              <div className="text-3xl md:text-4xl font-extrabold text-[#4D8EF8] mb-4 tracking-tight">Traigent Benefits</div>
              <ul className="space-y-3">
                {[
                  { phrase: "Saves you ", strong: "30–60% on LLM costs", rest: " over the lifecycle." },
                  { phrase: "Reduces ", strong: "engineering costs", rest: "." },
                  { phrase: "Shortens ", strong: "time to market", rest: "." },
                  { phrase: "Increases ", strong: "confidence significantly", rest: "." },
                ].map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-lg md:text-xl font-bold text-white leading-snug">
                    <span className="text-[#4D8EF8] mt-1 flex-shrink-0 font-bold">✓</span>
                    <span>
                      {b.phrase}
                      <strong className="text-white">{b.strong}</strong>
                      {b.rest}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeInView>

          <FadeInView delay={0.55}>
            <div className="text-center mt-8 text-sm text-slate-500">
              <a
                href="#cost-explosion"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("cost-explosion")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors"
              >
                See the five pain patterns in detail <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* Quick scan grid */}
      <section className="bg-slate-950/40 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <FadeInView>
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="text-sm font-mono uppercase tracking-widest text-slate-400">The Five Problems</h2>
              <span className="text-xs text-slate-600 font-mono hidden md:block">click any tile to jump</span>
            </div>
          </FadeInView>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {PROBLEMS.map((p, i) => (
              <FadeInView key={p.id} delay={0.05 * i}>
                <QuickScanCard p={p} idx={i} />
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* 5 detailed rows */}
      {PROBLEMS.map((p, i) => (
        <ProblemRow key={p.id} p={p} idx={i} />
      ))}

      {/* V1 Header — moved here from the top */}
      <header className="bg-gradient-to-br from-slate-950 to-indigo-950 py-12 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-6">
          <FadeInView>
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/057ce2_TraigentLogoWhiteCropped.png"
              alt="Traigent Logo"
              className="h-14 mb-6"
            />
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              The First <span className="text-indigo-400">AI Agents Continuous Optimization</span> Infrastructure
            </h2>
            <p className="text-xl text-slate-300">
              Building AI agents is easy; making them production-ready is not.
            </p>
          </FadeInView>
        </div>
      </header>

      {/* V1 Target Users */}
      <section className="py-12 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-6">
          <FadeInView>
            <h2 className="text-2xl font-bold mb-6">Who It's For</h2>
          </FadeInView>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Users className="w-5 h-5" />, title: "AI Engineers", desc: "SDK integration for code-first optimization" },
              { icon: <TrendingUp className="w-5 h-5" />, title: "No-Code Users", desc: "Studio interface for visual configuration" },
              { icon: <Zap className="w-5 h-5" />, title: "Business Stakeholders", desc: "Goals & ROI tracking with clear metrics" },
            ].map((item, i) => (
              <FadeInView key={i} delay={i * 0.1} className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-indigo-400 flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </div>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* V1 Team */}
      <section className="py-12 border-b border-slate-800 bg-slate-900/30">
        <div className="max-w-5xl mx-auto px-6">
          <FadeInView>
            <h2 className="text-2xl font-bold mb-6">Built By Engineers, For Engineers</h2>
          </FadeInView>
          <div className="grid md:grid-cols-2 gap-8">
            <FadeInView delay={0.1}>
              <h3 className="font-semibold text-lg">Dr. Nimrod Busany</h3>
              <p className="text-indigo-400 text-sm mb-2">Co-founder, CTO</p>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>15+ years Research in Industry & Academy</li>
                <li>Research group lead at Accenture Labs</li>
                <li>20+ Publications & Patents</li>
                <li>IEEE/ACM Committee Member</li>
              </ul>
            </FadeInView>
            <FadeInView delay={0.2}>
              <h3 className="font-semibold text-lg">Achi Solomon</h3>
              <p className="text-indigo-400 text-sm mb-2">Co-founder, CEO</p>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>15+ years R&D Leader (Infra, Backend, DevOps, SRE)</li>
                <li>Improved Time-To-Market from months to days</li>
                <li>Reduced cloud spend by 40%, raised availability to 99.9%</li>
                <li>Expert in scalable cloud-native platforms</li>
              </ul>
            </FadeInView>
          </div>
        </div>
      </section>

      {/* CTA — standard site-wide buttons */}
      <section className="py-12 bg-gradient-to-br from-indigo-900/30 to-purple-900/30">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <FadeInView>
            <h2 className="text-2xl font-bold mb-3">See These Results On Your System</h2>
            <p className="text-slate-300 mb-6">1-week POC to compare results vs. your benchmark</p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://meetings-eu1.hubspot.com/amir8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#1A6BF5] hover:bg-[#4D8EF8] text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Book a 15-min call <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                to="/roi"
                className="inline-flex items-center gap-2 border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Run the ROI calculator
              </Link>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* V1 Footer */}
      <footer className="py-8 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-6 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Traigent Ltd. All rights reserved.</p>
          <p className="mt-2">
            <a href="mailto:nimrod@traigent.ai" className="hover:text-white">nimrod@traigent.ai</a>
            {" | "}
            <a href="mailto:achi@traigent.ai" className="hover:text-white">achi@traigent.ai</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
