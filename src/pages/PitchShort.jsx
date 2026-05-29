// /pitch-short — abbreviated outreach pitch deck.
// Composes the shared PitchDeck shell from PitchFull with its own trimmed
// slides array. Two slides (Configuration Explosion and ROI Preview) are
// rendered through PitchFull's originals with override props for the
// subtitle / footer; everything else is imported directly. No structural
// JSX is duplicated from PitchFull.
import { ArrowRight, ArrowDown, ArrowUp, ChevronsDown, DollarSign, Check, Clock, ShieldCheck, TrendingDown, TrendingUp } from "lucide-react";

// Shared optimizer ring — clockwise Learn → Deduce → Test → Repeat loop.
// Used by slide 1, slide 2 (BEFORE/TRAIGENT/AFTER middle panel), and slide 24
// (Market Opportunity THE PLAY). Gradient id is parameterized so multiple
// instances on the same page don't collide.
function OptimizerRing({ size = 190, gradientId = "ringGrad" }) {
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
      <text x="120" y="137" textAnchor="middle" fill="#cbd5e1" fontSize="13" fontFamily="ui-sans-serif, system-ui" fontWeight="700">TEST</text>
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
              <text x="120" y="101" textAnchor="middle" fill="#cbd5e1" fontSize="13" fontFamily="ui-sans-serif, system-ui" fontWeight="700">LEARN</text>
              <text x="120" y="119" textAnchor="middle" fill="#cbd5e1" fontSize="13" fontFamily="ui-sans-serif, system-ui" fontWeight="700">DEDUCE</text>
              <text x="120" y="137" textAnchor="middle" fill="#cbd5e1" fontSize="13" fontFamily="ui-sans-serif, system-ui" fontWeight="700">TEST</text>
              <text x="120" y="155" textAnchor="middle" fill="#cbd5e1" fontSize="13" fontFamily="ui-sans-serif, system-ui" fontWeight="700">REPEAT</text>
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


// Slide: Market & Revenue — headline numbers from the May 2026 partner brief.
// Top section: 3 stat tiles (TAM today, addressable LLM bill 2026, 2030).
// Middle section: penetration → revenue cascade table.
// Bottom: comparable-ramp sanity check.
function SlideMarketAndRevenue() {
  const rows = [
    { year: "2026", phase: "POCs",          bill: "$21B",  pen: "0.03%", save: "$5M",   rev: "~$0.25M" },
    { year: "2027", phase: "Early adopt",   bill: "$36B",  pen: "0.3%",  save: "$86M",  rev: "~$4M" },
    { year: "2028", phase: "Channel + ent", bill: "$56B",  pen: "1.5%",  save: "$672M", rev: "~$34M" },
    { year: "2029", phase: "Mainstream",    bill: "$86B",  pen: "4%",    save: "$2.8B", rev: "~$138M" },
    { year: "2030", phase: "Category",      bill: "$128B", pen: "8%",    save: "$8.2B", rev: "~$410M" },
  ];
  return (
    <div className="w-full max-w-[1180px] mx-auto text-center self-stretch flex flex-col min-h-[600px]">
      {/* Title */}
      <div className="mb-2">
        <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight mb-1">
          Market &amp; Revenue &mdash; <span style={{ color: "#4D8EF8" }}>Non-Vendor Agents</span>
        </h2>
        <p className="text-sm md:text-base text-slate-300 leading-snug">
          Revenue grounded in <span className="font-bold text-[#4ade80]">5% of customer savings actually delivered</span> &mdash; not a TAM percentage. Customer keeps ~95&cent; of every saved dollar.
        </p>
      </div>

      {/* Assumptions strip */}
      <div className="bg-slate-900/70 border border-slate-700/60 rounded-xl p-3 mb-3 text-left">
        <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1.5">Assumptions (read first)</div>
        <ol className="text-[12.5px] text-slate-300 leading-snug space-y-1 list-decimal pl-5">
          <li><span className="font-bold text-white">Customers:</span> non-vendor agent companies + enterprise teams on third-party LLM APIs. Excludes foundation-model-vendor agents.</li>
          <li><span className="font-bold text-white">Cost structure:</span> every $1 of customer LLM bill is matched by ~$0.50 of engineering on tuning (6–10 FTE on a $3–5M LLM bill).</li>
          <li><span className="font-bold text-white">Savings Traigent delivers</span> per $1 of LLM bill: <span className="text-[#f59e0b] font-semibold">50% LLM</span> + <span className="text-[#4D8EF8] font-semibold">60% eng</span> = <span className="text-white font-bold">$0.80 total customer savings</span>.</li>
          <li><span className="font-bold text-white">Take rate:</span> <span className="text-[#4ade80] font-bold">5%</span> of total savings &mdash; effective <span className="text-white font-bold">$0.04 of ARR per $1 of penetrated customer LLM bill</span>.</li>
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
              <th className="py-1.5 text-right">Total customer savings</th>
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
                <td className="py-1.5 text-right font-mono text-slate-200">{r.save}</td>
                <td className="py-1.5 text-right font-mono font-bold" style={{ color: "#4ade80" }}>{r.rev}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-[11px] text-slate-400 mt-2 text-left">
          <span className="font-bold text-white">Bear / Base / Bull at 2030</span> (penetration) = 4% / 8% / 12% → <span className="font-bold text-[#4ade80]">~$205M / ~$410M / ~$615M</span> ARR. Sierra hit $150M ARR 24 mo from launch; Decagon $35M+ in 9 mo. Traigent is the picks-and-shovels every agent company needs to survive its COGS curve.
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
          <h3 className="text-2xl font-bold text-white leading-tight mb-3">Exponential adoption ahead</h3>

          {/* Hockey-stick chart */}
          <svg viewBox="0 0 280 130" className="w-full mb-4 flex-1" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
            <line x1="30" y1="110" x2="270" y2="110" stroke="#475569" strokeWidth="1"/>
            <line x1="30" y1="20"  x2="30"  y2="110" stroke="#475569" strokeWidth="1"/>
            <text x="4" y="16" fill="#94a3b8" fontSize="11" fontFamily="ui-sans-serif, system-ui" fontWeight="600">Agent $</text>
            <text x="50"  y="122" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="ui-sans-serif, system-ui">2024</text>
            <text x="110" y="122" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="ui-sans-serif, system-ui">2025</text>
            <text x="170" y="122" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="ui-sans-serif, system-ui">2026</text>
            <text x="230" y="122" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="ui-sans-serif, system-ui">2028</text>
            <line x1="135" y1="20" x2="135" y2="110" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,2" strokeOpacity="0.7"/>
            <text x="135" y="34" textAnchor="middle" fill="#f59e0b" fontSize="11" fontFamily="ui-sans-serif, system-ui" fontWeight="700">TODAY</text>
            <path d="M 30 105 C 70 102, 110 100, 135 95 S 180 75, 210 50 S 255 25, 270 22" stroke="#4D8EF8" strokeWidth="2.5" fill="none"/>
            <circle cx="50"  cy="104" r="2.5" fill="#475569"/>
            <circle cx="80"  cy="103" r="2.5" fill="#475569"/>
            <circle cx="110" cy="101" r="2.5" fill="#475569"/>
            <circle cx="135" cy="95"  r="4"   fill="#f59e0b"/>
            <circle cx="180" cy="73"  r="3.5" fill="#4D8EF8"/>
            <circle cx="230" cy="40"  r="4"   fill="#4D8EF8"/>
            <circle cx="265" cy="24"  r="4.5" fill="#4D8EF8"/>
          </svg>

          <p className="text-lg text-slate-300 leading-snug mt-auto">
            Few in production today.<br /><span className="font-bold text-white">Massive rollouts 2026–2028.</span>
          </p>
        </div>

        {/* COL 2 — THE PAIN */}
        <div className="bg-slate-900/70 border-2 rounded-xl p-5 text-left flex flex-col" style={{ borderColor: "#f59e0b66" }}>
          <div className="text-2xl font-mono font-bold uppercase tracking-widest mb-3 text-center" style={{ color: "#f59e0b" }}>The Pain</div>
          <h3 className="text-2xl font-bold text-white leading-tight mb-4">Sticker shock.<br />Brutal re-tuning cycles.</h3>
          <ul className="text-lg text-slate-300 leading-snug space-y-4 flex-1 flex flex-col justify-center">
            <li>
              <span className="font-bold text-amber-400">Compounding LLM bills</span>
            </li>
            <li>
              <span className="font-bold text-amber-400">Ongoing dev costs</span> every release
            </li>
            <li>
              <span className="font-bold text-[#4D8EF8]">Quality bar keeps rising</span>
            </li>
            <li>
              25+ knob manual re-tune = <span className="font-bold text-red-400">BRUTAL</span>
            </li>
          </ul>
        </div>

        {/* COL 3 — THE PLAY (Traigent) */}
        <div className="bg-slate-950 border-2 rounded-xl p-5 text-center flex flex-col" style={{ borderColor: "#4D8EF8" }}>
          <div className="text-2xl font-mono font-bold uppercase tracking-widest mb-2 text-center" style={{ color: "#4D8EF8" }}>The Play</div>
          <h3 className="text-2xl font-bold leading-tight mb-2">
            <span style={{ color: "#4D8EF8" }}>Traigent.ai</span>
          </h3>

          {/* Optimizer ring */}
          <div className="flex justify-center mb-2 flex-1 items-center">
            <OptimizerRing size={170} gradientId="ringGradMarket" />
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
              <div className="text-xs font-mono uppercase tracking-wider text-slate-300 mt-1">shipment confidence</div>
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
  // ----- MARKET & REVENUE (the numbers from the partner brief) -----
  { title: "Market & Revenue — Non-Vendor Agents", section: "Appendix", component: SlideMarketAndRevenue },
];

export default function PitchShort() {
  return <PitchDeck slides={SHORT_SLIDES} />;
}
