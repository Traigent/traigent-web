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
import { ArrowLeft, ArrowRight, Pause, Play, RotateCcw, SkipBack, Sparkles } from "lucide-react";
import { useRemoveChatWidget } from "../lib/useRemoveChatWidget";
import ChatKillerStyle from "../lib/ChatKillerStyle";
import StartNowModal from "../components/StartNowModal";

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
  const [loaded, setLoaded] = useState(false);
  const [absoluteSrc, setAbsoluteSrc] = useState(src);

  // Resolve to an absolute URL once the component is on the client. Using
  // `window.location.origin + src` removes any base-path ambiguity that can
  // make the iframe load a blank document (which was the Act 2 black-screen
  // bug — relative `/#/...` resolved against the wrong origin in some dev
  // setups, producing an empty page).
  useEffect(() => {
    if (typeof window !== "undefined") {
      setAbsoluteSrc(window.location.origin + src);
    }
  }, [src]);

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

function Act5Punch({ startAtEnd = false, paused = false }) {
  // When startAtEnd is true (user clicked "End Act 5" from controls), the
  // narration is skipped to its final state and the buttons appear instantly.
  const [narrationDone, setNarrationDone] = useState(startAtEnd);
  // Modal state for the "Start Now" CTA — same install/checkout flow as the
  // homepage TopNav button.
  const [showStartNow, setShowStartNow] = useState(false);
  // STABLE callback — Narration depends on `onComplete` reference identity.
  // An inline arrow here would change every render, and StoryMovie's 100ms
  // progress ticker re-renders the whole act tree, which would reset
  // Narration's row-reveal timer and freeze Act 5 after the first row.
  const handleNarrationComplete = useCallback(() => setNarrationDone(true), []);
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-8 md:px-16">
      {/* Narration + tagline + buttons sit in a single column centered
          vertically as one group. The tagline/buttons block reserves its
          layout space from the start (rendered with opacity 0 until the
          narration finishes), so the narration position doesn't shift
          when the buttons fade in. */}
      <Narration
        sentences={ACT_5_SENTENCES}
        wpm={315}
        onComplete={handleNarrationComplete}
        noWrapper
        paused={paused}
        startAtEnd={startAtEnd}
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: narrationDone ? 1 : 0, y: narrationDone ? 0 : 24 }}
        transition={{ duration: 0.7 }}
        className="mt-14 flex items-center gap-4"
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
      {showStartNow && <StartNowModal onClose={() => setShowStartNow(false)} />}
    </div>
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
  ["We want to rapidly find", "the optimal accuracy"],
  ["Then we want similar accuracies", "but with much lower LLM costs"],
  ["Let's see how Traigent", "does this automatically."],
];

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
    label: "Search space",
    durationMs: 35_000,
    render: (onComplete, _restart, opts = {}) => (
      <EmbeddedAct
        src={`/#/knob-explorer?guided=BIRD&chrome=hidden${opts.showFinal ? "&final=1" : ""}`}
        durationMs={35_000}
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
      <Narration
        sentences={ACT_3_SENTENCES}
        wpm={315}
        onComplete={onComplete}
        paused={opts.paused}
        startAtEnd={opts.showFinal}
      />
    ),
  },
  {
    id: 4,
    label: "Optimize",
    durationMs: 26_500,
    render: (onComplete, _restart, opts = {}) => (
      <EmbeddedAct
        src={`/#/demo?autostart=1&speed=4x&chrome=hidden${opts.showFinal ? "&final=1" : ""}`}
        durationMs={26_500}
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
    render: (_onComplete, _restart, opts = {}) => (
      <Act5Punch paused={opts.paused} startAtEnd={opts.showFinal} />
    ),
  },
];

// =============================================================================
// Page
// =============================================================================

export default function StoryMovie() {
  // currentAct: 0 = idle (haven't started), 1..5 = act in progress, 6 = done.
  const [currentAct, setCurrentAct] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  // True when the current act should render in its FINAL frame (all narration
  // rows revealed for text acts; iframe page in its terminal state for
  // embedded acts). Set when the user clicks an "End Act N" button. Cleared
  // on any natural advance.
  const [showFinalState, setShowFinalState] = useState(false);
  // Elapsed ms in the current act — drives the per-act progress fill on the
  // controls bar.
  const [actElapsedMs, setActElapsedMs] = useState(0);
  const advancingRef = useRef(false);
  useRemoveChatWidget();

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
  // "Restart from the top" — returns to the idle screen (the big Play button).
  const restartFromTop = useCallback(() => {
    advancingRef.current = false;
    setIsPaused(false);
    setShowFinalState(false);
    setActElapsedMs(0);
    setCurrentAct(0);
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

  // Jump to the END frame of act N — stays on the same act but renders its
  // final state (all narration revealed for text acts, iframe at terminal
  // state for embedded acts), paused. Pressing Play then advances to the
  // next act (or restarts from Act 1 if we were at Act 5's end).
  const jumpToEndOfAct = useCallback((n) => {
    advancingRef.current = false;
    setIsPaused(true);
    setShowFinalState(true);
    setActElapsedMs(0);
    setCurrentAct(n);
  }, []);

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
  // here — it owns its own end-state with the in-slide Replay + Visit
  // buttons, so we don't auto-advance off it. Also suspended while paused.
  useEffect(() => {
    if (currentAct < 1 || currentAct >= ACTS.length) return;
    if (isPaused) return;
    const act = ACTS[currentAct - 1];
    const fallback = setTimeout(() => advance(), act.durationMs + 2000);
    return () => clearTimeout(fallback);
  }, [currentAct, advance, isPaused]);

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
                The problem · Search space · The want · Optimize · The win.
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
              <p className="mt-5 text-sm text-slate-500">
                Or skip to any scene from the controls bar below
                <span className="text-slate-600"> ↓</span>
              </p>
            </div>
          </div>
        )}

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
                {act.render(advance, restart, { paused: isPaused, showFinal: showFinalState })}
              </motion.div>
            </AnimatePresence>

            {/* Act indicator */}
            <div className="absolute top-4 right-4 text-[10px] font-mono uppercase tracking-widest text-slate-600 z-50">
              Act {act.id} / {ACTS.length} · {act.label}
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
  // Pause icon shows only while the story is actively PLAYING (i.e. not
  // paused, not on idle, not at end of an act). Everywhere else Play is the
  // correct icon — clicking it advances to whatever the next step is.
  const showPauseIcon = !isPaused && currentAct >= 1 && !showFinalState;
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
          title={showPauseIcon ? "Pause" : "Play"}
          className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-500/20 text-blue-100 border border-blue-500/50 hover:bg-blue-500/30 transition-colors"
        >
          {showPauseIcon ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
