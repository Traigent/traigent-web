import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

import {
  CLIENT_ERROR_DISABLED,
  LEAD_ROUTE_NOT_FOUND,
  isLeadFunnelConfigurationEnabled,
  isLeadFunnelUnavailableError,
} from "../src/lib/leadApiContract.js";
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
  topmostModal,
  trapModalTab,
} from "../src/lib/modalFocus.js";
import {
  REGISTRATION_RECOVERY_URL,
  consumeRegistrationRecoveryQuery,
} from "../src/lib/registrationRecovery.js";

const REPOSITORY_ROOT = resolve(import.meta.dirname, "..");

function focusable(name) {
  return {
    name,
    disabled: false,
    hidden: false,
    isConnected: true,
    tabIndex: 0,
    focusCalls: 0,
    focus() {
      this.focusCalls += 1;
    },
    getAttribute() {
      return null;
    },
  };
}

function keyEvent(key, shiftKey = false) {
  return {
    key,
    shiftKey,
    prevented: false,
    stopped: false,
    preventDefault() {
      this.prevented = true;
    },
    stopPropagation() {
      this.stopped = true;
    },
  };
}

function dialogWith(...elements) {
  const dialog = focusable("dialog");
  dialog.tabIndex = -1;
  dialog.querySelectorAll = () => elements;
  dialog.contains = (element) =>
    element === dialog || elements.includes(element);
  return dialog;
}

test("modal receives initial focus and restores the connected opener", () => {
  const dialog = dialogWith();
  const opener = focusable("opener");

  assert.equal(modalOpener(opener, dialog), opener);
  assert.equal(modalOpener(dialog, dialog), null);
  assert.equal(focusModal(dialog), true);
  assert.equal(dialog.focusCalls, 1);
  assert.equal(restoreModalFocus(opener), true);
  assert.equal(opener.focusCalls, 1);

  opener.isConnected = false;
  assert.equal(restoreModalFocus(opener), false);
  assert.equal(opener.focusCalls, 1);
});

test("modal Tab handling wraps in both directions and recovers escaped focus", () => {
  const first = focusable("first");
  const middle = focusable("middle");
  const last = focusable("last");
  const dialog = dialogWith(first, middle, last);

  const forward = keyEvent("Tab");
  handleModalKeyDown({
    event: forward,
    dialog,
    activeElement: last,
    onClose() {},
  });
  assert.equal(forward.prevented, true);
  assert.equal(first.focusCalls, 1);

  const backward = keyEvent("Tab", true);
  handleModalKeyDown({
    event: backward,
    dialog,
    activeElement: first,
    onClose() {},
  });
  assert.equal(backward.prevented, true);
  assert.equal(last.focusCalls, 1);

  const interior = keyEvent("Tab");
  handleModalKeyDown({
    event: interior,
    dialog,
    activeElement: middle,
    onClose() {},
  });
  assert.equal(interior.prevented, false);

  const escaped = keyEvent("Tab");
  handleModalKeyDown({
    event: escaped,
    dialog,
    activeElement: focusable("page"),
    onClose() {},
  });
  assert.equal(escaped.prevented, true);
  assert.equal(first.focusCalls, 2);
});

test("modal with no tabbable children keeps focus on its container", () => {
  const dialog = dialogWith();
  const event = keyEvent("Tab");
  handleModalKeyDown({
    event,
    dialog,
    activeElement: dialog,
    onClose() {},
  });
  assert.equal(event.prevented, true);
  assert.equal(dialog.focusCalls, 1);
});

test("focus returning from an iframe or page is pulled back into the modal", () => {
  const first = focusable("first");
  const frame = focusable("iframe");
  const dialog = dialogWith(first, frame);

  assert.equal(
    keepFocusWithinModal({ target: focusable("page") }, dialog),
    true,
  );
  assert.equal(first.focusCalls, 1);
  assert.equal(keepFocusWithinModal({ target: frame }, dialog), false);
  assert.equal(first.focusCalls, 1);
});

test("higher-priority focus regions are allowed outside the modal", () => {
  const allowedRegion = focusable("cookie preferences");
  const allowedTarget = focusable("accept cookies");
  allowedTarget.closest = () => allowedRegion;
  const dialog = dialogWith(focusable("close"));

  assert.equal(isModalFocusAllowed(allowedTarget), true);
  assert.equal(keepFocusWithinModal({ target: allowedTarget }, dialog), false);
  assert.equal(
    priorityModalFocusRegion({
      querySelector() {
        return allowedRegion;
      },
    }),
    allowedRegion,
  );
});

