import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import MarketingNav from './components/MarketingNav'
import { applyPageMeta } from './utils/pageMeta'

const fallbackMeta = {
  '/': {
    title: 'Traigent - Trust Your AI Agents at Scale',
    description: 'If you can measure it, we can improve it. Traigent helps companies ship AI agents from lab to production, at scale, with confidence.',
  },
  '/get-started': {
    title: 'Get started - Traigent',
    description: 'Start with the Traigent SDK and TVL resources for specifying, evaluating, optimizing, and applying agent configurations.',
  },
  '/one-pager': {
    title: 'Traigent One Pager',
    description: 'A concise overview of Traigent and AI agent continuous optimization infrastructure.',
  },
  '/value-proposition': {
    title: 'Traigent Value Proposition',
    description: 'Traigent helps teams optimize AI agent configurations across accuracy, latency, cost, and business KPIs.',
  },
  '/privacy': {
    title: 'Redirecting - Traigent',
    description: 'The Traigent privacy page is hosted on the product portal.',
  },
  '/terms': {
    title: 'Redirecting - Traigent',
    description: 'The Traigent terms page is hosted on the product portal.',
  },
  '/refund': {
    title: 'Redirecting - Traigent',
    description: 'The Traigent refund page is hosted on the product portal.',
  },
  '/pricing': {
    title: 'Redirecting - Traigent',
    description: 'The Traigent pricing page is hosted on the product portal.',
  },
}

export default function Layout() {
  const location = useLocation()

  useEffect(() => {
    const meta = fallbackMeta[location.pathname]

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
