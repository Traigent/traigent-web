import { resourcesCatalog } from './resources'

const docsEntries = [
  {
    title: 'Documentation overview',
    summary: 'Overview of the public TVL and Traigent onboarding docs surface.',
    href: '/docs#overview',
    section: 'Docs',
    keywords: ['documentation', 'overview', 'docs'],
    external: false,
  },
  {
    title: 'TVL getting started',
    summary: 'Start with typed tuned variables, objectives, and constraints.',
    href: 'https://www.tvl-lang.org/getting-started/',
    section: 'TVL',
    keywords: ['tvl', 'getting started', 'quickstart', 'specification'],
    external: true,
  },
  {
    title: 'TVL language reference',
    summary: 'Reference docs for TVL syntax, module structure, and expression semantics.',
    href: 'https://www.tvl-lang.org/reference/language/',
    section: 'TVL',
    keywords: ['tvl', 'reference', 'syntax', 'language'],
    external: true,
  },
  {
    title: 'Integration example',
    summary: 'See the hybrid API optimization example and workflow.',
    href: '/docs#example',
    section: 'Docs',
    keywords: ['integration', 'example', 'hybrid api', 'optimize'],
    external: false,
  },
  {
    title: 'SDK access',
    summary: 'Request guided access for Traigent SDK setup and implementation docs.',
    href: '/docs#access',
    section: 'Docs',
    keywords: ['sdk', 'access', 'guided onboarding'],
    external: false,
  },
  {
    title: 'Get started',
    summary: 'Public entry path for evaluation, onboarding, and SDK access.',
    href: '/get-started',
    section: 'Onboarding',
    keywords: ['onboarding', 'get started', 'evaluation'],
    external: false,
  },
  {
    title: 'Value proposition',
    summary: 'Overview of the business case and operator value story.',
    href: '/value-proposition',
    section: 'About',
    keywords: ['value proposition', 'buyers', 'operators'],
    external: false,
  },
]

const resourceEntries = resourcesCatalog.map((resource) => ({
  title: resource.title,
  summary: resource.summary,
  href: resource.href,
  section: 'Resources',
  keywords: [resource.category, resource.kind, resource.slug.replace(/-/g, ' ')],
  external: false,
}))

export const siteSearchEntries = [...docsEntries, ...resourceEntries]