test("priority focus wraps at its controls and rejects the underlying modal", () => {
  const privacy = focusable("privacy");
  const reject = focusable("reject");
  const accept = focusable("accept");
  const priorityRegion = dialogWith(privacy, reject, accept);

  const tabFromLast = keyEvent("Tab");
  trapModalTab(tabFromLast, priorityRegion, accept);
  assert.equal(tabFromLast.prevented, true);
  assert.equal(privacy.focusCalls, 1);

  const modalClose = focusable("modal close");
  assert.equal(
    keepFocusWithinRegion({ target: modalClose }, priorityRegion),
    true,
  );
  assert.equal(privacy.focusCalls, 2);
});

test("only the topmost registered modal owns global focus handling", () => {
  const first = dialogWith();
  const second = dialogWith();
  const unregisterFirst = registerModal(first);
  const unregisterSecond = registerModal(second);

  assert.equal(topmostModal(), second);
  assert.equal(isTopmostModal(first), false);
  assert.equal(isTopmostModal(second), true);

  unregisterSecond();
  assert.equal(topmostModal(), first);
  unregisterFirst();
  assert.equal(topmostModal(), null);
});

test("Escape closes the modal and consumes the keyboard event", () => {
  const event = keyEvent("Escape");
  let closeCalls = 0;
  handleModalKeyDown({
    event,
    dialog: dialogWith(),
    activeElement: null,
    onClose() {
      closeCalls += 1;
    },
  });
  assert.equal(closeCalls, 1);
  assert.equal(event.prevented, true);
  assert.equal(event.stopped, true);
});

test("only a disabled client or missing backend route makes the funnel dormant", () => {
  assert.equal(isLeadFunnelUnavailableError(CLIENT_ERROR_DISABLED), true);
  assert.equal(isLeadFunnelUnavailableError(LEAD_ROUTE_NOT_FOUND), true);
  assert.equal(
    isLeadFunnelUnavailableError("LEAD_RATE_LIMIT_UNAVAILABLE"),
    false,
  );
  assert.equal(isLeadFunnelUnavailableError("CLIENT_NETWORK_ERROR"), false);
});

test("the committed state and API origin must both enable the browser funnel", () => {
  assert.equal(
    isLeadFunnelConfigurationEnabled("active", "https://api.example.test"),
    true,
  );
  assert.equal(
    isLeadFunnelConfigurationEnabled(" ACTIVE ", " https://api.example.test "),
    true,
  );
  assert.equal(
    isLeadFunnelConfigurationEnabled("dormant", "https://api.example.test"),
    false,
  );
  assert.equal(isLeadFunnelConfigurationEnabled("active", ""), false);
  assert.equal(
    isLeadFunnelConfigurationEnabled("", "https://api.example.test"),
    false,
  );
});

test("top-nav entry points share the lead funnel and its dormant view has no demo CTA", () => {
  const topNav = readFileSync(
    resolve(REPOSITORY_ROOT, "src/components/TopNav.jsx"),
    "utf8",
  );
  const leadFunnel = readFileSync(
    resolve(REPOSITORY_ROOT, "src/components/LeadFunnel.jsx"),
    "utf8",
  );

  assert.match(topNav, /import LeadFunnelModal from/);
  assert.doesNotMatch(topNav, /StartNowModal/);
  assert.match(topNav, /openLeadFunnel\("topnav"\)/);
  assert.match(topNav, /location=\{leadFunnelLocation\}/);
  assert.doesNotMatch(
    leadFunnel,
    /DEMO_BOOKING_URL|Book a demo|demo_booking_clicked/,
  );
  assert.match(leadFunnel, /Help me run my first Traigent optimization\./);
  assert.match(leadFunnel, /follow GUIDE\.md\./);
});

test("registration recovery URL is HashRouter-canonical", () => {
  const url = new URL(REGISTRATION_RECOVERY_URL);
  assert.equal(url.origin, "https://traigent.ai");
  assert.equal(url.pathname, "/");
  assert.equal(url.search, "");
  assert.equal(url.hash, "#/?start=free");
});

test("registration recovery consumes its key and preserves unrelated query data", () => {
  const { shouldOpen, remaining } = consumeRegistrationRecoveryQuery(
    new URLSearchParams("campaign=portal&start=free&start=other&source=email"),
  );
  assert.equal(shouldOpen, true);
  assert.equal(remaining.toString(), "campaign=portal&source=email");

  const unmatched = consumeRegistrationRecoveryQuery(
    new URLSearchParams("start=Free&campaign=portal"),
  );
  assert.equal(unmatched.shouldOpen, false);
  assert.equal(unmatched.remaining.toString(), "start=Free&campaign=portal");
});
