// Keyboard and focus primitives for ModalShell. Kept DOM-library-free so the
// behavior can be regression-tested with Node's built-in test runner.
const MODAL_FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "[contenteditable='true']",
  "[tabindex]:not([tabindex='-1'])",
].join(",");
const MODAL_ALLOWED_FOCUS_SELECTOR = "[data-modal-focus-allowed='true']";
const MODAL_PRIORITY_FOCUS_SELECTOR = "[data-modal-focus-priority='true']";
const modalStack = [];

export function modalFocusableElements(dialog) {
  if (!dialog?.querySelectorAll) return [];
  return Array.from(dialog.querySelectorAll(MODAL_FOCUSABLE_SELECTOR)).filter(
    (element) =>
      !element.hidden &&
      !element.disabled &&
      element.getAttribute?.("aria-hidden") !== "true" &&
      element.tabIndex !== -1,
  );
}

export function focusModal(dialog) {
  if (typeof dialog?.focus !== "function") return false;
  dialog.focus({ preventScroll: true });
  return true;
}

export function isModalFocusAllowed(target) {
  return Boolean(target?.closest?.(MODAL_ALLOWED_FOCUS_SELECTOR));
}

export function priorityModalFocusRegion(root) {
  return root?.querySelector?.(MODAL_PRIORITY_FOCUS_SELECTOR) || null;
}

export function registerModal(dialog) {
  const existingIndex = modalStack.indexOf(dialog);
  if (existingIndex !== -1) modalStack.splice(existingIndex, 1);
  modalStack.push(dialog);
  return () => {
    const index = modalStack.indexOf(dialog);
    if (index !== -1) modalStack.splice(index, 1);
  };
}

export function topmostModal() {
  return modalStack.at(-1) || null;
}

export function isTopmostModal(dialog) {
  return topmostModal() === dialog;
}

export function modalOpener(activeElement, dialog) {
  if (
    typeof activeElement?.focus !== "function" ||
    dialog?.contains?.(activeElement)
  ) {
    return null;
  }
  return activeElement;
}

export function restoreModalFocus(element) {
  if (typeof element?.focus !== "function" || element.isConnected === false) {
    return false;
  }
  element.focus({ preventScroll: true });
  return true;
}

export function trapModalTab(event, dialog, activeElement) {
  if (event.key !== "Tab") return false;

  const focusable = modalFocusableElements(dialog);
  if (focusable.length === 0) {
    event.preventDefault();
    focusModal(dialog);
    return true;
  }

  const first = focusable[0];
  const last = focusable.at(-1);
  const focusIsInside = dialog?.contains?.(activeElement);
  const shouldWrapBackward =
    event.shiftKey &&
    (!focusIsInside || activeElement === dialog || activeElement === first);
  const shouldWrapForward =
    !event.shiftKey &&
    (!focusIsInside || activeElement === dialog || activeElement === last);

  if (shouldWrapBackward) {
    event.preventDefault();
    last.focus();
  } else if (shouldWrapForward) {
    event.preventDefault();
    first.focus();
  }
  return true;
}

// A cross-origin iframe owns its own key events, so a parent document cannot
// see the Tab that leaves it. The next parent-document focusin is observable:
// pull that escaped focus straight back to the modal's first focus target.
export function keepFocusWithinModal(event, dialog) {
  if (
    !dialog ||
    dialog.contains?.(event.target) ||
    isModalFocusAllowed(event.target)
  ) {
    return false;
  }
  const [first] = modalFocusableElements(dialog);
  if (first) first.focus();
  else focusModal(dialog);
  return true;
}

export function keepFocusWithinRegion(event, region) {
  if (!region || region.contains?.(event.target)) return false;
  const [first] = modalFocusableElements(region);
  if (first) first.focus();
  else focusModal(region);
  return true;
}

export function handleModalKeyDown({ event, dialog, activeElement, onClose }) {
  if (event.key === "Escape") {
    event.preventDefault();
    event.stopPropagation();
    onClose();
    return true;
  }
  return trapModalTab(event, dialog, activeElement);
}
