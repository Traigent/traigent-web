import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronDown, Home, Maximize2, Sparkles, Eye, Check, ArrowRight, Clock, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ConvergenceDiagram, KillerStatsGrid, ThreeProductsGrid } from "./pitch/shared";
import { OnePager2Slide } from "./OnePager2";
import BrandMark from "../components/BrandMark";
import StartNowModal from "../components/StartNowModal";
import { useKnownContactNotify } from "../lib/useKnownContactNotify";
import { notifyPitchDeckViewed } from "../lib/hubspotForms";
import { usePageView } from "../lib/usePageView";

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
// 00 — Hero (mirrors website hero section exactly)
// ===================================================================
export function SlideHero() {
  // Benefits-explained dropdown state — mirrors the homepage hero behavior.
  const [benefitsOpen, setBenefitsOpen] = useState(false);
  const benefitsRef = useRef(null);
  useEffect(() => {
    if (!benefitsOpen) return;
    const onDocClick = (e) => {
      if (benefitsRef.current && !benefitsRef.current.contains(e.target)) {
        setBenefitsOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [benefitsOpen]);

  const methodBullets = [
    <><span className="text-white font-semibold underline underline-offset-4 decoration-2 decoration-[#4D8EF8]/70">Finds the optimal model and configuration combo</span> in <span className="text-white font-semibold">hours, not weeks</span>.</>,
    <><span className="text-white font-semibold">Automatically</span>, not manually.</>,
    <>Requires only a <span className="text-white font-semibold">fraction of the search space.</span></>,
    <>With <span className="text-white font-semibold">confidence</span>, not guesswork.</>,
  ];
  const benefitBullets = [
    { content: <span className="text-white font-semibold">Reduces engineering costs.</span>, to: "/ttm", linkLabel: "TTM calc" },
    { content: <><span className="text-white font-semibold">Saves LLM costs</span> over the lifecycle.</>, to: "/roi", linkLabel: "ROI calc" },
    { content: <span className="text-white font-semibold">Shortens time to market.</span> },
    { content: <><span className="text-white font-semibold">Increases confidence</span> significantly.</> },
  ];
  return (
    <div className="text-center max-w-5xl mx-auto">
      <BrandMark size="hero" className="justify-center mb-6" />
      <h1
        className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.05] tracking-tight mb-8"
        style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.03em' }}
      >
        <span className="whitespace-nowrap">
          AI Agent <span style={{ color: BLUE }}>Cost-Performance</span>
        </span>
        <br />
        Optimized. <span style={{ color: BLUE }}>Automatically.</span>
      </h1>

      <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto text-left">
        {/* Left — unique capability */}
        <div className="bg-slate-900/50 border-2 rounded-2xl p-5 md:p-6" style={{ borderColor: "rgba(26, 107, 245, 0.35)" }}>
          <div
            className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-[10px] md:text-[11px] font-mono tracking-widest mb-4"
            style={{ color: "#4D8EF8" }}
          >
            AGENT OPTIMIZATION PLATFORM
          </div>
          <ul className="space-y-2.5">
            {methodBullets.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm md:text-base text-slate-300 leading-snug">
                <Check className="w-4 h-4 md:w-5 md:h-5 mt-0.5 flex-shrink-0 text-[#4D8EF8]" strokeWidth={3} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right — Traigent benefits */}
        <div
          className="bg-gradient-to-br from-blue-500/10 to-slate-900/0 border-2 rounded-2xl p-5 md:p-6"
          style={{ borderColor: BLUE }}
        >
          <span
            className="inline-block px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/40 text-[10px] md:text-[11px] font-mono tracking-widest mb-4"
            style={{ color: "#4D8EF8" }}
          >
            TRAIGENT BENEFITS
          </span>
          <ul className="space-y-2.5">
            {benefitBullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm md:text-base text-slate-300 leading-snug">
                <Check className="w-4 h-4 md:w-5 md:h-5 mt-0.5 flex-shrink-0 text-[#4D8EF8]" strokeWidth={3} />
                <span className="flex-1">
                  {b.content}
                  {b.to && (
                    <>
                      {" "}
                      <Link
                        to={b.to}
                        className="inline-flex items-center gap-0.5 text-[#4D8EF8] hover:text-white underline underline-offset-2 decoration-[#4D8EF8]/50 hover:decoration-white font-medium whitespace-nowrap"
                      >
                        {b.linkLabel} →
                      </Link>
                    </>
                  )}
                </span>
              </li>
            ))}
          </ul>

          {/* Benefits explained dropdown — same content as the homepage hero. */}
          <div ref={benefitsRef} className="relative mt-5 pt-4 border-t border-blue-500/30 text-center">
            <button
              type="button"
              onClick={() => setBenefitsOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={benefitsOpen}
              className="group inline-flex items-center gap-1.5 text-base md:text-lg transition-colors"
              style={{ color: "#4D8EF8" }}
            >
              <span className="underline underline-offset-4 decoration-[#4D8EF8]/50 group-hover:decoration-[#4D8EF8] font-semibold">
                Benefits explained
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${benefitsOpen ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>
            {benefitsOpen && (
              <div
                role="menu"
                className="absolute left-1/2 -translate-x-1/2 mt-2 w-[min(92vw,640px)] z-30 bg-slate-950 border border-slate-700 rounded-xl shadow-2xl overflow-hidden text-left grid grid-cols-1 md:grid-cols-2 md:divide-x md:divide-slate-800"
              >
                <div>
                  <div className="px-4 pt-3 pb-1 text-[10px] font-mono uppercase tracking-widest text-slate-500">See it on your numbers</div>
                  <Link to="/roi" role="menuitem" onClick={() => setBenefitsOpen(false)} className="block px-4 py-3 text-sm text-slate-200 hover:bg-slate-900 hover:text-white border-b border-slate-800 transition-colors">
                    <div className="font-semibold text-[#4D8EF8]">ROI Calculator</div>
                    <div className="text-xs text-slate-400 mt-0.5">12-month savings</div>
                  </Link>
                  <Link to="/ttm" role="menuitem" onClick={() => setBenefitsOpen(false)} className="block px-4 py-3 text-sm text-slate-200 hover:bg-slate-900 hover:text-white transition-colors">
                    <div className="font-semibold text-[#4D8EF8]">TTM Calculator</div>
                    <div className="text-xs text-slate-400 mt-0.5">Engineering time saved</div>
                  </Link>
                </div>
                <div className="border-t border-slate-800 md:border-t-0">
                  <div className="px-4 pt-3 pb-1 text-[10px] font-mono uppercase tracking-widest text-slate-500">Read more</div>
                  <Link to="/blog/the-business-case" role="menuitem" onClick={() => setBenefitsOpen(false)} className="block px-4 py-3 text-sm text-slate-200 hover:bg-slate-900 hover:text-white border-b border-slate-800 transition-colors">
                    <div className="font-semibold text-[#4D8EF8]">The business case</div>
                    <div className="text-xs text-slate-400 mt-0.5">Quantified savings, the math behind ROI.</div>
                  </Link>
                  <Link to="/value-proposition" role="menuitem" onClick={() => setBenefitsOpen(false)} className="block px-4 py-3 text-sm text-slate-200 hover:bg-slate-900 hover:text-white border-b border-slate-800 transition-colors">
                    <div className="font-semibold text-[#4D8EF8]">The problem we solve</div>
                    <div className="text-xs text-slate-400 mt-0.5">The 6-truth chain that leads to Traigent.</div>
                  </Link>
                  <Link to="/blog" role="menuitem" onClick={() => setBenefitsOpen(false)} className="block px-4 py-3 text-sm text-slate-200 hover:bg-slate-900 hover:text-white transition-colors">
                    <div className="font-semibold text-[#4D8EF8]">Why Traigent</div>
                    <div className="text-xs text-slate-400 mt-0.5">Deeper reading: model myth, eval trap, more.</div>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===================================================================
// 01 — Title
// ===================================================================
export function Slide01Title() {
  return (
    <div className="text-center max-w-5xl mx-auto">
      <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-white mb-8 tracking-tight">Traigent</h1>
      <p className="text-2xl md:text-3xl text-slate-200 mb-10 font-medium leading-tight" style={{ textWrap: "balance" }}>
        Rapid <span style={{ color: BLUE }} className="font-bold">Cost-Performance</span> Agent Optimization
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
export function Slide02ROI() {
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
export function Slide03Explosion({ subtitle } = {}) {
  const defaultSubtitle = (
    <>
      Every agent has <span className="text-white font-semibold">hundreds (if not thousands)</span> of tunable variable combinations.
    </>
  );
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 text-center">The Configuration Explosion</h2>
      <p className="text-xl text-slate-300 mb-12 text-center max-w-3xl mx-auto leading-relaxed">
        {subtitle ?? defaultSubtitle}
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
            {/* Hover tooltip — lists the actual options */}
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
            href="https://www.traigent.ai/#/blog/the-config-multiverse"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-base md:text-lg font-medium underline underline-offset-4 decoration-[#4D8EF8]/50 hover:decoration-[#4D8EF8] transition-colors"
            style={{ color: "#4D8EF8" }}
          >
            See the full inventory & A/C/L impacts <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="https://www.traigent.ai/#/ttm"
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

// ===================================================================
// 03b — The Configuration Option Explosion (millions, abstract formula)
// ===================================================================
export function SlideExplosionMillions() {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-5xl md:text-6xl font-bold text-white mb-12 text-center">The Configuration Option Explosion</h2>

      {/* Boxed formula */}
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-14">
        <div className="bg-slate-900/60 border-2 border-slate-700/60 rounded-2xl px-6 md:px-8 py-5 md:py-6 text-center min-w-[140px]">
          <div className="text-3xl md:text-4xl font-bold text-white tracking-tight">models</div>
        </div>
        <div className="text-5xl md:text-6xl font-bold text-slate-500">×</div>
        <div className="bg-slate-900/60 border-2 rounded-2xl px-6 md:px-8 py-5 md:py-6 text-center min-w-[220px]" style={{ borderColor: "rgba(77,142,248,0.45)" }}>
          <div className="text-3xl md:text-4xl font-bold text-white tracking-tight">15+ agent knobs</div>
        </div>
        <div className="text-5xl md:text-6xl font-bold text-slate-500">×</div>
        <div className="bg-slate-900/60 border-2 rounded-2xl px-6 md:px-8 py-5 md:py-6 text-center min-w-[220px]" style={{ borderColor: "rgba(245,158,11,0.45)" }}>
          <div className="text-3xl md:text-4xl font-bold text-white tracking-tight">8+ model knobs</div>
        </div>
      </div>

      {/* Equals + millions */}
      <div className="text-center">
        <p className="text-2xl md:text-3xl text-slate-300 mb-2">equals</p>
        <p className="text-6xl md:text-7xl lg:text-8xl font-extrabold" style={{ color: "#f87171" }}>
          millions of options
        </p>
        <p className="text-lg text-slate-400 mt-6 max-w-2xl mx-auto leading-relaxed">
          Manually exhausting the search space is impossible. Even sampling a fraction is a months-long, low-confidence engineering project.
        </p>
        <a
          href="https://www.traigent.ai/#/blog/the-config-multiverse"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-6 text-base md:text-lg font-medium underline underline-offset-4 decoration-[#4D8EF8]/50 hover:decoration-[#4D8EF8] transition-colors"
          style={{ color: "#4D8EF8" }}
        >
          See the full inventory & A/C/L impacts <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

// ===================================================================
// 04 — What Manual Tuning Actually Looks Like
// ===================================================================
export function Slide04Manual() {
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-5xl md:text-6xl font-bold text-white mb-10 text-center">What Manual Tuning Actually Looks Like</h2>
      <div className="space-y-4 text-xl text-slate-300 max-w-3xl mx-auto">
        {[
          "Engineers pick a model and several configuration parameters out of hundreds of possible combinations",
          "Manually configure it and run it on the benchmark. Look at KPIs.",
          "Guess a new combination. Configure manually. Re-run. Guess again.",
          "Stop when time runs out",
          "Ship it. Hope for the best.",
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
export function Slide05Solution() {
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
export function Slide06KillerStat() {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-3 text-center" style={{ textWrap: "balance" }}>
        Finds the Best Option in <span style={{ color: BLUE }}>Hours, Not Weeks</span>
      </h2>
      <p className="text-lg md:text-xl text-slate-400 mb-8 text-center">
        The optimization engine converges in <span className="text-white font-semibold">under 10%</span> of the experiments.
      </p>
      <ConvergenceDiagram />
      <KillerStatsGrid className="grid grid-cols-3 gap-3 max-w-4xl mx-auto mt-8 text-center" />
    </div>
  );
}

// ===================================================================
// 07 — How It Works: Feedback Loop
// ===================================================================
export function Slide07FeedbackLoop() {
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
export function Slide08OptEngine() {
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
export function Slide09Wrapper() {
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
export function Slide10Tradeoff() {
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
export function Slide11Confidence() {
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
export function Slide12BeyondIntro() {
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
export function Slide13Benchmark() {
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
export function Slide14Tracing() {
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
export function Slide15Lifecycle() {
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
export function Slide16ThreeInOne() {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 text-center">Three Products In One</h2>
      <p className="text-xl text-slate-400 mb-12 text-center max-w-3xl mx-auto">
        What you'd otherwise pay <span className="text-white font-semibold">three vendors</span> for — included by default.
      </p>
      <ThreeProductsGrid />
      <p className="mt-10 text-lg text-slate-300 text-center" style={{ textWrap: "balance" }}>
        <span className="text-white font-semibold">Optimization needs traces and benchmarks to work.</span> That's why Traigent ships them in one platform — not three.
      </p>
    </div>
  );
}

// ===================================================================
// 17 — Customers (Early Adopters)
// ===================================================================
export function Slide17Customers() {
  const customers = ["Bazak", "iForAI", "Cloudzone", "Profisea", "Yotpo"];
  return (
    <div className="text-center max-w-5xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
        Customers
      </h2>
      <p className="text-lg md:text-xl text-slate-400 mb-16">
        Customers across telecom, retail, cloud, and AI services — optimizing real production agents today.
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
export function Slide18FourSteps() {
  const steps = [
    { n: "01", title: "Wrap", desc: "Engineer wraps your agent with the SDK in ~1 hour. One-time. Your agent code doesn't change." },
    { n: "02", title: "Optimize", desc: "The engine sweeps the model and configuration space unattended. Needs only a fraction of combinations to converge." },
    { n: "03", title: "Converge", desc: "Returns the optimal model + config combo for your KPIs — cost, latency, accuracy — in hours, not weeks. With quantified confidence." },
    { n: "04", title: "Re-optimize", desc: "Apply the winning config in production. Re-run automatically as models update, costs shift, or usage drifts." },
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
export function Slide19EngineerFirst() {
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
export function Slide20GetStarted({ bookingHref = "https://meetings-eu1.hubspot.com/amir8" } = {}) {
  // Code/SDK access is email-gated: the install command is revealed via the
  // Start Now modal (form first for unknown visitors; instant for known ones).
  const [showStartNow, setShowStartNow] = useState(false);
  return (
    <div className="text-center max-w-5xl mx-auto">
      {showStartNow && (
        <StartNowModal onClose={() => setShowStartNow(false)} location="pitch_slide20" />
      )}
      <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">Get Started</h2>
      <p className="text-xl text-slate-400 mb-12">Low risk. Fast result. Pick your path.</p>
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-8 text-left">
          <div className="text-sm font-mono text-slate-500 mb-3">OPTION 1</div>
          <h3 className="text-2xl font-bold text-white mb-3">Run the keyless demo</h3>
          <p className="text-slate-400 mb-5 text-sm">No API keys. No spend. ~6 seconds to a real result on your laptop.</p>
          <button
            type="button"
            onClick={() => setShowStartNow(true)}
            className="w-full bg-slate-950 border border-slate-700 hover:border-blue-500/60 rounded-lg px-4 py-3 font-mono text-sm text-slate-200 text-left transition-colors"
          >
            <span className="text-slate-500">$ </span>uv tool install <span style={{ color: AMBER }}>"traigent[…]"</span>
            <span className="block mt-1 text-xs text-slate-500 font-sans">Click to get the full command →</span>
          </button>
        </div>
        <div className="bg-slate-900/60 border-2 rounded-2xl p-8 text-left" style={{ borderColor: BLUE }}>
          <div className="text-sm font-mono mb-3" style={{ color: BLUE }}>OPTION 2</div>
          <h3 className="text-2xl font-bold text-white mb-3">Book a pilot</h3>
          <p className="text-slate-400 mb-5 text-sm">Pick one production agent. 2–4 week engagement. Measurable outcome.</p>
          <a
            href={bookingHref}
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
export function Slide21Closing() {
  return (
    <div className="text-center max-w-5xl mx-auto">
      <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-white mb-12 tracking-tight leading-tight">
        Better Agents. <span style={{ color: BLUE }}>Faster.</span><br />
        Lower Spend.<br />
        <span style={{ color: BLUE }}>Higher Confidence.</span>
      </h1>
      <p className="text-2xl md:text-3xl text-slate-300 font-medium mb-16 max-w-3xl mx-auto" style={{ textWrap: "balance" }}>
        <span className="whitespace-nowrap"><span style={{ color: BLUE }} className="font-bold">Traigent</span> — AI Agent <span style={{ color: BLUE }} className="font-semibold">Cost-Performance</span>.</span> Optimized. <span style={{ color: BLUE }} className="font-semibold">Automatically.</span>
      </p>
      <p className="text-lg text-slate-500 font-mono">amir@traigent.ai · traigent.ai</p>
    </div>
  );
}

// ===================================================================
// Slide registry
// ===================================================================
// ===================================================================
// TTM-calc preview slide — mirrors /ttm calculator's headline result
// ===================================================================
export function SlideTTMPreview() {
  return (
    <div className="max-w-6xl mx-auto">
      <div
        className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-mono tracking-widest mb-5"
        style={{ color: "#4D8EF8" }}
      >
        TIME-TO-MARKET CALCULATOR
      </div>
      <h2 className="text-4xl md:text-6xl font-bold text-white mb-3 tracking-tight">
        Engineer-weeks <span style={{ color: BLUE }}>recovered</span> per pass.
      </h2>
      <p className="text-lg md:text-xl text-slate-400 mb-3 max-w-3xl">
        Manual tuning takes ~648 configurations × 30 min each.
      </p>
      <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-3xl">
        Traigent's optimizer needs ~1 hour of engineer setup. The rest runs unattended.
      </p>

      <div className="grid md:grid-cols-3 gap-5 mb-10">
        <div className="bg-slate-900/40 border-2 border-slate-500 rounded-2xl p-6 text-center">
          <div className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-2">Manual full sweep</div>
          <div className="text-5xl md:text-6xl font-extrabold text-white mb-1">8</div>
          <div className="text-slate-400">engineer-weeks</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500/15 to-slate-900/0 border-2 rounded-2xl p-6 text-center" style={{ borderColor: BLUE }}>
          <div className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "#4D8EF8" }}>With Traigent</div>
          <div className="text-5xl md:text-6xl font-extrabold mb-1" style={{ color: BLUE }}>1 hr</div>
          <div className="text-slate-400">of engineer setup time</div>
        </div>
        <div className="bg-slate-900/40 border-2 rounded-2xl p-6 text-center" style={{ borderColor: AMBER }}>
          <div className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: AMBER }}>Saved per pass</div>
          <div className="text-5xl md:text-6xl font-extrabold mb-1" style={{ color: AMBER }}>~8 weeks</div>
          <div className="text-slate-400">≈ $32k at $100/hr</div>
        </div>
      </div>

      <p className="text-center text-slate-300 text-base md:text-lg">
        <span className="text-white font-semibold">Plus 100% search-space coverage</span> — versus the ~20% you can realistically test manually.
        <a
          href="https://www.traigent.ai/#/ttm"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-3 inline-flex items-center gap-1 underline underline-offset-4 decoration-[#4D8EF8]/50 hover:decoration-[#4D8EF8] font-medium"
          style={{ color: "#4D8EF8" }}
        >
          Run your own numbers <ArrowRight className="w-4 h-4" />
        </a>
      </p>
    </div>
  );
}

// ===================================================================
// ROI-calc preview slide — mirrors /roi calculator's headline result
// ===================================================================
export function SlideROIPreview({ subtitle, footer } = {}) {
  const defaultSubtitle = "Auto-optimizing the cost-performance configuration saves a real range of LLM spend over the lifecycle — without sacrificing quality.";
  const defaultFooter = (
    <p className="text-center text-slate-300 text-base md:text-lg">
      <span className="text-white font-semibold">Plus engineering recovery</span>
      <a
        href="https://www.traigent.ai/#/roi"
        target="_blank"
        rel="noopener noreferrer"
        className="ml-3 inline-flex items-center gap-1 underline underline-offset-4 decoration-[#4D8EF8]/50 hover:decoration-[#4D8EF8] font-medium"
        style={{ color: "#4D8EF8" }}
      >
        Calculate yours <ArrowRight className="w-4 h-4" />
      </a>
    </p>
  );
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
        {subtitle ?? defaultSubtitle}
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

      {footer ?? defaultFooter}
    </div>
  );
}

// ===================================================================
// Slide registry — each slide tagged with section for the tab bar
// Order is now grouped by section (Hero -> Problem -> Solution -> TTM -> ROI -> Proof -> CTA)
// ===================================================================
// ===================================================================
// Deck slide: One-Pager #2 — full outreach summary embedded as a slide.
// Reuses the canonical /one-pager-2 layout via OnePager2Slide at 100%
// size with the internal header + footer hidden.
//
// The deck slide stage applies py-24 (192px of vertical padding) for
// every slide. For this slide, that head/foot space causes the content
// to push past the viewport on standard laptop screens. The negative
// margin below cancels the parent's py-24; the pt-14 / pb-16 add back
// just enough buffer to clear the absolute-positioned top bar and bottom
// nav. Result: slide content sits high in the viewport and fits without
// scrolling on 768px+ heights.
// ===================================================================
// Compute scale lazily during the initial render so we never briefly draw
// the 1280-wide slide on a 390-wide phone — that flash was probably what
// crashed iOS WebKit on the earlier attempts.
function getOnePagerScale() {
  if (typeof window === "undefined") return 1;
  return Math.min(1, window.innerWidth / 1280);
}

export function SlideOnePagerSummary() {
  // Section is fixed at 1280x720 (matches the standalone /one-pager-2 and
  // the PPT 16:9 PDF). On phones the deck's `overflow-hidden` would clip
  // the right side; earlier CSS-based scaling (min() in transform,
  // aspect-ratio) crashed older iOS WebKit. Plain JS scale only.
  const [scale, setScale] = useState(getOnePagerScale);
  useEffect(() => {
    const onResize = () => setScale(getOnePagerScale());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return (
    <div className="-my-24 pt-14 pb-16 w-full flex items-center justify-center overflow-hidden">
      <div
        className="relative"
        style={{ width: 1280 * scale, height: 720 * scale }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1280,
            height: 720,
            transformOrigin: "top left",
            transform: `scale(${scale})`,
          }}
        >
          <OnePager2Slide showHeader={false} showFooter={false} />
        </div>
      </div>
    </div>
  );
}

export const FULL_SLIDES = [
  // ----- HERO -----
  { title: "Hero (website mirror)", section: "Traigent intro", component: SlideHero },
  // ----- ONE-PAGER SUMMARY (2nd slide — quick outreach pitch in one slide) -----
  { title: "One-Pager Summary", section: "Traigent intro", component: SlideOnePagerSummary },
  // ----- PROBLEM -----
  { title: "The Configuration Explosion", section: "Problem", component: Slide03Explosion },
  { title: "The Configuration Option Explosion (millions)", section: "Problem", component: SlideExplosionMillions },
  { title: "What Manual Tuning Looks Like", section: "Problem", component: Slide04Manual },
  // ----- SOLUTION -----
  { title: "Hours, Not Weeks (opener)", section: "Solution", component: Slide06KillerStat },
  { title: "Two Components, One Loop", section: "Solution", component: Slide07FeedbackLoop },
  { title: "Inside the Optimization Engine", section: "Solution", component: Slide08OptEngine },
  { title: "Inside the Agent Wrapper", section: "Solution", component: Slide09Wrapper },
  { title: "You Pick the Tradeoff", section: "Solution", component: Slide10Tradeoff },
  { title: "Confidence to Ship", section: "Solution", component: Slide11Confidence },
  { title: "Beyond Optimization", section: "Solution", component: Slide12BeyondIntro },
  { title: "Self-Improving Benchmark", section: "Solution", component: Slide13Benchmark },
  { title: "Full Observability & Tracing", section: "Solution", component: Slide14Tracing },
  { title: "Across the Lifecycle", section: "Solution", component: Slide15Lifecycle },
  { title: "Three Products In One", section: "Solution", component: Slide16ThreeInOne },
  { title: "How It Works", section: "Solution", component: Slide18FourSteps },
  { title: "Engineer-First Integration", section: "Solution", component: Slide19EngineerFirst },
  // ----- TTM -----
  { title: "Hours, Not Weeks", section: "TTM", component: Slide06KillerStat },
  { title: "Engineer-weeks recovered (TTM Calc)", section: "TTM", component: SlideTTMPreview },
  // ----- ROI -----
  { title: "20–60% LLM Cost Savings (ROI Calc)", section: "ROI", component: SlideROIPreview },
  // ----- PROOF -----
  { title: "Customers", section: "Proof", component: Slide17Customers },
  // ----- CTA -----
  { title: "Get Started", section: "CTA", component: Slide20GetStarted },
  { title: "Better Agents. Faster. Lower Spend. Higher Confidence.", section: "CTA", component: Slide21Closing },
];

// Section order for the tab bar (drives the layout left-to-right)
export const SECTION_ORDER = ["Traigent intro", "Problem", "Solution", "TTM", "ROI", "Proof", "CTA"];

// ===================================================================
// Reusable deck shell — arrow keys, fullscreen, top bar, bottom nav.
// Takes a `slides` prop so multiple decks (/pitch-full, /pitch-short, ...)
// can share the same chrome without duplicating the entire 200-line shell.
// ===================================================================
export function PitchDeck({ slides }) {
  // First-slide index per section (so a tab click jumps to the right place)
  const sectionStartIndex = SECTION_ORDER.reduce((acc, sec) => {
    acc[sec] = slides.findIndex((s) => s.section === sec);
    return acc;
  }, {});
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
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "PageUp") {
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

  // Hide the HubSpot chat widget (and cookie banner) while the deck is open —
  // they cover the bottom-right Next control AND clash with the embedded
  // one-pager slide. CSS-hide is bulletproof against HubSpot's own DOM
  // re-injection; restored when this slide unmounts.
  useEffect(() => {
    const style = document.createElement("style");
    style.dataset.pitchHideHubspot = "";
    // NOTE: do NOT include `.hs-messages-mobile` — that selector matches a
    // class on the React root in some builds and blanks the entire deck on
    // iOS WebKit. The remaining selectors safely target HubSpot chrome.
    style.textContent = `
      #hubspot-messages-iframe-container,
      .hs-banner-iframe,
      #hs-eu-cookie-confirmation,
      #hs-eu-cookie-confirmation-inner { display: none !important; visibility: hidden !important; }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  const Current = slides[current].component;

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#080808] text-white overflow-hidden">
      <Helmet>
        <title>Traigent — Agent Optimization Platform</title>
      </Helmet>
      {/* Top bar — persistent Traigent logo (links home) + slide counter + fullscreen */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-4 md:p-6">
        <Link
          to="/"
          className="opacity-80 hover:opacity-100 transition-opacity"
          aria-label="Traigent home"
          title="Home"
        >
          <BrandMark size="md" />
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

      {/* Bottom nav — section tabs on top, slide dots + prev/next below */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-4 md:px-6 pb-4 md:pb-6 pt-3 flex flex-col gap-3">
        {/* Section tabs */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-1 bg-slate-900/60 border border-slate-800 rounded-full px-1 py-1 backdrop-blur-sm">
            {SECTION_ORDER.map((sec) => {
              const startIdx = sectionStartIndex[sec];
              if (startIdx < 0) return null;
              const currentSection = slides[current]?.section;
              const isActive = currentSection === sec;
              return (
                <button
                  key={sec}
                  onClick={() => goTo(startIdx)}
                  className={`px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-medium font-mono uppercase tracking-wider transition-colors ${
                    isActive
                      ? "bg-[#1A6BF5] text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {sec}
                </button>
              );
            })}
          </div>
        </div>

        {/* Prev / dots / Next row */}
        <div className="flex justify-between items-center">
          <button
            onClick={prev}
            disabled={current === 0}
            aria-label="Previous slide"
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
            aria-label="Next slide"
            className="text-slate-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1 text-sm"
          >
            <span className="hidden md:inline">Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Keyboard hint */}
      <div className="hidden md:block absolute bottom-28 right-6 text-slate-700 text-xs font-mono z-10">
        ← → ↑ ↓ space · F fullscreen · Home/End
      </div>
    </div>
  );
}

// ===================================================================
// Default export: full deck with all slides. Other deck variants
// (e.g. /pitch-short) compose PitchDeck with their own slides arrays.
// ===================================================================
export default function PitchFull() {
  usePageView();
  useKnownContactNotify({
    notify: notifyPitchDeckViewed,
    location: "pitch_full",
    eventName: "pitch_deck_viewed_known",
    gateKey: "pitch_deck",
  });
  return <PitchDeck slides={FULL_SLIDES} />;
}
