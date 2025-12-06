import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, ChevronRight, ExternalLink, Terminal, Zap, Code, GitBranch, Shield, Clock, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

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
              className="h-12 w-auto"
            />
          </motion.div>
          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6"
            >
              Ship AI Applications Like Software
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-2xl text-slate-300 mb-6 max-w-2xl"
            >
              Evaluate, gate, optimize, and deploy AI agents with confidence. Traigent integrates evaluation gates into your CI/CD pipeline — ensuring accuracy, cost, latency, and safety improvements while preventing regressions.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex flex-wrap gap-4 text-sm text-slate-400 mb-10"
            >
              <span className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Zero-code attach via decorators</span>
              <span className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Git & CI integration</span>
              <span className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Measurable, gateable artifacts</span>
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
                onClick={() => window.open('https://cal.com/nimrod-busany', '_blank')}
              >
                Request a Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                className="bg-transparent border border-slate-500 text-white hover:bg-slate-800 px-8 py-6 text-lg rounded-lg"
                onClick={() => window.open('https://github.com/Traigent/traigent-sdk', '_blank')}
              >
                <Code className="mr-2 h-5 w-5" />
                View SDK
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Flowing gradient accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500"></div>
      </section>

      {/* Social Proof Bar - Presentations */}
      <section className="py-8 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Presented & Featured At</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 text-slate-600">
            <div className="text-center">
              <p className="font-semibold">Tel-Aviv University</p>
              <p className="text-xs text-slate-400">Research Seminar</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">IBM Research</p>
              <p className="text-xs text-slate-400">AI Seminar</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">Reichman University</p>
              <p className="text-xs text-slate-400">AI Summit</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">MLOps Community</p>
              <p className="text-xs text-slate-400">Agents In Product</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">IEEE ICSE 2025</p>
              <p className="text-xs text-slate-400">Peer-Reviewed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props - Numbers */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-4xl md:text-5xl font-bold text-indigo-600 mb-2">40x</div>
              <p className="text-slate-600">Cost reduction potential</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="text-4xl md:text-5xl font-bold text-indigo-600 mb-2">10x</div>
              <p className="text-slate-600">Faster optimization cycles</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-4xl md:text-5xl font-bold text-indigo-600 mb-2">1000s</div>
              <p className="text-slate-600">Configurations tested automatically</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="text-4xl md:text-5xl font-bold text-indigo-600 mb-2">0</div>
              <p className="text-slate-600">Regressions in production</p>
            </motion.div>
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
              AI Development Shouldn't Be Guesswork
            </motion.h2>
            <p className="text-xl text-gray-600">
              Most teams deploy AI without knowing if it's optimal — or if the next change will break it.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {[
              {
                title: "High Default Costs",
                description: "Defaulting to frontier models drives costs sky-high. Without optimization data, you're flying blind.",
                icon: <DollarSign className="w-6 h-6 text-red-600" />
              },
              {
                title: "Manual, Slow Iteration",
                description: "Prompt engineering by hand is slow and doesn't scale. Every change requires re-testing everything.",
                icon: <Clock className="w-6 h-6 text-amber-600" />
              },
              {
                title: "No Quality Gates",
                description: "Unlike software, AI changes ship without evaluation gates. Regressions slip into production undetected.",
                icon: <Shield className="w-6 h-6 text-blue-600" />
              },
              {
                title: "Configuration Chaos",
                description: "Model selection, prompts, retrieval settings, hyperparameters — all disconnected from your codebase.",
                icon: <GitBranch className="w-6 h-6 text-purple-600" />
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
              Treat AI Decisions as Code
            </motion.h2>
            <p className="text-xl text-gray-600">
              Traigent makes every AI configuration decision — model, prompt, retrieval, hyperparameters — a measurable, version-controlled, gateable artifact.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {[
              {
                title: "Automated Optimization",
                description: "Intelligently explore thousands of configurations against your KPIs on real workloads. No brute force.",
                icon: <Zap className="w-6 h-6 text-indigo-600" />
              },
              {
                title: "Evaluation Gates",
                description: "CI/CD checks for accuracy, cost, latency, and safety. Ship with confidence, catch regressions early.",
                icon: <Shield className="w-6 h-6 text-indigo-600" />
              },
              {
                title: "Developer-First",
                description: "Zero-code attach via decorators. CLI & playground for easy scaling. Integrates with Git and your existing workflow.",
                icon: <Terminal className="w-6 h-6 text-indigo-600" />
              },
              {
                title: "Deployment Ready",
                description: "Get deployment-ready code and actionable insights. Export optimal configurations directly to your codebase.",
                icon: <ExternalLink className="w-6 h-6 text-indigo-600" />
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
              <div className="inline-block px-3 py-1 bg-indigo-500/20 rounded-full text-indigo-300 text-sm font-medium mb-4">
                Open Source
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                TVL: The Tuned Variables Language
              </h2>
              <p className="text-slate-300 text-lg mb-6">
                A declarative language for defining how your AI systems should be tuned. TVL bridges the gap between static configuration and dynamic optimization — giving you a type-safe, version-controlled way to manage prompts, hyperparameters, and model choices.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg"
                  onClick={() => window.open('https://tvl-lang.org', '_blank')}
                >
                  Learn More
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
                <span className="ml-2">agent.tvl</span>
              </div>
              <pre className="text-slate-300 overflow-x-auto">
{`agent CustomerSupport {
  model: tune("gpt-4o", "claude-3-5")
  temperature: tune(0.1, 0.3, 0.5)

  prompt: tune(
    "You are a helpful assistant...",
    "As a customer service agent..."
  )

  optimize_for: [accuracy, cost]
  constraints: { latency < 2s }
}`}
              </pre>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
            >
              How It Works
            </motion.h2>
            <p className="text-xl text-gray-600">
              From evaluation to deployment in four simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Attach & Define",
                description: "Add decorators to your AI calls. Define your evaluation dataset and success metrics."
              },
              {
                step: "02",
                title: "Set Optimization Goals",
                description: "Choose what matters: cost, accuracy, latency, safety — or balance all four."
              },
              {
                step: "03",
                title: "Automated Exploration",
                description: "Traigent intelligently tests configurations against your KPIs on real workloads."
              },
              {
                step: "04",
                title: "Gate & Deploy",
                description: "Set evaluation gates in CI. Ship optimal configs with confidence, prevent regressions."
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

      {/* Research & Credibility Section */}
      <section className="py-20 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Built on Peer-Reviewed Research</h2>
              <p className="text-slate-300 text-lg mb-6">
                Traigent emerged from academic research demonstrating that most AI deployments operate far below their potential — with 40x gaps in cost and performance due to suboptimal configurations.
              </p>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900/60 backdrop-blur-sm border border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">IEEE ICSE 2025</h4>
                      <p className="text-slate-400 text-sm">International Conference on Software Engineering</p>
                    </div>
                    <div className="px-3 py-1 bg-emerald-500/20 rounded-full text-emerald-300 text-xs font-medium">
                      Peer-Reviewed
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 backdrop-blur-sm border border-slate-800">
                  <h4 className="font-semibold mb-2">Featured Presentations</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm text-slate-400">
                    <span>Tel-Aviv University</span>
                    <span>IBM Research</span>
                    <span>Reichman AI Summit</span>
                    <span>MLOps Community</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative h-[400px] rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <div className="text-7xl font-bold mb-4">40x</div>
                <p className="text-xl text-white/90 mb-2">Performance & Cost Gap</p>
                <p className="text-white/70 max-w-xs">
                  Between default configurations and optimized deployments in production AI systems
                </p>
              </div>

              <div className="absolute top-8 right-8 flex space-x-2">
                <div className="h-3 w-3 rounded-full bg-emerald-400"></div>
                <div className="h-3 w-3 rounded-full bg-purple-400"></div>
                <div className="h-3 w-3 rounded-full bg-blue-400"></div>
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
              Stop Guessing. Start Optimizing.
            </motion.h2>
            <p className="text-xl opacity-90 mb-10">
              Join engineering teams shipping AI applications with the same rigor as software. Reduce costs, improve accuracy, prevent regressions — automatically.
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Button
                size="lg"
                className="bg-white text-indigo-700 hover:bg-gray-100 px-8 py-6 text-lg rounded-lg"
                onClick={() => window.open('https://cal.com/nimrod-busany', '_blank')}
              >
                Request a Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-lg"
                onClick={() => window.open('https://github.com/Traigent/traigent-sdk', '_blank')}
              >
                Try the SDK
                <Code className="ml-2 h-5 w-5" />
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
                Ship AI applications like software. Evaluate, gate, optimize, and deploy with confidence.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://github.com/Traigent/traigent-sdk" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                    SDK Documentation
                  </a>
                </li>
                <li>
                  <a href="https://tvl-lang.org" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                    TVL Language
                  </a>
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
          </div>
        </div>
      </footer>
    </div>
  );
}
