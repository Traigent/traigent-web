/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { X } from "lucide-react";

/**
 * Shared overlay-modal chrome for the site's dialogs (StartNowModal,
 * LeadFunnelModal): a fixed, blurred backdrop, a centered scrollable card, and
 * a close button — with Escape-to-close and body-scroll-lock wired to
 * `onClose`. Presentation only; callers pass the dialog body as children and
 * label it with either `ariaLabel` (literal text) or `ariaLabelledby` (the id
 * of an in-body heading). Undefined label props are simply not rendered.
 */
export default function ModalShell({ onClose, ariaLabel, ariaLabelledby, children }) {
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
      {/* NOSONAR a native <dialog> would change focus/Escape/backdrop semantics across both shared modals; role="dialog" keeps behavior identical and is intentional */}<div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );
}
