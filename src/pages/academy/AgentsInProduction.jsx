import { Link } from "react-router-dom";
import AcademyCourseLayout from "../../components/academy/AcademyCourseLayout";
import AcademyGetStartedCTA from "../../components/academy/AcademyGetStartedCTA";
import WorkshopDeckCards from "../../components/academy/WorkshopDeckCards";

const COURSE_SLUG = "agents-in-production";
const COURSE_TITLE = "Agents in Production";

// Live decks — built from Traigent/traigent-presentations and served from
// this site at /workshop/<concise|full>/. The .html suffix prevents Vite's
// SPA fallback from intercepting in dev.
const DECK_CONCISE = "/workshop/concise/index.html";
const DECK_FULL = "/workshop/full/index.html";

function CourseContent() {
  return (
    <>
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
        {COURSE_TITLE}
      </h1>
      <p className="text-lg text-slate-400 mb-8 leading-relaxed">
        A short, hands-on course for engineering teams getting an AI agent past
        the demo and into something they can defend in production.
      </p>

      <WorkshopDeckCards
        cards={[
          {
            href: DECK_CONCISE,
            label: "CONCISE DECK · ~45 MIN",
            title: "Open the slide deck",
            description:
              "Interactive 26-slide deck. Press G for the overview grid, N for speaker notes.",
          },
          {
            href: DECK_FULL,
            label: "FULL DECK · ~90 MIN",
            title: "Open the full deck",
            description:
              "25 slides with academic citations, speaker notes, and methodology appendix.",
          },
        ]}
      />

      <div className="space-y-10">
        <section>
          <h2 className="text-2xl font-bold text-white mb-3">
            1. Why most agents stall after the demo
          </h2>
          <p className="text-slate-300 leading-relaxed">
            The first version usually works on the happy path. Production
            workloads find every other path. This module covers the failure
            modes that don't show up until traffic hits — silent quality drift,
            cost blow-up, and the &quot;every model release breaks something&quot; problem.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-3">
            2. The cost-performance frontier
          </h2>
          <p className="text-slate-300 leading-relaxed">
            Every agent has hundreds of valid configurations and you can't try
            them all by hand. This module walks through how to define the
            optimization target (KPI weights, latency budget, accuracy floor)
            so a search procedure can converge on it.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-3">
            3. Observability that's actually useful
          </h2>
          <p className="text-slate-300 leading-relaxed">
            Logs and traces alone tell you nothing about whether the agent is
            getting better or worse. This module covers the per-run telemetry
            you need (input, decision tree, cost, KPI score) and the dashboards
            that let you spot regressions early.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-3">
            4. Re-optimization as a habit, not an event
          </h2>
          <p className="text-slate-300 leading-relaxed">
            Model providers ship new versions every few weeks. Prices shift.
            Workloads drift. A one-time tuning pass is obsolete in a month.
            This module shows how to make re-convergence routine instead of a
            project.
          </p>
        </section>
      </div>

      <div className="mt-16 pt-8 border-t border-slate-800">
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8 mb-8">
          <div className="text-xs font-mono tracking-wider text-[#4D8EF8] mb-2">
            NEXT
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
            Go deeper: the Statistical SE workshop
          </h3>
          <p className="text-slate-300 leading-relaxed mb-4">
            A 40+ minute workshop on governed AI configuration, TVL, tunable
            patterns, and a runnable Traigent SDK demo. Same arc as above, with
            citations and speaker notes. Concise (45&nbsp;min) and full
            (90&nbsp;min) versions.
          </p>
          <Link
            to="/academy/statistical-se-workshop"
            className="inline-flex items-center gap-2 text-[#4D8EF8] hover:text-white font-medium transition-colors"
          >
            Open the workshop →
          </Link>
        </div>

        <AcademyGetStartedCTA />
      </div>
    </>
  );
}

export default function AgentsInProduction() {
  return (
    <AcademyCourseLayout
      metaTitle="Agents in Production · Traigent Academy"
      metaDescription="A short, hands-on course on shipping AI agents to production: cost-performance optimization, observability, and re-optimization as a habit."
      courseSlug={COURSE_SLUG}
      courseTitle={COURSE_TITLE}
    >
      <CourseContent />
    </AcademyCourseLayout>
  );
}
