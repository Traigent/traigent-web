import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, ChevronRight, ExternalLink, Zap, GitBranch, Shield, FileText, Play, Pause } from "lucide-react";
import { Link } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import versionInfo from "../version.json";
import FlowDiagram from "../components/FlowDiagram";

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

// Interactive Demo Player with pause on click
const DemoPlayer = () => {
  const [isPaused, setIsPaused] = useState(false);
  const iframeRef = useRef(null);

  const togglePause = () => {
    setIsPaused(!isPaused);
    // For SVG animations, we control via CSS
  };

  return (
    <div className="relative">
      {/* Terminal Window Frame */}
      <div className="bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
        {/* Terminal Header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 border-b border-slate-700">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-3 text-slate-400 text-sm font-mono">traigent optimize</span>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={togglePause}
              className="flex items-center gap-2 px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs transition-colors"
            >
              {isPaused ? (
                <>
                  <Play className="w-3 h-3" /> Play
                </>
              ) : (
                <>
                  <Pause className="w-3 h-3" /> Pause
                </>
              )}
            </button>
          </div>
        </div>

        {/* Demo Content */}
        <div
          className="relative cursor-pointer"
          onClick={togglePause}
          title={isPaused ? "Click to play" : "Click to pause"}
        >
          <object
            ref={iframeRef}
            data="/demos/optimize.svg"
            type="image/svg+xml"
            className="w-full"
            style={{
              minHeight: '400px',
              animationPlayState: isPaused ? 'paused' : 'running'
            }}
          >
            <img src="/demos/optimize.svg" alt="Traigent optimization demo" className="w-full" />
          </object>

          {/* Pause Overlay */}
          {isPaused && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="bg-slate-900/90 rounded-full p-4">
                <Play className="w-12 h-12 text-white" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hint Text */}
      <p className="text-center text-slate-500 text-sm mt-4">
        Click anywhere on the demo to {isPaused ? 'resume' : 'pause'}
      </p>
    </div>
  );
};

