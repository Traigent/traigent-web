const BASE_URL = import.meta.env.BASE_URL;

export const resourcesCatalog = [
  {
    slug: "smartopt-evidence",
    title: "Smartopt evidence brief",
    category: "Learn",
    summary:
      "Spider replay and live confirmation results showing faster frontier discovery with conservative certification.",
    href: "/resources/smartopt-evidence",
    kind: "artifact",
    featured: true,
    image: `${BASE_URL}resources/smartopt/spider_recall_vs_spend.svg`,
    status: "ready",
  },
  {
    slug: "tvl-foundations",
    title: "TVL foundations",
    category: "Learn",
    summary:
      "A 10-part survey covering typed tuned variables, constraints, promotion semantics, and validation workflows.",
    href: "/resources/tvl-foundations",
    kind: "internal",
    featured: false,
    image: null,
    status: "ready",
  },
  {
    slug: "one-pager",
    title: "The Traigent One-pager",
    category: "Explore",
    summary:
      "Specification-driven agent engineering with TVL, evaluation gates, and governed optimization.",
    href: "/one-pager",
    kind: "internal",
    featured: true,
    image: null,
    status: "ready",
  },
  {
    slug: "manifesto",
    title: "The Manifesto",
    category: "Explore",
    summary:
      "Why agent engineering needs specs, measurable release decisions, and rollback discipline.",
    href: "/manifesto",
    kind: "internal",
    featured: true,
    image: null,
    status: "ready",
  },
];

export const resourceCategories = ["Learn", "Explore"];

export const featuredResources = resourcesCatalog.filter((resource) => resource.featured);
