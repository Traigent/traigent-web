/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { Mail, ShieldCheck } from "lucide-react";
import ConsentGate from "./ConsentGate";
import ConsentCheckbox from "./ConsentCheckbox";
import { requestCode, verifyCode, otpErrorMessage } from "../lib/otpAccess";
import { getUnlockedEmail } from "../lib/startNowGate";
import { trackEvent } from "../lib/analytics";

const RESEND_COOLDOWN_S = 30;

/**
 * Email + one-time-code gate for Start Now. Two steps:
 *   1. email + consent tick → "Email me a code"
 *   2. 6-digit code entry → verify → onVerified(email)
 *
 * Verification writes the server-side receipt in the Worker (verified email,
 * IP, time, device) — by the time onVerified fires, the access record already
 * exists. The email field prefills from the legacy unlock stamp when present:
 * returning visitors are asked to verify, not to start from scratch.
 */
export default function OtpGate({ surface = "start_now", onVerified }) {
  const [step, setStep] = useState("email"); // email | code
  const [email, setEmail] = useState(() => getUnlockedEmail());
  const [consent, setConsent] = useState(false);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const codeInputRef = useRef(null);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const t = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  useEffect(() => {
    if (step === "code" && codeInputRef.current) codeInputRef.current.focus();
  }, [step]);

  const sendCode = async () => {
    setBusy(true);
    setError("");
    const result = await requestCode(email.trim());
    setBusy(false);
    if (result.ok) {
      setStep("code");
      setCode("");
      setCooldown(RESEND_COOLDOWN_S);
      trackEvent("start_now_otp_requested", { location: surface });
    } else {
      setError(otpErrorMessage(result.error));
    }
  };

  const submitCode = async () => {
    setBusy(true);
    setError("");
    const result = await verifyCode({ email: email.trim(), code: code.trim(), surface });
    setBusy(false);
    if (result.ok) {
      trackEvent("start_now_otp_verified", { location: surface });
      onVerified(email.trim().toLowerCase());
    } else {
      setError(otpErrorMessage(result.error, result.remaining));
      if (result.error === "expired" || result.error === "too_many_attempts") {
        setStep("email");
        setCode("");
      }
    }
  };

  if (step === "code") {
    return (
      <div>
        <p className="text-slate-300 mb-1 flex items-center gap-2">
          <Mail className="w-4 h-4 text-blue-400 shrink-0" />
          We emailed a 6-digit code to <span className="font-semibold text-white">{email}</span>
        </p>
        <p className="text-xs text-slate-500 mb-4">
          It expires in 10 minutes. Check spam if it hasn&apos;t arrived within a minute.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!busy && code.trim().length === 6) submitCode();
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
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
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
            {busy ? "Verifying…" : "Verify & unlock"}
          </button>
        </form>
        <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
          <button
            type="button"
            onClick={() => {
              if (cooldown <= 0 && !busy) sendCode();
            }}
            disabled={cooldown > 0 || busy}
            className="underline underline-offset-2 hover:text-slate-300 disabled:no-underline disabled:cursor-default"
          >
            {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep("email");
              setError("");
              setCode("");
            }}
            className="underline underline-offset-2 hover:text-slate-300"
          >
            Use a different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <ConsentGate>
      <div className="mb-4">
        <ConsentCheckbox id={`${surface}-consent`} checked={consent} onChange={setConsent} />
      </div>
      {consent ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!busy && email.trim()) sendCode();
          }}
        >
          <label htmlFor={`${surface}-email`} className="block text-xs text-slate-400 mb-1.5">
            Work email — we&apos;ll send a 6-digit code to verify it&apos;s yours
          </label>
          <input
            id={`${surface}-email`}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            aria-label="Work email"
            className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 outline-none rounded-lg px-4 py-3 text-white mb-3"
          />
          {error && <p className="text-sm text-red-400 mb-3">{error}</p>}
          <button
            type="submit"
            disabled={busy || !email.trim()}
            className="w-full inline-flex items-center justify-center bg-[#1A6BF5] hover:bg-[#4D8EF8] disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
          >
            <Mail className="mr-2 h-4 w-4" />
            {busy ? "Sending…" : "Email me a code"}
          </button>
        </form>
      ) : (
        <p className="text-xs text-slate-500">Tick the box above to continue.</p>
      )}
    </ConsentGate>
  );
}
