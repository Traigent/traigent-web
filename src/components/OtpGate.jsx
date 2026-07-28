/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import ConsentGate from "./ConsentGate";
import ConsentCheckbox from "./ConsentCheckbox";
import CodeEntryForm from "./CodeEntryForm";
import EmailEntryForm from "./EmailEntryForm";
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
      <CodeEntryForm
        email={email}
        code={code}
        onCodeChange={setCode}
        onVerify={submitCode}
        busy={busy}
        error={error}
        cooldown={cooldown}
        onResend={sendCode}
        onUseDifferentEmail={() => {
          setStep("email");
          setError("");
          setCode("");
        }}
        codeInputRef={codeInputRef}
        hint="It expires in 10 minutes. Check spam if it hasn't arrived within a minute."
        submitLabel="Verify & unlock"
        submitBusyLabel="Verifying…"
      />
    );
  }

  return (
    <ConsentGate>
      <div className="mb-4">
        <ConsentCheckbox id={`${surface}-consent`} checked={consent} onChange={setConsent} />
      </div>
      {consent ? (
        <EmailEntryForm
          surface={surface}
          email={email}
          onEmailChange={setEmail}
          onSubmit={sendCode}
          busy={busy}
          error={error}
        />
      ) : (
        <p className="text-xs text-slate-500">Tick the box above to continue.</p>
      )}
    </ConsentGate>
  );
}
