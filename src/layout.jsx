import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import SiteHeader from './components/SiteHeader'

function ScrollManager() {
  const { hash, pathname } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0 })
      return
    }

    const targetId = hash.slice(1)

    const scrollToTarget = () => {
      const element = document.getElementById(targetId)

      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }

    const frame = window.requestAnimationFrame(scrollToTarget)
    const timeout = window.setTimeout(scrollToTarget, 150)

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timeout)
    }
  }, [hash, pathname])

  return null
}

export default function Layout() {
  return (
    <>
      <ScrollManager />
      <div className="min-h-screen bg-white text-slate-950">
        <SiteHeader />
        <main>
          <Outlet />
        </main>
      </div>
    </>
  )
} 
