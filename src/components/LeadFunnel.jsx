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
import { submitStartNowLead } from "../lib/hubspotForms";
import { priorityModalFocusRegion } from "../lib/modalFocus";

// Fallback only. Every capture 202 states the authoritative cooldown in
// `resend_after_seconds` (lead_routes.py:100-106) and that value wins; this
// covers the case where the field is missing or unusable.
const RESEND_COOLDOWN_FALLBACK_S = 30;
// Addresses CONFIRMED in HubSpot in this tab -- written only after a mirror
// comes back ok, never before.
//
// "Confirmed" and "being mirrored" are deliberately NOT the same set. Conflating
// them is how a failed mirror turns into a lie: the live path fires
// fire-and-forget, so if its claim counted as a record, DormantView would read
// it and tell the visitor "You're in" for a lead that reached nothing.
//
// sessionStorage rather than a component ref, because the guarantee is "one CRM
// record per lead" and the modal UNMOUNTS every time it closes -- a ref resets
// with it, so close-and-reopen, or hero-then-topnav, mirrored the same person
// again. A Set rather than a single slot, because a single slot only dedupes
// CONSECUTIVE addresses: correcting a typo and correcting it back (A -> B -> A)
// wrote A twice.
const MIRRORED_ADDRESSES_KEY = "traigent_hubspot_mirrored";

// Addresses whose mirror is in flight RIGHT NOW. Module scope rather than
// sessionStorage on purpose: an in-flight request cannot outlive the page, and
// must not be remembered as if it could -- a reload carrying a stale "in
// flight" entry would suppress that address's mirror forever.
const inFlightMirrors = new Set();

// The dedupe key is case-folded because the two systems on either side of it
// are. The backend normalises with `.strip().lower()` (`normalize_lead_email`),
// and HubSpot keys contacts on a case-insensitive address. A case-SENSITIVE key
// would treat `A@corp.com` and `a@corp.com` as two people and mirror both --
// the exact duplicate this set exists to prevent, just spelled differently.
function normalizeMirrorAddress(address) {
  return address.trim().toLowerCase();
}

function readMirroredAddresses() {
  try {
    return new Set(
      JSON.parse(sessionStorage.getItem(MIRRORED_ADDRESSES_KEY) || "[]"),
    );
  } catch {
    // Private mode or a corrupt value: the worst case is mirroring once more.
    return new Set();
  }
}

// Record that HubSpot has accepted this address. Call ONLY on a successful
// mirror -- the whole value of this set is that membership means "the CRM has
// them", so anything written speculatively destroys the guarantee.
function rememberMirroredAddress(address) {
  const addresses = readMirroredAddresses();
  if (addresses.has(address)) return;
  addresses.add(address);
  writeMirroredAddresses(addresses);
}

