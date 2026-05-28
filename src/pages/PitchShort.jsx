// /pitch-short — abbreviated outreach pitch deck.
// Composes the shared PitchDeck shell from PitchFull with its own trimmed
// slides array. Two slides (Configuration Explosion and ROI Preview) are
// rendered through PitchFull's originals with override props for the
// subtitle / footer; everything else is imported directly. No structural
// JSX is duplicated from PitchFull.
import { ArrowRight, ArrowDown, ChevronsDown, DollarSign, Check, Clock, ShieldCheck, TrendingDown } from "lucide-react";
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
            Contemplates 1,000s of options. Converges to <span className="text-white font-semibold">THE</span> optimum. Re-runs every time conditions change.
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

// Slide: text-only one-pager test — problem stanza + solution stanza.
// Two big headlines, two punchy sub-lines, no graphic. For A/B-testing
// a more verbal opening against the SlideParetoFrontier visual.
function SlideOnePagerTextTest() {
  // Three text lines in the upper portion, the "Automatic Optimization" card
  // (smaller horizontal form factor borrowed from slide 2's middle panel)
  // pinned at the bottom. self-stretch overrides the parent SlideCanvas's
  // items-center so this fills the full canvas height.
  const LINE = "text-4xl md:text-5xl leading-tight tracking-tight text-slate-300";
  return (
    <div className="w-full max-w-[1100px] mx-auto self-stretch flex flex-col text-center min-h-[600px]">
      {/* Top: lines 1+2 grouped at top; line 3 pushed to the bottom of this
          flex region so it sits closer to the product card. */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex flex-col gap-6">
          <h2 className={LINE}>
            AI Agent optimization is a <span className="font-bold text-[#4D8EF8]">multi-dimensional</span> configuration selection problem
          </h2>
          <p className="text-2xl md:text-3xl leading-tight tracking-tight text-slate-300">
            Optimizing <span className="font-bold text-[#4D8EF8]">Quality</span> and <span className="font-bold text-[#f59e0b]">Cost</span> via <span className="font-bold text-white">trial and error</span> <span className="font-bold text-red-400">can be brutal</span>
          </p>
          {/* Problem → solution arrow — two parallel verticals capped by a single triangle arrowhead */}
          <div className="flex justify-center" aria-hidden="true">
            <svg viewBox="0 0 40 50" className="w-8 h-10" xmlns="http://www.w3.org/2000/svg">
              {/* Two parallel verticals — extended ~1/4 of the way down into the V */}
              <line x1="14" y1="2" x2="14" y2="30" stroke="#4D8EF8" strokeWidth="3" strokeLinecap="round" />
              <line x1="26" y1="2" x2="26" y2="30" stroke="#4D8EF8" strokeWidth="3" strokeLinecap="round" />
              {/* 90° V arrowhead — two strokes meeting at a right angle at the tip (20,46) */}
              <line x1="6"  y1="32" x2="20" y2="46" stroke="#4D8EF8" strokeWidth="3" strokeLinecap="round" />
              <line x1="34" y1="32" x2="20" y2="46" stroke="#4D8EF8" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        </div>
        <h2 className="text-3xl md:text-4xl leading-tight tracking-tight text-slate-300">
          Traigent <span className="font-bold text-white">rapidly</span> finds <span className="font-bold text-[#f59e0b]">Low Cost</span> and <span className="font-bold text-[#4D8EF8]">High Quality</span> options<br />
          among{" "}
          <a
            href="https://www.traigent.ai/#/blog/the-config-multiverse"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-white underline underline-offset-4 decoration-white/40 hover:decoration-white transition-colors"
          >
            thousands possible
          </a>
        </h2>
      </div>

      {/* Bottom: compact horizontal "Automatic Optimization" card */}
      <div className="mt-6 bg-slate-900/70 border-2 rounded-xl py-0 px-3 flex items-center gap-6 self-center w-full max-w-4xl" style={{ borderColor: "#1A6BF5" }}>
        {/* Loop ring */}
        <svg viewBox="0 0 240 240" className="w-[190px] h-[190px] flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="ringGradMini" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4D8EF8"/>
              <stop offset="100%" stopColor="#1A6BF5"/>
            </linearGradient>
          </defs>
          <circle cx="120" cy="120" r="82" fill="none" stroke="#1e293b" strokeWidth="14"/>
          <path
            d="M 120 38 A 82 82 0 1 1 38 120"
            fill="none"
            stroke="url(#ringGradMini)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <polygon points="38,96 22,128 54,128" fill="#1A6BF5"/>
          <circle cx="120" cy="120" r="58" fill="#020617" stroke="#334155" strokeWidth="1"/>
          <text x="120" y="101" textAnchor="middle" fill="#cbd5e1" fontSize="13" fontFamily="ui-sans-serif, system-ui" fontWeight="700">LEARN</text>
          <text x="120" y="119" textAnchor="middle" fill="#cbd5e1" fontSize="13" fontFamily="ui-sans-serif, system-ui" fontWeight="700">DEDUCE</text>
          <text x="120" y="137" textAnchor="middle" fill="#cbd5e1" fontSize="13" fontFamily="ui-sans-serif, system-ui" fontWeight="700">TEST</text>
          <text x="120" y="155" textAnchor="middle" fill="#cbd5e1" fontSize="13" fontFamily="ui-sans-serif, system-ui" fontWeight="700">REPEAT</text>
        </svg>

        {/* Right: eyebrow + title + description + step pills */}
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

      {/* Audience-outcome tiles — borrowed from slide 1 (OnePager2Slide top). */}
      <div className="grid grid-cols-3 gap-3 self-center w-full max-w-4xl mt-1">
        <a
          href="https://www.traigent.ai/#/roi"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-slate-900/70 border-2 rounded-xl px-3 py-3 text-center hover:bg-slate-900 transition-colors block"
          style={{ borderColor: "#f59e0b66" }}
        >
          <div className="text-3xl font-extrabold tracking-tight leading-none" style={{ color: "#f59e0b" }}>up to 60%</div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-300 mt-1">LLM cost reduction</div>
        </a>
        <a
          href="https://www.traigent.ai/#/ttm"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-slate-900/70 border-2 rounded-xl px-3 py-3 text-center hover:bg-slate-900 transition-colors block"
          style={{ borderColor: "#4D8EF866" }}
        >
          <div className="text-3xl font-extrabold tracking-tight leading-none" style={{ color: "#4D8EF8" }}>up to 8 wks</div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-300 mt-1">Engineering time reclaimed</div>
        </a>
        <div className="bg-slate-900/70 border-2 rounded-xl px-3 py-3 text-center" style={{ borderColor: "#a78bfa66" }}>
          <div className="text-3xl font-extrabold tracking-tight leading-none" style={{ color: "#a78bfa" }}>100%</div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-300 mt-1">shipment confidence</div>
        </div>
      </div>
    </div>
  );
}

export const SHORT_SLIDES = [
  // ----- TEXT-ONLY ONE-PAGER (opener — swapped in from slot 22) -----
  { title: "One-Pager Test — Text Only", section: "Traigent intro", component: SlideOnePagerTextTest },
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
];

export default function PitchShort() {
  return <PitchDeck slides={SHORT_SLIDES} />;
}
