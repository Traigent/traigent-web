/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { ShieldCheck, Github } from "lucide-react";
import ConsentGate from "./ConsentGate";
import ConsentCheckbox from "./ConsentCheckbox";
import InstallCommand from "./InstallCommand";
import CodeEntryForm from "./CodeEntryForm";
import EmailEntryForm from "./EmailEntryForm";
import {
  captureLead,
  verifyLead,
  leadErrorMessage,
  isLeadFunnelEnabled,
  isLeadFunnelUnavailableError,
} from "../lib/leadApi";
import { trackEvent } from "../lib/analytics";
import { priorityModalFocusRegion } from "../lib/modalFocus";

// Fallback only. Every capture 202 states the authoritative cooldown in
// `resend_after_seconds` (lead_routes.py:100-106) and that value wins; this
// covers the case where the field is missing or unusable.
const RESEND_COOLDOWN_FALLBACK_S = 30;
const SDK_REPO_URL = "https://github.com/Traigent/Traigent";
const FIRST_RUN_REPO_URL = "https://github.com/Traigent/traigent-first-run";
// The continuation line, verbatim from the onboarding plan. This - not the SDK
// repo link - is what the visitor pastes next; the repo link is reference
// material and is deliberately placed after it so it cannot be mistaken for
// the next step.
export const FIRST_RUN_INIT_PROMPT = `Help me run my first Traigent optimization.
Clone ${FIRST_RUN_REPO_URL} and follow GUIDE.md.`;

/**
 * Copy the canonical first-run prompt to the clipboard (best-effort, within a
 * user gesture). Every "Connect your agent" / "Start Now" CTA calls this so the
 * behaviour is identical everywhere: copy the prompt, then open the LeadFunnel.
 */
export function copyFirstRunPrompt() {
  if (typeof navigator !== "undefined") navigator.clipboard?.writeText?.(FIRST_RUN_INIT_PROMPT);
}

/**
 * Lead-funnel front door (Marketing front door unit A2). Three steps:
 *   1. email + consent tick     -> capture  (POST /api/v1/leads)
 *   2. 6-digit code entry        -> verify   (POST /api/v1/leads/verify)
 *   3. success                   -> the backend emailed a SECOND mail carrying a
 *                                   single-use access CODE (10 days) that
 *                                   authorizes creating the account; we hand
 *                                   over the SDK repo + agent-setup prompt and
 *                                   point the user at their inbox.
 *
 * The credential is the CODE, not the URL. That mail's registration link is
 * deliberately credential-free (`/register?lead=1`) and the code travels in the
 * message body for the user to type: putting it in the URL is exactly the
 * query-string leak #2463 exists to remove, so copy here must never describe a
 * link that "works once" or invite the user to click their way in.
 *
 * The access code is not a sign-in: no account exists until the user enters it
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
// No `onVerified` callback: the only render site (LeadFunnelModal) never passed
// one, so the guarded call below was unreachable and the prop advertised a hook
// that never fired. This component owns its own success step; a caller that
// genuinely needs the verified address should have the prop added back
// deliberately, together with the call site that supplies it.
export default function LeadFunnel({ surface = "homepage_hero" }) {
  const [step, setStep] = useState("email"); // email | code | success
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot — must stay empty
  const [code, setCode] = useState("");
  const [runId, setRunId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [runtimeUnavailable, setRuntimeUnavailable] = useState(false);
  // ISO-8601 instant the emailed access code stops working, straight from the
  // verify 200 (lead_routes.py:477). A timestamp, never a credential.
  const [accessCodeExpiresAt, setAccessCodeExpiresAt] = useState("");
  const codeInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const transitionHeadingRef = useRef(null);
  // When the funnel mounted — capture reports the seconds elapsed since, so the
  // backend can silently drop implausibly fast (bot) submissions.
  const mountedAt = useRef(Date.now());

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const t = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  useEffect(() => {
    if (priorityModalFocusRegion(document)) return;
    if (step === "code" && codeInputRef.current) codeInputRef.current.focus();
    if (step === "email" && emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [step]);

  const isFunnelConfigured = isLeadFunnelEnabled();
  const isDormant = !isFunnelConfigured || runtimeUnavailable;

  useEffect(() => {
    if (priorityModalFocusRegion(document)) return;
    if ((isDormant || step === "success") && transitionHeadingRef.current) {
      transitionHeadingRef.current.focus({ preventScroll: true });
    }
  }, [isDormant, step]);

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
      // The server states the cooldown it wants on every capture 202; honour it
      // instead of a client guess that can silently drift from the real limit.
      setCooldown(result.resendAfterSeconds || RESEND_COOLDOWN_FALLBACK_S);
      trackEvent("lead_capture_submitted", { location: surface });
    } else if (isLeadFunnelUnavailableError(result.errorCode)) {
      setError("");
      setRuntimeUnavailable(true);
    } else {
      setError(leadErrorMessage(result.errorCode));
    }
  };

  const submitCode = async () => {
    setBusy(true);
    setError("");
    trackEvent("lead_verify_submitted", { location: surface });
    const result = await verifyLead({
      email: email.trim(),
      runId,
      code: code.trim(),
    });
    setBusy(false);
    if (result.ok) {
      trackEvent("lead_verify_succeeded", { location: surface });
      setAccessCodeExpiresAt(result.expiresAt);
      setStep("success");
    } else if (isLeadFunnelUnavailableError(result.errorCode)) {
      setError("");
      setRuntimeUnavailable(true);
    } else {
      // No step reset here. The backend collapses wrong / expired / exhausted
      // into ONE indistinguishable 400 (LEAD_CODE_INVALID, lead_routes.py:418-427)
      // precisely so the response cannot be an oracle, so the client cannot know
      // which one happened and must not pretend to. The recovery the copy names
      // is available in place: this step already offers "Resend code" and "Use a
      // different email".
      setError(leadErrorMessage(result.errorCode));
    }
  };

  let body;
  if (isDormant) {
    body = <DormantView headingRef={transitionHeadingRef} />;
  } else if (step === "success") {
    body = (
      <SuccessView
        email={email.trim()}
        surface={surface}
        expiresAt={accessCodeExpiresAt}
        headingRef={transitionHeadingRef}
      />
    );
  } else if (step === "code") {
    body = (
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
  } else {
    const emailStepBody = consent ? (
      <EmailEntryForm
        surface={surface}
        email={email}
        onEmailChange={setEmail}
        onSubmit={sendCode}
        busy={busy}
        error={error}
        emailInputRef={emailInputRef}
        extraFields={
          /* Honeypot — visually hidden and out of the tab order so a real user
             never sees or fills it. Bots that autofill it are silently dropped
             by the backend (the 202 stays byte-identical). */
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "-9999px",
              width: "1px",
              height: "1px",
              overflow: "hidden",
            }}
          >
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
    ) : (
      <p className="text-xs text-slate-500">Tick the box above to continue.</p>
    );

    body = (
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Start free — get the SDK
        </h2>
        <p className="text-slate-400 mb-6">
          Verify your work email with a 6-digit code. We&apos;ll then email you
          an access code to finish setting up in the portal — no card, no spend.
        </p>
        <ConsentGate>
          <div className="mb-4">
            <ConsentCheckbox
              id={`${surface}-consent`}
              checked={consent}
              onChange={setConsent}
            />
          </div>
          {emailStepBody}
        </ConsentGate>
      </div>
    );
  }

  return body;
}

