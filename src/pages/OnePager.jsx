import { ArrowRight } from "lucide-react";
import ProblemSolutionSection from "../components/ProblemSolutionSection";

const SectionHeader = ({ children }) => (
  <div className="bg-blue-500 text-white font-bold text-xl md:text-2xl px-6 py-3 rounded-lg mb-4">
    {children}
  </div>
);

export default function OnePager() {
  return (
    <div className="bg-slate-950 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">
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
            Traigent is building the AI Agents Continuous <strong>Optimization</strong>{" "}
            infrastructure. We automate the complex process of optimizing AI agent configurations by
            balancing <strong>accuracy</strong>, <strong>latency</strong>, <strong>cost</strong>, or any other <strong>business KPI's</strong>
            , so engineering teams can ship production-ready agents <strong>faster</strong> and with{" "}
            <strong>confidence</strong>.
          </p>
        </section>

        {/* Problem & Solution Side by Side */}
        <ProblemSolutionSection showImages={true} solutionTitle="Traigent" />

        {/* The Product */}
        <section className="mb-10">
          <SectionHeader>The Product: AI Agent Optimizer</SectionHeader>
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-[#04103a] to-[#020617] p-4 md:p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
              {/* Input Card */}
              <div className="bg-slate-800/70 rounded-2xl p-5 border border-cyan-300/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                <h4 className="font-bold text-white text-xl mb-4">
                  <span className="text-white">Input: </span>
                  <span className="text-blue-300">The Tunable Universe</span>
                </h4>
                <ul className="space-y-3 text-[15px] leading-relaxed">
                  <li className="flex items-start gap-3 text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-blue-400 mt-2 shrink-0"></span>
                    <span>
                      <strong className="text-white">Search Space:</strong> Massive N-dimensional
                      grid (Models × RAG × ... × k × Temp).
                    </span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-blue-400 mt-2 shrink-0"></span>
                    <span>
                      <strong className="text-white">Agent Blueprint:</strong> Initial logic,
                      prompts, and tool definitions.
                    </span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-blue-400 mt-2 shrink-0"></span>
                    <span>
                      <strong className="text-white">Optimization Goal:</strong> Your EvalSet
                      (.jsonl) and KPI weights.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Output Card */}
              <div className="bg-slate-800/70 rounded-2xl p-5 border border-cyan-300/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                <h4 className="font-bold text-white text-xl mb-4">
                  <span className="text-white">Output: </span>
                  <span className="text-emerald-300">The Safest Implementation</span>
                </h4>
                <ul className="space-y-3 text-[15px] leading-relaxed">
                  <li className="flex items-start gap-3 text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
                    <span>
                      <strong className="text-white">Optimal Config:</strong> The mathematically
                      best-performing implementation.
                    </span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
                    <span>
                      <strong className="text-white">Validated KPI:</strong> Proven accuracy, speed,
                      and cost efficiency.
                    </span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
                    <span>
                      <strong className="text-white">Evidence Report:</strong> Full trial history
                      and KPI validation data.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Personas */}
        <section className="mb-10">
          <SectionHeader>Personas</SectionHeader>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
            <div>
              <p className="text-slate-200">
                <strong>AI/ML/DS Engineers:</strong> Integrate via decorator (SDK), optimize with
                code.
              </p>
            </div>
            <div>
              <p className="text-slate-200">
                <strong>No-Code Users:</strong> Visual interface for non-technical users.
              </p>
            </div>
            <div>
              <p className="text-slate-200">
                <strong>QA Users:</strong> Scalable quality validation for agentic AI
              </p>
            </div>
            <div>
              <p className="text-slate-200">
                <strong>Stakeholders:</strong> Track Business KPIs and cost-efficiency metrics
              </p>
            </div>
          </div>
        </section>

        {/* POC */}
        <section className="mb-10">
          <SectionHeader>POC Program</SectionHeader>
          <div className="grid md:grid-cols-3 gap-6">
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
              <p className="text-slate-300 text-sm">
                1-week integration & optimization on your system
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2">After</h4>
              <p className="text-slate-300 text-sm">
                Compare optimized results vs. your baseline benchmark
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="mb-10">
          <SectionHeader>Contact</SectionHeader>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="font-bold text-white">Achi Solomon | Co-founder, CEO</p>
              <p className="text-slate-300">
                <a href="mailto:achi@traigent.ai" className="text-indigo-400 hover:underline">
                  achi@traigent.ai
                </a>
                {" | "}
                <a
                  href="https://linkedin.com/in/achisolomon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:underline"
                >
                  LinkedIn
                </a>
              </p>
              <p className="text-slate-400">+972-54-7784395</p>
            </div>
            <div>
              <p className="font-bold text-white">Dr. Nimrod Busany | Co-founder, CTO</p>
              <p className="text-slate-300">
                <a href="mailto:nimrod@traigent.ai" className="text-indigo-400 hover:underline">
                  nimrod@traigent.ai
                </a>
                {" | "}
                <a
                  href="https://www.linkedin.com/in/nimrod-busany-phd-0b938216/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:underline"
                >
                  LinkedIn
                </a>
              </p>
              <p className="text-slate-400">+972-54-4553811</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="https://calendar.app.google/2aSEhm5bxo6xoPYm8"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center bg-blue-500 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:bg-blue-600 hover:scale-105 shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_40px_rgba(59,130,246,0.8)] overflow-hidden"
          >
            {/* Animated shine effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></span>

            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-xl animate-ping bg-blue-400 opacity-20"></span>

            <span className="relative z-10 flex items-center">
              Request a Demo
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
