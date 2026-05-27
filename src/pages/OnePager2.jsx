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
  ONEPAGER_STYLE,
} from "../components/OnePagerAtoms";
import BrandMark from "../components/BrandMark";

// ---------- Solution stat (full-size for one-pager-2) ----------
function SolutionStat({ value, label, color }) {
  return (
    <div className="bg-slate-900/70 border-2 rounded-xl px-5 py-3 text-center" style={{ borderColor: `${color}66` }}>
      <div className="text-4xl font-extrabold tracking-tight leading-none mb-1" style={{ color }}>
        {value}
      </div>
      <div className="text-[15px] font-mono uppercase tracking-wider text-slate-300 leading-snug">{label}</div>
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

// The slide content as a standalone reusable component — used by:
//   - <OnePager2 /> (the /one-pager-2 page route, full A4 landscape for PDF export)
//   - PitchFull deck (second slide, header + footer hidden so the content
//     fits in the deck slide stage without scrolling)
// When both `showHeader` and `showFooter` are true, the section keeps its
// fixed A4 landscape dimensions so puppeteer captures a clean 794px-tall PDF.
// Otherwise the height collapses to content, which is what we want in the deck.
export function OnePager2Slide({ showHeader = true, showFooter = true, costStatValue = "up to 60%" }) {
  const useFixedHeight = showHeader && showFooter;
  return (
    <section
      className={`relative w-[1280px] ${useFixedHeight ? "h-[720px]" : ""} bg-[#080808] text-white overflow-hidden flex flex-col px-10 ${showHeader ? "pt-4" : "pt-1"} pb-4`}
    >
      {showHeader && (
        <div className="flex items-center justify-between mb-3">
          <a
            href={`${SITE}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block hover:opacity-80 transition-opacity"
            aria-label="Traigent — visit homepage"
          >
            <BrandMark size="md" />
          </a>
          <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-widest text-slate-500">
            <span>AI Agent Optimization</span>
            <span className="text-slate-700">·</span>
            <span style={{ color: BLUE_LIGHT }}>One-Pager #2 · 1/1</span>
          </div>
        </div>
      )}

      {/* Solution hero */}
          <div className="mb-12 text-center">
            <h2 className="text-[56px] font-bold tracking-tight leading-[1.05]">
              AI Agent Optimization —<br />
              <span style={{ color: BLUE_LIGHT }}>Fully Automated</span>
            </h2>
            <p className="text-[28px] text-slate-300 leading-snug mt-3">
              <span className="font-bold text-white">Rapidly</span> finds <span className="font-bold" style={{ color: AMBER }}>Low Cost</span> and <span className="font-bold" style={{ color: BLUE_LIGHT }}>High Accuracy</span> options
            </p>
            <p className="text-[28px] text-slate-300 leading-snug mt-1">
              among{" "}
              <a
                href={`${SITE}/#/blog/the-config-multiverse`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-white underline underline-offset-4 decoration-white/40 hover:decoration-white transition-colors"
              >
                thousands possible
              </a>
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
            <SolutionStat value={costStatValue} label="LLM cost reduction" color={AMBER} />
            <SolutionStat value="up to 8 wks" label="Engineering time reclaimed" color={BLUE_LIGHT} />
          </div>

          {/* 2 audience benefits boxes — FinOps on left to match the swap above */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-slate-900/70 border rounded-xl p-5" style={{ borderColor: `${AMBER}55` }}>
              <ul className="space-y-2">
                <BenefitItem><span className="text-white font-semibold">Rapidly Converge</span> to <span className="font-semibold">Best </span><span className="font-semibold" style={{ color: AMBER }}>Cost</span><span className="font-semibold">-</span><span className="font-semibold" style={{ color: BLUE_LIGHT }}>Performance</span></BenefitItem>
                <BenefitItem><span className="text-white font-semibold">Slash costs</span> while maintaining high quality</BenefitItem>
                <BenefitItem>Recurring savings <span className="text-white font-semibold">through agent's lifetime</span></BenefitItem>
                <BenefitItem><span className="text-white font-semibold">Faster TTM</span>, <span className="text-white font-semibold">More productivity</span></BenefitItem>
              </ul>
              <div className="pt-3">
                <FooterLink href={`${SITE}/#/roi`} color={AMBER}>Compute your ROI</FooterLink>
              </div>
            </div>
            <div className="bg-slate-900/70 border rounded-xl p-5" style={{ borderColor: `${BLUE}55` }}>
              <ul className="space-y-2">
                <BenefitItem><span className="text-white font-semibold">Rapidly Converge</span> to <span className="font-semibold" style={{ color: BLUE_LIGHT }}>Best Accuracy</span></BenefitItem>
                <BenefitItem>Ship <span className="text-white font-semibold">fast</span> with <span className="text-white font-semibold">100% confidence</span> — <span className="text-white font-semibold">no guesswork</span></BenefitItem>
                <BenefitItem>Re-optimize on every new release</BenefitItem>
                <BenefitItem><span className="text-white font-semibold">Observability and benchmark optimization</span> included</BenefitItem>
              </ul>
              <div className="pt-3">
                <FooterLink href={`${SITE}/#/ttm`} color={BLUE_LIGHT}>Compute your TTM</FooterLink>
              </div>
            </div>
          </div>

      {showFooter && (
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
      )}
    </section>
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
        <OnePager2Slide showHeader={true} />
      </div>
    </>
  );
}
