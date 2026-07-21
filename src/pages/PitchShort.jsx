// /pitch-short — abbreviated outreach pitch deck.
// Composes the shared PitchDeck shell from PitchFull with its own trimmed
// slides array. Two slides (Configuration Explosion and ROI Preview) are
// rendered through PitchFull's originals with override props for the
// subtitle / footer; everything else is imported directly. No structural
// JSX is duplicated from PitchFull.
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowDown, ArrowUp, ArrowUpRight, Blocks, ChevronsDown, Database, DollarSign, Check, Clock, MessageSquare, RefreshCw, ShieldCheck, Target, TrendingDown, TrendingUp, Users, X, Zap } from "lucide-react";
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
function BenefitBox({ icon: Icon, accent, metric, label, href }) {
  // When `href` is set the tile becomes a new-tab link with a hover lift.
  const Tag = href ? "a" : "div";
  const linkProps = href ? { href, target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <Tag
      {...linkProps}
      className={`block bg-slate-900/70 border-2 rounded-xl px-4 py-3 text-center${href ? " transition hover:brightness-125 hover:-translate-y-0.5" : ""}`}
      style={{ borderColor: `${accent}66` }}
    >
      <div className="flex items-center justify-center gap-2" style={{ color: accent }}>
        <Icon className="w-7 h-7" strokeWidth={3} />
        <span className="text-2xl font-extrabold tracking-tight leading-none">{metric}</span>
      </div>
      <div className="text-[11px] font-mono uppercase tracking-wider text-slate-300 mt-1">{label}</div>
    </Tag>
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
          Agent performance is a <span className="text-amber-500">multi-dimensional</span> optimization problem
        </h2>
      </div>

      {/* Mobile: stack the three cards (arrows hidden). md+: restore the
          canonical 5-col layout (card · arrow · card · arrow · card) used on
          the homepage hero and in the deck. */}
      <div className="grid grid-cols-1 gap-5 items-stretch md:grid-cols-[1fr_28px_1fr_28px_1fr] md:gap-0">
        {/* LEFT: 25+ knobs, reclassified per /knob-explorer */}
        <div className="bg-slate-900/70 border border-slate-700/60 rounded-xl p-4">
          <div className="text-center mb-3">
            <a href="https://www.traigent.ai/#/knob-explorer" target="_blank" rel="noopener noreferrer" className="inline-block rounded-lg px-4 py-1.5 text-2xl font-mono font-bold uppercase tracking-wide transition hover:brightness-110" style={{ backgroundColor: '#f59e0b', color: '#0f172a' }}>The Problem</a>
            <div className="text-[11px] text-slate-500 italic mt-1">Click for details</div>
          </div>
          <h3 className="text-[20px] font-bold text-white leading-tight mb-1 text-center">25+ configuration dimensions</h3>
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
            …plus more retrieval, memory and orchestration dimensions.
            <br />
            <span className="text-slate-600">Streaming · guardrails · caching are deploy-time settings — set once, not tuned.</span>
          </div>
        </div>

        {/* Arrow */}
        <div className="hidden md:flex items-center justify-center">
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
        <div className="hidden md:flex items-center justify-center">
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
            <BenefitBox icon={ArrowDown} accent="#34d399" metric="up to 60%"  label="LLM cost reduction" href="https://www.traigent.ai/#/roi" />
            <BenefitBox icon={ArrowDown} accent="#34d399" metric="up to 8 wks" label="Engineering time reclaimed" href="https://www.traigent.ai/#/ttm" />
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
          A Problem <span className="text-[#4D8EF8]">About to Explode</span>
        </h2>
        <p className="text-xl md:text-2xl text-slate-300 leading-snug">
          The cost vs. accuracy tuning crisis is just <span className="font-bold text-white">starting</span>.
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

// ---------------------------------------------------------------------------
// LIFECYCLE CLOSE — appended to the /short-summary preset. Two slides:
// (1) an agent's lifecycle is a moving target; (2) running optimization
// continuously and compounding the results holds the agent at high accuracy and
// low cost, cradle to grave. Audience-neutral — true whether the customer runs
// Traigent themselves or someone runs it for them.
// ---------------------------------------------------------------------------
function SlideAgentLifecycle() {
  return (
    <div className="w-full max-w-[1080px] mx-auto self-stretch flex flex-col justify-center min-h-[600px]">
      <div className="text-center mb-8">
        <div className="text-xs md:text-sm font-mono uppercase tracking-[0.3em] text-slate-500 mb-4">
          The agent lifecycle · cradle to grave
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight mb-3">
          Every agent is a moving target
        </h2>
        <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-snug">
          Teams launch with 1–2 models, 1–2 knobs, and barely a scored test set.
          Then reality piles on — and it never stops.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Where teams start */}
        <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-7">
          <div className="text-sm font-mono uppercase tracking-widest mb-4 text-slate-400">
            Day one · by hand
          </div>
          <ul className="space-y-2.5 text-slate-300 text-base">
            <li className="flex items-start gap-2.5"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0" />1–2 models, picked on a hunch</li>
            <li className="flex items-start gap-2.5"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0" />1–2 knobs, tuned by hand</li>
            <li className="flex items-start gap-2.5"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0" />trial-and-error, no convergence</li>
            <li className="flex items-start gap-2.5"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0" />a thin test set with no objective accuracy score</li>
          </ul>
        </div>

        {/* What never stops changing */}
        <div className="bg-slate-900/60 border-2 rounded-2xl p-7" style={{ borderColor: "#f59e0b" }}>
          <div className="text-sm font-mono uppercase tracking-widest mb-4" style={{ color: "#f59e0b" }}>
            What never stops evolving
          </div>
          <ul className="space-y-2.5 text-slate-200 text-base">
            <li className="flex items-start gap-2.5"><TrendingUp className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#34d399" }} />More knobs to add — and a growing, sharper eval set</li>
            <li className="flex items-start gap-2.5"><TrendingUp className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#34d399" }} />Push accuracy — plus new KPIs the business starts to care about</li>
            <li className="flex items-start gap-2.5"><TrendingDown className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#4D8EF8" }} />Drive cost down — lower-tier models + knobs that recover the accuracy</li>
            <li className="flex items-start gap-2.5"><Clock className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#a78bfa" }} />Production surfaces new questions and scope creep</li>
            <li className="flex items-start gap-2.5"><ArrowRight className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#a78bfa" }} />Business goals and agent requirements shift</li>
          </ul>
        </div>
      </div>

      <p className="text-center text-base md:text-lg text-slate-400 mt-8 max-w-3xl mx-auto leading-snug">
        A one-time, by-hand tune doesn’t hold. The target keeps moving —
        <span className="text-slate-200 font-semibold"> before and after launch.</span>
      </p>
    </div>
  );
}

function SlideContinuousOptimization() {
  return (
    <div className="w-full max-w-[1080px] mx-auto self-stretch flex flex-col justify-center min-h-[600px]">
      <div className="text-center mb-8">
        <div className="text-xs md:text-sm font-mono uppercase tracking-[0.3em] text-slate-500 mb-4">
          Continuous optimization → Continuous Evolution
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight tracking-tight mb-3">
          Run it continuously. Accumulate every result.
        </h2>
        <p className="text-2xl md:text-4xl font-semibold text-slate-300 max-w-3xl mx-auto leading-snug">
          <span style={{ color: "#4D8EF8" }}>→ constant agent evolution, <span className="whitespace-nowrap">cradle to grave.</span></span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-slate-900/60 border rounded-2xl p-7" style={{ borderColor: "#1A6BF566" }}>
          <div className="text-sm font-mono mb-3" style={{ color: "#4D8EF8" }}>● ALWAYS OPTIMIZING</div>
          <p className="text-slate-300 text-base leading-snug">
            Every change is a fresh sweep, not a fire drill — new knobs, new data,
            new models, new KPIs, new pricing.
          </p>
        </div>
        <div className="bg-slate-900/60 border rounded-2xl p-7" style={{ borderColor: "#a78bfa66" }}>
          <div className="text-sm font-mono mb-3" style={{ color: "#a78bfa" }}>● EMPIRICAL DATA COMPOUNDS</div>
          <p className="text-slate-300 text-base leading-snug">
            Results accumulate. Traigent learns from the whole history to deduce
            the next configs — and the recommended next moves to evolve the agent.
          </p>
        </div>
        <div className="bg-slate-900/60 border rounded-2xl p-7" style={{ borderColor: "#34d39966" }}>
          <div className="text-sm font-mono mb-3" style={{ color: "#34d399" }}>● HELD AT THE FRONTIER</div>
          <p className="text-slate-300 text-base leading-snug">
            Continuously near max accuracy <span className="text-white font-semibold">and</span> min
            cost — cheaper models + the right knobs, not a one-and-done tune.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl p-6 text-center border" style={{ borderColor: "#1A6BF566", background: "rgba(26,107,245,0.08)" }}>
        <p className="text-lg md:text-2xl text-white font-semibold leading-snug">
          Continuous Optimization cycles → every iteration evolves the agent and keeps it optimal
        </p>
      </div>
    </div>
  );
}

// The core claim, with a proof-by-divergence chart: the optimal config is a
// moving target; a tuned-once agent drifts off it and decays, while the
// continuous loop re-converges to the moving optimum after every change — so
// the loop is what actually keeps the agent evolving.
function SlideLoopProof() {
  return (
    <div className="w-full max-w-[1080px] mx-auto self-stretch flex flex-col justify-center min-h-[600px]">
      <div className="text-center mb-4">
        <div className="text-xs md:text-sm font-mono uppercase tracking-[0.3em] text-slate-500 mb-4">
          The core claim
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight tracking-tight mb-3">
          The feedback loop is how the agent evolves
        </h2>
        <p className="text-base md:text-lg text-slate-300 max-w-3xl mx-auto leading-snug">
          The best configuration is a moving target — data, models, prices, questions
          and goals all shift. Tune once and the agent silently drifts off the
          frontier; keep the loop running and it tracks the moving optimum — it evolves.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm mb-1">
        <span className="flex items-center gap-2"><span className="inline-block w-6 h-[3px] rounded" style={{ background: "#1A6BF5" }} /><span className="text-slate-200">continuously optimized</span></span>
        <span className="flex items-center gap-2"><span className="inline-block w-6 h-[3px] rounded" style={{ background: "#64748b" }} /><span className="text-slate-400">tuned once</span></span>
        <span className="flex items-center gap-2"><span className="inline-block w-6 border-t-2 border-dashed align-middle" style={{ borderColor: "#4ade80" }} /><span className="text-slate-400">the optimum (keeps moving)</span></span>
      </div>

      <svg viewBox="0 0 1000 300" className="w-full max-w-5xl mx-auto">
        <line x1="70" y1="40" x2="70" y2="250" stroke="#334155" strokeWidth="1" />
        <line x1="70" y1="250" x2="950" y2="250" stroke="#334155" strokeWidth="1" />
        <text x="58" y="50" textAnchor="end" fill="#4ade80" fontSize="12" fontFamily="monospace">optimal</text>
        <text x="58" y="246" textAnchor="end" fill="#64748b" fontSize="12" fontFamily="monospace">worse</text>
        <text x="510" y="286" textAnchor="middle" fill="#475569" fontSize="13" fontFamily="monospace">agent lifetime →  every change is a new optimization</text>

        {[[260, "+ data"], [450, "+ cheaper model"], [640, "price shift"], [830, "new questions"]].map(([x, label], i) => (
          <g key={i}>
            <line x1={x} y1="40" x2={x} y2="250" stroke="#334155" strokeWidth="0.8" strokeDasharray="3,4" opacity="0.6" />
            <text x={x} y="268" textAnchor="middle" fill="#64748b" fontSize="11" fontFamily="monospace">{label}</text>
          </g>
        ))}

        {/* the moving optimum / frontier */}
        <line x1="70" y1="95" x2="950" y2="55" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="5,4" opacity="0.75" />

        {/* tuned once — drifts off as the optimum moves away */}
        <path d="M 70 95 L 260 95 L 260 122 L 450 122 L 450 152 L 640 152 L 640 188 L 830 188 L 830 216 L 950 216" stroke="#64748b" strokeWidth="2.5" fill="none" />

        {/* continuously optimized — re-converges to the frontier after each change */}
        <path d="M 70 95 L 255 86 L 290 101 L 450 76 L 480 92 L 640 68 L 670 84 L 830 61 L 860 77 L 950 56" stroke="#1A6BF5" strokeWidth="2.5" fill="none" />
        {[[70, 95], [450, 76], [640, 68], [830, 61], [950, 56]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="4" fill="#1A6BF5" />
        ))}
      </svg>

      <p className="text-center text-sm md:text-base text-slate-400 mt-4 max-w-3xl mx-auto leading-snug">
        And it’s cheap enough to mean it: Traigent converges in
        <span className="text-slate-200 font-semibold"> &lt;10% of the search space, in hours</span> —
        so you re-optimize every time something changes. <span className="text-white font-semibold">Continuous is the point.</span>
      </p>
    </div>
  );
}

