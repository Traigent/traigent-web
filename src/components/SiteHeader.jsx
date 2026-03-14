import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, ChevronDown, Menu, Search, X } from 'lucide-react'
import { featuredResources, resourcesCatalog } from '../content/resources'
import { track } from '../lib/analytics'
import SiteSearch from './SiteSearch'

const aboutLinks = [
  { href: '/manifesto', label: 'Manifesto', target: 'manifesto' },
  { href: '/value-proposition', label: 'Value Proposition', target: 'value_proposition' },
]

function isActivePath(pathname, href) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

function ResourceLink({ resource, placement, onNavigate, variant = 'list' }) {
  const isFeatured = variant === 'featured'

  const handleClick = () => {
    track(resource.featured ? 'resource_featured_click' : 'resource_open', {
      slug: resource.slug,
      placement,
    })

    onNavigate?.()
  }

  return (
    <Link
      to={resource.href}
      className={`block rounded-2xl border transition ${
        isFeatured
          ? 'border-white/10 bg-white/5 p-5 hover:border-cyan-300/60 hover:bg-white/10'
          : 'border-white/8 bg-transparent p-4 hover:border-white/15 hover:bg-white/5'
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
            {resource.category}
          </p>
          <h4 className={`mt-2 font-semibold text-white ${isFeatured ? 'text-lg' : 'text-base'}`}>
            {resource.title}
          </h4>
          <p className={`mt-2 text-slate-300 ${isFeatured ? 'text-sm leading-6' : 'text-sm leading-6'}`}>
            {resource.summary}
          </p>
        </div>
        {resource.href.startsWith('/') ? (
          <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-500" />
        ) : (
          <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-slate-500" />
        )}
      </div>
    </Link>
  )
}

export default function SiteHeader() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [resourcesOpen, setResourcesOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const resourcesRef = useRef(null)
  const aboutRef = useRef(null)
  const isResourcesPage = location.pathname.startsWith('/resources')

  useEffect(() => {
    setMobileOpen(false)
    setResourcesOpen(false)
    setAboutOpen(false)
    setSearchOpen(false)
  }, [location.pathname, location.hash])

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!resourcesRef.current?.contains(event.target)) {
        setResourcesOpen(false)
      }

      if (!aboutRef.current?.contains(event.target)) {
        setAboutOpen(false)
      }
    }

    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
        setResourcesOpen(false)
        setAboutOpen(false)
        return
      }

      if (event.key === 'Escape') {
        setResourcesOpen(false)
        setAboutOpen(false)
        setSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const openSearch = () => {
    setSearchOpen(true)
    setResourcesOpen(false)
    setAboutOpen(false)
    setMobileOpen(false)
  }

  const linkClasses =
    'rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white'
  const activeClasses = 'bg-white/10 text-white'
  const mobileLinkClasses =
    'block rounded-lg px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white'

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-3"
            onClick={() => track('nav_click', { target: 'home' })}
          >
            <img
              src={`${import.meta.env.BASE_URL}images/traigent-logo-icon.png`}
              alt="Traigent"
              className="h-9 w-9"
            />
            <span className="text-lg font-semibold tracking-tight text-white">Traigent</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            <Link
              to="/#control-layer"
              className={`${linkClasses} ${location.pathname === '/' ? activeClasses : ''}`}
              onClick={() => track('nav_click', { target: 'platform' })}
            >
              Platform
            </Link>
            <Link
              to="/docs"
              className={`${linkClasses} ${isActivePath(location.pathname, '/docs') ? activeClasses : ''}`}
              onClick={() => track('nav_click', { target: 'docs' })}
            >
              Docs
            </Link>

            <div ref={resourcesRef} className="relative">
              <button
                type="button"
                className={`${linkClasses} ${isResourcesPage ? activeClasses : ''} inline-flex items-center gap-2`}
                aria-expanded={resourcesOpen}
                aria-haspopup="dialog"
                aria-controls="resources-menu"
                onClick={() => {
                  track('nav_click', { target: 'resources' })
                  setResourcesOpen((open) => !open)
                  setAboutOpen(false)
                }}
              >
                Resources
                <ChevronDown className={`h-4 w-4 transition ${resourcesOpen ? 'rotate-180' : ''}`} />
              </button>

              {resourcesOpen ? (
                <div
                  id="resources-menu"
                  className="absolute left-1/2 top-full mt-4 w-[min(700px,calc(100vw-2rem))] -translate-x-1/2 rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl"
                >
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr),320px]">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                        Library
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-white">
                        Browse the public Traigent library
                      </h3>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                        Evidence, foundations, and framing material for governed agent engineering.
                      </p>

                      <div className="mt-5 space-y-3">
                        {resourcesCatalog.map((resource) => (
                          <ResourceLink
                            key={resource.slug}
                            resource={resource}
                            placement="nav_menu"
                            onNavigate={() => setResourcesOpen(false)}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="min-w-0 rounded-3xl border border-white/10 bg-white/5 p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                        Start here
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-white">
                        The strongest public resources
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        Start with benchmark evidence and the TVL foundations survey before moving
                        into product framing.
                      </p>

                      <div className="mt-5 space-y-3">
                        {featuredResources.map((resource) => (
                          <ResourceLink
                            key={resource.slug}
                            resource={resource}
                            placement="nav_featured"
                            variant="featured"
                            onNavigate={() => setResourcesOpen(false)}
                          />
                        ))}
                      </div>

                      <Link
                        to="/resources"
                        className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/60 hover:text-cyan-200"
                        onClick={() => {
                          track('nav_click', { target: 'resources_library' })
                          setResourcesOpen(false)
                        }}
                      >
                        View full library
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div ref={aboutRef} className="relative">
              <button
                type="button"
                className={`${linkClasses} ${
                  isActivePath(location.pathname, '/manifesto') ||
                  isActivePath(location.pathname, '/value-proposition')
                    ? activeClasses
                    : ''
                } inline-flex items-center gap-2`}
                aria-expanded={aboutOpen}
                aria-haspopup="menu"
                aria-controls="about-menu"
                onClick={() => {
                  track('nav_click', { target: 'about' })
                  setAboutOpen((open) => !open)
                  setResourcesOpen(false)
                }}
              >
                About
                <ChevronDown className={`h-4 w-4 transition ${aboutOpen ? 'rotate-180' : ''}`} />
              </button>

              {aboutOpen ? (
                <div
                  id="about-menu"
                  className="absolute right-0 top-full mt-4 w-64 rounded-2xl border border-white/10 bg-slate-950 p-3 shadow-2xl"
                >
                  {aboutLinks.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
                      onClick={() => {
                        track('nav_click', { target: item.target })
                        setAboutOpen(false)
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <button
              type="button"
              className="inline-flex items-center gap-3 rounded-lg border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
              onClick={openSearch}
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
              <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-slate-400">
                Ctrl K
              </span>
            </button>

            <a
              href="https://cal.com/nimrod-busany"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              onClick={() => track('cta_click', { location: 'site_header', target: 'book_demo' })}
            >
              Request a demo
            </a>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg border border-white/10 p-2 text-slate-200 transition hover:bg-white/10"
              aria-label="Search docs and resources"
              onClick={openSearch}
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg border border-white/10 p-2 text-slate-200 transition hover:bg-white/10"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <div className="border-t border-white/10 bg-slate-950 px-4 py-4 lg:hidden sm:px-6">
            <div className="space-y-2">
              <Link
                to="/#control-layer"
                className={mobileLinkClasses}
                onClick={() => {
                  track('nav_click', { target: 'platform' })
                  setMobileOpen(false)
                }}
              >
                Platform
              </Link>
              <Link
                to="/docs"
                className={mobileLinkClasses}
                onClick={() => {
                  track('nav_click', { target: 'docs' })
                  setMobileOpen(false)
                }}
              >
                Docs
              </Link>
              <Link
                to="/resources"
                className={mobileLinkClasses}
                onClick={() => {
                  track('nav_click', { target: 'resources' })
                  setMobileOpen(false)
                }}
              >
                Resources
              </Link>
              {aboutLinks.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={mobileLinkClasses}
                  onClick={() => {
                    track('nav_click', { target: item.target })
                    setMobileOpen(false)
                  }}
                >
                  {item.label}
                </Link>
              ))}
              <a
                href="https://cal.com/nimrod-busany"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950"
                onClick={() => {
                  track('cta_click', { location: 'site_header_mobile', target: 'book_demo' })
                  setMobileOpen(false)
                }}
              >
                Request a demo
              </a>
            </div>
          </div>
        ) : null}
      </header>

      <SiteSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
