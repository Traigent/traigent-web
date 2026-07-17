import { useCallback, useEffect, useRef, useState } from "react";

// The canonical, keyless agent-setup prompt, served as a static asset from
// public/agent-setup/prompt.md (synced from traigent-skills). Both "Connect
// your agent" CTAs copy this exact text to the clipboard.
const PROMPT_URL = "/agent-setup/prompt.md";

/**
 * Shared clipboard behaviour for the "Connect your agent" CTAs.
 *
 * Prefetches the served prompt once on mount so the click handler can write to
 * the clipboard within the user gesture (some browsers reject an async
 * clipboard write that happens after an awaited fetch). Falls back to fetching
 * inside the handler if the prefetch has not resolved yet.
 *
 * @returns {{ copied: boolean, copyPrompt: () => Promise<boolean> }}
 */
export function useAgentSetupPrompt() {
  const [copied, setCopied] = useState(false);
  const textRef = useRef(null);
  const resetTimerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    fetch(PROMPT_URL)
      .then((res) => (res.ok ? res.text() : null))
      .then((text) => {
        if (!cancelled && text) textRef.current = text;
      })
      .catch(() => {
        // Prefetch is best-effort; copyPrompt retries the fetch on click.
      });
    return () => {
      cancelled = true;
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const copyPrompt = useCallback(async () => {
    if (!navigator.clipboard?.writeText) return false;

    let text = textRef.current;
    if (!text) {
      try {
        const res = await fetch(PROMPT_URL);
        if (res.ok) {
          text = await res.text();
          textRef.current = text;
        }
      } catch {
        return false;
      }
    }
    if (!text) return false;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => setCopied(false), 2000);
      return true;
    } catch {
      return false;
    }
  }, []);

  return { copied, copyPrompt };
}
