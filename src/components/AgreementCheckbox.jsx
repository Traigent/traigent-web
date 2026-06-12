/* eslint-disable react/prop-types */
import { AGREEMENT_PATH, AGREEMENT_VERSION } from "../lib/accessAgreement";

/**
 * Required acceptance checkbox for the Access & Evaluation Agreement —
 * the IP/no-compete layer shown alongside the GDPR consent checkbox on
 * every gated surface (Start Now / SDK, Portal, Academy). Controlled:
 * the parent gates form-mount / submit on `checked`.
 */
export default function AgreementCheckbox({ checked, onChange, id = "traigent-agreement-checkbox" }) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-slate-700/60 bg-slate-950/40 p-3 text-sm leading-relaxed text-slate-300 transition-colors hover:border-slate-600"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        required
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-600 bg-slate-900 text-[#1A6BF5] focus:ring-1 focus:ring-[#4D8EF8]"
      />
      <span>
        I have read and agree to the{" "}
        <a
          href={`/#${AGREEMENT_PATH}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-blue-300 underline underline-offset-2 hover:text-blue-200"
        >
          Traigent Access &amp; Evaluation Agreement (v{AGREEMENT_VERSION})
        </a>
        , including its confidentiality and no-competing-use terms.
      </span>
    </label>
  );
}
