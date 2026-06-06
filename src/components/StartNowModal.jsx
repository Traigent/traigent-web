/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { X, ArrowRight, Github } from "lucide-react";
import InstallCommand from "./InstallCommand";
import HubSpotStartNowForm from "./HubSpotStartNowForm";
import {
  isUnlocked,
  markUnlocked,
  getUnlockedEmail,
  shouldNotifyRepeatVisit,
} from "../lib/startNowGate";
import { notifyStartNowRepeat } from "../lib/hubspotForms";
import { trackEvent } from "../lib/analytics";

/**
 * Two-state modal:
 *   1. Locked  → HubSpot form captures email
 *   2. Unlocked → install command + "View on GitHub"
 *
 * Once submitted, the unlock persists for 90 days (see `startNowGate.js`).
 * The `location` prop is the breadcrumb of where the visitor clicked Start
 * Now (topnav, hero, pricing, roi-calculator, story-act-5, …) — passed
 * straight to the analytics event so we can see which surfaces convert.
 */
export default function StartNowModal({ onClose, location = "unknown" }) {
  // Initialize from localStorage so repeat visitors skip the form.
  const [unlocked, setUnlocked] = useState(() => isUnlocked());

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // When an already-unlocked visitor reopens the modal, silently re-submit
  // their stored email to HubSpot so the founder gets a notification that
  // they came back. Throttled to once per 24h per visitor (see
  // shouldNotifyRepeatVisit in startNowGate.js) so the inbox stays sane.
  useEffect(() => {
    if (!unlocked) return;
    if (!shouldNotifyRepeatVisit()) return;
    const email = getUnlockedEmail();
    if (!email) return;
    notifyStartNowRepeat({ email, location });
    trackEvent("start_now_repeat_visit", { location });
    // We only want this to fire on mount when the modal opens unlocked,
    // never re-fire on re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitted = (email) => {
    markUnlocked(email);
    setUnlocked(true);
    trackEvent("start_now_form_submitted", { location });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="start-now-title"
        className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {unlocked ? (
          <UnlockedView />
        ) : (
          <LockedView onSubmitted={handleSubmitted} />
        )}
      </div>
    </div>
  );
}

function LockedView({ onSubmitted }) {
  return (
    <>
      <h2 id="start-now-title" className="text-2xl font-bold text-white mb-2">
        Start Now — Free
      </h2>
      <p className="text-slate-400 mb-6">
        Run the keyless demo on your laptop in under a minute. Tell us where to
        send setup tips — the install command unlocks as soon as you submit.
      </p>
      <HubSpotStartNowForm onSuccess={onSubmitted} />
    </>
  );
}

function UnlockedView() {
  return (
    <>
      <h2 id="start-now-title" className="text-2xl font-bold text-white mb-2">
        Thanks — here's your quickstart
      </h2>
      <p className="text-slate-400 mb-6">
        Run the keyless demo on your laptop in under a minute — no API keys, no
        LLM provider calls, no spend.
      </p>

      <InstallCommand
        command='uv tool install "traigent[recommended]" && traigent quickstart'
        secondary="No API keys. No LLM provider calls. No spend. Just python. (Have pip instead? `pip install` works too.)"
      />

      <div className="flex flex-wrap gap-3 mt-6">
        <a
          href="https://github.com/Traigent/Traigent"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center bg-[#1A6BF5] hover:bg-[#4D8EF8] text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
        >
          <Github className="mr-2 h-4 w-4" />
          View on GitHub
          <ArrowRight className="ml-2 h-4 w-4" />
        </a>
      </div>
    </>
  );
}
