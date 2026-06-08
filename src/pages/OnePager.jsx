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
import {
  BLUE,
  BLUE_LIGHT,
  AMBER,
  RED,
  SITE,
  ATag,
  CTag,
  ACTag,
  ONEPAGER_STYLE,
} from "../components/OnePagerAtoms";
import BrandMark from "../components/BrandMark";
import { usePageView } from "../lib/usePageView";

function ProblemPanel({ icon: Icon, title, number, numberColor, line, extra, linkHref, linkLabel }) {
  return (
    <div className="bg-slate-900/70 border border-slate-700/60 rounded-xl p-5 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5" style={{ color: BLUE_LIGHT }} />
          <span className="text-base font-bold tracking-tight text-white">{title}</span>
        </div>
        <ACTag />
      </div>
      <div className="text-3xl font-extrabold tracking-tight leading-tight" style={{ color: numberColor }}>
        {number}
      </div>
      <p className="text-[13px] text-slate-300 leading-snug">{line}</p>
      {extra}
      {linkHref && (
        <div className="mt-auto pt-1">
          <a
            href={linkHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[12px] font-medium underline underline-offset-4 decoration-[#4D8EF8]/40 hover:decoration-[#4D8EF8] transition-colors"
            style={{ color: BLUE_LIGHT }}
          >
            {linkLabel}
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      )}
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
        <a
          href={`${SITE}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block hover:opacity-80 transition-opacity"
          aria-label="Traigent — visit homepage"
        >
          <BrandMark size="lg" />
        </a>
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
            Hundreds if not thousands of configuration options to consider. The configuration you ship determines{" "}
            <span className="font-bold" style={{ color: BLUE_LIGHT }}>accuracy</span> <ATag /> for users and the{" "}
            <span className="font-bold" style={{ color: AMBER }}>monthly LLM bill</span> <CTag /> for finance — for as long as the agent runs.
          </p>
        </div>

        {/* 2x2 problem grid — equal-sized rows so panels don't auto-size to content */}
        <div className="grid grid-cols-2 grid-rows-2 gap-4 flex-1">
          <ProblemPanel
            icon={Layers}
            title="1. Massive configuration multiverse"
            number="~648 → 30,000+"
            numberColor={RED}
            line="Universal knobs alone yield hundreds of configuration options. Add reasoning models, tool use, or RAG and you're past 30,000 per agent per workload."
            extra={
              <p className="text-[12px] text-slate-300 leading-snug">
                <span className="font-mono">
                  (models) × (15+ agent options) × (10+ LLM options) ={" "}
                  <span className="text-white font-bold">millions of options</span>.
                </span>{" "}
                Each may impact{" "}
                <span style={{ color: BLUE_LIGHT }} className="font-semibold">Accuracy</span>{" "}
                and{" "}
                <span style={{ color: AMBER }} className="font-semibold">Cost</span>{" "}
                significantly.
              </p>
            }
            linkHref={`${SITE}/#/blog/the-config-multiverse`}
            linkLabel="See the full multiverse"
          />
          <ProblemPanel
            icon={Clock}
            title="2. Manual engineering effort"
            number="~324 hrs · 8 FTE-weeks"
            numberColor={RED}
            line="At 30 minutes per config test, a full manual sweep eats months of senior engineering time. Per pass. Per agent. Per re-tune."
            extra={
              <p className="text-[13px] text-slate-300 leading-snug">
                And you may be missing many important knob options.
              </p>
            }
            linkHref={`${SITE}/#/ttm`}
            linkLabel="Compute your TTM"
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
            <FooterLink href={`${SITE}/#/roi`} external>
              Compute your ROI
            </FooterLink>
            <FooterLink href="https://meetings-eu1.hubspot.com/amir8" external>
              Book a 15-min call
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
            One-time 1 hr setup. Optimizer runs unattended for a few hours. You ship the
            optimum — with confidence — Fast.
          </p>
        </div>

        {/* 3 headline stats */}
        <div className="grid grid-cols-3 gap-4">
          <SolutionStat value="1 hr" label="One-time setup effort" color={BLUE_LIGHT} />
          <SolutionStat value="up to 8 wks" label="Engineering time reclaimed per pass" color={BLUE_LIGHT} />
          <SolutionStat value="20–60%" label="Potential LLM cost reduction at same accuracy" color={AMBER} />
        </div>

        {/* Two audience columns */}
        <div className="grid grid-cols-2 gap-4 flex-1">
          <div className="bg-slate-900/70 border border-slate-700/60 rounded-xl p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4" style={{ color: BLUE_LIGHT }} />
              <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: BLUE_LIGHT }}>
                For Developers / Eng Leads
              </h3>
            </div>
            <ul className="space-y-2">
              <BenefitItem>Utilize the <span className="text-white font-semibold">full</span> configuration space — not a 20% slice you guess</BenefitItem>
              <BenefitItem>Reclaim up to <span className="text-white font-semibold">8+ FTE-weeks</span> per optimization pass</BenefitItem>
              <BenefitItem>Ship with <span className="text-white font-semibold">100% confidence</span> in your optimum</BenefitItem>
              <BenefitItem>Re-optimize on every new release in <span className="text-white font-semibold">hours, not weeks</span></BenefitItem>
              <BenefitItem>Helps you improve your <span className="text-white font-semibold">benchmark test bed</span></BenefitItem>
              <BenefitItem>Includes <span className="text-white font-semibold">Evaluation and Observability</span> for free</BenefitItem>
            </ul>
            <div className="mt-auto pt-3">
              <a
                href={`${SITE}/#/ttm`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[12px] font-medium underline underline-offset-4 decoration-[#4D8EF8]/40 hover:decoration-[#4D8EF8] transition-colors"
                style={{ color: BLUE_LIGHT }}
              >
                Compute your TTM
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
          <div className="bg-slate-900/70 border rounded-xl p-5 flex flex-col" style={{ borderColor: `${AMBER}55` }}>
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="w-4 h-4" style={{ color: AMBER }} />
              <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: AMBER }}>
                For FinOps / CTO
              </h3>
            </div>
            <ul className="space-y-2.5">
              <BenefitItem><span className="text-white font-semibold">20–60% potential LLM cost reduction</span> at the same accuracy, confirmed by pilot</BenefitItem>
              <BenefitItem><span className="text-white font-semibold">ROI is almost immediate</span></BenefitItem>
              <BenefitItem>Recurring savings <span className="text-white font-semibold">for the agent's lifetime</span></BenefitItem>
              <BenefitItem>Tier-based pricing <span className="text-white font-semibold">scales with agent volume</span></BenefitItem>
            </ul>
            <div className="mt-auto pt-3">
              <a
                href={`${SITE}/#/roi`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[12px] font-medium underline underline-offset-4 decoration-[#f59e0b]/40 hover:decoration-[#f59e0b] transition-colors"
                style={{ color: AMBER }}
              >
                Compute your ROI
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* How it works ribbon */}
        <div className="flex items-center justify-between bg-slate-900/50 border border-slate-800 rounded-xl px-5 py-3">
          <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400">How it works</div>
          <div className="flex items-center gap-3 text-[13px]">
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold" style={{ backgroundColor: `${BLUE}33`, color: BLUE_LIGHT }}>1</span>
              <span className="text-slate-200"><span className="text-white font-semibold">Setup</span> — define KPIs, wrap agent</span>
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold" style={{ backgroundColor: `${BLUE}33`, color: BLUE_LIGHT }}>2</span>
              <span className="text-slate-200"><span className="text-white font-semibold">Optimize</span> — automatically in hours not weeks</span>
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold" style={{ backgroundColor: `${BLUE}33`, color: BLUE_LIGHT }}>3</span>
              <span className="text-slate-200"><span className="text-white font-semibold">Ship</span> — fast with confidence</span>
            </span>
          </div>
        </div>

        {/* Footer links / CTAs */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" style={{ color: AMBER }} />
            <span className="text-[12px] text-slate-300">
              <span className="text-white font-semibold">Free POC</span> — that includes optimization, evaluation and observability
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
          </div>
        </div>
      </div>
    </SlideShell>
  );
}

export default function OnePager() {
  usePageView();
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
      {/* Print CSS + HubSpot chat suppression — shared across both one-pager routes */}
      <style>{ONEPAGER_STYLE}</style>
      <div className="bg-slate-950 min-h-screen flex flex-col items-center gap-8 py-8 print:gap-0 print:py-0 overflow-x-auto">
        <SlideProblem />
        <SlideSolution />
      </div>
    </>
  );
}
