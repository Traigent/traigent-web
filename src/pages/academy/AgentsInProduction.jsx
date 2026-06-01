import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, GraduationCap, Clock } from "lucide-react";
import { Helmet } from "react-helmet-async";
import AcademyEmailGate from "../../components/academy/AcademyEmailGate";

const COURSE_SLUG = "agents-in-production";
const COURSE_TITLE = "Agents in Production";

// Live decks — built from Traigent/traigent-presentations and served from
// this site at /workshop/<concise|full>/. The .html suffix prevents Vite's
// SPA fallback from intercepting in dev.
const DECK_CONCISE = "/workshop/concise/index.html";
const DECK_FULL = "/workshop/full/index.html";

// Placeholder course content. Replace with the real lessons / video links /
// downloadables when the curriculum is finalized.
function CourseContent() {
  return (
    <div className="max-w-3xl mx-auto">
      <div
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-mono tracking-wider mb-4"
        style={{ color: "#4D8EF8" }}
      >
        <GraduationCap className="w-3.5 h-3.5" />
        TRAIGENT ACADEMY
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
        {COURSE_TITLE}
      </h1>
      <p className="text-lg text-slate-400 mb-8 leading-relaxed">
        A short, hands-on course for engineering teams getting an AI agent past
        the demo and into something they can defend in production.
      </p>

      {/* Open-the-deck CTAs — same decks as the deeper workshop, framed for this course */}
      <div className="grid sm:grid-cols-2 gap-3 mb-12">
        <a
          href={DECK_CONCISE}
          target="_blank"
          rel="noopener noreferrer"
          className="group block bg-slate-900/60 border border-slate-800 hover:border-[#4D8EF8]/40 rounded-xl p-5 transition-colors"
        >
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-[#4D8EF8] mb-2">
            <Clock className="w-3.5 h-3.5" /> CONCISE DECK · ~45 MIN
          </div>
          <div className="text-lg font-semibold text-white mb-1 group-hover:text-[#4D8EF8] transition-colors">
            Open the slide deck
          </div>
          <div className="text-sm text-slate-400">
            Interactive 26-slide deck. Press G for the overview grid, N for
            speaker notes.
          </div>
        </a>
        <a
          href={DECK_FULL}
          target="_blank"
          rel="noopener noreferrer"
          className="group block bg-slate-900/60 border border-slate-800 hover:border-[#4D8EF8]/40 rounded-xl p-5 transition-colors"
        >
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-[#4D8EF8] mb-2">
            <Clock className="w-3.5 h-3.5" /> FULL DECK · ~90 MIN
          </div>
          <div className="text-lg font-semibold text-white mb-1 group-hover:text-[#4D8EF8] transition-colors">
            Open the full deck
          </div>
          <div className="text-sm text-slate-400">
            25 slides with academic citations, speaker notes, and methodology
            appendix.
          </div>
        </a>
      </div>

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

        <div className="text-center">
          <p className="text-slate-400 mb-4">
            Want to see this on your own agent?
          </p>
          <Link
            to="/get-started"
            className="inline-flex items-center gap-2 bg-[#1A6BF5] hover:bg-[#4D8EF8] text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Get started in 15 minutes
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AgentsInProduction() {
  return (
    <>
      <Helmet>
        <title>Agents in Production · Traigent Academy</title>
        <meta
          name="description"
          content="A short, hands-on course on shipping AI agents to production: cost-performance optimization, observability, and re-optimization as a habit."
        />
      </Helmet>

      <section className="bg-[#080808] text-white min-h-screen py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              to="/academy"
              className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Academy
            </Link>

            <AcademyEmailGate courseSlug={COURSE_SLUG} courseTitle={COURSE_TITLE}>
              <CourseContent />
            </AcademyEmailGate>
          </motion.div>
        </div>
      </section>
    </>
  );
}
