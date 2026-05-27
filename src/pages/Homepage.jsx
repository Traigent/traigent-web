import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, ChevronRight, ChevronDown, ExternalLink, Play, Pause, Sparkles, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import versionInfo from "../version.json";
import { Helmet } from "react-helmet-async";
import OptimizationTable from "../components/OptimizationTable";
import StartNowModal from "../components/StartNowModal";
import ContactSection from "../components/ContactSection";
import BlogHighlights from "../components/BlogHighlights";
import { trackEvent } from "../lib/analytics";

// Placeholder for the Button component
const Button = ({ children, className, onClick, size }) => (
  <button
    className={`inline-flex items-center justify-center font-medium ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

// Placeholder for the createPageUrl function
const createPageUrl = (path) => path;
const PORTAL_URL = "https://portal.traigent.ai";

// Reusable animated wrapper to reduce duplication
const FadeInView = ({ children, className, delay = 0, direction = "y" }) => (
  <motion.div
    initial={{ opacity: 0, [direction]: 20 }}
    whileInView={{ opacity: 1, [direction]: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export default function Homepage() {
  const [showStartNow, setShowStartNow] = useState(false);
  const [benefitsOpen, setBenefitsOpen] = useState(false);
  const benefitsRef = useRef(null);
  // Handle scroll requests coming from other pages via TopNav
  useEffect(() => {
    const pending = sessionStorage.getItem("pendingScroll");
    if (pending) {
      sessionStorage.removeItem("pendingScroll");
      setTimeout(() => {
        document.getElementById(pending)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, []);
  // Close the 'Benefits quantified and explained' dropdown on outside click / Esc
  useEffect(() => {
    if (!benefitsOpen) return;
    function onDocClick(e) {
      if (benefitsRef.current && !benefitsRef.current.contains(e.target)) setBenefitsOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape") setBenefitsOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [benefitsOpen]);
  return (
    <div className="bg-white">
      <Helmet>
        <title>Traigent — Agent Optimization Platform</title>
        <meta name="description" content="Rapidly finds Low Cost and High Accuracy options among thousands possible." />
        <meta property="og:title" content="Traigent — AI Agent Optimization Platform" />
        <meta property="og:description" content="Rapidly finds Low Cost and High Accuracy options among thousands possible." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://traigent.ai" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Traigent — AI Agent Optimization Platform" />
        <meta name="twitter:description" content="Rapidly finds Low Cost and High Accuracy options among thousands possible." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Traigent",
            url: "https://traigent.ai",
            description: "The most advanced AI Agent Optimization Platform on the market.",
            sameAs: [
              "https://github.com/Traigent/Traigent",
            ],
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Traigent",
            applicationCategory: "DeveloperApplication",
            description: "AI Agent Optimization Platform — optimization, benchmark evolution, and observability in one.",
            offers: { "@type": "Offer", priceCurrency: "USD" },
            operatingSystem: "Cross-platform",
          })}
        </script>
      </Helmet>
      {showStartNow && <StartNowModal onClose={() => setShowStartNow(false)} />}
      {/* Hero Section */}
      <section className="relative overflow-x-clip bg-[#080808] text-white">
        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-60 pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`
        }}></div>
        {/* Blue gradient glow */}
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] pointer-events-none" style={{
          background: 'radial-gradient(ellipse, rgba(26,107,245,0.18) 0%, transparent 70%)'
        }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-14 pb-6 md:pb-8">
          {/* Traigent Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 text-center"
          >
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/057ce2_TraigentLogoWhiteCropped.png"
              alt="Traigent Logo"
              className="h-16 md:h-20 lg:h-24 w-auto mx-auto"
            />
          </motion.div>

          {/* Centered hero content */}
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6"
              style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.03em' }}
            >
              <span className="whitespace-nowrap">AI Agent <span className="text-[#1A6BF5]">Cost-Performance</span></span><br/>
              Optimized. <span className="text-[#1A6BF5]">Automatically.</span>
            </motion.h1>
            {/* Two-column value summary: HOW (method) + BENEFITS (outcomes) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid md:grid-cols-2 gap-5 md:gap-6 max-w-4xl mx-auto mb-6 text-left"
            >
              {/* Left — how Traigent finds the optimum */}
              <div className="bg-slate-900/50 border-2 rounded-2xl p-6 md:p-7" style={{ borderColor: "rgba(26, 107, 245, 0.35)" }}>
                <a
                  href="#product"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("product")?.scrollIntoView({ behavior: "smooth", block: "start" });
                    trackEvent("hero_aop_chip_clicked", { destination: "product" });
                  }}
                  className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-[10px] md:text-[11px] font-mono tracking-widest hover:bg-blue-500/20 hover:border-blue-500/60 transition-colors mb-4"
                  style={{ color: "#4D8EF8" }}
                >
                  AGENT OPTIMIZATION PLATFORM
                </a>
                <ul className="space-y-3">
                  {[
                    <><span className="text-white font-semibold underline underline-offset-4 decoration-2 decoration-[#4D8EF8]/70">Finds the optimal model and configuration combo</span> in <span className="text-white font-semibold">hours, not weeks</span>.</>,
                    <><span className="font-semibold" style={{ color: "#f59e0b" }}>Low Cost</span> with <span className="font-semibold" style={{ color: "#4D8EF8" }}>High Accuracy</span>.</>,
                    <><span className="text-white font-semibold">Automatically</span>, not manually.</>,
                    <>With <span className="text-white font-semibold">confidence</span>, not guesswork.</>,
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-slate-300 leading-snug">
                      <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#4D8EF8]" strokeWidth={3} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right — what you get out of it */}
              <div className="bg-gradient-to-br from-blue-500/10 to-slate-900/0 border-2 rounded-2xl p-6 md:p-7" style={{ borderColor: "#1A6BF5" }}>
                <span
                  className="inline-block px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/40 text-[10px] md:text-[11px] font-mono tracking-widest mb-4"
                  style={{ color: "#4D8EF8" }}
                >
                  TRAIGENT BENEFITS
                </span>
                <ul className="space-y-3">
                  {[
                    {
                      content: <><span className="text-white font-semibold">Reduces engineering costs.</span></>,
                      to: "/ttm",
                      linkLabel: "TTM calc",
                    },
                    {
                      content: <><span className="text-white font-semibold">Saves LLM costs</span> over the lifecycle.</>,
                      to: "/roi",
                      linkLabel: "ROI calc",
                    },
                    {
                      content: <><span className="text-white font-semibold">Shortens time to market.</span></>,
                    },
                    {
                      content: <><span className="text-white font-semibold">Increases confidence</span> significantly.</>,
                    },
                  ].map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-slate-300 leading-snug">
                      <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#4D8EF8]" strokeWidth={3} />
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
                {/* Benefits dropdown — at bottom of Benefits card */}
                <div ref={benefitsRef} className="relative mt-5 pt-4 border-t border-blue-500/30 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setBenefitsOpen((v) => !v);
                      trackEvent("hero_benefits_dropdown_toggled", { open: !benefitsOpen });
                    }}
                    aria-haspopup="menu"
                    aria-expanded={benefitsOpen}
                    className="group inline-flex items-center gap-1.5 text-base md:text-lg transition-colors"
                    style={{ color: "#4D8EF8" }}
                  >
                    <span className="underline underline-offset-4 decoration-[#4D8EF8]/50 group-hover:decoration-[#4D8EF8] font-semibold">
                      Benefits explained
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${benefitsOpen ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                  {benefitsOpen && (
                    <div
                      role="menu"
                      className="absolute left-1/2 -translate-x-1/2 mt-2 w-[min(92vw,640px)] z-30 bg-slate-950 border border-slate-700 rounded-xl shadow-2xl overflow-hidden text-left grid grid-cols-1 md:grid-cols-2 md:divide-x md:divide-slate-800"
                    >
                    {/* Left column — calculators */}
                    <div>
                      <div className="px-4 pt-3 pb-1 text-[10px] font-mono uppercase tracking-widest text-slate-500">
                        See it on your numbers
                      </div>
                      <Link
                        to="/roi"
                        role="menuitem"
                        onClick={() => {
                          setBenefitsOpen(false);
                          trackEvent("hero_roi_hook_clicked", { destination: "roi" });
                        }}
                        className="block px-4 py-3 text-sm text-slate-200 hover:bg-slate-900 hover:text-white border-b border-slate-800 transition-colors"
                      >
                        <div className="font-semibold text-[#4D8EF8]">ROI Calculator</div>
                        <div className="text-xs text-slate-400 mt-0.5">12-month savings</div>
                      </Link>
                      <Link
                        to="/ttm"
                        role="menuitem"
                        onClick={() => {
                          setBenefitsOpen(false);
                          trackEvent("hero_ttm_hook_clicked", { destination: "ttm" });
                        }}
                        className="block px-4 py-3 text-sm text-slate-200 hover:bg-slate-900 hover:text-white transition-colors"
                      >
                        <div className="font-semibold text-[#4D8EF8]">TTM Calculator</div>
                        <div className="text-xs text-slate-400 mt-0.5">Engineering time saved</div>
                      </Link>
                    </div>

                    {/* Right column — reading */}
                    <div className="border-t border-slate-800 md:border-t-0">
                      <div className="px-4 pt-3 pb-1 text-[10px] font-mono uppercase tracking-widest text-slate-500">
                        Read more
                      </div>
                      <Link
                        to="/blog/the-business-case"
                        role="menuitem"
                        onClick={() => {
                          setBenefitsOpen(false);
                          trackEvent("hero_skeptic_hook_clicked", { destination: "the-business-case" });
                        }}
                        className="block px-4 py-3 text-sm text-slate-200 hover:bg-slate-900 hover:text-white border-b border-slate-800 transition-colors"
                      >
                        <div className="font-semibold text-[#4D8EF8]">The business case</div>
                        <div className="text-xs text-slate-400 mt-0.5">Quantified savings, the math behind ROI.</div>
                      </Link>
                      <Link
                        to="/value-proposition"
                        role="menuitem"
                        onClick={() => {
                          setBenefitsOpen(false);
                          trackEvent("hero_problem_hook_clicked", { destination: "value-proposition" });
                        }}
                        className="block px-4 py-3 text-sm text-slate-200 hover:bg-slate-900 hover:text-white border-b border-slate-800 transition-colors"
                      >
                        <div className="font-semibold text-[#4D8EF8]">The problem we solve</div>
                        <div className="text-xs text-slate-400 mt-0.5">The 6-truth chain that leads to Traigent.</div>
                      </Link>
                      <Link
                        to="/blog"
                        role="menuitem"
                        onClick={() => {
                          setBenefitsOpen(false);
                          trackEvent("hero_blog_hook_clicked", { destination: "blog" });
                        }}
                        className="block px-4 py-3 text-sm text-slate-200 hover:bg-slate-900 hover:text-white transition-colors"
                      >
                        <div className="font-semibold text-[#4D8EF8]">Why Traigent</div>
                        <div className="text-xs text-slate-400 mt-0.5">Deeper reading: model myth, eval trap, more.</div>
                      </Link>
                    </div>
                  </div>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.28 }}
              className="mb-12 flex flex-wrap justify-center gap-3"
            >
              <Link
                to={createPageUrl("/get-started")}
                onClick={() => trackEvent("hero_get_started_clicked", { destination: "get-started" })}
                className="inline-flex items-center justify-center bg-white text-slate-950 hover:bg-slate-100 px-5 py-3 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"
              >
                Get started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a
                href={PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("portal_opened", { location: "hero" })}
                className="inline-flex items-center justify-center border border-blue-400/70 text-white hover:bg-blue-500/15 px-5 py-3 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"
              >
                Open portal
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </motion.div>

            {/* Design Partners & Early Adopters */}
            <motion.div
              id="customers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-12 scroll-mt-20"
            >
              <p className="text-center text-xs text-slate-500 uppercase tracking-widest font-medium mb-6">Customers</p>
              <div className="relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#080808] to-transparent z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#080808] to-transparent z-10"></div>
                <div className="flex gap-12 items-center animate-scroll" style={{ width: 'max-content', animation: 'scroll 40s linear infinite' }}>
                  {/* 8 copies of the 5-logo set so total content is always wide
                      enough to keep the right half filled on large viewports.
                      The animation translates -50% (= 4 copies), which lands
                      on the visually-identical 5th copy → seamless loop. */}
                  {[...Array(8)].map((_, setIndex) => (
                    <React.Fragment key={setIndex}>
                      <div className="text-slate-500 text-sm font-semibold whitespace-nowrap">Bazak</div>
                      <div className="text-slate-500 text-sm font-semibold whitespace-nowrap">iForAI</div>
                      <div className="text-slate-500 text-sm font-semibold whitespace-nowrap">Cloudzone</div>
                      <div className="text-slate-500 text-sm font-semibold whitespace-nowrap">Profisea</div>
                      <div className="text-slate-500 text-sm font-semibold whitespace-nowrap">Yotpo</div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <style>{`
                @keyframes scroll {
                  from { transform: translateX(0); }
                  to { transform: translateX(-50%); }
                }
              `}</style>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Two Components Section */}
      <section id="product" className="pt-8 md:pt-12 pb-24 bg-[#080808] border-t border-slate-800/50 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            id="optimization"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 scroll-mt-20"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Agent Optimization Platform</h2>
            <p className="text-xl md:text-2xl font-semibold text-[#1A6BF5] mb-6 max-w-xl mx-auto leading-snug" style={{ textWrap: 'balance' }}>
              Fully automated. Needs only a fraction of the model and configuration combinations to experiment with.
            </p>
            <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Two components working in a tight feedback loop — an <span className="text-white font-semibold">optimization engine</span> that picks the next best configuration based on run history, and an <span className="text-white font-semibold">agent wrapper</span> that runs it against your benchmark and reports KPIs back to the optimization engine.
            </p>
          </motion.div>
          <div className="flex flex-col gap-6 items-stretch lg:grid lg:grid-cols-[1fr_180px_1fr] lg:gap-6">

            {/* Left: Optimization Engine (component 2) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex-1 bg-slate-900/60 border border-slate-700/50 rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-lg font-bold text-white">Optimization Engine</h3>
              </div>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Learns from previous model and configuration combo results and determines the next best combination to test.
              </p>
              <svg viewBox="0 0 320 260" className="w-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <marker id="optArrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
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
                <line x1="96" y1="90" x2="118" y2="90" stroke="#1A6BF5" strokeWidth="1.5" markerEnd="url(#optArrow)"/>
                <rect x="118" y="58" width="76" height="64" rx="10" fill="#1A6BF5" fillOpacity="0.12" stroke="#1A6BF5" strokeWidth="1.5"/>
                <text x="156" y="88" textAnchor="middle" fill="#93c5fd" fontSize="8.5" fontFamily="monospace">Optimizer</text>
                <text x="156" y="110" textAnchor="middle" fill="#1A6BF5" fontSize="20">⚙</text>
                <line x1="194" y1="90" x2="216" y2="90" stroke="#1A6BF5" strokeWidth="1.5" markerEnd="url(#optArrow)"/>
                <rect x="216" y="55" width="96" height="70" rx="8" fill="#1e293b" stroke="#1A6BF5" strokeWidth="1" strokeDasharray="4,2"/>
                <text x="264" y="74" textAnchor="middle" fill="#93c5fd" fontSize="8.5" fontFamily="monospace">Next Combo</text>
                <line x1="224" y1="79" x2="304" y2="79" stroke="#1A6BF5" strokeWidth="0.5" strokeOpacity="0.4"/>
                <text x="264" y="92" textAnchor="middle" fill="#60a5fa" fontSize="8" fontFamily="monospace">o3-mini</text>
                <text x="264" y="104" textAnchor="middle" fill="#60a5fa" fontSize="8" fontFamily="monospace">temp: 0.2</text>
                <text x="264" y="116" textAnchor="middle" fill="#60a5fa" fontSize="8" fontFamily="monospace">top_p: 0.85</text>

                {/* Chart background */}
                <rect x="28" y="145" width="280" height="88" rx="4" fill="#0f172a"/>
                {/* Axes */}
                <line x1="36" y1="225" x2="304" y2="225" stroke="#334155" strokeWidth="0.8"/>
                <line x1="36" y1="148" x2="36" y2="225" stroke="#334155" strokeWidth="0.8"/>
                {/* "Not needed" shaded zone */}
                <rect x="204" y="148" width="104" height="77" fill="#1e293b" fillOpacity="0.8"/>
                {/* Gray dots representing untried combinations */}
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
                {/* Separator line */}
                <line x1="204" y1="148" x2="204" y2="225" stroke="#1A6BF5" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="3,2"/>
                {/* Optimal horizontal dashed line */}
                <line x1="36" y1="164" x2="204" y2="164" stroke="#4ade80" strokeWidth="0.8" strokeDasharray="3,2" strokeOpacity="0.5"/>
                {/* Convergence curve */}
                <path d="M 50 222 C 72 210, 92 196, 114 181 S 154 169, 174 165 S 192 164, 204 164" stroke="#1A6BF5" strokeWidth="2" fill="none"/>
                {/* Experiment dots */}
                <circle cx="50" cy="222" r="3" fill="#1A6BF5"/>
                <circle cx="74" cy="209" r="3" fill="#1A6BF5"/>
                <circle cx="96" cy="195" r="3" fill="#1A6BF5"/>
                <circle cx="118" cy="181" r="3" fill="#1A6BF5"/>
                <circle cx="140" cy="171" r="3" fill="#1A6BF5"/>
                <circle cx="160" cy="166" r="3" fill="#1A6BF5"/>
                <circle cx="180" cy="164" r="3" fill="#1A6BF5"/>
                <circle cx="204" cy="164" r="4" fill="#4ade80"/>
                {/* Labels */}
                <text x="172" y="159" textAnchor="middle" fill="#4ade80" fontSize="7" fontFamily="monospace">✓ optimal</text>
                <text x="30" y="152" fill="#475569" fontSize="7" fontFamily="monospace">KPI ↑</text>
                <text x="120" y="238" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">tested (under 10%)</text>
                <text x="254" y="238" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="monospace">not needed</text>
              </svg>
              <p className="text-slate-400 text-sm text-center mt-3">Finds the optimum needing only a fraction of the model and configuration combinations to experiment with</p>
            </motion.div>

            {/* Center: feedback loop connector */}
            <div className="flex lg:flex-col items-center justify-center gap-3 py-4 lg:py-0 lg:min-w-[180px]">
              <span className="text-[#1A6BF5] text-base font-semibold font-mono whitespace-nowrap">next combo</span>
              <svg width="160" height="94" viewBox="0 0 160 94" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                {/* Top arrow: points RIGHT */}
                <line x1="4" y1="14" x2="142" y2="14" stroke="#1A6BF5" strokeWidth="3" strokeLinecap="round"/>
                <polygon points="140,6 156,14 140,22" fill="#1A6BF5"/>
                {/* Bottom arrow: points LEFT — exact horizontal mirror of the top */}
                <line x1="18" y1="80" x2="156" y2="80" stroke="#1A6BF5" strokeWidth="3" strokeLinecap="round"/>
                <polygon points="20,72 4,80 20,88" fill="#1A6BF5"/>
              </svg>
              <span className="text-[#1A6BF5] text-base font-semibold font-mono whitespace-nowrap">KPI results</span>
            </div>

            {/* Right: Agent Wrapper (component 1) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-1 bg-slate-900/60 border border-slate-700/50 rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-lg font-bold text-white">Agent Wrapper</h3>
              </div>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Executes a given model and configuration on the benchmark test bed and measures agent KPIs.
              </p>
              <svg viewBox="0 0 320 260" className="w-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <marker id="wrapArrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="#475569"/>
                  </marker>
                  <marker id="wrapArrowBlue" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="#1A6BF5"/>
                  </marker>
                </defs>
                {/* Wrapper dashed border */}
                <rect x="8" y="18" width="304" height="235" rx="12" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="6,3"/>
                <text x="20" y="32" fill="#475569" fontSize="8.5" fontFamily="monospace">[ Agent Wrapper ]</text>
                {/* Model box — blue dashed = injected combo */}
                <rect x="14" y="40" width="68" height="26" rx="6" fill="#1e293b" stroke="#1A6BF5" strokeWidth="1" strokeDasharray="3,2"/>
                <text x="48" y="51" textAnchor="middle" fill="#64748b" fontSize="7.5" fontFamily="monospace">Model</text>
                <text x="48" y="61" textAnchor="middle" fill="#60a5fa" fontSize="8" fontFamily="monospace">o3-mini</text>
                {/* Config box — blue dashed = injected combo */}
                <rect x="14" y="76" width="68" height="40" rx="6" fill="#1e293b" stroke="#1A6BF5" strokeWidth="1" strokeDasharray="3,2"/>
                <text x="48" y="89" textAnchor="middle" fill="#64748b" fontSize="7.5" fontFamily="monospace">Config</text>
                <text x="48" y="101" textAnchor="middle" fill="#94a3b8" fontSize="7.5" fontFamily="monospace">temp: 0.2</text>
                <text x="48" y="111" textAnchor="middle" fill="#94a3b8" fontSize="7.5" fontFamily="monospace">top_p: 0.85</text>
                {/* Arrows Model/Config → Execute */}
                <line x1="82" y1="53" x2="104" y2="70" stroke="#475569" strokeWidth="1.2" markerEnd="url(#wrapArrow)"/>
                <line x1="82" y1="96" x2="104" y2="84" stroke="#475569" strokeWidth="1.2" markerEnd="url(#wrapArrow)"/>
                {/* Execute box */}
                <rect x="104" y="57" width="72" height="48" rx="8" fill="#1A6BF5" fillOpacity="0.12" stroke="#1A6BF5" strokeWidth="1.5"/>
                <text x="140" y="74" textAnchor="middle" fill="#93c5fd" fontSize="8" fontFamily="monospace">Execute Agent</text>
                <text x="140" y="95" textAnchor="middle" fill="#1A6BF5" fontSize="16">▶</text>
                {/* Arrow Execute ↓ Test Bed */}
                <line x1="140" y1="105" x2="140" y2="147" stroke="#1A6BF5" strokeWidth="1.5" markerEnd="url(#wrapArrowBlue)"/>
                {/* Benchmark Test Bed box */}
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
                {/* Arrow Test Bed → KPIs */}
                <line x1="202" y1="191" x2="212" y2="191" stroke="#1A6BF5" strokeWidth="1.5" markerEnd="url(#wrapArrowBlue)"/>
                {/* KPI outputs */}
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
                {/* Secondary differentiator: benchmark insights — amber */}
                <line x1="20" y1="241" x2="300" y2="241" stroke="#f59e0b" strokeWidth="0.5" strokeOpacity="0.35" strokeDasharray="2,2"/>
                <text x="20" y="250" fill="#f59e0b" fontSize="7" fontFamily="monospace" fontWeight="bold">+ benchmark insights:</text>
                <text x="112" y="250" fill="#f59e0b" fontSize="7" fontFamily="monospace">⊘ easy</text>
                <text x="155" y="250" fill="#f59e0b" fontSize="7" fontFamily="monospace">⨯ always-fail</text>
                <text x="218" y="250" fill="#f59e0b" fontSize="7" fontFamily="monospace">↻ redundant</text>
              </svg>
              <p className="text-slate-400 text-sm text-center mt-3">Automated injection of model and configurations allows Optimizer to run successive tests seamlessly</p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Beyond Optimization — Secondary Differentiators */}
      <section id="capabilities" className="py-20 bg-[#080808] border-t border-slate-800/50 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            id="beyond"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 scroll-mt-20"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Beyond Optimization</h2>
            <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Running across your benchmark hundreds of times unlocks two more capabilities competitors can't match — a self-improving benchmark and full-blown observability built in.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 items-stretch">

            {/* Card 1: Self-Improving Benchmark */}
            <motion.div
              id="benchmark"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-slate-900/60 border border-amber-500/30 rounded-2xl p-8 scroll-mt-24"
            >
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
            </motion.div>

            {/* Card 2: Full Observability & Tracing */}
            <motion.div
              id="observability"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-slate-900/60 border border-amber-500/30 rounded-2xl p-8 scroll-mt-24"
            >
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
                {/* Trace panel background */}
                <rect x="4" y="4" width="312" height="192" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1"/>
                {/* Header */}
                <text x="14" y="22" fill="#f59e0b" fontSize="9" fontFamily="monospace" fontWeight="bold">Trace</text>
                <text x="40" y="22" fill="#64748b" fontSize="8.5" fontFamily="monospace">· agent_run_42</text>
                <text x="306" y="22" textAnchor="end" fill="#4ade80" fontSize="8.5" fontFamily="monospace">1.24s ✓</text>
                <line x1="14" y1="30" x2="306" y2="30" stroke="#334155" strokeWidth="0.5"/>

                {/* Root span */}
                <text x="14" y="46" fill="#93c5fd" fontSize="8" fontFamily="monospace">▾ agent_run</text>
                <rect x="170" y="40" width="120" height="8" rx="2" fill="#1A6BF5" fillOpacity="0.45"/>
                <text x="296" y="46" textAnchor="end" fill="#64748b" fontSize="7" fontFamily="monospace">1240ms</text>

                {/* Child: retrieve_context */}
                <text x="22" y="62" fill="#94a3b8" fontSize="8" fontFamily="monospace">├─ retrieve_context</text>
                <rect x="170" y="56" width="18" height="8" rx="2" fill="#a78bfa" fillOpacity="0.65"/>
                <text x="296" y="62" textAnchor="end" fill="#64748b" fontSize="7" fontFamily="monospace">180ms</text>

                {/* Grandchild: vector_search */}
                <text x="36" y="76" fill="#64748b" fontSize="7" fontFamily="monospace">└─ vector_search · top_k=8</text>
                <rect x="170" y="71" width="13" height="6" rx="1.5" fill="#a78bfa" fillOpacity="0.4"/>
                <text x="296" y="76" textAnchor="end" fill="#475569" fontSize="6.5" fontFamily="monospace">120ms</text>

                {/* Child: llm_call */}
                <text x="22" y="92" fill="#94a3b8" fontSize="8" fontFamily="monospace">├─ llm_call · gpt-4o-mini</text>
                <rect x="188" y="86" width="74" height="8" rx="2" fill="#60a5fa" fillOpacity="0.65"/>
                <text x="296" y="92" textAnchor="end" fill="#64748b" fontSize="7" fontFamily="monospace">740ms</text>

                {/* tokens / cost info */}
                <text x="36" y="106" fill="#475569" fontSize="7" fontFamily="monospace">tokens: 312 in · 89 out</text>
                <text x="296" y="106" textAnchor="end" fill="#facc15" fontSize="7" fontFamily="monospace">$0.0006</text>

                {/* Child: evaluator */}
                <text x="22" y="122" fill="#94a3b8" fontSize="8" fontFamily="monospace">└─ evaluator</text>
                <rect x="262" y="116" width="32" height="8" rx="2" fill="#4ade80" fillOpacity="0.55"/>
                <text x="296" y="122" textAnchor="end" fill="#64748b" fontSize="7" fontFamily="monospace">320ms</text>
                <text x="36" y="136" fill="#4ade80" fontSize="7" fontFamily="monospace">score: 0.92 ✓</text>

                {/* Timeline divider */}
                <line x1="14" y1="148" x2="306" y2="148" stroke="#334155" strokeWidth="0.5" strokeDasharray="2,2"/>

                {/* Mini Gantt timeline */}
                <text x="14" y="161" fill="#f59e0b" fontSize="7" fontFamily="monospace" fontWeight="bold">Timeline</text>
                <text x="306" y="161" textAnchor="end" fill="#475569" fontSize="6.5" fontFamily="monospace">0 ──── 1.24s</text>
                {/* Background track */}
                <rect x="14" y="166" width="292" height="22" rx="2" fill="#0a1424"/>
                {/* Span bars proportional to durations */}
                <rect x="14" y="169" width="282" height="4" rx="1" fill="#1A6BF5" fillOpacity="0.55"/>
                <rect x="14" y="175" width="42" height="3.5" rx="1" fill="#a78bfa" fillOpacity="0.7"/>
                <rect x="56" y="180" width="174" height="3.5" rx="1" fill="#60a5fa" fillOpacity="0.7"/>
                <rect x="230" y="185" width="72" height="3.5" rx="1" fill="#4ade80" fillOpacity="0.7"/>
              </svg>
              <p className="text-slate-400 text-sm text-center mt-3">Inspect any agent execution end-to-end · debug failures · monitor production</p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
            >
              How It Works
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Wrap",
                description: "Engineer wraps your agent with the SDK in ~1 hour. One-time. Your agent code doesn't change."
              },
              {
                step: "02",
                title: "Optimize",
                description: "The engine sweeps the model and configuration space unattended. Needs only a fraction of combinations to converge."
              },
              {
                step: "03",
                title: "Converge",
                description: "Returns the optimal model + config combo for your KPIs — cost, latency, accuracy — in hours, not weeks. With quantified confidence."
              },
              {
                step: "04",
                title: "Re-optimize",
                description: "Apply the winning config in production. Re-run automatically as models update, costs shift, or usage drifts."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative p-6 rounded-xl bg-white border border-gray-100 hover:border-indigo-100 hover:shadow-sm transition-all"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>

                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ChevronRight className="w-6 h-6 text-indigo-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Engineer-First Integration Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="min-w-0"
            >
              <span className="inline-block px-3 py-1 bg-emerald-100 rounded-full text-emerald-700 text-sm font-medium mb-4">
                Engineer-First
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                One Decorator. Instant Optimization.
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                No rewrites. Just attach to your existing agent calls, specify what you want (and your constraints), then apply the best config—no dashboard required.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-700">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  Works with OpenAI, Anthropic, Google, and more
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  Preserves your existing code structure
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  Apply the best config in production
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="min-w-0 overflow-hidden rounded-xl bg-slate-900 p-6 font-mono text-sm shadow-2xl"
            >
              <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1 text-slate-400">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-2">my_agent.py</span>
              </div>
              <div className="-mx-2 overflow-x-auto px-2">
                <SyntaxHighlighter
                  language="python"
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    padding: 0,
                    background: 'transparent',
                    fontSize: '0.875rem',
                    maxWidth: '100%',
                    overflowX: 'auto',
                    whiteSpace: 'pre',
                  }}
                  showLineNumbers={false}
                >
{`import traigent
from langchain_openai import ChatOpenAI

@traigent.optimize(
    configuration_space={
        "model": ["gpt-4o-mini", "gpt-4o"],
        "temperature": [0.1, 0.5, 0.9],
        "use_rag": [True, False],
        "top_k": [1, 2, 3],
    },
    objectives=["accuracy", "cost"],
    eval_dataset="eval.jsonl",
)
def answer_question(question: str) -> str:
    config = traigent.get_config()

    # Tuned variables from config
    model = config["model"]
    temperature = config["temperature"]
    use_rag = config["use_rag"]
    top_k = config["top_k"]

    context = retrieve_docs(question, k=top_k) if use_rag else ""

    llm = ChatOpenAI(model=model, temperature=temperature)
    return llm.invoke(f"{context}\\n\\nQ: {question}").content`}
                </SyntaxHighlighter>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Ready to Optimize Your AI Agents?
            </motion.h2>
            <p className="text-xl opacity-90 mb-10">
              See how Traigent improves your KPIs in hours, not weeks.
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-3"
            >
              <button
                onClick={() => {
                  trackEvent("start_now_clicked", { location: "cta_section" });
                  setShowStartNow(true);
                }}
                className="border border-slate-600 hover:border-slate-400 text-slate-200 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
              >
                Start Now
              </button>
              <a
                href="https://meetings-eu1.hubspot.com/amir8"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("demo_booking_clicked", { location: "cta_section" })}
                className="bg-[#1A6BF5] hover:bg-[#4D8EF8] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
              >
                Book a demo
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* From the blog — objection-handler content surfaced on the homepage */}
      <BlogHighlights />

      <ContactSection />

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
            <div>
              <div className="text-xl font-bold mb-4">Traigent</div>
              <p className="text-slate-400 mb-6 max-w-xs">
                Agent Optimization Platform. Wrap. Optimize. Converge. Re-optimize.
              </p>
              <p className="text-xs text-slate-500">
                Traigent Ltd, Hartglas 16, Tel-Aviv, Israel
              </p>
              <p className="mt-2 text-xs text-slate-500">
                <a href="mailto:support@traigent.ai" className="hover:text-white transition-colors">
                  support@traigent.ai
                </a>
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/agent-optimization" className="text-slate-400 hover:text-white transition-colors">
                    Agent Optimization
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl("/get-started")} className="text-slate-400 hover:text-white transition-colors">
                    Get started
                  </Link>
                </li>
                <li>
                  <a href="https://www.tvl-lang.org/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                    Learn TVL
                  </a>
                </li>
                <li>
                  <a href="https://github.com/Traigent/Traigent" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                    Try out our SDK - it's free!
                  </a>
                </li>
                <li>
                  <Link to="/one-pager" className="text-slate-400 hover:text-white transition-colors">
                    One Pager
                  </Link>
                </li>
                <li>
                  <Link to="/value-proposition" className="text-slate-400 hover:text-white transition-colors">
                    Value Proposition
                  </Link>
                </li>
                <li>
                  <a
                    href={`${PORTAL_URL}/pricing`}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a href={PORTAL_URL} className="text-slate-400 hover:text-white transition-colors">
                    Open portal
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href={`${PORTAL_URL}/privacy`}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href={`${PORTAL_URL}/terms`}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href={`${PORTAL_URL}/refund`}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Refund Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500">
            <p>
              © {new Date().getFullYear()} Traigent Ltd. All rights reserved.{" "}
              {/* Hidden sales-deck shortcut: right-click the dot to open /pitch-short in a new tab.
                  Looks decorative to visitors. No left-click handler. */}
              <span
                onContextMenu={(e) => {
                  e.preventDefault();
                  window.open("#/pitch-short", "_blank", "noopener,noreferrer");
                }}
                aria-hidden="true"
                title=""
                className="text-slate-700 select-none ml-2"
              >
                ▸
              </span>
            </p>
            <p></p>
            <p className="mt-2 text-slate-950 selection:bg-white selection:text-slate-900">{versionInfo.version}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