function DormantView({ headingRef }) {
  return (
    <div>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="text-2xl font-bold text-white mb-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400"
      >
        Self-serve setup is unavailable
      </h2>
      <p className="leading-relaxed text-slate-300">
        Please close this window and try again later.
      </p>
    </div>
  );
}

/**
 * Render the access code's validity window from the authoritative `expires_at`
 * the verify 200 returns (lead_routes.py:469-483) rather than from a literal.
 * The backend window is env-configurable (`LEAD_ACCESS_WINDOW_DAYS`), so a
 * hardcoded "10 days" here would silently become a lie the day it is retuned.
 * Falls back to a claim that stays true for any window if the field is absent or
 * unparseable — never to a made-up number.
 */
function formatCodeValidity(expiresAt) {
  const expiry = expiresAt ? new Date(expiresAt) : null;
  if (!expiry || Number.isNaN(expiry.getTime())) {
    return "is good for a limited time — that email states the exact expiry";
  }
  return `is good until ${expiry.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  })}`;
}

/**
 * Verified. The backend has emailed the access code (the portal handoff), so the
 * marketing site's job is done — we point the user at their inbox and hand over
 * the two engineer-facing next steps: the SDK repo and the one-paste
 * agent-setup prompt (the same canonical /agent-setup/prompt.md the homepage
 * hero copies).
 */
function SuccessView({ email, surface, expiresAt, headingRef }) {
  return (
    <div>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="text-2xl font-bold text-white mb-2 flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400"
      >
        <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
        Email verified
      </h2>
      <p className="text-slate-300 mb-2">
        We just sent a <span className="font-semibold text-white">second</span> email to{" "}
        <span className="font-semibold text-white">{email}</span> — this one carries your{" "}
        <span className="font-semibold text-white">access code</span>. Open the registration page
        from that email, enter the code to create your Traigent account, then generate your API key
        from the highlighted key button in the portal&apos;s top bar.
      </p>
      <p className="text-xs text-slate-500 mb-6">
        The code works once and {formatCodeValidity(expiresAt)}. It is the only way in from here — we
        don&apos;t sign you in on this page. Check spam if it hasn&apos;t arrived within a minute.
      </p>

      <p className="text-sm font-medium text-slate-300 mb-2">
        While you wait — copy this and paste it into your local coding agent (ideally on its strongest model):
      </p>
      <InstallCommand
        command={FIRST_RUN_INIT_PROMPT}
        secondary="Paste it into your local coding agent — Claude Code, Cursor, Codex, whichever you use — ideally running the strongest model available (e.g. Claude Opus). It clones the walkthrough and runs your first optimization. No keys needed until the run connects."
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
