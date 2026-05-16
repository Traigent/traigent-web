import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Home, Maximize2, Sparkles, Eye, Check } from "lucide-react";
import { Link } from "react-router-dom";

// ===================================================================
// Brand tokens
// ===================================================================
const BLUE = "#1A6BF5";
const AMBER = "#f59e0b";
const VIOLET = "#a78bfa";

// ===================================================================
// Reusable mini-components used across multiple slides
// ===================================================================

function PillarsRow({ className = "" }) {
  return (
    <div className={`flex flex-wrap justify-center gap-x-6 gap-y-2 text-base md:text-lg font-semibold ${className}`}>
      <span style={{ color: BLUE }}>Agent Optimization</span>
      <span className="text-slate-600">·</span>
      <span style={{ color: AMBER }}>Benchmark Evolution</span>
      <span className="text-slate-600">·</span>
      <span style={{ color: VIOLET }}>Observability and Tracing</span>
    </div>
  );
}

// The feedback loop diagram — two boxes connected by next-combo / KPI-results arrows.
function LoopDiagram() {
  return (
    <svg viewBox="0 0 1000 320" className="w-full max-w-4xl mx-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="loopArrR" markerWidth="12" markerHeight="10" refX="11" refY="5" orient="auto">
          <polygon points="0 0, 12 5, 0 10" fill={BLUE} />
        </marker>
      </defs>
      {/* Optimization Engine */}
      <rect x="40" y="30" width="350" height="260" rx="18" fill="#0f172a" stroke={BLUE} strokeWidth="2.5" />
      <text x="215" y="75" textAnchor="middle" fill="white" fontSize="22" fontWeight="700">Optimization Engine</text>
      <line x1="70" y1="92" x2="360" y2="92" stroke="#1e293b" strokeWidth="1.5" />
      <text x="215" y="135" textAnchor="middle" fill="#93c5fd" fontSize="14">Picks the next best</text>
      <text x="215" y="160" textAnchor="middle" fill="#93c5fd" fontSize="14">configuration to try</text>
      <text x="215" y="185" textAnchor="middle" fill="#93c5fd" fontSize="14">based on run history</text>
      <text x="215" y="265" textAnchor="middle" fill={BLUE} fontSize="60">⚙</text>
      {/* Arrows */}
      <text x="500" y="118" textAnchor="middle" fill={BLUE} fontSize="15" fontWeight="600">next combo</text>
      <line x1="400" y1="135" x2="600" y2="135" stroke={BLUE} strokeWidth="2.5" markerEnd="url(#loopArrR)" />
      <text x="500" y="215" textAnchor="middle" fill={BLUE} fontSize="15" fontWeight="600">KPI results</text>
      <line x1="600" y1="195" x2="400" y2="195" stroke={BLUE} strokeWidth="2.5" markerEnd="url(#loopArrR)" />
      {/* Agent Wrapper */}
      <rect x="610" y="30" width="350" height="260" rx="18" fill="#0f172a" stroke={BLUE} strokeWidth="2.5" />
      <text x="785" y="75" textAnchor="middle" fill="white" fontSize="22" fontWeight="700">Agent Wrapper</text>
      <line x1="640" y1="92" x2="930" y2="92" stroke="#1e293b" strokeWidth="1.5" />
      <text x="785" y="135" textAnchor="middle" fill="#93c5fd" fontSize="14">Executes your agent</text>
      <text x="785" y="160" textAnchor="middle" fill="#93c5fd" fontSize="14">on the benchmark and</text>
      <text x="785" y="185" textAnchor="middle" fill="#93c5fd" fontSize="14">measures KPIs</text>
      <text x="785" y="265" textAnchor="middle" fill={BLUE} fontSize="60">▶</text>
    </svg>
  );
}

// Convergence visualization (Manual scatter vs Traigent convergence curve)
function ConvergenceDiagram() {
  return (
    <svg viewBox="0 0 1000 280" className="w-full max-w-5xl mx-auto">
      {/* Left: Manual */}
      <rect x="40" y="20" width="430" height="240" rx="12" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
      <text x="255" y="55" textAnchor="middle" fill="white" fontSize="22" fontWeight="700">Manual Tuning</text>
      <text x="255" y="80" textAnchor="middle" fill="#94a3b8" fontSize="14">scattered guesses · no convergence</text>
      <line x1="60" y1="225" x2="450" y2="225" stroke="#334155" strokeWidth="0.8" />
      <line x1="60" y1="100" x2="60" y2="225" stroke="#334155" strokeWidth="0.8" />
      {[[95, 180], [135, 210], [170, 155], [210, 200], [245, 135], [280, 195], [320, 165], [355, 215], [395, 175], [430, 195]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="4" fill="#64748b" />
      ))}
      <text x="255" y="252" textAnchor="middle" fill="#475569" fontSize="13" fontFamily="monospace">5–20 guesses · weeks · no certainty</text>
      {/* Right: Traigent */}
      <rect x="510" y="20" width="450" height="240" rx="12" fill="#0f172a" stroke={BLUE} strokeWidth="2.5" />
      <text x="735" y="55" textAnchor="middle" fill="white" fontSize="22" fontWeight="700">With Traigent</text>
      <text x="735" y="80" textAnchor="middle" fill={BLUE} fontSize="14" fontWeight="600">under 10% of the space → converged to optimal</text>
      <line x1="530" y1="225" x2="940" y2="225" stroke="#334155" strokeWidth="0.8" />
      <line x1="530" y1="100" x2="530" y2="225" stroke="#334155" strokeWidth="0.8" />
      <line x1="540" y1="145" x2="930" y2="145" stroke="#4ade80" strokeWidth="0.8" strokeDasharray="4,3" opacity="0.5" />
      <text x="555" y="138" fill="#4ade80" fontSize="11" fontFamily="monospace">optimal</text>
      <path d="M 555 220 C 600 200, 640 175, 690 160 S 780 148, 830 146 S 900 145, 920 145" stroke={BLUE} strokeWidth="2.5" fill="none" />
      {[[555, 220], [595, 200], [635, 180], [680, 163], [725, 155], [770, 150], [820, 147], [870, 146]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="5" fill={BLUE} />
      ))}
      <circle cx="920" cy="145" r="8" fill="#4ade80" />
      <text x="735" y="252" textAnchor="middle" fill={BLUE} fontSize="13" fontFamily="monospace">&lt;10% of search space · hours · certain</text>
    </svg>
  );
}

