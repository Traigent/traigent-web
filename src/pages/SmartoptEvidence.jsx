import { Download, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import { track } from "../lib/analytics";

const ASSET_BASE = `${import.meta.env.BASE_URL}resources/smartopt`;

const highlightCards = [
  {
    label: "30% budget",
    value: "68% less represented evaluation spend",
    detail: "$1.14 represented spend versus a $3.59 full represented matrix.",
  },
  {
    label: "10% budget",
    value: "1.0 frontier recall",
    detail: "A naive fixed benchmark order reached 0.8 recall on the same benchmark.",
  },
  {
    label: "Live confirmation",
    value: "144 fresh evaluations",
    detail: "Certified frontier matched the empirical frontier exactly with zero failures.",
  },
  {
    label: "Live run cost",
    value: "$0.0336 total spend",
    detail: "Mean latency was about 1.24 seconds across the live confirmation run.",
  },
];

const plotCards = [
  {
    title: "Tuned configurations survive on the frontier",
    summary:
      "The Spider frontier is not a single model choice. Tuned agent configurations remained on the frontier alongside default and model-only variants.",
    image: `${ASSET_BASE}/spider_frontier_tradeoff.svg`,
  },
  {
    title: "The same frontier with much less evaluation spend",
    summary:
      "Smartopt recovered the correct frontier at the 30% budget setting while representing materially less evaluation spend.",
    image: `${ASSET_BASE}/spider_recall_vs_spend.svg`,
  },
  {
    title: "Example scoring has signal, but it is not the headline",
    summary:
      "Uniqueness and informativeness both beat random selection, but the current combined heuristic is not yet the main external story.",
    image: `${ASSET_BASE}/spider_scoring_signal.svg`,
  },
  {
    title: "Fresh live confirmation stays conservative",
    summary:
      "Replay efficiency was followed by a live confirmation run where the certified frontier matched the empirical frontier exactly.",
    image: `${ASSET_BASE}/live_confirmation_tradeoff.svg`,
  },
];

export default function SmartoptEvidence() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <section className="border-b border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-950/60">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
          <SiteHeader className="mb-16" />

          <div className="max-w-4xl">
            <Link
              to="/resources"
              className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700 transition hover:text-cyan-600 dark:text-cyan-300"
              onClick={() => track("resource_open", { slug: "smartopt-evidence", placement: "smartopt_backlink" })}
            >
              Resources
            </Link>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-slate-900 dark:text-white md:text-6xl">
              Smartopt evidence brief
            </h1>
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-300">
              Smartopt helps teams find the right quality, cost, and latency operating
              point faster, especially when the real gains come from tuning the agent
              configuration and not just swapping models.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`${ASSET_BASE}/evidence_summary.json`}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-cyan-300 dark:text-slate-950 dark:hover:bg-cyan-200"
                onClick={() => track("resource_open", { slug: "smartopt-evidence", placement: "smartopt_json_download" })}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download summary JSON
                <Download className="h-4 w-4" />
              </a>
              <a
                href="https://github.com/Traigent/TraigentPaper"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-cyan-300 hover:text-cyan-700 dark:border-slate-700 dark:text-slate-100 dark:hover:text-cyan-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                Source repository
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {highlightCards.map((item) => (
              <article
                key={item.label}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700 dark:text-cyan-300">
                  {item.label}
                </p>
                <h2 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-white">
                  {item.value}
                </h2>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
              Charts
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
              What the current evidence supports
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {plotCards.map((plot) => (
              <figure
                key={plot.title}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
              >
                <img
                  src={plot.image}
                  alt={plot.title}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-950"
                />
                <figcaption className="mt-5">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {plot.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {plot.summary}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
              Lead message
            </p>
            <ul className="mt-5 space-y-3 text-slate-700 dark:text-slate-300">
              <li>Traigent helps teams find the right quality, cost, and latency operating point faster.</li>
              <li>Smartopt optimizes agent configuration, not just prompt tweaks or model routing.</li>
              <li>Final promotion stays conservative by certifying against benchmark evidence.</li>
            </ul>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
              Claims intentionally avoided
            </p>
            <ul className="mt-5 space-y-3 text-slate-700 dark:text-slate-300">
              <li>The combined example-scoring policy is already best in class.</li>
              <li>Fresh benchmark-native Spider execution is fully proven through Smartopt alone.</li>
              <li>The result is only a model-routing story rather than configuration optimization.</li>
            </ul>
          </article>
        </div>
      </section>
    </div>
  );
}
