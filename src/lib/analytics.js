const isBrowser = typeof window !== 'undefined'

export function track(eventName, props = {}) {
  if (!isBrowser) {
    return
  }

  const payload = {
    event: eventName,
    props,
    timestamp: new Date().toISOString(),
  }

  if (typeof window.plausible === 'function') {
    window.plausible(eventName, { props })
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, props)
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(payload)
  }

  if (import.meta.env.DEV) {
    console.debug('[track]', payload)
  }
}