// Trace tree (Langfuse-style, but no name)
function TraceTree() {
  return (
    <svg viewBox="0 0 600 230" className="w-full max-w-3xl mx-auto">
      <rect x="4" y="4" width="592" height="222" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="1" />
      <text x="14" y="26" fill={AMBER} fontSize="13" fontWeight="700">Trace</text>
      <text x="60" y="26" fill="#64748b" fontSize="12">· agent_run_42</text>
      <text x="586" y="26" textAnchor="end" fill="#4ade80" fontSize="12">1.24s ✓</text>
      <line x1="14" y1="34" x2="586" y2="34" stroke="#334155" strokeWidth="0.5" />

      <text x="14" y="58" fill="#93c5fd" fontSize="12">▾ agent_run</text>
      <rect x="340" y="50" width="220" height="10" rx="2" fill={BLUE} fillOpacity="0.45" />
      <text x="576" y="58" textAnchor="end" fill="#64748b" fontSize="11">1240ms</text>

      <text x="26" y="80" fill="#94a3b8" fontSize="12">├─ retrieve_context</text>
      <rect x="340" y="72" width="35" height="10" rx="2" fill={VIOLET} fillOpacity="0.65" />
      <text x="576" y="80" textAnchor="end" fill="#64748b" fontSize="11">180ms</text>

      <text x="44" y="100" fill="#64748b" fontSize="11">└─ vector_search · top_k=8</text>
      <rect x="340" y="93" width="25" height="8" rx="1.5" fill={VIOLET} fillOpacity="0.4" />
      <text x="576" y="100" textAnchor="end" fill="#475569" fontSize="10">120ms</text>

      <text x="26" y="124" fill="#94a3b8" fontSize="12">├─ llm_call · gpt-4o-mini</text>
      <rect x="375" y="116" width="142" height="10" rx="2" fill="#60a5fa" fillOpacity="0.65" />
      <text x="576" y="124" textAnchor="end" fill="#64748b" fontSize="11">740ms</text>
      <text x="44" y="144" fill="#475569" fontSize="11">tokens: 312 in · 89 out</text>
      <text x="576" y="144" textAnchor="end" fill="#facc15" fontSize="11">$0.0006</text>

      <text x="26" y="166" fill="#94a3b8" fontSize="12">└─ evaluator</text>
      <rect x="517" y="158" width="60" height="10" rx="2" fill="#4ade80" fillOpacity="0.55" />
      <text x="576" y="166" textAnchor="end" fill="#64748b" fontSize="11">320ms</text>
      <text x="44" y="186" fill="#4ade80" fontSize="11">score: 0.92 ✓</text>

      <line x1="14" y1="200" x2="586" y2="200" stroke="#334155" strokeWidth="0.5" strokeDasharray="2,2" />
      <text x="300" y="216" textAnchor="middle" fill="#475569" fontSize="10">spans · tokens · costs · errors — captured end-to-end</text>
    </svg>
  );
}

// ===================================================================
// 01 — Title
// ===================================================================
function Slide01Title() {
  return (
    <div className="text-center max-w-5xl mx-auto">
      <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-white mb-8 tracking-tight">Traigent</h1>
      <p className="text-2xl md:text-3xl text-slate-200 mb-10 font-medium leading-tight" style={{ textWrap: "balance" }}>
        The most advanced <span style={{ color: BLUE }} className="font-bold">AI Agent Optimization Platform</span> on the market
      </p>
      <p className="text-xl md:text-2xl text-slate-400 mb-12">
        Stop guessing your agent's configuration. <span style={{ color: BLUE }} className="font-semibold">Start converging.</span>
      </p>
      <PillarsRow />
      <p className="mt-16 text-slate-500 text-sm font-mono">traigent.ai · amir@traigent.ai</p>
    </div>
  );
}