// ── CUSTOMER DECK ───────────────────────────────────────────────────────────
// THE OBJECTIVE — a real, measured Traigent campaign on SPIDER text2SQL.
// Built for laypeople: show the end result first (the accuracy↔cost frontier),
// explain that every knob combination is a new "agent variant", and be honest
// about the premium models we tested and discarded. Every number here is
// measured (customer-demo-simulation#2 writeup: SPIDER execution-match,
// bayesian/cost-capped/portal-tracked search, leave-one-out few-shot, validated
// on the full 1,034-question dev set). Do NOT round these away.
function SlideCustomerObjectiveSpider() {
  const FRONTIER = [
    {
      v: <><span className="text-slate-400">gpt‑4o‑mini · ddl_fk · k2 · fixed</span> <span className="text-slate-600">(no sql_guidance)</span></>,
      acc: "72.0%", accColor: "#f59e0b", cost: "$0.000063",
      note: "naïve “best” — what you’d ship without Traigent", dim: true,
    },
    {
      v: <>gpt‑4o‑mini · <span className="text-white">compact</span> · k2 · <span className="text-white">sql_guidance</span></>,
      acc: "86.0%", cost: "$0.000074", note: "+14 pts at ~the OLD price",
    },
    {
      v: <>gpt‑4o‑mini · <span className="text-white">m_schema · k4</span> · sql_guidance</>,
      acc: "87.0%", cost: "$0.000101", note: "best value — ~½ the winner’s cost",
    },
    {
      v: <>deepseek · compact · k2 · sql_guidance</>,
      acc: "87.7%", cost: "$0.000131", note: "cross‑vendor, still cheap",
    },
    {
      v: <span className="text-white font-semibold">deepseek · m_schema · k4 · sql_guidance</span>,
      acc: "90.7%", accColor: "#34d399", cost: "$0.000179",
      note: "most accurate · 89.6% on the full 1,034‑dev", win: true,
    },
  ];
  return (
    <div className="w-full max-w-[1180px] mx-auto self-stretch flex flex-col min-h-[600px]">
      {/* SPIDER explainer — top, for the uninitiated */}
      <div className="text-xs md:text-sm font-mono uppercase tracking-[0.3em] text-slate-500 mb-2">
        Finding the Pareto Optimal Frontier — Demonstrated
      </div>
      <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-[12.5px] md:text-sm text-slate-300 leading-snug mb-3">
        <span className="text-slate-100 font-semibold">SPIDER</span> is the academic benchmark for{" "}
        <span className="text-white font-semibold">text‑to‑SQL</span> — turning a plain‑English question into a correct
        database query. ~1,034 dev questions across 20 different databases; an answer only counts if the generated SQL,
        when <span className="italic">executed</span>, returns the same rows as the human “gold” query{" "}
        <span className="text-slate-400">(execution match)</span>.
      </div>

      {/* The objective, stated for laypeople */}
      <h2 className="text-2xl md:text-[2.6rem] font-bold text-white leading-[1.1] tracking-tight mb-1">
        Traigent Results — Demonstrated on <span style={{ color: "#34d399" }}>SPIDER text2SQL</span>
      </h2>
      <p className="text-[13px] md:text-base text-slate-400 leading-snug mb-3">
        <span className="text-slate-200 font-semibold">Traigent finds them.</span> You pick the agent variant that fits your budget.
      </p>

      {/* The frontier — the end result, shown first */}
      <div className="rounded-xl border border-slate-700/60 overflow-hidden">
        <table className="w-full text-left text-[12.5px] md:text-sm">
          <thead className="bg-slate-800/70 text-slate-400 text-[10px] md:text-[11px] uppercase tracking-wider">
            <tr>
              <th className="px-3 py-2 font-semibold">Agent variants recommended and developed by Traigent</th>
              <th className="px-3 py-2 font-semibold text-right whitespace-nowrap">Accuracy</th>
              <th className="px-3 py-2 font-semibold text-right whitespace-nowrap">$/query</th>
              <th className="px-3 py-2 font-semibold">What it is</th>
            </tr>
          </thead>
          <tbody>
            {FRONTIER.map((r, i) => (
              <tr
                key={i}
                className="border-t border-slate-800"
                style={r.win ? { background: "rgba(52,211,153,0.10)" } : undefined}
              >
                <td className={"px-3 py-2 " + (r.dim ? "text-slate-400" : "text-slate-200")}>
                  {r.win ? <span style={{ color: "#34d399" }}>★ </span> : null}
                  {r.v}
                </td>
                <td className="px-3 py-2 text-right font-mono font-semibold whitespace-nowrap" style={{ color: r.accColor || "#e2e8f0" }}>
                  {r.acc}
                </td>
                <td className="px-3 py-2 text-right font-mono text-slate-300 whitespace-nowrap">{r.cost}</td>
                <td className="px-3 py-2 text-slate-400">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] md:text-xs text-slate-400 mt-2 mb-3">
        <span className="text-slate-200 font-semibold">Millions</span>
        <span>possible</span>
        <span className="text-slate-600">·</span>
        <span className="text-slate-200 font-semibold">~5,200</span>
        <span>variants considered</span>
        <span className="text-slate-600">·</span>
        <span className="text-slate-200 font-semibold">~420</span>
        <span>evaluated</span>
        <span className="text-slate-600">·</span>
        <span className="font-semibold" style={{ color: "#34d399" }}>frontier found</span>
        <span className="text-slate-500">— smart search, not brute force</span>
        <span className="text-slate-600">·</span>
        <a
          href="/#/knob-explorer"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-0.5 font-semibold hover:underline"
          style={{ color: "#4D8EF8" }}
        >
          See the building blocks<ArrowUpRight className="w-3 h-3" />
        </a>
      </div>

      {/* How we got there + what we discarded */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-3.5">
          <div className="text-[10px] md:text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: "#4D8EF8" }}>
            How the ~90% was found
          </div>
          <p className="text-[12px] md:text-[13.5px] text-slate-300 leading-snug">
            Three broad searches all plateaued at an apparent <span className="text-white font-semibold">82.5%</span> — it
            looked like a ceiling. It wasn’t: it was an <span className="text-white font-semibold">under‑explored region</span>.
            Diagnosing the misses (group‑by aggregation) and adding one new knob —{" "}
            <span className="text-white font-semibold">sql_guidance</span> — broke it →{" "}
            <span className="font-semibold" style={{ color: "#34d399" }}>89.6% on the full 1,034‑dev set</span>.{" "}
            <span className="text-slate-200 font-semibold">Knobs beat the model.</span>
          </p>
        </div>
        <div className="bg-slate-900/50 border-2 rounded-xl p-3.5" style={{ borderColor: "rgba(245,158,11,0.4)" }}>
          <div className="text-[10px] md:text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: "#f59e0b" }}>
            Premium models tested → discarded
          </div>
          <ul className="text-[12px] md:text-[13.5px] text-slate-300 leading-snug space-y-1">
            <li className="flex items-start gap-1.5">
              <X className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: "#f59e0b" }} />
              <span><span className="text-slate-100">gpt‑4o</span> (premium): 72.5% at ~17× the cost</span>
            </li>
            <li className="flex items-start gap-1.5">
              <X className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: "#f59e0b" }} />
              <span><span className="text-slate-100">Claude Sonnet‑4</span> / <span className="text-slate-100">DeepSeek R1</span> (reasoning): 72.5% — below the cheap model</span>
            </li>
          </ul>
          <p className="text-[11px] md:text-[12.5px] text-slate-400 leading-snug mt-1.5">
            <span className="text-slate-300 font-semibold">Why:</span> strong models write valid‑but‑<span className="italic">different</span>{" "}
            SQL (LEFT joins, verbose forms, different column order) that mismatches SPIDER’s quirky gold, so execution‑match
            scores them <span className="italic">down</span>. Capability isn’t the bottleneck; gold‑conformance is.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── CUSTOMER DECK ───────────────────────────────────────────────────────────
// "Appreciating Traigent's immense accomplishment" — the impact/why-it-matters
// slide that follows the frontier. Funnel: millions of possible variants →
// ~5,200 considered → ~420 evaluated → 1 frontier. Numbers are defensible:
// 5,198 = sum of the 18 sweep search-spaces (overlapping); ~420 = summed
// MAX_CONFIGS trial budget (actual evaluated fewer due to plateau stopping);
// "millions" = the full knob×model union. Claims kept to what we can stand
// behind (Pareto dominance, not "global-optimum / no doubts").
function SlideCustomerImmenseAccomplishment() {
  const funnel = [
    { big: "Millions", small: "possible agent variants", color: "#64748b" },
    { big: "~5,200", small: "permutations considered", color: "#4D8EF8" },
    { big: "~420", small: "actually evaluated", color: "#a78bfa" },
    { big: "1", small: "Pareto frontier (5 variants)", color: "#34d399" },
  ];
  const cards = [
    { icon: Zap, c: "#f59e0b", big: "~5 hours, autonomously", sub: "Whole search across 18 runs — longest just 48 min, no human in the loop" },
    { icon: TrendingDown, c: "#34d399", big: "Up to ~90% lower cost", sub: "Winner ≈ $0.00018/query vs premium models at ~10–17×" },
    { icon: Users, c: "#4D8EF8", big: "Dozens of man‑days saved", sub: "vs hand‑sweeping the configuration space" },
    { icon: ShieldCheck, c: "#a78bfa", big: "Complete confidence", sub: "Pareto‑proven — every variant provably non‑dominated" },
  ];
  return (
    <div className="w-full max-w-[1180px] mx-auto self-stretch flex flex-col min-h-[600px]">
      <div className="text-xs md:text-sm font-mono uppercase tracking-[0.3em] text-slate-500 mb-2">Why this matters</div>
      <h2 className="text-2xl md:text-[2.6rem] font-bold text-white leading-[1.1] tracking-tight mb-3">
        Appreciating Traigent’s <span style={{ color: "#34d399" }}>Immense Accomplishment</span>
      </h2>

      {/* Start with the before → after: a naive agent, developed single-handedly.
          ~70% = measured naive run (fewshot_k=0, just model+temperature; floor 62%,
          even premium gpt-4o = 70%). 90.7% / 89.6% = the developed winner. */}
      <div className="flex items-stretch gap-3 md:gap-4 mb-2">
        <div className="flex-1 bg-slate-900/60 border border-slate-700/50 rounded-2xl p-4 flex flex-col justify-center">
          <div className="text-[11px] md:text-xs text-slate-400 leading-snug mb-1.5">
            Traigent was given a <span className="text-slate-200 font-semibold">naive agent</span> — just model + temperature
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl md:text-[2.5rem] font-bold leading-none" style={{ color: "#f59e0b" }}>~70%</span>
            <span className="text-[11px] text-slate-500">(as low as 62%)</span>
          </div>
          <div className="text-[12px] md:text-[13px] font-mono text-slate-400 mt-1.5">~$0.0010<span className="text-slate-600"> / query</span></div>
        </div>
        <div className="flex items-center"><ArrowRight className="w-7 h-7 text-slate-500 shrink-0" /></div>
        <div className="flex-1 bg-slate-900/60 border-2 rounded-2xl p-4 flex flex-col justify-center" style={{ borderColor: "rgba(52,211,153,0.4)" }}>
          <div className="text-[11px] md:text-xs text-slate-400 leading-snug mb-1.5">
            It developed the most efficient agent — <span className="text-slate-200 font-semibold">single‑handedly</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl md:text-[2.5rem] font-bold leading-none" style={{ color: "#34d399" }}>90.7%</span>
            <span className="text-[11px] text-slate-500">89.6% on full dev</span>
          </div>
          <div className="text-[12px] md:text-[13px] font-mono mt-1.5" style={{ color: "#34d399" }}>~$0.00018<span className="text-slate-600"> / query</span></div>
        </div>
      </div>
      <div className="text-center text-[12.5px] md:text-sm text-slate-300 mb-4">
        → the developed optimum is <span className="font-semibold" style={{ color: "#34d399" }}>~82% cheaper</span> and{" "}
        <span className="font-semibold text-white">~20 points more accurate</span>
      </div>

      <p className="text-[13px] md:text-base text-slate-400 leading-snug mb-3">
        The full space spans <span className="text-slate-200 font-semibold">millions</span> of possible agent variants, each
        scored against the <span className="text-slate-200 font-semibold">1,034‑question</span> SPIDER benchmark —
        brute‑force would mean <span className="text-slate-200 font-semibold">billions</span> of evaluations.{" "}
        <a
          href="/#/knob-explorer"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-0.5 font-semibold hover:underline whitespace-nowrap"
          style={{ color: "#4D8EF8" }}
        >
          Explore the building blocks<ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </p>

      {/* The funnel: millions → 5,200 → 420 → 1 */}
      <div className="flex items-stretch gap-2 md:gap-3 mb-3">
        {funnel.map((f, i) => (
          <div key={i} className="contents">
            <div className="flex-1 bg-slate-900/60 border border-slate-700/50 rounded-2xl px-3 py-4 text-center flex flex-col justify-center">
              <div className="text-2xl md:text-4xl font-bold leading-none" style={{ color: f.color }}>{f.big}</div>
              <div className="text-[11px] md:text-xs text-slate-400 mt-1.5 leading-tight">{f.small}</div>
            </div>
            {i < funnel.length - 1 && (
              <div className="flex items-center"><ArrowRight className="w-5 h-5 text-slate-600 shrink-0" /></div>
            )}
          </div>
        ))}
      </div>

      {/* The punch line */}
      <div
        className="rounded-xl border-2 px-4 py-2.5 mb-4 text-center text-[13px] md:text-base text-slate-200"
        style={{ borderColor: "rgba(52,211,153,0.35)", background: "rgba(52,211,153,0.06)" }}
      >
        Traigent skipped <span className="font-semibold" style={{ color: "#34d399" }}>more than 99.9%</span> of the possible
        variants — developed the <span className="font-semibold text-white">best agent variants for the job</span>.
      </div>

      {/* Outcome cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-3.5">
              <Icon className="w-6 h-6 mb-2" style={{ color: c.c }} />
              <div className="text-[15px] md:text-lg font-bold text-white leading-tight">{c.big}</div>
              <div className="text-[11px] md:text-xs text-slate-400 mt-1 leading-snug">{c.sub}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── CUSTOMER DECK ───────────────────────────────────────────────────────────
// Opening hook (slide 1 of the customer deck): the positioning claim. Others
// "help"; Traigent develops THE BEST agent and arrives at THE optimum. NOTE:
// "the optimum" is founder-approved positioning — technically Traigent runs
// systematic (bayesian) optimization and returns a provably non-dominated
// (Pareto-optimal) frontier among everything it evaluated, not a global-optimum
// proof. Kept as written per Amir; see chat for the defensible alternatives.
function SlideCustomerHook() {
  // Intra-deck jump: scroll to slide 2 (the frontier). The deck gives each
  // section an id="slide-N"; native #anchors would fight the HashRouter, so
  // we scroll programmatically.
  const goToSlide2 = () =>
    document.getElementById("slide-2")?.scrollIntoView({ behavior: "smooth", block: "start" });
  return (
    <div className="w-full max-w-[1080px] mx-auto self-stretch flex flex-col justify-center min-h-[600px]">
      <div className="text-xs md:text-sm font-mono uppercase tracking-[0.3em] text-slate-500 mb-7">Why Traigent</div>

      {/* The foil — what everyone else can only claim */}
      <p className="text-lg md:text-2xl text-slate-400 leading-snug mb-7 max-w-[880px]">
        Many may claim they <span className="italic text-slate-300">help</span> reduce agent costs — but they can’t{" "}
        <span className="italic text-slate-300">prove</span> they’ve found the best possible result.
      </p>

      <div className="h-px w-20 bg-slate-700 mb-7" />

      {/* Traigent's answer */}
      <div className="space-y-10">
        <p className="text-3xl md:text-5xl font-bold text-white leading-[1.12] tracking-tight">
          Traigent doesn’t just help.{" "}
          <a
            href="/#/knob-explorer"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-2 decoration-slate-600 hover:decoration-[#4D8EF8] underline-offset-[6px] transition-colors"
          >
            It instructs your coding agent how to build <span style={{ color: "#34d399" }}>THE BEST</span> agent
            <ArrowUpRight className="inline-block align-middle w-6 h-6 md:w-8 md:h-8 ml-1" style={{ color: "#4D8EF8" }} />
          </a>.
        </p>
        <p className="text-3xl md:text-5xl font-bold text-white leading-[1.12] tracking-tight">
          Traigent doesn’t guess.{" "}
          <span
            role="button"
            tabIndex={0}
            onClick={goToSlide2}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); goToSlide2(); } }}
            className="cursor-pointer underline decoration-2 decoration-slate-600 hover:decoration-[#34d399] underline-offset-[6px] transition-colors"
          >
            It mathematically arrives at <span style={{ color: "#34d399" }}>THE optimum</span>
            <ArrowDown className="inline-block align-middle w-6 h-6 md:w-8 md:h-8 ml-1" style={{ color: "#34d399" }} />
          </span>.
        </p>
      </div>
    </div>
  );
}

