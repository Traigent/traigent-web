/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { X } from "lucide-react";
import LeadFunnel from "./LeadFunnel";

/**
 * Modal wrapper for the lead-funnel front door (Marketing front door unit A2).
 * Mirrors StartNowModal's shell (backdrop, Esc-to-close, body scroll lock) but
 * hosts <LeadFunnel/>, which owns all per-step copy including its own headings
 * — so this shell carries a static aria-label rather than a per-step title.
 *
 * `location` is the breadcrumb of where the visitor opened the funnel
 * (homepage_hero, …) — passed straight through to the funnel's analytics.
 */
export default function LeadFunnelModal({ onClose, location = "unknown" }) {
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
        aria-label="Get started with Traigent"
        className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <LeadFunnel surface={location} />
      </div>
    </div>
  );
}
