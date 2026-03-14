import { Download, ExternalLink } from 'lucide-react'
import { track } from '../lib/analytics'

const ASSET_BASE = `${import.meta.env.BASE_URL}resources/traigent-evidence`

const highlightCards = [
  {
    label: '30% budget',
    value: '68% less represented evaluation spend',
    detail: '$1.14 represented spend versus a $3.59 full represented matrix.',
  },
  {
    label: '10% budget',
    value: '1.0 frontier recall',
    detail: 'A naive fixed benchmark order reached 0.8 recall on the same benchmark.',
  },
  {
    label: 'Live confirmation',
    value: '144 fresh evaluations',
    detail: 'Certified frontier matched the empirical frontier exactly with zero failures.',
  },
  {
    label: 'Live run cost',
    value: '$0.0336 total spend',
    detail: 'Mean latency was about 1.24 seconds across the live confirmation run.',
  },
]

const plotCards = [
  {
    title: 'Tuned configurations survive on the frontier',
    summary:
      'The Spider frontier is not a single model choice. Tuned agent configurations remained on the frontier alongside default and model-only variants.',
    image: `${ASSET_BASE}/spider_frontier_tradeoff.svg`,
  },
  {
    title: 'The same frontier with much less evaluation spend',
    summary:
      'Traigent recovered the correct frontier at the 30% budget setting while representing materially less evaluation spend.',
    image: `${ASSET_BASE}/spider_recall_vs_spend.svg`,
  },
  {
    title: 'Example scoring has signal, but it is not the headline',
    summary:
      'Uniqueness and informativeness both beat random selection, but the current combined heuristic is not yet the main external story.',
    image: `${ASSET_BASE}/spider_scoring_signal.svg`,
  },
  {
    title: 'Fresh live confirmation stays conservative',
    summary:
      'Replay efficiency was followed by a live confirmation run where the certified frontier matched the empirical frontier exactly.',
    image: `${ASSET_BASE}/live_confirmation_tradeoff.svg`,
  },
]

export default function TraigentEvidence() {
  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Traigent evidence brief
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight md:text-5xl">
            Faster frontier discovery, conservative promotion logic.
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-slate-300">
            Traigent helps teams find the right quality, cost, and latency operating point faster,
            especially when the real gains come from tuning the agent configuration and not just
            swapping models.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={`${ASSET_BASE}/evidence_summary.json`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-slate-100"
              onClick={() => track('resource_open', { slug: 'traigent-evidence', placement: 'traigent_json' })}
            >
              Download summary JSON
              <Download className="ml-2 h-4 w-4" />
            </a>
            <a
              href="https://github.com/Traigent/TraigentPaper"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg border border-white/20 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
              onClick={() => track('resource_open', { slug: 'traigent-evidence', placement: 'traigent_repo' })}
            >
              Source repository
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {highlightCards.map((item) => (
              <article key={item.label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">{item.label}</p>
                <h2 className="mt-4 text-2xl font-semibold text-slate-900">{item.value}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white pb-16">
        <div className="mx-auto max-w-7xl px-4 pt-2 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">Charts</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">What the current evidence supports</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {plotCards.map((plot) => (
              <figure key={plot.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <img
                  src={plot.image}
                  alt={plot.title}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50"
                />
                <figcaption className="mt-5">
                  <h3 className="text-xl font-semibold text-slate-900">{plot.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{plot.summary}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 pb-20 pt-2">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">Lead message</p>
            <ul className="mt-5 space-y-3 text-slate-700">
              <li>Traigent helps teams find the right quality, cost, and latency operating point faster.</li>
              <li>Traigent improves agent configuration, not just prompts or model selection.</li>
              <li>Final promotion stays conservative by certifying against benchmark evidence.</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
              Claims intentionally avoided
            </p>
            <ul className="mt-5 space-y-3 text-slate-700">
              <li>The combined example-scoring policy is already best in class.</li>
              <li>Fresh benchmark-native Spider execution is fully proven by this evidence set alone.</li>
              <li>The result is only a model-routing story rather than configuration optimization.</li>
            </ul>
          </article>
        </div>
      </section>
    </div>
  )
}
