export const resourcesCatalog = [
  {
    slug: 'traigent-evidence',
    title: 'Traigent evidence brief',
    category: 'Evidence',
    summary:
      'Benchmark replay and live confirmation results showing faster frontier discovery with conservative certification.',
    href: '/resources/traigent-evidence',
    kind: 'artifact',
    featured: true,
    image: null,
    status: 'ready',
  },
  {
    slug: 'tvl-foundations',
    title: 'TVL foundations',
    category: 'Foundations',
    summary:
      'A 10-part survey covering typed tuned variables, constraints, promotion semantics, and validation workflows.',
    href: '/resources/tvl-foundations',
    kind: 'internal',
    featured: true,
    image: null,
    status: 'ready',
  },
  {
    slug: 'one-pager',
    title: 'The Traigent One-pager',
    category: 'Overview',
    summary:
      'Specification-driven agent engineering with TVL, evaluation gates, and governed optimization.',
    href: '/one-pager',
    kind: 'internal',
    featured: false,
    image: null,
    status: 'ready',
  },
  {
    slug: 'manifesto',
    title: 'The Manifesto',
    category: 'Perspective',
    summary:
      'Why agent engineering needs specs, measurable release decisions, and rollback discipline.',
    href: '/manifesto',
    kind: 'internal',
    featured: false,
    image: null,
    status: 'ready',
  },
]

export const featuredResources = resourcesCatalog.filter((resource) => resource.featured)