// ===================================================================
// 02 — Optimize Agent ROI. Fast.
// ===================================================================
function Slide02ROI() {
  return (
    <div className="max-w-5xl mx-auto text-center">
      <h2 className="text-6xl md:text-7xl font-bold text-white mb-10 tracking-tight">Optimize Agent ROI. Fast.</h2>
      <p className="text-xl md:text-2xl text-slate-300 mb-6 leading-relaxed max-w-3xl mx-auto">
        AI Agents have <span className="text-white font-semibold">hundreds of model and configuration combinations</span> to choose from. Finding the <span style={{ color: BLUE }} className="font-semibold">best cost-performance combination</span> via manual brute force is impractical.
      </p>
      <p className="text-xl md:text-2xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
        Traigent finds the optimum in <span style={{ color: BLUE }} className="font-semibold">hours</span> not weeks, <span style={{ color: BLUE }} className="font-semibold">automatically</span> not manually.
      </p>
    </div>
  );
}

// ===================================================================
// 03 — The Configuration Explosion
// ===================================================================
function Slide03Explosion() {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 text-center">The Configuration Explosion</h2>
      <p className="text-xl text-slate-300 mb-12 text-center max-w-3xl mx-auto leading-relaxed">
        Every agent has dozens of tunable variables. The total number of valid configurations grows fast.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto mb-12">
        {[
          { label: "Model", n: "6" },
          { label: "Temperature", n: "10" },
          { label: "Max tokens", n: "3" },
          { label: "Prompt template", n: "2" },
          { label: "Instructions", n: "2" },
        ].map((v) => (
          <div key={v.label} className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-5 text-center">
            <div className="text-3xl font-bold text-white mb-1">{v.n}</div>
            <p className="text-slate-400 text-sm">{v.label}</p>
          </div>
        ))}
      </div>
      <div className="text-center">
        <p className="text-2xl md:text-3xl text-slate-300 mb-2">6 × 10 × 3 × 2 × 2 =</p>
        <p className="text-6xl md:text-7xl font-extrabold" style={{ color: "#f87171" }}>720 configurations</p>
        <p className="text-lg text-slate-400 mt-4">…each yielding different accuracy, cost, and latency.</p>
      </div>
    </div>
  );
}

// ===================================================================
// 04 — What Manual Tuning Actually Looks Like
// ===================================================================
function Slide04Manual() {
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-5xl md:text-6xl font-bold text-white mb-10 text-center">What Manual Tuning Actually Looks Like</h2>
      <div className="space-y-4 text-xl text-slate-300 max-w-3xl mx-auto">
        {[
          "An engineer picks a model and a prompt",
          "Runs it on a few test cases",
          "Adjusts. Re-runs. Adjusts again.",
          "Stops when time runs out",
          "Ships it. Hopes for the best.",
        ].map((line, i) => (
          <div key={i} className="flex items-start gap-4">
            <span className="text-slate-600 font-mono text-base flex-shrink-0 mt-1">{String(i + 1).padStart(2, "0")}</span>
            <span>{line}</span>
          </div>
        ))}
      </div>
      <div className="mt-12 max-w-3xl mx-auto border-l-4 pl-6 py-2" style={{ borderColor: BLUE }}>
        <p className="text-2xl text-slate-200 italic mb-2">"Did we ship the best configuration we could have?"</p>
        <p className="text-lg text-slate-400">The honest answer: <span className="text-white font-semibold">"We don't know."</span></p>
      </div>
    </div>
  );
}

// ===================================================================
// 05 — Traigent Platform (the solution)
// ===================================================================
function Slide05Solution() {
  return (
    <div className="text-center max-w-5xl mx-auto">
      <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
        <span style={{ color: BLUE }}>Traigent</span> Platform
      </h2>
      <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
        Systematic, mathematically grounded optimization — running across the full agent lifecycle.
      </p>
      <PillarsRow className="mb-12" />
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
        <div className="bg-slate-900/60 border rounded-2xl p-6" style={{ borderColor: `${BLUE}66` }}>
          <div className="text-sm font-mono mb-2" style={{ color: BLUE }}>● PRIMARY</div>
          <h3 className="text-xl font-bold text-white mb-2">Agent Optimization</h3>
          <p className="text-slate-400 text-sm">Auto-finds the best cost-performance configuration from run history.</p>
        </div>
        <div className="bg-slate-900/60 border rounded-2xl p-6" style={{ borderColor: `${AMBER}66` }}>
          <div className="text-sm font-mono mb-2" style={{ color: AMBER }}>● BUILT IN</div>
          <h3 className="text-xl font-bold text-white mb-2">Benchmark Evolution</h3>
          <p className="text-slate-400 text-sm">Surfaces easy / always-fail / redundant test cases as patterns emerge.</p>
        </div>
        <div className="bg-slate-900/60 border rounded-2xl p-6" style={{ borderColor: `${VIOLET}66` }}>
          <div className="text-sm font-mono mb-2" style={{ color: VIOLET }}>● BUILT IN</div>
          <h3 className="text-xl font-bold text-white mb-2">Observability and Tracing</h3>
          <p className="text-slate-400 text-sm">Full trace tree per run — spans, tokens, costs, errors.</p>
        </div>
      </div>
    </div>
  );
}

