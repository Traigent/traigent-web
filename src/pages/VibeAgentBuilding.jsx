import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Copy,
  Pause,
  Play,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { trackEvent } from "../lib/analytics";

const AMBER = "#f59e0b";
const BLUE = "#1A6BF5";
const DEMO_URL = "https://meetings-eu1.hubspot.com/amir8";

const DEFINITION_TEXT =
  `vibe agent building (n.)\n` +
  `Building or improving an AI agent by describing what you want and reacting to what you get — while a coding agent and an optimization engine do the repetitive work, and the evaluation set, evaluator, and agent stay living parts of the same loop.\n\n` +
  `You bring the taste. The loop brings the proof.`;

const SHARE_TEXT =
  `Vibe coding asks you to trust the developer's vibes. Vibe Agent Building asks the agent to earn your trust — on tests you wrote. → https://traigent.ai/vibe-agent-building`;

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
        Building or improving an AI agent by describing what you want and reacting to what you get
        — while a coding agent and an optimization engine do the repetitive work, and the{" "}
        <span className="text-white font-semibold">evaluation set, evaluator, and agent</span> are
        living parts of the same loop.
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
    id: "connect",
    n: "1",
    title: "Connect",
    owner: "human",
    caption: "Bring the agent you already run — or describe the one you want.",
  },
  {
    id: "bar",
    n: "2",
    title: "Bring the bar",
    owner: "human",
    caption:
      "Use the evals, goldens, or fixtures you have. No evals yet? Start with real cases.",
  },
  {
    id: "strengthen",
    n: "3",
    title: "Strengthen",
    owner: "machine",
    caption: "Check the examples and the evaluator before trusting the score. You approve changes.",
  },
  {
    id: "challenge",
    n: "4",
    title: "Challenge",
    owner: "machine",
    caption:
      "Test challengers against what ships today, then judge the finalist on cases it never competed on.",
  },
  {
    id: "decide",
    n: "5",
    title: "Decide",
    owner: "human",
    caption: "See the margin, cost, and failures. Shipping — or another loop — is your call.",
  },
];

// LoopDiagram — motion moment M1. Cycles the five stations with a fading
// caption when motion is allowed; renders every station and caption at once,
// statically, when the visitor prefers reduced motion.
function LoopDiagram() {
  const prefersReducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion || isPaused) return;
    const id = setInterval(() => setActive((i) => (i + 1) % LOOP_STEPS.length), 2600);
    return () => clearInterval(id);
  }, [isPaused, prefersReducedMotion]);

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
        <div>
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
          <div className="flex justify-center mt-2">
            <button
              type="button"
              onClick={() => setIsPaused((paused) => !paused)}
              aria-pressed={isPaused}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-700 text-xs font-medium text-slate-400 hover:border-slate-500 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {isPaused ? (
                <Play className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <Pause className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              {isPaused ? "Resume loop animation" : "Pause loop animation"}
            </button>
          </div>
        </div>
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
        "We already have a billing agent in agents/billing_qa.py and resolved-ticket goldens in tests/. I want to know whether it can be better — and what that costs.",
    },
    {
      who: "agent",
      text:
        "Reading both. Before we tune the agent, I'll check whether the evaluator agrees with how your team graded these tickets and whether the set represents the hard cases. Drafts only until you approve them.",
    },
    {
      who: "agent",
      text:
        "Some cases repeat the same easy pattern, while escalations are underrepresented. I've drafted a tighter set and a clearer rubric for your review.",
    },
    {
      who: "you",
      text:
        "Keep the escalations — they're the bar. Approve the set and rubric. Don't change the agent yet.",
    },
    {
      who: "agent",
      text:
        "Bar locked. Now challenging the current agent with model, retrieval, and prompt candidates. The finalist will face cases it never competed on, with accuracy and cost visible. Mock run first — spends nothing.",
    },
    { who: "you", text: "Go. Then show me the margin, the cost, and what it still gets wrong." },
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
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion || isPaused) return;
    const id = setInterval(() => setPhase((p) => (p === "before" ? "after" : "before")), 3600);
    return () => clearInterval(id);
  }, [isPaused, prefersReducedMotion]);

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
      <div className="text-3xl font-extrabold text-amber-400">+1</div>
      <div className="text-xs text-slate-400 mt-1">
        evaluation example, added with your sign-off · every future candidate is graded on the
        full set
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
      <div className="flex justify-center mt-3">
        <button
          type="button"
          onClick={() => setIsPaused((paused) => !paused)}
          aria-pressed={isPaused}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-700 text-xs font-medium text-slate-400 hover:border-slate-500 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {isPaused ? (
            <Play className="w-3.5 h-3.5" aria-hidden="true" />
          ) : (
            <Pause className="w-3.5 h-3.5" aria-hidden="true" />
          )}
          {isPaused ? "Resume feedback animation" : "Pause feedback animation"}
        </button>
      </div>
    </div>
  );
}

