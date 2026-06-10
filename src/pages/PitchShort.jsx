// /pitch-short — abbreviated outreach pitch deck.
// Composes the shared PitchDeck shell from PitchFull with its own trimmed
// slides array. Two slides (Configuration Explosion and ROI Preview) are
// rendered through PitchFull's originals with override props for the
// subtitle / footer; everything else is imported directly. No structural
// JSX is duplicated from PitchFull.
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowDown, ArrowUp, ChevronsDown, DollarSign, Check, Clock, ShieldCheck, TrendingDown, TrendingUp, X } from "lucide-react";
import StartNowModal from "../components/StartNowModal";

// Shared optimizer ring — clockwise Learn → Deduce → <thirdLabel> → Repeat
// loop. Used by slide 1, slide 2 (BEFORE/TRAIGENT/AFTER middle panel — also
// rendered on the homepage hero), and slide 24 (Market Opportunity THE
// CURE). `thirdLabel` defaults to "TEST" so the homepage stays unchanged;
// the /investor-pitch slide 1 passes "EVALUATE" explicitly.
// Gradient id is parameterized so multiple instances on the same page
// don't collide.
function OptimizerRing({ size = 190, gradientId = "ringGrad", thirdLabel = "TEST" }) {
  return (
    <svg viewBox="0 0 240 240" className="flex-shrink-0" style={{ width: size, height: size }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4D8EF8"/>
          <stop offset="100%" stopColor="#1A6BF5"/>
        </linearGradient>
      </defs>
      <circle cx="120" cy="120" r="82" fill="none" stroke="#1e293b" strokeWidth="14"/>
      <path
        d="M 120 38 A 82 82 0 1 1 38 120"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="14"
        strokeLinecap="round"
      />
      <polygon points="38,96 22,128 54,128" fill="#1A6BF5"/>
      <circle cx="120" cy="120" r="58" fill="#020617" stroke="#334155" strokeWidth="1"/>
      <text x="120" y="101" textAnchor="middle" fill="#cbd5e1" fontSize="13" fontFamily="ui-sans-serif, system-ui" fontWeight="700">LEARN</text>
      <text x="120" y="119" textAnchor="middle" fill="#cbd5e1" fontSize="13" fontFamily="ui-sans-serif, system-ui" fontWeight="700">DEDUCE</text>
      <text x="120" y="137" textAnchor="middle" fill="#cbd5e1" fontSize="13" fontFamily="ui-sans-serif, system-ui" fontWeight="700">{thirdLabel}</text>
      <text x="120" y="155" textAnchor="middle" fill="#cbd5e1" fontSize="13" fontFamily="ui-sans-serif, system-ui" fontWeight="700">REPEAT</text>
    </svg>
  );
}
import {
  OptimizationEngineBody,
  FeedbackLoopConnector,
  AgentWrapperBody,
  BenchmarkCardBody,
  ObservabilityCardBody,
} from "../components/PlatformShowcase";
import { ConvergenceDiagram, KillerStatsGrid } from "./pitch/shared";
import SlideOptimizationInActionDemo from "./pitch/SlideOptimizationInActionDemo";
import {
  PitchDeck,
  SlideOnePagerSummary,
  Slide03Explosion,
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
  SlideROIPreview,
  Slide17Customers,
  Slide20GetStarted,
  Slide21Closing,
} from "./PitchFull";

// Slide 2 in the short deck: same body as the full deck, friendlier
// subtitle pointing readers at the hoverable tiles below.
function Slide03ExplosionShort() {
  return (
    <Slide03Explosion
      subtitle={
        <>
          Every agent has <span className="text-white font-semibold">hundreds (if not thousands)</span> of tunable variable combinations. See example below — <span className="text-slate-400">hover over boxes to see details</span>
        </>
      }
    />
  );
}

// Slide 15: same body as the full deck, with a single centered "Calculate
// your ROI" link in place of the "Plus engineering recovery" callout.
// Slide 20: same body as the full deck, but the "Book a pilot" CTA points to
// traigent.ai's /get-started page instead of the HubSpot meeting scheduler.
// The /pitch-short-2 deck is shared externally and must keep links on-domain.
function Slide20GetStartedShort() {
  return <Slide20GetStarted bookingHref="https://www.traigent.ai/#/get-started" />;
}

function SlideROIPreviewShort() {
  return (
    <SlideROIPreview
      subtitle="Auto-optimizing the cost-performance saves LLM spend."
      footer={
        <p className="text-center text-slate-300 text-base md:text-lg">
          <a
            href="https://www.traigent.ai/#/roi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 underline underline-offset-4 decoration-[#4D8EF8]/50 hover:decoration-[#4D8EF8] font-medium"
            style={{ color: "#4D8EF8" }}
          >
            Calculate your ROI <ArrowRight className="w-4 h-4" />
          </a>
        </p>
      }
    />
  );
}

// Slide: Agent Optimization Platform — two-box layout pasted as-is from the
// homepage product section (shared bodies in components/PlatformShowcase).
function SlidePlatformBoxes() {
  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white">Agent Optimization Platform</h2>
      </div>
      <div className="flex flex-col gap-6 items-stretch lg:grid lg:grid-cols-[1fr_180px_1fr] lg:gap-6">
        <div className="flex-1 bg-slate-900/60 border border-slate-700/50 rounded-2xl p-8">
          <OptimizationEngineBody />
        </div>
        <FeedbackLoopConnector />
        <div className="flex-1 bg-slate-900/60 border border-slate-700/50 rounded-2xl p-8">
          <AgentWrapperBody />
        </div>
      </div>
    </div>
  );
}

// Slide: Beyond Optimization — two-card layout pasted as-is from the homepage
// (shared bodies in components/PlatformShowcase).
function SlideBeyondBoxes() {
  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white">Beyond Optimization</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-6 items-stretch">
        <div className="bg-slate-900/60 border border-amber-500/30 rounded-2xl p-8">
          <BenchmarkCardBody />
        </div>
        <div className="bg-slate-900/60 border border-amber-500/30 rounded-2xl p-8">
          <ObservabilityCardBody />
        </div>
      </div>
    </div>
  );
}

