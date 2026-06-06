import React, { useState, useEffect } from 'react';
import { hasMarketingConsent, setConsent, subscribeConsent } from '../lib/consent';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    // If there's no explicit choice yet, show the banner
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('traigent_marketing_consent');
      if (stored === null) {
        setShowBanner(true);
      }
    }
  }, []);

  const handleAccept = () => {
    setConsent(true);
    setShowBanner(false);
    setShowPreferences(false);
  };

  const handleReject = () => {
    setConsent(false);
    setShowBanner(false);
    setShowPreferences(false);
  };

  // Allow users to change their choice later by exposing a method or button
  // For simplicity, we can have a small floating button to reopen preferences
  // if they have already made a choice.

  if (!showBanner && !showPreferences) {
    return (
      <button
        onClick={() => setShowPreferences(true)}
        className="fixed bottom-4 left-4 z-[9999] bg-slate-800 text-slate-300 text-xs px-3 py-2 rounded-full shadow-lg hover:bg-slate-700 transition-colors border border-slate-700"
      >
        Cookie Preferences
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[10000] p-4 sm:p-6 pointer-events-none">
      <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-6 pointer-events-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-white font-semibold mb-2">Cookie Preferences</h3>
          <p className="text-slate-300 text-sm">
            We use cookies to improve your experience, understand how you interact with our site, and personalize our marketing. 
            By clicking "Accept", you consent to our use of these cookies. You can change your choice at any time.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleReject}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
          >
            Reject All
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm font-medium text-white bg-[#1A6BF5] hover:bg-[#4D8EF8] rounded-lg transition-colors"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