// ===================================================================
// 06 — The Killer Stat
// ===================================================================
function Slide06KillerStat() {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-3 text-center" style={{ textWrap: "balance" }}>
        Find the Best Configuration in <span style={{ color: BLUE }}>Hours, Not Weeks</span>
      </h2>
      <p className="text-lg md:text-xl text-slate-400 mb-8 text-center">
        The optimization engine converges in <span className="text-white font-semibold">under 10%</span> of the experiments.
      </p>
      <ConvergenceDiagram />
      <div className="grid grid-cols-3 gap-3 max-w-4xl mx-auto mt-8 text-center">
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4">
          <div className="text-2xl md:text-3xl font-bold" style={{ color: BLUE }}>&lt;10%</div>
          <p className="text-slate-400 text-sm mt-1">of the search space</p>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4">
          <div className="text-2xl md:text-3xl font-bold" style={{ color: BLUE }}>Hours</div>
          <p className="text-slate-400 text-sm mt-1">not weeks</p>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4">
          <div className="text-2xl md:text-3xl font-bold" style={{ color: BLUE }}>Certain</div>
          <p className="text-slate-400 text-sm mt-1">not gut feel</p>
        </div>
      </div>
    </div>
  );
}

// ===================================================================
// 07 — How It Works: Feedback Loop
// ===================================================================
function Slide07FeedbackLoop() {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">Two Components, One Feedback Loop</h2>
      <p className="text-lg md:text-xl text-slate-400 mb-8 text-center">
        Set up once. Runs automatically. Your agent code doesn't change.
      </p>
      <LoopDiagram />
    </div>
  );
}

// ===================================================================
// 08 — Inside the Optimization Engine
// ===================================================================
function Slide08OptEngine() {
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 text-center">
        Inside the <span style={{ color: BLUE }}>Optimization Engine</span>
      </h2>
      <p className="text-xl text-slate-400 mb-12 text-center max-w-3xl mx-auto">
        Principled, learning-based exploration — gets smarter with every run.
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6">
          <div className="text-sm font-mono mb-2" style={{ color: BLUE }}>EARLY RUNS</div>
          <p className="text-slate-300">Explores the <span className="text-white font-semibold">breadth</span> of the search space.</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6">
          <div className="text-sm font-mono mb-2" style={{ color: BLUE }}>MID RUNS</div>
          <p className="text-slate-300">Narrows toward <span className="text-white font-semibold">promising regions</span> based on KPI feedback.</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6">
          <div className="text-sm font-mono mb-2" style={{ color: BLUE }}>LATE RUNS</div>
          <p className="text-slate-300">Refines around the <span className="text-white font-semibold">optimum</span> and stops when converged.</p>
        </div>
      </div>
      <p className="mt-12 text-lg text-slate-400 text-center italic" style={{ textWrap: "balance" }}>
        Picks the next best configuration based on run history — no guessing, no exhaustive brute force.
      </p>
    </div>
  );
}

// ===================================================================
// 09 — Inside the Agent Wrapper
// ===================================================================
function Slide09Wrapper() {
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 text-center">
        Inside the <span style={{ color: BLUE }}>Agent Wrapper</span>
      </h2>
      <p className="text-xl text-slate-400 mb-10 text-center max-w-3xl mx-auto">
        Receives a configuration, executes the agent against your benchmark, measures KPIs.
      </p>
      <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-8 max-w-4xl mx-auto">
        <div className="text-sm font-mono mb-4 text-slate-500">[ Agent Wrapper ]</div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm font-mono mb-2" style={{ color: BLUE }}>INPUT (injected)</div>
            <div className="space-y-2">
              <div className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 font-mono text-sm">
                <div className="text-slate-500 text-xs mb-1">Model</div>
                <div style={{ color: BLUE }}>o3-mini</div>
              </div>
              <div className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 font-mono text-sm">
                <div className="text-slate-500 text-xs mb-1">Config</div>
                <div className="text-slate-300">temp: 0.2 · top_p: 0.85</div>
              </div>
            </div>
          </div>
          <div>
            <div className="text-sm font-mono mb-2" style={{ color: BLUE }}>OUTPUT (KPIs)</div>
            <div className="bg-slate-950 border border-slate-700 rounded-lg p-4 font-mono text-sm space-y-1.5">
              <div className="flex justify-between"><span className="text-slate-400">accuracy</span><span className="text-green-400">90%</span></div>
              <div className="flex justify-between"><span className="text-slate-400">cost</span><span className="text-yellow-400">$0.0002</span></div>
              <div className="flex justify-between"><span className="text-slate-400">latency</span><span className="text-blue-400">1.2s</span></div>
              <div className="flex justify-between"><span className="text-slate-400">safety</span><span className="text-pink-400">✓</span></div>
              <div className="flex justify-between border-t border-slate-700 pt-1.5 mt-2"><span className="text-slate-300">weighted score</span><span className="text-green-400 font-bold">0.86</span></div>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-8 text-base text-slate-500 text-center italic">
        Plus any custom KPI you care about. Your agent code never changes — the wrapper sits around it.
      </p>
    </div>
  );
}

