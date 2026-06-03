// GuidedTour — a scripted cursor + highlight-box overlay used by Act 2 of
// /story to walk a viewer through Knob Explorer end-to-end.
//
// Each step names a CSS selector (`selector`) that the highlight box should
// frame. Optionally `clickSelector` names a more specific descendant whose
// .click() the cursor invokes — this lets the highlight stay on a wide
// row/grid while the cursor clicks individual cells inside it (e.g. the
// yellow box surrounds a vendor's model grid while the cursor clicks each
// model card one by one, each card turning blue as state updates).
//
// Sequence per step:
//   (1) scroll the highlight target into view,
//   (2) move the highlight box over its bounds,
//   (3) move the cursor onto the click target (or highlight center),
//   (4) optionally .click() the clickSelector (or selector if absent),
//   (5) dwell for `dwellMs`, then advance.
//
// Highlight + cursor are `position: fixed` so they sit above the entire page
// regardless of scroll position. Both transition smoothly between targets.
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

const SCROLL_SETTLE_MS = 650;

function findClickTarget(el) {
  // If the marker is on a wrapper, find the innermost clickable inside.
  if (el.matches?.("button, input, a")) return el;
  return el.querySelector("button, input, a, [role='button']") || el;
}

export default function GuidedTour({ active, steps, onComplete }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [rect, setRect] = useState(null);
  const [cursorPos, setCursorPos] = useState(null);

  // For each step: scroll, capture rect + cursor position, optionally click,
  // then advance.
  useEffect(() => {
    if (!active) return undefined;
    if (stepIdx >= steps.length) {
      const t = setTimeout(() => onComplete?.(), 200);
      return () => clearTimeout(t);
    }
    const step = steps[stepIdx];
    let cancelled = false;

    const highlightEl = document.querySelector(step.selector);
    if (!highlightEl) {
      // eslint-disable-next-line no-console
      console.warn(`[GuidedTour] highlight selector not found: ${step.selector}`);
      const t = setTimeout(() => setStepIdx((i) => i + 1), 150);
      return () => clearTimeout(t);
    }

    // 1. Scroll the highlight target into view.
    highlightEl.scrollIntoView({ behavior: "smooth", block: "center" });

    // 2. After scroll settles: position highlight + cursor + (optionally) click.
    const settleTimer = setTimeout(() => {
      if (cancelled) return;
      const hr = highlightEl.getBoundingClientRect();
      setRect({ top: hr.top, left: hr.left, width: hr.width, height: hr.height });

      // Cursor lands on the clickSelector (if any) or the highlight center.
      const clickSel = step.clickSelector || (step.click ? step.selector : null);
      const clickEl = clickSel ? document.querySelector(clickSel) : null;
      if (clickEl) {
        const cr = clickEl.getBoundingClientRect();
        setCursorPos({
          top: cr.top + cr.height / 2 - 4,
          left: cr.left + cr.width / 2 - 4,
        });
      } else {
        setCursorPos({
          top: hr.top + hr.height / 2 - 4,
          left: hr.left + hr.width / 2 - 4,
        });
      }

      // Fire click slightly after cursor lands so the viewer sees the
      // sequence (move → click) rather than them happening at once.
      if (step.click || step.clickSelector) {
        setTimeout(() => {
          if (cancelled) return;
          const tgt = clickEl
            ? findClickTarget(clickEl)
            : findClickTarget(highlightEl);
          try {
            tgt.click();
          } catch (e) {
            // eslint-disable-next-line no-console
            console.warn(`[GuidedTour] click failed`, step, e);
          }
        }, 280);
      }
    }, SCROLL_SETTLE_MS);

    // 3. Advance after dwell.
    const advanceTimer = setTimeout(() => {
      if (cancelled) return;
      setStepIdx((i) => i + 1);
    }, SCROLL_SETTLE_MS + (step.dwellMs ?? 1000));

    return () => {
      cancelled = true;
      clearTimeout(settleTimer);
      clearTimeout(advanceTimer);
    };
  }, [stepIdx, active, steps, onComplete]);

  // Re-measure on scroll/resize so the highlight + cursor track if the page
  // reflows mid-step.
  const remeasure = useCallback(() => {
    if (!active) return;
    if (stepIdx >= steps.length) return;
    const step = steps[stepIdx];
    const el = document.querySelector(step.selector);
    if (!el) return;
    const r = el.getBoundingClientRect();
    setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    const clickSel = step.clickSelector || (step.click ? step.selector : null);
    const clickEl = clickSel ? document.querySelector(clickSel) : null;
    if (clickEl) {
      const cr = clickEl.getBoundingClientRect();
      setCursorPos({
        top: cr.top + cr.height / 2 - 4,
        left: cr.left + cr.width / 2 - 4,
      });
    } else {
      setCursorPos({
        top: r.top + r.height / 2 - 4,
        left: r.left + r.width / 2 - 4,
      });
    }
  }, [active, stepIdx, steps]);

  useEffect(() => {
    if (!active) return undefined;
    window.addEventListener("scroll", remeasure, { passive: true });
    window.addEventListener("resize", remeasure);
    return () => {
      window.removeEventListener("scroll", remeasure);
      window.removeEventListener("resize", remeasure);
    };
  }, [active, remeasure]);

  if (!active || !rect) return null;

  const pad = 6;
  const boxTop = rect.top - pad;
  const boxLeft = rect.left - pad;
  const boxW = rect.width + pad * 2;
  const boxH = rect.height + pad * 2;
  const cursorTop = cursorPos ? cursorPos.top : rect.top + rect.height / 2 - 4;
  const cursorLeft = cursorPos ? cursorPos.left : rect.left + rect.width / 2 - 4;

  return (
    <>
      {/* Yellow/orange semi-transparent highlight box. Sits OVER the target
          but with pointer-events: none so clicks still reach the page. */}
      <motion.div
        animate={{ top: boxTop, left: boxLeft, width: boxW, height: boxH }}
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: "fixed",
          zIndex: 9998,
          pointerEvents: "none",
          background: "rgba(251, 191, 36, 0.22)",
          border: "2px solid rgba(251, 191, 36, 0.9)",
          borderRadius: 12,
          boxShadow:
            "0 0 0 4px rgba(251, 191, 36, 0.18), 0 8px 32px rgba(251, 146, 60, 0.35)",
        }}
      />
      {/* Cursor — classic Mac/Windows arrow. */}
      <motion.div
        animate={{ top: cursorTop, left: cursorLeft }}
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: "fixed",
          zIndex: 9999,
          pointerEvents: "none",
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.6))",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path
            d="M4 2 L4 20 L8.5 16 L11 22 L13.5 21 L11 15 L17 15 Z"
            fill="white"
            stroke="black"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </>
  );
}
