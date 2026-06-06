import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter as Router } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import { initAnalytics, teardownAnalytics } from './lib/analytics'
import { subscribeConsent, hasMarketingConsent } from './lib/consent'
import './index.css'

// Initialize analytics once at app bootstrap if consent is granted.
// Otherwise, wait for consent to be granted.
if (hasMarketingConsent()) {
  initAnalytics()
} else {
  teardownAnalytics({ reload: false })
}
subscribeConsent((granted) => {
  if (granted) {
    initAnalytics()
  } else {
    teardownAnalytics()
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <Router>
        <App />
      </Router>
    </HelmetProvider>
  </React.StrictMode>,
)