// Slide: BEFORE → OPTIMIZER → AFTER three-panel story.
// LEFT  = the 25+ knob configuration space (dimensionality of the problem).
// MIDDLE = the autonomous Test/Measure/Tune/Repeat loop.
// RIGHT = the business outcomes (cost, accuracy, time).
// Per-category color palette for the knob bars.
const KNOB_COLOR = {
  model: { bar: "#4D8EF8", dot: "#1A6BF5", track: "rgba(77,142,248,0.18)" }, // blue   — model selection
  llm:   { bar: "#f59e0b", dot: "#b45309", track: "rgba(245,158,11,0.18)" }, // amber  — LLM inference (legacy / slide 3)
  inference: { bar: "#22d3ee", dot: "#0891b2", track: "rgba(34,211,238,0.18)" }, // cyan — LLM inference (slide 4; orange reserved for "the problem")
  agent: { bar: "#a78bfa", dot: "#7c3aed", track: "rgba(167,139,250,0.18)" }, // violet — agent orchestration
};

function KnobRow({ name, fill, value, category = "model", nowrap = false }) {
  const c = KNOB_COLOR[category];
  return (
    <div>
      <div className="flex items-center justify-between gap-2 text-[12px] mb-1">
        <span className={`text-slate-200 font-semibold${nowrap ? " whitespace-nowrap" : ""}`}>{name}</span>
        <span className={`text-slate-400 font-mono${nowrap ? " shrink-0 whitespace-nowrap" : ""}`}>{value}</span>
      </div>
      <div className="relative h-1.5 rounded-full" style={{ backgroundColor: c.track }}>
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ width: `${fill}%`, backgroundColor: c.bar }}
        />
        <div
          className="absolute top-1/2 w-3 h-3 rounded-full bg-white -translate-y-1/2"
          style={{ left: `calc(${fill}% - 6px)`, border: `2px solid ${c.dot}` }}
        />
      </div>
    </div>
  );
}

function CategoryLegendDot({ category, label }) {
  const c = KNOB_COLOR[category];
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider">
      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.bar }} />
      <span className="text-slate-300">{label}</span>
    </span>
  );
}

// Benefit tile for SlideParetoFrontier's right column — styled to match the
// audience-outcome tiles on slide 2 (SlideOnePagerTextTestV2): bg-slate-900/70
// with a 2px accent border, a big accent metric next to an up/down arrow, and
// a small mono caption. `accent` is a 6-digit hex (66 suffix → ~40% border).
function BenefitBox({ icon: Icon, accent, metric, label }) {
  return (
    <div className="bg-slate-900/70 border-2 rounded-xl px-4 py-3 text-center" style={{ borderColor: `${accent}66` }}>
      <div className="flex items-center justify-center gap-2" style={{ color: accent }}>
        <Icon className="w-7 h-7" strokeWidth={3} />
        <span className="text-2xl font-extrabold tracking-tight leading-none">{metric}</span>
      </div>
      <div className="text-[11px] font-mono uppercase tracking-wider text-slate-300 mt-1">{label}</div>
    </div>
  );
}

