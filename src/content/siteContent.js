export const portalUrl = "https://portal.traigent.ai";
export const demoRequestUrl = "https://calendar.app.google/VLcx8bnYahw37jva9";
export const tvlLinks = {
  home: "https://tvl-lang.org/",
  gettingStarted: "https://tvl-lang.org/getting-started/",
  reference: "https://tvl-lang.org/reference/language/",
  examples: "https://tvl-lang.org/examples/walkthroughs/",
  book: "https://tvl-lang.org/book/",
};

export const plannedDemos = [
  {
    slug: "rag-support-optimizer",
    title: "RAG Support Optimizer",
    kicker: "Quality, citation quality, latency, and cost",
    summary:
      "Optimize a retrieval-based support agent by making tunable choices explicit and comparing candidate configurations against production-like constraints.",
    tunables: ["model", "retriever top-k", "chunk size", "reranker", "prompt strategy"],
    objectives: ["answer quality", "citation correctness", "latency", "cost"],
    status: "Artifact in preparation",
    relatedLesson: "Lesson 1: From Demos to Systems",
  },
  {
    slug: "tier-aware-router",
    title: "Tier-Aware Router",
    kicker: "Routing policy, user tier, complexity, and budget",
    summary:
      "Compare routing policies across free and enterprise tiers while enforcing quality floors, cost ceilings, and protected-intent escalation.",
    tunables: ["model per tier", "routing threshold", "escalation threshold", "context budget"],
    objectives: ["quality by tier", "cost", "latency", "resolution rate"],
    status: "Artifact in preparation",
    relatedLesson: "Lesson 2: Goals and Trade-offs",
  },
  {
    slug: "promotion-gates",
    title: "Promotion Gates",
    kicker: "Evidence thresholds, guardrails, canaries, and rollback",
    summary:
      "Show how a candidate configuration clears explicit promotion criteria before replacing a baseline in a governed rollout.",
    tunables: ["promotion alpha", "minimum effect size", "traffic split", "rollback thresholds"],
    objectives: ["baseline improvement", "regression risk", "stability", "complaint rate"],
    status: "Artifact in preparation",
    relatedLesson: "Lesson 5: Rollout and Promotion",
  },
];

export const courseLessons = [
  {
    number: "01",
    title: "From Demos to Systems",
    summary:
      "Why prototype success does not equal production readiness, and how to identify the hidden moving parts in an agent stack.",
    exercise: "List all system-level choices that affect one agent idea.",
    demo: "RAG Support Optimizer",
  },
  {
    number: "02",
    title: "Goals and Trade-offs",
    summary:
      "How to turn vague preferences into explicit objectives, constraints, and measurable success criteria.",
    exercise: "Create a scorecard with 3 objectives and 3 constraints.",
    demo: "Tier-Aware Router",
  },
  {
    number: "03",
    title: "Tunable Systems",
    summary:
      "How models, retrieval, routing, thresholds, output formats, and fallbacks become a governed search space.",
    exercise: "Map tunable variables across one agent system.",
    demo: "RAG Support Optimizer",
  },
  {
    number: "04",
    title: "Evaluation and Telemetry",
    summary:
      "How to connect offline evaluation, online metrics, failure taxonomies, traces, feedback, and guardrail monitoring.",
    exercise: "Define telemetry worth capturing for one customer-facing agent.",
    demo: "Tier-Aware Router",
  },
  {
    number: "05",
    title: "Rollout and Promotion",
    summary:
      "How canaries, shadow runs, staged rollout, promotion gates, and rollback rules turn improvement into governed change.",
    exercise: "Write a simple promotion policy for one agent update.",
    demo: "Promotion Gates",
  },
  {
    number: "06",
    title: "Governance, Provenance, and Technical Debt",
    summary:
      "How to keep track of what changed, why it changed, how it was evaluated, and when to reverse it.",
    exercise: "Audit one workflow for reproducibility and governance gaps.",
    demo: "Promotion Gates",
  },
];

export const launchArticles = [
  {
    title: "From Prompt Engineering to Governed Optimization",
    summary:
      "Prompt engineering is a useful starting point, but production agent work needs reproducibility, controlled trade-offs, and safe rollout.",
    status: "Draft planned",
  },
  {
    title: "Accuracy Is Not Enough for Production Agents",
    summary:
      "A strong demo can still be too slow, expensive, brittle, or risky to ship. Production teams need a broader scorecard.",
    status: "Draft planned",
  },
  {
    title: "Why Every Production Agent Needs Promotion Gates",
    summary:
      "Replacing a baseline without explicit criteria creates regressions. Promotion gates make rollout evidence-led and reversible.",
    status: "Draft planned",
  },
];
