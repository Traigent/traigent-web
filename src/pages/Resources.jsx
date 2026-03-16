import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import { track } from "../lib/analytics";
import { featuredResources, resourcesCatalog } from "../content/resources";

function isInternalHref(href) {
  return href.startsWith("/");
}

function kindLabel(kind) {
  if (kind === "artifact") {
    return "Evidence brief";
  }

  if (kind === "external") {
    return "External";
  }

  return "Guide";
}

function ResourceCard({ resource, placement, featured = false }) {
  const handleClick = () => {
    track(featured ? "resource_featured_click" : "resource_open", {
      slug: resource.slug,
      placement,
    });
  };

  const preview = resource.image ? (
    <img
      src={resource.image}
      alt=""
      className="h-44 w-full rounded-2xl border border-slate-200 object-cover dark:border-slate-700"
    />
  ) : (
    <div className="flex h-44 items-end rounded-2xl bg-[linear-gradient(135deg,#cffafe_0%,#dbeafe_45%,#eef2ff_100%)] p-5 dark:bg-[linear-gradient(135deg,#083344_0%,#0f172a_45%,#312e81_100%)]">
      <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-800 dark:bg-slate-950/80 dark:text-slate-100">
        {resource.category}
      </span>
    </div>
  );

  const content = (
    <>
      {preview}
      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700 dark:text-cyan-300">
          {kindLabel(resource.kind)}
        </div>
        {!isInternalHref(resource.href) ? (
          <ArrowUpRight className="h-4 w-4 text-slate-400" />
        ) : (
          <ArrowRight className="h-4 w-4 text-slate-400" />
        )}
      </div>
      <h3 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">
        {resource.title}
      </h3>
      <p className="mt-3 text-base text-slate-600 dark:text-slate-300">{resource.summary}</p>
      <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
        {resource.category}
      </p>
    </>
  );

  const sharedClasses =
    "group block rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-cyan-400";

  if (isInternalHref(resource.href)) {
    return (
      <Link to={resource.href} className={sharedClasses} onClick={handleClick}>
        {content}
      </Link>
    );
  }

  return (
    <a
      href={resource.href}
      className={sharedClasses}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
    >
      {content}
    </a>
  );
}

export default function Resources() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <section className="border-b border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-950/60">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
          <SiteHeader className="mb-16" />

          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">
                Resources
              </p>
              <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-slate-900 dark:text-white md:text-6xl">
                Evidence, guides, and research for governed agent engineering.
              </h1>
              <p className="mt-6 max-w-3xl text-lg text-slate-600 dark:text-slate-300">
                Start with the strongest public material first: the Smartopt evidence brief,
                the One-pager, the Manifesto, and the TVL foundations survey.
              </p>
            </div>

            <div className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-100 p-6 dark:border-slate-800 dark:bg-slate-900/80">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700 dark:text-cyan-300">
                  Launch scope
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">4 curated resources</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-4 dark:bg-slate-950">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Learn</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">Evidence + foundations</p>
                </div>
                <div className="rounded-2xl bg-white p-4 dark:bg-slate-950">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Explore</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">Framing docs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
                Featured
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
                Start with the sharpest public story
              </h2>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {featuredResources.map((resource) => (
              <ResourceCard
                key={resource.slug}
                resource={resource}
                placement="resources_page_featured"
                featured
              />
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
              Library
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
              Curated v1 collection
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {resourcesCatalog.map((resource) => (
              <ResourceCard
                key={resource.slug}
                resource={resource}
                placement="resources_page_library"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
