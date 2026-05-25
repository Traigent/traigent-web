// One-Pager #2: single-page A4 landscape outreach artifact.
// Same content arc as /one-pager (problem + solution + audience benefits + CTAs)
// compressed into one A4 landscape sheet. Prose paragraphs dropped; numbers and
// links survive. Lives outside the Layout wrapper (no nav), like /one-pager.
import { Helmet } from "react-helmet-async";
import { ArrowRight, Zap, TrendingDown, ShieldCheck } from "lucide-react";
import {
  BLUE,
  BLUE_LIGHT,
  AMBER,
  SITE,
  LOGO_SRC,
  ONEPAGER_STYLE,
} from "../components/OnePagerAtoms";

// ---------- Solution stat (full-size for one-pager-2) ----------
function SolutionStat({ value, label, color }) {
  return (
    <div className="bg-slate-900/70 border-2 rounded-xl p-5 text-center" style={{ borderColor: `${color}66` }}>
      <div className="text-4xl font-extrabold tracking-tight leading-none mb-2" style={{ color }}>
        {value}
      </div>
      <div className="text-[16px] font-mono uppercase tracking-wider text-slate-300 leading-snug">{label}</div>
    </div>
  );
}

function BenefitItem({ children, highlightColor }) {
  if (highlightColor) {
    return (
      <li className="flex items-start gap-2 text-[16px] font-bold leading-snug" style={{ color: highlightColor }}>
        <span className="mt-2 w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: highlightColor }} />
        <span>{children}</span>
      </li>
    );
  }
  return (
    <li className="flex items-start gap-2 text-[16px] text-slate-200 leading-snug">
      <span className="mt-2 w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: BLUE_LIGHT }} />
      <span>{children}</span>
    </li>
  );
}

function FooterLink({ href, children, color = BLUE_LIGHT }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-[14px] font-medium underline underline-offset-4 decoration-current/40 hover:decoration-current transition-colors"
      style={{ color }}
    >
      {children}
      <ArrowRight className="w-3.5 h-3.5" />
    </a>
  );
}

export default function OnePager2() {
  return (
    <>
      <Helmet>
        <title>Traigent — One-Pager #2</title>
        <meta
          name="description"
          content="Single-page Traigent outreach one-pager (variant 2). Problem + solution + dual-audience benefits, condensed to one A4 landscape sheet."
        />
        <meta property="og:title" content="Traigent — One-Pager #2" />
      </Helmet>
      <style>{ONEPAGER_STYLE}</style>
      <div className="bg-slate-950 min-h-screen flex flex-col items-center py-8 print:py-0 overflow-x-auto">
        <section className="relative w-[1123px] h-[794px] bg-[#080808] text-white overflow-hidden flex flex-col px-10 py-6">
          {/* Header band */}
          <div className="flex items-center justify-between mb-3">
            <a
              href={`${SITE}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block hover:opacity-80 transition-opacity"
              aria-label="Traigent — visit homepage"
            >
              <img src={LOGO_SRC} alt="Traigent" className="h-8" />
            </a>
            <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-widest text-slate-500">
              <span>AI Agent Optimization</span>
              <span className="text-slate-700">·</span>
              <span style={{ color: BLUE_LIGHT }}>One-Pager #2 · 1/1</span>
            </div>
          </div>

          {/* Solution hero */}
          <div className="mb-14">
            <h2 className="text-[68px] font-bold tracking-tight leading-[1.05]">
              AI Agent Optimization —<br />
              <span style={{ color: BLUE_LIGHT }}>Fully Automated</span>
            </h2>
            <p className="text-[36px] text-slate-300 leading-snug mt-5">
              <span className="font-bold" style={{ color: AMBER }}>Cost Optimization</span> on top of <span className="font-bold" style={{ color: BLUE_LIGHT }}>Accuracy Optimization</span>
            </p>
          </div>

          {/* Audience headers — sit directly above the stat tiles.
              FinOps on the left so "up to 80%" sits in the eye-catching first position. */}
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div className="flex items-center justify-center gap-2">
              <TrendingDown className="w-6 h-6" style={{ color: AMBER }} />
              <h3 className="text-[20px] font-bold uppercase tracking-wider" style={{ color: AMBER }}>
                For FinOps / CTO
              </h3>
            </div>
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-6 h-6" style={{ color: BLUE_LIGHT }} />
              <h3 className="text-[20px] font-bold uppercase tracking-wider" style={{ color: BLUE_LIGHT }}>
                For Developers / Eng Leads
              </h3>
            </div>
          </div>

          {/* 2 solution stats — audience-grouped under their headers */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <SolutionStat value="up to 80%" label="LLM cost reduction with optimal accuracy" color={AMBER} />
            <SolutionStat value="up to 8 wks" label="Engineering time reclaimed per pass" color={BLUE_LIGHT} />
          </div>

          {/* 2 audience benefits boxes — FinOps on left to match the swap above */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-slate-900/70 border rounded-xl p-5" style={{ borderColor: `${AMBER}55` }}>
              <ul className="space-y-2">
                <BenefitItem><span className="text-white font-semibold">Rapidly converges</span> to <span className="text-white font-semibold">best cost-performance</span></BenefitItem>
                <BenefitItem><span className="text-white font-semibold">Slashes costs</span> while maintaining high quality</BenefitItem>
                <BenefitItem><span className="text-white font-semibold">ROI is immediate</span></BenefitItem>
                <BenefitItem>Recurring savings <span className="text-white font-semibold">for the agent's lifetime</span></BenefitItem>
                <BenefitItem><span className="text-white font-semibold">Control costs</span> with confidence</BenefitItem>
              </ul>
              <div className="pt-3">
                <FooterLink href={`${SITE}/#/roi`} color={AMBER}>Compute your ROI</FooterLink>
              </div>
            </div>
            <div className="bg-slate-900/70 border rounded-xl p-5" style={{ borderColor: `${BLUE}55` }}>
              <ul className="space-y-2">
                <BenefitItem><span className="text-white font-semibold">Rapidly Converges</span> to <span className="text-white font-semibold">Best Accuracy</span></BenefitItem>
                <BenefitItem>Explores the entire configuration space</BenefitItem>
                <BenefitItem>Ship with <span className="text-white font-semibold">100% confidence</span> — <span className="text-white font-semibold">eliminate guesswork</span></BenefitItem>
                <BenefitItem>Re-optimize on every new release <span className="text-white font-semibold">automatically</span></BenefitItem>
                <BenefitItem>Includes <span className="text-white font-semibold">benchmark optimization and observability</span> for free</BenefitItem>
              </ul>
              <div className="pt-3">
                <FooterLink href={`${SITE}/#/ttm`} color={BLUE_LIGHT}>Compute your TTM</FooterLink>
              </div>
            </div>
          </div>

          {/* Bottom band: Free POC badge + CTAs — pushed to bottom of slide */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800 gap-4 mt-auto">
            <span className="flex items-center gap-1.5 text-[13px] text-slate-300">
              <Zap className="w-4 h-4" style={{ color: AMBER }} />
              <span className="text-white font-semibold">Free POC</span>
            </span>
            <div className="flex items-center gap-4">
              <FooterLink href={`${SITE}/#/blog/the-config-multiverse`}>Multiverse</FooterLink>
              <FooterLink href={`${SITE}/#/blog/the-business-case`}>Business case</FooterLink>
              <FooterLink href="https://portal.traigent.ai">Start POC</FooterLink>
              <FooterLink href="https://meetings-eu1.hubspot.com/amir8">Book a call</FooterLink>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
