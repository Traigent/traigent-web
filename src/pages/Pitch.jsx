import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Home, Maximize2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ConvergenceDiagram, KillerStatsGrid, ThreeProductsGrid } from "./pitch/shared";

// ===================================================================
// Brand tokens — single source of truth so all slides match the site.
// ===================================================================
const BLUE = "#1A6BF5";
const AMBER = "#f59e0b";
const VIOLET = "#a78bfa";

// ===================================================================
// Slide 1 — Hook
// ===================================================================
function SlideHook() {
  return (
    <div className="text-center max-w-5xl mx-auto">
      <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-white mb-8 tracking-tight">
        Traigent
      </h1>
      <p className="text-2xl md:text-3xl text-slate-200 mb-10 font-medium leading-tight" style={{ textWrap: "balance" }}>
        The most advanced <span style={{ color: BLUE }} className="font-bold">AI Agent Optimization Platform</span> on the market
      </p>
      <p className="text-xl md:text-2xl text-slate-400 mb-12">
        Stop guessing your agent's configuration. <span style={{ color: BLUE }} className="font-semibold">Start converging.</span>
      </p>
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-base md:text-lg font-semibold">
        <span style={{ color: BLUE }}>Agent Optimization</span>
        <span className="text-slate-600">·</span>
        <span style={{ color: AMBER }}>Benchmark Evolution</span>
        <span className="text-slate-600">·</span>
        <span style={{ color: VIOLET }}>Observability and Tracing</span>
      </div>
      <p className="mt-16 text-slate-500 text-sm font-mono">traigent.ai · amir@traigent.ai</p>
    </div>
  );
}

// ===================================================================
// Slide 2 — The 60-Second Problem
// ===================================================================
function SlideProblem() {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 text-center">
        The 60-Second Problem
      </h2>
      <p className="text-xl md:text-2xl text-slate-300 mb-12 text-center max-w-3xl mx-auto leading-relaxed">
        Every AI agent has <span className="text-white font-semibold">hundreds of valid configurations</span>. The one you pick decides:
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 border border-red-500/30 rounded-2xl p-8 text-center">
          <div className="text-4xl md:text-5xl font-bold text-red-400 mb-3">$10k → $100k</div>
          <p className="text-slate-400 text-base">Whether your monthly LLM bill is sustainable</p>
        </div>
        <div className="bg-slate-900/60 border border-red-500/30 rounded-2xl p-8 text-center">
          <div className="text-4xl md:text-5xl font-bold text-red-400 mb-3">70% vs 95%</div>
          <p className="text-slate-400 text-base">Whether accuracy is excellent or embarrassing</p>
        </div>
        <div className="bg-slate-900/60 border border-red-500/30 rounded-2xl p-8 text-center">
          <div className="text-4xl md:text-5xl font-bold text-red-400 mb-3">Weeks vs Months</div>
          <p className="text-slate-400 text-base">Whether your engineers ship fast or stall</p>
        </div>
      </div>
      <p className="mt-12 text-xl md:text-2xl text-slate-300 text-center">
        Today most teams pick on <span className="text-white font-semibold">gut feel</span>. Ship anyway. Find out in production.
      </p>
    </div>
  );
}

// ===================================================================
// Slide 3 — Killer stat (convergence visualization + table)
// ===================================================================
function SlideStat() {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-3 text-center" style={{ textWrap: "balance" }}>
        Find the Best Configuration in <span style={{ color: BLUE }}>Hours, Not Weeks</span>
      </h2>
      <p className="text-lg md:text-xl text-slate-400 mb-8 text-center">
        Traigent's optimization engine converges to the optimum in <span className="text-white font-semibold">under 10%</span> of the experiments.
      </p>

      <ConvergenceDiagram className="w-full max-w-5xl mx-auto mb-8" />
      <KillerStatsGrid />
    </div>
  );
}

// ===================================================================
// Slide 4 — Social proof
// ===================================================================
function SlideCustomers() {
  const customers = ["Bazak", "iForAI", "Cloudzone", "Profisea", "Yotpo"];
  return (
    <div className="text-center max-w-5xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
        Customers
      </h2>
      <p className="text-lg md:text-xl text-slate-400 mb-16">
        Customers across telecom, retail, cloud, and AI services
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-12 gap-x-8">
        {customers.map((c) => (
          <div key={c} className="text-3xl md:text-4xl font-semibold text-slate-200">{c}</div>
        ))}
      </div>
      <p className="mt-20 text-base text-slate-500 italic">
        Optimizing real production agents today.
      </p>
    </div>
  );
}

