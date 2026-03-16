import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { track } from "../lib/analytics";
import { featuredResources, resourceCategories, resourcesCatalog } from "../content/resources";

const BASE_URL = import.meta.env.BASE_URL;

const navItems = [
  { label: "Manifesto", href: "/manifesto", target: "manifesto" },
  { label: "One pager", href: "/one-pager", target: "one_pager" },
];

function isInternalHref(href) {
  return href.startsWith("/");
}

function isActivePath(pathname, href) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function kindLabel(kind) {
  if (kind === "artifact") {
    return "Evidence";
  }

  if (kind === "external") {
    return "External";
  }

  return "Guide";
}

function trackResource(resource, placement, featured = false) {
  track(featured ? "resource_featured_click" : "resource_open", {
    slug: resource.slug,
    placement,
  });
}

function Brand({ variant }) {
  if (variant === "inverse") {
    return (
      <img
        src={`${BASE_URL}images/traigent-logo-white-cropped.png`}
        alt="Traigent"
        className="h-10 w-auto"
      />
    );
  }

  return (
    <span className="inline-flex items-center gap-3">
      <img
        src={`${BASE_URL}images/traigent-logo-icon.png`}
        alt="Traigent"
        className="h-10 w-10 object-contain"
      />
      <span className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
        Traigent
      </span>
    </span>
  );
}

