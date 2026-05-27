// /pitch-short — abbreviated outreach pitch deck.
// Composes the shared PitchDeck shell from PitchFull with its own trimmed
// slides array. Two slides (Configuration Explosion and ROI Preview) are
// rendered through PitchFull's originals with override props for the
// subtitle / footer; everything else is imported directly. No structural
// JSX is duplicated from PitchFull.
import { ArrowRight, Sparkles, Eye } from "lucide-react";
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

// Slide: Agent Optimization Platform — two-box layout from the homepage,
// pasted as-is (Optimization Engine + feedback-loop connector + Agent Wrapper).
function SlidePlatformBoxes() {
  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white">Agent Optimization Platform</h2>
      </div>
      <div className="flex flex-col gap-6 items-stretch lg:grid lg:grid-cols-[1fr_180px_1fr] lg:gap-6">
        {/* Left: Optimization Engine */}
        <div className="flex-1 bg-slate-900/60 border border-slate-700/50 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-lg font-bold text-white">Optimization Engine</h3>
          </div>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Learns from previous model and configuration combo results and determines the next best combination to test.
          </p>
          <svg viewBox="0 0 320 260" className="w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <marker id="optArrowSlide" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#1A6BF5"/>
              </marker>
            </defs>
            <rect x="8" y="50" width="88" height="80" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1"/>
            <text x="52" y="68" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">Previous Results</text>
            <line x1="16" y1="74" x2="88" y2="74" stroke="#334155" strokeWidth="0.5"/>
            <text x="52" y="86" textAnchor="middle" fill="#94a3b8" fontSize="7.5" fontFamily="monospace">gpt-4o / t=0.7</text>
            <text x="52" y="97" textAnchor="middle" fill="#4ade80" fontSize="7.5" fontFamily="monospace">72% acc · $0.003</text>
            <text x="52" y="108" textAnchor="middle" fill="#94a3b8" fontSize="7.5" fontFamily="monospace">gpt-4o-mini / t=0.3</text>
            <text x="52" y="119" textAnchor="middle" fill="#facc15" fontSize="7.5" fontFamily="monospace">61% acc · $0.001</text>
            <line x1="96" y1="90" x2="118" y2="90" stroke="#1A6BF5" strokeWidth="1.5" markerEnd="url(#optArrowSlide)"/>
            <rect x="118" y="58" width="76" height="64" rx="10" fill="#1A6BF5" fillOpacity="0.12" stroke="#1A6BF5" strokeWidth="1.5"/>
            <text x="156" y="88" textAnchor="middle" fill="#93c5fd" fontSize="8.5" fontFamily="monospace">Optimizer</text>
            <text x="156" y="110" textAnchor="middle" fill="#1A6BF5" fontSize="20">⚙</text>
            <line x1="194" y1="90" x2="216" y2="90" stroke="#1A6BF5" strokeWidth="1.5" markerEnd="url(#optArrowSlide)"/>
            <rect x="216" y="55" width="96" height="70" rx="8" fill="#1e293b" stroke="#1A6BF5" strokeWidth="1" strokeDasharray="4,2"/>
            <text x="264" y="74" textAnchor="middle" fill="#93c5fd" fontSize="8.5" fontFamily="monospace">Next Combo</text>
            <line x1="224" y1="79" x2="304" y2="79" stroke="#1A6BF5" strokeWidth="0.5" strokeOpacity="0.4"/>
            <text x="264" y="92" textAnchor="middle" fill="#60a5fa" fontSize="8" fontFamily="monospace">o3-mini</text>
            <text x="264" y="104" textAnchor="middle" fill="#60a5fa" fontSize="8" fontFamily="monospace">temp: 0.2</text>
            <text x="264" y="116" textAnchor="middle" fill="#60a5fa" fontSize="8" fontFamily="monospace">top_p: 0.85</text>
            <rect x="28" y="145" width="280" height="88" rx="4" fill="#0f172a"/>
            <line x1="36" y1="225" x2="304" y2="225" stroke="#334155" strokeWidth="0.8"/>
            <line x1="36" y1="148" x2="36" y2="225" stroke="#334155" strokeWidth="0.8"/>
            <rect x="204" y="148" width="104" height="77" fill="#1e293b" fillOpacity="0.8"/>
            <circle cx="218" cy="163" r="1.5" fill="#334155"/><circle cx="234" cy="177" r="1.5" fill="#334155"/>
            <circle cx="248" cy="159" r="1.5" fill="#334155"/><circle cx="263" cy="188" r="1.5" fill="#334155"/>
            <circle cx="276" cy="171" r="1.5" fill="#334155"/><circle cx="289" cy="165" r="1.5" fill="#334155"/>
            <circle cx="221" cy="198" r="1.5" fill="#334155"/><circle cx="239" cy="211" r="1.5" fill="#334155"/>
            <circle cx="255" cy="218" r="1.5" fill="#334155"/><circle cx="268" cy="203" r="1.5" fill="#334155"/>
            <circle cx="281" cy="191" r="1.5" fill="#334155"/><circle cx="293" cy="213" r="1.5" fill="#334155"/>
            <circle cx="225" cy="220" r="1.5" fill="#334155"/><circle cx="244" cy="155" r="1.5" fill="#334155"/>
            <circle cx="259" cy="179" r="1.5" fill="#334155"/><circle cx="273" cy="189" r="1.5" fill="#334155"/>
            <circle cx="286" cy="221" r="1.5" fill="#334155"/><circle cx="297" cy="170" r="1.5" fill="#334155"/>
            <circle cx="230" cy="185" r="1.5" fill="#334155"/><circle cx="252" cy="207" r="1.5" fill="#334155"/>
            <line x1="204" y1="148" x2="204" y2="225" stroke="#1A6BF5" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="3,2"/>
            <line x1="36" y1="164" x2="204" y2="164" stroke="#4ade80" strokeWidth="0.8" strokeDasharray="3,2" strokeOpacity="0.5"/>
            <path d="M 50 222 C 72 210, 92 196, 114 181 S 154 169, 174 165 S 192 164, 204 164" stroke="#1A6BF5" strokeWidth="2" fill="none"/>
            <circle cx="50" cy="222" r="3" fill="#1A6BF5"/>
            <circle cx="74" cy="209" r="3" fill="#1A6BF5"/>
            <circle cx="96" cy="195" r="3" fill="#1A6BF5"/>
            <circle cx="118" cy="181" r="3" fill="#1A6BF5"/>
            <circle cx="140" cy="171" r="3" fill="#1A6BF5"/>
            <circle cx="160" cy="166" r="3" fill="#1A6BF5"/>
            <circle cx="180" cy="164" r="3" fill="#1A6BF5"/>
            <circle cx="204" cy="164" r="4" fill="#4ade80"/>
            <text x="172" y="159" textAnchor="middle" fill="#4ade80" fontSize="7" fontFamily="monospace">✓ optimal</text>
            <text x="30" y="152" fill="#475569" fontSize="7" fontFamily="monospace">KPI ↑</text>
            <text x="120" y="238" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">tested (under 10%)</text>
            <text x="254" y="238" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="monospace">not needed</text>
          </svg>
          <p className="text-slate-400 text-sm text-center mt-3">Finds the optimum needing only a fraction of the model and configuration combinations to experiment with</p>
        </div>

        {/* Center: feedback loop connector */}
        <div className="flex lg:flex-col items-center justify-center gap-3 py-4 lg:py-0 lg:min-w-[180px]">
          <span className="text-[#1A6BF5] text-base font-semibold font-mono whitespace-nowrap">next combo</span>
          <svg width="160" height="94" viewBox="0 0 160 94" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <line x1="4" y1="14" x2="142" y2="14" stroke="#1A6BF5" strokeWidth="3" strokeLinecap="round"/>
            <polygon points="140,6 156,14 140,22" fill="#1A6BF5"/>
            <line x1="18" y1="80" x2="156" y2="80" stroke="#1A6BF5" strokeWidth="3" strokeLinecap="round"/>
            <polygon points="20,72 4,80 20,88" fill="#1A6BF5"/>
          </svg>
          <span className="text-[#1A6BF5] text-base font-semibold font-mono whitespace-nowrap">KPI results</span>
        </div>

        {/* Right: Agent Wrapper */}
        <div className="flex-1 bg-slate-900/60 border border-slate-700/50 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-lg font-bold text-white">Agent Wrapper</h3>
          </div>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Executes a given model and configuration on the benchmark test bed and measures agent KPIs.
          </p>
          <svg viewBox="0 0 320 260" className="w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <marker id="wrapArrowSlide" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#475569"/>
              </marker>
              <marker id="wrapArrowBlueSlide" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#1A6BF5"/>
              </marker>
            </defs>
            <rect x="8" y="18" width="304" height="235" rx="12" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="6,3"/>
            <text x="20" y="32" fill="#475569" fontSize="8.5" fontFamily="monospace">[ Agent Wrapper ]</text>
            <rect x="14" y="40" width="68" height="26" rx="6" fill="#1e293b" stroke="#1A6BF5" strokeWidth="1" strokeDasharray="3,2"/>
            <text x="48" y="51" textAnchor="middle" fill="#64748b" fontSize="7.5" fontFamily="monospace">Model</text>
            <text x="48" y="61" textAnchor="middle" fill="#60a5fa" fontSize="8" fontFamily="monospace">o3-mini</text>
            <rect x="14" y="76" width="68" height="40" rx="6" fill="#1e293b" stroke="#1A6BF5" strokeWidth="1" strokeDasharray="3,2"/>
            <text x="48" y="89" textAnchor="middle" fill="#64748b" fontSize="7.5" fontFamily="monospace">Config</text>
            <text x="48" y="101" textAnchor="middle" fill="#94a3b8" fontSize="7.5" fontFamily="monospace">temp: 0.2</text>
            <text x="48" y="111" textAnchor="middle" fill="#94a3b8" fontSize="7.5" fontFamily="monospace">top_p: 0.85</text>
            <line x1="82" y1="53" x2="104" y2="70" stroke="#475569" strokeWidth="1.2" markerEnd="url(#wrapArrowSlide)"/>
            <line x1="82" y1="96" x2="104" y2="84" stroke="#475569" strokeWidth="1.2" markerEnd="url(#wrapArrowSlide)"/>
            <rect x="104" y="57" width="72" height="48" rx="8" fill="#1A6BF5" fillOpacity="0.12" stroke="#1A6BF5" strokeWidth="1.5"/>
            <text x="140" y="74" textAnchor="middle" fill="#93c5fd" fontSize="8" fontFamily="monospace">Execute Agent</text>
            <text x="140" y="95" textAnchor="middle" fill="#1A6BF5" fontSize="16">▶</text>
            <line x1="140" y1="105" x2="140" y2="147" stroke="#1A6BF5" strokeWidth="1.5" markerEnd="url(#wrapArrowBlueSlide)"/>
            <rect x="86" y="148" width="116" height="86" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1"/>
            <text x="144" y="164" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">Benchmark Test Bed</text>
            <line x1="94" y1="169" x2="194" y2="169" stroke="#334155" strokeWidth="0.5"/>
            <circle cx="97" cy="184" r="4" fill="#4ade80" fillOpacity="0.85"/>
            <text x="97" y="187" textAnchor="middle" fill="white" fontSize="6">✓</text>
            <text x="107" y="187" fill="#94a3b8" fontSize="7.5" fontFamily="monospace"> query_1  pass</text>
            <circle cx="97" cy="198" r="4" fill="#4ade80" fillOpacity="0.85"/>
            <text x="97" y="201" textAnchor="middle" fill="white" fontSize="6">✓</text>
            <text x="107" y="201" fill="#94a3b8" fontSize="7.5" fontFamily="monospace"> query_2  pass</text>
            <circle cx="97" cy="212" r="4" fill="#1A6BF5" fillOpacity="0.6"/>
            <text x="97" y="215" textAnchor="middle" fill="white" fontSize="6.5">…</text>
            <text x="107" y="215" fill="#475569" fontSize="7.5" fontFamily="monospace"> query_3  running</text>
            <text x="193" y="228" textAnchor="end" fill="#334155" fontSize="7" fontFamily="monospace">N queries total</text>
            <line x1="202" y1="191" x2="212" y2="191" stroke="#1A6BF5" strokeWidth="1.5" markerEnd="url(#wrapArrowBlueSlide)"/>
            <rect x="214" y="40" width="90" height="194" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1"/>
            <text x="259" y="57" textAnchor="middle" fill="#64748b" fontSize="8.5" fontFamily="monospace">KPIs</text>
            <line x1="222" y1="62" x2="296" y2="62" stroke="#334155" strokeWidth="0.5"/>
            <text x="259" y="84" textAnchor="middle" fill="#4ade80" fontSize="8" fontFamily="monospace">accuracy  90%</text>
            <text x="259" y="106" textAnchor="middle" fill="#facc15" fontSize="8" fontFamily="monospace">cost    $0.0002</text>
            <text x="259" y="128" textAnchor="middle" fill="#60a5fa" fontSize="8" fontFamily="monospace">latency   1.2s</text>
            <text x="259" y="150" textAnchor="middle" fill="#f472b6" fontSize="8" fontFamily="monospace">safety      ✓</text>
            <text x="259" y="172" textAnchor="middle" fill="#a78bfa" fontSize="8" fontFamily="monospace">custom KPI  …</text>
            <line x1="222" y1="190" x2="296" y2="190" stroke="#334155" strokeWidth="0.5"/>
            <text x="259" y="208" textAnchor="middle" fill="#64748b" fontSize="7.5" fontFamily="monospace">weighted score</text>
            <text x="259" y="226" textAnchor="middle" fill="#4ade80" fontSize="12" fontFamily="monospace" fontWeight="bold">0.86</text>
            <line x1="20" y1="241" x2="300" y2="241" stroke="#f59e0b" strokeWidth="0.5" strokeOpacity="0.35" strokeDasharray="2,2"/>
            <text x="20" y="250" fill="#f59e0b" fontSize="7" fontFamily="monospace" fontWeight="bold">+ benchmark insights:</text>
            <text x="112" y="250" fill="#f59e0b" fontSize="7" fontFamily="monospace">⊘ easy</text>
            <text x="155" y="250" fill="#f59e0b" fontSize="7" fontFamily="monospace">⨯ always-fail</text>
            <text x="218" y="250" fill="#f59e0b" fontSize="7" fontFamily="monospace">↻ redundant</text>
          </svg>
          <p className="text-slate-400 text-sm text-center mt-3">Automated injection of model and configurations allows Optimizer to run successive tests seamlessly</p>
        </div>
      </div>
    </div>
  );
}

