// /story — the full Traigent story as a five-act auto-playing movie.
//
//   ACT 1 — Problem statement (narrated)
//   ACT 2 — Knob Explorer walkthrough (embedded, guided)
//   ACT 3 — Setup for solution (narrated)
//   ACT 4 — Optimization demo at 4× speed (embedded)
//   ACT 5 — The punch — Traigent advantages (narrated)
//
// Acts 1/3/5 reveal text left-to-right at narrator pace (≈150 wpm). Acts 2
// and 4 reuse the real /knob-explorer and /demo pages via iframes with
// query-string hints so we never duplicate their content. Total runtime ≈ 115s.
//
// Reachable via the hidden ▸ menu in TopNav.
import { Fragment, useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ChevronDown, ChevronUp, Pause, Play, RotateCcw, SkipBack, SkipForward, Sparkles } from "lucide-react";
import { useRemoveChatWidget } from "../lib/useRemoveChatWidget";
import ChatKillerStyle from "../lib/ChatKillerStyle";
import StartNowModal from "../components/StartNowModal";
import { notifyStoryWatched } from "../lib/hubspotForms";
import { useKnownContactNotify } from "../lib/useKnownContactNotify";
import { usePageView } from "../lib/usePageView";

// Same CTA URL as the homepage TopNav — HubSpot meeting booking.
const DEMO_BOOKING_URL = "https://meetings-eu1.hubspot.com/amir8";

// =============================================================================
// Narration component — flattens every sentence into a single list of rows
// and renders them ALL at once, stacked top-to-bottom. Each row is initially
// hidden via a left-to-right clip-path that wipes open in sequence at narrator
// pace. Already-revealed rows STAY visible (never cleared). Layout is static
// from t=0, so no rows move.
//
// `sentences` is an array of either strings (single-row) or arrays of strings
// (multi-row, one entry per row). Rows must be short enough not to wrap — the
// component forces `white-space: nowrap` to guarantee one visible line per row.
// =============================================================================

function Narration({
  sentences,
  wpm = 315,
  rowPauseMs = 100,
  sentencePauseMs = 400,
  onComplete,
  noWrapper = false,
  paused = false,
  startAtEnd = false,
}) {
  // Flatten into a single list of { text, isLastOfSentence, colorClass,
  // sizeClass } so we can step through them with a single index. The
  // `isLastOfSentence` flag controls whether we pause longer after this row
  // (end-of-sentence dwell). The optional colorClass / sizeClass come from
  // the sentence object form (used by Act 5's color hierarchy):
  //   - string                                  → single row
  //   - string[]                                → multi-row sentence
  //   - { rows: string[], colorClass?, sizeClass? } → styled sentence
  const flatRows = useMemo(() => {
    const out = [];
    sentences.forEach((s) => {
      let rows, colorClass, sizeClass, trailingButton;
      if (Array.isArray(s)) {
        rows = s;
      } else if (typeof s === "string") {
        rows = [s];
      } else {
        rows = s.rows;
        colorClass = s.colorClass;
        sizeClass = s.sizeClass;
        trailingButton = s.trailingButton;
      }
      rows.forEach((text, i) => {
        const isLast = i === rows.length - 1;
        out.push({
          text,
          isLastOfSentence: isLast,
          colorClass,
          sizeClass,
          // Trailing button attaches to the sentence's LAST row only.
          trailingButton: isLast ? trailingButton : undefined,
        });
      });
    });
    return out;
  }, [sentences]);

  const [activeIdx, setActiveIdx] = useState(0);

  // Per-row reveal duration based on word count.
  const rowReveals = useMemo(
    () =>
      flatRows.map(({ text }) => {
        const words = text.split(/\s+/).filter(Boolean).length;
        return Math.max(230, (words / wpm) * 60_000);
      }),
    [flatRows, wpm]
  );

  // `startAtEnd` mode (used by the "End Act 5" jump button): on mount, set
  // activeIdx past the end so every row renders as already-revealed and
  // onComplete fires immediately — the parent then shows the buttons.
  useEffect(() => {
    if (!startAtEnd) return;
    setActiveIdx(flatRows.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startAtEnd]);

  useEffect(() => {
    if (paused) return undefined;
    if (activeIdx >= flatRows.length) {
      const finalize = setTimeout(() => onComplete?.(), 500);
      return () => clearTimeout(finalize);
    }
    const revealMs = rowReveals[activeIdx];
    const dwell = flatRows[activeIdx].isLastOfSentence ? sentencePauseMs : rowPauseMs;
    const t = setTimeout(() => setActiveIdx((i) => i + 1), revealMs + dwell);
    return () => clearTimeout(t);
  }, [activeIdx, flatRows, rowReveals, rowPauseMs, sentencePauseMs, onComplete, paused]);

  const inner = (
    <div className="max-w-6xl w-full text-center">
      {flatRows.map(({ text, isLastOfSentence, colorClass, sizeClass, trailingButton }, i) => {
          const isPast = i < activeIdx;
          const isActive = i === activeIdx;
          // Future rows: invisible placeholder so vertical layout is fixed
          // from t=0. Past + active rows are shown.
          // Last row of each sentence (except the very last sentence) gets
          // extra bottom margin so sentences are visually separated. If the
          // sentence has a trailing button, the row uses a small gap (the
          // button itself takes the sentence-boundary spacing).
          const isSentenceBoundary = isLastOfSentence && i < flatRows.length - 1;
          const rowMargin = trailingButton ? "mb-4" : isSentenceBoundary ? "mb-12" : "mb-3";
          return (
            <Fragment key={i}>
              <p
                className={`${sizeClass || "text-xl md:text-3xl lg:text-4xl"} font-bold tracking-tight ${colorClass || "text-white"} ${rowMargin}`}
                style={{
                  lineHeight: 1.25,
                  whiteSpace: "nowrap",
                  overflow: "visible",
                }}
              >
                {isPast && (
                  // Already revealed — stays fully visible, no animation.
                  <span style={{ display: "inline-block", paddingBottom: "0.15em" }}>{text}</span>
                )}
                {isActive && (
                  // Currently revealing — left-to-right clip-path wipe. Negative
                  // top/bottom inset ensures descenders (y, g, p, q, j) aren't
                  // clipped at the line-box edge.
                  <motion.span
                    initial={{ clipPath: "inset(-15% 100% -15% 0)" }}
                    animate={{ clipPath: "inset(-15% 0% -15% 0)" }}
                    transition={{ duration: rowReveals[i] / 1000, ease: "linear" }}
                    style={{ display: "inline-block", paddingBottom: "0.15em" }}
                  >
                    {text}
                  </motion.span>
                )}
                {!isPast && !isActive && (
                  <span
                    aria-hidden="true"
                    style={{
                      display: "inline-block",
                      opacity: 0,
                      paddingBottom: "0.15em",
                    }}
                  >
                    {text}
                  </span>
                )}
              </p>
              {/* Trailing button reserved from t=0 (layout stable), fades in
                  once its row has finished revealing. */}
              {trailingButton && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isPast ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                  className={`flex justify-center ${isSentenceBoundary ? "mb-12" : "mb-3"}`}
                >
                  <Link
                    to={trailingButton.href}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/15 border border-blue-500/40 text-blue-200 text-sm md:text-base font-medium hover:bg-blue-500/25 transition-colors"
                  >
                    {trailingButton.label}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              )}
            </Fragment>
          );
        })}
    </div>
  );

  // `noWrapper` (used by Act5Punch) lets the caller compose its own outer
  // layout so narration can sit alongside other elements (tagline + buttons)
  // in a single centered group.
  if (noWrapper) return inner;
  return (
    <div className="w-full h-full flex items-center justify-center px-8 md:px-16">
      {inner}
    </div>
  );
}

