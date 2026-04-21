import { ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import MarketingFooter from "../components/MarketingFooter";
import { portalUrl, tvlLinks } from "../content/siteContent";
import { usePageMeta } from "../hooks/usePageMeta";
import { trackEvent } from "../utils/analytics";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Formal Specifications for Production Agent Systems",
  description:
    "A short bridge from Traigent's governed optimization narrative to TVL as a broader formal specification initiative.",
  url: "https://traigent.ai/specifications",
};

const linkItems = [
  ["TVL home", tvlLinks.home],
  ["Getting started", tvlLinks.gettingStarted],
  ["Language reference", tvlLinks.reference],
  ["Examples", tvlLinks.examples],
  ["Book", tvlLinks.book],
];

export default function Specifications() {
  usePageMeta({
    title: "Specifications - Traigent",
    description:
      "Learn why explicit objectives, constraints, tunable variables, and promotion criteria help teams govern production AI agents.",
    path: "/specifications",
    structuredData,
  });

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <section className="bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">
              Formal specification bridge
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-normal md:text-6xl">
              Clearer agent systems start with clearer specifications
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Traigent focuses on governed optimization in production. Formal specifications help
              teams make the optimization surface explicit.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(280px,0.28fr)]">
          <article className="max-w-3xl space-y-6 text-lg leading-8 text-slate-700">
            <p>
              Better agent systems start with clearer specifications. Teams struggle when goals are
              vague, constraints are implicit, and important choices live across prompts, code,
              dashboards, and one-off deployment notes. A production agent is not just a prompt or a
              model call. It is a system with retrieval behavior, routing logic, thresholds, tool
              permissions, fallback rules, latency budgets, cost targets, and safety requirements.
            </p>
            <p>
              Formal specification helps make those requirements inspectable. Objectives describe
              what the team wants to improve. Constraints describe what must not be violated.
              Tunable variables describe the parts of the system Traigent can explore. Promotion
              criteria describe the evidence required before a candidate configuration replaces the
              baseline. This turns ad hoc tuning into an engineering workflow.
            </p>
            <p>
              For Traigent, specifications are useful because governed optimization needs a clear
              decision surface. If a team wants to optimize answer quality, citation correctness,
              latency, and cost, the system needs to know which choices are allowed to vary and
              which guardrails must stay fixed. If a team wants to promote an agent change safely,
              the promotion gate needs measurable criteria rather than a subjective chart review.
            </p>
            <p>
              TVL is a broader standalone initiative for formal agent specification. Traigent may
              reference formal specifications where they help describe objectives, constraints,
              tunable variables, and rollout rules, but Traigent is not a TVL documentation host.
              Readers who want the deeper guide, reference, examples, and book should use the TVL
              site directly.
            </p>
          </article>

          <aside className="self-start rounded-lg border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-950">Go deeper with TVL</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              TVL has its own documentation surface. Use these links for the formal language material.
            </p>
            <div className="mt-5 grid gap-2">
              {linkItems.map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent("specifications_page_outbound_click_to_tvl", {
                      destination: href,
                      label,
                    })
                  }
                  className="inline-flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-950"
                >
                  {label}
                  <ExternalLink className="h-4 w-4" />
                </a>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-normal">Use specifications to make improvement governable</h2>
              <p className="mt-2 text-slate-600">
                Then use Traigent to measure, optimize, and promote candidate configurations.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={portalUrl}
                onClick={() => trackEvent("portal_sign_up_cta_click", { location: "specifications_final_cta" })}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Try Traigent
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                to="/demos"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-white"
              >
                See demos
              </Link>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