// Slide: BEFORE → OPTIMIZER → AFTER three-panel story (The Problem / The
// Solution / The Benefits). Canonical version — shared by the homepage hero,
// /pitch-short(-2), the short-summary preset, and the per-recipient packages.
//   LEFT  — the 25+ knob search space, classified per /knob-explorer:
//           Model / LLM inference / Agent. Deployment-only settings (streaming,
//           guardrails, caching) are excluded — they aren't tuned.
//   MIDDLE — the autonomous Learn → Deduce → Evaluate → Repeat loop.
//   RIGHT  — business outcomes as tappable tiles. Orange is reserved for "the
//            problem"; LLM-inference knobs are cyan; benefits are green.
export function SlideParetoFrontier() {
  // Categories kept contiguous so the colour bands read top-to-bottom: the
  // left column walks Model → LLM → Agent, the right column is all-Agent —
  // visually making the point that agent knobs dominate the search space.
  // Values kept short (counts / compact ranges) so each name + value fits on a
  // single line in the narrow 2-column cell — paired with nowrap on KnobRow.
  const knobsLeft = [
    // Model
    { name: 'Model',            fill: 70, value: '25',           category: 'model' },
    { name: 'Fallback chain',   fill: 40, value: '3',            category: 'model' },
    // LLM (per-call inference params) — cyan 'inference' so orange stays "the problem"
    { name: 'Temperature',      fill: 45, value: '0–1.0',        category: 'inference' },
    { name: 'Reasoning',        fill: 65, value: 'low/med/high', category: 'inference' },
    { name: 'Max tokens',       fill: 40, value: '256–2048',     category: 'inference' },
    // Agent (behaviour / orchestration)
    { name: 'System prompt',    fill: 80, value: '4',            category: 'agent' },
    { name: 'Few-shot (k)',     fill: 75, value: '0–10 ex',      category: 'agent' },
    { name: 'Example selection',fill: 70, value: '4',            category: 'agent' },
  ];
  const knobsRight = [
    // Agent continued
    { name: 'Chain-of-thought', fill: 85, value: '3',            category: 'agent' },
    { name: 'Self-consistency', fill: 75, value: '1/3/5',        category: 'agent' },
    { name: 'Self-correction',  fill: 65, value: '0–2',          category: 'agent' },
    { name: 'Decomposition',    fill: 60, value: '3',            category: 'agent' },
    { name: 'Tool selection',   fill: 55, value: '3',            category: 'agent' },
    { name: 'RAG top-k',        fill: 80, value: '0–20',         category: 'agent' },
    { name: 'Reranker',         fill: 70, value: '3',            category: 'agent' },
    { name: 'Embedding model',  fill: 65, value: '4',            category: 'agent' },
  ];
  return (
    <div className="w-full max-w-[1240px] mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">
          Agent performance is a <span className="text-amber-500">25+ knob</span> optimization problem
        </h2>
      </div>

      <div className="grid grid-cols-[1fr_28px_1fr_28px_1fr] items-stretch gap-0">
        {/* LEFT: 25+ knobs, reclassified per /knob-explorer */}
        <div className="bg-slate-900/70 border border-slate-700/60 rounded-xl p-4">
          <div className="text-center mb-3">
            <a href="https://www.traigent.ai/#/knob-explorer" target="_blank" rel="noopener noreferrer" className="inline-block rounded-lg px-4 py-1.5 text-2xl font-mono font-bold uppercase tracking-wide transition hover:brightness-110" style={{ backgroundColor: '#f59e0b', color: '#0f172a' }}>The Problem</a>
            <div className="text-[11px] text-slate-500 italic mt-1">Click for details</div>
          </div>
          <h3 className="text-[20px] font-bold text-white leading-tight mb-1 text-center">25+ configuration knobs</h3>
          <p className="text-[12px] text-slate-400 leading-snug mb-2">
            Literally millions of possible combinations to evaluate manually.
          </p>
          <div className="flex items-center justify-center gap-3 mb-3">
            <CategoryLegendDot category="model"     label="Model" />
            <CategoryLegendDot category="inference" label="LLM" />
            <CategoryLegendDot category="agent"     label="Agent" />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
            {[...knobsLeft, ...knobsRight].map((k, i) => (
              <KnobRow key={i} {...k} nowrap />
            ))}
          </div>
          <div className="text-[11px] text-slate-500 mt-3 leading-snug text-center">
            …plus more retrieval, memory and orchestration knobs.
            <br />
            <span className="text-slate-600">Streaming · guardrails · caching are deploy-time settings — set once, not tuned.</span>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex items-center justify-center">
          <ArrowRight className="w-7 h-7" style={{ color: '#1A6BF5' }} />
        </div>

        {/* MIDDLE: Optimizer */}
        <div className="bg-slate-900/70 border-2 rounded-xl p-4 flex flex-col" style={{ borderColor: '#1A6BF5' }}>
          <div className="text-center mb-3">
            <a href="https://www.traigent.ai/#/story" target="_blank" rel="noopener noreferrer" className="inline-block rounded-lg px-4 py-1.5 text-2xl font-mono font-bold uppercase tracking-wide transition hover:brightness-110" style={{ backgroundColor: '#4D8EF8', color: '#0f172a' }}>The Solution</a>
            <div className="text-[11px] text-slate-500 italic mt-1">Click for details</div>
          </div>
          <h3 className="text-[20px] font-bold text-white leading-tight mb-1 text-center">Automatic Optimization</h3>
          <p className="text-[12px] text-slate-400 leading-snug mb-2 text-center">
            Contemplates all the options. Converges to <span className="text-white font-semibold">THE</span> optimum.<br />Re-runs every time conditions change.
          </p>

          {/* Loop SVG — note the unique gradient id (ringGradV2) so it doesn't
              collide with SlideParetoFrontier's ringGrad on the same deck.
              Traigent.ai is grouped in this centered column so it sits right
              under the circle. */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <svg viewBox="0 0 240 240" className="w-full max-w-[240px]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="ringGradV2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4D8EF8"/>
                  <stop offset="100%" stopColor="#1A6BF5"/>
                </linearGradient>
              </defs>
              <circle cx="120" cy="120" r="82" fill="none" stroke="#1e293b" strokeWidth="14"/>
              <path
                d="M 120 38 A 82 82 0 1 1 38 120"
                fill="none"
                stroke="url(#ringGradV2)"
                strokeWidth="14"
                strokeLinecap="round"
              />
              <polygon points="38,96 22,128 54,128" fill="#1A6BF5"/>

              <circle cx="120" cy="120" r="58" fill="#020617" stroke="#334155" strokeWidth="1"/>
              <text x="120" y="101" textAnchor="middle" fill="#cbd5e1" fontSize="13" fontFamily="ui-sans-serif, system-ui" fontWeight="700">LEARN</text>
              <text x="120" y="119" textAnchor="middle" fill="#cbd5e1" fontSize="13" fontFamily="ui-sans-serif, system-ui" fontWeight="700">DEDUCE</text>
              <text x="120" y="137" textAnchor="middle" fill="#cbd5e1" fontSize="12" fontFamily="ui-sans-serif, system-ui" fontWeight="700">EVALUATE</text>
              <text x="120" y="155" textAnchor="middle" fill="#cbd5e1" fontSize="13" fontFamily="ui-sans-serif, system-ui" fontWeight="700">REPEAT</text>
            </svg>
            {/* Traigent.ai brand — directly under the loop circle (negative
                margin eats the SVG's built-in bottom padding). */}
            <div className="text-[18px] font-extrabold -mt-6" style={{ color: '#4D8EF8' }}>Traigent.ai</div>
          </div>

          {/* Bottom step pills */}
          <div className="grid grid-cols-4 gap-1.5 mt-2">
            {['Learn', 'Deduce', 'Evaluate', 'Repeat'].map((label) => (
              <div
                key={label}
                className="text-[11px] font-mono text-center py-1 rounded border border-slate-700 text-slate-300"
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Arrow */}
        <div className="flex items-center justify-center">
          <ArrowRight className="w-7 h-7" style={{ color: '#1A6BF5' }} />
        </div>

        {/* RIGHT: Outcomes — updated to the homepage "Traigent Benefits" set */}
        <div className="bg-slate-950 border border-slate-700/60 rounded-xl p-4">
          <div className="text-center mb-3">
            <a href="https://www.traigent.ai/#/roi" target="_blank" rel="noopener noreferrer" className="inline-block rounded-lg px-4 py-1.5 text-2xl font-mono font-bold uppercase tracking-wide transition hover:brightness-110" style={{ backgroundColor: '#34d399', color: '#0f172a' }}>The Benefits</a>
            <div className="text-[11px] text-slate-500 italic mt-1">Click for details</div>
          </div>
          <h3 className="text-[20px] font-bold text-white leading-tight mb-3 text-center">Best config possible — Always</h3>
          <div className="space-y-2.5">
            <BenefitBox icon={ArrowDown} accent="#34d399" metric="up to 60%"  label="LLM cost reduction" />
            <BenefitBox icon={ArrowDown} accent="#34d399" metric="up to 8 wks" label="Engineering time reclaimed" />
            <BenefitBox icon={ArrowUp}   accent="#34d399" metric="100%"        label="confidence in what you ship" />
            <BenefitBox icon={ArrowDown} accent="#34d399" metric="TTM"         label="Shortens time to market" />
          </div>
        </div>
      </div>
    </div>
  );
}


// Slide: Sweep the eval + observability pack. Follow-up to slide 24.
// Langfuse, Arize, LangSmith, Braintrust, Galileo, Helicone all rode the
// previous wave (eval + observability) and raised hundreds of millions —
// but none of them solve OPTIMIZATION, which slide 24's market wave is
// making urgent. Traigent has all three pillars. We sweep the pack.
function SlideSweepThePack() {
  const competitors = [
    { name: "Langfuse",   note: "Open-source, AWS partner" },
    { name: "Arize AI",   note: "$131M raised" },
    { name: "LangSmith",  note: "LangChain product" },
    { name: "Braintrust", note: "$80M raised · $800M val" },
    { name: "Galileo",    note: "Enterprise direct" },
    { name: "Helicone",   note: "Acquired by Mintlify · maintenance mode" },
  ];
  const CheckCell = () => (
    <td className="py-2.5 text-center">
      <Check className="w-6 h-6 inline" strokeWidth={3} style={{ color: "#34d399" }} />
    </td>
  );
  const XCell = () => (
    <td className="py-2.5 text-center">
      <X className="w-6 h-6 inline" strokeWidth={3} style={{ color: "#f87171" }} />
    </td>
  );
  return (
    <div className="w-full max-w-[1180px] mx-auto text-center self-stretch flex flex-col min-h-[600px]">
      {/* Title — tightened to fit within slide canvas */}
      <div className="mb-2">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight mb-1.5">
          Why partner with <span style={{ color: "#4D8EF8" }}>Traigent.ai</span>?
        </h1>
        <h2 className="text-xl md:text-2xl font-bold text-white leading-tight tracking-tight mb-1">
          Sweep the <span style={{ color: "#4D8EF8" }}>Eval + Observability</span> Pack
        </h2>
        <p className="text-sm md:text-base text-slate-300 leading-snug">
          Langfuse and similar <span className="font-bold text-white">burst with success</span> on eval + observability &mdash; $1B+ valuations.
          <br />
          They raised hundreds of millions but never built the most important pillar: <span className="font-bold text-[#f59e0b]">optimization</span>.
        </p>
      </div>

      {/* Capability matrix */}
      <div className="bg-slate-900/70 border border-slate-700/60 rounded-xl p-3 flex-1 flex flex-col">
        <table className="w-full text-left text-[14px] flex-1">
          <thead>
            <tr className="text-[11px] font-mono uppercase tracking-widest text-slate-400 border-b border-slate-700">
              <th className="py-1.5">Vendor</th>
              <th className="py-1.5 text-center">Observability</th>
              <th className="py-1.5 text-center">Evaluation</th>
              <th className="py-1.5 text-center" style={{ color: "#f59e0b" }}>Optimization</th>
              <th className="py-1.5 text-right text-slate-500">Context</th>
            </tr>
          </thead>
          <tbody>
            {competitors.map((c) => (
              <tr key={c.name} className="border-b border-slate-800/70">
                <td className="py-1.5 font-semibold text-white">{c.name}</td>
                <CheckCell />
                <CheckCell />
                <XCell />
                <td className="py-1.5 text-right text-slate-400 text-[12px]">{c.note}</td>
              </tr>
            ))}
            {/* Traigent — highlighted row */}
            <tr className="bg-blue-500/10">
              <td className="py-2 font-bold text-[16px]" style={{ color: "#4D8EF8" }}>Traigent.ai</td>
              <CheckCell />
              <CheckCell />
              <td className="py-2 text-center">
                <Check className="w-7 h-7 inline" strokeWidth={3.5} style={{ color: "#34d399" }} />
              </td>
              <td className="py-2 text-right font-bold text-white text-[12px]">3 platforms in 1</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Punchline */}
      <div className="mt-2 bg-slate-950 border-2 rounded-xl p-2.5 text-center" style={{ borderColor: "#4D8EF8" }}>
        <p className="text-base md:text-lg text-slate-200 leading-snug">
          <span className="font-bold" style={{ color: "#4D8EF8" }}>Traigent</span> has everything they have <span className="font-bold text-[#f59e0b]">PLUS the optimization layer the market is now demanding</span>. The pack gets swept.
        </p>
      </div>
    </div>
  );
}

// Slide: Market & Revenue — headline numbers from the May 2026 partner brief.
// Top section: 3 stat tiles (TAM today, addressable LLM bill 2026, 2030).
// Middle section: penetration → revenue cascade table.
// Bottom: comparable-ramp sanity check.
// Slide: dual-CTA closer for /investor-pitch — Start Now (opens the full
// HubSpot-gated SDK install modal) + Book a demo (HubSpot meeting link).
// Uses the same StartNowModal mounting pattern as TopNav and StoryMovie.
function SlideInvestorCTA() {
  const [showStartNow, setShowStartNow] = useState(false);
  const bookingHref = "https://meetings-eu1.hubspot.com/amir8/out";
  return (
    <>
      <div className="w-full max-w-[1080px] mx-auto self-stretch flex flex-col items-center justify-center min-h-[600px] text-center">
        <div className="text-xs md:text-sm font-mono uppercase tracking-[0.3em] text-slate-500 mb-6">
          Pick your path
        </div>
        <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-4">
          Try it. Or talk to us.
        </h2>
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-snug mb-12">
          Both paths land in the same place &mdash; you running Traigent on a
          real agent of yours.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mb-6">
          {/* Option 1 — Start Now (opens the gated modal) */}
          <div
            className="bg-slate-900/60 border-2 rounded-2xl p-7 text-left flex flex-col"
            style={{ borderColor: "#4D8EF8" }}
          >
            <div className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: "#4D8EF8" }}>
              Option 1 &mdash; Free
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Start Now</h3>
            <p className="text-slate-300 text-base mb-6 leading-snug">
              Keyless demo on your laptop in <span className="font-semibold text-white">under a minute</span>. No
              API keys, no spend, no setup call.
            </p>
            <button
              type="button"
              onClick={() => setShowStartNow(true)}
              className="mt-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-lg font-bold text-white shadow-xl transition-transform hover:scale-105 active:scale-100"
              style={{
                background: "linear-gradient(135deg, #4D8EF8 0%, #1A6BF5 100%)",
                boxShadow: "0 10px 30px rgba(77, 142, 248, 0.30)",
              }}
            >
              <span className="text-xl leading-none">&#9654;</span>
              Start Now &mdash; Free
            </button>
          </div>

          {/* Option 2 — Book a demo */}
          <div
            className="bg-slate-900/60 border-2 rounded-2xl p-7 text-left flex flex-col"
            style={{ borderColor: "#f59e0b" }}
          >
            <div className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: "#f59e0b" }}>
              Option 2 &mdash; 15 min
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Book a demo</h3>
            <p className="text-slate-300 text-base mb-6 leading-snug">
              We pick one of your agents, run the optimizer live, walk you
              through the trial table and the convergence.
            </p>
            <a
              href={bookingHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-lg font-bold text-white shadow-xl transition-transform hover:scale-105 active:scale-100"
              style={{
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                boxShadow: "0 10px 30px rgba(245, 158, 11, 0.30)",
              }}
            >
              <span className="text-xl leading-none">&#128197;</span>
              Book a 15-min call
            </a>
          </div>
        </div>

        <div className="text-sm text-slate-400">
          <span className="font-mono text-slate-300">amir@traigent.ai</span> &middot;{" "}
          <span className="font-mono text-slate-300">nimrod@traigent.ai</span>
        </div>
      </div>
      {showStartNow && (
        <StartNowModal
          onClose={() => setShowStartNow(false)}
          location="investor_pitch_cta"
        />
      )}
    </>
  );
}

