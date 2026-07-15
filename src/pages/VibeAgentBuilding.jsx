import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Copy, ThumbsDown, ThumbsUp, ChevronDown } from "lucide-react";
import { trackEvent } from "../lib/analytics";

const AMBER = "#f59e0b";
const BLUE = "#1A6BF5";
const DEMO_URL = "https://meetings-eu1.hubspot.com/amir8";

const DEFINITION_TEXT =
  `vibe agent building (n.)\n` +
  `Building an AI agent by describing what you want and reacting to what you get — while a coding agent and Traigent handle the repetitive building, testing, and improving, and trustworthy evaluation sets and evaluators decide what "good" actually means.\n\n` +
  `You bring the taste. The loop brings the proof.`;

const SHARE_TEXT =
  `Vibe Agent Building: you bring the taste, the loop brings the proof. → https://traigent.ai/vibe-agent-building`;

// Copies text via the async Clipboard API where available, falling back to a
// hidden textarea + execCommand for insecure contexts / older browsers.
async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const el = document.createElement("textarea");
  el.value = text;
  el.style.position = "fixed";
  el.style.opacity = "0";
  document.body.appendChild(el);
  el.focus();
  el.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  } finally {
    document.body.removeChild(el);
  }
  if (!ok) throw new Error("copy command failed");
}

function CopyButton({ text, label, copiedLabel, errorLabel, trackName, className }) {
  const [state, setState] = useState("idle"); // idle | copied | error

  const handleClick = async () => {
    try {
      await copyText(text);
      setState("copied");
      if (trackName) trackEvent(trackName, {});
    } catch {
      setState("error");
    } finally {
      setTimeout(() => setState("idle"), 2200);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        className ||
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-white text-xs sm:text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"
      }
    >
      {state === "copied" ? (
        <>
          <Check className="w-3.5 h-3.5 text-amber-400" />
          {copiedLabel || "Copied"}
        </>
      ) : state === "error" ? (
        <span className="text-red-400">{errorLabel || "Couldn't copy — select the text manually"}</span>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          {label}
        </>
      )}
    </button>
  );
}