// Slide: Beyond Optimization — two-card layout from the homepage,
// pasted as-is (Self-Improving Benchmark + Full Observability & Tracing).
function SlideBeyondBoxes() {
  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white">Beyond Optimization</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-6 items-stretch">
        {/* Card 1: Self-Improving Benchmark */}
        <div className="bg-slate-900/60 border border-amber-500/30 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Self-Improving Benchmark</h3>
          </div>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Hundreds of runs across the same test bed reveal patterns. Traigent flags them automatically so your benchmark gets sharper — and every future run gets faster and cheaper.
          </p>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <span className="flex-shrink-0 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs">
                <span>⊘</span><span>too easy</span>
              </span>
              <span className="text-slate-400 text-sm leading-relaxed">Every model & config passes — provides no discrimination. Safe to drop.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs">
                <span>⨯</span><span>always fails</span>
              </span>
              <span className="text-slate-400 text-sm leading-relaxed">Nothing passes — fix the agent itself (code, flow, RAG) before optimization can help.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs">
                <span>↻</span><span>redundant</span>
              </span>
              <span className="text-slate-400 text-sm leading-relaxed">Batches where a small sample carries the same signal — trim them and shorten every wrapper run.</span>
            </li>
          </ul>
        </div>

        {/* Card 2: Full Observability & Tracing */}
        <div className="bg-slate-900/60 border border-amber-500/30 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Full Observability & Tracing</h3>
          </div>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Every wrapper run is fully instrumented — spans, tokens, costs, and errors captured end-to-end. Production-grade tracing built in, with no separate observability stack to run.
          </p>
          <svg viewBox="0 0 320 200" className="w-full" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="312" height="192" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1"/>
            <text x="14" y="22" fill="#f59e0b" fontSize="9" fontFamily="monospace" fontWeight="bold">Trace</text>
            <text x="40" y="22" fill="#64748b" fontSize="8.5" fontFamily="monospace">· agent_run_42</text>
            <text x="306" y="22" textAnchor="end" fill="#4ade80" fontSize="8.5" fontFamily="monospace">1.24s ✓</text>
            <line x1="14" y1="30" x2="306" y2="30" stroke="#334155" strokeWidth="0.5"/>
            <text x="14" y="46" fill="#93c5fd" fontSize="8" fontFamily="monospace">▾ agent_run</text>
            <rect x="170" y="40" width="120" height="8" rx="2" fill="#1A6BF5" fillOpacity="0.45"/>
            <text x="296" y="46" textAnchor="end" fill="#64748b" fontSize="7" fontFamily="monospace">1240ms</text>
            <text x="22" y="62" fill="#94a3b8" fontSize="8" fontFamily="monospace">├─ retrieve_context</text>
            <rect x="170" y="56" width="18" height="8" rx="2" fill="#a78bfa" fillOpacity="0.65"/>
            <text x="296" y="62" textAnchor="end" fill="#64748b" fontSize="7" fontFamily="monospace">180ms</text>
            <text x="36" y="76" fill="#64748b" fontSize="7" fontFamily="monospace">└─ vector_search · top_k=8</text>
            <rect x="170" y="71" width="13" height="6" rx="1.5" fill="#a78bfa" fillOpacity="0.4"/>
            <text x="296" y="76" textAnchor="end" fill="#475569" fontSize="6.5" fontFamily="monospace">120ms</text>
            <text x="22" y="92" fill="#94a3b8" fontSize="8" fontFamily="monospace">├─ llm_call · gpt-4o-mini</text>
            <rect x="188" y="86" width="74" height="8" rx="2" fill="#60a5fa" fillOpacity="0.65"/>
            <text x="296" y="92" textAnchor="end" fill="#64748b" fontSize="7" fontFamily="monospace">740ms</text>
            <text x="36" y="106" fill="#475569" fontSize="7" fontFamily="monospace">tokens: 312 in · 89 out</text>
            <text x="296" y="106" textAnchor="end" fill="#facc15" fontSize="7" fontFamily="monospace">$0.0006</text>
            <text x="22" y="122" fill="#94a3b8" fontSize="8" fontFamily="monospace">└─ evaluator</text>
            <rect x="262" y="116" width="32" height="8" rx="2" fill="#4ade80" fillOpacity="0.55"/>
            <text x="296" y="122" textAnchor="end" fill="#64748b" fontSize="7" fontFamily="monospace">320ms</text>
            <text x="36" y="136" fill="#4ade80" fontSize="7" fontFamily="monospace">score: 0.92 ✓</text>
            <line x1="14" y1="148" x2="306" y2="148" stroke="#334155" strokeWidth="0.5" strokeDasharray="2,2"/>
            <text x="14" y="161" fill="#f59e0b" fontSize="7" fontFamily="monospace" fontWeight="bold">Timeline</text>
            <text x="306" y="161" textAnchor="end" fill="#475569" fontSize="6.5" fontFamily="monospace">0 ──── 1.24s</text>
            <rect x="14" y="166" width="292" height="22" rx="2" fill="#0a1424"/>
            <rect x="14" y="169" width="282" height="4" rx="1" fill="#1A6BF5" fillOpacity="0.55"/>
            <rect x="14" y="175" width="42" height="3.5" rx="1" fill="#a78bfa" fillOpacity="0.7"/>
            <rect x="56" y="180" width="174" height="3.5" rx="1" fill="#60a5fa" fillOpacity="0.7"/>
            <rect x="230" y="185" width="72" height="3.5" rx="1" fill="#4ade80" fillOpacity="0.7"/>
          </svg>
          <p className="text-slate-400 text-sm text-center mt-3">Inspect any agent execution end-to-end · debug failures · monitor production</p>
        </div>
      </div>
    </div>
  );
}

export const SHORT_SLIDES = [
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
  { title: "Get Started", section: "CTA", component: Slide20GetStartedShort },
  { title: "Better Agents. Faster. Lower Spend. Higher Confidence.", section: "CTA", component: Slide21Closing },
  // ----- APPENDIX: homepage-style detail slides -----
  { title: "Agent Optimization Platform — Components", section: "Appendix", component: SlidePlatformBoxes },
  { title: "Beyond Optimization — Capabilities", section: "Appendix", component: SlideBeyondBoxes },
];

export default function PitchShort() {
  return <PitchDeck slides={SHORT_SLIDES} />;
}
