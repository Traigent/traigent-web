/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { ShieldCheck, Github, ArrowRight } from "lucide-react";
import ConsentGate from "./ConsentGate";
import ConsentCheckbox from "./ConsentCheckbox";
import InstallCommand from "./InstallCommand";
import CodeEntryForm from "./CodeEntryForm";
import EmailEntryForm from "./EmailEntryForm";
import { captureLead, verifyLead, leadErrorMessage, isLeadFunnelEnabled } from "../lib/leadApi";
import { trackEvent } from "../lib/analytics";

const RESEND_COOLDOWN_S = 30;
const SDK_REPO_URL = "https://github.com/Traigent/Traigent";
const FIRST_RUN_REPO_URL = "https://github.com/Traigent/traigent-first-run";
// The continuation line, verbatim from the onboarding plan. This - not the SDK
// repo link - is what the visitor pastes next; the repo link is reference
// material and is deliberately placed after it so it cannot be mistaken for
// the next step.
const FIRST_RUN_INIT_PROMPT = `Help me run my first Traigent optimization.
Clone ${FIRST_RUN_REPO_URL} and follow GUIDE.md.`;
const DEMO_BOOKING_URL = "https://meetings-eu1.hubspot.com/amir8";

/**
 * Lead-funnel front door (Marketing front door unit A2). Three steps:
 *   1. email + consent tick     -> capture  (POST /api/v1/leads)
 *   2. 6-digit code entry        -> verify   (POST /api/v1/leads/verify)
 *   3. success                   -> the backend emailed a SECOND mail carrying a
 *                                   single-use access link (10 days) that
 *                                   authorizes creating the account; we hand
 *                                   over the SDK repo + agent-setup prompt and
 *                                   point the user at their inbox.
 *
 * The access link is not a sign-in: no account exists until the user redeems it
 * and registers. Copy on this screen must not imply otherwise - a user told
 * they have been "signed in" will go looking for a portal session that is not
 * there. The API key is created afterwards, by the user, from the portal's
 * top-bar key control (TraigentFrontend#2046).
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
        heading="Check your email for the code"
        hint="The code is in the subject line. Check spam if it hasn't arrived within a minute."
        submitLabel="Verify email"
        submitBusyLabel="Verifying…"
      />
    );
  }

  // step === "email" — pick the body without a nested ternary
  let emailStepBody;
  if (!isLeadFunnelEnabled()) {
    emailStepBody = (
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
    );
  } else if (consent) {
    emailStepBody = (
      <EmailEntryForm
        surface={surface}
        email={email}
        onEmailChange={setEmail}
        onSubmit={sendCode}
        busy={busy}
        error={error}
        extraFields={
          /* Honeypot — visually hidden and out of the tab order so a real user
             never sees or fills it. Bots that autofill it are silently dropped
             by the backend (the 202 stays byte-identical). */
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
        }
      />
    );
  } else {
    emailStepBody = <p className="text-xs text-slate-500">Tick the box above to continue.</p>;
  }

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
        {emailStepBody}
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
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
        <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
        Email verified
      </h2>
      <p className="text-slate-300 mb-2">
        We just sent a <span className="font-semibold text-white">second</span> email to{" "}
        <span className="font-semibold text-white">{email}</span> — this one carries your access
        link. Open it to create your Traigent account, then generate your API key from the
        highlighted key button in the portal&apos;s top bar.
      </p>
      <p className="text-xs text-slate-500 mb-6">
        The link is good for 10 days and works once. It is the only way in from here — we
        don&apos;t sign you in on this page. Check spam if it hasn&apos;t arrived within a minute.
      </p>

      <p className="text-sm font-medium text-slate-300 mb-2">
        While you wait — hand this to your coding agent:
      </p>
      <InstallCommand
        command={FIRST_RUN_INIT_PROMPT}
        secondary="Paste it into Claude Code, Cursor, Codex — whichever you use. It clones the walkthrough and runs your first optimization. No keys needed until the run connects."
      />

      {/* Reference only, below the prompt and visually quieter - the plan is
          explicit that a repo link must not read as the line to follow. The
          keyless agent-setup prompt that used to sit here as a second button is
          gone: it wired the SDK into an existing project and told the agent to
          go make its own key, which is a different journey from this one and
          competed with the prompt above. The walkthrough it now points at does
          the key step itself, in order. */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-5 text-sm">
        <a
          href={FIRST_RUN_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("first_run_repo_clicked", { location: `${surface}_lead_success` })}
          className="inline-flex items-center text-slate-400 hover:text-white transition-colors"
        >
          <Github className="mr-1.5 h-3.5 w-3.5" />
          Browse the walkthrough this clones
        </a>
        <a
          href={SDK_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("sdk_repo_clicked", { location: `${surface}_lead_success` })}
          className="inline-flex items-center text-slate-400 hover:text-white transition-colors"
        >
          <Github className="mr-1.5 h-3.5 w-3.5" />
          SDK on GitHub
        </a>
      </div>
    </div>
  );
}
