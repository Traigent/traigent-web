import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, GraduationCap, Github, ExternalLink, Clock } from "lucide-react";
import { Helmet } from "react-helmet-async";
import AcademyEmailGate from "../../components/academy/AcademyEmailGate";

const COURSE_SLUG = "statistical-se-workshop";
const COURSE_TITLE = "Statistical Software Engineering for AI Agents";

// Live decks — built from Traigent/traigent-presentations and served from
// this site at /workshop/<concise|full>/. The deck builds need `index.html`
// in the URL so the dev server doesn't intercept with the SPA fallback.
const DECK_CONCISE = "/workshop/concise/index.html";
const DECK_FULL = "/workshop/full/index.html";
// Source-on-GitHub links (for the "view the source" buttons further down).
const REPO_CONCISE =
  "https://github.com/Traigent/traigent-presentations/tree/main/academic-practical-workshop-concise";
const REPO_FULL =
  "https://github.com/Traigent/traigent-presentations/tree/main/academic-practical-workshop";

// The six-act arc of the workshop, lifted from the deck structure.
const ACTS = [
  {
    label: "Act 1",
    title: "Framing",
    text:
      "From assigned values to governed variables. Why classic “pick a config and ship” thinking breaks down when behavior is statistical, and what replaces it.",
  },
  {
    label: "Act 2",
    title: "Statistical Software Engineering",
    text:
      "Why behavior becomes statistical. TVars create program families. Structural feasibility, operational evidence, and governed promotion as the engineering move.",
  },
  {
    label: "Act 3",
    title: "The TVL Contract",
    text:
      "Tuned Variables Language as a checked, replayable contract for AI configuration. Replay evidence, promotion traces, and integration into CI/CD.",
  },
  {
    label: "Act 4",
    title: "Workflow design choices as evidence",
    text:
      "The ASE review-batching study used as proof that workflow-level choices are themselves control surfaces — with measurable recovery patterns.",
  },
  {
    label: "Act 5",
    title: "Tunable patterns",
    text:
      "Contextual batching, routed expertise, reflective refinement. Patterns treated as tunable variables rather than fixed templates, with a pattern map across agent shapes.",
  },
  {
    label: "Act 6",
    title: "Traigent SDK in practice",
    text:
      "From spec to optimizer to demo. The SDK mental model, a deterministic main demo, and a backup demo path. Ends with a synthesis and methodology appendix.",
  },
];

