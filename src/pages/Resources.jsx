import { ArrowRight, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import MarketingCard from "../components/MarketingCard";
import MarketingFooter from "../components/MarketingFooter";
import { launchArticles, portalUrl, routeMeta } from "../content/siteContent";
import { usePageMeta } from "../hooks/usePageMeta";
import { trackEvent } from "../utils/analytics";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Traigent Resources",
  url: "https://traigent.ai/resources",
  description:
    "Articles and practical guidance on production AI agent optimization, evaluation, rollout, and governance.",
};

export default function Resources() {
  const meta = routeMeta["/resources"];

  usePageMeta({
    ...meta,
    path: "/resources",
    structuredData,
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
              Resources
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-normal md:text-6xl">
              Practical writing for agents in production
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Articles and essays for teams turning agent experiments into measurable, governed,
              production systems.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid gap-6 lg:grid-cols-3">
            {launchArticles.map((article) => (
              <MarketingCard key={article.title} className="flex flex-col">
                <FileText className="h-6 w-6 text-blue-700" />
                <div className="mt-5 flex items-center gap-2">
                  <span className="rounded-lg bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    {article.status}
                  </span>
                </div>
                <h2 className="mt-5 text-xl font-semibold text-slate-950">{article.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{article.summary}</p>
                <div className="mt-auto pt-6">
                  <p className="text-sm text-slate-500">
                    Article pages will be published after the foundation is live and the launch copy is finalized.
                  </p>
                </div>
              </MarketingCard>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
            <div>
              <h2 className="text-2xl font-bold tracking-normal">Editorial standard</h2>
              <p className="mt-4 text-slate-600">
                Resources should be technical, credible, concrete, practical, calm, and evidence-led.
                They should end with a demo CTA, course CTA, and product CTA once article detail
                pages are introduced.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
              <h3 className="font-semibold text-slate-950">Start with the course or the demos</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                The resources hub is the top-of-funnel surface. The academy teaches the framework,
                and demos will carry the proof once reproducible artifacts are ready.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to="/academy"
                  onClick={() => trackEvent("article_cta_click", { destination: "academy", source: "resources" })}
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Academy
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/demos"
                  onClick={() => trackEvent("article_cta_click", { destination: "demos", source: "resources" })}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-white"
                >
                  Demos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-normal">Ready to evaluate the product?</h2>
              <p className="mt-2 text-slate-300">Use the portal when your team is ready for Traigent.</p>
            </div>
            <a
              href={portalUrl}
              onClick={() => trackEvent("article_cta_click", { destination: "portal", source: "resources_final_cta" })}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-100"
            >
              Try Traigent
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
