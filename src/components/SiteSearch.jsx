import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, ArrowUpRight, Search, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { siteSearchEntries } from '../content/siteSearch'
import { track } from '../lib/analytics'

function SearchResult({ item, onClose }) {
  const handleClick = () => {
    track('search_select', {
      title: item.title,
      href: item.href,
      section: item.section,
    })

    onClose()
  }

  const content = (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 transition hover:border-indigo-300 hover:shadow-sm">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">{item.section}</p>
        <h3 className="mt-2 text-base font-semibold text-slate-900">{item.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{item.summary}</p>
      </div>
      {item.external ? (
        <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
      ) : (
        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
      )}
    </div>
  )

  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" onClick={handleClick}>
        {content}
      </a>
    )
  }

  return (
    <Link to={item.href} onClick={handleClick}>
      {content}
    </Link>
  )
}

export default function SiteSearch({ open, onClose }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (!open) {
      setQuery('')
      return
    }

    track('search_open', { placement: 'site_header' })
    inputRef.current?.focus()

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return siteSearchEntries.slice(0, 8)
    }

    return siteSearchEntries
      .filter((item) => {
        const haystack = [
          item.title,
          item.summary,
          item.section,
          ...(item.keywords || []),
        ]
          .join(' ')
          .toLowerCase()

        return haystack.includes(normalizedQuery)
      })
      .slice(0, 8)
  }, [query])

  if (!open) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-[80] bg-slate-950/55 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Search docs and resources"
      onClick={onClose}
    >
      <div className="mx-auto max-w-3xl px-4 pt-20 sm:px-6 lg:px-8">
        <div
          className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-5 py-4">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search docs, onboarding, and public resources"
              className="w-full border-none bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400"
            />
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center rounded-lg border border-slate-200 px-2.5 py-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
              aria-label="Close search"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-[65vh] overflow-y-auto p-4">
            {results.length ? (
              <div className="space-y-3">
                {results.map((item) => (
                  <SearchResult key={`${item.section}:${item.title}`} item={item} onClose={onClose} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
                <p className="text-sm font-medium text-slate-900">No matching public entries</p>
                <p className="mt-2 text-sm text-slate-600">
                  Try terms like <span className="font-medium text-slate-900">TVL</span>,{' '}
                  <span className="font-medium text-slate-900">integration</span>, or{' '}
                  <span className="font-medium text-slate-900">resources</span>.
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-slate-200 bg-white px-5 py-4 text-xs text-slate-500">
            <span>Scoped to the current public docs, onboarding, and resources surface.</span>
            <span className="hidden rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600 sm:inline-flex">
              Esc to close
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
