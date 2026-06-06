import { ArrowRight, Braces, ExternalLink, FileText, GitBranch, ShieldCheck } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import ResearchCredibilityStrip from "../components/ResearchCredibilityStrip";
import { portalUrl, researchLinks, researchPaper, tvlLinks } from "../content/research";
import { trackEvent } from "../lib/analytics";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ScholarlyArticle",
  headline: researchPaper.title,
  author: {
    "@type": "Person",
    name: "Nimrod Busany",
    affiliation: {
      "@type": "Organization",
      name: "Traigent",
    },
  },
  isPartOf: {
    "@type": "PublicationEvent",
    name: "CAIN 2026 Research Track",
    url: researchLinks.cainHome,
  },
  url: researchLinks.cainPaper,
};

const evidenceItems = [
  {
    title: "Peer-reviewed framing",
    body: "The CAIN paper makes tuned variables explicit as governed configuration decisions, not ad hoc prompt tweaks.",
    icon: FileText,
  },
  {
    title: "CI/CD-oriented operation",
    body: "The lifecycle emphasizes evidence, promotion, rollback, and maintainable operation as model behavior and costs change.",
    icon: GitBranch,
  },
  {
    title: "Formal specification path",
    body: "TVL extends the same idea into machine-checkable objectives, constraints, tunables, and rollout policies.",
    icon: Braces,
  },
  {
    title: "Governance-first product",
    body: "Traigent turns those ideas into operational workflows for measuring, optimizing, approving, and applying agent configurations.",
    icon: ShieldCheck,
  },
];

export default function Research() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Helmet>
        <title>Research - Traigent</title>
        <meta
          name="description"
          content="Traigent research on governed AI configuration, tuned variables, TVL, and CI/CD-oriented optimization for AI-enabled systems."
        />
        <link rel="canonical" href="https://traigent.ai/research" />
        <meta property="og:title" content="Research - Traigent" />
        <meta
          property="og:description"
          content="Peer-reviewed work and specifications behind Traigent's governed agent optimization platform."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://traigent.ai/research" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Research - Traigent" />
        <meta
          name="twitter:description"
          content="Governed agent optimization, grounded in research and formal specification."
        />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>
      <section className="bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">
              Research and specifications
            </p>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-normal sm:text-4xl md:text-6xl">
              Governed agent optimization, grounded in research
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              Traigent is built around a simple engineering thesis: agent behavior should be
              specified, measured, optimized, promoted, and rolled back with the same discipline as
              production software.
            </p>
          </div>

          <div className="mt-10">
            <ResearchCredibilityStrip variant="dark" compact />
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.58fr)_minmax(320px,0.42fr)]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
                CAIN 2026 paper
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-normal text-slate-950 sm:text-3xl md:text-4xl">
                {researchPaper.title}
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-700">{researchPaper.summary}</p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <span className="rounded-full border border-slate-300 bg-white px-3 py-1 font-medium text-slate-700">
                  {researchPaper.type}
                </span>
                <span className="rounded-full border border-slate-300 bg-white px-3 py-1 font-medium text-slate-700">
                  {researchPaper.venue}
                </span>
                <span className="rounded-full border border-slate-300 bg-white px-3 py-1 font-medium text-slate-700">
                  {researchPaper.venueDetail}
                </span>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={researchLinks.cainPaper}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent("research_page_cain_paper_click", {
                      destination: researchLinks.cainPaper,
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  View official CAIN entry
                  <ExternalLink className="h-4 w-4" />
                </a>
                <a
                  href={researchLinks.cainProgram}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent("research_page_cain_program_click", {
                      destination: researchLinks.cainProgram,
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:border-slate-400"
                >
                  See CAIN program
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>

            <aside className="rounded-lg border border-slate-200 bg-white p-6">
              <div className="border-b border-slate-200 pb-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                  Peer-reviewed research
                </p>
                <div className="mt-3 text-2xl font-bold text-slate-950">CAIN 2026</div>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  International Conference on AI Engineering, co-located with ICSE 2026.
                </p>
              </div>
              <dl className="mt-6 space-y-4 text-sm">
                <div>
                  <dt className="font-semibold text-slate-950">Author</dt>
                  <dd className="mt-1 text-slate-600">{researchPaper.authorLine}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-950">Session</dt>
                  <dd className="mt-1 text-slate-600">Governance and Compliance</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-950">Product connection</dt>
                  <dd className="mt-1 text-slate-600">
                    Tuned-variable governance, evidence-backed promotion, rollback, and
                    cost-aware operation.
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {evidenceItems.map(({ title, body, icon: Icon }) => (
            <div key={title} className="rounded-lg border border-slate-200 bg-white p-6">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-white">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.56fr)_minmax(320px,0.44fr)] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">
                TVL language
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-normal md:text-4xl">
                The specification layer for tunable agent systems
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-300">
                TVL gives teams a machine-checkable way to describe the decisions Traigent can
                explore: models, prompts, retrieval, tools, budgets, constraints, objectives, and
                promotion policies.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={tvlLinks.home}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent("research_page_tvl_home_click", { destination: tvlLinks.home })
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-100"
                >
                  Explore TVL
                  <ExternalLink className="h-4 w-4" />
                </a>
                <Link
                  to="/get-started"
                  onClick={() =>
                    trackEvent("research_page_get_started_click", { destination: "/get-started" })
                  }
                  className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-5 py-3 text-sm font-semibold text-slate-200 hover:border-white/30 hover:text-white"
                >
                  Start with SDK or TVL
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6 font-mono text-sm text-slate-300">
              <div className="mb-4 text-xs uppercase tracking-[0.18em] text-slate-500">
                agent.tvl.yml
              </div>
              <pre className="overflow-x-auto">
{`configuration_space:
  model: ["gpt-4o-mini", "gpt-4o"]
  retrieval_top_k: [2, 4, 8]

objectives:
  - name: answer_quality
    direction: maximize
  - name: cost
    direction: minimize

constraints:
  - latency_ms <= 1200
  - monthly_spend_usd <= budget`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-950">Trademark-safe attribution</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              CAIN, ICSE, ACM, and IEEE names are used on this page only for factual identification
              of venues, programs, and professional service. No sponsorship, endorsement,
              certification, approval, or partnership is implied.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-normal text-slate-950">
                Turn research into governed agent operations
              </h2>
              <p className="mt-2 text-slate-600">
                Use Traigent to specify, evaluate, optimize, and promote AI agent configurations.
              </p>
            </div>
            <a
              href={portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent("portal_sign_up_cta_click", { location: "research_final_cta" })
              }
              className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Try Traigent
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xl font-bold">Traigent</div>
              <p className="mt-2 max-w-md text-sm text-slate-400">
                Agent Optimization Platform. Wrap. Optimize. Converge. Re-optimize.
              </p>
              <p className="mt-4 text-xs text-slate-500">
                Traigent Ltd, Hartglas 16, Tel-Aviv, Israel
              </p>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-400">
              <a href={`${portalUrl}/privacy`} className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href={`${portalUrl}/terms`} className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href={`${portalUrl}/refund`} className="hover:text-white transition-colors">
                Refund Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