export default function Homepage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 to-indigo-950 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=2832&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/057ce2_TraigentLogoWhiteCropped.png"
              alt="Traigent Logo"
              className="h-14 w-auto"
            />
          </motion.div>
          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6"
            >
              <span className="block">Ship AI Agents Like Software!</span>
              <span className="block text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-200 mt-3">
                Gated, Optimized, and Regression-Safe
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-2xl text-slate-300 mb-6 max-w-2xl"
            >
              Traigent adds evaluation gates to your CI/CD so AI changes are measured for accuracy, cost, latency, and safety before they ship.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.23 }}
              className="text-sm md:text-base text-slate-400 mb-6"
            >
              Specify (TVL) → Evaluate → Optimize → Apply (Gate in CI)
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex flex-wrap gap-4 text-sm text-slate-400 mb-10"
            >
              <span className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Specification (TVL): declare what, not how</span>
              <span className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Git hooks + CI gates: block bad pushes, catch regressions in PRs</span>
              <span className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Governed optimization: grounded in real workloads</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                size="lg"
                className="bg-white text-slate-900 hover:bg-gray-100 px-8 py-6 text-lg rounded-lg"
                onClick={() => window.open("https://cal.com/nimrod-busany", "_blank")}
              >
                Request a demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Link
                to={createPageUrl("/get-started")}
                className="inline-flex items-center justify-center font-medium bg-transparent border border-slate-600 text-slate-200 hover:bg-white/5 px-8 py-6 text-lg rounded-lg"
              >
                Get started (TVL + SDK)
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Flowing gradient accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500"></div>
      </section>

      {/* Value Props - Numbers */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { title: "1 Spec", desc: "One specification, many tools" },
              { title: "Less Drift", desc: "Keep configs tied to source control" },
              { title: "Every Change", desc: "Measured before it ships" },
              { title: "Run History", desc: "Compare runs and configs" }
            ].map((item, i) => (
              <FadeInView key={i} delay={i * 0.1}>
                <div className="text-4xl md:text-5xl font-bold text-indigo-600 mb-2">{item.title}</div>
                <p className="text-slate-600">{item.desc}</p>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
            >
              Agent Engineering Has No Engineering
            </motion.h2>
            <p className="text-xl text-gray-600">
              Agent behavior emerges from model + prompt + tools + retrieval + policies—but the spec lives in engineers’ heads.
              Classic ML has loss functions and evaluation loops. Agents don’t—so changes ship without a consistent way to measure regressions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {[
              {
                title: "Under-Specification",
                description: "Give the same task to five engineers—you’ll get five materially different agents (personality, safety boundaries, cost tolerance, latency targets).",
                icon: <FileText className="w-6 h-6 text-indigo-600" />
              },
              {
                title: "Untestable Changes",
                description: "A prompt tweak ships on gut feel. No consistent evaluation means you can’t tell improvement from regression—until production.",
                icon: <Shield className="w-6 h-6 text-blue-600" />
              },
              {
                title: "Configuration Drift",
                description: "Models, prompts, retrieval depth, and policies drift away from source control. Production behavior stops matching the repo.",
                icon: <GitBranch className="w-6 h-6 text-purple-600" />
              },
              {
                title: "No Clear Path",
                description: "No gates, no audit trail, no rollback. A bad merge hits production before anyone notices.",
                icon: <ArrowRight className="w-6 h-6 text-emerald-600" />
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-5 p-6 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section - Core Platform */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-200/60 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
            >
              The Agent Engineering Control Layer
            </motion.h2>
            <p className="text-xl text-gray-600">
              Traigent gives you the primitives to specify, evaluate, optimize, and apply agent configurations—systematically.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {[
              {
                title: "Specification (TVL)",
                description: "Declare tunable decisions, objectives, and constraints in a machine-checkable spec—versioned alongside your code.",
                icon: <FileText className="w-6 h-6 text-indigo-600" />
              },
              {
                title: "Git Hooks & CI Gates",
                description: "Pre-push hooks validate constraints locally. GitHub Actions catch regressions in PRs. Block bad merges before they ship.",
                icon: <Shield className="w-6 h-6 text-indigo-600" />
              },
              {
                title: "Governed Optimization",
                description: "Explore configurations against your KPIs on real workloads. Changes become explicit, comparable, and grounded in data—not guesswork.",
                icon: <Zap className="w-6 h-6 text-indigo-600" />
              },
              {
                title: "Results & History",
                description: "Store runs locally, compare trials, and plot progress. Apply the best configuration for future calls.",
                icon: <GitBranch className="w-6 h-6 text-indigo-600" />
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TVL Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-block px-3 py-1 bg-indigo-500/20 rounded-full text-indigo-300 text-sm font-medium">
                  Open Source
                </span>
                <span className="inline-block px-3 py-1 bg-emerald-500/20 rounded-full text-emerald-300 text-sm font-medium">
                  4 Patent Filings
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                TVL: The Tuned Variables Language
              </h2>
              <p className="text-slate-300 text-lg mb-6">
                TVL is a machine-checkable spec format for agentic systems. It separates what you want from how it’s achieved—capturing tunables, objectives, constraints, and budgets in a versioned file.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg"
                  onClick={() => window.open("https://www.tvl-lang.org/getting-started/", "_blank")}
                >
                  Learn TVL
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  className="bg-transparent border border-slate-600 hover:bg-white/5 text-slate-200 px-6 py-3 rounded-lg"
                  onClick={() => window.open("https://www.tvl-lang.org/reference/language/", "_blank")}
                >
                  Language reference
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-slate-800 rounded-xl p-6 font-mono text-sm"
            >
              <div className="flex items-center gap-2 mb-4 text-slate-400">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-2">agent.tvl.yml</span>
              </div>
              <pre className="text-slate-300 overflow-x-auto">
{`spec:
  id: customer-support
  version: 0.1.0

configuration_space:
  model:
    type: categorical
    values: ["gpt-4o-mini", "gpt-4o", "claude-3-haiku"]
  temperature:
    type: continuous
    range:
      min: 0.1
      max: 0.8

objectives:
  - name: accuracy
    direction: maximize
  - name: cost
    direction: minimize

constraints:
  - id: latency-budget
    type: expression
    rule: "params.response_latency_ms <= 1200"
`}
              </pre>
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

          {/* Flow Diagram */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto mb-16"
          >
            <FlowDiagram variant="light" />
          </motion.div>

          <p className="text-xl text-gray-600 text-center mb-12">
            From specification to gated changes in four steps
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Specify",
                description: "Define tunable decisions in TVL: models, prompts, tools, retrieval, and constraints."
              },
              {
                step: "02",
                title: "Evaluate",
                description: "Run your evaluation dataset. Measure accuracy, cost, latency, and safety—then gate changes in CI."
              },
              {
                step: "03",
                title: "Optimize",
                description: "Explore the configuration space and find the best tradeoffs for your KPIs."
              },
              {
                step: "04",
                title: "Apply",
                description: "Apply the winning config for future calls, and keep a history of runs."
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

      {/* Interactive Demo Section */}
      <section className="py-20 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              See It In Action
            </motion.h2>
            <p className="text-xl text-slate-300">
              See the control layer in action—from specification to optimized configurations.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto"
          >
            <DemoPlayer />
          </motion.div>

          <div className="mt-12 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">Cost ↓</div>
              <p className="text-slate-400">Cost reduction (varies)</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">Accuracy ↑</div>
              <p className="text-slate-400">Accuracy improvement (varies)</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">Latency ↓</div>
              <p className="text-slate-400">Latency improvement (varies)</p>
            </div>
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
              className="bg-slate-900 rounded-xl p-6 font-mono text-sm shadow-2xl"
            >
              <div className="flex items-center gap-2 mb-4 text-slate-400">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-2">my_agent.py</span>
              </div>
              <SyntaxHighlighter
                language="python"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: 0,
                  background: 'transparent',
                  fontSize: '0.875rem',
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
              Start Engineering Your Agents
            </motion.h2>
            <p className="text-xl opacity-90 mb-10">
              Join teams shipping agents with the same rigor as software. Specify. Evaluate. Optimize. Apply.
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link
                to={createPageUrl("/get-started")}
                className="inline-flex items-center justify-center font-medium bg-white text-indigo-700 hover:bg-gray-100 px-8 py-6 text-lg rounded-lg"
              >
                Get started (TVL + SDK)
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Button
                size="lg"
                className="bg-transparent border-2 border-white/40 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-lg"
                onClick={() => window.open("https://cal.com/nimrod-busany", "_blank")}
              >
                Request enterprise demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
            <div>
              <div className="text-xl font-bold mb-4">Traigent</div>
              <p className="text-slate-400 mb-6 max-w-xs">
                The agent control layer. Specify. Evaluate. Optimize. Apply.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link to={createPageUrl("/get-started")} className="text-slate-400 hover:text-white transition-colors">
                    Get started
                  </Link>
                </li>
                <li>
                  <a href="https://www.tvl-lang.org/getting-started/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                    Learn TVL
                  </a>
                </li>
                <li>
                  <a href="https://cal.com/nimrod-busany" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                    Request SDK access
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
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/privacy" className="text-slate-400 hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-slate-400 hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/refund" className="text-slate-400 hover:text-white transition-colors">
                    Refund Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500">
            <p>© {new Date().getFullYear()} Traigent Ltd. All rights reserved.</p>
            <p className="mt-2 text-slate-950 selection:bg-white selection:text-slate-900">{versionInfo.version}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
