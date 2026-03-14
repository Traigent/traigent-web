import { ExternalLink } from 'lucide-react'
import { track } from '../lib/analytics'

const campaignDays = [
  { date: 'Feb 16, 2026', title: 'TVars and domains', summary: 'How tunable agent decisions become typed variables with explicit domains.' },
  { date: 'Feb 17, 2026', title: 'Structural constraints', summary: 'Static structure checks that block invalid configurations before runtime.' },
  { date: 'Feb 18, 2026', title: 'Derived constraints', summary: 'Relationships between variables that turn policy into executable rules.' },
  { date: 'Feb 19, 2026', title: 'Feasible sets', summary: 'How valid operating regions are computed before optimization begins.' },
  { date: 'Feb 20, 2026', title: 'Objectives and epsilon-Pareto', summary: 'Tradeoff surfaces for quality, cost, latency, and other measurable goals.' },
  { date: 'Feb 23, 2026', title: 'Chance constraints', summary: 'Promotion rules that account for uncertainty rather than point estimates alone.' },
  { date: 'Feb 24, 2026', title: 'Banded objectives', summary: 'Acceptable operating bands instead of single-metric absolutism.' },
  { date: 'Feb 25, 2026', title: 'Promotion adjustment', summary: 'How promotion policy adapts after observing real evaluation evidence.' },
  { date: 'Feb 26, 2026', title: 'Validation workflow', summary: 'Checks, QA evidence, and reproducible validation in the release loop.' },
  { date: 'Feb 27, 2026', title: 'Bridge to OPAL', summary: 'How the governance layer feeds the higher-level authoring experience.' },
]

export default function TvlFoundations() {
  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">TVL foundations</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight md:text-5xl">
            The governance layer behind tuned variables, promotion semantics, and validation.
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-slate-300">
            This survey campaign establishes the formal governance layer in the Traigent stack:
            typed tuned variables, constraints, promotion rules, and validation workflows that feed
            directly into later authoring experiences.
          </p>
          <div className="mt-8">
            <a
              href="https://github.com/Traigent/TraigentPaper"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-slate-100"
              onClick={() => track('resource_open', { slug: 'tvl-foundations', placement: 'tvl_repo' })}
            >
              Explore TraigentPaper
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {campaignDays.map((day) => (
              <article key={day.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">{day.date}</p>
                <h2 className="mt-3 text-xl font-semibold text-slate-900">{day.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{day.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white pb-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">Positioning rules</p>
            <ul className="mt-5 space-y-3 text-slate-700">
              <li>TVL is the governance and validation layer.</li>
              <li>Structural checks and behavioral checks should be described separately.</li>
              <li>Claims stay conservative and tied to reproducible evidence.</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">Source note</p>
            <p className="mt-5 leading-7 text-slate-700">
              This page is a website-native index of the TVL foundations campaign. The working
              drafts, validation artifacts, and plot-generation scripts remain maintained in
              TraigentPaper.
            </p>
          </article>
        </div>
      </section>
    </div>
  )
}