function CourseContent() {
  return (
    <div className="max-w-3xl mx-auto">
      <div
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-mono tracking-wider mb-4"
        style={{ color: "#4D8EF8" }}
      >
        <GraduationCap className="w-3.5 h-3.5" />
        TRAIGENT ACADEMY · WORKSHOP
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
        {COURSE_TITLE}
      </h1>
      <p className="text-lg text-slate-400 mb-8 leading-relaxed">
        An engineering talk with academic discipline, not a product pitch. Every
        number in the deck is anchored to a checked-in source. Two versions:
        concise (~45&nbsp;min) and full (~90&nbsp;min, 25&nbsp;slides with
        citations + speaker notes).
      </p>

      {/* Two open-the-deck CTAs — links go to the live decks hosted on this site */}
      <div className="grid sm:grid-cols-2 gap-3 mb-12">
        <a
          href={DECK_CONCISE}
          target="_blank"
          rel="noopener noreferrer"
          className="group block bg-slate-900/60 border border-slate-800 hover:border-[#4D8EF8]/40 rounded-xl p-5 transition-colors"
        >
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-[#4D8EF8] mb-2">
            <Clock className="w-3.5 h-3.5" /> CONCISE · ~45 MIN
          </div>
          <div className="text-lg font-semibold text-white mb-1 group-hover:text-[#4D8EF8] transition-colors">
            Open the concise deck
          </div>
          <div className="text-sm text-slate-400">
            Same arc, tighter pacing. Good for a single working session.
          </div>
        </a>
        <a
          href={DECK_FULL}
          target="_blank"
          rel="noopener noreferrer"
          className="group block bg-slate-900/60 border border-slate-800 hover:border-[#4D8EF8]/40 rounded-xl p-5 transition-colors"
        >
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-[#4D8EF8] mb-2">
            <Clock className="w-3.5 h-3.5" /> FULL · ~90 MIN
          </div>
          <div className="text-lg font-semibold text-white mb-1 group-hover:text-[#4D8EF8] transition-colors">
            Open the full deck
          </div>
          <div className="text-sm text-slate-400">
            25 slides with citations, speaker notes, and methodology appendix.
          </div>
        </a>
      </div>

      {/* The workshop arc */}
      <h2 className="text-2xl font-bold text-white mb-4">Workshop arc</h2>
      <div className="space-y-6 mb-12">
        {ACTS.map((a) => (
          <div key={a.label} className="flex gap-4">
            <div className="flex-shrink-0 w-16 pt-0.5">
              <div className="text-xs font-mono tracking-wider text-[#4D8EF8]">
                {a.label.toUpperCase()}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">
                {a.title}
              </h3>
              <p className="text-slate-300 leading-relaxed">{a.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Run-it-yourself */}
      <h2 className="text-2xl font-bold text-white mb-3">Run it yourself</h2>
      <p className="text-slate-300 mb-4 leading-relaxed">
        Both decks are React + Vite. Clone the repo, install, and open the deck
        in your browser. Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs font-mono">G</kbd>{" "}
        for an overview grid,{" "}
        <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs font-mono">N</kbd>{" "}
        for speaker notes, and append{" "}
        <code className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs font-mono text-[#4D8EF8]">
          ?export=1
        </code>{" "}
        to render every slide for printing to PDF.
      </p>
      <pre className="bg-[#0a0f1c] border border-slate-800 rounded-xl p-4 text-sm font-mono text-slate-200 overflow-x-auto mb-4">
{`# Concise version
git clone https://github.com/Traigent/traigent-presentations.git
cd traigent-presentations/academic-practical-workshop-concise
npm install
npm run dev          # http://localhost:4175

# Full version
cd ../academic-practical-workshop
npm install
npm run dev          # http://localhost:4174`}
      </pre>
      <p className="text-slate-400 text-sm mb-12">
        The deck embeds a runnable Traigent SDK demo. The main demo path uses
        the JS SDK quickstart from{" "}
        <code className="text-[#4D8EF8]">examples/quickstart/01_simple_qa.mjs</code>{" "}
        in the <code className="text-[#4D8EF8]">traigent-js</code> repo.
      </p>

      {/* Source / CTA */}
      <div className="grid sm:grid-cols-2 gap-3 mb-12">
        <a
          href="https://github.com/Traigent/traigent-presentations"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-slate-900/60 border border-slate-800 hover:border-[#4D8EF8]/40 text-white px-4 py-3 rounded-lg font-medium transition-colors"
        >
          <Github className="w-4 h-4" /> Workshop source on GitHub
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>
        <a
          href="https://github.com/Traigent/traigent-js"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-slate-900/60 border border-slate-800 hover:border-[#4D8EF8]/40 text-white px-4 py-3 rounded-lg font-medium transition-colors"
        >
          <Github className="w-4 h-4" /> Traigent JS SDK on GitHub
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>
      </div>

      <div className="mt-8 pt-8 border-t border-slate-800 text-center">
        <p className="text-slate-400 mb-4">
          Want this run on your own agent — with your data, your KPIs, your
          budget?
        </p>
        <Link
          to="/get-started"
          className="inline-flex items-center gap-2 bg-[#1A6BF5] hover:bg-[#4D8EF8] text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Get started in 15 minutes
        </Link>
      </div>
    </div>
  );
}

export default function StatisticalSEWorkshop() {
  return (
    <>
      <Helmet>
        <title>Statistical SE Workshop · Traigent Academy</title>
        <meta
          name="description"
          content="A 40+ minute workshop on governed AI configuration, empirical trade-offs, TVL, tunable patterns, and runnable Traigent SDK demos."
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
