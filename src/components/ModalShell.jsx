/* eslint-disable react/prop-types */
import { useLayoutEffect, useRef } from "react";
import { X } from "lucide-react";
import {
  focusModal,
  handleModalKeyDown,
  isModalFocusAllowed,
  isTopmostModal,
  keepFocusWithinModal,
  keepFocusWithinRegion,
  modalOpener,
  priorityModalFocusRegion,
  registerModal,
  restoreModalFocus,
  trapModalTab,
} from "../lib/modalFocus";

/**
 * Shared overlay-modal chrome for the site's dialogs (StartNowModal,
 * LeadFunnelModal): a fixed, blurred backdrop, a centered scrollable card, and
 * a close button — with focus containment, Escape-to-close, opener focus
 * restoration and body-scroll-lock wired to `onClose`. Presentation only;
 * callers pass the dialog body as children and label it with either `ariaLabel`
 * (literal text) or `ariaLabelledby` (the id of an in-body heading). Undefined
 * label props are simply not rendered. Focus leaving an embedded iframe is
 * recaptured on the next parent-document focusin; a cross-origin iframe still
 * owns key events while focused, so it cannot delegate Escape to this shell.
 * The production lead/OTP paths are same-document; the legacy HubSpot fallback
 * retains its visible close control and bounded Tab order.
 */
export default function ModalShell({
  onClose,
  ariaLabel,
  ariaLabelledby,
  children,
}) {
  const dialogRef = useRef(null);
  const openerRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    // Layout effects run before descendant passive effects. Capture the real
    // page opener before a step-level effect can focus content inside the
    // modal, and reject an in-dialog active element defensively.
    if (!openerRef.current) {
      openerRef.current = modalOpener(document.activeElement, dialog);
    }
    const opener = openerRef.current;
    const previousBodyOverflow = document.body.style.overflow;
    const onKey = (e) => {
      if (!isTopmostModal(dialog)) return;
      const priorityRegion = priorityModalFocusRegion(document);
      if (priorityRegion) {
        trapModalTab(e, priorityRegion, document.activeElement);
        return;
      }
      if (isModalFocusAllowed(e.target)) return;
      handleModalKeyDown({
        event: e,
        dialog,
        activeElement: document.activeElement,
        onClose: () => onCloseRef.current(),
      });
    };
    const onFocusIn = (event) => {
      if (!isTopmostModal(dialog)) return;
      const priorityRegion = priorityModalFocusRegion(document);
      if (priorityRegion) keepFocusWithinRegion(event, priorityRegion);
      else keepFocusWithinModal(event, dialog);
    };
    const unregisterModal = registerModal(dialog);
    document.addEventListener("keydown", onKey);
    document.addEventListener("focusin", onFocusIn);
    document.body.style.overflow = "hidden";
    focusModal(priorityModalFocusRegion(document) || dialog);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("focusin", onFocusIn);
      document.body.style.overflow = previousBodyOverflow;
      unregisterModal();
      const priorityRegion = priorityModalFocusRegion(document);
      if (!focusModal(priorityRegion)) restoreModalFocus(opener);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Keep the native dialog semantic while the shared focus manager retains
          cookie-consent priority and the existing backdrop behavior. */}
      <dialog
        ref={dialogRef}
        open
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        tabIndex={-1}
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
      </dialog>
    </div>
  );
}
