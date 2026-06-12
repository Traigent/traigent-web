/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { X, ArrowRight, Github } from "lucide-react";
import InstallCommand from "./InstallCommand";
import HubSpotStartNowForm from "./HubSpotStartNowForm";
import ConsentGate from "./ConsentGate";
import ConsentCheckbox from "./ConsentCheckbox";
import {
  isUnlocked,
  markUnlocked,
  getUnlockedEmail,
  shouldNotifyForGate,
} from "../lib/startNowGate";
import { notifyStartNowRepeat, notifyAgreementAccepted, notifyOtpVerified } from "../lib/hubspotForms";
import { checkKnownContact } from "../lib/hubspotIdentify";
import { trackEvent } from "../lib/analytics";
import { hasAcceptedCurrent, markAccepted, AGREEMENT_VERSION } from "../lib/accessAgreement";
import AgreementCheckbox from "./AgreementCheckbox";
import AgreementGate from "./AgreementGate";
import OtpGate from "./OtpGate";
import { isOtpEnabled, isVerified } from "../lib/otpAccess";

/**
 * Two-state modal:
 *   1. Locked  → HubSpot form captures email
 *   2. Unlocked → install command + "View on GitHub"
 *
 * Once submitted, the unlock persists for 90 days (see `startNowGate.js`).
 * The `location` prop is the breadcrumb of where the visitor clicked Start
 * Now (topnav, hero, pricing, roi-calculator, story-act-5, …) — passed
 * straight to the analytics event so we can see which surfaces convert.
 */