// Slide: CTA pointing to /story — the 1-minute narrated agent-optimization
// arc. Lives near the end of the investor-pitch range so the audience leaves
// the deck on a "go watch the story" beat. Opens in a new tab so the deck
// stays where it was.
function SlideStoryCTA() {
  return (
    <div className="w-full max-w-[1080px] mx-auto self-stretch flex flex-col items-center justify-center min-h-[600px] text-center">
      <div className="text-xs md:text-sm font-mono uppercase tracking-[0.3em] text-slate-500 mb-6">
        The 1-minute story
      </div>
      <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-4">
        Problem &rarr;{" "}
        <span style={{ color: "#4D8EF8" }}>Optimizer</span>
        {" "}&rarr;{" "}
        <span style={{ color: "#34d399" }}>The win</span>
      </h2>
      <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-snug mb-12">
        Narrated walkthrough &mdash; the 25-knob configuration problem, the
        Traigent loop, and the converged result, all under a minute.
      </p>
      <a
        href="/#/story"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 px-9 py-4 rounded-xl text-xl md:text-2xl font-bold text-white shadow-2xl transition-transform hover:scale-105 active:scale-100"
        style={{
          background: "linear-gradient(135deg, #4D8EF8 0%, #1A6BF5 100%)",
          boxShadow: "0 10px 40px rgba(77, 142, 248, 0.35)",
        }}
      >
        <span className="text-2xl md:text-3xl leading-none">&#9654;</span>
        Watch the 1-minute story
      </a>
      <div className="mt-8 text-sm text-slate-400">
        opens at <span className="font-mono text-slate-300">traigent.ai/#/story</span> in a new tab
      </div>
    </div>
  );
}

