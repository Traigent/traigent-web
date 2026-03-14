import { ArrowRight, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { track } from '../lib/analytics'

const sections = [
  {
    title: 'The Shift',
    body:
      'Traditional code is deterministic. Agents are not. Change the prompt, model, or retrieval and the same task can produce a different answer, latency profile, or cost outcome. The spec became part of the product.',
  },
  {
    title: 'The Consequence',
    body:
      'Most agent failures are under-specification failures. Requirements stay implicit, behavior drifts silently, and teams ship changes without a reliable way to tell improvement from regression.',
  },
  {
    title: 'The Discipline',
    body:
      'Agent engineering needs explicit intent, evaluation on representative workloads, governed optimization, and release decisions that can be audited and rolled back.',
  },
  {
    title: 'The Position',
    body:
      'Traigent is building the standards, language, and control layer that make agent development repeatable and governable. In probabilistic systems, the spec is the product.',
  },
]

export default function Manifesto() {
  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-gradient-to-br from-slate-950 to-indigo-950 text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Manifesto</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight md:text-5xl">
            Agent engineering is an engineering discipline, not folklore.
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-slate-300">
            Traigent runs a spec, evaluation, optimization, and release loop that makes agent
            behavior measurable before it ships.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/get-started"
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-slate-100"
              onClick={() => track('cta_click', { location: 'manifesto_hero', target: 'get_started' })}
            >
              Get started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <a
              href="https://www.tvl-lang.org/getting-started/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg border border-white/20 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
              onClick={() => track('cta_click', { location: 'manifesto_hero', target: 'tvl_docs' })}
            >
              Learn TVL
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <h2 className="text-2xl font-semibold text-slate-900">{section.title}</h2>
              <p className="mt-4 leading-7 text-slate-700">{section.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-slate-950 px-8 py-12 text-white">
            <h2 className="text-2xl font-semibold">Ready to engineer your agents?</h2>
            <p className="mt-4 max-w-3xl text-slate-300">
              Start with TVL to make intent explicit. Add evaluation gates and governed
              optimization as your agent surface area grows.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/get-started"
                className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 font-semibold text-slate-950 transition hover:bg-slate-100"
                onClick={() => track('cta_click', { location: 'manifesto_footer', target: 'get_started' })}
              >
                Get started
              </Link>
              <a
                href="https://cal.com/nimrod-busany"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
                onClick={() => track('cta_click', { location: 'manifesto_footer', target: 'book_demo' })}
              >
                Talk to us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