// ===================================================================
// Slide 5 — Three products in one
// ===================================================================
function SlideThreeProducts() {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
        Three Products In One
      </h2>
      <p className="text-lg md:text-xl text-slate-400 mb-12 text-center max-w-3xl mx-auto">
        What you'd otherwise pay <span className="text-white font-semibold">three vendors</span> for — included by default
      </p>
      <ThreeProductsGrid />
      <p className="mt-12 text-lg text-slate-300 text-center" style={{ textWrap: "balance" }}>
        <span className="text-white font-semibold">Optimization needs traces and benchmarks to work.</span> That's why Traigent ships them in one platform — not three.
      </p>
    </div>
  );
}

// ===================================================================
// Slide 6 — CTA / Next step
// ===================================================================
function SlideCTA() {
  return (
    <div className="text-center max-w-5xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
        Two Ways to See It in 15 Minutes
      </h2>
      <p className="text-lg text-slate-400 mb-12">Pick whichever fits your week.</p>

      <div className="grid md:grid-cols-2 gap-6 mb-16">
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-8 text-left">
          <div className="text-sm font-mono text-slate-500 mb-3">OPTION 1</div>
          <h3 className="text-2xl font-bold text-white mb-4">Run the keyless demo</h3>
          <p className="text-slate-400 mb-5 text-sm">No API keys. No spend. ~6 seconds to a real result.</p>
          <div className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 font-mono text-sm text-slate-200 break-all">
            <span className="text-slate-500">$ </span>
            uv tool install "traigent[recommended]" &&<br/>
            <span className="ml-4">traigent quickstart</span>
          </div>
        </div>
        <div className="bg-slate-900/60 border-2 rounded-2xl p-8 text-left" style={{ borderColor: BLUE }}>
          <div className="text-sm font-mono mb-3" style={{ color: BLUE }}>OPTION 2</div>
          <h3 className="text-2xl font-bold text-white mb-4">Book a 15-min call</h3>
          <p className="text-slate-400 mb-5 text-sm">We'll walk through your agent and show you what's possible.</p>
          <a
            href="https://meetings-eu1.hubspot.com/amir8"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-white px-6 py-3 rounded-lg font-medium text-base hover:opacity-90 transition-opacity"
            style={{ backgroundColor: BLUE }}
          >
            Book a meeting →
          </a>
        </div>
      </div>

      <div className="text-2xl md:text-3xl font-bold text-white" style={{ textWrap: "balance" }}>
        Better agents. Lower spend. <span style={{ color: BLUE }}>Higher confidence.</span>
      </div>
      <p className="mt-4 text-slate-500 font-mono text-sm">amir@traigent.ai · traigent.ai</p>
    </div>
  );
}

// ===================================================================
// Slide registry — edit this array to add / reorder slides.
// ===================================================================
const slides = [
  { title: "Hook", component: SlideHook },
  { title: "The 60-Second Problem", component: SlideProblem },
  { title: "Hours, Not Weeks", component: SlideStat },
  { title: "Customers", component: SlideCustomers },
  { title: "Three Products In One", component: SlideThreeProducts },
  { title: "Two Ways to See It", component: SlideCTA },
];

// ===================================================================
// Deck shell — keyboard nav, fullscreen, transitions.
// ===================================================================
export default function Pitch() {
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
      } else if (/^[1-9]$/.test(e.key)) {
        goTo(parseInt(e.key, 10) - 1);
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
  // they cover the bottom-right Next control. CSS-hide is bulletproof against
  // HubSpot's own DOM re-injection; restored when this slide unmounts.
  useEffect(() => {
    const style = document.createElement("style");
    style.dataset.pitchHideHubspot = "";
    style.textContent =
      "#hubspot-messages-iframe-container, .hs-banner-iframe, #hs-eu-cookie-confirmation { display: none !important; }";
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  const Current = slides[current].component;

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#080808] text-white overflow-hidden">
      <Helmet>
        <title>Traigent — Agent Optimization Platform</title>
      </Helmet>
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-4 md:p-6">
        <Link to="/" className="text-slate-500 hover:text-white text-sm flex items-center gap-2 transition-colors">
          <Home className="w-4 h-4" />
          <span className="hidden md:inline">Home</span>
        </Link>
        <span className="text-slate-500 text-sm font-mono">
          {current + 1} / {total}
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

        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === current ? "w-8 bg-[#1A6BF5]" : "w-2 bg-slate-700 hover:bg-slate-500"
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

      {/* Keyboard hint (subtle, bottom-right corner) */}
      <div className="hidden md:block absolute bottom-16 right-6 text-slate-700 text-xs font-mono z-10">
        ← → space · F fullscreen · 1–6 jump
      </div>
    </div>
  );
}