function HeaderLink({ href, label, target, active, inverse }) {
  const activeClasses = inverse
    ? "text-cyan-200"
    : "text-cyan-700 dark:text-cyan-300";
  const idleClasses = inverse
    ? "text-slate-200 hover:bg-white/10"
    : "text-slate-700 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/10";

  return (
    <Link
      to={href}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition ${active ? activeClasses : idleClasses}`}
      onClick={() => track("nav_click", { target })}
      aria-current={active ? "page" : undefined}
    >
      {label}
    </Link>
  );
}

function ResourceNavItem({ resource, placement, onNavigate }) {
  const sharedClasses =
    "group block rounded-2xl border border-slate-200 bg-white/70 p-4 transition hover:border-cyan-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:hover:border-cyan-400 dark:hover:bg-slate-900";

  const inner = (
    <>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700 dark:text-cyan-300">
          {kindLabel(resource.kind)}
        </span>
        {!isInternalHref(resource.href) ? (
          <ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:text-cyan-600 dark:group-hover:text-cyan-300" />
        ) : null}
      </div>
      <h4 className="mb-2 text-base font-semibold text-slate-900 dark:text-white">
        {resource.title}
      </h4>
      <p className="text-sm text-slate-600 dark:text-slate-300">{resource.summary}</p>
    </>
  );

  const handleClick = () => {
    trackResource(resource, placement);
    onNavigate?.();
  };

  if (isInternalHref(resource.href)) {
    return (
      <Link to={resource.href} className={sharedClasses} onClick={handleClick}>
        {inner}
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
      {inner}
    </a>
  );
}

function FeaturedResourceCard({ resource, onNavigate }) {
  const preview = resource.image ? (
    <img
      src={resource.image}
      alt=""
      className="h-28 w-full rounded-xl border border-slate-200 object-cover dark:border-slate-700"
    />
  ) : (
    <div className="flex h-28 items-end rounded-xl bg-[linear-gradient(135deg,#d1fae5_0%,#e0f2fe_45%,#eef2ff_100%)] p-4 dark:bg-[linear-gradient(135deg,#083344_0%,#0f172a_45%,#312e81_100%)]">
      <span className="text-sm font-semibold text-slate-900 dark:text-white">
        {resource.category}
      </span>
    </div>
  );

  const inner = (
    <>
      {preview}
      <div className="mt-4">
        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700 dark:text-cyan-300">
          Featured
        </div>
        <h4 className="mb-2 text-base font-semibold text-slate-900 dark:text-white">
          {resource.title}
        </h4>
        <p className="text-sm text-slate-600 dark:text-slate-300">{resource.summary}</p>
      </div>
    </>
  );

  const handleClick = () => {
    trackResource(resource, "nav_featured", true);
    onNavigate?.();
  };

  const sharedClasses =
    "group block rounded-2xl border border-slate-200 bg-white/70 p-4 transition hover:border-cyan-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:hover:border-cyan-400 dark:hover:bg-slate-900";

  if (isInternalHref(resource.href)) {
    return (
      <Link to={resource.href} className={sharedClasses} onClick={handleClick}>
        {inner}
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
      {inner}
    </a>
  );
}

export default function SiteHeader({ variant = "default", className = "" }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [desktopResourcesOpen, setDesktopResourcesOpen] = useState(false);
  const desktopMenuRef = useRef(null);

  useEffect(() => {
    setMobileOpen(false);
    setMobileResourcesOpen(false);
    setDesktopResourcesOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!desktopResourcesOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (!desktopMenuRef.current?.contains(event.target)) {
        setDesktopResourcesOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setDesktopResourcesOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [desktopResourcesOpen]);

  const inverse = variant === "inverse";
  const shellClasses = inverse
    ? "border border-white/10 bg-white/5 text-white backdrop-blur"
    : "border border-slate-200 bg-white/90 text-slate-900 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/85 dark:text-white";
  const mobilePanelClasses = inverse
    ? "border border-white/10 bg-slate-950/95"
    : "border border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-slate-950/95";
  const mobileButtonClasses = inverse
    ? "border-white/20 text-slate-100 hover:bg-white/10"
    : "border-slate-300 text-slate-800 hover:bg-slate-900/5 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-white/10";
  const ctaClasses = inverse
    ? "inline-flex items-center justify-center rounded-xl bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
    : "inline-flex items-center justify-center rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-cyan-300 dark:text-slate-950 dark:hover:bg-cyan-200";
  const isResourcesActive = location.pathname.startsWith("/resources");

  const closeMenus = () => {
    setDesktopResourcesOpen(false);
    setMobileOpen(false);
    setMobileResourcesOpen(false);
  };

  return (
    <header className={`relative z-50 ${className}`}>
      <div className={`rounded-2xl px-4 py-3 sm:px-5 ${shellClasses}`}>
        <div className="flex items-center justify-between gap-4">
          <Link to="/" onClick={() => track("nav_click", { target: "home" })}>
            <Brand variant={variant} />
          </Link>

          <div className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => (
              <HeaderLink
                key={item.href}
                href={item.href}
                label={item.label}
                target={item.target}
                active={isActivePath(location.pathname, item.href)}
                inverse={inverse}
              />
            ))}

            <div
              ref={desktopMenuRef}
              className="relative"
              onMouseEnter={() => setDesktopResourcesOpen(true)}
              onMouseLeave={() => setDesktopResourcesOpen(false)}
            >
              <button
                type="button"
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                  isResourcesActive
                    ? inverse
                      ? "text-cyan-200"
                      : "text-cyan-700 dark:text-cyan-300"
                    : inverse
                      ? "text-slate-200 hover:bg-white/10"
                      : "text-slate-700 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/10"
                }`}
                onClick={() => {
                  track("nav_click", { target: "resources" });
                  setDesktopResourcesOpen((open) => !open);
                }}
                aria-expanded={desktopResourcesOpen}
                aria-haspopup="dialog"
              >
                Resources
                <ChevronDown
                  className={`h-4 w-4 transition ${desktopResourcesOpen ? "rotate-180" : ""}`}
                />
              </button>

              {desktopResourcesOpen ? (
                <div className="absolute right-0 top-full mt-4 w-[min(960px,calc(100vw-2rem))] rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
                  <div className="mb-6 flex items-start justify-between gap-6">
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
                        Resources
                      </p>
                      <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
                        Evidence, guides, and research for governed agent engineering.
                      </h3>
                    </div>
                    <Link
                      to="/resources"
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-cyan-300 hover:text-cyan-700 dark:border-slate-700 dark:text-slate-100 dark:hover:text-cyan-300"
                      onClick={() => {
                        track("nav_click", { target: "resources" });
                        closeMenus();
                      }}
                    >
                      View all
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-[1fr_1fr_1.15fr]">
                    {resourceCategories.map((category) => (
                      <div key={category}>
                        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                          {category}
                        </div>
                        <div className="space-y-3">
                          {resourcesCatalog
                            .filter((resource) => resource.category === category)
                            .map((resource) => (
                              <ResourceNavItem
                                key={resource.slug}
                                resource={resource}
                                placement="nav_menu"
                                onNavigate={closeMenus}
                              />
                            ))}
                        </div>
                      </div>
                    ))}

                    <div>
                      <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                        Featured
                      </div>
                      <div className="space-y-3">
                        {featuredResources.slice(0, 3).map((resource) => (
                          <FeaturedResourceCard
                            key={resource.slug}
                            resource={resource}
                            onNavigate={closeMenus}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <a
              href="https://cal.com/nimrod-busany"
              target="_blank"
              rel="noopener noreferrer"
              className={ctaClasses}
              onClick={() => track("cta_click", { location: "site_header", target: "book_demo" })}
            >
              Book demo
            </a>
          </div>

          <button
            type="button"
            className={`inline-flex items-center justify-center rounded-xl border px-3 py-2 transition lg:hidden ${mobileButtonClasses}`}
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen ? (
          <div className={`mt-4 rounded-2xl p-4 lg:hidden ${mobilePanelClasses}`}>
            <div className="space-y-2">
              {navItems.map((item) => (
                <HeaderLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  target={item.target}
                  active={isActivePath(location.pathname, item.href)}
                  inverse={inverse}
                />
              ))}

              <button
                type="button"
                className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                  inverse
                    ? "text-slate-200 hover:bg-white/10"
                    : "text-slate-700 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/10"
                }`}
                onClick={() => {
                  track("nav_click", { target: "resources" });
                  setMobileResourcesOpen((open) => !open);
                }}
                aria-expanded={mobileResourcesOpen}
              >
                <span>Resources</span>
                <ChevronDown
                  className={`h-4 w-4 transition ${mobileResourcesOpen ? "rotate-180" : ""}`}
                />
              </button>

              {mobileResourcesOpen ? (
                <div className="space-y-2 px-2 pb-2">
                  <Link
                    to="/resources"
                    className="block rounded-lg px-3 py-2 text-sm font-semibold text-cyan-700 transition hover:bg-slate-900/5 dark:text-cyan-300 dark:hover:bg-white/10"
                    onClick={() => {
                      track("nav_click", { target: "resources" });
                      closeMenus();
                    }}
                  >
                    View all resources
                  </Link>
                  {resourcesCatalog.map((resource) => {
                    const handleClick = () => {
                      trackResource(resource, "nav_mobile");
                      closeMenus();
                    };

                    const classes =
                      "block rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/10";

                    if (isInternalHref(resource.href)) {
                      return (
                        <Link
                          key={resource.slug}
                          to={resource.href}
                          className={classes}
                          onClick={handleClick}
                        >
                          {resource.title}
                        </Link>
                      );
                    }

                    return (
                      <a
                        key={resource.slug}
                        href={resource.href}
                        className={classes}
                        onClick={handleClick}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {resource.title}
                      </a>
                    );
                  })}
                </div>
              ) : null}

              <a
                href="https://cal.com/nimrod-busany"
                target="_blank"
                rel="noopener noreferrer"
                className={ctaClasses}
                onClick={() => {
                  track("cta_click", { location: "site_header_mobile", target: "book_demo" });
                  closeMenus();
                }}
              >
                Book demo
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