// =============================================================================
// Embedded act — iframe-loads a real page (Knob Explorer / Demo) with hint
// query params, then advances after a fixed duration.
// =============================================================================

function EmbeddedAct({ src, durationMs, onComplete, title, paused = false, showFinal = false }) {
  // Lock the iframe src at mount. Without this, when an act played all the
  // way through and the parent flipped `showFinal=true` to enter the end-
  // of-act freeze state, the parent's src prop would change (the parent
  // appends `&final=1` when showFinal is set), forcing the iframe to re-
  // mount — visible to the user as a black "blink" reloading the same
  // end-frame the tour already produced. Locking it ignores prop changes.
  const [lockedSrc] = useState(src);
  const [loaded, setLoaded] = useState(false);
  const [absoluteSrc, setAbsoluteSrc] = useState(lockedSrc);

  // Resolve to an absolute URL once the component is on the client. Using
  // `window.location.origin + src` removes any base-path ambiguity that can
  // make the iframe load a blank document (which was the Act 2 black-screen
  // bug — relative `/#/...` resolved against the wrong origin in some dev
  // setups, producing an empty page).
  useEffect(() => {
    if (typeof window !== "undefined") {
      setAbsoluteSrc(window.location.origin + lockedSrc);
    }
  }, [lockedSrc]);

  // Advance timer is suspended while paused. When unpaused, the iframe is
  // (re)mounted fresh and the timer restarts at 0 — the inner page (Knob
  // Explorer tour / Demo scenes) starts over rather than continuing where
  // it was. Caveat we accept until/unless we plumb postMessage controls
  // into both iframed pages.
  useEffect(() => {
    if (paused) return undefined;
    const t = setTimeout(() => onComplete?.(), durationMs);
    return () => clearTimeout(t);
  }, [durationMs, onComplete, paused]);

  // Some embedded pages (the demo) post `traigent:demo:complete` when their
  // internal flow actually finishes — fire onComplete early on that signal
  // so the parent transitions at the right moment regardless of how long
  // the viewer spent on any internal pause / cheat sheet.
  useEffect(() => {
    if (paused) return undefined;
    const handler = (e) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === "traigent:demo:complete") {
        onComplete?.();
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [onComplete, paused]);

  // When showFinal is set, the iframe must mount even while paused — the
  // `&final=1` URL renders the page's terminal state directly (which is the
  // whole point of the "End Act 2/4" jump). Without this, paused + showFinal
  // would just blank the screen.
  const shouldRenderIframe = !paused || showFinal;

  return (
    <div
      className="absolute inset-0 bg-[#080808]"
      style={{ width: "100%", height: "100vh" }}
    >
      {shouldRenderIframe ? (
        <>
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm font-mono z-10 pointer-events-none">
              Loading…
            </div>
          )}
          <iframe
            key={absoluteSrc}
            src={absoluteSrc}
            title={title}
            onLoad={() => setLoaded(true)}
            className="border-0 block"
            style={{
              width: "100%",
              height: "100%",
              minHeight: "100vh",
              background: "#080808",
              display: "block",
            }}
            width="100%"
            height="100%"
          />
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm font-mono z-10 pointer-events-none">
          Paused — press Play to start this act
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Act 5 punch — narration that doesn't advance off the last act. After the
// narration finishes, the "That's Traigent" tagline and the Replay + Visit
// buttons fade in at the bottom of the same slide, and the act stays on
// screen until the user acts. No auto-transition to a separate end screen.
// =============================================================================

const ACT_5_SENTENCES = [
  // The achievement — full size, white (default). Last row gets a trailing
  // button that links to the Knob Explorer so curious viewers can poke at
  // the search space themselves.
  {
    rows: [
      "Traigent finds the HIGHEST ACCURACY",
      "Then finds CHEAPER ALTERNATIVES",
      "out of millions of configuration options",
    ],
    trailingButton: {
      label: "Explore the configuration space",
      href: "/knob-explorer",
    },
  },
  // The wow factor — emerald accent flags this as the success punch.
  {
    rows: ["Fast. Automatic."],
    colorClass: "text-emerald-300",
  },
  // The contrast — quieter, slate-muted, slightly smaller. Reads like a
  // dismissive afterthought of the old way.
  {
    rows: ["No trial and error", "No guesswork"],
    colorClass: "text-slate-400",
    sizeClass: "text-base md:text-2xl lg:text-3xl",
  },
];

function Act5Punch({ onComplete, startAtEnd = false, paused = false }) {
  // When startAtEnd is true (user clicked "End Act 5" from controls), the
  // narration is skipped to its final state and the buttons appear instantly.
  const [narrationDone, setNarrationDone] = useState(startAtEnd);
  // Modal state for the "Start Now" CTA — same install/checkout flow as the
  // homepage TopNav button.
  const [showStartNow, setShowStartNow] = useState(false);
  // Ref so we can call the latest onComplete from a stable callback. Inline
  // arrows here would change every render and reset Narration's timer
  // (the 100ms progress ticker on the parent re-renders the act tree).
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const handleNarrationComplete = useCallback(() => {
    setNarrationDone(true);
    // Signal the parent that Act 5's narration is done — flips parent into
    // end-of-act state so the Act 5 cheat sheet slides in on the right
    // alongside the existing in-slide CTAs.
    onCompleteRef.current?.();
  }, []);
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-8 md:px-16">
      {/* Fixed "The Win" headline — same treatment as Act 1's "The Problem"
          and Act 3's "What everyone wants", with an emerald accent that
          thematically signals success. */}
      <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-emerald-300 tracking-tight mb-6 md:mb-8">
        The Win
      </h1>
      {/* Narration + tagline + buttons sit in a single column centered
          vertically as one group. The tagline/buttons block reserves its
          layout space from the start (rendered with opacity 0 until the
          narration finishes), so the narration position doesn't shift
          when the buttons fade in. */}
      <Narration
        sentences={ACT_5_SENTENCES}
        wpm={470}
        rowPauseMs={70}
        sentencePauseMs={270}
        onComplete={handleNarrationComplete}
        noWrapper
        paused={paused}
        startAtEnd={startAtEnd}
      />
      {/* 4 benefit boxes — same content as the one-pager's opener tiles
          (LLM cost ↓, Eng time ↓, TTM ↓, Shipment confidence ↑). Fade in
          with the CTAs once the narration finishes. */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: narrationDone ? 1 : 0, y: narrationDone ? 0 : 24 }}
        transition={{ duration: 0.7 }}
        className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-4xl"
      >
        <Link
          to="/roi"
          className="bg-slate-900/70 border-2 rounded-xl px-3 py-3 text-center hover:bg-slate-900 transition-colors block"
          style={{ borderColor: "#f59e0b66" }}
        >
          <div className="flex items-center justify-center gap-2" style={{ color: "#f59e0b" }}>
            <ArrowDown className="w-6 h-6" strokeWidth={3} />
            <span className="text-xl md:text-2xl font-extrabold tracking-tight leading-none">up to 60%</span>
          </div>
          <div className="text-[10px] md:text-[11px] font-mono uppercase tracking-wider text-slate-300 mt-1">LLM cost reduction</div>
        </Link>
        <Link
          to="/ttm"
          className="bg-slate-900/70 border-2 rounded-xl px-3 py-3 text-center hover:bg-slate-900 transition-colors block"
          style={{ borderColor: "#4D8EF866" }}
        >
          <div className="flex items-center justify-center gap-2" style={{ color: "#4D8EF8" }}>
            <ArrowDown className="w-6 h-6" strokeWidth={3} />
            <span className="text-xl md:text-2xl font-extrabold tracking-tight leading-none">up to 8 wks</span>
          </div>
          <div className="text-[10px] md:text-[11px] font-mono uppercase tracking-wider text-slate-300 mt-1">Engineering time reclaimed</div>
        </Link>
        <Link
          to="/ttm"
          className="bg-slate-900/70 border-2 rounded-xl px-3 py-3 text-center hover:bg-slate-900 transition-colors block"
          style={{ borderColor: "#4D8EF866" }}
        >
          <div className="flex items-center justify-center gap-2" style={{ color: "#4D8EF8" }}>
            <ArrowDown className="w-6 h-6" strokeWidth={3} />
            <span className="text-xl md:text-2xl font-extrabold tracking-tight leading-none">TTM</span>
          </div>
          <div className="text-[10px] md:text-[11px] font-mono uppercase tracking-wider text-slate-300 mt-1">shortens time to market</div>
        </Link>
        <div className="bg-slate-900/70 border-2 rounded-xl px-3 py-3 text-center" style={{ borderColor: "#a78bfa66" }}>
          <div className="flex items-center justify-center gap-2" style={{ color: "#a78bfa" }}>
            <ArrowUp className="w-6 h-6" strokeWidth={3} />
            <span className="text-xl md:text-2xl font-extrabold tracking-tight leading-none">100%</span>
          </div>
          <div className="text-[10px] md:text-[11px] font-mono uppercase tracking-wider text-slate-300 mt-1">shipment confidence</div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: narrationDone ? 1 : 0, y: narrationDone ? 0 : 24 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="mt-8 flex items-center gap-4"
      >
        {/* Same two CTAs as the homepage TopNav — Start Now opens the modal
            install/checkout flow; Book a demo opens the HubSpot meeting
            booker in a new tab. */}
        <button
          type="button"
          onClick={() => setShowStartNow(true)}
          className="border border-slate-600 hover:border-slate-400 text-slate-200 hover:text-white px-6 py-3 rounded-lg text-base font-medium transition-colors whitespace-nowrap"
        >
          Start Now
        </button>
        <a
          href={DEMO_BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#1A6BF5] hover:bg-[#4D8EF8] text-white px-6 py-3 rounded-lg text-base font-medium transition-colors whitespace-nowrap"
        >
          Book a demo
        </a>
      </motion.div>
      {showStartNow && <StartNowModal onClose={() => setShowStartNow(false)} location="story_act_5" />}
    </div>
  );
}

// =============================================================================
// Cheat sheets — semi-transparent yellow panel that floats on the right side
// at end-of-act state. Each act gets a different content set following the
// classic marketing pattern: tell them what they're going to see, tell them
// what they saw, then a final recap at the end driving the message home.
//
// Narrative arc baked into the sheets (3-step optimization story):
//   Act 1: the problem (many knobs, big space)
//   Act 2: Step 1 — choose the knobs (search space catalog)
//   Act 3: bridge to what we want (peak accuracy, then cheaper)
//   Act 4: Steps 2 & 3 — find accuracy peak, then cheaper alternatives
//   Act 5: QED — Traigent is necessary for any agent dev team
// =============================================================================

// Each cheat sheet has `saw` and `next` as ARRAYS of paragraph strings —
// the renderer puts visible whitespace between them so a sheet with three
// statements reads as three statements, not one wall of text.
const CHEAT_SHEETS = {
  1: {
    badge: "Act 1 of 5 · The Problem",
    sawTitle: "What you just saw",
    saw: [
      "AI agent accuracy AND cost depend on many configuration choices.",
      "Trial-and-error tuning is brutal — slow, expensive, no guarantee of finding the optimum.",
    ],
    nextTitle: "Coming up in next scene",
    next: [
      "Knob Selection.",
      "Choose which knobs to tune your agent with. A guided tour through one realistic search space.",
      "All grounded in BIRD — a real, published text-to-SQL benchmark with a known dev/test set and a tracked SOTA leaderboard. Not a hypothetical.",
    ],
    links: [
      { label: "Explore all the knobs available (25+)", href: "/knob-explorer" },
      { label: "BIRD-bench leaderboard (external)", href: "https://bird-bench.github.io/", external: true },
    ],
  },
  2: {
    badge: "Act 2 of 5 · Knob Selection",
    sawTitle: "What you just saw",
    saw: [
      "Knobs were selected for the BIRD text-to-SQL agent — 6 models and 8 agent-level knobs.",
      "6 × 5 × 4 × 3 × 3 × 3 × 3 × 3 × 2 = 58,320",
      "(models × few-shot k × example sel × CoT × self-consistency × self-correction × decomposition × reflection × tool exec)",
      "This is conservative — real production agents have 20+ knobs and millions of configs.",
    ],
    nextTitle: "Coming up in next scene",
    next: [
      "Now we've selected the knobs.",
      "Next: what we actually want to find — high accuracy AND low cost, fast.",
    ],
    links: [
      { label: "Configuration Multiverse (deep dive)", href: "/blog/the-config-multiverse" },
    ],
    tip: "Note the legend and sort bar. You may scroll down and explore what was selected — and what wasn't (yet).",
  },
  3: {
    badge: "Act 3 of 5 · What we want",
    sawTitle: "What you just saw",
    saw: [
      "Two goals, in order:",
      "(1) find the peak accuracy;",
      "(2) at that accuracy band, find equally-good alternatives at much lower cost.",
      "Both fast.",
    ],
    nextTitle: "Coming up in next scene",
    next: [
      "The two Optimization Steps:",
      "Step 1 — find the accuracy peak.",
      "Step 2 — hold that accuracy and sweep for the cheapest equivalents.",
      "Both at 4× speed.",
    ],
    links: [],
  },
  4: {
    badge: "Act 4 of 5 · The Optimization",
    sawTitle: "What you just saw",
    saw: [
      "Step 1 (Run #1) needed just 81 of the 58,320 possible configurations to find 74.8% accuracy — Claude Sonnet, $0.00036/query, SOTA-band.",
      "Step 2 (Run #2) then needed only 50 more to find feasible alternatives at the same accuracy band at ~1/10 the cost.",
      "Both fully automatic.",
    ],
    nextTitle: "Coming up in next scene",
    next: [
      "The bottom line — what this means for any agent dev team.",
    ],
    links: [],
  },
  5: {
    badge: "Act 5 of 5 · The Win",
    sawTitle: "The whole story in one breath",
    saw: [
      "You select knobs, Traigent (1) finds the highest accuracy, then (2) finds the cheapest equivalent.",
      "Minutes. Zero engineering effort.",
      "Out of millions of options you get the right one — not the one you guessed.",
    ],
    nextTitle: "Optimization is never done",
    next: [
      "Today's optimum is tomorrow's stale config. Each of these triggers a re-sweep:",
      "• New knobs (new selections)",
      "• New datasets — your workload evolves",
      "• New agent release — your code changed",
      "• New models — providers ship constantly",
      "• New token prices",
      "• New monthly LLM budget constraints",
      "Optimization is ongoing. So is Traigent.",
    ],
    links: [
      { label: "Explore the search space", href: "/knob-explorer" },
    ],
  },
};

function CheatSheet({ sheet, onResume, isLastAct }) {
  // Starts COLLAPSED so the act's punch frame (the title + the prose the
  // viewer just heard narrated) stays visually unobstructed. The bouncing
  // ChevronDown + yellow ring on the toggle button signal that there's
  // more to read if they want it.
  const [collapsed, setCollapsed] = useState(true);
  if (!sheet) return null;
  const resumeLabel = isLastAct ? "Replay from Act 1" : "Resume — Next act";
  const ResumeIcon = isLastAct ? RotateCcw : SkipForward;
  const ToggleIcon = collapsed ? ChevronDown : ChevronUp;
  return (
    <motion.aside
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="absolute top-16 md:top-20 right-3 md:right-6 z-40 w-[min(94vw,22rem)] md:w-[24rem] max-h-[calc(100vh-10rem)] overflow-y-auto pointer-events-auto"
    >
      <div className="rounded-2xl bg-yellow-400/15 border border-yellow-400/60 backdrop-blur-md shadow-2xl shadow-yellow-500/10 p-5 md:p-6">
        {/* Header row: badge + collapse/expand toggle. */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="text-[10px] md:text-[11px] font-mono uppercase tracking-widest text-yellow-200 flex-1">
            {sheet.badge}
          </div>
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            title={collapsed ? "Expand" : "Hide details"}
            className={`flex-shrink-0 -mt-1 -mr-1 w-7 h-7 flex items-center justify-center rounded-md text-yellow-200 hover:text-white hover:bg-yellow-400/20 transition-colors ${
              collapsed ? "ring-2 ring-yellow-300/60" : ""
            }`}
          >
            <ToggleIcon className={`w-4 h-4 ${collapsed ? "animate-bounce" : ""}`} />
          </button>
        </div>
        {!collapsed && (
          <div className="mb-5">
            <div className="text-[10px] font-mono uppercase tracking-widest text-yellow-300/90 mb-2">
              {sheet.sawTitle}
            </div>
            <div className="space-y-2.5">
              {(Array.isArray(sheet.saw) ? sheet.saw : [sheet.saw]).map((para, i) => (
                <p key={i} className="text-sm md:text-[15px] text-white leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </div>
        )}
        {!collapsed && (
          <div className={sheet.links.length ? "mb-5" : ""}>
            <div className="text-[10px] font-mono uppercase tracking-widest text-yellow-300/90 mb-2">
              {sheet.nextTitle}
            </div>
            <div className="space-y-2.5">
              {(Array.isArray(sheet.next) ? sheet.next : [sheet.next]).map((para, i) => (
                <p key={i} className="text-sm md:text-[15px] text-white leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </div>
        )}
        {!collapsed && sheet.links.length > 0 && (
          <div className="flex flex-col gap-1.5 mt-3 pt-3 border-t border-yellow-400/30">
            <div className="text-[10px] font-mono uppercase tracking-widest text-yellow-300/90 mb-0.5">
              Dig deeper
            </div>
            {sheet.links.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-yellow-100 hover:text-white underline decoration-yellow-400/40 hover:decoration-yellow-300 underline-offset-2 transition-colors"
                >
                  {link.label}
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className="inline-flex items-center gap-1.5 text-sm text-yellow-100 hover:text-white underline decoration-yellow-400/40 hover:decoration-yellow-300 underline-offset-2 transition-colors"
                >
                  {link.label}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )
            )}
          </div>
        )}
        {!collapsed && sheet.tip && (
          <div className="mt-3 pt-3 border-t border-yellow-400/30">
            <div className="text-[10px] font-mono uppercase tracking-widest text-yellow-300/90 mb-2">
              Tip
            </div>
            <p className="text-sm md:text-[15px] text-white/90 leading-relaxed italic">
              {sheet.tip}
            </p>
          </div>
        )}
        {/* Resume / Replay button — same handler as the controls bar Play
            (which already advances to the next act in end-of-act state).
            On Act 5, becomes a Replay-from-Act-1 control. */}
        <button
          type="button"
          onClick={onResume}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 mt-5 rounded-lg bg-[#1A6BF5] hover:bg-[#4D8EF8] text-white font-semibold transition-colors shadow-lg shadow-blue-500/30"
        >
          <ResumeIcon className="w-4 h-4 fill-white" />
          {resumeLabel}
        </button>
      </div>
    </motion.aside>
  );
}

// =============================================================================
// Acts definition — timings tuned to narrator pace.
// =============================================================================

// Sentences are hoisted to module-level constants so their array references
// stay stable across StoryMovie re-renders. Inline literals would create a
// new array reference every render, busting Narration's `flatRows` useMemo,
// busting `rowReveals`, restarting the advance timer — which the 100ms
// progress-bar ticker would do every tick and so Act 1 never finishes its
// first row.
const ACT_1_SENTENCES = [
  {
    rows: [
      "AI Agent Accuracy and Cost are derived",
      "from millions of optional configurations",
    ],
    trailingButton: {
      label: "Explore the configuration space",
      href: "/knob-explorer",
    },
  },
  [
    "Trial and Error can be brutal",
    "Not guaranteed to find the optimum",
    "Consumes time and effort",
  ],
];

// Act 1 wrapper — fixed "The Problem" headline that's BIG and sits just
// above the narration. The headline + narration are stacked in a single
// centered flex column so they group together vertically — much closer
// than absolute-positioning the headline at the top of the slide.
function Act1Problem({ onComplete, paused, startAtEnd }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-8 md:px-16">
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-rose-300 tracking-tight mb-6 md:mb-8">
        The Problem
      </h1>
      <Narration
        sentences={ACT_1_SENTENCES}
        wpm={315}
        onComplete={onComplete}
        paused={paused}
        startAtEnd={startAtEnd}
        noWrapper
      />
    </div>
  );
}

const ACT_3_SENTENCES = [
  ["Rapidly find the best accuracy"],
  ["Then find similar accuracies", "but with much lower LLM costs"],
  ["Let's see how Traigent", "does this automatically."],
];

// Act 3 wrapper — fixed "What everyone wants" headline at the top, with
// the narration centered below as one vertically-centered group. Mirrors
// Act1Problem's structure but with a sky-blue accent (aspirational vs
// rose's "problem" signal).
function Act3Want({ onComplete, paused, startAtEnd }) {
  // No explicit dwell here anymore — the parent freezes the act at its
  // end-frame waiting for the user's Next click, which is the dwell.
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-8 md:px-16">
      <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-sky-300 tracking-tight mb-6 md:mb-8">
        What everyone wants
      </h1>
      <Narration
        sentences={ACT_3_SENTENCES}
        wpm={470}
        rowPauseMs={70}
        sentencePauseMs={270}
        onComplete={onComplete}
        paused={paused}
        startAtEnd={startAtEnd}
        noWrapper
      />
    </div>
  );
}

// Render signature: (onComplete, restart, opts) where opts may carry
// { paused: bool, showFinal: bool } for the playback controls.
const ACTS = [
  {
    id: 1,
    label: "The problem",
    durationMs: 18_000,
    render: (onComplete, _restart, opts = {}) => (
      <Act1Problem
        onComplete={onComplete}
        paused={opts.paused}
        startAtEnd={opts.showFinal}
      />
    ),
  },
  {
    id: 2,
    label: "The config space",
    durationMs: 24_500,
    render: (onComplete, _restart, opts = {}) => (
      <EmbeddedAct
        src={`/#/knob-explorer?guided=BIRD&chrome=hidden${opts.showFinal ? "&final=1" : ""}`}
        durationMs={24_500}
        title="Knob space — BIRD configuration"
        onComplete={onComplete}
        paused={opts.paused}
        showFinal={opts.showFinal}
      />
    ),
  },
  {
    id: 3,
    label: "The want",
    durationMs: 20_000,
    render: (onComplete, _restart, opts = {}) => (
      <Act3Want
        onComplete={onComplete}
        paused={opts.paused}
        startAtEnd={opts.showFinal}
      />
    ),
  },
  {
    id: 4,
    label: "The optimization",
    durationMs: 90_000,
    render: (onComplete, _restart, opts = {}) => (
      <EmbeddedAct
        src={`/#/demo?autostart=1&speed=4x&chrome=hidden${opts.showFinal ? "&final=1" : "&pauseAfterStep1=1"}`}
        durationMs={90_000}
        title="Optimization demo (4× speed)"
        onComplete={onComplete}
        paused={opts.paused}
        showFinal={opts.showFinal}
      />
    ),
  },
  {
    id: 5,
    label: "The win",
    durationMs: 24_000,
    // Act 5 doesn't auto-advance — it owns its terminal frame (Start Now +
    // Book a demo CTAs). The opts.showFinal flag (set when user clicks
    // "End Act 5") skips the narration so the final state with buttons
    // appears instantly.
    render: (onComplete, _restart, opts = {}) => (
      <Act5Punch onComplete={onComplete} paused={opts.paused} startAtEnd={opts.showFinal} />
    ),
  },
];

// =============================================================================
// Page
// =============================================================================

// Initial landing state — the page opens directly on the end-frame of
// Act 1 (paused, all narration revealed). This makes the page immediately
// content-rich (no "click to start" idle screen) so a LinkedIn or social
// visitor lands inside the story rather than on a splash. Restart-from-top
// returns to this same state.
const INITIAL_ACT = 1;
const INITIAL_PAUSED = true;
const INITIAL_SHOW_FINAL = true;

export default function StoryMovie() {
  usePageView();
  // currentAct: 0 = idle / splash (no longer the default — reachable only
  // if something explicitly sets it back to 0), 1..5 = act in progress.
  const [currentAct, setCurrentAct] = useState(INITIAL_ACT);
  const [isPaused, setIsPaused] = useState(INITIAL_PAUSED);
  // True when the current act should render in its FINAL frame (all narration
  // rows revealed for text acts; iframe page in its terminal state for
  // embedded acts). Set when the user clicks an "End Act N" button. Cleared
  // on any natural advance.
  const [showFinalState, setShowFinalState] = useState(INITIAL_SHOW_FINAL);
  // Elapsed ms in the current act — drives the per-act progress fill on the
  // controls bar.
  const [actElapsedMs, setActElapsedMs] = useState(0);
  const advancingRef = useRef(false);
  useRemoveChatWidget();

  // /story is intentionally ungated — no email form. The hook below
  // silently fires a Story-watched notification when a known visitor
  // lands on the page (localStorage email OR hsutk Worker match). 1h
  // per-gate throttle.
  useKnownContactNotify({
    notify: notifyStoryWatched,
    location: "story_page",
    eventName: "story_watched_known",
    gateKey: "story",
  });

  const start = useCallback(() => {
    advancingRef.current = false;
    setIsPaused(false);
    setShowFinalState(false);
    setActElapsedMs(0);
    setCurrentAct(1);
  }, []);
  const restart = useCallback(() => {
    advancingRef.current = false;
    setIsPaused(false);
    setShowFinalState(false);
    setActElapsedMs(0);
    setCurrentAct(0);
    setTimeout(() => setCurrentAct(1), 100);
  }, []);
  // "Restart from the top" — returns to the initial end-of-Act-1 landing
  // state (paused, all narration revealed). Same shape as the page's first
  // mount.
  const restartFromTop = useCallback(() => {
    advancingRef.current = false;
    setIsPaused(INITIAL_PAUSED);
    setShowFinalState(INITIAL_SHOW_FINAL);
    setActElapsedMs(0);
    setCurrentAct(INITIAL_ACT);
  }, []);

  const advance = useCallback(() => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    setShowFinalState(false);
    setCurrentAct((a) => a + 1);
    setActElapsedMs(0);
    setTimeout(() => {
      advancingRef.current = false;
    }, 50);
  }, []);

  // Called when an act's content (narration or iframe) finishes playing.
  // Instead of advancing to the next act automatically, we FREEZE on the
  // act's end-frame and wait for the user to click Next (the Play button
  // now reads as Next in this state) or Back.
  const actCompleted = useCallback(() => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    setIsPaused(true);
    setShowFinalState(true);
    setActElapsedMs(0);
    setTimeout(() => {
      advancingRef.current = false;
    }, 50);
  }, []);

  // Jump to the END frame of act N — stays on the same act but renders its
  // final state (all narration revealed for text acts, iframe at terminal
  // state for embedded acts), paused. Pressing Play then advances to the
  // next act (or restarts from Act 1 if we were at Act 5's end).
  const jumpToEndOfAct = useCallback((n) => {
    advancingRef.current = false;
    setIsPaused(true);
    setShowFinalState(true);
    setActElapsedMs(0);
    if (currentAct === n) {
      // Already on this act — EmbeddedAct locks its src at mount, so we
      // need a full remount to swap the iframe to the `&final=1` URL. Cycle
      // through act 0 briefly so AnimatePresence rebuilds the subtree.
      setCurrentAct(0);
      setTimeout(() => setCurrentAct(n), 50);
    } else {
      setCurrentAct(n);
    }
  }, [currentAct]);

  const togglePause = useCallback(() => {
    // On the idle screen (currentAct === 0), Play kicks off the story.
    if (currentAct === 0) {
      start();
      return;
    }
    // When sitting at the END of an act (paused, showFinalState), Play means
    // "advance to the next act and resume". At end of Act 5 there's no next
    // act, so Play restarts from Act 1.
    if (isPaused && showFinalState) {
      if (currentAct >= ACTS.length) {
        restart();
      } else {
        setShowFinalState(false);
        setIsPaused(false);
        setActElapsedMs(0);
        setCurrentAct((c) => c + 1);
      }
      return;
    }
    setIsPaused((p) => !p);
  }, [isPaused, showFinalState, currentAct, restart, start]);

  // Back — restart the CURRENT act from its beginning, playing. If we're at
  // the end of Act N (showFinalState), this jumps back to the start of N and
  // plays N from scratch. On idle, starts Act 1.
  const backToActStart = useCallback(() => {
    advancingRef.current = false;
    setShowFinalState(false);
    setIsPaused(false);
    setActElapsedMs(0);
    if (currentAct === 0) {
      setCurrentAct(1);
    }
    // Else: currentAct stays the same; clearing showFinalState + actElapsedMs
    // restarts narration acts (Narration sees startAtEnd flip to false and
    // mounts fresh thanks to AnimatePresence keying on act.id) and re-mounts
    // iframe acts cleanly.
    // For an unambiguous restart of the SAME act, briefly cycle to 0 then
    // back to N so the AnimatePresence key swap forces a full remount.
    if (currentAct >= 1) {
      const n = currentAct;
      setCurrentAct(0);
      setTimeout(() => setCurrentAct(n), 50);
    }
  }, [currentAct]);

  // Reset elapsed time whenever the act changes.
  useEffect(() => {
    setActElapsedMs(0);
  }, [currentAct]);

  // Tick timer for progress-fill display (skipped while paused / outside any
  // playing act). 100ms granularity is enough for a smooth-looking bar.
  useEffect(() => {
    if (currentAct < 1 || currentAct > ACTS.length) return undefined;
    if (isPaused) return undefined;
    const tick = setInterval(() => setActElapsedMs((t) => t + 100), 100);
    return () => clearInterval(tick);
  }, [currentAct, isPaused]);

  // Hard timeout fallback per act so the movie can't stall if a nested
  // component never fires onComplete. The LAST act (Act 5 punch) is skipped
  // here — it owns its own end-state with its in-slide CTAs. Suspended
  // while paused. Calls actCompleted (not advance) so the act freezes on
  // its end-frame waiting for the user's Next click.
  useEffect(() => {
    if (currentAct < 1 || currentAct >= ACTS.length) return;
    if (isPaused) return;
    const act = ACTS[currentAct - 1];
    const fallback = setTimeout(() => actCompleted(), act.durationMs + 2000);
    return () => clearTimeout(fallback);
  }, [currentAct, actCompleted, isPaused]);

  const act = currentAct >= 1 && currentAct <= ACTS.length ? ACTS[currentAct - 1] : null;

  return (
    <>
      <Helmet>
        <title>Full story · Traigent</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <ChatKillerStyle />

      <section className="bg-[#080808] text-white min-h-screen relative overflow-hidden">
        {/* Idle / start screen */}
        {currentAct === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Link
              to="/"
              className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to traigent.ai
            </Link>
            <div className="text-center max-w-3xl px-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-mono tracking-wider mb-4 text-[#4D8EF8]">
                <Sparkles className="w-3.5 h-3.5" />
                THE FULL STORY
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4">
                Why Traigent
              </h1>
              <p className="text-lg md:text-xl text-slate-400 mb-8">
                The problem · The config space · The want · The optimization · The win.
                <br />
                Five acts. About one minute.
              </p>
              <button
                type="button"
                onClick={start}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500/20 text-blue-100 border border-blue-500/50 hover:bg-blue-500/30 transition-colors font-medium text-lg"
              >
                <Play className="w-5 h-5" />
                Play the story
              </button>
              {/* Hint that the controls bar at the bottom lets the viewer
                  skip straight to any act's end frame. */}
              <p className="mt-6 text-base md:text-lg text-slate-300">
                Or skip to any scene via the control bars below
                <span className="inline-block ml-4 md:ml-6 text-2xl md:text-3xl text-blue-300 font-bold align-middle animate-bounce">
                  ↓
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Persistent back-to-home link — visible across every act so the
            viewer can always exit the story back to the homepage. */}
        <Link
          to="/"
          className="absolute top-4 left-4 z-50 inline-flex items-center gap-1.5 text-xs md:text-sm text-slate-400 hover:text-white transition-colors px-2.5 py-1.5 rounded-md bg-slate-900/40 hover:bg-slate-900/70 backdrop-blur"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to traigent.ai
        </Link>

        {/* Active act */}
        {act && (
          <div className="absolute inset-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={act.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                {act.render(actCompleted, restart, { paused: isPaused, showFinal: showFinalState })}
              </motion.div>
            </AnimatePresence>

            {/* Act indicator */}
            <div className="absolute top-4 right-4 text-[10px] font-mono uppercase tracking-widest text-slate-600 z-50">
              Act {act.id} / {ACTS.length} · {act.label}
            </div>
          </div>
        )}

        {/* Cheat sheet — yellow educational panel that floats over the right
            side of the screen at end-of-act state. Recaps what the viewer
            saw and previews what's next, plus optional dig-deeper links. */}
        <AnimatePresence>
          {currentAct >= 1 && isPaused && showFinalState && (
            <CheatSheet
              key={`sheet-${currentAct}`}
              sheet={CHEAT_SHEETS[currentAct]}
              onResume={togglePause}
              isLastAct={currentAct >= ACTS.length}
            />
          )}
        </AnimatePresence>

        {/* Landing-state hint — shown only when sitting on Act 1's end frame
            (the default initial state). Cues the viewer toward the controls
            bar so they know they can play through or jump straight to any
            scene. Hides as soon as anything else happens. */}
        {currentAct === 1 && isPaused && showFinalState && (
          <div className="absolute bottom-30 left-0 right-0 z-40 flex justify-center pointer-events-none px-4" style={{ bottom: "7.5rem" }}>
            <div className="pointer-events-auto inline-flex items-center gap-2.5 md:gap-3 px-3 md:px-4 py-2 md:py-2.5 rounded-full bg-yellow-400/20 border border-yellow-400/70 backdrop-blur">
              <span className="text-base md:text-xl text-white font-medium">
                {/* A real, clickable play button — same handler as the bottom-
                    bar Play. Solid blue so it pops against the yellow pill
                    background as the obvious next action. */}
                <button
                  type="button"
                  onClick={togglePause}
                  className="inline-flex items-center gap-1 mr-1.5 px-2.5 py-0.5 rounded-full bg-[#1A6BF5] hover:bg-[#4D8EF8] text-white font-bold transition-colors shadow-lg shadow-blue-500/40 align-baseline"
                >
                  <Play className="w-3.5 h-3.5 md:w-4 md:h-4 fill-white" />
                  play
                </button>
                or jump directly to scenes
              </span>
              <span
                className="text-2xl md:text-3xl text-yellow-200 font-bold animate-bounce"
                style={{ filter: "drop-shadow(0 0 12px rgba(250, 204, 21, 0.8))" }}
              >
                ↓
              </span>
            </div>
          </div>
        )}

        {/* No separate end-of-story screen — Act 5 owns its own freeze
            state with the "That's Traigent" tagline + Replay/Visit buttons
            rendered inside Act5Punch at the bottom of the slide. */}

        {/* Playback controls — visible from the very beginning, including on
            the idle screen. On idle, Play starts the story, Back / Restart
            also kick Act 1 off, and the act-segment buttons jump straight to
            the end-state of the chosen act (paused). */}
        <PlaybackControls
          currentAct={currentAct}
          acts={ACTS}
          actElapsedMs={actElapsedMs}
          isPaused={isPaused}
          showFinalState={showFinalState}
          onRestartFromTop={restartFromTop}
          onBackToActStart={backToActStart}
          onJumpToEndOfAct={jumpToEndOfAct}
          onTogglePause={togglePause}
        />
      </section>
    </>
  );
}

// =============================================================================
// Playback controls bar — bottom of the /story page, visible from idle on.
//   - "↺" Restart: full restart, back to the idle play-the-story screen.
//   - "⏪" Back: restart the current act from its beginning, playing. When
//      sitting at the end of Act N (showFinal), this jumps back to the
//      START of N and plays. On idle, kicks off Act 1.
//   - 5 segment buttons (one per act): jump to the END of that act, paused.
//      The active act's segment shows a live progress fill.
//   - "▶/⏸" Play/Pause: toggle, with smart behavior — on idle it starts the
//      story; at end of an act it advances to the next act and plays.
// =============================================================================

function PlaybackControls({
  currentAct,
  acts,
  actElapsedMs,
  isPaused,
  showFinalState,
  onRestartFromTop,
  onBackToActStart,
  onJumpToEndOfAct,
  onTogglePause,
}) {
  // Three button states:
  //   - actively playing → ⏸ Pause
  //   - paused at end of an act → ⏭ Next (Skip-forward icon — clicking
  //     advances to the start of the next act)
  //   - everything else (idle, paused mid-act) → ▶ Play
  const showPauseIcon = !isPaused && currentAct >= 1 && !showFinalState;
  const showNextIcon  = isPaused && showFinalState && currentAct >= 1;
  return (
    <div className="absolute bottom-0 left-0 right-0 z-50 px-4 pb-4 pointer-events-none">
      <div className="mx-auto max-w-5xl rounded-2xl bg-slate-900/85 backdrop-blur border border-slate-700/70 shadow-2xl px-3 py-2.5 flex items-center gap-2 pointer-events-auto">
        {/* Restart-from-top button */}
        <button
          type="button"
          onClick={onRestartFromTop}
          title="Restart from idle screen"
          className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-800/80 text-slate-200 border border-slate-700 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Back — restart current act from beginning, playing. */}
        <button
          type="button"
          onClick={onBackToActStart}
          title={
            currentAct === 0
              ? "Start Act 1"
              : `Back to beginning of Act ${currentAct}`
          }
          className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-800/80 text-slate-200 border border-slate-700 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        {/* 5 act segments — each is clickable to seek to end-of-act + shows
            a progress fill for that act. */}
        <div className="flex-1 flex gap-1.5">
          {acts.map((a) => {
            const isPast = currentAct > a.id;
            const isCurrent = currentAct === a.id;
            const progress = isPast || (isCurrent && showFinalState)
              ? 1
              : isCurrent
              ? Math.min(1, actElapsedMs / a.durationMs)
              : 0;
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => onJumpToEndOfAct(a.id)}
                title={`Jump to end of Act ${a.id} · ${a.label}`}
                className={`flex-1 relative h-9 rounded-lg border overflow-hidden text-[10px] font-mono uppercase tracking-widest transition-colors ${
                  isCurrent
                    ? "bg-blue-500/10 border-blue-500/50 text-blue-100"
                    : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {/* Progress fill */}
                <span
                  className="absolute inset-y-0 left-0 bg-blue-500/30"
                  style={{ width: `${progress * 100}%` }}
                />
                <span className="relative z-10 flex items-center justify-center h-full px-2">
                  {a.id} · {a.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Play/Pause toggle */}
        <button
          type="button"
          onClick={onTogglePause}
          title={showPauseIcon ? "Pause" : showNextIcon ? "Next act" : "Play"}
          className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-500/20 text-blue-100 border border-blue-500/50 hover:bg-blue-500/30 transition-colors"
        >
          {showPauseIcon ? (
            <Pause className="w-4 h-4" />
          ) : showNextIcon ? (
            <SkipForward className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
