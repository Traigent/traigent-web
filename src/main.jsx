import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter as Router } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import { initAnalytics } from './lib/analytics'
import './index.css'

// Initialize analytics once at app bootstrap. Becomes a no-op
// until VITE_GA4_ID / VITE_CLARITY_ID are set in .env.
initAnalytics()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <Router>
        <App />
      </Router>
    </HelmetProvider>
  </React.StrictMode>,
)
