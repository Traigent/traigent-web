/* eslint-disable react/prop-types */
import { Mail, ShieldCheck } from "lucide-react";

/**
 * Shared 6-digit code-entry step for the site's email→code gates (OtpGate and
 * the lead-funnel front door). Presentation only: the parent owns the code
 * state, the verify/resend actions, the cooldown timer and the input ref — this
 * renders the identical markup both gates used to inline, so they stay in sync
 * and SonarCloud sees one copy instead of two.
 *
 * Optional `heading` renders an <h2> above the block (the lead funnel shows one;
 * OtpGate's heading is supplied by its modal shell, so it passes none). `hint`
 * is the small print under the "we emailed a code" line, and the submit-button
 * copy is caller-supplied so each gate keeps its own wording.
 */
export default function CodeEntryForm({
  email,
  code,
  onCodeChange,
  onVerify,
  busy,
  error,
  cooldown,
  onResend,
  onUseDifferentEmail,
  codeInputRef,
  heading,
  hint,
  submitLabel = "Verify & unlock",
  submitBusyLabel = "Verifying…",
}) {
  return (
    <div>
      {heading && <h2 className="text-2xl font-bold text-white mb-2">{heading}</h2>}
      <p className="text-slate-300 mb-1 flex items-center gap-2">
        <Mail className="w-4 h-4 text-blue-400 shrink-0" />
        We emailed a 6-digit code to <span className="font-semibold text-white">{email}</span>
      </p>
      <p className="text-xs text-slate-500 mb-4">{hint}</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!busy && code.trim().length === 6) onVerify();
        }}
      >
        <input
          ref={codeInputRef}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{6}"
          maxLength={6}
          value={code}
          onChange={(e) => onCodeChange(e.target.value.replace(/\D/g, ""))}
          placeholder="123456"
          aria-label="6-digit verification code"
          className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 outline-none rounded-lg px-4 py-3 text-white text-2xl tracking-[0.5em] text-center font-mono mb-3"
        />
        {error && <p className="text-sm text-red-400 mb-3">{error}</p>}
        <button
          type="submit"
          disabled={busy || code.trim().length !== 6}
          className="w-full inline-flex items-center justify-center bg-[#1A6BF5] hover:bg-[#4D8EF8] disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
        >
          <ShieldCheck className="mr-2 h-4 w-4" />
          {busy ? submitBusyLabel : submitLabel}
        </button>
      </form>
      <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
        <button
          type="button"
          onClick={() => {
            if (cooldown <= 0 && !busy) onResend();
          }}
          disabled={cooldown > 0 || busy}
          className="underline underline-offset-2 hover:text-slate-300 disabled:no-underline disabled:cursor-default"
        >
          {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
        </button>
        <button
          type="button"
          onClick={onUseDifferentEmail}
          className="underline underline-offset-2 hover:text-slate-300"
        >
          Use a different email
        </button>
      </div>
    </div>
  );
}
