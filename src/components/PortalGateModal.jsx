/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { X, ExternalLink } from "lucide-react";
import HubSpotStartNowForm from "./HubSpotStartNowForm";
import ConsentGate from "./ConsentGate";
import ConsentCheckbox from "./ConsentCheckbox";
import {
  isUnlocked,
  markUnlocked,
  getUnlockedEmail,
  shouldNotifyForGate,
} from "../lib/startNowGate";
import { notifyPortalRepeat, notifyAgreementAccepted, PORTAL_FORM_ID } from "../lib/hubspotForms";
import { checkKnownContact } from "../lib/hubspotIdentify";
import { trackEvent } from "../lib/analytics";
import { hasAcceptedCurrent, markAccepted, AGREEMENT_VERSION } from "../lib/accessAgreement";
import AgreementCheckbox from "./AgreementCheckbox";
import AgreementGate from "./AgreementGate";

const PORTAL_URL = "https://portal.traigent.ai";

/**
 * Two-state modal mirroring StartNowModal but for the portal entry:
 *   1. Locked  → HubSpot portal form captures email
 *   2. Unlocked → "Click to open the portal" CTA
 *
 * Shares the 90-day localStorage TTL with Start Now (same key, same
 * `markUnlocked` / `getUnlockedEmail`), so submitting either form unlocks
 * both surfaces. The repeat-visit notification goes to the PORTAL form
 * specifically — so the founder sees "they came back for portal" rather
 * than "they came back for the SDK".
 *
 * The `location` prop is the breadcrumb of which "Open portal" was
 * clicked (topnav / topnav_mobile / footer / …).
 */
export default function PortalGateModal({ onClose, location = "unknown" }) {
  const [unlocked, setUnlocked] = useState(() => isUnlocked());
  const [accepted, setAccepted] = useState(() => hasAcceptedCurrent());
  const [checkingIdentity, setCheckingIdentity] = useState(() => !isUnlocked());

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

  // If the modal opens already unlocked, fire the silent portal re-notify
  // so the founder sees "they came back for the portal". Throttled.
  useEffect(() => {
    if (!unlocked) return;
    if (!shouldNotifyForGate("portal")) return;
    const email = getUnlockedEmail();
    if (!email) return;
    notifyPortalRepeat({ email, location });
    trackEvent("portal_repeat_visit", { location });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Identity check via Cloudflare Worker (Contact Us / meeting / BCC etc).
  useEffect(() => {
    if (unlocked) return;
    let cancelled = false;
    checkKnownContact().then((result) => {
      if (cancelled) return;
      if (result && result.known && result.email) {
        markUnlocked(result.email);
        setUnlocked(true);
        notifyPortalRepeat({ email: result.email, location });
        trackEvent("portal_auto_unlocked", { location });
      }
      setCheckingIdentity(false);
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitted = (email) => {
    markUnlocked(email);
    // The agreement checkbox is required before the form mounts — record it.
    markAccepted(email);
    if (email) notifyAgreementAccepted({ email, location: `portal_${location}`, version: AGREEMENT_VERSION });
    setAccepted(true);
    setUnlocked(true);
    trackEvent("portal_form_submitted", { location });
  };

  const handleOpenPortal = () => {
    trackEvent("portal_opened", { location });
    window.open(PORTAL_URL, "_blank", "noopener,noreferrer");
    onClose();
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
        aria-labelledby="portal-gate-title"
        className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {checkingIdentity ? (
          <CheckingView />
        ) : unlocked ? (
          accepted ? (
            <UnlockedView onOpenPortal={handleOpenPortal} />
          ) : (
            <AgreementGate
              email={getUnlockedEmail()}
              surface={`portal_${location}`}
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
      <h2 id="portal-gate-title" className="text-2xl font-bold text-white mb-2">
        Open the Traigent portal
      </h2>
      <p className="text-slate-400 mb-6 animate-pulse">Checking your access…</p>
    </>
  );
}

function LockedView({ onSubmitted }) {
  const [agreed, setAgreed] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  return (
    <>
      <h2 id="portal-gate-title" className="text-2xl font-bold text-white mb-2">
        Open the Traigent portal
      </h2>
      <p className="text-slate-400 mb-6">
        Tell us where to send setup tips — the portal opens as soon as you
        submit.
      </p>
      <ConsentGate>
        <div className="mb-3">
          <ConsentCheckbox
            id="portal-gate-consent"
            checked={agreed}
            onChange={setAgreed}
          />
        </div>
        <div className="mb-4">
          <AgreementCheckbox
            id="portal-gate-agreement"
            checked={agreedTerms}
            onChange={setAgreedTerms}
          />
        </div>
        {agreed && agreedTerms ? (
          <HubSpotStartNowForm
            formId={PORTAL_FORM_ID}
            onSuccess={onSubmitted}
            targetId="hs-portal-gate-form"
          />
        ) : (
          <p className="text-xs text-slate-500">
            Tick both boxes above to load the form.
          </p>
        )}
      </ConsentGate>
    </>
  );
}

function UnlockedView({ onOpenPortal }) {
  return (
    <>
      <h2 id="portal-gate-title" className="text-2xl font-bold text-white mb-2">
        Welcome back — open the portal
      </h2>
      <p className="text-slate-400 mb-6">
        Your account at <code className="px-1 py-0.5 rounded bg-slate-800 text-sm">portal.traigent.ai</code> — manage agents, optimization runs, and API keys.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onOpenPortal}
          className="inline-flex items-center bg-[#1A6BF5] hover:bg-[#4D8EF8] text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
        >
          Open portal
          <ExternalLink className="ml-2 h-4 w-4" />
        </button>
      </div>
    </>
  );
}
