/* eslint-disable react/prop-types */
import { useId } from "react";
import { Mail } from "lucide-react";

/**
 * Shared work-email capture form for the site's email→code gates (OtpGate and
 * the lead-funnel front door). Presentation only: the parent owns the email
 * state and the submit action. `extraFields` lets a caller inject hidden fields
 * ahead of the visible input (the lead funnel passes its anti-bot honeypot);
 * `emailInputRef` lets a multi-step parent restore focus when backtracking; the
 * submit-button copy defaults to the wording both gates already shared.
 */
export default function EmailEntryForm({
  surface,
  email,
  onEmailChange,
  onSubmit,
  busy,
  error,
  emailInputRef,
  extraFields = null,
  submitLabel = "Email me a code",
  submitBusyLabel = "Sending…",
}) {
  const errorId = useId();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!busy && email.trim()) onSubmit();
      }}
    >
      {extraFields}
      <label
        htmlFor={`${surface}-email`}
        className="block text-xs text-slate-400 mb-1.5"
      >
        Work email — we&apos;ll send a 6-digit code to verify it&apos;s yours
      </label>
      <input
        ref={emailInputRef}
        id={`${surface}-email`}
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        placeholder="you@company.com"
        aria-label="Work email"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 outline-none rounded-lg px-4 py-3 text-white mb-3"
      />
      {error && (
        <p
          id={errorId}
          role="alert"
          aria-atomic="true"
          className="text-sm text-red-400 mb-3"
        >
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={busy || !email.trim()}
        className="w-full inline-flex items-center justify-center bg-[#1A6BF5] hover:bg-[#4D8EF8] disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
      >
        <Mail className="mr-2 h-4 w-4" />
        {busy ? submitBusyLabel : submitLabel}
      </button>
    </form>
  );
}
