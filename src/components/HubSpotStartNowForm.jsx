/* eslint-disable react/prop-types --
 * Codebase ships without PropTypes; prop contract is documented in JSDoc below.
 */
import { useEffect, useRef, useState } from "react";

const HUBSPOT_SCRIPT_SRC = "https://js-eu1.hsforms.net/forms/embed/v2.js";
const HUBSPOT_PORTAL_ID = "148486827";
const HUBSPOT_DEFAULT_FORM_ID = "35384a3e-7386-45b0-924e-84e5d6f637e4";
const HUBSPOT_REGION = "eu1";

let scriptPromise = null;

// HubSpot has shipped several shapes for submissionValues over the years.
// Pluck the email out across all of them defensively.
function extractEmail(message) {
  if (!message || !message.data) return "";
  const d = message.data;
  if (typeof d.email === "string") return d.email;
  if (d.submissionValues && typeof d.submissionValues.email === "string") {
    return d.submissionValues.email;
  }
  if (Array.isArray(d.submissionValues)) {
    const found = d.submissionValues.find((f) => f && f.name === "email");
    if (found && typeof found.value === "string") return found.value;
  }
  return "";
}

function extractEmailFromCallbackData(data) {
  if (!data) return "";
  if (typeof data.email === "string") return data.email;
  if (data.submissionValues && typeof data.submissionValues.email === "string") {
    return data.submissionValues.email;
  }
  if (Array.isArray(data.submissionValues)) {
    const found = data.submissionValues.find((f) => f && f.name === "email");
    if (found && typeof found.value === "string") return found.value;
  }
  return "";
}

// Reads the email input value off the jQuery-wrapped form HubSpot passes to
// onFormSubmit. Falls back gracefully if HubSpot ever ships a plain DOM form.
function readEmailFromHsForm($form) {
  if (!$form) return "";
  const formEl =
    (typeof $form.get === "function" && $form.get(0)) ||
    (Array.isArray($form) && $form[0]) ||
    (typeof $form === "object" && $form[0]) ||
    (typeof $form === "object" && $form.form) ||
    null;
  if (!formEl || !formEl.querySelector) return "";
  const input =
    formEl.querySelector('input[type="email"]') ||
    formEl.querySelector('input[name="email"]');
  return (input && typeof input.value === "string") ? input.value.trim() : "";
}

// Belt-and-suspenders: read the email straight out of the target container,
// regardless of how HubSpot wrapped the input. Used as the final fallback
// when neither the callback nor the captured ref produced a value.
function readEmailFromTarget(targetId) {
  if (typeof document === "undefined") return "";
  const root = document.getElementById(targetId);
  if (!root) return "";
  const input =
    root.querySelector('input[type="email"]') ||
    root.querySelector('input[name="email"]');
  return (input && typeof input.value === "string") ? input.value.trim() : "";
}

/** Load the HubSpot embed script once and cache the promise. */
function loadHubSpotScript() {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined") return resolve(null);
    if (window.hbspt && window.hbspt.forms) return resolve(window.hbspt);
    const existing = document.querySelector(`script[src="${HUBSPOT_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(window.hbspt));
      existing.addEventListener("error", reject);
      return;
    }
    const s = document.createElement("script");
    s.src = HUBSPOT_SCRIPT_SRC;
    s.async = true;
    s.charset = "utf-8";
    s.type = "text/javascript";
    s.addEventListener("load", () => resolve(window.hbspt));
    s.addEventListener("error", reject);
    document.head.appendChild(s);
  });
  return scriptPromise;
}

/**
 * Renders the gated HubSpot lead-capture form for the SDK reveal.
 *
 * @param {object}   props
 * @param {Function} props.onSuccess  — fires after HubSpot confirms submission
 * @param {string}   [props.targetId] — DOM id for the form container
 */
export default function HubSpotStartNowForm({
  onSuccess,
  targetId = "hs-start-now-form",
  formId = HUBSPOT_DEFAULT_FORM_ID,
}) {
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;
  // We grab the email value off the HubSpot form DOM in onFormSubmit (which
  // fires BEFORE submission) and stash it here, then read it back when
  // onFormSubmitted fires. The postMessage / inline-callback data shape
  // sometimes omits submissionValues entirely, so DOM read is the load-
  // bearing capture path — the other extractors are kept as safety nets.
  const capturedEmailRef = useRef("");
  const [status, setStatus] = useState("loading"); // "loading" | "ready" | "error"

  useEffect(() => {
    let cancelled = false;

    // Belt-and-suspenders: HubSpot v2 doesn't always fire the inline
    // `onFormSubmitted` callback when the form is configured for an inline
    // thank-you message — it posts a window message instead. Listen for both.
    const handleHsMessage = (event) => {
      // HubSpot v2 message shape: { type: "hsFormCallback", eventName: "...", id: <formId>, data: ... }
      const d = event.data;
      if (!d || d.type !== "hsFormCallback") return;
      if (d.eventName === "onFormSubmitted") {
        // eslint-disable-next-line no-console
        console.debug("[hs-form] postMessage onFormSubmitted", d);
        const email = extractEmail(d) || capturedEmailRef.current || readEmailFromTarget(targetId);
        onSuccessRef.current?.(email);
      }
    };
    window.addEventListener("message", handleHsMessage);

    loadHubSpotScript()
      .then((hbspt) => {
        if (cancelled || !hbspt || !hbspt.forms) {
          setStatus("error");
          return;
        }
        hbspt.forms.create({
          portalId: HUBSPOT_PORTAL_ID,
          formId,
          region: HUBSPOT_REGION,
          target: `#${targetId}`,
          onFormReady: () => {
            // eslint-disable-next-line no-console
            console.debug("[hs-form] onFormReady");
          },
          onFormSubmit: ($form) => {
            // CAPTURE EMAIL HERE — this fires BEFORE submission, while the
            // form DOM still holds the values the visitor typed.
            const captured = readEmailFromHsForm($form) || readEmailFromTarget(targetId);
            capturedEmailRef.current = captured;
            // eslint-disable-next-line no-console
            console.debug("[hs-form] onFormSubmit captured email:", captured);
          },
          onFormSubmitted: (_form, data) => {
            // eslint-disable-next-line no-console
            console.debug("[hs-form] inline onFormSubmitted", data);
            const email =
              extractEmailFromCallbackData(data) ||
              capturedEmailRef.current ||
              readEmailFromTarget(targetId);
            onSuccessRef.current?.(email);
          },
        });
        setStatus("ready");
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error("[hs-form] script load error", err);
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
      window.removeEventListener("message", handleHsMessage);
    };
  }, [targetId, formId]);

  return (
    <div>
      <div id={targetId} className="min-h-[260px] hs-form-frame" />
      {status === "loading" && (
        <p className="text-sm text-slate-400 mt-2">Loading form…</p>
      )}
      {status === "error" && (
        <p className="text-sm text-amber-400 mt-2">
          Couldn't load the form. Email us at{" "}
          <a href="mailto:amir@traigent.ai" className="underline">amir@traigent.ai</a>{" "}
          and we'll send the install command directly.
        </p>
      )}
    </div>
  );
}
