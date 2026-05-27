// /pitch-short — abbreviated outreach pitch deck.
// Composes the shared PitchDeck shell from PitchFull with its own trimmed
// slides array. Two slides (Configuration Explosion and ROI Preview) are
// rendered through PitchFull's originals with override props for the
// subtitle / footer; everything else is imported directly. No structural
// JSX is duplicated from PitchFull.
import { ArrowRight, DollarSign, Check, Clock, ShieldCheck } from "lucide-react";
import {
  OptimizationEngineBody,
  FeedbackLoopConnector,
  AgentWrapperBody,
  BenchmarkCardBody,
  ObservabilityCardBody,
} from "../components/PlatformShowcase";
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
            href="/#/roi"
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
  llm:   { bar: "#f59e0b", dot: "#b45309", track: "rgba(245,158,11,0.18)" }, // amber  — LLM inference
  agent: { bar: "#a78bfa", dot: "#7c3aed", track: "rgba(167,139,250,0.18)" }, // violet — agent orchestration
};

function KnobRow({ name, fill, value, category = "model" }) {
  const c = KNOB_COLOR[category];
  return (
    <div>
      <div className="flex items-center justify-between text-[12px] mb-1">
        <span className="text-slate-200 font-semibold">{name}</span>
        <span className="text-slate-400 font-mono">{value}</span>
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

function OutcomeCard({ icon: Icon, iconColor, iconBg, title, body }) {
  return (
    <div className="bg-slate-950/60 border border-slate-700/60 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: iconBg, color: iconColor }}>
          <Icon className="w-4 h-4" strokeWidth={2.5} />
        </div>
        <h4 className="text-[15px] font-bold text-white">{title}</h4>
      </div>
      <p className="text-[12px] text-slate-400 leading-snug">{body}</p>
    </div>
  );
}

export function SlideParetoFrontier() {
  // Knobs grouped by category — Model / LLM / Agent. Each column keeps its
  // categories contiguous so the colors read as bands top-to-bottom.
  const knobsLeft = [
    // Model
    { name: 'Model',       fill: 65, value: '7 candidates', category: 'model' },
    { name: 'Routing',     fill: 45, value: '5',            category: 'model' },
    // LLM (per-call inference)
    { name: 'Prompt',      fill: 90, value: '18 variants',  category: 'llm' },
    { name: 'Reasoning',   fill: 60, value: 'low/med/high', category: 'llm' },
    { name: 'Context',     fill: 70, value: '32k',          category: 'llm' },
    { name: 'CoT / SC',    fill: 50, value: '4',            category: 'llm' },
    { name: 'Caching',     fill: 75, value: 'on / off',     category: 'llm' },
  ];
  const knobsRight = [
    // LLM continued
    { name: 'Few-shot',     fill: 70, value: '0–32 ex',       category: 'llm' },
    { name: 'Output schema',fill: 50, value: 'free/JSON/fn',  category: 'llm' },
    // Agent (orchestration)
    { name: 'Tools',        fill: 50, value: '9',             category: 'agent' },
    { name: 'RAG strategy', fill: 80, value: '12',            category: 'agent' },
    { name: 'Re-ranker',    fill: 55, value: '5',             category: 'agent' },
    { name: 'Chunking',     fill: 40, value: '4 sizes',       category: 'agent' },
    { name: 'Guardrails',   fill: 60, value: '6',             category: 'agent' },
  ];
  return (
    <div className="w-full max-w-[1240px] mx-auto">
      <div className="text-center mb-3">
        <p className="text-[18px] md:text-[22px] font-bold text-amber-400 mb-1.5 tracking-tight">
          Literally millions of configuration options to contemplate.
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">
          Agent performance is a <span className="text-[#4D8EF8]">25+ knob</span> optimization problem
        </h2>
        <p className="text-base md:text-lg text-slate-400">
          Traigent intelligently finds the <span className="font-bold text-[#f59e0b]">lowest-cost</span>, <span className="font-bold text-[#4D8EF8]">highest-quality</span> setup for each AI agent, rapidly.
        </p>
      </div>

      <div className="grid grid-cols-[1fr_28px_1fr_28px_1fr] items-stretch gap-0">
        {/* LEFT: 25+ knobs */}
        <div className="bg-slate-900/70 border border-slate-700/60 rounded-xl p-4">
          <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400 mb-1">Before Traigent</div>
          <h3 className="text-[20px] font-bold text-white leading-tight mb-1">25+ configuration knobs</h3>
          <p className="text-[12px] text-slate-400 leading-snug mb-2">
            Too many choices to test manually, and every workload behaves differently.
          </p>
          <div className="flex items-center justify-center gap-3 mb-3">
            <CategoryLegendDot category="model" label="Model" />
            <CategoryLegendDot category="llm"   label="LLM" />
            <CategoryLegendDot category="agent" label="Agent" />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
            {[...knobsLeft, ...knobsRight].map((k, i) => (
              <KnobRow key={i} {...k} />
            ))}
          </div>
          <div className="text-[11px] text-slate-500 mt-3 italic text-center">…and 11 more knobs (eval threshold, concurrency, streaming, …)</div>
        </div>

        {/* Arrow */}
        <div className="flex items-center justify-center">
          <ArrowRight className="w-7 h-7" style={{ color: '#1A6BF5' }} />
        </div>

        {/* MIDDLE: Optimizer */}
        <div className="bg-slate-900/70 border-2 rounded-xl p-4 flex flex-col" style={{ borderColor: '#1A6BF5' }}>
          <div className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: '#4D8EF8' }}>Traigent</div>
          <h3 className="text-[20px] font-bold text-white leading-tight mb-1">Automatic Optimization</h3>
          <p className="text-[12px] text-slate-400 leading-snug mb-2">
            Contemplates 1,000s of options. Converges on <span className="text-white font-semibold">THE</span> optimum. Re-runs every time conditions change.
          </p>

          {/* Loop SVG */}
          <div className="flex-1 flex items-center justify-center">
            <svg viewBox="0 0 240 240" className="w-full max-w-[240px]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4D8EF8"/>
                  <stop offset="100%" stopColor="#1A6BF5"/>
                </linearGradient>
              </defs>
              {/* Background full ring */}
              <circle cx="120" cy="120" r="82" fill="none" stroke="#1e293b" strokeWidth="14"/>
              {/* Clockwise progress arc — starts at 12 o'clock, sweeps 270° clockwise,
                  ends at 9 o'clock. Path "A 82 82 0 1 1 ..." uses sweep-flag=1 (clockwise). */}
              <path
                d="M 120 38 A 82 82 0 1 1 38 120"
                fill="none"
                stroke="url(#ringGrad)"
                strokeWidth="14"
                strokeLinecap="round"
              />
              {/* Arrowhead at 9 o'clock pointing UP — the tangent direction of
                  clockwise motion at the left side of the circle. */}
              <polygon points="38,96 22,128 54,128" fill="#1A6BF5"/>

              <circle cx="120" cy="120" r="58" fill="#020617" stroke="#334155" strokeWidth="1"/>
              <text x="120" y="110" textAnchor="middle" fill="#cbd5e1" fontSize="13" fontFamily="ui-sans-serif, system-ui" fontWeight="700">LEARN</text>
              <text x="120" y="127" textAnchor="middle" fill="#cbd5e1" fontSize="13" fontFamily="ui-sans-serif, system-ui" fontWeight="700">DEDUCE</text>
              <text x="120" y="144" textAnchor="middle" fill="#cbd5e1" fontSize="13" fontFamily="ui-sans-serif, system-ui" fontWeight="700">TEST</text>
            </svg>
          </div>

          {/* Bottom step pills */}
          <div className="grid grid-cols-4 gap-1.5 mt-2">
            {['Learn', 'Deduce', 'Test', 'Repeat'].map((label) => (
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

        {/* RIGHT: Outcomes */}
        <div className="bg-slate-950 border border-slate-700/60 rounded-xl p-4">
          <div className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: '#4D8EF8' }}>After Traigent</div>
          <h3 className="text-[20px] font-bold text-white leading-tight mb-1">Best agent config</h3>
          <p className="text-[12px] text-slate-400 leading-snug mb-3">
            Rapidly finds <span className="text-white font-semibold">THE</span> optimal business option — vs. weeks of laborious guesswork.
          </p>
          <div className="space-y-2.5">
            <OutcomeCard
              icon={DollarSign}
              iconColor="#f59e0b"
              iconBg="rgba(245,158,11,0.15)"
              title="Lower LLM cost"
              body="Finds cheaper combination that still hits accuracy."
            />
            <OutcomeCard
              icon={Check}
              iconColor="#4D8EF8"
              iconBg="rgba(77,142,248,0.15)"
              title="Higher accuracy"
              body="Scores output quality against the benchmark."
            />
            <OutcomeCard
              icon={Clock}
              iconColor="#cbd5e1"
              iconBg="rgba(148,163,184,0.15)"
              title="Weeks saved"
              body="Replaces exhaustive trial-and-error with automated deductive optimization."
            />
            <OutcomeCard
              icon={ShieldCheck}
              iconColor="#a78bfa"
              iconBg="rgba(167,139,250,0.15)"
              title="100% Confidence"
              body="You know it's THE optimum."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export const SHORT_SLIDES = [
  // ----- ONE-PAGER SUMMARY (opener) -----
  { title: "One-Pager Summary", section: "Traigent intro", component: SlideOnePagerSummary },
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
];

export default function PitchShort() {
  return <PitchDeck slides={SHORT_SLIDES} />;
}
