import { ArrowRight } from "lucide-react";

const SectionHeader = ({ children }) => (
  <div className="bg-blue-500 text-white font-bold text-xl md:text-2xl px-6 py-3 rounded-lg mb-4">
    {children}
  </div>
);

export default function OnePager() {
  return (
    <div className="bg-slate-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Logo */}
        <div className="mb-10">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/057ce2_TraigentLogoWhiteCropped.png"
            alt="Traigent"
            className="h-14"
          />
        </div>

        {/* Company Overview */}
        <section className="mb-10">
          <SectionHeader>Company Overview</SectionHeader>
          <p className="text-slate-300 leading-relaxed">
            Traigent is building the AI Agents Continuous <strong>Optimization</strong> infrastructure.
            We automate the complex process of optimizing AI agent configurations by balancing{" "}
            <strong>accuracy</strong>, <strong>latency</strong>, and <strong>cost</strong>, so engineering
            teams can ship production-ready agents <strong>faster</strong> and with <strong>confidence</strong>.
          </p>
        </section>

        {/* Problem & Solution Side by Side */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* The Problem */}
          <section className="bg-slate-900 rounded-xl p-6 border border-red-500/30">
            <div className="flex items-center gap-4 mb-4">
              <img
                src="/images/robot-error.png"
                alt="AI Agent Error"
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h2 className="text-red-400 font-bold text-xl md:text-2xl">The Problem</h2>
                <p className="text-slate-400 text-xs">AI agents break at scale</p>
              </div>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">✗</span>
                <p className="text-slate-200 text-sm"><strong>Credibility gaps:</strong> Exploding config space</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">✗</span>
                <p className="text-slate-200 text-sm"><strong>Inefficiency:</strong> 95% of configs are suboptimal</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">✗</span>
                <p className="text-slate-200 text-sm"><strong>Quality & Safety:</strong> Risks in production</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">✗</span>
                <p className="text-slate-200 text-sm"><strong>Wasted time:</strong> Manual tuning drains cycles</p>
              </li>
            </ul>
          </section>

          {/* The Solution */}
          <section className="bg-slate-900 rounded-xl p-6 border border-emerald-500/30">
            <div className="flex items-center gap-4 mb-4">
              <img
                src="/images/robot-happy.png"
                alt="Optimized AI Agent"
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h2 className="text-emerald-400 font-bold text-xl md:text-2xl">The Solution</h2>
                <p className="text-slate-400 text-xs">Trust your AI agent at scale</p>
              </div>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">✓</span>
                <p className="text-slate-200 text-sm"><strong>Credibility:</strong> Configs backed by data</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">✓</span>
                <p className="text-slate-200 text-sm"><strong>Efficiency:</strong> Top 5% performance tier</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">✓</span>
                <p className="text-slate-200 text-sm"><strong>Quality & Safety:</strong> Guardrails built in</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">✓</span>
                <p className="text-slate-200 text-sm"><strong>40-60% faster:</strong> Reduced time-to-market</p>
              </li>
            </ul>
          </section>
        </div>

        {/* The Product */}
        <section className="mb-10">
          <SectionHeader>The Product: AI Agent Optimizer</SectionHeader>
          <div className="relative">
            {/* Flow Diagram */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
              {/* Input Box */}
              <div className="md:col-span-2 bg-slate-800 rounded-xl p-5 border border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-blue-400 text-lg">📥</span>
                  </div>
                  <h4 className="font-bold text-white">Input</h4>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-slate-300">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                    Prompts & Models
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                    Eval Data & KPIs
                  </li>
                </ul>
              </div>

              {/* Arrow 1 */}
              <div className="hidden md:flex justify-center">
                <ArrowRight className="w-6 h-6 text-blue-400" />
              </div>

              {/* Center - Traigent Engine */}
              <div className="md:col-span-1 flex justify-center">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <span className="text-3xl">⚡</span>
                  </div>
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="text-xs text-blue-400 font-semibold">TRAIGENT</span>
                  </div>
                </div>
              </div>

              {/* Arrow 2 */}
              <div className="hidden md:flex justify-center">
                <ArrowRight className="w-6 h-6 text-emerald-400" />
              </div>

              {/* Output Box */}
              <div className="md:col-span-2 bg-slate-800 rounded-xl p-5 border border-emerald-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-emerald-400 text-lg">📤</span>
                  </div>
                  <h4 className="font-bold text-white">Output</h4>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-slate-300">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                    Optimized Configs
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                    Evidence-backed Reports
                  </li>
                </ul>
              </div>
            </div>

            {/* Mobile arrows */}
            <div className="flex md:hidden justify-center my-4">
              <div className="flex flex-col items-center gap-2 text-blue-400">
                <span className="rotate-90">→</span>
                <span className="text-xs">TRAIGENT</span>
                <span className="rotate-90">→</span>
              </div>
            </div>
          </div>
        </section>

        {/* Personas */}
        <section className="mb-10">
          <SectionHeader>Personas</SectionHeader>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
            <div>
              <p className="text-slate-200"><strong>AI/ML/DS Engineers:</strong> Integrate via decorator (SDK), optimize with code.</p>
            </div>
            <div>
              <p className="text-slate-200"><strong>No-Code Users:</strong> Visual interface for non-technical users.</p>
            </div>
            <div>
              <p className="text-slate-200"><strong>QA Users:</strong> Scalable quality validation for agentic AI</p>
            </div>
            <div>
              <p className="text-slate-200"><strong>Stakeholders:</strong> Track Business KPIs and cost-efficiency metrics</p>
            </div>
          </div>
        </section>

        {/* POC & Design Partner Program */}
        <section className="mb-10">
          <SectionHeader>POC & Design Partner Program</SectionHeader>
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div>
              <h4 className="font-bold text-white mb-2">Before</h4>
              <p className="text-slate-400 text-sm">Define:</p>
              <ul className="list-disc list-inside text-slate-300 text-sm">
                <li>Benchmark (EvalSet + Eval)</li>
                <li>POC success metrics</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2">POC</h4>
              <p className="text-slate-300 text-sm">1-week integration & optimization on your system</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2">After</h4>
              <p className="text-slate-300 text-sm">Compare optimized results vs. your baseline benchmark</p>
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h4 className="font-bold text-white mb-2 text-center">Design Partner Benefits</h4>
            <ul className="text-slate-300 text-sm text-center space-y-1">
              <li>Direct influence on the Traigent product roadmap</li>
              <li>White-glove dedicated engineering integration support</li>
              <li>Gain recognition as an AI innovator (success story)</li>
            </ul>
          </div>
        </section>

        {/* Contact */}
        <section className="mb-10">
          <SectionHeader>Contact</SectionHeader>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="font-bold text-white">Achi Solomon | Co-founder, CEO</p>
              <p className="text-slate-300">
                <a href="mailto:achi@traigent.ai" className="text-indigo-400 hover:underline">achi@traigent.ai</a>
                {" | "}
                <a href="https://linkedin.com/in/achisolomon" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">LinkedIn</a>
              </p>
              <p className="text-slate-400">+972-54-7784395</p>
            </div>
            <div>
              <p className="font-bold text-white">Dr. Nimrod Busany | Co-founder, CTO</p>
              <p className="text-slate-300">
                <a href="mailto:nimrod@traigent.ai" className="text-indigo-400 hover:underline">nimrod@traigent.ai</a>
                {" | "}
                <a href="https://linkedin.com/in/nimrodbusany" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">LinkedIn</a>
              </p>
              <p className="text-slate-400">+972-54-4553811</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="https://cal.com/nimrod-busany"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 px-8 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            Request a Demo
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
