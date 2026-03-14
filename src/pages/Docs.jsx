import { ArrowRight, ExternalLink, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import FlowDiagram from '../components/FlowDiagram'
import { track } from '../lib/analytics'

const docSections = [
  { id: 'overview', label: 'Start here' },
  { id: 'example', label: 'One example' },
  { id: 'paths', label: 'Public paths' },
  { id: 'workflow', label: 'Workflow' },
  { id: 'access', label: 'SDK access' },
  { id: 'reading', label: 'Further reading' },
]

const publicDocs = [
  {
    title: 'Traigent onboarding guide',
    summary:
      'Use the public onboarding path to understand evaluation flow, SDK access, and implementation entry points.',
    href: '/get-started',
    topics: ['Onboarding', 'Evaluation', 'Access'],
    external: false,
  },
  {
    title: 'TVL getting started',
    summary:
      'Use TVL when you want the public specification layer for tunable variables, objectives, and constraints.',
    href: 'https://www.tvl-lang.org/getting-started/',
    topics: ['Quickstart', 'Specification', 'Examples'],
    external: true,
  },
  {
    title: 'TVL language reference',
    summary:
      'Use the reference docs for syntax, expression semantics, modules, and TVL language behavior.',
    href: 'https://www.tvl-lang.org/reference/language/',
    topics: ['Reference', 'Syntax', 'Semantics'],
    external: true,
  },
]

const supportingLinks = [
  {
    title: 'Resources',
    summary: 'Evidence, campaign material, and public framing documents.',
    href: '/resources',
  },
  {
    title: 'One-pager',
    summary: 'Compact product overview for buyers, operators, and technical teams.',
    href: '/one-pager',
  },
  {
    title: 'Manifesto',
    summary: 'Longer-form thesis and positioning for governed agent engineering.',
    href: '/manifesto',
  },
]

const workflowCards = [
  {
    title: 'Specify the space',
    summary: 'Model tunable decisions, objectives, and constraints in TVL or a hybrid configuration space.',
  },
  {
    title: 'Evaluate with evidence',
    summary: 'Run governed optimization against datasets and operating metrics rather than intuition alone.',
  },
  {
    title: 'Promote conservatively',
    summary: 'Ship only the configurations that survive benchmark evidence and promotion rules.',
  },
]

const integrationSnippet = `import traigent

@traigent.optimize(
    configuration_space={
        "model": ["gpt-4o-mini", "gpt-4o"],
        "temperature": [0.1, 0.5, 0.9],
        "use_rag": [True, False],
    },
    objectives=["accuracy", "cost"],
    eval_dataset="eval.jsonl",
)
def answer_question(question: str) -> str:
    config = traigent.get_config()
    return run_agent(question, config)

result = answer_question.optimize()
print(result.best_config)
print(result.best_metrics)`

function EntryCard({ item }) {
  const content = (
    <>
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
        {item.external ? (
          <ExternalLink className="h-4 w-4 text-slate-400" />
        ) : (
          <ArrowRight className="h-4 w-4 text-slate-400" />
        )}
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{item.summary}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {item.topics.map((topic) => (
          <span
            key={topic}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
          >
            {topic}
          </span>
        ))}
      </div>
    </>
  )

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
        onClick={() =>
          track('docs_open', {
            title: item.title,
            href: item.href,
            placement: 'docs_public_paths',
          })
        }
      >
        {content}
      </a>
    )
  }

  return (
    <Link
      to={item.href}
      className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
      onClick={() =>
        track('docs_open', {
          title: item.title,
          href: item.href,
          placement: 'docs_public_paths',
        })
      }
    >
      {content}
    </Link>
  )
}

