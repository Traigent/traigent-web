// Outreach one-pager: 2-slide A4 landscape artifact for sales/marketing use.
// Renders at native A4 landscape (1123×794 @ 96 DPI). Print CSS forces one
// slide per page. URL links are absolute https://www.traigent.ai/... so they
// resolve correctly when a recipient clicks them from inside a PDF.
import { Helmet } from "react-helmet-async";
import {
  AlertTriangle,
  Clock,
  Layers,
  Target,
  ArrowRight,
  Zap,
  TrendingDown,
  ShieldCheck,
} from "lucide-react";

const BLUE = "#1A6BF5";
const BLUE_LIGHT = "#4D8EF8";
const AMBER = "#f59e0b";
const RED = "#f87171";
const SITE = "https://www.traigent.ai";

const LOGO_SRC =
  "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/057ce2_TraigentLogoWhiteCropped.png";

// ---------- Small building blocks ----------
function ACTag() {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="inline-block text-[10px] font-mono font-bold px-1.5 py-0.5 rounded"
        style={{ color: BLUE_LIGHT, backgroundColor: `${BLUE}22`, border: `1px solid ${BLUE}55` }}
        title="Affects Accuracy"
      >
        A
      </span>
      <span
        className="inline-block text-[10px] font-mono font-bold px-1.5 py-0.5 rounded"
        style={{ color: AMBER, backgroundColor: `${AMBER}22`, border: `1px solid ${AMBER}55` }}
        title="Affects Cost"
      >
        C
      </span>
    </div>
  );
}

function ProblemPanel({ icon: Icon, title, number, numberColor, line }) {
  return (
    <div className="bg-slate-900/70 border border-slate-700/60 rounded-xl p-5 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-400">
          <Icon className="w-4 h-4" />
          <span className="text-[11px] font-mono uppercase tracking-wider">{title}</span>
        </div>
        <ACTag />
      </div>
      <div className="text-3xl font-extrabold tracking-tight leading-tight" style={{ color: numberColor }}>
        {number}
      </div>
      <p className="text-[13px] text-slate-300 leading-snug">{line}</p>
    </div>
  );
}

function SolutionStat({ value, label, color }) {
  return (
    <div className="bg-slate-900/70 border-2 rounded-xl p-5 text-center" style={{ borderColor: `${color}66` }}>
      <div className="text-4xl font-extrabold tracking-tight leading-none mb-2" style={{ color }}>
        {value}
      </div>
      <div className="text-xs font-mono uppercase tracking-wider text-slate-300 leading-snug">{label}</div>
    </div>
  );
}

function BenefitItem({ children }) {
  return (
    <li className="flex items-start gap-2 text-[13px] text-slate-200 leading-snug">
      <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: BLUE_LIGHT }} />
      <span>{children}</span>
    </li>
  );
}

function FooterLink({ href, children, external }) {
  return (
    <a
      href={href}
      target={external ? "_blank" : "_self"}
      rel={external ? "noopener noreferrer" : undefined}
      className="inline-flex items-center gap-1 text-[13px] font-medium underline underline-offset-4 decoration-[#4D8EF8]/40 hover:decoration-[#4D8EF8] transition-colors"
      style={{ color: BLUE_LIGHT }}
    >
      {children}
      <ArrowRight className="w-3.5 h-3.5" />
    </a>
  );
}

function SlideShell({ slideNo, children }) {
  return (
    <section
      className="relative w-[1123px] h-[794px] bg-[#080808] text-white overflow-hidden flex flex-col px-14 py-10"
      style={{ pageBreakAfter: slideNo === 1 ? "always" : "auto" }}
    >
      {/* Header band */}
      <div className="flex items-center justify-between mb-6">
        <img src={LOGO_SRC} alt="Traigent" className="h-9" />
        <div className="flex items-center gap-4 text-[11px] font-mono uppercase tracking-widest text-slate-500">
          <span>AI Agent Optimization</span>
          <span className="text-slate-700">·</span>
          <span style={{ color: BLUE_LIGHT }}>One-Pager {slideNo}/2</span>
        </div>
      </div>
      {children}
    </section>
  );
}