const FadeIn = ({ children, delay = 0, className = "", ...rest }) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div {...rest} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      {...rest}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const scrollToId = (id) => (e) => {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

// DictionaryCard — the shareable, screenshot-friendly definition. Used in the
// hero-adjacent §2 spot and, in miniature, in the closing footer.
function DictionaryCard({ compact = false }) {
  return (
    <div
      className={`bg-slate-900/60 border border-slate-700 rounded-2xl ${
        compact ? "p-5" : "p-7 md:p-9"
      }`}
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p
            className={`font-serif italic text-white ${compact ? "text-xl" : "text-2xl md:text-3xl"}`}
          >
            vibe agent building
          </p>
          <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mt-1">
            noun
          </p>
        </div>
        {!compact && (
          <CopyButton
            text={DEFINITION_TEXT}
            label="Copy definition"
            copiedLabel="Copied to clipboard"
            trackName="vibe_definition_copied"
          />
        )}
      </div>
      <p className={`text-slate-300 leading-relaxed mt-4 ${compact ? "text-sm" : "text-base md:text-lg"}`}>
        Building an AI agent by describing what you want and reacting to what you get — while a
        coding agent and Traigent handle the repetitive building, testing, and improving, and{" "}
        <span className="text-white font-semibold">trustworthy evaluation sets and evaluators</span>{" "}
        decide what "good" actually means.
      </p>
      <p className="mt-4 text-sm md:text-base font-semibold">
        <span style={{ color: AMBER }}>You bring the taste.</span>{" "}
        <span style={{ color: BLUE }}>The loop brings the proof.</span>
      </p>
      {compact && (
        <div className="mt-4">
          <CopyButton
            text={DEFINITION_TEXT}
            label="Copy definition"
            copiedLabel="Copied"
            trackName="vibe_definition_copied"
          />
        </div>
      )}
    </div>
  );
}

const LOOP_STEPS = [
  {
    id: "describe",
    n: "1",
    title: "Describe",
    owner: "human",
    caption: "You tell a coding agent what the agent should do, in plain language.",
  },
  {
    id: "define",
    n: "2",
    title: "Define good",
    owner: "human",
    caption: "Real examples plus evaluators you'd trust to grade a human become your evaluation set.",
  },
  {
    id: "build",
    n: "3",
    title: "Build",
    owner: "machine",
    caption: "The coding agent writes the scaffolding, tools, and glue — in your repo, readable by your team.",
  },
  {
    id: "test",
    n: "4",
    title: "Test & improve",
    owner: "machine",
    caption: "Traigent scores every candidate on your evaluation set and maps the accuracy-cost tradeoff.",
  },
  {
    id: "judge",
    n: "5",
    title: "Judge & feed back",
    owner: "human",
    caption: "You review real outputs. Every note you leave becomes a new evaluation example.",
  },
];

// LoopDiagram — motion moment M1. Cycles the five stations with a fading
// caption when motion is allowed; renders every station and caption at once,
// statically, when the visitor prefers reduced motion.
function LoopDiagram() {
  const prefersReducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const id = setInterval(() => setActive((i) => (i + 1) % LOOP_STEPS.length), 2600);
    return () => clearInterval(id);
  }, [prefersReducedMotion]);

  return (
    <div>
      <div
        className="flex flex-wrap items-start justify-center gap-x-1 gap-y-6 mb-6"
        role="list"
        aria-label="The Vibe Agent Building loop, five stations"
      >
        {LOOP_STEPS.map((step, i) => {
          const color = step.owner === "human" ? AMBER : BLUE;
          const isActive = !prefersReducedMotion && i === active;
          return (
            <div key={step.id} className="flex items-start" role="listitem">
              <div className="flex flex-col items-center gap-1.5 text-center w-20 sm:w-24">
                <motion.div
                  animate={
                    prefersReducedMotion
                      ? {}
                      : { scale: isActive ? 1.12 : 1, opacity: isActive ? 1 : 0.55 }
                  }
                  transition={{ duration: 0.4 }}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-mono text-sm font-bold border-2"
                  style={{ borderColor: color, color, backgroundColor: `${color}1A` }}
                >
                  {step.n}
                </motion.div>
                <span className="text-xs sm:text-sm font-semibold text-white leading-tight">
                  {step.title}
                </span>
                <span className="text-[9px] font-mono uppercase tracking-wider" style={{ color }}>
                  {step.owner === "human" ? "you" : "the loop"}
                </span>
              </div>
              {i < LOOP_STEPS.length - 1 && (
                <div
                  className="hidden sm:block w-6 md:w-10 h-px bg-slate-700 mt-5"
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>

      {prefersReducedMotion ? (
        <ul className="space-y-2 max-w-2xl mx-auto">
          {LOOP_STEPS.map((step) => (
            <li key={step.id} className="text-sm text-slate-300">
              <span className="font-semibold" style={{ color: step.owner === "human" ? AMBER : BLUE }}>
                {step.title}.
              </span>{" "}
              {step.caption}
            </li>
          ))}
        </ul>
      ) : (
        <AnimatePresence mode="wait">
          <motion.p
            key={LOOP_STEPS[active].id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="text-center text-sm sm:text-base text-slate-300 max-w-xl mx-auto min-h-[3rem]"
          >
            <span
              className="font-semibold"
              style={{ color: LOOP_STEPS[active].owner === "human" ? AMBER : BLUE }}
            >
              {LOOP_STEPS[active].title}.
            </span>{" "}
            {LOOP_STEPS[active].caption}
          </motion.p>
        </AnimatePresence>
      )}
    </div>
  );
}

// TerminalScene — an illustrative, plain-language session. No invented CLI
// commands and no fixed performance numbers; it narrates real, public
// capabilities (a coding agent scaffolding code, Traigent taking a declared
// search space + eval_dataset) without exposing any planner/search internals.
function TerminalScene() {
  const lines = [
    {
      who: "you",
      text:
        "Build me an agent that answers billing questions from our help-center docs. Friendly, concise, never invents a refund policy.",
    },
    {
      who: "agent",
      text:
        "Scaffolding a retrieval agent in agents/billing_qa.py. Your resolved billing tickets look like a strong starter evaluation set — pulling in the ones with a clear right answer. Adding an evaluator that fails any answer citing a policy not in the docs.",
    },
    {
      who: "agent",
      text:
        "Handing Traigent the search space — models, temperature, retrieval depth, prompt variants — with accuracy and cost as the objectives, scored against your evaluation set.",
    },
    {
      who: "agent",
      text:
        "Run complete. One configuration scores higher on your evaluation set at lower cost than the default. Full breakdown is in the portal — want to look at the cases it still gets wrong?",
    },
    { who: "you", text: "Yes. And the tone on #2 is too stiff — here's how we'd actually say it…" },
  ];

  return (
    <div className="rounded-xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 text-slate-500">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-2 text-xs font-mono">agent session</span>
      </div>
      <div className="p-4 sm:p-5 font-mono text-xs sm:text-sm space-y-3 max-h-[26rem] overflow-y-auto">
        {lines.map((l, i) => (
          <p key={i} className="leading-relaxed break-words">
            <span className="font-bold" style={{ color: l.who === "you" ? AMBER : BLUE }}>
              {l.who} ▸{" "}
            </span>
            <span className="text-slate-300">{l.text}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

// FeedbackDemo — motion moment M2. Cycles a thumbs-down note becoming a new
// evaluation example when motion is allowed; shows both frames side by side,
// statically, when reduced motion is preferred.
function FeedbackDemo() {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState("before"); // "before" | "after"

  useEffect(() => {
    if (prefersReducedMotion) return;
    const id = setInterval(() => setPhase((p) => (p === "before" ? "after" : "before")), 3600);
    return () => clearInterval(id);
  }, [prefersReducedMotion]);

  const DraftCard = () => (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 text-sm">
      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-2">
        Agent draft · lead reply #31
      </div>
      <p className="text-slate-300 mb-3">"Thanks for reaching out! Our Enterprise tier includes…"</p>
      <div className="flex items-center gap-3 mb-3">
        <ThumbsUp className="w-4 h-4 text-slate-600" aria-hidden="true" />
        <span className="flex items-center gap-1 text-amber-400" aria-label="Marked as not good">
          <ThumbsDown className="w-4 h-4" />
          <Check className="w-3 h-3" />
        </span>
      </div>
      <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-2 text-slate-300 text-xs sm:text-sm">
        Too pushy — we never pitch tiers in the first reply. Answer the question first.
      </div>
    </div>
  );

  const EvalStack = () => (
    <div className="bg-slate-900/70 border border-amber-500/30 rounded-xl p-4 flex flex-col items-center justify-center text-center h-full">
      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-2">
        Your evaluation set
      </div>
      <div className="text-3xl font-extrabold text-amber-400">61</div>
      <div className="text-xs text-slate-400 mt-1">
        examples · every future candidate is graded on all of them
      </div>
    </div>
  );

  if (prefersReducedMotion) {
    return (
      <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-2 text-center">
            Before
          </div>
          <DraftCard />
        </div>
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-2 text-center">
            After
          </div>
          <EvalStack />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto min-h-[210px]">
      <AnimatePresence mode="wait">
        {phase === "before" ? (
          <motion.div
            key="before"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.94, y: -14 }}
            transition={{ duration: 0.5 }}
          >
            <DraftCard />
          </motion.div>
        ) : (
          <motion.div
            key="after"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <EvalStack />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const FAQS = [
  {
    q: "Is this a product or a buzzword?",
    a: "A working method with a name. The pieces exist today: any coding agent, the Traigent SDK, and your evaluation set. The name exists so teams can ask for it by name.",
  },
  {
    q: "Do I need to code?",
    a: "Someone on your side runs a coding agent — that can be a developer or, increasingly, you. Your jobs that nothing automates are describing the agent, defining what good means, and judging the results.",
  },
  {
    q: "Will it get everything right?",
    a: "No agent does. It will be measured: you'll know what it scores, which cases it fails, and what each improvement costs. That's more than most shipped agents can say.",
  },
  {
    q: "What don't you automate?",
    a: "Taste. The evaluation set is yours, the evaluators answer to you, and the ship decision is yours. On purpose.",
  },
  {
    q: "We already write evals.",
    a: "Then you're most of the way there. Your evaluation set is the asset — Vibe Agent Building is what it's for. Traigent uses it to search configurations no one would test by hand, and every reviewer note keeps growing it.",
  },
];

function FAQItem({ q, a, isOpen, onToggle }) {
  return (
    <div className="border-b border-slate-800">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4D8EF8]"
      >
        <span className="text-base md:text-lg font-semibold text-white group-hover:text-[#4D8EF8] transition-colors">
          {q}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 flex-shrink-0 mt-1 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          isOpen ? "max-h-96 pb-5" : "max-h-0"
        }`}
      >
        <p className="text-slate-300 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

const definedTermSchema = {
  "@context": "https://schema.org",
  "@type": "DefinedTerm",
  name: "Vibe Agent Building",
  description:
    'Building an AI agent by describing what you want and reacting to what you get, while a coding agent and Traigent handle the repetitive building, testing, and improving, and trustworthy evaluation sets and evaluators decide what "good" means.',
  inDefinedTermSet: "https://traigent.ai/vibe-agent-building",
};

export default function VibeAgentBuilding() {
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (i) => {
    if (openFaq !== i) trackEvent("vibe_faq_opened", { question: FAQS[i].q });
    setOpenFaq(openFaq === i ? -1 : i);
  };

  return (
    <>
      <Helmet>
        <title>Vibe Agent Building — the term, defined · Traigent</title>
        <meta
          name="description"
          content='Vibe Agent Building: describe the agent you want, define what good means with trustworthy evaluation sets and evaluators, and let a coding agent plus Traigent do the repetitive building, testing, and improving. You bring the taste. The loop brings the proof.'
        />
        <meta
          name="keywords"
          content="vibe agent building, vibe coding for agents, AI agent evaluation set, trustworthy evaluators, coding agent optimization, Traigent"
        />
        <link rel="canonical" href="https://traigent.ai/vibe-agent-building" />
        <meta property="og:title" content="Vibe Agent Building — the term, defined" />
        <meta
          property="og:description"
          content='Describe the agent. Judge the results. The loop does the rest — and proves it, on evaluation sets and evaluators you trust.'
        />
        <meta property="og:url" content="https://traigent.ai/vibe-agent-building" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Vibe Agent Building — the term, defined" />
        <meta
          name="twitter:description"
          content="You bring the taste. The loop brings the proof."
        />
        <script type="application/ld+json">{JSON.stringify(definedTermSchema)}</script>
      </Helmet>

      <section className="relative overflow-x-clip bg-[#080808] text-white min-h-screen py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* §1 Hero */}
          <FadeIn className="text-center mb-14 md:mb-16">
            <div
              className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-mono tracking-wider mb-6"
              style={{ color: BLUE }}
            >
              THE TERM
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Vibe Agent Building
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto leading-snug mb-6">
              Describe the agent. Judge the results.
              <br />
              The loop does the rest — and proves it.
            </p>
            <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
              Vibe coding made software easy to build and hard to trust. Agents raise the
              stakes — they answer your customers, spend your budget, and act in your name. Vibe
              Agent Building keeps the part everyone loves: you describe, the machines build. And
              it adds the part shipping requires:{" "}
              <span className="text-white font-semibold">
                evaluation sets and evaluators you trust decide what "good" means
              </span>
              , and an optimization loop tests every candidate against it — showing what, if anything, clears your bar and what it costs.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm md:text-base">
              <a
                href="#loop"
                onClick={scrollToId("loop")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1A6BF5] hover:bg-[#4D8EF8] text-white font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                See the loop
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("demo_booking_clicked", { location: "vibe_hero" })}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-600 hover:border-slate-400 text-slate-200 hover:text-white font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Book a demo
              </a>
              <a
                href="#trust"
                onClick={scrollToId("trust")}
                className="inline-flex items-center gap-1 text-slate-400 hover:text-white font-medium underline underline-offset-4 decoration-slate-600"
              >
                What counts as proof? →
              </a>
            </div>
          </FadeIn>

          {/* §2 Dictionary card */}
          <FadeIn delay={0.05} className="mb-16 md:mb-20">
            <DictionaryCard />
          </FadeIn>

          {/* §3 The loop */}
          <FadeIn delay={0.05} className="mb-16 md:mb-20 scroll-mt-24" id="loop">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center">One loop. Two jobs.</h2>
            <p className="text-slate-400 text-center max-w-2xl mx-auto mb-10">
              You do the three things only a human can do. The machines do everything repetitive.
            </p>

            <div className="grid md:grid-cols-2 gap-5 mb-10">
              <div className="bg-slate-900/60 border border-amber-500/30 rounded-2xl p-6 md:p-7">
                <h3 className="text-lg md:text-xl font-bold mb-4" style={{ color: AMBER }}>
                  Your job
                </h3>
                <ul className="space-y-4 text-sm md:text-base text-slate-300">
                  <li>
                    <span className="text-white font-semibold">Describe it.</span> Plain language:
                    "An agent that triages our inbound leads and drafts the first reply in our tone."
                  </li>
                  <li>
                    <span className="text-white font-semibold">Define good.</span> Real examples of
                    great and terrible outcomes, graded by evaluators you'd trust to grade a
                    person.
                  </li>
                  <li>
                    <span className="text-white font-semibold">Judge it.</span> React to real
                    outputs. Every note you leave becomes a new test.
                  </li>
                </ul>
              </div>
              <div className="bg-slate-900/60 border rounded-2xl p-6 md:p-7" style={{ borderColor: `${BLUE}4D` }}>
                <h3 className="text-lg md:text-xl font-bold mb-4" style={{ color: BLUE }}>
                  The loop's job
                </h3>
                <ul className="space-y-4 text-sm md:text-base text-slate-300">
                  <li>
                    <span className="text-white font-semibold">Build.</span> A coding agent writes
                    the scaffolding, tools, and glue — in your repo, readable by your team.
                  </li>
                  <li>
                    <span className="text-white font-semibold">Test.</span> Traigent scores every
                    candidate against your evaluation set: accuracy, cost, latency.
                  </li>
                  <li>
                    <span className="text-white font-semibold">Improve.</span> Only configurations
                    that score better survive. The scores show you whether any clear your bar.
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8">
              <LoopDiagram />
            </div>

            <p className="text-center text-slate-400 mt-6 max-w-2xl mx-auto text-sm md:text-base">
              This is a division of labor, not a shortcut — and it runs on tools you already have:
              any coding agent, the Traigent SDK, and your own judgment.
            </p>
          </FadeIn>

          {/* §4 Two scenes */}
          <FadeIn delay={0.05} className="mb-16 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center">What it looks like</h2>
            <p className="text-slate-400 text-center max-w-2xl mx-auto mb-10">
              Two moments from the loop — one from the terminal, one from the product.
            </p>

            <div className="mb-4">
              <p className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-3 text-center">
                Illustrative session — your coding agent's exact words will differ
              </p>
              <TerminalScene />
            </div>

            <div className="mt-12">
              <p className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-3 text-center">
                Illustrative — feedback becoming an evaluation example
              </p>
              <FeedbackDemo />
              <p className="text-center text-base md:text-lg font-semibold mt-6 max-w-xl mx-auto">
                Your feedback isn't a comment. It's a test the agent has to pass from now on.
              </p>
            </div>
          </FadeIn>

          {/* §5 Trustworthy evals */}
          <FadeIn delay={0.05} className="mb-16 md:mb-20 scroll-mt-24" id="trust">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center">"Good" has to mean something</h2>
            <div className="grid md:grid-cols-3 gap-5 mt-10">
              <div className="bg-slate-900/60 border border-amber-500/30 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-2">Trustworthy evaluation sets</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Built from your real cases — not synthetic fluff. Reviewed by the person whose
                  taste is on the line: you. Small and honest beats big and fake.
                </p>
              </div>
              <div className="bg-slate-900/60 border border-amber-500/30 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-2">Trustworthy evaluators</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  An evaluator you wouldn't trust to grade a human shouldn't grade your agent. Use
                  exact checks where exactness exists, and judged rubrics where taste does — and
                  spot-check the judges.
                </p>
              </div>
              <div className="bg-slate-900/60 border border-amber-500/30 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-2">Evidence, not demos</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Every candidate configuration carries its scores — accuracy, cost, latency — on
                  your evaluation set. The agent you ship is the one that earned it.
                </p>
              </div>
            </div>
            <p className="text-center text-slate-300 mt-8 max-w-2xl mx-auto font-medium">
              Vibe coding asks you to trust the developer's vibes.{" "}
              <span className="text-white">
                Vibe Agent Building asks the agent to earn your trust — on tests you wrote.
              </span>
            </p>
          </FadeIn>

          {/* The turn — manifesto to pitch */}
          <FadeIn delay={0.05} className="mb-16 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center">The loop needs an engine</h2>
            <p className="text-slate-400 text-center max-w-2xl mx-auto mb-4">
              Everything above is a way of working — you can start it today, with any coding
              agent. But step 4 needs an engine: something has to test every candidate against
              your evaluation set, score accuracy and cost, and keep only what earns its place.
            </p>
            <p className="text-slate-400 text-center max-w-2xl mx-auto mb-10">
              That engine is <span className="text-white font-semibold">Traigent</span>, an agent
              optimization platform. It picks what to try next from run history, so it tests only
              a fraction of the thousands of possible combinations — and surfaces the ones that
              score higher, cost less, or both, when a better configuration exists. Two short
              recordings of it at work:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
                  <video
                    controls
                    preload="metadata"
                    playsInline
                    className="w-full"
                    aria-describedby="video-see-it-desc"
                  >
                    <source src="/demos/see_it_in_action.webm" type="video/webm" />
                    <source src="/demos/see_it_in_action.mp4" type="video/mp4" />
                  </video>
                </div>
                <p className="text-xs text-slate-500 mt-2 text-center">
                  Traigent converging — candidate configurations scored on accuracy and cost
                  against an evaluation set, surfacing the one that scores best in this run.
                  Existing product demo.
                </p>
                <p id="video-see-it-desc" className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Text alternative: the Traigent portal runs several candidate configurations
                  against an evaluation set, showing each one's accuracy and cost as it's scored,
                  then highlighting the configuration that scores best in this run.
                </p>
              </div>
              <div>
                <div className="rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
                  <video
                    controls
                    preload="metadata"
                    playsInline
                    className="w-full"
                    aria-describedby="video-value-prop-desc"
                  >
                    <source src="/demos/value_mov_02.webm" type="video/webm" />
                    <source src="/demos/value_mov_02.mp4" type="video/mp4" />
                  </video>
                </div>
                <p className="text-xs text-slate-500 mt-2 text-center">
                  The tradeoff view — accuracy against cost across candidates: the numbers a team
                  ships on. Existing product demo.
                </p>
                <p id="video-value-prop-desc" className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Text alternative: a walkthrough of the Traigent portal covering the optimization
                  loop, evaluation-set-driven scoring, and the accuracy/cost tradeoff view teams use
                  to pick a configuration to ship.
                </p>
              </div>
            </div>
            <p className="text-center text-slate-400 mt-8 text-sm md:text-base">
              Want this on your agent?{" "}
              <a
                href={DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("demo_booking_clicked", { location: "vibe_turn" })}
                className="text-white font-semibold underline underline-offset-4 decoration-slate-500 hover:decoration-white"
              >
                Book a demo →
              </a>
            </p>
          </FadeIn>

          {/* §8 Honest FAQ */}
          <FadeIn delay={0.05} className="mb-16 md:mb-20 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Honest FAQ</h2>
            {FAQS.map((faq, i) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} isOpen={openFaq === i} onToggle={() => toggleFaq(i)} />
            ))}
          </FadeIn>

          {/* §9 Closing CTA */}
          <FadeIn delay={0.05}>
            <div className="relative overflow-hidden bg-black border border-slate-800 rounded-2xl p-8 md:p-12 text-center">
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${BLUE}33, transparent 60%)`,
                }}
                aria-hidden="true"
              />
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold mb-3">Bring the vibe. Keep the proof.</h2>
                <p className="text-slate-300 mb-8 max-w-xl mx-auto">
                  Describe your first agent this week — and ship it with numbers.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
                  <a
                    href={DEMO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent("demo_booking_clicked", { location: "vibe_closing" })}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#1A6BF5] hover:bg-[#4D8EF8] text-white font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Book a demo
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <Link
                    to="/get-started"
                    onClick={() => trackEvent("vibe_get_started_clicked", { location: "vibe_closing" })}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-slate-600 hover:border-slate-400 text-slate-200 hover:text-white font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Start with the SDK
                  </Link>
                </div>
                <p className="text-xs text-slate-500 mb-8">
                  Bring one use case and a handful of real examples — that's enough to start.
                </p>
                <div className="flex flex-col items-center gap-2">
                  <p className="text-xs text-slate-500">
                    Not the person who owns agent quality? Send this to whoever is.
                  </p>
                  <CopyButton
                    text={SHARE_TEXT}
                    label="Copy the shareable line"
                    copiedLabel="Copied — go paste it"
                    trackName="vibe_share_line_copied"
                  />
                </div>
              </div>
            </div>

            <div className="mt-10 max-w-xl mx-auto">
              <DictionaryCard compact />
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
