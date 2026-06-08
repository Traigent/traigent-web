/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Cookie } from 'lucide-react';
import {
  getConsentRecord,
  hasRejectedConsent,
  openCookieBanner,
  subscribeConsent,
} from '../lib/consent';

const PRIVACY_URL = 'https://portal.traigent.ai/privacy';

/**
 * Wraps any gated form. Behaviour:
 *
 *   - Cookies explicitly REJECTED -> show a "Cookies required" block instead
 *     of the form, with a button that re-opens the cookie banner.
 *   - Cookies ACCEPTED or undecided -> render children. (Undecided means the
 *     cookie banner is already on screen blocking the page, so there is no
 *     point also blocking the form.)
 *
 * Subscribes to consent changes so flipping Reject -> Accept inside the
 * cookie banner immediately reveals the wrapped form.
 */
export default function ConsentGate({ children }) {
  const [rejected, setRejected] = useState(() => hasRejectedConsent());

  useEffect(() => {
    setRejected(hasRejectedConsent());
    return subscribeConsent(() => setRejected(hasRejectedConsent()));
  }, []);

  if (!rejected) return children;
  return <CookiesRequiredBlock />;
}

function CookiesRequiredBlock() {
  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-6 text-center">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-300">
        <Cookie className="h-5 w-5" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-white">
        Cookie consent required
      </h3>
      <p className="mb-5 text-sm leading-relaxed text-slate-300">
        You previously chose <span className="font-semibold text-white">Reject</span> on
        our cookie banner. We need your consent before we can share contact
        details with you or send you anything by email — submission is gated
        behind that choice.
      </p>
      <button
        type="button"
        onClick={openCookieBanner}
        className="inline-flex items-center rounded-lg bg-[#1A6BF5] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#4D8EF8]"
      >
        Review cookie preferences
      </button>
      <p className="mt-4 text-xs text-slate-500">
        See our{' '}
        <a
          href={PRIVACY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-slate-300"
        >
          Privacy Policy
        </a>
        {' '}for what we collect and why.
      </p>
    </div>
  );
}
