/* eslint-disable react/prop-types */
const PRIVACY_URL = 'https://portal.traigent.ai/privacy';

/**
 * Required GDPR consent checkbox for any email-capture form. Controlled —
 * the parent owns the `checked` state and decides what to gate on it
 * (e.g. only mounting the HubSpot embed after this is checked, or
 * disabling a hand-rolled submit button until it is).
 *
 * Props:
 *   checked   boolean
 *   onChange  (boolean) => void
 *   id        DOM id  — defaults to "traigent-consent-checkbox"
 */
export default function ConsentCheckbox({
  checked,
  onChange,
  id = 'traigent-consent-checkbox',
}) {
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
        I agree to receive communications from Traigent about the product I'm
        signing up for, and I accept the{' '}
        <a
          href={PRIVACY_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-blue-300 underline underline-offset-2 hover:text-blue-200"
        >
          Privacy Policy
        </a>
        .
      </span>
    </label>
  );
}