const FAQS = [
  {
    q: "We already have an agent and write evals.",
    a: "Then you're the primary audience. Your agent, evaluation set, and evaluator are all assets — and all can drift. Start with what you have, strengthen the bar, then challenge the agent against it.",
  },
  {
    q: "Do I need a coding-agent plugin or an AGENT.md change?",
    a: "No. The standard path is the Traigent SDK around code you already have, with explicit changes your team can review. No coding-agent plugin or AGENT.md edit is required.",
  },
  {
    q: "Do I need to code?",
    a: "Someone on your side runs a coding agent — today that's usually a developer. If you own the quality bar but not the codebase, it's a two-person loop: they run it, you decide what it's aiming at. Describing the agent, defining what good means, and judging the results are yours — nothing here automates them.",
  },
  {
    q: "Will it get everything right?",
    a: "No agent does. It will be measured: you'll know what it scores, which cases it fails, and what each improvement costs. That's more than most shipped agents can say.",
  },
  {
    q: "What does it cost to try?",
    a: "The first run is a mock — it calls no models and spends nothing, so you can check the wiring before you check the bill. Real runs call your models against your examples, so the cost scales with candidates × examples × your model's price. You set a run cost limit, and it stops for your approval before any paid run. That's also why the engine picks what to try next from run history instead of trying everything.",
  },
  {
    q: "What don't you automate?",
    a: "Taste. The evaluation set is yours, the evaluators answer to you, and the ship decision is yours. On purpose.",
  },
  {
    q: "Is this a product or a buzzword?",
    a: "A working method with a name. The pieces exist today: your agent, the Traigent SDK, and the quality bar you already use or are ready to define. The name exists so teams can ask for the whole lifecycle, not another isolated tuning run.",
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
    "Building or improving an AI agent by describing what you want and reacting to what you get, while a coding agent and an optimization engine do the repetitive work, and the evaluation set, evaluator, and agent stay living parts of the same loop.",
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
          content="Vibe Agent Building starts with the agent, evals, and evaluator you already have — then strengthens the bar, challenges the agent, and shows the evidence."
        />
        <meta
          name="keywords"
          content="vibe agent building, vibe coding for agents, AI agent evaluation set, trustworthy evaluators, coding agent optimization, Traigent"
        />
        <link rel="canonical" href="https://traigent.ai/vibe-agent-building" />
        <meta property="og:title" content="Vibe Agent Building — the term, defined" />
        <meta
          property="og:description"
          content="Bring the agent and evals you already have. Strengthen the bar, challenge the agent, and decide with evidence."
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
              START WITH WHAT YOU HAVE
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Vibe Agent Building
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto leading-snug mb-6">
              Bring your agent. Bring your evals.
              <br />
              Missing one — or both? Start there.
            </p>
            <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
              Most teams already have an agent. Many have evals. Vibe Agent Building meets you
              there: it strengthens the examples, checks the evaluator, then challenges the agent
              — showing what improved, what it costs, and what still fails. No coding-agent plugin.
              No AGENT.md edits. You decide what good means and what ships.
            </p>
            <p className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-3">
              Start where you are
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm md:text-base mb-4">
              <a
                href="#three"
                onClick={scrollToId("three")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1A6BF5] hover:bg-[#4D8EF8] text-white font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                I have an agent + evals
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#bar"
                onClick={scrollToId("bar")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-600 hover:border-slate-400 text-slate-200 hover:text-white font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                I have an agent
              </a>
              <a
                href="#loop"
                onClick={scrollToId("loop")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                I'm starting fresh
              </a>
            </div>
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("demo_booking_clicked", { location: "vibe_hero" })}
              className="text-sm text-slate-500 hover:text-white underline underline-offset-4 decoration-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Or walk through it with us →
            </a>
          </FadeIn>

          {/* §2 Dictionary card */}
          <FadeIn delay={0.05} className="mb-16 md:mb-20">
            <DictionaryCard />
          </FadeIn>

          {/* §3 The loop */}
          <FadeIn delay={0.05} className="mb-16 md:mb-20 scroll-mt-24" id="loop">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center">Three artifacts. One loop.</h2>
            <p className="text-slate-400 text-center max-w-2xl mx-auto mb-10">
              You decide what good means and what ships. The loop does the repetitive work on all three.
            </p>

            <div id="three" className="grid md:grid-cols-3 gap-5 mb-10 scroll-mt-24">
              <div className="bg-slate-900/60 border border-amber-500/30 rounded-2xl p-6 md:p-7">
                <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 mb-3">
                  Artifact 1
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-3 text-white">
                  The examples
                </h3>
                <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                  Are they hard enough? Keep the cases that separate good from convincing. Add the
                  failures you actually care about. You approve every change.
                </p>
              </div>
              <div id="bar" className="bg-slate-900/60 border border-amber-500/30 rounded-2xl p-6 md:p-7 scroll-mt-24">
                <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 mb-3">
                  Artifact 2
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-3 text-white">
                  The evaluator
                </h3>
                <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                  Does it agree with your experts? Does it stay consistent? The judge earns trust
                  before its score gets to choose a winner.
                </p>
              </div>
              <div className="bg-slate-900/60 border rounded-2xl p-6 md:p-7" style={{ borderColor: `${BLUE}4D` }}>
                <div className="text-[10px] font-mono uppercase tracking-wider mb-3" style={{ color: BLUE }}>
                  Artifact 3
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-3 text-white">
                  The agent
                </h3>
                <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                  Is a challenger better than what runs today? Judge the finalist on cases it never
                  competed on, with cost and latency visible.
                </p>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8">
              <LoopDiagram />
            </div>

            <p className="text-center text-slate-400 mt-6 max-w-2xl mx-auto text-sm md:text-base">
              If your agent already exists, you're not starting over. Connect the Traigent SDK to
              code you already have, bring the quality bar you already use, and keep every change
              explicit and reviewable.
            </p>
          </FadeIn>

          {/* §4 Two scenes */}
          <FadeIn delay={0.05} className="mb-16 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center">What it looks like</h2>
            <p className="text-slate-400 text-center max-w-2xl mx-auto mb-10">
              Start with the agent and quality bar you have. Strengthen both before you trust a winner.
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
                This is the examples artifact getting a new version. You approve the case into the
                evaluation set, and every future candidate is graded against it.
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
                  your evaluation set. And because the winner was chosen by searching, its score on
                  the data it was chosen from runs optimistic: hold examples back, and judge the
                  finalist on cases it never competed on. That's the number worth shipping against.
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
              A single optimization run is one moment. The lifecycle keeps the examples, the
              evaluator, and the agent moving together — so a better agent does not win against a
              stale bar.
            </p>
            <p className="text-slate-400 text-center max-w-2xl mx-auto mb-8">
              That engine is <span className="text-white font-semibold">Traigent</span>, an agent
              optimization platform. It connects through the SDK to code you already have — no
              coding-agent plugin or AGENT.md edit required — and shows what, if anything, clears
              your bar, what it costs, and what still fails.
            </p>
            <div className="grid sm:grid-cols-3 gap-3 max-w-3xl mx-auto mb-8" role="list" aria-label="Traigent lifecycle proof">
              {[
                ["1", "Strengthen the bar", "Examples and evaluator earn trust first."],
                ["2", "Challenge the agent", "Candidates face the bar you approved."],
                ["3", "Decide with evidence", "Margin, cost, and failures stay visible."],
              ].map(([n, title, detail]) => (
                <div key={n} role="listitem" className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 text-left">
                  <div className="font-mono text-xs mb-2" style={{ color: n === "2" ? BLUE : AMBER }}>
                    {n.padStart(2, "0")}
                  </div>
                  <h3 className="text-white font-semibold mb-1">{title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{detail}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-slate-400 text-sm md:text-base">
              Ready to connect the agent you already have?{" "}
              <Link
                to="/get-started"
                onClick={() => trackEvent("vibe_get_started_clicked", { location: "vibe_turn" })}
                className="text-white font-semibold underline underline-offset-4 decoration-slate-500 hover:decoration-white"
              >
                Start with the SDK →
              </Link>{" "}
              or{" "}
              <a
                href={DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("demo_booking_clicked", { location: "vibe_turn" })}
                className="text-white font-semibold underline underline-offset-4 decoration-slate-500 hover:decoration-white"
              >
                walk through it with us
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
                  Point the loop at the agent and quality bar you already have.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
                  <Link
                    to="/get-started"
                    onClick={() => trackEvent("vibe_get_started_clicked", { location: "vibe_closing" })}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#1A6BF5] hover:bg-[#4D8EF8] text-white font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Start with the SDK
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href={DEMO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent("demo_booking_clicked", { location: "vibe_closing" })}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-slate-600 hover:border-slate-400 text-slate-200 hover:text-white font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Book a demo
                  </a>
                </div>
                <p className="text-xs text-slate-500 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Prefer to read the code first? The SDK is public on{" "}
                  <a
                    href="https://github.com/Traigent/Traigent"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent("vibe_sdk_repo_clicked", { location: "vibe_closing" })}
                    className="text-slate-300 underline underline-offset-4 decoration-slate-600 hover:text-white hover:decoration-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    GitHub
                  </a>
                  . Bring one agent and the evals or real cases you already trust — that's enough
                  to start.
                </p>
                <div className="flex flex-col items-center gap-2">
                  <p className="text-xs text-slate-500">
                    Own the quality bar but not the codebase? Send this to the engineer you'd build
                    it with — the loop needs both of you.
                  </p>
                  <p className="text-xs text-slate-500">
                    Bringing this into a company with a security review?{" "}
                    <a
                      href={DEMO_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        trackEvent("demo_booking_clicked", { location: "vibe_security_signpost" })
                      }
                      className="text-slate-300 underline underline-offset-4 decoration-slate-600 hover:text-white hover:decoration-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      Ask us the hard questions.
                    </a>
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
