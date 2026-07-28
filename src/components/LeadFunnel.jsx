/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { Mail, ShieldCheck, Github, ArrowRight, Terminal, Check } from "lucide-react";
import ConsentGate from "./ConsentGate";
import ConsentCheckbox from "./ConsentCheckbox";
import InstallCommand from "./InstallCommand";
import { captureLead, verifyLead, leadErrorMessage, isLeadFunnelEnabled } from "../lib/leadApi";
import { useAgentSetupPrompt } from "../lib/useAgentSetupPrompt";
import { trackEvent } from "../lib/analytics";

const RESEND_COOLDOWN_S = 30;
const SDK_REPO_URL = "https://github.com/Traigent/Traigent";
const DEMO_BOOKING_URL = "https://meetings-eu1.hubspot.com/amir8";

/**
 * Lead-funnel front door (Marketing front door unit A2). Three steps:
 *   1. email + consent tick     -> capture  (POST /api/v1/leads)
 *   2. 6-digit code entry        -> verify   (POST /api/v1/leads/verify)
 *   3. success                   -> the backend emailed a portal redeem link;
 *                                   we hand over the SDK repo + agent-setup
 *                                   prompt and point the user at their inbox.
 *
 * This deliberately does NOT edit the shared OtpGate (used by StartNowModal +
 * a Get-SDK caller). It mirrors OtpGate's shell but adds a hidden `website`
 * honeypot and a mount-time `elapsed_seconds` delta — the backend's 202 is
 * byte-identical on every outcome, so bot / too-fast submissions are silently
 * dropped server-side and the client never branches on them. The whole email
 * step stays behind ConsentGate / ConsentCheckbox (GDPR).
 */
export default function LeadFunnel({ surface = "homepage_hero", onVerified }) {
  const [step, setStep] = useState("email"); // email | code | success
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot — must stay empty
  const [code, setCode] = useState("");
  const [runId, setRunId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const codeInputRef = useRef(null);
  // When the funnel mounted — capture reports the seconds elapsed since, so the
  // backend can silently drop implausibly fast (bot) submissions.
  const mountedAt = useRef(Date.now());

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
    const result = await captureLead({
      email: email.trim(),
      website,
      elapsedSeconds: Math.round((Date.now() - mountedAt.current) / 1000),
    });
    setBusy(false);
    if (result.ok) {
      // A byte-identical 202 on every outcome means "accepted" just advances to
      // the code step; a dropped (bot/too-fast) submission simply never gets a
      // code email, so it can't complete verification.
      setRunId(result.runId);
      setStep("code");
      setCode("");
      setCooldown(RESEND_COOLDOWN_S);
      trackEvent("lead_capture_submitted", { location: surface });
    } else {
      setError(leadErrorMessage(result.error));
    }
  };

  const submitCode = async () => {
    setBusy(true);
    setError("");
    trackEvent("lead_verify_submitted", { location: surface });
    const result = await verifyLead({ email: email.trim(), runId, code: code.trim() });
    setBusy(false);
    if (result.ok) {
      trackEvent("lead_verify_succeeded", { location: surface });
      setStep("success");
      if (onVerified) onVerified(email.trim().toLowerCase());
    } else {
      setError(leadErrorMessage(result.error, result.remaining));
      if (result.error === "expired" || result.error === "too_many_attempts") {
        setStep("email");
        setCode("");
      }
    }
  };

  if (step === "success") {
    return <SuccessView email={email.trim()} surface={surface} />;
  }

  if (step === "code") {
    return (
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Check your email for the code</h2>
        <p className="text-slate-300 mb-1 flex items-center gap-2">
          <Mail className="w-4 h-4 text-blue-400 shrink-0" />
          We emailed a 6-digit code to <span className="font-semibold text-white">{email}</span>
        </p>
        <p className="text-xs text-slate-500 mb-4">
          The code is in the subject line. Check spam if it hasn&apos;t arrived within a minute.
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
            {busy ? "Verifying…" : "Verify email"}
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

  // step === "email"
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Start free — get the SDK</h2>
      <p className="text-slate-400 mb-6">
        Verify your work email with a 6-digit code. We&apos;ll then email you a link
        to finish setting up in the portal — no card, no spend.
      </p>
      <ConsentGate>
        <div className="mb-4">
          <ConsentCheckbox id={`${surface}-consent`} checked={consent} onChange={setConsent} />
        </div>
        {!isLeadFunnelEnabled() ? (
          <div className="rounded-xl border border-slate-700/60 bg-slate-950/40 p-6 text-center">
            <p className="mb-4 text-sm leading-relaxed text-slate-300">
              Self-serve signup is not switched on for this site yet. In the
              meantime, book a quick demo and we&apos;ll get you set up.
            </p>
            <a
              href={DEMO_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("demo_booking_clicked", { location: `${surface}_lead_dormant` })}
              className="inline-flex items-center rounded-lg bg-[#1A6BF5] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#4D8EF8]"
            >
              Book a demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        ) : consent ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!busy && email.trim()) sendCode();
            }}
          >
            {/* Honeypot — visually hidden and out of the tab order so a real
                user never sees or fills it. Bots that autofill it are silently
                dropped by the backend (the 202 stays byte-identical). */}
            <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}>
              <label htmlFor={`${surface}-website`}>Leave this field empty</label>
              <input
                id={`${surface}-website`}
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
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
    </div>
  );
}

/**
 * Verified. The backend has emailed a redeem link (the portal handoff), so the
 * marketing site's job is done — we point the user at their inbox and hand over
 * the two engineer-facing next steps: the SDK repo and the one-paste
 * agent-setup prompt (the same canonical /agent-setup/prompt.md the homepage
 * hero copies).
 */
function SuccessView({ email, surface }) {
  const { copied, copyPrompt } = useAgentSetupPrompt();
  const handleConnectAgent = async () => {
    const ok = await copyPrompt();
    trackEvent("connect_agent_clicked", { location: `${surface}_lead_success`, copied: ok });
  };
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
        <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
        Email verified
      </h2>
      <p className="text-slate-300 mb-2">
        We just emailed a sign-in link to <span className="font-semibold text-white">{email}</span>.
        Open it to finish creating your account in the portal.
      </p>
      <p className="text-xs text-slate-500 mb-6">
        Check spam if it hasn&apos;t arrived within a minute — the link is the only
        way in from here (we don&apos;t sign you in on this page).
      </p>

      <p className="text-sm font-medium text-slate-300 mb-2">
        While you wait — wire Traigent into your coding agent:
      </p>
      <InstallCommand
        command='uv tool install "traigent[recommended]" && traigent quickstart'
        secondary="No API keys. No LLM provider calls. No spend. Just python. (Have pip instead? `pip install` works too.)"
      />

      <div className="flex flex-wrap gap-3 mt-6">
        <button
          type="button"
          onClick={handleConnectAgent}
          className="inline-flex items-center bg-[#1A6BF5] hover:bg-[#4D8EF8] text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
        >
          {copied ? <Check className="mr-2 h-4 w-4 text-emerald-300" /> : <Terminal className="mr-2 h-4 w-4" />}
          {copied ? "Copied — paste into your coding agent" : "Connect your coding agent"}
        </button>
        <a
          href={SDK_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("sdk_repo_clicked", { location: `${surface}_lead_success` })}
          className="inline-flex items-center border border-slate-600 hover:border-slate-400 text-slate-200 hover:text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
        >
          <Github className="mr-2 h-4 w-4" />
          View SDK on GitHub
          <ArrowRight className="ml-2 h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
