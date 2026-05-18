import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, Github } from "lucide-react";
import StartNowModal from "./StartNowModal";
import { trackEvent } from "../lib/analytics";

const productItems = [
  { label: "Optimization Engine", scrollId: "optimization", desc: "Picks next best config from run history" },
  { label: "Agent Wrapper", scrollId: "product", desc: "Automated execution + KPI capture" },
  { label: "Observability & Tracing", scrollId: "observability", desc: "Full trace tree · spans · tokens · cost" },
  { label: "Benchmark Insights", scrollId: "benchmark", desc: "Flags easy / always-fail / redundant questions" },
  { label: "TVL", href: "https://www.tvl-lang.org/", external: true, desc: "Tuned Variables Language — machine-checkable spec format" },
];

const resourcesItems = [
  { label: "ROI Calculator", href: "/roi", desc: "Estimate your 12-month savings" },
  { label: "TTM Calculator", href: "/ttm", desc: "Engineer-weeks saved per optimization pass" },
  { label: "Compare", href: "/compare", desc: "vs. Langfuse · Arize · Helicone · Braintrust" },
  { label: "FAQ", href: "/faq", desc: "Common questions" },
  { label: "Docs", href: "https://github.com/Traigent/Traigent", external: true, desc: "SDK on GitHub" },
  { label: "About", href: "/about", desc: "Team, mission, values" },
  { label: "Get Started", href: "/get-started" },
  { label: "Value Proposition", href: "/value-proposition" },
  { label: "See It In Action", href: "/see-it-in-action", desc: "Watch Traigent converge live" },
  { label: "Optimization in Action", href: "/optimization-in-action", desc: "Live optimization-table demo · sweep & converge" },
];

function MenuItem({ item, onScroll }) {
  const content = (
    <>
      <div className="text-sm text-white font-medium">{item.label}</div>
      {item.desc && <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>}
    </>
  );
  const className = "block px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors";

  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }
  if (item.scrollId) {
    return (
      <a href="#" onClick={onScroll(item.scrollId)} className={className}>
        {content}
      </a>
    );
  }
  return <Link to={item.href} className={className}>{content}</Link>;
}

function Dropdown({ label, items, isOpen, onOpen, onClose, onScroll }) {
  return (
    <div
      className="relative"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
    >
      <button
        className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
        onClick={() => (isOpen ? onClose() : onOpen())}
      >
        {label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 pt-3">
          <div className="w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2">
            {items.map((item) => (
              <MenuItem key={item.label} item={item} onScroll={onScroll} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TopNav() {
  const [openMenu, setOpenMenu] = useState(null);
  const [showStartNow, setShowStartNow] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Click handler for in-page anchor scrolling.
  // If we're on the homepage, scrollIntoView directly.
  // If on another framed page, navigate home with a sessionStorage flag
  // so Homepage can scroll after mount.
  const scrollOrNavigate = (id) => (e) => {
    e.preventDefault();
    setOpenMenu(null);
    if (location.pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      sessionStorage.setItem("pendingScroll", id);
      navigate("/");
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#080808]/95 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo — click always returns to the top of the homepage. When already
                on `/`, React Router skips the navigation, so we scroll manually. */}
            <Link
              to="/"
              onClick={() => {
                if (location.pathname === "/") {
                  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                }
              }}
              className="flex items-center text-xl font-bold text-white leading-none"
            >
              <img
                src="/images/traigent-logo-icon.png"
                alt=""
                aria-hidden="true"
                className="h-5 w-auto mr-2"
              />
              Traigent
            </Link>

            {/* Tabs */}
            <div className="hidden lg:flex items-center gap-7 text-sm">
              <Dropdown
                label="Product"
                items={productItems}
                isOpen={openMenu === "product"}
                onOpen={() => setOpenMenu("product")}
                onClose={() => setOpenMenu(null)}
                onScroll={scrollOrNavigate}
              />
              <Link to="/value-proposition" className="text-slate-300 hover:text-white transition-colors">
                The Problem
              </Link>
              <Link
                to="/blog"
                className="text-slate-300 hover:text-white transition-colors"
              >
                Why Traigent
              </Link>
              <Link
                to="/pricing"
                className="text-slate-300 hover:text-white transition-colors"
              >
                Pricing
              </Link>
              <Dropdown
                label="Resources"
                items={resourcesItems}
                isOpen={openMenu === "resources"}
                onOpen={() => setOpenMenu("resources")}
                onClose={() => setOpenMenu(null)}
                onScroll={scrollOrNavigate}
              />
              <a
                href="#"
                onClick={scrollOrNavigate("contact")}
                className="text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Contact Us
              </a>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-3 sm:gap-4">
              <a
                href="https://github.com/Traigent/Traigent"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("github_clicked", { location: "topnav" })}
                className="text-slate-400 hover:text-white transition-colors hidden sm:flex"
                title="GitHub"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://portal.traigent.ai"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("sign_in_clicked", { location: "topnav" })}
                className="text-sm text-slate-300 hover:text-white transition-colors hidden sm:inline"
              >
                Sign in
              </a>
              <button
                onClick={() => {
                  trackEvent("start_now_clicked", { location: "topnav" });
                  setShowStartNow(true);
                }}
                className="border border-slate-600 hover:border-slate-400 text-slate-200 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
              >
                Start Now
              </button>
              <a
                href="https://meetings-eu1.hubspot.com/amir8"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("demo_booking_clicked", { location: "topnav" })}
                className="bg-[#1A6BF5] hover:bg-[#4D8EF8] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
              >
                Book a demo
              </a>
            </div>
          </div>
        </div>
      </nav>
      {showStartNow && <StartNowModal onClose={() => setShowStartNow(false)} />}
    </>
  );
}
