import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ArrowRight, Menu, X } from "lucide-react";
import { portalUrl } from "../content/siteContent";
import { trackEvent } from "../utils/analytics";

const navItems = [
  { label: "Product", to: "/", end: true },
  { label: "Demos", to: "/demos" },
  { label: "Academy", to: "/academy" },
  { label: "Resources", to: "/resources" },
];

function navClass({ isActive }) {
  return [
    "px-3 py-2 text-sm font-medium transition-colors",
    isActive ? "text-white" : "text-slate-300 hover:text-white",
  ].join(" ");
}

export default function MarketingNav() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="bg-slate-950 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[64px] items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 shrink-0" onClick={closeMenu}>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#1A6BF5] text-sm font-bold">
              T
            </span>
            <span className="text-lg font-semibold tracking-normal">Traigent</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1" aria-label="Primary navigation">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={navClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/specifications"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Specifications
            </Link>
            <a
              href={portalUrl}
              onClick={() => trackEvent("portal_sign_up_cta_click", { location: "top_nav" })}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-slate-100"
            >
              Try Traigent
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <button
            type="button"
            aria-label={isOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 text-slate-200 md:hidden"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isOpen && (
          <nav className="md:hidden pb-4" aria-label="Mobile navigation">
            <div className="grid gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    [
                      "rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-slate-900 text-white"
                        : "text-slate-300 hover:bg-slate-900 hover:text-white",
                    ].join(" ")
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <NavLink
                to="/specifications"
                onClick={closeMenu}
                className={({ isActive }) =>
                  [
                    "rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white",
                  ].join(" ")
                }
              >
                Specifications
              </NavLink>
              <a
                href={portalUrl}
                onClick={() => {
                  closeMenu();
                  trackEvent("portal_sign_up_cta_click", { location: "mobile_nav" });
                }}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-slate-950"
              >
                Try Traigent
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
