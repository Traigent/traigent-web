import { useEffect } from 'react'

export default function ExternalRedirect({ to, label }) {
  useEffect(() => {
    window.location.replace(to)
  }, [to])

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="max-w-lg text-center space-y-4">
        <h1 className="text-3xl font-bold">Redirecting</h1>
        <p className="text-slate-400">
          The {label} page is hosted on the Traigent portal. If you are not redirected
          automatically, use the link below.
        </p>
        <a href={to} className="text-indigo-400 hover:text-indigo-300 transition-colors">
          {to}
        </a>
      </div>
    </div>
  )
}
