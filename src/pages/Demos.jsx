import { ArrowRight, FlaskConical, Github, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import MarketingCard from "../components/MarketingCard";
import MarketingFooter from "../components/MarketingFooter";
import { demoRequestUrl, plannedDemos, portalUrl } from "../content/siteContent";
import { usePageMeta } from "../hooks/usePageMeta";
import { trackEvent } from "../utils/analytics";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Traigent Demos",
  url: "https://traigent.ai/demos",
  description:
    "Reproducible demos for governed AI agent optimization, rollout, and promotion.",
};

const artifactContract = [
  "Public repository or public folder in a public repository",
  "README.md with one-command or clearly sequenced reproduction steps",
  "specs/ with the problem definition, tunables, objectives, and constraints",
  "scripts/ for data preparation, baseline runs, optimization, evaluation, and report generation",
  "Synthetic or permissively licensed dataset, dataset generator, and provenance notes",
  "Pinned dependencies through a lockfile or equivalent reproducible environment",
  "Expected outputs, checked-in result artifacts, charts, and limitations",
  "License plus a tagged release or fixed commit for every website link",
];

export default function Demos() {
  usePageMeta({
    title: "Demos - Traigent",
    description:
      "Explore planned reproducible demos for governed agent optimization across quality, cost, latency, routing, and promotion decisions.",
    path: "/demos",
    structuredData,
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <section className="bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">
              Evidence-led examples
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-normal md:text-6xl">
              See governed agent engineering in practice
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Explore demos designed to show how Traigent helps teams optimize quality,
              latency, cost, routing, and promotion decisions in production-like agent systems.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/academy/agents-in-production"
                onClick={() => trackEvent("lesson_start", { source: "demos_hero" })}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-100"
              >
                Start the course
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={demoRequestUrl}
                onClick={() => trackEvent("demo_page_try_traigent_click", { source: "demos_hero" })}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-5 py-3 text-sm font-semibold text-white hover:bg-white/5"
              >
                Request a demo
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              ["Problem definition", "Each demo must state the production problem, tunables, objectives, and constraints."],
              ["Method trail", "Datasets, specs, scripts, reports, and charts must map back to the public artifacts."],
              ["No placeholder proof", "Individual demo pages stay unpublished until the matching repo assets are reproducible."],
            ].map(([title, text]) => (
              <div key={title} className="flex gap-4">
                <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-emerald-600" />
                <div>
                  <h2 className="font-semibold text-slate-950">{title}</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-normal">Launch demo set</h2>
          <p className="mt-4 text-slate-600">
            These demo detail pages are intentionally gated until their public GitHub artifacts
            exist and can reproduce the results shown on the site.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {plannedDemos.map((demo) => (
            <MarketingCard key={demo.slug} className="flex flex-col">
              <div className="flex items-center justify-between gap-3">
                <FlaskConical className="h-6 w-6 text-blue-600" />
                <span className="rounded-lg bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  {demo.status}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-semibold text-slate-950">{demo.title}</h3>
              <p className="mt-2 text-sm font-medium text-slate-500">{demo.kicker}</p>
              <p className="mt-4 text-sm leading-6 text-slate-600">{demo.summary}</p>
              <div className="mt-5">
                <h4 className="text-sm font-semibold text-slate-950">What is tunable</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {demo.tunables.map((item) => (
                    <span key={item} className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-5">
                <h4 className="text-sm font-semibold text-slate-950">Objectives</h4>
                <p className="mt-2 text-sm text-slate-600">{demo.objectives.join(", ")}</p>
              </div>
              <div className="mt-auto pt-6">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Related</p>
                <p className="mt-1 text-sm text-slate-700">{demo.relatedLesson}</p>
              </div>
            </MarketingCard>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-normal">Reproducibility standard</h2>
              <p className="mt-4 max-w-3xl text-slate-600">
                Every published demo must include the problem definition, tunable variables,
                objectives, constraints, dataset, scripts, and resulting artifacts. If a visitor
                cannot inspect the method, the demo is not credible enough to publish.
              </p>
            </div>
            <div className="rounded-lg border border-dashed border-slate-300 p-5 text-sm text-slate-600">
              <Github className="mb-3 h-5 w-5 text-slate-800" />
              GitHub artifact links will appear here after the public demo repository and sample
              runs are ready.
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="text-2xl font-bold tracking-normal">Demo artifact contract</h2>
              <p className="mt-4 text-slate-600">
                A demo page can go live only when the linked public artifacts meet this minimum bar.
                The preferred destination is a separate public demo repository rather than the
                website repository.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {artifactContract.map((item) => (
                <div key={item} className="rounded-lg border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-normal">Ready to evaluate Traigent?</h2>
              <p className="mt-2 text-slate-300">
                Use the portal for the product surface, or talk to us about a production agent workflow.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={portalUrl}
                onClick={() => trackEvent("demo_page_try_traigent_click", { source: "demos_final_cta" })}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-100"
              >
                Try Traigent
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                to="/specifications"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-5 py-3 text-sm font-semibold text-white hover:bg-white/5"
              >
                View specifications bridge
              </Link>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
