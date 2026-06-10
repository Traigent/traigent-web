/* eslint-disable react/prop-types */
import { useState } from "react";
import { Lock } from "lucide-react";
import { Link } from "react-router-dom";
import ConsentGate from "./ConsentGate";
import ConsentCheckbox from "./ConsentCheckbox";
import HubSpotStartNowForm from "./HubSpotStartNowForm";
import { markUnlocked } from "../lib/startNowGate";
import { trackEvent } from "../lib/analytics";

// Knob Explorer lead-capture form. Configured in HubSpot to block free /
// personal email domains, so the "work email" requirement is enforced
// server-side on submit — no client-side domain check needed here.
const KNOB_EXPLORER_FORM_ID = "a9bc858e-add8-4094-995a-188ae08fd56e";

/**
 * Full-page blocking gate shown in place of the Knob Explorer for visitors
 * we don't already know. Submitting a (work) email unlocks the tool for this
 * browser for 90 days (see startNowGate). `onUnlock(email)` lets the page
 * swap in the explorer immediately without a reload.
 */
export default function KnobExplorerGate({ onUnlock }) {
  const [agreed, setAgreed] = useState(false);

  const handleSubmitted = (email) => {
    if (email) markUnlocked(email);
    trackEvent("knob_explorer_unlocked", { location: "knob_explorer_gate" });
    onUnlock(email || "");
  };

  return (
    <div className="min-h-[100svh] bg-[#080808] text-white flex items-center justify-center px-4 py-10">
      <div className="max-w-lg w-full bg-slate-900/70 border border-slate-700 rounded-2xl p-8 shadow-2xl">
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-5">
          <Lock className="w-6 h-6" style={{ color: "#4D8EF8" }} />
        </div>
        <div className="text-[11px] font-mono uppercase tracking-widest text-slate-500 mb-2">
          Knob Explorer
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Explore the search space</h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          An interactive tool for mapping an AI agent's tuning space — models,
          knobs, and the combinatorics that make optimization hard. Enter your
          work email to get access.
        </p>
        <ConsentGate>
          <div className="mb-4">
            <ConsentCheckbox
              id="knob-explorer-consent"
              checked={agreed}
              onChange={setAgreed}
            />
          </div>
          {agreed ? (
            <HubSpotStartNowForm
              onSuccess={handleSubmitted}
              targetId="hs-knob-explorer-form"
              formId={KNOB_EXPLORER_FORM_ID}
            />
          ) : (
            <p className="text-xs text-slate-500">Tick the box above to load the form.</p>
          )}
        </ConsentGate>
        <p className="text-[11px] text-slate-600 mt-5">
          A work email is required. Already shared it with us?{" "}
          <Link to="/" className="text-slate-400 underline hover:text-white">Back to traigent.ai</Link>
        </p>
      </div>
    </div>
  );
}
