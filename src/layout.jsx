import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import MarketingNav from './components/MarketingNav'
import { routeMeta } from './content/siteContent'
import { applyPageMeta } from './utils/pageMeta'

export default function Layout() {
  const location = useLocation()

  useEffect(() => {
    const meta = routeMeta[location.pathname]

    if (!meta) {
      return
    }

    applyPageMeta({ ...meta, path: location.pathname })
  }, [location.pathname])

  return (
    <>
      <MarketingNav />
      {/* Footer stays per-page because the current homepage owns its own footer. */}
      <Outlet />
    </>
  )
} 
