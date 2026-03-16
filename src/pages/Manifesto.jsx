import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { track } from "../lib/analytics";
import SiteHeader from "../components/SiteHeader";

const Section = ({ title, children }) => (
  <section className="bg-slate-50 py-16 transition-colors dark:bg-slate-950">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-slate-100 md:text-3xl">{title}</h2>
      <div className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">{children}</div>
    </div>
  </section>
);

export default function Manifesto() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=2832&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-5xl mx-auto px-4 pb-20 pt-8 sm:px-6 lg:px-8">
          <SiteHeader variant="inverse" className="mb-12" />

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
          >
            The Traigent Manifesto
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-slate-300 max-w-3xl"
          >
            We define agent engineering as an engineering discipline, not folklore. In probabilistic systems, the spec is the product.
            Traigent runs a spec + evaluation + optimization loop that enforces constraints and blocks regressions in CI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-wrap gap-4 mt-10"
          >
            <Link
              to={"/get-started"}
              className="inline-flex items-center justify-center font-medium bg-white text-slate-900 hover:bg-gray-100 px-7 py-4 rounded-lg"
              onClick={() => track("cta_click", { location: "manifesto_hero", target: "get_started" })}
            >
              Get started (TVL + SDK)
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <a
              href="https://www.tvl-lang.org/getting-started/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center font-medium bg-transparent border border-slate-600 text-slate-200 hover:bg-white/5 px-7 py-4 rounded-lg"
              onClick={() => track("cta_click", { location: "manifesto_hero", target: "tvl_docs" })}
            >
              Learn TVL
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-violet-500"></div>
      </section>

      <Section title="The Shift: same input, different behavior">
        <p className="mb-8">
          Traditional code is deterministic. Agents are not. Change the prompt, model, or retrieval and the same question can produce a
          different answer. The building blocks of software engineering changed.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h3 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">Traditional software</h3>
            <p className="mb-4 text-slate-700 dark:text-slate-300">Write a function, write a test. If it passes, ship it.</p>
            <div className="rounded-xl bg-slate-950 text-slate-100 p-4 font-mono text-sm leading-relaxed">
              <div className="text-slate-400">{"//"} pricing function</div>
              <div>price = base_rate * quantity</div>
              <div className="text-emerald-400 mt-3">{"//"} same input → same output, every time</div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h3 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">Agent-based software</h3>
            <p className="mb-4 text-slate-700 dark:text-slate-300">Same ticket, but answer, latency, and cost shift with tuning.</p>
            <div className="rounded-xl bg-slate-950 text-slate-100 p-4 font-mono text-sm leading-relaxed">
              <div className="text-slate-400">{"//"} support agent</div>
              <div>answer = agent.run(ticket)</div>
              <div className="text-slate-400 mt-3">{"//"} tweak the prompt → different tone</div>
              <div className="text-slate-400">{"//"} swap the model → 3x cost</div>
              <div className="text-slate-400">{"//"} update retrieval → wrong answer</div>
              <div className="text-amber-400 mt-3">{"//"} no spec → no way to know what broke</div>
            </div>
          </div>
        </div>
      </Section>

      <Section title="The Consequence: under-specification ships to production">
        <p className="mb-6">
          Agents usually fail because requirements are missing, not because engineers are careless. If intent isn’t explicit, models
          fill gaps differently across contexts, versions, and workloads.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Small tuning edits can create large behavioral deltas</li>
          <li>Cost, latency, and safety boundaries drift silently</li>
          <li>Without regression gates, regression looks like improvement</li>
        </ul>
      </Section>

      <Section title="The New Discipline: specify → evaluate → optimize → apply">
        <p className="mb-8">
          Prompt-and-pray is not a workflow. Agent engineering needs machine-checkable intent, measurable outcomes, and controlled
          release decisions.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Specify",
              desc: "Define tunables, objectives, and non-negotiable constraints.",
            },
            {
              title: "Evaluate",
              desc: "Score quality, cost, latency, and safety on representative workloads in CI.",
            },
            {
              title: "Optimize",
              desc: "Search and compare configurations; choose tradeoffs intentionally.",
            },
            {
              title: "Apply",
              desc: "Promote only passing configs and keep history for rollback.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
              <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
              <p className="text-slate-700 dark:text-slate-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="We Mean It: Traigent is a discipline company">
        <p className="mb-6">
          Traigent is not a prompting tool. We build the standards, language, and control layer that make agent development repeatable
          and governable.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>TVL: machine-checkable specs for tunables, objectives, and constraints</li>
          <li>Eval gates + enforcement: requirements stay enforceable before release</li>
          <li>Governed optimization: improvements are measured and comparable on real workloads</li>
          <li>Run history: reproduce, audit, and rollback with confidence</li>
        </ul>
      </Section>

      <section className="bg-gradient-to-br from-cyan-500 via-indigo-600 to-violet-700 py-16 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to engineer your agents?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-3xl">
            Start with TVL to make intent explicit. Add evaluation gates and governed optimization as your agent surface area grows.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to={"/get-started"}
              className="inline-flex items-center justify-center rounded-lg bg-white px-7 py-4 font-medium text-indigo-700 transition hover:bg-slate-100"
              onClick={() => track("cta_click", { location: "manifesto_footer", target: "get_started" })}
            >
              Get started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <a
              href="https://cal.com/nimrod-busany"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white/40 bg-transparent px-7 py-4 font-medium text-white transition hover:bg-white/10"
              onClick={() => track("cta_click", { location: "manifesto_footer", target: "talk_to_us" })}
            >
              Talk to us
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