export default function Docs() {
  return (
    <div className="bg-slate-50">
      <section id="overview" className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 xl:grid-cols-[1.05fr_0.95fr] xl:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
                Documentation
              </p>
              <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight text-slate-950 md:text-5xl">
                Optimize an agent without rewriting it.
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
                Start with one concrete example: take an agent you already run, let Traigent test
                configuration choices against evaluation data, and promote the operating point that
                improves quality, cost, and latency conservatively.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#example"
                  className="inline-flex items-center rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  onClick={() =>
                    track('docs_open', {
                      title: 'One example',
                      href: '/docs#example',
                      placement: 'docs_hero',
                    })
                  }
                >
                  See the example
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
                <Link
                  to="/get-started"
                  className="inline-flex items-center rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-indigo-300 hover:text-indigo-600"
                  onClick={() =>
                    track('docs_open', {
                      title: 'Traigent onboarding guide',
                      href: '/get-started',
                      placement: 'docs_hero',
                    })
                  }
                >
                  Open onboarding guide
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 font-medium text-emerald-700">
                  Works with your existing agent code
                </span>
                <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 font-medium text-amber-700">
                  TVL is available as the deeper public spec layer
                </span>
              </div>

              <p className="mt-5 text-sm leading-6 text-slate-600">
                Need the public specification layer later?{' '}
                <a
                  href="https://www.tvl-lang.org/getting-started/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-indigo-600 transition hover:text-indigo-500"
                  onClick={() =>
                    track('docs_open', {
                      title: 'TVL getting started',
                      href: 'https://www.tvl-lang.org/getting-started/',
                      placement: 'docs_hero_secondary',
                    })
                  }
                >
                  Read TVL docs
                </a>
                .
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
                Example at a glance
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">
                A support agent improves without changing the app shape
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Illustrative example: Traigent tries model and runtime settings on your eval set,
                then promotes the strongest conservative configuration.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Baseline
                  </p>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-slate-300">Accuracy</span>
                      <span className="text-sm font-semibold text-white">81%</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-slate-300">Cost / run</span>
                      <span className="text-sm font-semibold text-white">$0.22</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-slate-300">Latency</span>
                      <span className="text-sm font-semibold text-white">3.4s</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-cyan-400/25 bg-cyan-400/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                    Promoted config
                  </p>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-slate-200">Accuracy</span>
                      <span className="text-sm font-semibold text-white">87%</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-slate-200">Cost / run</span>
                      <span className="text-sm font-semibold text-white">$0.18</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-slate-200">Latency</span>
                      <span className="text-sm font-semibold text-white">2.1s</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/10 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                  What changed
                </p>
                <div className="mt-4 grid gap-3">
                  {[
                    'Traigent explored model, temperature, and retrieval settings.',
                    'The app code stayed in place; only candidate configurations changed.',
                    'The promoted result came with evaluation evidence rather than guesswork.',
                  ].map((item) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <p className="text-sm leading-6 text-slate-200">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[220px,minmax(0,1fr),220px]">
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-6">
              <nav className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
                  Navigate
                </p>
                <ul className="mt-4 space-y-2">
                  {docSections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                      >
                        {section.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
                  Public now
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                  <li>Traigent onboarding and public implementation guidance</li>
                  <li>TVL getting started and language-reference docs</li>
                  <li>Evidence and framing material in the resources library</li>
                </ul>
              </div>
            </div>
          </aside>

          <main className="min-w-0 space-y-8">
            <section id="example" className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="grid gap-8 xl:grid-cols-[0.9fr,1.1fr] xl:items-start">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">One example</p>
                  <h2 className="mt-2 text-3xl font-semibold text-slate-900">
                    Start with the shape you already understand
                  </h2>
                  <p className="mt-4 text-base leading-7 text-slate-600">
                    You do not need to start with a new language. The first step is simple: wrap an
                    existing agent, define a small search space, and let Traigent optimize against
                    your eval data.
                  </p>

                  <ul className="mt-6 space-y-3 text-sm leading-6 text-slate-700">
                    <li>Keep your current agent function and runtime entry point.</li>
                    <li>Expose a few configuration choices such as model, temperature, or retrieval usage.</li>
                    <li>Optimize against eval outcomes instead of manually guessing the right settings.</li>
                  </ul>

                  <a
                    href="https://cal.com/nimrod-busany"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-indigo-300 hover:text-indigo-600"
                    onClick={() =>
                      track('docs_open', {
                        title: 'Request SDK access',
                        href: 'https://cal.com/nimrod-busany',
                        placement: 'docs_example',
                      })
                    }
                  >
                    Request the guided docs
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </div>

                <div className="overflow-hidden rounded-3xl border border-slate-900 shadow-sm">
                  <SyntaxHighlighter
                    language="python"
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      borderRadius: 0,
                      padding: '1.5rem',
                      fontSize: '0.9rem',
                      lineHeight: '1.6',
                    }}
                  >
                    {integrationSnippet}
                  </SyntaxHighlighter>
                </div>
              </div>
            </section>

            <section id="paths" className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
                Public paths
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">
                Go deeper when you need the public spec layer
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                Once the basic workflow makes sense, use the public docs surface to choose the right
                next step: onboarding first, then TVL when you want the deeper specification and
                reference layer.
              </p>

              <div className="mt-8 grid gap-6 xl:grid-cols-3">
                {publicDocs.map((item) => (
                  <EntryCard key={item.title} item={item} />
                ))}
              </div>
            </section>

            <section id="workflow" className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
                Workflow
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">
                The docs stack maps to the Traigent delivery flow
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                Public documentation should help a developer understand where TVL fits, how
                evaluation is used, and what Traigent governs before a configuration is promoted.
              </p>

              <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <FlowDiagram variant="light" />
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {workflowCards.map((card) => (
                  <article key={card.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{card.summary}</p>
                  </article>
                ))}
              </div>
            </section>

            <section id="access" className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="grid gap-8 xl:grid-cols-[1fr,0.9fr] xl:items-start">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                    <Lock className="h-4 w-4" />
                    Traigent SDK access
                  </div>
                  <h2 className="mt-5 text-3xl font-semibold text-slate-900">
                    Need the SDK documentation?
                  </h2>
                  <p className="mt-4 text-base leading-7 text-slate-600">
                    We keep SDK setup, architecture notes, and implementation walkthroughs inside
                    guided onboarding for now. That keeps the public docs surface honest while still
                    giving evaluation teams access to the material they need.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
                    Guided access includes
                  </p>
                  <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-700">
                    <li>SDK setup and minimum integration guidance</li>
                    <li>Optimization, runtime, and evaluation documentation</li>
                    <li>API, architecture, and implementation walkthroughs</li>
                  </ul>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <a
                      href="https://cal.com/nimrod-busany"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                      onClick={() =>
                        track('docs_open', {
                          title: 'Request SDK access',
                          href: 'https://cal.com/nimrod-busany',
                          placement: 'docs_access',
                        })
                      }
                    >
                      Request SDK access
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                    <Link
                      to="/get-started"
                      className="inline-flex items-center rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-indigo-300 hover:text-indigo-600"
                      onClick={() =>
                        track('docs_open', {
                          title: 'Traigent onboarding guide',
                          href: '/get-started',
                          placement: 'docs_access',
                        })
                      }
                    >
                      Open onboarding guide
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            <section id="reading" className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
                Further reading
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">
                Supporting material lives beside the docs surface
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                Product collateral and editorial framing still matter, but they should support the
                docs experience rather than replace it.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {supportingLinks.map((item) => (
                  <Link
                    key={item.title}
                    to={item.href}
                    className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-white hover:shadow-sm"
                    onClick={() =>
                      track('docs_open', {
                        title: item.title,
                        href: item.href,
                        placement: 'docs_further_reading',
                      })
                    }
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                      <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:text-indigo-600" />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{item.summary}</p>
                  </Link>
                ))}
              </div>
            </section>
          </main>

          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
                  On this page
                </p>
                <ul className="mt-4 space-y-2">
                  {docSections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                      >
                        {section.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-slate-900 bg-slate-950 p-5 text-white shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                  Search tip
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Use <span className="font-semibold text-white">Ctrl+K</span> from anywhere on the
                  site to search public docs, onboarding, and the resources library.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