function SlideMarketAndRevenue() {
  // Customer savings split per Assumption #3:
  //   Eng saved  = penetrated bill × $0.30   (foundation, accuracy phase, day-1)
  //   LLM saved  = penetrated bill × $0.50   (scale, cost phase, later)
  //   ARR        = (eng + LLM) × 5% take rate
  const rows = [
    { year: "2026", phase: "POCs",          bill: "$21B",  pen: "0.03%", engSave: "$1.9M", llmSave: "$3.2M", rev: "~$0.25M" },
    { year: "2027", phase: "Early adopt",   bill: "$36B",  pen: "0.3%",  engSave: "$32M",  llmSave: "$54M",  rev: "~$4M" },
    { year: "2028", phase: "Channel + ent", bill: "$56B",  pen: "1.5%",  engSave: "$252M", llmSave: "$420M", rev: "~$34M" },
    { year: "2029", phase: "Mainstream",    bill: "$86B",  pen: "4%",    engSave: "$1.0B", llmSave: "$1.7B", rev: "~$138M" },
    { year: "2030", phase: "Category",      bill: "$128B", pen: "8%",    engSave: "$3.1B", llmSave: "$5.1B", rev: "~$410M" },
  ];
  return (
    <div className="w-full max-w-[1180px] mx-auto text-center self-stretch flex flex-col min-h-[600px]">
      {/* Title */}
      <div className="mb-2">
        <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight mb-1">
          Market &amp; Revenue &mdash; <span style={{ color: "#4D8EF8" }}>Non-Vendor Agents</span>
        </h2>
        <p className="text-sm md:text-base text-slate-300 leading-snug">
          Revenue grounded in <span className="font-bold text-[#34d399]">5% of customer savings actually delivered</span> &mdash; not a TAM percentage. <span className="font-bold text-[#4D8EF8]">Engineering savings unlock adoption first</span>; <span className="font-bold text-[#f59e0b]">LLM cost savings drive expansion</span> as production bills grow.
        </p>
      </div>

      {/* Assumptions strip */}
      <div className="bg-slate-900/70 border border-slate-700/60 rounded-xl p-3 mb-3 text-left">
        <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1.5">Assumptions (read first)</div>
        <ol className="text-[12.5px] text-slate-300 leading-snug space-y-1 list-decimal pl-5">
          <li><span className="font-bold text-white">Customers:</span> non-vendor agent companies + enterprise teams on third-party LLM APIs. Excludes foundation-model-vendor agents.</li>
          <li><span className="font-bold text-white">Cost structure:</span> every $1 of customer LLM bill is matched by ~$0.50 of engineering on tuning (6–10 FTE on a $3–5M LLM bill).</li>
          <li><span className="font-bold text-white">Savings Traigent delivers</span> per $1 of LLM bill, <span className="italic">sequenced over the SDLC</span>:
            <ul className="list-disc pl-5 mt-0.5 space-y-0.5">
              <li><span className="text-[#4D8EF8] font-semibold">Foundation</span> (accuracy phase, day-1): <span className="text-[#4D8EF8] font-semibold">60% eng saved</span> = <span className="text-white font-bold">$0.30</span> &mdash; adopted before the LLM bill is large enough to optimize.</li>
              <li><span className="text-[#f59e0b] font-semibold">Scale</span> (cost phase, later): <span className="text-[#f59e0b] font-semibold">50% LLM saved</span> = <span className="text-white font-bold">$0.50</span>.</li>
              <li>Total: <span className="text-white font-bold">$0.80 customer savings</span>.</li>
            </ul>
          </li>
          <li><span className="font-bold text-white">Take rate:</span> <span className="text-[#34d399] font-bold">5%</span> of total savings &mdash; effective <span className="text-white font-bold">$0.04 of ARR per $1 of penetrated customer LLM bill</span>.</li>
          <li><span className="font-bold text-white">Penetration:</span> share of the non-vendor LLM bill reached by Traigent customers. Revenue is calculated on savings achieved <em>within penetrated markets only</em>.</li>
        </ol>
      </div>

      {/* Cascade table */}
      <div className="bg-slate-900/70 border border-slate-700/60 rounded-xl p-3 flex-1 flex flex-col">
        <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400 mb-2 text-left">
          Revenue cascade · 5% of total customer savings, penetrated markets only
        </div>
        <table className="w-full text-left text-[13px] flex-1">
          <thead>
            <tr className="text-[10px] font-mono uppercase tracking-widest text-slate-400 border-b border-slate-700">
              <th className="py-1.5">Year</th>
              <th className="py-1.5">Phase</th>
              <th className="py-1.5 text-right">Addressable bill</th>
              <th className="py-1.5 text-right">Penetration</th>
              <th className="py-1.5 text-right" style={{ color: "#4D8EF8" }}>Eng saved</th>
              <th className="py-1.5 text-right" style={{ color: "#f59e0b" }}>LLM saved</th>
              <th className="py-1.5 text-right">Traigent ARR (5%)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.year} className="border-b border-slate-800/70 last:border-b-0">
                <td className="py-1.5 font-bold text-white">{r.year}</td>
                <td className="py-1.5 text-slate-300">{r.phase}</td>
                <td className="py-1.5 text-right font-mono text-slate-200">{r.bill}</td>
                <td className="py-1.5 text-right font-mono text-slate-200">{r.pen}</td>
                <td className="py-1.5 text-right font-mono font-semibold" style={{ color: "#4D8EF8" }}>{r.engSave}</td>
                <td className="py-1.5 text-right font-mono font-semibold" style={{ color: "#f59e0b" }}>{r.llmSave}</td>
                <td className="py-1.5 text-right font-mono font-bold" style={{ color: "#34d399" }}>{r.rev}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-[11px] text-slate-400 mt-2 text-left">
          <span className="font-bold text-white">Bear / Base / Bull at 2030</span> (penetration) = 4% / 8% / 12% → <span className="font-bold text-[#34d399]">~$205M / ~$410M / ~$615M</span> ARR. Sierra hit $150M ARR 24 mo from launch; Decagon $35M+ in 9 mo. Traigent is the picks-and-shovels every agent company needs to survive its COGS curve.
        </div>
      </div>
    </div>
  );
}