// ===================================================================
// 10 — You Pick the Tradeoff (KPI weighting)
// ===================================================================
function Slide10Tradeoff() {
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 text-center">You Pick the Tradeoff</h2>
      <p className="text-xl text-slate-400 mb-12 text-center max-w-3xl mx-auto">
        Weighted multi-objective optimization. Different weights → different optimum. Re-run anytime.
      </p>
      <div className="space-y-4 max-w-3xl mx-auto">
        {[
          { label: "Accuracy-first", weights: "0.8 · accuracy + 0.15 · cost + 0.05 · latency", color: BLUE },
          { label: "Cost-sensitive", weights: "0.5 · accuracy + 0.45 · cost + 0.05 · latency", color: AMBER },
          { label: "Latency-critical", weights: "0.4 · accuracy + 0.1 · cost + 0.5 · latency", color: VIOLET },
        ].map((row) => (
          <div key={row.label} className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-5 flex items-center gap-6">
            <div className="text-base font-bold w-44 flex-shrink-0" style={{ color: row.color }}>{row.label}</div>
            <div className="font-mono text-base text-slate-300">{row.weights}</div>
          </div>
        ))}
      </div>
      <p className="mt-10 text-lg text-slate-400 text-center" style={{ textWrap: "balance" }}>
        Same wrapper. Same benchmark. <span className="text-white font-semibold">Minutes, not weeks</span> to re-converge.
      </p>
    </div>
  );
}

// ===================================================================
// 11 — Confidence to Ship
// ===================================================================
function Slide11Confidence() {
  return (
    <div className="max-w-5xl mx-auto text-center">
      <h2 className="text-5xl md:text-6xl font-bold text-white mb-12">Confidence to Ship</h2>
      <div className="max-w-3xl mx-auto border-l-4 pl-8 py-2 text-left mb-12" style={{ borderColor: BLUE }}>
        <p className="text-2xl md:text-3xl text-slate-200 italic leading-relaxed">
          "Am I confident this is the best configuration — or did I just run out of time to check?"
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
        <div className="bg-slate-900/60 border border-red-500/30 rounded-2xl p-8">
          <div className="text-sm font-mono text-red-400 mb-3">MANUAL TUNING</div>
          <p className="text-xl text-slate-300">The honest answer: <span className="text-white font-semibold">"I don't know."</span></p>
        </div>
        <div className="bg-slate-900/60 border-2 rounded-2xl p-8" style={{ borderColor: BLUE }}>
          <div className="text-sm font-mono mb-3" style={{ color: BLUE }}>WITH TRAIGENT</div>
          <p className="text-xl text-slate-300">You know — because the engine <span className="text-white font-semibold">converges.</span></p>
        </div>
      </div>
      <p className="mt-10 text-lg text-slate-400 max-w-3xl mx-auto" style={{ textWrap: "balance" }}>
        Confidence isn't a nice-to-have. It's the difference between *"we shipped it"* and *"we shipped the best version we could."*
      </p>
    </div>
  );
}

// ===================================================================
// 12 — Beyond Optimization (intro)
// ===================================================================
function Slide12BeyondIntro() {
  return (
    <div className="max-w-5xl mx-auto text-center">
      <h2 className="text-6xl md:text-7xl font-bold mb-8" style={{ color: AMBER }}>Beyond Optimization</h2>
      <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-16" style={{ textWrap: "balance" }}>
        Running across your benchmark hundreds of times unlocks <span className="text-white font-semibold">two more capabilities</span> competitors can't match.
      </p>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-slate-900/60 border rounded-2xl p-8 text-left" style={{ borderColor: `${AMBER}66` }}>
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: `${AMBER}22`, borderColor: `${AMBER}66` }}>
            <Sparkles className="w-6 h-6" style={{ color: AMBER }} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Self-Improving Benchmark</h3>
          <p className="text-slate-400">Patterns emerge across runs. Traigent flags them automatically.</p>
        </div>
        <div className="bg-slate-900/60 border rounded-2xl p-8 text-left" style={{ borderColor: `${VIOLET}66` }}>
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: `${VIOLET}22`, borderColor: `${VIOLET}66` }}>
            <Eye className="w-6 h-6" style={{ color: VIOLET }} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Full Observability & Tracing</h3>
          <p className="text-slate-400">Every run fully instrumented — no separate stack required.</p>
        </div>
      </div>
    </div>
  );
}

// ===================================================================
// 13 — Self-Improving Benchmark
// ===================================================================
function Slide13Benchmark() {
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 text-center">
        <span style={{ color: AMBER }}>Self-Improving</span> Benchmark
      </h2>
      <p className="text-xl text-slate-400 mb-12 text-center max-w-3xl mx-auto">
        Hundreds of runs reveal patterns. Traigent flags them — your benchmark gets sharper every cycle.
      </p>
      <div className="space-y-5 max-w-4xl mx-auto">
        {[
          { tag: "⊘ too easy", desc: "Every model & config passes — provides no discrimination. Safe to drop." },
          { tag: "⨯ always fails", desc: "Nothing passes — fix the agent itself (code, flow, RAG) before optimization can help." },
          { tag: "↻ redundant", desc: "Batches where a small sample carries the same signal — trim them and shorten every wrapper run." },
        ].map((row) => (
          <div key={row.tag} className="flex items-start gap-5 bg-slate-900/60 border rounded-2xl p-6" style={{ borderColor: `${AMBER}44` }}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md font-mono text-sm font-semibold flex-shrink-0" style={{ background: `${AMBER}1a`, border: `1px solid ${AMBER}66`, color: AMBER }}>
              {row.tag}
            </span>
            <span className="text-lg text-slate-300">{row.desc}</span>
          </div>
        ))}
      </div>
      <p className="mt-10 text-lg text-slate-400 text-center" style={{ textWrap: "balance" }}>
        Every future run gets <span className="text-white font-semibold">faster and cheaper</span>. Compound returns.
      </p>
    </div>
  );
}

