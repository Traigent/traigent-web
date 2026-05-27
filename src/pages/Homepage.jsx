import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, ChevronRight, ChevronDown, ExternalLink, Play, Pause } from "lucide-react";
import {
  OptimizationEngineBody,
  FeedbackLoopConnector,
  AgentWrapperBody,
  BenchmarkCardBody,
  ObservabilityCardBody,
} from "../components/PlatformShowcase";
import { SlideParetoFrontier } from "./PitchShort";
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
          {/* Centered hero content */}
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.55] tracking-tight mb-6"
              style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.03em' }}
            >
              AI Agent Optimization —<br />
              <span className="text-[#4D8EF8]">Fully Automated</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-2xl md:text-3xl lg:text-[2rem] text-slate-300 leading-snug mb-3"
            >
              <span className="font-bold text-white">Rapidly</span> finds <span className="font-bold text-[#f59e0b]">Low Cost</span> and <span className="font-bold text-[#4D8EF8]">High Accuracy</span> options
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="text-2xl md:text-3xl lg:text-[2rem] text-slate-300 leading-snug mb-10"
            >
              among{" "}
              <Link
                to="/blog/the-config-multiverse"
                className="font-bold text-white underline underline-offset-4 decoration-white/40 hover:decoration-white transition-colors"
              >
                thousands possible
              </Link>
            </motion.p>
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
              </div>
            </motion.div>


            {/* Design Partners & Early Adopters */}
            <motion.div
              id="customers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 md:mt-8 mb-6 md:mb-8 scroll-mt-20"
            >
              <p className="text-center text-sm md:text-base text-slate-300 uppercase tracking-widest font-bold mb-8">Customers</p>
              <div className="relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#080808] to-transparent z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#080808] to-transparent z-10"></div>
                <div className="flex gap-16 items-center animate-scroll" style={{ width: 'max-content', animation: 'scroll 40s linear infinite' }}>
                  {/* 8 copies of the 5-logo set so total content is always wide
                      enough to keep the right half filled on large viewports.
                      The animation translates -50% (= 4 copies), which lands
                      on the visually-identical 5th copy → seamless loop. */}
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
            </motion.div>
          </div>

        </div>
      </section>

      {/* How It Works — three-panel BEFORE / TRAIGENT / AFTER story.
          Component is shared with /pitch-short(-2) slide 21 so the visual
          stays identical between the homepage and the deck. */}
      <section className="pt-2 md:pt-4 pb-16 md:pb-20 bg-[#080808]">
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
