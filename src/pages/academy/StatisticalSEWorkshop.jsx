import { Github, ExternalLink } from "lucide-react";
import AcademyCourseLayout from "../../components/academy/AcademyCourseLayout";
import AcademyGetStartedCTA from "../../components/academy/AcademyGetStartedCTA";
import WorkshopDeckCards from "../../components/academy/WorkshopDeckCards";

const COURSE_SLUG = "statistical-se-workshop";
const COURSE_TITLE = "Statistical Software Engineering for AI Agents";

// Live decks — built from Traigent/traigent-presentations and served from
// this site at /workshop/<concise|full>/. The .html suffix prevents Vite's
// SPA fallback from intercepting in dev.
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
    <>
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
        {COURSE_TITLE}
      </h1>
      <p className="text-lg text-slate-400 mb-8 leading-relaxed">
        An engineering talk with academic discipline, not a product pitch. Every
        number in the deck is anchored to a checked-in source. Two versions:
        concise (~45&nbsp;min) and full (~90&nbsp;min, 25&nbsp;slides with
        citations + speaker notes).
      </p>

      <WorkshopDeckCards
        cards={[
          {
            href: DECK_CONCISE,
            label: "CONCISE · ~45 MIN",
            title: "Open the concise deck",
            description: "Same arc, tighter pacing. Good for a single working session.",
          },
          {
            href: DECK_FULL,
            label: "FULL · ~90 MIN",
            title: "Open the full deck",
            description: "25 slides with citations, speaker notes, and methodology appendix.",
          },
        ]}
      />

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

      <div className="grid sm:grid-cols-2 gap-3 mb-12">
        <a
          href={REPO_CONCISE}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-slate-900/60 border border-slate-800 hover:border-[#4D8EF8]/40 text-white px-4 py-3 rounded-lg font-medium transition-colors"
        >
          <Github className="w-4 h-4" /> Concise deck source
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>
        <a
          href={REPO_FULL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-slate-900/60 border border-slate-800 hover:border-[#4D8EF8]/40 text-white px-4 py-3 rounded-lg font-medium transition-colors"
        >
          <Github className="w-4 h-4" /> Full deck source
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>
      </div>

      <AcademyGetStartedCTA
        prompt="Want this run on your own agent — with your data, your KPIs, your budget?"
        withTopBorder
      />
    </>
  );
}

export default function StatisticalSEWorkshop() {
  return (
    <AcademyCourseLayout
      metaTitle="Statistical SE Workshop · Traigent Academy"
      metaDescription="A 40+ minute workshop on governed AI configuration, empirical trade-offs, TVL, tunable patterns, and runnable Traigent SDK demos."
      courseSlug={COURSE_SLUG}
      courseTitle={COURSE_TITLE}
      pillLabel="TRAIGENT ACADEMY · WORKSHOP"
    >
      <CourseContent />
    </AcademyCourseLayout>
  );
}
