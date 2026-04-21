export function trackEvent(name, properties = {}) {
  if (typeof window === "undefined") {
    return;
  }

  const payload = {
    event: name,
    ...properties,
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);

  if (typeof window.gtag === "function") {
    window.gtag("event", name, properties);
  }

  window.dispatchEvent(new CustomEvent("traigent:analytics", { detail: payload }));
}
