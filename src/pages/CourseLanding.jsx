import { ArrowRight, ClipboardCheck, GitBranch, Layers } from "lucide-react";
import MarketingCard from "../components/MarketingCard";
import MarketingFooter from "../components/MarketingFooter";
import { courseLessons, plannedDemos, portalUrl, routeMeta } from "../content/siteContent";
import { usePageMeta } from "../hooks/usePageMeta";
import { trackEvent } from "../utils/analytics";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Agents in Production: Measurement, Optimization, and Governance",
  description:
    "A practical six-lesson course for teams moving from agent prototypes to governed production systems.",
  educationalLevel: "Professional",
  provider: {
    "@type": "Organization",
    name: "Traigent",
    sameAs: "https://traigent.ai",
  },
};

export default function CourseLanding() {
  const meta = routeMeta["/academy/agents-in-production"];

  usePageMeta({
    ...meta,
    path: "/academy/agents-in-production",
    structuredData,
  });

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <section className="bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">
              Free course
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-normal md:text-6xl">
              Agents in Production: Measurement, Optimization, and Governance
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Learn how to move from demos to measurable, governed, production-ready agent systems.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              [Layers, "Systems view", "Understand agents as systems with policies, routing, retrieval, tools, and operational consequences."],
              [ClipboardCheck, "Explicit criteria", "Separate objectives, constraints, scorecards, guardrails, and promotion rules."],
              [GitBranch, "Operational path", "Connect evaluation, telemetry, rollout, provenance, and governance into one workflow."],
            ].map(([Icon, title, text]) => (
              <div key={title} className="flex gap-4">
                <Icon className="mt-1 h-5 w-5 shrink-0 text-blue-700" />
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
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold tracking-normal">Lesson plan</h2>
          <p className="mt-4 text-slate-600">
            Individual lesson pages will be added after the foundation is live. This landing page
            locks the course structure, learning outcomes, exercises, and demo connections.
          </p>
        </div>
        <div className="mt-8 grid gap-5">
          {courseLessons.map((lesson) => (
            <MarketingCard key={lesson.number}>
              <div className="grid gap-5 md:grid-cols-[0.12fr_1fr_0.8fr] md:items-start">
                <p className="text-lg font-bold text-blue-700">{lesson.number}</p>
                <div>
                  <h3 className="text-xl font-semibold text-slate-950">{lesson.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{lesson.summary}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-950">Exercise</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{lesson.exercise}</p>
                  <p className="mt-3 text-sm text-slate-500">Demo pointer: {lesson.demo}</p>
                </div>
              </div>
            </MarketingCard>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="text-3xl font-bold tracking-normal">Demo connections</h2>
              <p className="mt-4 text-slate-600">
                The course points to evidence-led demos, but demo detail pages remain gated until
                their artifacts can be inspected and reproduced.
              </p>
            </div>
            <div className="grid gap-4">
              {plannedDemos.map((demo) => (
                <div key={demo.slug} className="rounded-lg border border-slate-200 bg-white p-5">
                  <h3 className="font-semibold text-slate-950">{demo.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{demo.summary}</p>
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
              <h2 className="text-2xl font-bold tracking-normal">Apply the course to your own agent system</h2>
              <p className="mt-2 text-slate-300">
                Use Traigent when your team is ready to measure, optimize, govern, and promote changes.
              </p>
            </div>
            <a
              href={portalUrl}
              onClick={() => trackEvent("portal_sign_up_cta_click", { location: "course_final_cta" })}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-100"
            >
              Try Traigent
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
