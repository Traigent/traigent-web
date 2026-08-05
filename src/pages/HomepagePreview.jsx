import React, { useCallback, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUp, ArrowDown, Check, ChevronRight, ChevronDown, ExternalLink, Play, Pause, Terminal } from "lucide-react";
import {
  OptimizationEngineBody,
  FeedbackLoopConnector,
  AgentWrapperBody,
  BenchmarkCardBody,
  ObservabilityCardBody,
} from "../components/PlatformShowcase";
import { SlideMarketOpportunity, SlideFourPillars, SlideCustomerObjectiveSpider, SlideParetoFrontier, OptimizerRing } from "./PitchShort";
import { Link, useSearchParams } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import versionInfo from "../version.json";
import { Helmet } from "react-helmet-async";
import LeadFunnelModal from "../components/LeadFunnelModal";
import { copyFirstRunPrompt } from "../components/LeadFunnel";
import ContactSection from "../components/ContactSection";
import BlogHighlights from "../components/BlogHighlights";
import { trackEvent } from "../lib/analytics";
import {
  REGISTRATION_RECOVERY_SURFACE,
  consumeRegistrationRecoveryQuery,
} from "../lib/registrationRecovery";

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

export default function HomepagePreview() {
  const [searchParams, setSearchParams] = useSearchParams();
  // Holds WHICH entry point opened the funnel, not merely that it is open.
  // `null` = closed. Three buttons on this page open the same modal, and the
  // location has to survive the trip: the conversion that matters is the lead
  // submitted from inside the modal, and that event is attributed with whatever
  // the modal was handed. When this was a boolean the mount hardcoded
  // "homepage_hero", so every conversion — including ones from the CTA section
  // and the footer — reported as the hero and per-surface conversion could not
  // be measured at all.
  const [leadFunnelLocation, setLeadFunnelLocation] = useState(null);
  const recoveryLinkHandledRef = useRef(false);

  // One call site for both effects, so the tracked location and the modal's
  // location are the same value by construction and cannot drift apart again.
  const openLeadFunnel = useCallback((location) => {
    trackEvent("lead_funnel_opened", { location });
    copyFirstRunPrompt();
    setLeadFunnelLocation(location);
  }, []);
  const [benefitsOpen, setBenefitsOpen] = useState(false);
  const benefitsRef = useRef(null);
  // Language tab for the "One Decorator" code panel: "python" | "ts". Lets a
  // JS/TS-first visitor see the same one-call optimize() story, not just Python.
  const [codeLang, setCodeLang] = useState("python");

  // The portal uses this canonical HashRouter query when a registration code
  // needs replacing. Consume only the exact value, keep unrelated campaign
  // parameters, and replace history so closing/reloading does not reopen it.
  useEffect(() => {
    const { shouldOpen, remaining } =
      consumeRegistrationRecoveryQuery(searchParams);
    if (!shouldOpen) {
      recoveryLinkHandledRef.current = false;
      return;
    }
    if (recoveryLinkHandledRef.current) return;

    recoveryLinkHandledRef.current = true;
    openLeadFunnel(REGISTRATION_RECOVERY_SURFACE);
    setSearchParams(remaining, { replace: true });
  }, [openLeadFunnel, searchParams, setSearchParams]);

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
        <meta name="description" content="Rapidly finds High Accuracy and Low Cost yielding configurations among thousands possible." />
        <meta property="og:title" content="Traigent — AI Agent Optimization Platform" />
        <meta property="og:description" content="Rapidly finds High Accuracy and Low Cost yielding configurations among thousands possible." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://traigent.ai" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Traigent — AI Agent Optimization Platform" />
        <meta name="twitter:description" content="Rapidly finds High Accuracy and Low Cost yielding configurations among thousands possible." />
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
      {/* `!== null`, not truthiness: an empty-string location would otherwise
          track an open event while never rendering the modal. */}
      {leadFunnelLocation !== null && (
        <LeadFunnelModal onClose={() => setLeadFunnelLocation(null)} location={leadFunnelLocation} />
      )}
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
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-10 pb-2 md:pb-3">
          {/* Centered hero content */}
          <div className="text-center max-w-7xl mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="whitespace-nowrap font-bold text-slate-100 leading-[1.15] tracking-tight mb-6"
              style={{ fontSize: 'clamp(1rem, 4.5vw, 3.6rem)', letterSpacing: '-0.02em' }}
            >
              Evolving <span className="text-[#4D8EF8]">Optimized</span> <span className="text-white">AI Agents</span>
            </motion.p>
            {/* Hero CTA row — ONE journey start.
                "Start evolving your agent" opens the lead funnel (email -> 6-digit
                confirmation code -> emailed access code -> portal registration)
                and carries the treasure
                halo, which is the only such cue on the site: a first-time
                visitor must not have to work out which control begins the
                journey. The keyless copy-prompt that used to sit here has been
                removed on purpose - the setup prompt belongs AFTER the address
                is confirmed (it is offered on the funnel's success screen), and
                a second prominent button beside the entry point is exactly the
                confusion the halo exists to remove. */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.19 }}
              className="flex flex-wrap items-center justify-center gap-3 mb-10"
            >
              {/* THE journey start. Everything downstream - the confirmation
                  code, the emailed access code, portal registration, the API
                  key - begins with this one click. */}
              <button
                type="button"
                onClick={() => {
                  openLeadFunnel("homepage_hero");
                }}
                className="treasure-halo inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#1A6BF5] hover:bg-[#4D8EF8] text-white text-base md:text-lg font-semibold transition-colors"
              >
                <Terminal className="w-5 h-5" />
                Start evolving your agent
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                to="/story"
                onClick={() => trackEvent("hero_video_clicked", { destination: "story" })}
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-slate-900/60 border border-slate-700 hover:border-blue-500/60 hover:bg-slate-900/80 transition-colors group"
              >
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1A6BF5] group-hover:bg-[#4D8EF8] transition-colors shadow-lg shadow-blue-500/30">
                  <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                </span>
                <span className="text-base md:text-lg font-medium text-slate-100">
                  Agent Optimization Demo
                </span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="mt-8 max-w-6xl mx-auto text-center"
            >
              <p className="text-slate-400 text-lg md:text-xl mb-6">
                Others just observe, measure, and test agents. Traigent improves the agent itself.
              </p>
              <p className="text-white text-xl md:text-3xl font-semibold mb-5 md:whitespace-nowrap">
                Traigent <span className="text-[#4D8EF8]">evolves</span> agents to <span className="text-[#4D8EF8]">better outcomes,</span> at <span className="text-[#4D8EF8] underline underline-offset-4">lower costs</span>
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="text-[#4D8EF8] font-medium text-lg md:text-2xl mr-1">Better</span>
                {["Accuracy", "Guardrails", "Conversion", "Resolution", "Speed"].map((kpi) => (
                  <span
                    key={kpi}
                    className="px-3 py-1 rounded-md border text-lg md:text-2xl font-medium text-white"
                    style={{ backgroundColor: "#000000", borderColor: "#ffffff" }}
                  >
                    {kpi}
                  </span>
                ))}
              </div>
            </motion.div>
            {/* Two-column value summary removed — the "A Problem About to Explode"
                (SlideMarketOpportunity) graphic below now sits directly under the hero. */}

            {/* Customers band moved out of the hero — now its own section below. */}
          </div>

        </div>
      </section>

      {/* Temporary filler for the reserved quote spot: the "Automated
          Optimization" card (Traigent's Analyze → Deduce → Improve → Repeat loop
          + outcome benefits), shown until the in-process customer quote is
          approved — then the quote swaps back into this exact spot. Laid out
          compact/horizontal to keep it short. */}
      <section className="bg-[#080808] border-t border-slate-800/50 py-10 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border-2 bg-slate-950 p-5 md:p-6" style={{ borderColor: "#4D8EF8" }}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-5">
              <OptimizerRing size={170} gradientId="ringGradQuoteFiller" />
              <h3 className="text-xl md:text-2xl font-bold text-white leading-tight text-center">Automated Agent Evolution</h3>
            </div>
            {/* 3 benefit boxes — horizontal row so the card stays short */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3 mt-4">
              <div className="bg-slate-900/70 border-2 rounded-lg px-3 py-2 text-center" style={{ borderColor: "#34d39966" }}>
                <div className="flex items-center justify-center gap-1.5" style={{ color: "#34d399" }}>
                  <ArrowUp className="w-5 h-5" strokeWidth={3} />
                  <span className="text-xl md:text-2xl font-extrabold tracking-tight leading-none">Better</span>
                </div>
                <div className="text-[10px] md:text-xs font-mono uppercase tracking-wider text-slate-300 mt-1">outcomes &amp; KPIs</div>
              </div>
              <div className="bg-slate-900/70 border-2 rounded-lg px-3 py-2 text-center" style={{ borderColor: "#f59e0b66" }}>
                <div className="flex items-center justify-center gap-1.5" style={{ color: "#f59e0b" }}>
                  <ArrowDown className="w-5 h-5" strokeWidth={3} />
                  <span className="text-xl md:text-2xl font-extrabold tracking-tight leading-none">up to 60%</span>
                </div>
                <div className="text-[10px] md:text-xs font-mono uppercase tracking-wider text-slate-300 mt-1">LLM cost reduction</div>
              </div>
              <div className="bg-slate-900/70 border-2 rounded-lg px-3 py-2 text-center" style={{ borderColor: "#4D8EF866" }}>
                <div className="flex items-center justify-center gap-1.5" style={{ color: "#4D8EF8" }}>
                  <ArrowDown className="w-5 h-5" strokeWidth={3} />
                  <span className="text-xl md:text-2xl font-extrabold tracking-tight leading-none">up to 8 wks</span>
                </div>
                <div className="text-[10px] md:text-xs font-mono uppercase tracking-wider text-slate-300 mt-1">Engineering time reclaimed</div>
              </div>
              <div className="bg-slate-900/70 border-2 rounded-lg px-3 py-2 text-center" style={{ borderColor: "#a78bfa66" }}>
                <div className="flex items-center justify-center gap-1.5" style={{ color: "#a78bfa" }}>
                  <ArrowUp className="w-5 h-5" strokeWidth={3} />
                  <span className="text-xl md:text-2xl font-extrabold tracking-tight leading-none">100%</span>
                </div>
                <div className="text-[10px] md:text-xs font-mono uppercase tracking-wider text-slate-300 mt-1">confidence in what you ship</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Slide 2 of /short-summary — the four-pillar methodology (SlideFourPillars);
          leads the content immediately after the 3-box market band. */}
      <section id="solution" className="pt-8 md:pt-12 pb-8 md:pb-12 bg-[#080808] border-t border-slate-800/50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SlideFourPillars />
        </div>
      </section>

      {/* Privacy — the architectural advantage. Sits at the bottom of the solution segment. */}
      <section id="privacy" className="bg-[#080808] border-t border-slate-800/50 py-14 md:py-20 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block px-6 py-2.5 rounded-full bg-[#1A6BF5]/15 border border-[#1A6BF5]/40 text-[#4D8EF8] text-xl md:text-3xl font-bold uppercase tracking-wide mb-5">
              Privacy Preserving <span className="lowercase font-normal text-base md:text-xl">yet</span> Super Powerful
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Traigent&apos;s unique architecture yields a super feature</h2>
            <p className="text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Traigent optimizes your agent <span className="text-white font-semibold">without ever seeing what your agent sees</span>.<br />
              Your most sensitive context stays with you.
            </p>
            <p className="text-slate-400 max-w-3xl mx-auto leading-relaxed mt-3">
              Traigent deduces all it needs to know from non-private information only <span className="text-slate-500">(KPI scores and the config parameters that produced them)</span>. Traigent then directs your coding agent, which is privy to much more, to do the rest. <span className="text-[#4D8EF8] font-semibold italic">It&apos;s truly magic.</span>
            </p>
            <p className="text-slate-400 max-w-3xl mx-auto leading-relaxed mt-4">
              Traigent offers observability as well, but it&apos;s not a pre-requisite for building optimal agents.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 items-stretch">
            <div className="rounded-2xl border border-[#1A6BF5]/30 bg-slate-900/60 p-8">
              <div className="text-sm font-semibold uppercase tracking-wider text-[#4D8EF8] mb-4">Your coding agent sees everything</div>
              <ul className="space-y-3 text-slate-300">
                <li className="flex gap-3"><Check className="w-5 h-5 text-[#4D8EF8] flex-shrink-0 mt-0.5" />Your logs — and every failure</li>
                <li className="flex gap-3"><Check className="w-5 h-5 text-[#4D8EF8] flex-shrink-0 mt-0.5" />Your agent&apos;s actual implementation</li>
                <li className="flex gap-3"><Check className="w-5 h-5 text-[#4D8EF8] flex-shrink-0 mt-0.5" />Your corporate &amp; regulatory guidelines</li>
              </ul>
              <p className="mt-5 text-sm text-slate-500">Far more than you&apos;d ever hand a cloud vendor — and none of it leaves your environment.</p>
            </div>
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-8">
              <div className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Traigent&apos;s cloud only ever sees</div>
              <ul className="space-y-3 text-slate-300">
                <li className="flex gap-3"><Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />KPI scores</li>
                <li className="flex gap-3"><Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />Which config produced them</li>
              </ul>
              <p className="mt-5 text-sm text-slate-500">No prompts, no data, no code — only the optimization history that makes every next run smarter.</p>
            </div>
          </div>

          <p className="text-center mt-10 text-lg md:text-2xl font-semibold text-white">
            <span className="text-[#4D8EF8]">Privacy is power.</span> Leveraging more pertinent information is power. Traigent gives you both.
          </p>
        </div>
      </section>

      {/* Slide 4 of /short-summary — example end result: SPIDER text2SQL frontier
          proof (SlideCustomerObjectiveSpider); right after the solution section. */}
      <section className="pt-8 md:pt-12 pb-8 md:pb-12 bg-[#080808] border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SlideCustomerObjectiveSpider compact />
        </div>
      </section>

      {/* Slide 3 of /short-summary — the multi-dimensional optimization problem
          (SlideParetoFrontier); placed after the Traigent (example) Results section. */}
      <section className="pt-8 md:pt-12 pb-8 md:pb-12 bg-[#080808] border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SlideParetoFrontier />
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
              <OptimizationEngineBody />
            </motion.div>

            {/* Center: feedback loop connector */}
            <FeedbackLoopConnector />

            {/* Right: Agent Wrapper (component 1) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-1 bg-slate-900/60 border border-slate-700/50 rounded-2xl p-8"
            >
              <AgentWrapperBody />
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
              <BenchmarkCardBody />
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
              <ObservabilityCardBody />
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
                One Wrapper. Instant Optimization.
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
                <span className="ml-2">{codeLang === "python" ? "my_agent.py" : "my_agent.ts"}</span>
                <div className="ml-auto flex flex-shrink-0 items-center gap-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setCodeLang("python")}
                    aria-pressed={codeLang === "python"}
                    className={`rounded px-2 py-0.5 transition-colors ${codeLang === "python" ? "bg-slate-700 text-white" : "text-slate-500 hover:text-slate-300"}`}
                  >
                    Python
                  </button>
                  <button
                    type="button"
                    onClick={() => setCodeLang("ts")}
                    aria-pressed={codeLang === "ts"}
                    className={`rounded px-2 py-0.5 transition-colors ${codeLang === "ts" ? "bg-slate-700 text-white" : "text-slate-500 hover:text-slate-300"}`}
                  >
                    JS / TS
                  </button>
                </div>
              </div>
              <div className="-mx-2 overflow-x-auto px-2">
                <SyntaxHighlighter
                  language={codeLang === "python" ? "python" : "typescript"}
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
{codeLang === "python"
  ? `import traigent
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
    return llm.invoke(f"{context}\\n\\nQ: {question}").content`
  : `import { optimize, getTrialParam, param } from "@traigent/sdk";
import { ChatOpenAI } from "@langchain/openai";

const answerQuestion = optimize({
  configurationSpace: {
    model: param.enum(["gpt-4o-mini", "gpt-4o"]),
    temperature: param.enum([0.1, 0.5, 0.9]),
    useRag: param.enum([true, false]),
    topK: param.enum([1, 2, 3]),
  },
  evaluation: {
    data: "eval.jsonl",
    metrics: { accuracy, cost },
  },
})(async (question) => {
  // Tuned variables from the trial config
  const model = getTrialParam("model", "gpt-4o-mini");
  const temperature = getTrialParam("temperature", 0.1);
  const useRag = getTrialParam("useRag", false);
  const topK = getTrialParam("topK", 1);

  const context = useRag ? await retrieveDocs(question, topK) : "";

  const llm = new ChatOpenAI({ model, temperature });
  return (await llm.invoke(\`\${context}\\n\\nQ: \${question}\`)).content;
});`}
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
              {/* Same journey as the hero's "Start evolving your agent" - one entry
                  point, not two competing ones. Previously opened the legacy
                  StartNowModal (a different OTP gate that never reached the
                  portal funnel). */}
              <button
                onClick={() => {
                  openLeadFunnel("cta_section");
                }}
                className="border border-slate-600 hover:border-slate-400 text-slate-200 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
              >
                Start evolving your agent
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

      {/* Customers — scrolling design-partner / early-adopter band, placed just
          above Contact Us. */}
      <section id="customers" className="py-12 md:py-16 bg-[#080808] border-t border-slate-800/50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm md:text-base text-slate-300 uppercase tracking-widest font-bold mb-8">Customers</p>
          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#080808] to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#080808] to-transparent z-10"></div>
            <div className="flex gap-16 items-center animate-scroll" style={{ width: 'max-content', animation: 'scroll 40s linear infinite' }}>
              {[...Array(8)].map((_, setIndex) => (
                <React.Fragment key={setIndex}>
                  <div className="text-slate-300 text-xl md:text-2xl font-bold whitespace-nowrap">Bazak</div>
                  <div className="text-slate-300 text-xl md:text-2xl font-bold whitespace-nowrap">iForAI</div>
                  <div className="text-slate-300 text-xl md:text-2xl font-bold whitespace-nowrap">Cloudzone</div>
                  <div className="text-slate-300 text-xl md:text-2xl font-bold whitespace-nowrap">Profisea</div>
                  <div className="text-slate-300 text-xl md:text-2xl font-bold whitespace-nowrap">Yotpo</div>
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
        </div>
      </section>

      {/* Wave / Pain / Cure (SlideMarketOpportunity) — moved to just above Contact Us. */}
      <section className="pt-8 md:pt-12 pb-8 md:pb-12 bg-[#080808] border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SlideMarketOpportunity hideHeader compact />
        </div>
      </section>

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
                  <Link to="/research" className="text-slate-400 hover:text-white transition-colors">
                    Research
                  </Link>
                </li>
                <li>
                  <a href="https://www.tvl-lang.org/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                    Learn TVL
                  </a>
                </li>
                <li>
                  {/* Same funnel as every other entry point on this page. */}
                  <button
                    type="button"
                    onClick={() => {
                      openLeadFunnel("homepage_footer");
                    }}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Try out our SDK - it's free!
                  </button>
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
              {/* Hidden sales-deck shortcut: right-click the dot to open /pitch-short-2 in a new tab.
                  Looks decorative to visitors. No left-click handler. */}
              <span
                onContextMenu={(e) => {
                  e.preventDefault();
                  window.open("#/pitch-short-2", "_blank", "noopener,noreferrer");
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