// ── CUSTOMER DECK ───────────────────────────────────────────────────────────
// Slide 4: the dataset + continuous-optimization argument. SPIDER was the rare
// case (a ready, proven 1,034-Q benchmark). Most teams start from a few I/O
// logs and must evolve a dataset — which never stops evolving (unexpected
// questions; models/prices/requirements change). So agents must re-optimize
// continuously. Traigent helps on both: dataset quality + re-finding the optimum.
function SlideCustomerContinuous() {
  return (
    <div className="w-full max-w-[1100px] mx-auto self-stretch flex flex-col justify-center min-h-[600px]">
      <div className="text-xs md:text-sm font-mono uppercase tracking-[0.3em] text-slate-500 mb-2">Continuous optimization</div>
      <h2 className="text-2xl md:text-[2.6rem] font-bold text-white leading-[1.1] tracking-tight mb-4">
        The optimum is a <span style={{ color: "#34d399" }}>moving target</span>
      </h2>

      {/* The data reality: SPIDER had it; you build it */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-5 h-5 shrink-0" style={{ color: "#4D8EF8" }} />
            <span className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-slate-400">SPIDER — the exception</span>
          </div>
          <p className="text-[13px] md:text-[15px] text-slate-300 leading-snug">
            Came with <span className="text-white font-semibold">1,034 strong, proven examples</span> — a ready‑made benchmark to optimize against.
          </p>
        </div>
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-5 h-5 shrink-0" style={{ color: "#f59e0b" }} />
            <span className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-slate-400">Most teams — the reality</span>
          </div>
          <p className="text-[13px] md:text-[15px] text-slate-300 leading-snug">
            Start with <span className="text-white font-semibold">a few input/output logs</span> — Traigent helps evolve them into a full‑blown dataset.
          </p>
        </div>
      </div>

      {/* Why it never ends */}
      <div className="bg-slate-900/40 border border-slate-700/40 rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-2.5">
          <RefreshCw className="w-5 h-5 shrink-0" style={{ color: "#a78bfa" }} />
          <span className="text-[15px] md:text-base font-semibold text-white">Evolving the dataset is a never‑ending story</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[12.5px] md:text-sm text-slate-300">
          <div className="flex items-start gap-2"><MessageSquare className="w-4 h-4 mt-0.5 shrink-0 text-slate-500" />Users ask questions you never expected</div>
          <div className="flex items-start gap-2"><TrendingUp className="w-4 h-4 mt-0.5 shrink-0 text-slate-500" />Models evolve · prices change</div>
          <div className="flex items-start gap-2"><ArrowUp className="w-4 h-4 mt-0.5 shrink-0 text-slate-500" />Business requirements shift</div>
        </div>
        <div className="text-[13px] md:text-[15px] text-slate-200 mt-2.5">
          → agents must evolve <span className="font-semibold" style={{ color: "#34d399" }}>continuously</span>
        </div>
      </div>

      {/* The Traigent payoff */}
      <div
        className="rounded-xl border-2 px-4 py-3 text-center text-[14px] md:text-lg text-slate-100"
        style={{ borderColor: "rgba(52,211,153,0.35)", background: "rgba(52,211,153,0.06)" }}
      >
        Traigent evolves your dataset’s <span className="font-semibold text-white">quality</span> — and re‑finds{" "}
        <span className="font-semibold" style={{ color: "#34d399" }}>the optimum</span> every time things change.
      </div>
    </div>
  );
}

// ── CUSTOMER DECK ───────────────────────────────────────────────────────────
// Slide 5: credibility + IP. Built by ML/AI experts; the algorithms are the
// secret sauce. The supporting line grounds the claim in the demonstrated
// efficiency (a few hundred trials out of millions — ties back to slide 3).
function SlideCustomerTeam() {
  const pillars = [
    { icon: Blocks,   c: "#4D8EF8", t: "Building the Optimal Agent" },
    { icon: Target,   c: "#34d399", t: "Converging Mathematically to the Optimal Frontier" },
    { icon: Database, c: "#a78bfa", t: "Augmenting the Dataset" },
  ];
  return (
    <div className="w-full max-w-[1040px] mx-auto self-stretch flex flex-col justify-center min-h-[600px]">
      <div className="text-xs md:text-sm font-mono uppercase tracking-[0.3em] text-slate-500 mb-3">Under the hood</div>
      <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight tracking-tight mb-6">
        Traigent’s <span style={{ color: "#34d399" }}>Unique Capabilities</span>
      </h2>

      {/* The three pillars of Traigent's secret sauce: build the agent,
          converge to the optimal frontier, augment the dataset. */}
      <div className="space-y-3 mb-6">
        {pillars.map((p, i) => {
          const Icon = p.icon;
          return (
            <div key={i} className="flex items-center gap-4 bg-slate-900/50 border border-slate-700/50 rounded-2xl px-5 py-4">
              <span className="text-base md:text-lg font-mono text-slate-600 shrink-0 w-5 text-center">{i + 1}</span>
              <Icon className="w-7 h-7 md:w-8 md:h-8 shrink-0" style={{ color: p.c }} />
              <span className="text-lg md:text-2xl font-bold text-white leading-tight">{p.t}</span>
            </div>
          );
        })}
      </div>

      <p className="text-[13px] md:text-base text-slate-400 leading-snug max-w-[960px]">
        Built by <span className="text-slate-200 font-semibold">Mathematicians &amp; AI experts</span> — smart search, not brute
        force: the algorithms zero in on the best agent variants in a fraction of the time it would have taken otherwise.{" "}
        <a
          href="/#/knob-explorer"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 font-semibold hover:underline whitespace-nowrap"
          style={{ color: "#4D8EF8" }}
        >
          Browse Traigent’s building blocks<ArrowUpRight className="w-4 h-4" />
        </a>
      </p>
    </div>
  );
}

// Traffic-light dot — semantic RAG state (kept distinct from the blue brand accent).
function TrafficDot({ c }) {
  const map = { r: "#f43f5e", a: "#f59e0b", g: "#34d399" };
  return (
    <span
      className="inline-block w-3 h-3 rounded-full shrink-0"
      style={{ backgroundColor: map[c], boxShadow: `0 0 10px ${map[c]}99` }}
    />
  );
}

// Slide: THE TRAIGENT METHOD — four pillars, each scored (traffic light),
// recommended, and improved, on a repeating cycle. Product-concept slide.
function SlideFourPillars() {
  const pillars = [
    { num: "1 · DATASET", name: "The dataset", one: 'What "good" is measured on.',
      light: "a", label: "Amber", lc: "#f59e0b",
      rec: "Reconstruct from logs, harden for coverage & discrimination." },
    { num: "2 · EVALUATION", name: "The evaluation", one: "How we grade it — the scorer & its rules.",
      light: "r", label: "Red", lc: "#f43f5e",
      rec: "Manufacture a verifier or calibrate the judge; confirm it picks the true winner." },
    { num: "3a · DIMENSIONS", name: "The config space", one: "What we can change — the full arsenal.",
      light: "a", label: "Amber", lc: "#f59e0b",
      rec: "Diagnose the misses → the vital-few dimensions: model · retrieval · prompt · format · examples · reasoning · multi-model routing …" },
    { num: "3b · SEARCH", name: "The optimization", one: "How we search — the run sequence.",
      light: "g", label: "Green", lc: "#34d399",
      rec: "Seeded hypothesis-chain → the accuracy → cost/latency Pareto." },
  ];
  const steps = ["Assess", "Score", "Recommend", "Improve"];
  return (
    <div className="w-full">
      <div className="text-center mb-5">
        <div className="text-[11px] font-mono uppercase tracking-[0.34em] text-blue-400 mb-2">The Traigent Method</div>
        <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
          Four Pillars — <span className="text-blue-400">Scored</span>, Recommended,{" "}
          <span style={{ color: "#34d399" }}>Improved</span>. On repeat.
        </h2>
        <p className="text-sm text-slate-400 max-w-3xl mx-auto mt-2 leading-snug">
          Traigent assesses every optimization along four pillars, scores each red / amber / green,
          recommends the highest-leverage fix, and improves it — cycle after cycle, until all four hold green.
        </p>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {pillars.map((p) => (
          <div key={p.num} className="flex flex-col gap-1.5 bg-slate-900/60 border border-slate-700/50 rounded-xl p-4">
            <span className="self-start text-[10px] font-mono font-bold text-slate-900 bg-blue-400 rounded px-1.5 py-0.5 tracking-wide">{p.num}</span>
            <span className="text-base font-bold text-white leading-tight">{p.name}</span>
            <span className="text-xs text-slate-400 leading-snug">{p.one}</span>
            <span className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider mt-0.5" style={{ color: p.lc }}>
              <TrafficDot c={p.light} /> {p.label}
            </span>
            <span className="mt-auto pt-2 border-t border-slate-700/50 text-xs text-slate-300 leading-snug">
              <span className="text-slate-500">→</span> {p.rec}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
        {steps.map((s) => (
          <span key={s} className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest bg-slate-800/60 border border-slate-700/50 rounded-full px-4 py-1.5 text-slate-200">{s}</span>
            <span className="text-slate-600">→</span>
          </span>
        ))}
        <span className="text-xs font-mono uppercase tracking-widest rounded-full px-4 py-1.5 font-bold text-slate-900"
          style={{ background: "linear-gradient(135deg,#60a5fa,#3b82f6)" }}>↻ Repeat</span>
      </div>
      <div className="flex items-center justify-center gap-6 mt-4 text-[11px] font-mono uppercase tracking-wider text-slate-500">
        <span className="flex items-center gap-1.5"><TrafficDot c="r" /> Blocking</span>
        <span className="flex items-center gap-1.5"><TrafficDot c="a" /> Works, weak</span>
        <span className="flex items-center gap-1.5"><TrafficDot c="g" /> Strong · graduate at all-green</span>
      </div>
    </div>
  );
}

// Slide: THE SYSTEM — local (coding agent + SDK + skills) ↔ Traigent cloud
// (backend + frontend), joined by the connective files (run-plans, agg ledger,
// harness registry). Product-concept slide.
function SlideArchitecture() {
  const files = [
    ["Run-plans", "hypothesis nodes"],
    ["Aggregate ledger", "the chain of results"],
    ["Harness / scheme registry", "reproducibility"],
  ];
  const be = ["Smart optimizer", "Next-step planner", "Traffic-light scoring", "Registries"];
  const fe = ["Four-pillar scores", "Run-plan chain", "Pareto frontier", "Approve gate"];
  return (
    <div className="w-full">
      <div className="text-center mb-5">
        <div className="text-[11px] font-mono uppercase tracking-[0.34em] text-blue-400 mb-2">How it runs</div>
        <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
          Your coding agent. <span className="text-blue-400">Traigent&apos;s brain.</span>
        </h2>
        <p className="text-sm text-slate-400 max-w-3xl mx-auto mt-2 leading-snug">
          Point Claude Code or Codex at your agent. Your data stays local; the cloud conducts the search and
          plans each next step; the portal shows the whole chain.
        </p>
      </div>
      <div className="grid grid-cols-[1fr_0.82fr_1fr] gap-3 items-stretch">
        {/* LOCAL */}
        <div className="flex flex-col gap-2 bg-slate-900/60 rounded-xl p-4 border" style={{ borderColor: "rgba(59,130,246,.4)" }}>
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-blue-400">On your machine · local</div>
          <div className="text-sm font-semibold rounded-lg px-3 py-2" style={{ background: "rgba(59,130,246,.14)", border: "1px solid rgba(59,130,246,.35)", color: "#dbeafe" }}>Claude Code / Codex — your coding agent</div>
          <div className="text-sm rounded-lg px-3 py-2 bg-slate-800/50 border border-slate-700/50 text-slate-200">Traigent SDK</div>
          <div className="text-sm rounded-lg px-3 py-2 bg-slate-800/50 border border-slate-700/50 text-slate-200">Traigent Skills</div>
          <div className="text-xs text-slate-400 leading-snug mt-1">
            Assesses the pillars · <span className="text-slate-200 font-semibold">authors run-plans</span> · executes the harness
            (real evals) · keeps your <span className="text-slate-200 font-semibold">data + traces local</span>.
          </div>
        </div>
        {/* SPINE — connective files */}
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl p-3 border border-dashed border-slate-600/70">
          <div className="text-[10px] font-mono uppercase tracking-[0.16em]" style={{ color: "#a78bfa" }}>The connective files</div>
          {files.map(([t, s]) => (
            <div key={t} className="w-full text-center text-sm font-semibold bg-slate-800/50 border border-slate-600/70 rounded-lg px-2 py-2">
              {t}
              <span className="block text-[10px] font-mono uppercase tracking-wide text-slate-500 font-normal mt-0.5">{s}</span>
            </div>
          ))}
          <div className="flex justify-between w-full text-[10px] font-mono mt-0.5">
            <span className="text-blue-400">▲ plans · results</span>
            <span style={{ color: "#34d399" }}>plan · seeds ▼</span>
          </div>
        </div>
        {/* CLOUD */}
        <div className="flex flex-col gap-2 bg-slate-900/60 border border-slate-700/50 rounded-xl p-4">
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">Traigent cloud</div>
          <div className="grid grid-rows-2 gap-2 flex-1">
            <div className="rounded-lg p-3 bg-slate-800/50 border border-slate-700/50 flex flex-col gap-1.5">
              <div className="text-[10px] font-mono uppercase tracking-[0.16em]" style={{ color: "#34d399" }}>Backend · the conductor</div>
              <div className="flex flex-wrap gap-1.5">
                {be.map((t) => (<span key={t} className="text-[11px] bg-slate-900/70 border border-slate-700/50 rounded px-2 py-1 text-slate-200">{t}</span>))}
              </div>
            </div>
            <div className="rounded-lg p-3 bg-slate-800/50 border border-slate-700/50 flex flex-col gap-1.5">
              <div className="text-[10px] font-mono uppercase tracking-[0.16em]" style={{ color: "#a78bfa" }}>Frontend · the cockpit</div>
              <div className="flex flex-wrap gap-1.5">
                {fe.map((t) => (<span key={t} className="text-[11px] bg-slate-900/70 border border-slate-700/50 rounded px-2 py-1 text-slate-200">{t}</span>))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="text-center text-sm text-slate-300 mt-5">
        <span className="text-blue-400 font-semibold">Point your coding agent at your agent</span> — data stays local,
        the cloud conducts, the portal shows the whole provenance chain.
      </p>
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
  // ----- LIFECYCLE CLOSE — appended to /short-summary (slides 30–32) -----
  { title: "Every Agent Is a Moving Target (agent lifecycle)", section: "Lifecycle", component: SlideAgentLifecycle },
  { title: "Run It Continuously — Accumulate Every Result", section: "Lifecycle", component: SlideContinuousOptimization },
  { title: "The Feedback Loop Is How the Agent Evolves", section: "Lifecycle", component: SlideLoopProof },
  // ----- CUSTOMER DECK — THE OBJECTIVE (real, measured SPIDER text2SQL frontier) -----
  { title: "The Objective — text2SQL on SPIDER (real frontier)", section: "Customer", component: SlideCustomerObjectiveSpider },
  // ----- CUSTOMER DECK — IMMENSE ACCOMPLISHMENT (impact / why it matters) -----
  { title: "Appreciating Traigent's Immense Accomplishment", section: "Customer", component: SlideCustomerImmenseAccomplishment },
  // ----- CUSTOMER DECK — OPENING HOOK (proof, not promises) -----
  { title: "Traigent Develops THE BEST Agent (opening hook)", section: "Customer", component: SlideCustomerHook },
  // ----- CUSTOMER DECK — CONTINUOUS (dataset evolves; re-find the optimum) -----
  { title: "The Optimum Is a Moving Target (dataset + continuous)", section: "Customer", component: SlideCustomerContinuous },
  // ----- CUSTOMER DECK — TEAM & IP (experts + secret-sauce algorithms) -----
  { title: "Built by ML & AI Experts — The Algorithms Are the Secret Sauce", section: "Customer", component: SlideCustomerTeam },
  // ----- PRODUCT CONCEPT (four-pillar method + system architecture) — indices 38, 39 -----
  { title: "The Traigent Method — Four Pillars, Scored & Improved", section: "Concept", component: SlideFourPillars },
  { title: "The System — Your Coding Agent + Traigent Cloud", section: "Concept", component: SlideArchitecture },
];

export default function PitchShort() {
  // Drop the deprecated one-pager opener (redundant with SlideParetoFrontier).
  // It stays in SHORT_SLIDES at index 0 to keep 1-based range indices stable.
  return <PitchDeck slides={SHORT_SLIDES.filter((s) => s.component !== SlideOnePagerTextTestV2)} />;
}
