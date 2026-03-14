import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { featuredResources, resourcesCatalog } from '../content/resources'
import { track } from '../lib/analytics'

function EvidencePreview() {
  return (
    <div className="relative h-44 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-5 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.22),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.18),transparent_42%)]" />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200">
            Traigent evidence
          </span>
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-medium text-emerald-200">
            Spider + live
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            ['68%', 'less eval spend'],
            ['1.0', 'frontier recall'],
            ['144', 'live evaluations'],
          ].map(([value, label]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
              <div className="text-lg font-semibold text-white">{value}</div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-300">{label}</div>
            </div>
          ))}
        </div>

        <svg
          viewBox="0 0 260 78"
          className="absolute bottom-5 right-5 h-16 w-48 opacity-90"
          aria-hidden="true"
        >
          <path
            d="M12 60 C48 58, 74 32, 102 30 S160 16, 248 14"
            fill="none"
            stroke="#818cf8"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {[12, 102, 180, 248].map((x, index) => (
            <circle
              key={x}
              cx={x}
              cy={[60, 30, 18, 14][index]}
              r="4.5"
              fill="#f8fafc"
              stroke="#6366f1"
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>
    </div>
  )
}

function FoundationsPreview() {
  return (
    <div className="h-44 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-5">
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-700 shadow-sm">
            TVL foundations
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-indigo-600">
            10-part survey
          </span>
        </div>

        <div className="space-y-3">
          {[70, 92, 58].map((width, index) => (
            <div key={width} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="h-2 rounded-full bg-slate-200">
                <div
                  className={`h-2 rounded-full ${
                    index === 0 ? 'bg-indigo-500' : index === 1 ? 'bg-cyan-500' : 'bg-slate-400'
                  }`}
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {['Typed variables', 'Constraints', 'Validation'].map((label) => (
            <span
              key={label}
              className="rounded-full bg-white px-3 py-1 text-[11px] font-medium text-slate-600 shadow-sm"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function DefaultPreview({ resource }) {
  return (
    <div className="flex h-44 flex-col justify-between rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-100 via-slate-50 to-white p-5">
      <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 shadow-sm">
        {resource.category}
      </span>
      <div className="space-y-3">
        {[100, 84, 68].map((width) => (
          <div key={width} className="h-3 rounded-full bg-white shadow-sm">
            <div className="h-3 rounded-full bg-slate-200" style={{ width: `${width}%` }} />
          </div>
        ))}
      </div>
    </div>
  )
}

function ResourcePreview({ resource }) {
  if (resource.slug === 'traigent-evidence') {
    return <EvidencePreview />
  }

  if (resource.slug === 'tvl-foundations') {
    return <FoundationsPreview />
  }

  return <DefaultPreview resource={resource} />
}

function ResourceCard({ resource, placement }) {
  return (
    <Link
      to={resource.href}
      className="group block rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
      onClick={() =>
        track(resource.featured ? 'resource_featured_click' : 'resource_open', {
          slug: resource.slug,
          placement,
        })
      }
    >
      <ResourcePreview resource={resource} />
      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">{resource.category}</p>
        {resource.href.startsWith('/') ? (
          <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:text-indigo-600" />
        ) : (
          <ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:text-indigo-600" />
        )}
      </div>
      <h2 className="mt-3 text-2xl font-semibold text-slate-900">{resource.title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">{resource.summary}</p>
    </Link>
  )
}

export default function Resources() {
  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Resources</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight md:text-5xl">
            Evidence, framing, and public-facing material for governed agent engineering.
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-slate-300">
            Start with the strongest public material first: the Traigent evidence brief, the TVL
            foundations survey, the One-pager, and the Manifesto.
          </p>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">Featured</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">
                Start with the most concrete public evidence
              </h2>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {featuredResources.map((resource) => (
              <ResourceCard key={resource.slug} resource={resource} placement="resources_featured" />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white pb-20">
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">Library</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">Curated v1 collection</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {resourcesCatalog.map((resource) => (
              <ResourceCard key={resource.slug} resource={resource} placement="resources_library" />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