// ===================================================================
// 14 — Full Observability & Tracing
// ===================================================================
function Slide14Tracing() {
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
        Full <span style={{ color: VIOLET }}>Observability & Tracing</span>
      </h2>
      <p className="text-lg md:text-xl text-slate-400 mb-10 text-center max-w-3xl mx-auto">
        Every wrapper run is fully instrumented. Inspect, debug, monitor — without a separate observability stack.
      </p>
      <TraceTree />
      <p className="mt-8 text-base text-slate-500 text-center italic">
        Per-call traces · request/response · latency · token usage · cost per step · span trees · session dashboards
      </p>
    </div>
  );
}

// ===================================================================
// 15 — Re-Optimization Across the Lifecycle
// ===================================================================
function Slide15Lifecycle() {
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 text-center">Across the Full Lifecycle</h2>
      <p className="text-xl text-slate-400 mb-12 text-center max-w-3xl mx-auto">
        Models evolve. Costs shift. Usage drifts. <span className="text-white font-semibold">Optimization is never one-and-done.</span>
      </p>
      <div className="space-y-3 max-w-4xl mx-auto">
        {[
          { trigger: "New model released (gpt-5, Claude 5, …)", action: "Re-run optimization → new optimum in minutes" },
          { trigger: "Provider drops prices", action: "Re-converge on the new cost-performance frontier" },
          { trigger: "Production usage shifts the question mix", action: "Update benchmark, re-optimize" },
          { trigger: "New KPI added (safety tier, latency tier, …)", action: "Re-weight, re-run" },
        ].map((row, i) => (
          <div key={i} className="grid grid-cols-2 gap-6 bg-slate-900/60 border border-slate-700/50 rounded-xl p-5">
            <div>
              <div className="text-xs font-mono text-slate-500 mb-1">TRIGGER</div>
              <div className="text-base text-slate-200">{row.trigger}</div>
            </div>
            <div>
              <div className="text-xs font-mono mb-1" style={{ color: BLUE }}>TRAIGENT</div>
              <div className="text-base text-slate-200">{row.action}</div>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-10 text-lg text-slate-400 text-center italic" style={{ textWrap: "balance" }}>
        The same wrapper. The same benchmark. <span className="text-white font-semibold">Compounding returns</span> over the agent's lifetime.
      </p>
    </div>
  );
}

// ===================================================================
// 16 — Three Products In One
// ===================================================================
function Slide16ThreeInOne() {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 text-center">Three Products In One</h2>
      <p className="text-xl text-slate-400 mb-12 text-center max-w-3xl mx-auto">
        What you'd otherwise pay <span className="text-white font-semibold">three vendors</span> for — included by default.
      </p>
      <div className="grid md:grid-cols-3 gap-5">
        <div className="bg-slate-900/60 border rounded-2xl p-8" style={{ borderColor: `${BLUE}66` }}>
          <div className="text-sm font-mono mb-3" style={{ color: BLUE }}>● PRIMARY</div>
          <h3 className="text-2xl font-bold text-white mb-4">Optimization</h3>
          <ul className="space-y-2 text-slate-300 text-base">
            <li>Auto-finds best config</li>
            <li>Converges in &lt;10% of the search space</li>
            <li>Multi-KPI weighted</li>
          </ul>
        </div>
        <div className="bg-slate-900/60 border rounded-2xl p-8" style={{ borderColor: `${AMBER}66` }}>
          <div className="text-sm font-mono mb-3" style={{ color: AMBER }}>● BUILT IN</div>
          <h3 className="text-2xl font-bold text-white mb-4">Benchmark Refinement</h3>
          <ul className="space-y-2 text-slate-300 text-base">
            <li>Flags useless test cases</li>
            <li>Shorter, sharper benchmarks</li>
            <li>Compounds over time</li>
          </ul>
        </div>
        <div className="bg-slate-900/60 border rounded-2xl p-8" style={{ borderColor: `${VIOLET}66` }}>
          <div className="text-sm font-mono mb-3" style={{ color: VIOLET }}>● BUILT IN</div>
          <h3 className="text-2xl font-bold text-white mb-4">Observability</h3>
          <ul className="space-y-2 text-slate-300 text-base">
            <li>Full trace tree per run</li>
            <li>Tokens · cost · latency</li>
            <li>No separate stack needed</li>
          </ul>
        </div>
      </div>
      <p className="mt-10 text-lg text-slate-300 text-center" style={{ textWrap: "balance" }}>
        <span className="text-white font-semibold">Optimization needs traces and benchmarks to work.</span> That's why Traigent ships them in one platform — not three.
      </p>
    </div>
  );
}

// ===================================================================
// 17 — Customers (Early Adopters)
// ===================================================================
function Slide17Customers() {
  const customers = ["Bazak", "iForAI", "Cloudzone", "Profisea", "Yotpo"];
  return (
    <div className="text-center max-w-5xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
        Customers <span className="text-slate-400 font-medium">(Early Adopters)</span>
      </h2>
      <p className="text-lg md:text-xl text-slate-400 mb-16">
        Design partners across telecom, retail, cloud, and AI services — optimizing real production agents today.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-12 gap-x-8">
        {customers.map((c) => (
          <div key={c} className="text-3xl md:text-4xl font-semibold text-slate-200">{c}</div>
        ))}
      </div>
    </div>
  );
}

// ===================================================================
// 18 — How It Works in 4 Steps
// ===================================================================
function Slide18FourSteps() {
  const steps = [
    { n: "01", title: "Specify", desc: "Define tunable decisions in TVL: models, prompts, tools, retrieval, constraints." },
    { n: "02", title: "Evaluate", desc: "Run your evaluation dataset. Measure accuracy, cost, latency, safety." },
    { n: "03", title: "Optimize", desc: "Explore the configuration space. Find the best tradeoffs for your KPIs." },
    { n: "04", title: "Apply", desc: "Apply the winning config for future calls. Keep a history of runs." },
  ];
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-5xl md:text-6xl font-bold text-white mb-12 text-center">How It Works</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((s) => (
          <div key={s.n} className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6">
            <div className="w-14 h-14 flex items-center justify-center rounded-full mb-4 font-bold text-lg" style={{ background: `${BLUE}22`, color: BLUE }}>
              {s.n}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===================================================================
// 19 — Engineer-First Integration (TVL + SDK)
// ===================================================================
function Slide19EngineerFirst() {
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 text-center">Engineer-First Integration</h2>
      <p className="text-xl text-slate-400 mb-12 text-center max-w-3xl mx-auto">
        Two onramps. Pick whichever fits your stack.
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-8">
          <div className="text-sm font-mono mb-3" style={{ color: BLUE }}>FOUNDATIONAL</div>
          <h3 className="text-2xl font-bold text-white mb-3">TVL — Tuned Variables Language</h3>
          <p className="text-slate-400 mb-4 text-sm">A declarative spec for the tunable decisions, objectives, and constraints of your agent.</p>
          <div className="bg-slate-950 border border-slate-700 rounded-lg p-4 font-mono text-xs text-slate-300 leading-relaxed">
            <div className="text-slate-500">{`// example.tvl`}</div>
            <div><span style={{ color: VIOLET }}>tune</span> <span style={{ color: BLUE }}>model</span> ∈ <span className="text-amber-400">[gpt-4o, gpt-4o-mini]</span></div>
            <div><span style={{ color: VIOLET }}>tune</span> <span style={{ color: BLUE }}>temperature</span> ∈ <span className="text-amber-400">[0.0 .. 1.0]</span></div>
            <div><span style={{ color: VIOLET }}>maximize</span> <span style={{ color: BLUE }}>accuracy</span></div>
            <div><span style={{ color: VIOLET }}>minimize</span> <span style={{ color: BLUE }}>cost</span></div>
          </div>
        </div>
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-8">
          <div className="text-sm font-mono mb-3" style={{ color: BLUE }}>BOTTOM-UP</div>
          <h3 className="text-2xl font-bold text-white mb-3">SDK — One Decorator</h3>
          <p className="text-slate-400 mb-4 text-sm">Drop a Python decorator on your agent function. The SDK handles the wrapper, KPIs, and optimization loop.</p>
          <div className="bg-slate-950 border border-slate-700 rounded-lg p-4 font-mono text-xs text-slate-300 leading-relaxed">
            <div><span style={{ color: VIOLET }}>@traigent</span>.optimize(</div>
            <div className="ml-4"><span className="text-slate-500">{`# tunable vars`}</span></div>
            <div className="ml-4"><span style={{ color: BLUE }}>model</span>=[<span className="text-amber-400">"gpt-4o"</span>, <span className="text-amber-400">"gpt-4o-mini"</span>],</div>
            <div className="ml-4"><span style={{ color: BLUE }}>temperature</span>=[0.0, 1.0],</div>
            <div>)</div>
            <div><span style={{ color: VIOLET }}>def</span> <span className="text-white">my_agent</span>(query): ...</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===================================================================
// 20 — Get Started
// ===================================================================
function Slide20GetStarted() {
  return (
    <div className="text-center max-w-5xl mx-auto">
      <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">Get Started</h2>
      <p className="text-xl text-slate-400 mb-12">Low risk. Fast result. Pick your path.</p>
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-8 text-left">
          <div className="text-sm font-mono text-slate-500 mb-3">OPTION 1</div>
          <h3 className="text-2xl font-bold text-white mb-3">Run the keyless demo</h3>
          <p className="text-slate-400 mb-5 text-sm">No API keys. No spend. ~6 seconds to a real result on your laptop.</p>
          <div className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 font-mono text-sm text-slate-200 break-all">
            <span className="text-slate-500">$ </span>uv tool install <span style={{ color: AMBER }}>"traigent[recommended]"</span> && traigent quickstart
          </div>
        </div>
        <div className="bg-slate-900/60 border-2 rounded-2xl p-8 text-left" style={{ borderColor: BLUE }}>
          <div className="text-sm font-mono mb-3" style={{ color: BLUE }}>OPTION 2</div>
          <h3 className="text-2xl font-bold text-white mb-3">Book a pilot</h3>
          <p className="text-slate-400 mb-5 text-sm">Pick one production agent. 2–4 week engagement. Measurable outcome.</p>
          <a
            href="https://meetings-eu1.hubspot.com/amir8"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-white px-6 py-3 rounded-lg font-medium text-base hover:opacity-90 transition-opacity"
            style={{ backgroundColor: BLUE }}
          >
            Book a 15-min call →
          </a>
        </div>
      </div>
      <p className="text-base text-slate-500 font-mono">amir@traigent.ai · traigent.ai</p>
    </div>
  );
}

// ===================================================================
// 21 — Closing
// ===================================================================
function Slide21Closing() {
  return (
    <div className="text-center max-w-5xl mx-auto">
      <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-white mb-12 tracking-tight leading-tight">
        Better Agents.<br />
        Lower Spend.<br />
        <span style={{ color: BLUE }}>Higher Confidence.</span>
      </h1>
      <p className="text-2xl md:text-3xl text-slate-300 font-medium mb-16 max-w-3xl mx-auto" style={{ textWrap: "balance" }}>
        <span style={{ color: BLUE }} className="font-bold">Traigent</span> — the most advanced AI Agent Optimization Platform on the market.
      </p>
      <p className="text-lg text-slate-500 font-mono">amir@traigent.ai · traigent.ai</p>
    </div>
  );
}

// ===================================================================
// Slide registry
// ===================================================================
const slides = [
  { title: "Title", component: Slide01Title },
  { title: "Optimize Agent ROI. Fast.", component: Slide02ROI },
  { title: "The Configuration Explosion", component: Slide03Explosion },
  { title: "What Manual Tuning Looks Like", component: Slide04Manual },
  { title: "Traigent Platform", component: Slide05Solution },
  { title: "Hours, Not Weeks", component: Slide06KillerStat },
  { title: "Two Components, One Loop", component: Slide07FeedbackLoop },
  { title: "Inside the Optimization Engine", component: Slide08OptEngine },
  { title: "Inside the Agent Wrapper", component: Slide09Wrapper },
  { title: "You Pick the Tradeoff", component: Slide10Tradeoff },
  { title: "Confidence to Ship", component: Slide11Confidence },
  { title: "Beyond Optimization", component: Slide12BeyondIntro },
  { title: "Self-Improving Benchmark", component: Slide13Benchmark },
  { title: "Full Observability & Tracing", component: Slide14Tracing },
  { title: "Across the Lifecycle", component: Slide15Lifecycle },
  { title: "Three Products In One", component: Slide16ThreeInOne },
  { title: "Customers (Early Adopters)", component: Slide17Customers },
  { title: "How It Works", component: Slide18FourSteps },
  { title: "Engineer-First Integration", component: Slide19EngineerFirst },
  { title: "Get Started", component: Slide20GetStarted },
  { title: "Better Agents. Lower Spend. Higher Confidence.", component: Slide21Closing },
];

// ===================================================================
// Deck shell (identical to /pitch — arrow keys, fullscreen, transitions)
// ===================================================================
export default function PitchFull() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const containerRef = useRef(null);
  const total = slides.length;

  const goTo = (i) => {
    if (i < 0 || i >= total || i === current) return;
    setDirection(i > current ? 1 : -1);
    setCurrent(i);
  };
  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        prev();
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      } else if (e.key === "Home") {
        goTo(0);
      } else if (e.key === "End") {
        goTo(total - 1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [current]);

  const Current = slides[current].component;

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#080808] text-white overflow-hidden">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-4 md:p-6">
        <Link to="/" className="text-slate-500 hover:text-white text-sm flex items-center gap-2 transition-colors">
          <Home className="w-4 h-4" />
          <span className="hidden md:inline">Home</span>
        </Link>
        <span className="text-slate-500 text-sm font-mono">
          {current + 1} / {total} · {slides[current].title}
        </span>
        <button
          onClick={toggleFullscreen}
          className="text-slate-500 hover:text-white transition-colors"
          title="Fullscreen (F)"
          aria-label="Toggle fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Slide stage */}
      <div className="min-h-screen flex items-center justify-center px-6 md:px-12 py-24">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 40 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full"
          >
            <Current />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom nav */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex justify-between items-center p-4 md:p-6">
        <button
          onClick={prev}
          disabled={current === 0}
          className="text-slate-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1 text-sm"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="hidden md:inline">Prev</span>
        </button>

        <div className="flex items-center gap-1.5 max-w-[60%] overflow-x-auto">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-2 rounded-full transition-all flex-shrink-0 ${
                i === current ? "w-6 bg-[#1A6BF5]" : "w-2 bg-slate-700 hover:bg-slate-500"
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          disabled={current === total - 1}
          className="text-slate-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1 text-sm"
        >
          <span className="hidden md:inline">Next</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Keyboard hint */}
      <div className="hidden md:block absolute bottom-16 right-6 text-slate-700 text-xs font-mono z-10">
        ← → space · F fullscreen · Home/End
      </div>
    </div>
  );
}