function writeMirroredAddresses(addresses) {
  try {
    sessionStorage.setItem(
      MIRRORED_ADDRESSES_KEY,
      JSON.stringify([...addresses]),
    );
  } catch {
    /* private mode -- dedupe degrades, the funnel does not */
  }
}
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
  if (typeof navigator !== "undefined")
    navigator.clipboard?.writeText?.(FIRST_RUN_INIT_PROMPT);
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

  /**
   * Mirror the captured address into HubSpot.
   *
   * DormantView does this on every submit that is not already confirmed (it is
   * the ONLY thing the dormant front door does), so before activation every
   * homepage lead reached the CRM. Activating the funnel makes the live path
   * the one visitors take,
   * and without this call marketing would silently stop receiving homepage
   * leads the moment `VITE_FUNNEL_STATE` flips - a regression with no error, no
   * log and no obvious symptom. `lead_access_grants` is a Postgres table, not a
   * CRM, and nothing forwards it onward.
   *
   * Fire-and-forget on purpose: HubSpot is a marketing nicety and the funnel is
   * the product path, so a slow or failing CRM must never delay or fail a
   * capture. `submitStartNowLead` already swallows its own network errors; the
   * `.catch` covers anything else so this can never reject unhandled.
   *
   * A FAILURE IS REPORTED, not swallowed into silence. Without the failure
   * event this function would reproduce the exact class it exists to prevent:
   * HubSpot re-enabling its free-provider block, a rotated form GUID or a CSP
   * change would stop every homepage lead reaching the CRM with nothing to
   * notice it by. The visitor still sees nothing - the funnel is unaffected -
   * but the drop is now visible in analytics.
   *
   * Bot filtering deliberately stays server-side (honeypot + elapsed-time, both
   * checked by the backend). Re-implementing the thresholds here would
   * duplicate a server constant that can drift, so HubSpot sees exactly the
   * submissions the dormant path already sent it - no new exposure.
   */
  const mirrorCaptureToHubSpot = (rawAddress) => {
    // Once per address, not once per submit. A capture is retried in ordinary
    // conditions -- a backend 429/500, or a 404 while the funnel flag is still
    // off -- and each retry would otherwise write another CRM record and another
    // founder notification for the same person.
    const address = normalizeMirrorAddress(rawAddress);
    // Two separate reasons to skip, and they are not the same reason. Already in
    // the CRM: nothing to do. Already in flight: a second request would race the
    // first for the same person. Neither is recorded as a confirmed record here
    // -- that only happens below, once HubSpot has actually accepted it.
    if (readMirroredAddresses().has(address)) return;
    if (inFlightMirrors.has(address)) return;
    inFlightMirrors.add(address);
    submitStartNowLead({ email: address, location: surface })
      .then((result) => {
        inFlightMirrors.delete(address);
        if (result?.ok) {
          rememberMirroredAddress(address);
          trackEvent("lead_hubspot_submitted", { location: surface });
          return;
        }
        // Nothing to un-record: the address was never written as confirmed, so a
        // later attempt -- including the dormant form, if a refusal sends the
        // visitor there -- finds it absent and tries again.
        trackEvent("lead_hubspot_failed", {
          location: surface,
          reason: result?.reason || "unknown",
        });
      })
      .catch(() => {
        inFlightMirrors.delete(address);
        trackEvent("lead_hubspot_failed", {
          location: surface,
          reason: "generic",
        });
      });
  };

  // The EMAIL STEP's submit. Deliberately NOT `sendCode` itself: that is also
  // wired to the code step's "resend" button, and a resend is the same lead, not
  // a new one. The dedupe store above makes that true regardless of wiring, and
  // `re-submitting the same address writes exactly one CRM record` pins it.
  const submitEmailStep = () => {
    mirrorCaptureToHubSpot(email);
    return sendCode();
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
    body = <DormantView headingRef={transitionHeadingRef} surface={surface} />;
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
        onSubmit={submitEmailStep}
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

/**
 * Dormant front door. When the 6-digit lead funnel's backend is not wired
 * (`isLeadFunnelEnabled()` false, or a runtime 5xx flipped `runtimeUnavailable`),
 * the button's whole job is unchanged: hand the visitor the one sentence to paste
 * into their coding agent. No email gate — the prompt is the product. It is also
 * already on their clipboard (the CTA copies it on click); this modal shows it
 * with a copy button and the paste instructions so nothing is hidden. This is what
 * "Connect your agent" shows everywhere until TraigentBackend#2551 turns the real
 * funnel on; when that lands, `isDormant` goes false and this path is skipped.
 */
function DormantView({ headingRef, surface }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(""); // "" | "business_email" | "generic"
  const [done, setDone] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (busy || !email.trim() || !consent) return;
    const address = normalizeMirrorAddress(email);
    // Shares the live path's set on purpose: the two views are not sealed off
    // from each other. A NOT_FOUND capture flips `runtimeUnavailable`, so a
    // visitor whose address the LIVE path already mirrored can land back on this
    // form. Checking only within this component would miss that crossing.
    //
    // Skips only on a CONFIRMED record, never on an in-flight one. If the live
    // mirror is still running -- or already failed -- this form is the visitor's
    // last remaining path into the CRM, and short-circuiting it would show
    // "You're in" for a lead that reached nothing and suppress the retry copy
    // below. That makes a duplicate possible when a slow mirror is overtaken,
    // and that is the intended trade: HubSpot upserts contacts by email, so the
    // cost is one extra notification, while the cost of the other error is a
    // silently lost lead.
    if (readMirroredAddresses().has(address)) {
      setDone(true);
      return;
    }
    setBusy(true);
    setError("");
    const result = await submitStartNowLead({
      email: address,
      location: surface,
    });
    setBusy(false);
    if (result.ok) {
      rememberMirroredAddress(address);
      trackEvent("lead_hubspot_submitted", { location: surface });
      setDone(true);
    } else if (result.reason === "business_email") {
      setError("business_email");
    } else {
      setError("generic");
    }
  };

  return (
    <div>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="text-2xl font-bold text-white mb-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400"
      >
        Connect your agent
      </h2>
      <p className="text-slate-400 mb-4">
        Copy this and paste it into your coding agent — to run your first free
        Traigent optimization.
      </p>
      <InstallCommand
        command={FIRST_RUN_INIT_PROMPT}
        secondary="Paste this into your local coding agent — Claude Code, Cursor, Codex, whichever you use — ideally running the strongest model available. It clones the walkthrough and runs your first optimization. No keys or credit card required."
      />

      {/* Optional email unlock — does NOT gate the prompt above. Captured
          straight into HubSpot's Start-Now form (always live). */}
      <div className="mt-6 pt-6 border-t border-slate-800">
        {done ? (
          <p className="flex items-center gap-2 text-sm text-emerald-300">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            You&apos;re in — we&apos;ll be in touch about unlocking advanced
            features.
          </p>
        ) : (
          <ConsentGate>
            <p className="text-slate-400 mb-4">
              Enter your email below to get access to our most advanced
              features.
            </p>
            <div className="mb-3">
              <ConsentCheckbox
                id={`${surface}-dormant-consent`}
                checked={consent}
                onChange={setConsent}
              />
            </div>
            {consent ? (
              <form onSubmit={onSubmit} className="space-y-3">
                <label htmlFor={`${surface}-dormant-email`} className="sr-only">
                  Email address
                </label>
                <input
                  id={`${surface}-dormant-email`}
                  type="email"
                  required
                  placeholder="you@yourcompany.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={busy}
                  className="w-full px-4 py-3 rounded-lg bg-slate-950/60 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#4D8EF8] transition-colors"
                />
                <button
                  type="submit"
                  disabled={busy || !email.trim() || !consent}
                  className="w-full bg-[#1A6BF5] hover:bg-[#4D8EF8] disabled:opacity-60 disabled:cursor-not-allowed text-white px-5 py-3 rounded-lg font-medium transition-colors"
                >
                  {busy ? "Sending…" : "Unlock advanced features"}
                </button>
              </form>
            ) : (
              <p className="text-xs text-slate-500">
                Tick the box above to continue.
              </p>
            )}
          </ConsentGate>
        )}
        {error === "business_email" && (
          <p className="text-amber-400 text-sm mt-3" role="alert">
            Please enter your <u>business</u> email.
          </p>
        )}
        {error === "generic" && (
          <p className="text-amber-400 text-sm mt-3" role="alert">
            Something went wrong. Try again, or email amir@traigent.ai and
            we&apos;ll set you up directly.
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-5 text-sm">
        <a
          href={FIRST_RUN_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackEvent("first_run_repo_clicked", {
              location: `${surface}_lead_dormant`,
            })
          }
          className="inline-flex items-center text-slate-400 hover:text-white transition-colors"
        >
          <Github className="mr-1.5 h-3.5 w-3.5" />
          Browse the walkthrough this clones
        </a>
        <a
          href={SDK_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackEvent("sdk_repo_clicked", {
              location: `${surface}_lead_dormant`,
            })
          }
          className="inline-flex items-center text-slate-400 hover:text-white transition-colors"
        >
          <Github className="mr-1.5 h-3.5 w-3.5" />
          Browse the Traigent SDK before you install
        </a>
      </div>
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
        We just sent a <span className="font-semibold text-white">second</span>{" "}
        email to <span className="font-semibold text-white">{email}</span> —
        this one carries your{" "}
        <span className="font-semibold text-white">access code</span>. Open the
        registration page from that email, enter the code to create your
        Traigent account, then generate your API key from the highlighted key
        button in the portal&apos;s top bar.
      </p>
      <p className="text-xs text-slate-500 mb-6">
        The code works once and {formatCodeValidity(expiresAt)}. It is the only
        way in from here — we don&apos;t sign you in on this page. Check spam if
        it hasn&apos;t arrived within a minute.
      </p>

      <p className="text-sm font-medium text-slate-300 mb-2">
        While you wait — copy this and paste it into your local coding agent
        (ideally on its strongest model):
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
          onClick={() =>
            trackEvent("first_run_repo_clicked", {
              location: `${surface}_lead_success`,
            })
          }
          className="inline-flex items-center text-slate-400 hover:text-white transition-colors"
        >
          <Github className="mr-1.5 h-3.5 w-3.5" />
          Browse the walkthrough this clones
        </a>
        <a
          href={SDK_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackEvent("sdk_repo_clicked", {
              location: `${surface}_lead_success`,
            })
          }
          className="inline-flex items-center text-slate-400 hover:text-white transition-colors"
        >
          <Github className="mr-1.5 h-3.5 w-3.5" />
          SDK on GitHub
        </a>
      </div>
    </div>
  );
}
