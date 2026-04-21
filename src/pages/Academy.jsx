import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import MarketingCard from "../components/MarketingCard";
import MarketingFooter from "../components/MarketingFooter";
import { courseLessons, demoRequestUrl, portalUrl, routeMeta } from "../content/siteContent";
import { usePageMeta } from "../hooks/usePageMeta";
import { trackEvent } from "../utils/analytics";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Agents in Production",
  description:
    "A free practical course on measurement, optimization, telemetry, rollout, and governance for AI agents.",
  provider: {
    "@type": "Organization",
    name: "Traigent",
    sameAs: "https://traigent.ai",
  },
};

export default function Academy() {
  const meta = routeMeta["/academy"];

  usePageMeta({
    ...meta,
    path: "/academy",
    structuredData,
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
                Traigent Academy
              </p>
              <h1 className="mt-4 text-4xl font-bold tracking-normal md:text-6xl">
                Agents in Production
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
                A free practical course on measurement, optimization, telemetry, rollout, and
                governance for AI agents.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/academy/agents-in-production"
                  onClick={() => trackEvent("lesson_start", { source: "academy_hero" })}
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Start the course
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/demos"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-100"
                >
                  See demos
                </Link>
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
              <BookOpen className="h-8 w-8 text-blue-300" />
              <h2 className="mt-5 text-2xl font-semibold">Who it is for</h2>
              <p className="mt-3 text-slate-300">
                Engineering leaders, applied AI teams, platform teams, and technical product builders
                moving from prototype agents to production systems.
              </p>
              <div className="mt-6 grid gap-3">
                {["Systems view of agents", "Objectives and constraints", "Evaluation and telemetry", "Rollout and promotion patterns"].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-slate-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold tracking-normal">Why this course exists</h2>
            <p className="mt-4 text-slate-600">
              Many teams can build an impressive agent demo. Far fewer can define success clearly,
              measure behavior, explore trade-offs, govern changes, and promote improvements safely.
              This course teaches the production discipline around agents as systems.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-normal">Course outline</h2>
            <p className="mt-3 text-slate-600">
              Six lessons, each designed for an 8 to 15 minute read with an exercise and demo pointer.
            </p>
          </div>
          <Link
            to="/academy/agents-in-production"
            onClick={() => trackEvent("lesson_start", { source: "academy_outline" })}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            View course landing
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {courseLessons.map((lesson) => (
            <MarketingCard key={lesson.number}>
              <p className="text-sm font-semibold text-blue-700">Lesson {lesson.number}</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-950">{lesson.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{lesson.summary}</p>
              <p className="mt-4 text-sm text-slate-500">Related demo: {lesson.demo}</p>
            </MarketingCard>
          ))}
        </div>
      </section>

      <section className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-normal">Move from learning to evaluation</h2>
              <p className="mt-2 text-slate-600">
                Pair the course with the demo hub and the product portal when your team is ready to inspect workflows.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={portalUrl}
                onClick={() => trackEvent("portal_sign_up_cta_click", { location: "academy_final_cta" })}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Try Traigent
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={demoRequestUrl}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-100"
              >
                Request a demo
              </a>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