// ---------- Slide 1: The Problem ----------
function SlideProblem() {
  return (
    <SlideShell slideNo={1}>
      <div className="flex-1 flex flex-col gap-6">
        {/* Title */}
        <div>
          <h1 className="text-[44px] font-bold tracking-tight leading-[1.05]">
            AI Agent Optimization Is <span style={{ color: RED }}>Brutal</span> — and Manual
          </h1>
          <p className="text-[15px] text-slate-300 leading-relaxed mt-3 max-w-4xl">
            Every production agent sits in a multi-thousand-configuration search space. The configuration you ship determines{" "}
            <span className="text-white font-semibold">accuracy for users</span> and the{" "}
            <span className="text-white font-semibold">monthly LLM bill for finance</span> — for as long as the agent runs.
          </p>
        </div>

        {/* 2x2 problem grid */}
        <div className="grid grid-cols-2 gap-4 flex-1">
          <ProblemPanel
            icon={Layers}
            title="1. Configuration multiverse"
            number="~648 → 30,000+"
            numberColor={RED}
            line="Universal knobs alone yield hundreds of configurations. Add reasoning models, tool use, or RAG and you're past 10,000 per agent per workload."
          />
          <ProblemPanel
            icon={Clock}
            title="2. Manual engineering effort"
            number="~324 hrs · 8 FTE-weeks"
            numberColor={RED}
            line="At 30 minutes per config test, a full manual sweep eats months of senior engineering time. Per pass. Per agent. Per re-tune."
          />
          <ProblemPanel
            icon={Target}
            title="3. Confidence sacrificed"
            number="80% of the space, blind"
            numberColor={RED}
            line="Real teams test ~20% of the space and ship. They didn't find the optimum — they found the best of what they happened to check."
          />
          <ProblemPanel
            icon={AlertTriangle}
            title="4. Long time-to-market"
            number="Weeks → months / pass"
            numberColor={RED}
            line="Re-optimization is so painful it gets skipped. Configurations drift as models, prices, and usage patterns evolve. Silent ROI leak."
          />
        </div>

        {/* Footer links */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div className="text-[11px] font-mono uppercase tracking-widest text-slate-500">
            <span style={{ color: BLUE_LIGHT }}>A</span> Accuracy ·{" "}
            <span style={{ color: AMBER }}>C</span> Cost — every problem hits both
          </div>
          <div className="flex items-center gap-5">
            <FooterLink href={`${SITE}/#/blog/the-config-multiverse`} external>
              See the full multiverse
            </FooterLink>
            <FooterLink href={`${SITE}/#/ttm`} external>
              Compute your TTM
            </FooterLink>
            <FooterLink href={`${SITE}/#/roi`} external>
              Compute your ROI
            </FooterLink>
          </div>
        </div>
      </div>
    </SlideShell>
  );
}

// ---------- Slide 2: The Solution ----------
function SlideSolution() {
  return (
    <SlideShell slideNo={2}>
      <div className="flex-1 flex flex-col gap-5">
        {/* Title */}
        <div>
          <h1 className="text-[44px] font-bold tracking-tight leading-[1.05]">
            Traigent — <span style={{ color: BLUE_LIGHT }}>Automated</span> AI Agent Optimization
          </h1>
          <p className="text-[15px] text-slate-300 leading-relaxed mt-3 max-w-4xl">
            One hour of engineer setup. The optimizer runs unattended. You ship the converged
            optimum — not the best of what you happened to test.
          </p>
        </div>

        {/* 3 headline stats */}
        <div className="grid grid-cols-3 gap-4">
          <SolutionStat value="~1 hr" label="Engineer time per optimization pass" color={BLUE_LIGHT} />
          <SolutionStat value="30–60%" label="LLM cost reduction at same accuracy" color={AMBER} />
          <SolutionStat value="8 FTE-wks" label="Engineering time reclaimed per pass" color={BLUE_LIGHT} />
        </div>

        {/* Two audience columns */}
        <div className="grid grid-cols-2 gap-4 flex-1">
          <div className="bg-slate-900/70 border border-slate-700/60 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4" style={{ color: BLUE_LIGHT }} />
              <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: BLUE_LIGHT }}>
                For Developers / Eng Leads
              </h3>
            </div>
            <ul className="space-y-2.5">
              <BenefitItem>Search the <span className="text-white font-semibold">full</span> configuration space — not a 20% slice</BenefitItem>
              <BenefitItem>Reclaim <span className="text-white font-semibold">8+ FTE-weeks</span> per optimization pass</BenefitItem>
              <BenefitItem>Ship with <span className="text-white font-semibold">100% confidence</span> in your optimum</BenefitItem>
              <BenefitItem>Re-optimize on every model release in <span className="text-white font-semibold">hours, not weeks</span></BenefitItem>
            </ul>
          </div>
          <div className="bg-slate-900/70 border rounded-xl p-5" style={{ borderColor: `${AMBER}55` }}>
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="w-4 h-4" style={{ color: AMBER }} />
              <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: AMBER }}>
                For FinOps / CTO
              </h3>
            </div>
            <ul className="space-y-2.5">
              <BenefitItem><span className="text-white font-semibold">30–60% LLM cost reduction</span> at the same accuracy</BenefitItem>
              <BenefitItem>Payback typically <span className="text-white font-semibold">&lt; 1 month</span> at $10K+ monthly spend</BenefitItem>
              <BenefitItem>Recurring savings <span className="text-white font-semibold">for the agent's lifetime</span></BenefitItem>
              <BenefitItem>Tier-based pricing <span className="text-white font-semibold">scales with agent volume</span></BenefitItem>
            </ul>
          </div>
        </div>

        {/* How it works ribbon */}
        <div className="flex items-center justify-between bg-slate-900/50 border border-slate-800 rounded-xl px-5 py-3">
          <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400">How it works</div>
          <div className="flex items-center gap-3 text-[13px]">
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold" style={{ backgroundColor: `${BLUE}33`, color: BLUE_LIGHT }}>1</span>
              <span className="text-slate-200"><span className="text-white font-semibold">Define</span> — wrap your agent, declare KPIs</span>
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold" style={{ backgroundColor: `${BLUE}33`, color: BLUE_LIGHT }}>2</span>
              <span className="text-slate-200"><span className="text-white font-semibold">Optimize</span> — searches the space overnight</span>
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold" style={{ backgroundColor: `${BLUE}33`, color: BLUE_LIGHT }}>3</span>
              <span className="text-slate-200"><span className="text-white font-semibold">Ship</span> — promote with full evidence</span>
            </span>
          </div>
        </div>

        {/* Footer links / CTAs */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" style={{ color: AMBER }} />
            <span className="text-[12px] text-slate-300">
              <span className="text-white font-semibold">Free POC</span> — zero investment, one agent, overnight optimum
            </span>
          </div>
          <div className="flex items-center gap-5">
            <FooterLink href="https://meetings-eu1.hubspot.com/amir8" external>
              Book 15-min call
            </FooterLink>
            <FooterLink href="https://portal.traigent.ai" external>
              Start free POC
            </FooterLink>
            <FooterLink href={`${SITE}/#/blog/the-business-case`} external>
              Business case
            </FooterLink>
            <FooterLink href={`${SITE}/#/roi`} external>
              ROI on your numbers
            </FooterLink>
          </div>
        </div>
      </div>
    </SlideShell>
  );
}

export default function OnePager() {
  return (
    <>
      <Helmet>
        <title>Traigent — One-Pager</title>
        <meta
          name="description"
          content="Traigent at a glance for outreach. Two slides: the brutal magnitude of manual AI agent optimization, and the automated alternative. Built for engineering leads and FinOps."
        />
        <meta property="og:title" content="Traigent — One-Pager" />
        <meta property="og:description" content="Two-slide outreach one-pager. Problem + solution. For Devs and FinOps." />
      </Helmet>
      {/* Print CSS: A4 landscape, no page margins, hide scroll container chrome */}
      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 0; }
          html, body { background: #080808; margin: 0; padding: 0; }
        }
      `}</style>
      <div className="bg-slate-950 min-h-screen flex flex-col items-center gap-8 py-8 print:gap-0 print:py-0 overflow-x-auto">
        <SlideProblem />
        <SlideSolution />
      </div>
    </>
  );
}
