/* eslint-disable react/prop-types */
import { useState } from "react";
import { FileCheck2 } from "lucide-react";
import AgreementCheckbox from "./AgreementCheckbox";
import AgreementText from "./AgreementText";
import { markAccepted, AGREEMENT_VERSION } from "../lib/accessAgreement";
import { notifyAgreementAccepted } from "../lib/hubspotForms";
import { trackEvent } from "../lib/analytics";

/**
 * Agreement-only interstitial for visitors who are already email-unlocked
 * (returning or auto-recognized contacts) but haven't accepted the current
 * Access & Evaluation Agreement version. One checkbox + one button — they
 * never re-enter their email.
 */
export default function AgreementGate({ email = "", surface = "unknown", onAccepted }) {
  const [checked, setChecked] = useState(false);

  const accept = () => {
    markAccepted(email);
    if (email) {
      notifyAgreementAccepted({ email, location: surface, version: AGREEMENT_VERSION });
    }
    trackEvent("agreement_accepted", { surface, version: AGREEMENT_VERSION });
    onAccepted();
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <FileCheck2 className="w-5 h-5" style={{ color: "#4D8EF8" }} />
        <h3 className="text-xl font-bold text-white">One more step</h3>
      </div>
      <p className="text-slate-400 text-sm leading-relaxed mb-3">
        Before accessing Traigent&apos;s materials, please review and accept the
        Access &amp; Evaluation Agreement — it covers confidentiality and the
        agreement not to use our materials to build competing products.
      </p>
      {/* The full agreement, scrollable in-place so acceptance is informed
          without leaving the gate. */}
      <div className="max-h-60 overflow-y-auto rounded-lg border border-slate-700/60 bg-slate-950/60 p-4 mb-4">
        <AgreementText compact />
      </div>
      <div className="mb-4">
        <AgreementCheckbox
          id={`agreement-gate-${surface}`}
          checked={checked}
          onChange={setChecked}
        />
      </div>
      <button
        type="button"
        disabled={!checked}
        onClick={accept}
        className="w-full bg-[#1A6BF5] hover:bg-[#4D8EF8] disabled:opacity-60 disabled:cursor-not-allowed text-white px-5 py-3 rounded-lg font-medium transition-colors"
      >
        Agree &amp; continue
      </button>
    </div>
  );
}
