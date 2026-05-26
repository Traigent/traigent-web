// /pitch-short — abbreviated outreach pitch deck.
// Composes the shared PitchDeck shell from PitchFull with its own
// trimmed slides array. Two slides (Configuration Explosion and ROI
// Preview) are forked to have lighter copy than the full deck; everything
// else is imported directly from PitchFull, so iterations on the full
// deck's slides propagate here automatically.
import { ArrowRight } from "lucide-react";
import {
  PitchDeck,
  // Slides reused as-is from the full deck
  SlideOnePagerSummary,
  Slide06KillerStat,
  Slide07FeedbackLoop,
  Slide10Tradeoff,
  Slide11Confidence,
  Slide12BeyondIntro,
  Slide13Benchmark,
  Slide14Tracing,
  Slide15Lifecycle,
  Slide16ThreeInOne,
  Slide19EngineerFirst,
  SlideTTMPreview,
  Slide17Customers,
  Slide20GetStarted,
  Slide21Closing,
} from "./PitchFull";

const BLUE = "#1A6BF5";

// ---------- Custom slide: Configuration Explosion (Short) ----------
// Same content as the full-deck slide, but with a friendlier subtitle
// ("hover over boxes to see details") and the dual-link footer
// (Magnitude blog + TTM calc).
function Slide03ExplosionShort() {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 text-center">The Configuration Explosion</h2>
      <p className="text-xl text-slate-300 mb-12 text-center max-w-3xl mx-auto leading-relaxed">
        Every agent has <span className="text-white font-semibold">hundreds (if not thousands)</span> of tunable variable combinations. See example below — <span className="text-slate-400">hover over boxes to see details</span>
      </p>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 max-w-6xl mx-auto mb-12">
        {[
          {
            label: "Model",
            n: "6",
            options: ["gpt-4o", "gpt-4o-mini", "claude-sonnet-4.6", "claude-haiku-4.5", "gemini-2.0-flash", "llama-3.3-70b"],
            wide: false,
          },
          {
            label: "Prompt variants",
            n: "3",
            options: ["system-v1 (terse)", "system-v2 (verbose)", "system-v3 (chain-of-thought)"],
            wide: false,
          },
          {
            label: "Max tokens",
            n: "3",
            options: ["256", "512", "1024"],
            wide: false,
          },
          {
            label: "Few-shot count",
            n: "4",
            options: ["0-shot", "2-shot", "5-shot", "10-shot"],
            wide: false,
          },
          {
            label: "Self-consistency n",
            n: "3",
            options: ["n = 1 (single)", "n = 3 (vote)", "n = 5 (vote)"],
            wide: false,
          },
          {
            label: "other dimensions",
            n: "20+",
            options: [
              "temperature", "top_p", "top_k",
              "reasoning effort (if reasoning model)",
              "tool-call budget (if agentic)",
              "retrieval k", "chunk size", "chunk overlap", "embedding model",
              "reranker choice", "query-rewrite strategy", "hybrid-search weights",
              "output format (JSON/text/structured)", "tool-selection strategy",
              "frequency penalty", "presence penalty", "stop sequences",
              "retry policy", "timeout", "fallback model", "cache policy",
              "streaming behavior", "validation/repair logic",
            ],
            wide: true,
          },
        ].map((v) => (
          <div
            key={v.label}
            className="group relative bg-slate-900/60 border border-slate-700/50 hover:border-[#4D8EF8]/70 rounded-xl p-4 text-center cursor-help transition-colors"
          >
            <div className="text-3xl font-bold text-white mb-1">{v.n}</div>
            <p className="text-slate-400 text-sm">{v.label}</p>
            <div
              className={`invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity absolute left-1/2 -translate-x-1/2 top-full mt-2 z-30 bg-slate-950 border border-slate-700 rounded-lg p-3 text-left shadow-2xl pointer-events-none ${
                v.wide ? "w-80" : "w-56"
              }`}
            >
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2">
                {v.wide ? "All other tunable dimensions" : "Example values"}
              </div>
              <ul
                className={`text-xs text-slate-300 font-mono ${
                  v.wide ? "grid grid-cols-2 gap-x-3 gap-y-1" : "space-y-1 text-sm"
                }`}
              >
                {v.options.map((opt, i) => (
                  <li key={i} className="truncate">{opt}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center">
        <p className="text-2xl md:text-3xl text-slate-300 mb-2">
          6 × 3 × 3 × 4 × 3 <span className="text-slate-500">(× other)</span> =
        </p>
        <p className="text-6xl md:text-7xl font-extrabold" style={{ color: "#f87171" }}>
          648 configurations <span className="text-slate-500 text-3xl md:text-4xl font-bold">(× other)</span>
        </p>
        <p className="text-lg text-slate-400 mt-4">…each yielding different accuracy, cost, and latency.</p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-6">
          <a
            href="/#/blog/the-config-multiverse"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-base md:text-lg font-medium underline underline-offset-4 decoration-[#4D8EF8]/50 hover:decoration-[#4D8EF8] transition-colors"
            style={{ color: "#4D8EF8" }}
          >
            See the full inventory & A/C/L impacts <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="/#/ttm"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-base md:text-lg font-medium underline underline-offset-4 decoration-[#4D8EF8]/50 hover:decoration-[#4D8EF8] transition-colors"
            style={{ color: "#4D8EF8" }}
          >
            See what this costs in engineer-weeks — TTM Calculator <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

// ---------- Custom slide: ROI preview (Short) ----------
// Same headline + breakdown as the full deck, but the bottom strip is
// just a single centered "Calculate your ROI" link (no engineering-recovery
// callout) and the subtitle is one short sentence.
function SlideROIPreviewShort() {
  return (
    <div className="max-w-6xl mx-auto">
      <div
        className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-mono tracking-widest mb-5"
        style={{ color: "#4D8EF8" }}
      >
        ROI CALCULATOR
      </div>
      <h2 className="text-4xl md:text-6xl font-bold text-white mb-3 tracking-tight">
        <span style={{ color: BLUE }}>Up to 60%</span> savings on LLM costs
      </h2>
      <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-3xl">
        Auto-optimizing the cost-performance saves LLM spend.
      </p>

      <div className="grid md:grid-cols-3 gap-5 mb-10">
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <div className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-2">Conservative</div>
          <div className="text-4xl md:text-5xl font-extrabold mb-1" style={{ color: BLUE }}>20%</div>
          <div className="text-slate-400 text-sm mb-3">on LLM spend</div>
          <div className="text-xs text-slate-500">$5k/mo spend → <span className="text-white">$12k/yr saved</span></div>
        </div>
        <div className="bg-gradient-to-br from-blue-500/15 to-slate-900/0 border-2 rounded-2xl p-6" style={{ borderColor: BLUE }}>
          <div className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "#4D8EF8" }}>Typical</div>
          <div className="text-4xl md:text-5xl font-extrabold mb-1" style={{ color: BLUE }}>40%</div>
          <div className="text-slate-400 text-sm mb-3">on LLM spend</div>
          <div className="text-xs text-slate-500">$5k/mo spend → <span className="text-white">$24k/yr saved</span></div>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <div className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-2">Optimistic</div>
          <div className="text-4xl md:text-5xl font-extrabold mb-1" style={{ color: BLUE }}>60%</div>
          <div className="text-slate-400 text-sm mb-3">on LLM spend</div>
          <div className="text-xs text-slate-500">$5k/mo spend → <span className="text-white">$36k/yr saved</span></div>
        </div>
      </div>

      <p className="text-center text-slate-300 text-base md:text-lg">
        <a
          href="/#/roi"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 underline underline-offset-4 decoration-[#4D8EF8]/50 hover:decoration-[#4D8EF8] font-medium"
          style={{ color: "#4D8EF8" }}
        >
          Calculate your ROI <ArrowRight className="w-4 h-4" />
        </a>
      </p>
    </div>
  );
}

const SHORT_SLIDES = [
  // ----- ONE-PAGER SUMMARY (opener) -----
  { title: "One-Pager Summary", section: "Traigent intro", component: SlideOnePagerSummary },
  // ----- PROBLEM -----
  { title: "The Configuration Explosion", section: "Problem", component: Slide03ExplosionShort },
  // ----- SOLUTION -----
  { title: "Hours, Not Weeks (opener)", section: "Solution", component: Slide06KillerStat },
  { title: "Two Components, One Loop", section: "Solution", component: Slide07FeedbackLoop },
  { title: "You Pick the Tradeoff", section: "Solution", component: Slide10Tradeoff },
  { title: "Confidence to Ship", section: "Solution", component: Slide11Confidence },
  { title: "Beyond Optimization", section: "Solution", component: Slide12BeyondIntro },
  { title: "Self-Improving Benchmark", section: "Solution", component: Slide13Benchmark },
  { title: "Full Observability & Tracing", section: "Solution", component: Slide14Tracing },
  { title: "Across the Lifecycle", section: "Solution", component: Slide15Lifecycle },
  { title: "Three Products In One", section: "Solution", component: Slide16ThreeInOne },
  { title: "Engineer-First Integration", section: "Solution", component: Slide19EngineerFirst },
  // ----- TTM -----
  { title: "Hours, Not Weeks", section: "TTM", component: Slide06KillerStat },
  { title: "Engineer-weeks recovered (TTM Calc)", section: "TTM", component: SlideTTMPreview },
  // ----- ROI -----
  { title: "Up to 60% LLM Cost Savings (ROI Calc)", section: "ROI", component: SlideROIPreviewShort },
  // ----- PROOF -----
  { title: "Customers", section: "Proof", component: Slide17Customers },
  // ----- CTA -----
  { title: "Get Started", section: "CTA", component: Slide20GetStarted },
  { title: "Better Agents. Faster. Lower Spend. Higher Confidence.", section: "CTA", component: Slide21Closing },
];

export default function PitchShort() {
  return <PitchDeck slides={SHORT_SLIDES} />;
}
