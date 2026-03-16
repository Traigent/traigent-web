import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App.jsx'
import { ThemeProvider } from './lib/theme'
import './index.css'
import './spaRedirect'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <Router basename={import.meta.env.BASE_URL}>
        <App />
      </Router>
    </ThemeProvider>
  </React.StrictMode>,
)