// Slide: The Market Opportunity — for channel partners + investors.
// Narrative: the wave (few in production, exponential explosion coming) →
// the pain (sticker shock + 25+ knob re-tune every release) → the play
// (Traigent as essential infra for the agent economy).
function SlideMarketOpportunity() {
  return (
    <div className="w-full max-w-[1180px] mx-auto text-center self-stretch flex flex-col min-h-[600px]">
      {/* Title */}
      <div className="mb-4">
        <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight mb-2">
          A Market <span className="text-[#4D8EF8]">About to Explode</span>
        </h2>
        <p className="text-xl md:text-2xl text-slate-300 leading-snug">
          AI agents are in <span className="font-bold text-white">infancy</span>. The cost crisis is just <span className="font-bold text-white">starting</span>.
        </p>
      </div>

      {/* Three columns: THE WAVE / THE PAIN / THE PLAY */}
      <div className="grid grid-cols-3 gap-4 flex-1">
        {/* COL 1 — THE WAVE (hockey-stick) */}
        <div className="bg-slate-900/70 border-2 rounded-xl p-5 text-left flex flex-col" style={{ borderColor: "#4D8EF866" }}>
          <div className="text-2xl font-mono font-bold uppercase tracking-widest mb-3 text-center" style={{ color: "#4D8EF8" }}>The Wave</div>
          <h3 className="text-2xl font-bold text-white leading-tight mb-3">
            Exponential adoption ahead
            <span className="block">LLM costs set to explode</span>
          </h3>

          {/* Hockey-stick chart */}
          <svg viewBox="0 0 280 130" className="w-full mb-4 flex-1" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
            <line x1="30" y1="110" x2="270" y2="110" stroke="#475569" strokeWidth="1"/>
            <line x1="30" y1="14"  x2="30"  y2="110" stroke="#475569" strokeWidth="1"/>
            {/* Y-axis label — rotated 90° so "Agent LLM costs" fits the narrow gutter. */}
            <text x="14" y="62" textAnchor="middle" transform="rotate(-90 14 62)" fill="#94a3b8" fontSize="11" fontFamily="ui-sans-serif, system-ui" fontWeight="600">Agent LLM costs</text>
            {/* X-axis labels — uniform 40px/year so TODAY (mid-2026) lands on the
                1/3 mark of the plot, leaving 2× the room for the future. */}
            <text x="40"  y="122" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="ui-sans-serif, system-ui">2024</text>
            <text x="110" y="122" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="ui-sans-serif, system-ui">2026</text>
            <text x="190" y="122" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="ui-sans-serif, system-ui">2028</text>
            <text x="263" y="122" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="ui-sans-serif, system-ui">2030</text>
            {/* TODAY marker — mid-2026, sits at the 1/3 mark of the plot. */}
            <line x1="110" y1="14" x2="110" y2="110" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,2" strokeOpacity="0.7"/>
            <text x="110" y="28" textAnchor="middle" fill="#f59e0b" fontSize="11" fontFamily="ui-sans-serif, system-ui" fontWeight="700">TODAY</text>
            {/* Curve: nearly flat 2024-2026 (left third), inflects at 2026-2027,
                steep through 2028, plateaus 2028-2030 — classic hockey stick. */}
            <path d="M 30 108 C 70 107, 95 105, 110 100 C 135 92, 160 75, 180 45 C 205 20, 235 14, 270 13" stroke="#4D8EF8" strokeWidth="2.5" fill="none"/>
            <circle cx="55"  cy="107" r="2.5" fill="#475569"/>
            <circle cx="85"  cy="105" r="2.5" fill="#475569"/>
            <circle cx="110" cy="100" r="4"   fill="#f59e0b"/>
            <circle cx="150" cy="83"  r="3.5" fill="#4D8EF8"/>
            <circle cx="185" cy="40"  r="3.5" fill="#4D8EF8"/>
            <circle cx="225" cy="17"  r="4"   fill="#4D8EF8"/>
            <circle cx="265" cy="13"  r="4.5" fill="#4D8EF8"/>
          </svg>

          <p className="text-lg text-slate-300 leading-snug mt-auto">
            Few in production today.<br /><span className="font-bold text-white">Massive rollouts 2026–2030.</span>
          </p>
        </div>

        {/* COL 2 — THE PAIN */}
        <div className="bg-slate-900/70 border-2 rounded-xl p-5 text-left flex flex-col" style={{ borderColor: "#f59e0b66" }}>
          <div className="text-2xl font-mono font-bold uppercase tracking-widest mb-3 text-center" style={{ color: "#f59e0b" }}>The Pain</div>
          <h3 className="text-2xl font-bold text-white leading-tight mb-6">
            <span className="text-amber-400">Exponential LLM costs</span><br />
            Brutal re-tuning cycles
            <Link
              to="/knob-explorer"
              className="block text-base font-medium text-slate-400 hover:text-slate-200 underline underline-offset-4 decoration-slate-500/50 hover:decoration-slate-200 mt-1 transition-colors"
            >
              (among thousands of config combos)
            </Link>
          </h3>
          <div className="text-lg leading-snug mb-3">
            <p className="text-slate-300">
              Constant re-tuning efforts for cost and accuracy as conditions change:
            </p>
          </div>
          <ul className="text-base text-slate-300 leading-snug space-y-1.5 flex-1 list-disc pl-5">
            <li>New models drop</li>
            <li>Prices shift</li>
            <li>Domain data drifts</li>
            <li>Latency / SLA tightens</li>
            <li>New use cases land</li>
            <li>Failures surface in prod</li>
          </ul>
        </div>

        {/* COL 3 — THE CURE (Traigent) */}
        <div className="bg-slate-950 border-2 rounded-xl p-5 text-center flex flex-col" style={{ borderColor: "#4D8EF8" }}>
          <div className="text-2xl font-mono font-bold uppercase tracking-widest mb-2 text-center" style={{ color: "#4D8EF8" }}>The Cure</div>
          <h3 className="text-2xl font-bold leading-tight mb-2 text-white">
            Automated Optimization
          </h3>

          {/* Optimizer ring with Traigent.ai brand to the right */}
          <div className="flex justify-center mb-2 flex-1 items-center gap-3">
            <OptimizerRing size={170} gradientId="ringGradMarket" thirdLabel="EVALUATE" />
            <div
              className="text-xl font-bold leading-tight tracking-tight whitespace-nowrap"
              style={{ color: "#4D8EF8" }}
            >
              Traigent.ai
            </div>
          </div>

          {/* 3 stacked benefit boxes (matches slide 1, with arrows) */}
          <div className="grid grid-cols-1 gap-2 mt-auto">
            <div className="bg-slate-900/70 border-2 rounded-lg px-3 py-2 text-center" style={{ borderColor: "#f59e0b66" }}>
              <div className="flex items-center justify-center gap-2" style={{ color: "#f59e0b" }}>
                <ArrowDown className="w-6 h-6" strokeWidth={3} />
                <span className="text-2xl font-extrabold tracking-tight leading-none">up to 60%</span>
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-slate-300 mt-1">LLM cost reduction</div>
            </div>
            <div className="bg-slate-900/70 border-2 rounded-lg px-3 py-2 text-center" style={{ borderColor: "#4D8EF866" }}>
              <div className="flex items-center justify-center gap-2" style={{ color: "#4D8EF8" }}>
                <ArrowDown className="w-6 h-6" strokeWidth={3} />
                <span className="text-2xl font-extrabold tracking-tight leading-none">up to 8 wks</span>
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-slate-300 mt-1">Engineering time reclaimed</div>
            </div>
            <div className="bg-slate-900/70 border-2 rounded-lg px-3 py-2 text-center" style={{ borderColor: "#a78bfa66" }}>
              <div className="flex items-center justify-center gap-2" style={{ color: "#a78bfa" }}>
                <ArrowUp className="w-6 h-6" strokeWidth={3} />
                <span className="text-2xl font-extrabold tracking-tight leading-none">100%</span>
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-slate-300 mt-1">confidence in what you ship</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Slide: variation of SlideOnePagerTextTest (slide 1) for A/B-testing —
// starts as an identical copy of slide 1 so we can diverge it without
// touching the live opener. Uses a unique SVG gradient id so both slides
// can coexist on the same page in /pitch-short-2.
function SlideOnePagerTextTestV2() {
  const LINE = "text-4xl md:text-5xl leading-tight tracking-tight text-slate-300";
  return (
    <div className="w-full max-w-[1100px] mx-auto self-stretch flex flex-col text-center min-h-[600px]">
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex flex-col gap-6">
          <h2 className={LINE}>
            Optimizing <span className="font-bold text-white">AI Agent</span> <span className="font-bold text-[#4D8EF8]">Quality</span> and <span className="font-bold text-[#f59e0b]">Cost</span><br />
            via <span className="font-bold text-white">trial and error</span> <span className="font-bold text-red-400">can be brutal</span>
          </h2>
          <p className="text-2xl md:text-3xl leading-tight tracking-tight text-slate-300">
            <span className="font-bold text-[#4D8EF8]">25+ knobs.</span> <span className="font-bold text-amber-400">Millions of options.</span>
          </p>
        </div>
        {/* Problem → solution arrow — now a standalone flex child so
            justify-between places it geometrically halfway between the
            problem group above and the solution H2 below. */}
        <div className="flex justify-center" aria-hidden="true">
          <svg viewBox="0 0 40 50" className="w-8 h-10" xmlns="http://www.w3.org/2000/svg">
            <line x1="14" y1="2" x2="14" y2="30" stroke="#4D8EF8" strokeWidth="3" strokeLinecap="round" />
            <line x1="26" y1="2" x2="26" y2="30" stroke="#4D8EF8" strokeWidth="3" strokeLinecap="round" />
            <line x1="6"  y1="32" x2="20" y2="46" stroke="#4D8EF8" strokeWidth="3" strokeLinecap="round" />
            <line x1="34" y1="32" x2="20" y2="46" stroke="#4D8EF8" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
        <h2 className="text-3xl md:text-4xl leading-tight tracking-tight text-slate-300">
          Traigent finds <span className="text-white">the</span> <span className="font-bold text-[#f59e0b]">Low Cost</span> and <span className="font-bold text-[#4D8EF8]">High Quality</span> options
        </h2>
      </div>

      {/* Audience-outcome tiles — moved ABOVE the product card */}
      <div className="grid grid-cols-4 gap-3 self-center w-full max-w-4xl mt-6">
        <a
          href="https://www.traigent.ai/#/roi"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-slate-900/70 border-2 rounded-xl px-3 py-3 text-center hover:bg-slate-900 transition-colors block"
          style={{ borderColor: "#f59e0b66" }}
        >
          <div className="flex items-center justify-center gap-2" style={{ color: "#f59e0b" }}>
            <ArrowDown className="w-7 h-7" strokeWidth={3} />
            <span className="text-2xl font-extrabold tracking-tight leading-none">up to 60%</span>
          </div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-300 mt-1">LLM cost reduction</div>
        </a>
        <a
          href="https://www.traigent.ai/#/ttm"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-slate-900/70 border-2 rounded-xl px-3 py-3 text-center hover:bg-slate-900 transition-colors block"
          style={{ borderColor: "#4D8EF866" }}
        >
          <div className="flex items-center justify-center gap-2" style={{ color: "#4D8EF8" }}>
            <ArrowDown className="w-7 h-7" strokeWidth={3} />
            <span className="text-2xl font-extrabold tracking-tight leading-none">up to 8 wks</span>
          </div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-300 mt-1">Engineering time reclaimed</div>
        </a>
        <a
          href="https://www.traigent.ai/#/ttm"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-slate-900/70 border-2 rounded-xl px-3 py-3 text-center hover:bg-slate-900 transition-colors block"
          style={{ borderColor: "#4D8EF866" }}
        >
          <div className="flex items-center justify-center gap-2" style={{ color: "#4D8EF8" }}>
            <ArrowDown className="w-7 h-7" strokeWidth={3} />
            <span className="text-2xl font-extrabold tracking-tight leading-none">TTM</span>
          </div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-300 mt-1">shortens time to market</div>
        </a>
        <div className="bg-slate-900/70 border-2 rounded-xl px-3 py-3 text-center" style={{ borderColor: "#a78bfa66" }}>
          <div className="flex items-center justify-center gap-2" style={{ color: "#a78bfa" }}>
            <ArrowUp className="w-7 h-7" strokeWidth={3} />
            <span className="text-2xl font-extrabold tracking-tight leading-none">100%</span>
          </div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-300 mt-1">shipment confidence</div>
        </div>
      </div>

      {/* Product card — moved BELOW the audience-outcome tiles */}
      <div className="mt-1 bg-slate-900/70 border-2 rounded-xl py-0 px-3 flex items-center gap-6 self-center w-full max-w-4xl" style={{ borderColor: "#1A6BF5" }}>
        <OptimizerRing size={190} gradientId="ringGradMiniV2" />

        <div className="flex-1 min-w-0 text-center">
          <h3 className="text-[34px] font-bold leading-tight mb-2 flex items-baseline justify-center gap-3">
            <span style={{ color: "#4D8EF8" }}>Traigent.ai</span>
            <span className="text-white">Automatic Optimization</span>
          </h3>
          <p className="text-[22px] text-slate-400 leading-snug mb-3">
            Contemplates 1,000s of options. Converges to <span className="text-white font-semibold">THE</span> optimum.
          </p>
          <div className="grid grid-cols-4 gap-2">
            {["Learn", "Deduce", "Test", "Repeat"].map((label) => (
              <div
                key={label}
                className="text-[16px] font-mono text-center py-2 rounded border border-slate-700 text-slate-300"
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Slide: "How we converge rapidly" — the science angle. Establishes
// hyper-parameter tuning as a well-studied math field, then layers
// Traigent's empirical-data edge on top. Link to the multiverse blog.
function SlideHowWeConverge() {
  return (
    <div className="w-full max-w-[1100px] mx-auto text-center self-stretch flex flex-col justify-center min-h-[600px]">
      <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
        How we converge rapidly
      </h2>

      <div className="space-y-3 text-xl md:text-2xl text-slate-300 leading-snug mb-6">
        <p>
          <span className="font-bold text-white">Hyper-parameter tuning</span> is a widely researched field in <span className="font-bold text-[#4D8EF8]">mathematics</span>
        </p>
        <p>
          <span className="font-bold" style={{ color: "#4D8EF8" }}>Traigent.ai</span> uses the <span className="font-bold text-white">best science</span> has to offer
        </p>
        <p>
          In addition, <span className="font-bold" style={{ color: "#4D8EF8" }}>Traigent.ai</span> starts from well-documented <span className="font-bold text-[#f59e0b]">EMPIRICAL DATA</span> in this specific domain
        </p>
      </div>

      {/* Convergence diagram + 3 killer-stat tiles from Slide06KillerStat */}
      <ConvergenceDiagram className="w-full max-w-2xl mx-auto" />
      <KillerStatsGrid className="grid grid-cols-3 gap-3 max-w-3xl mx-auto mt-4 text-center" />

      <div className="mt-5">
        <a
          href="https://www.traigent.ai/#/blog/the-config-multiverse"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-base md:text-lg font-bold text-white underline underline-offset-4 decoration-white/40 hover:decoration-white transition-colors"
        >
          Read more in The Configuration Multiverse
          <ArrowRight className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
}

export const SHORT_SLIDES = [
  // ----- TEXT-ONLY ONE-PAGER (opener — swapped in from slot 22) -----
  { title: "One-Pager Test — Text Only (V2)", section: "Traigent intro", component: SlideOnePagerTextTestV2 },
  // ----- BEFORE / TRAIGENT / AFTER — promoted to slide 2 as the visual hook -----
  { title: "25+ Knob Problem — Before / Traigent / After", section: "Traigent intro", component: SlideParetoFrontier },
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
  { title: "Get Started", section: "CTA", component: Slide20GetStartedShort },
  { title: "Better Agents. Faster. Lower Spend. Higher Confidence.", section: "CTA", component: Slide21Closing },
  // ----- APPENDIX: homepage-style detail slides -----
  { title: "Agent Optimization Platform — Components", section: "Appendix", component: SlidePlatformBoxes },
  { title: "Beyond Optimization — Capabilities", section: "Appendix", component: SlideBeyondBoxes },
  // ----- ORIGINAL ONE-PAGER SUMMARY (moved to the end via the slot-22 ↔ slot-1 swap) -----
  { title: "One-Pager Summary", section: "Appendix", component: SlideOnePagerSummary },
  // ----- HOW WE CONVERGE RAPIDLY (science + empirical data) -----
  { title: "How we converge rapidly", section: "Appendix", component: SlideHowWeConverge },
  // ----- MARKET OPPORTUNITY (for channel partners + investors) -----
  { title: "Market Opportunity — Wave / Pain / Play", section: "Appendix", component: SlideMarketOpportunity },
  // ----- SWEEP THE EVAL + OBSERVABILITY PACK (follow-up to slide 24) -----
  { title: "Sweep the Eval + Observability Pack", section: "Appendix", component: SlideSweepThePack },
  // ----- MARKET & REVENUE (the numbers from the partner brief) -----
  { title: "Market & Revenue — Non-Vendor Agents", section: "Appendix", component: SlideMarketAndRevenue },
  // ----- LIVE DEMO — appears as last slide of every filtered deck via URL ranges -----
  { title: "Optimization in Action (Video Demo)", section: "Demo", component: SlideOptimizationInActionDemo },
  // ----- 1-MIN STORY CTA — slide 5 of /investor-pitch (range 24-29) -----
  { title: "Watch the 1-minute story", section: "Demo", component: SlideStoryCTA },
  // ----- DUAL-CTA CLOSER — slide 6 of /investor-pitch (Start Now + Book a demo) -----
  { title: "Investor CTA — Start Now + Book a Demo", section: "Demo", component: SlideInvestorCTA },
];

export default function PitchShort() {
  // Drop the deprecated one-pager opener (redundant with SlideParetoFrontier).
  // It stays in SHORT_SLIDES at index 0 to keep 1-based range indices stable.
  return <PitchDeck slides={SHORT_SLIDES.filter((s) => s.component !== SlideOnePagerTextTestV2)} />;
}
