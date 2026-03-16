import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import { track } from "../lib/analytics";

const campaignDays = [
  { date: "Feb 16, 2026", title: "TVars and domains", summary: "How tunable agent decisions become typed variables with explicit domains." },
  { date: "Feb 17, 2026", title: "Structural constraints", summary: "Static structure checks that block invalid configurations before runtime." },
  { date: "Feb 18, 2026", title: "Derived constraints", summary: "Relationships between variables that turn policy into executable rules." },
  { date: "Feb 19, 2026", title: "Feasible sets", summary: "How valid operating regions are computed before optimization begins." },
  { date: "Feb 20, 2026", title: "Objectives and epsilon-Pareto", summary: "Tradeoff surfaces for quality, cost, latency, and other measurable goals." },
  { date: "Feb 23, 2026", title: "Chance constraints", summary: "Promotion rules that account for uncertainty rather than point estimates alone." },
  { date: "Feb 24, 2026", title: "Banded objectives", summary: "Acceptable operating bands instead of single-metric absolutism." },
  { date: "Feb 25, 2026", title: "Promotion adjustment", summary: "How promotion policy adapts after observing real evaluation evidence." },
  { date: "Feb 26, 2026", title: "Validation workflow", summary: "Checks, QA evidence, and reproducible validation in the release loop." },
  { date: "Feb 27, 2026", title: "Bridge to OPAL", summary: "How the governance layer feeds the higher-level authoring experience." },
];

const principles = [
  "TVL is the governance and validation layer.",
  "Structural checks and behavioral checks should be described separately.",
  "Claims stay conservative and tied to reproducible evidence.",
];

export default function TvlFoundations() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <section className="border-b border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-950/60">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
          <SiteHeader className="mb-16" />

          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="max-w-4xl">
              <Link
                to="/resources"
                className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700 transition hover:text-cyan-600 dark:text-cyan-300"
                onClick={() => track("resource_open", { slug: "tvl-foundations", placement: "tvl_backlink" })}
              >
                Resources
              </Link>
              <h1 className="mt-4 text-4xl font-semibold leading-tight text-slate-900 dark:text-white md:text-6xl">
                TVL foundations
              </h1>
              <p className="mt-6 text-lg text-slate-600 dark:text-slate-300">
                This survey campaign establishes the formal governance layer in the
                Traigent stack: typed tuned variables, constraints, promotion semantics,
                and validation workflows that feed directly into OPAL-era development.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="https://github.com/Traigent/TraigentPaper"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-cyan-300 dark:text-slate-950 dark:hover:bg-cyan-200"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("resource_open", { slug: "tvl-foundations", placement: "tvl_repo" })}
                >
                  Explore TraigentPaper
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-100 p-6 dark:border-slate-800 dark:bg-slate-900/80">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700 dark:text-cyan-300">
                Core themes
              </p>
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-white p-4 dark:bg-slate-950">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Typed configuration contract</h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">TVL captures tunables, objectives, and hard constraints as machine-checkable release intent.</p>
                </div>
                <div className="rounded-2xl bg-white p-4 dark:bg-slate-950">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Promotion semantics</h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Chance constraints, banded objectives, and epsilon-Pareto logic formalize what qualifies for promotion.</p>
                </div>
                <div className="rounded-2xl bg-white p-4 dark:bg-slate-950">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Validation workflow</h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Each campaign slice ties narrative claims back to checks, QA evidence, and reproducible validation artifacts.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
              Campaign map
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
              Ten posts that build the governance layer step by step
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {campaignDays.map((day) => (
              <article
                key={day.title}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700 dark:text-cyan-300">
                  {day.date}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">
                  {day.title}
                </h3>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{day.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
              Positioning rules
            </p>
            <ul className="mt-5 space-y-3 text-slate-700 dark:text-slate-300">
              {principles.map((principle) => (
                <li key={principle}>{principle}</li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
              Source note
            </p>
            <p className="mt-5 text-slate-700 dark:text-slate-300">
              This page is a website-native index of the TVL foundations campaign. The
              working drafts, validation artifacts, and plot-generation scripts remain
              maintained in TraigentPaper.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