export default function StartNowModal({ onClose, location = "unknown" }) {
  // When the OTP Worker is configured, Start Now requires its own stronger
  // stamp: email verified by code on THIS browser. Prior unlocks from other
  // gates (or HubSpot recognition) deliberately do NOT satisfy it.
  const otpMode = isOtpEnabled();
  const [verified, setVerified] = useState(() => isVerified());
  // Initialize from localStorage so repeat visitors skip the form.
  const [unlocked, setUnlocked] = useState(() => isUnlocked());
  // Access & Evaluation Agreement acceptance (versioned; re-prompts on bump).
  const [accepted, setAccepted] = useState(() => hasAcceptedCurrent());
  // Briefly check whether the hubspotutk cookie maps to a known HubSpot
  // contact (Contact Us submitter, meeting booker, BCC'd lead, etc.). If
  // it does, auto-unlock without showing the form. Skipped in OTP mode —
  // recognition can't substitute for mailbox proof.
  const [checkingIdentity, setCheckingIdentity] = useState(() => !otpMode && !isUnlocked());

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // When an already-unlocked visitor reopens the modal, silently re-submit
  // their stored email to HubSpot so the founder gets a notification that
  // they came back. Throttled by shouldNotifyRepeatVisit so the inbox
  // stays sane.
  useEffect(() => {
    if (otpMode ? !verified : !unlocked) return;
    if (!shouldNotifyForGate("startnow")) return;
    const email = getUnlockedEmail();
    if (!email) return;
    notifyStartNowRepeat({ email, location });
    trackEvent("start_now_repeat_visit", { location });
    // We only want this to fire on mount when the modal opens unlocked,
    // never re-fire on re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Identity check via the Cloudflare Worker. Runs once on mount when not
  // locally unlocked. If the visitor's hubspotutk cookie maps to a known
  // HubSpot contact, auto-unlock + fire the re-notify to this gate's
  // form. Falls through to the form on any failure / timeout / no match.
  useEffect(() => {
    if (otpMode || unlocked) return;
    let cancelled = false;
    checkKnownContact().then((result) => {
      if (cancelled) return;
      if (result && result.known && result.email) {
        markUnlocked(result.email);
        setUnlocked(true);
        notifyStartNowRepeat({ email: result.email, location });
        trackEvent("start_now_auto_unlocked", { location });
      }
      setCheckingIdentity(false);
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitted = (email) => {
    markUnlocked(email);
    // The agreement checkbox is required before the form mounts, so the
    // submission itself evidences acceptance — record it.
    markAccepted(email);
    if (email) notifyAgreementAccepted({ email, location, version: AGREEMENT_VERSION });
    setAccepted(true);
    setUnlocked(true);
    trackEvent("start_now_form_submitted", { location });
  };

  // OTP path: by the time this fires, the Worker has verified the mailbox
  // and written the permanent acceptance receipt. The client-side stamps
  // and HubSpot notifications are the convenience layer on top.
  const handleVerified = (email) => {
    markUnlocked(email);
    markAccepted(email);
    notifyOtpVerified({ email, location });
    notifyAgreementAccepted({ email, location, version: AGREEMENT_VERSION });
    setAccepted(true);
    setUnlocked(true);
    setVerified(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="start-now-title"
        className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {otpMode ? (
          verified ? (
            <UnlockedView />
          ) : (
            <OtpLockedView surface={`start_now_${location}`} onVerified={handleVerified} />
          )
        ) : checkingIdentity ? (
          <CheckingView />
        ) : unlocked ? (
          accepted ? (
            <UnlockedView />
          ) : (
            <AgreementGate
              email={getUnlockedEmail()}
              surface={`start_now_${location}`}
              onAccepted={() => setAccepted(true)}
            />
          )
        ) : (
          <LockedView onSubmitted={handleSubmitted} />
        )}
      </div>
    </div>
  );
}

function CheckingView() {
  return (
    <>
      <h2 id="start-now-title" className="text-2xl font-bold text-white mb-2">
        Start Now — Free
      </h2>
      <p className="text-slate-400 mb-6 animate-pulse">Checking your access…</p>
    </>
  );
}

function OtpLockedView({ surface, onVerified }) {
  return (
    <>
      <h2 id="start-now-title" className="text-2xl font-bold text-white mb-2">
        Start Now — Free
      </h2>
      <p className="text-slate-400 mb-6">
        Run the keyless demo on your laptop in under a minute. Verify your work
        email with a one-time code — the install command unlocks right after.
      </p>
      <OtpGate surface={surface} onVerified={onVerified} />
    </>
  );
}

function LockedView({ onSubmitted }) {
  const [agreed, setAgreed] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  return (
    <>
      <h2 id="start-now-title" className="text-2xl font-bold text-white mb-2">
        Start Now — Free
      </h2>
      <p className="text-slate-400 mb-6">
        Run the keyless demo on your laptop in under a minute. Tell us where to
        send setup tips — the install command unlocks as soon as you submit.
      </p>
      <ConsentGate>
        <div className="mb-3">
          <ConsentCheckbox
            id="start-now-consent"
            checked={agreed}
            onChange={setAgreed}
          />
        </div>
        <div className="mb-4">
          <AgreementCheckbox
            id="start-now-agreement"
            checked={agreedTerms}
            onChange={setAgreedTerms}
          />
        </div>
        {agreed && agreedTerms ? (
          <HubSpotStartNowForm onSuccess={onSubmitted} />
        ) : (
          <p className="text-xs text-slate-500">
            Tick both boxes above to load the form.
          </p>
        )}
      </ConsentGate>
    </>
  );
}

function UnlockedView() {
  return (
    <>
      <h2 id="start-now-title" className="text-2xl font-bold text-white mb-2">
        Thanks — here's your quickstart
      </h2>
      <p className="text-slate-400 mb-6">
        Run the keyless demo on your laptop in under a minute — no API keys, no
        LLM provider calls, no spend.
      </p>

      <InstallCommand
        command='uv tool install "traigent[recommended]" && traigent quickstart'
        secondary="No API keys. No LLM provider calls. No spend. Just python. (Have pip instead? `pip install` works too.)"
      />

      <div className="flex flex-wrap gap-3 mt-6">
        <a
          href="https://github.com/Traigent/Traigent"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center bg-[#1A6BF5] hover:bg-[#4D8EF8] text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
        >
          <Github className="mr-2 h-4 w-4" />
          View on GitHub
          <ArrowRight className="ml-2 h-4 w-4" />
        </a>
      </div>
    </>
  );
}
