import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Github, X, ArrowRight } from "lucide-react";
import InstallCommand from "./InstallCommand";

const productItems = [
  { label: "Optimization Engine", href: "/#product", desc: "Picks next best config from run history" },
  { label: "Agent Wrapper", href: "/#product", desc: "Automated execution + KPI capture" },
  { label: "Observability & Tracing", href: "/#capabilities", desc: "Full trace tree · spans · tokens · cost" },
  { label: "Benchmark Insights", href: "/#capabilities", desc: "Flags easy / always-fail / redundant questions" },
  { label: "TVL", href: "https://www.tvl-lang.org/", external: true, desc: "Tuned Variables Language" },
];

const resourcesItems = [
  { label: "Get Started", href: "/get-started" },
  { label: "One Pager", href: "/one-pager" },
  { label: "Value Proposition", href: "/value-proposition" },
  { label: "For Investors", href: "/investors" },
];

function NavLink({ children, ...props }) {
  return (
    <a
      {...props}
      className="text-slate-300 hover:text-white transition-colors"
    >
      {children}
    </a>
  );
}

function MenuItem({ item }) {
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
  if (item.href.startsWith("/#") || item.href.includes("#")) {
    return <a href={item.href} className={className}>{content}</a>;
  }
  return <Link to={item.href} className={className}>{content}</Link>;
}

function Dropdown({ label, items, isOpen, onOpen, onClose }) {
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
              <MenuItem key={item.label} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StartNowModal({ onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="start-now-title"
        className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full p-8"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 id="start-now-title" className="text-2xl font-bold text-white mb-2">Start Now</h2>
        <p className="text-slate-400 mb-6">
          Run the keyless demo on your laptop in under a minute — no API keys, no LLM provider calls, no spend.
        </p>

        <InstallCommand
          command='uv tool install "traigent[recommended]" && traigent quickstart'
          secondary="No API keys. No LLM provider calls. No spend. Just python. (Have pip instead? `pip install` works too.)"
        />

        <div className="flex flex-wrap gap-3 mt-6">
          <a
            href="https://github.com/Traigent/Traigent"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-[#1A6BF5] hover:bg-[#4D8EF8] text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
          >
            <Github className="mr-2 h-4 w-4" />
            View on GitHub
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function TopNav() {
  const [openMenu, setOpenMenu] = useState(null);
  const [showStartNow, setShowStartNow] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#080808]/95 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center text-xl font-bold text-white">
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
              />
              <Link to="/value-proposition" className="text-slate-300 hover:text-white transition-colors">
                Use Cases
              </Link>
              <NavLink href="/#customers">Customers</NavLink>
              <NavLink href="https://github.com/Traigent/Traigent" target="_blank" rel="noopener noreferrer">
                Docs
              </NavLink>
              <NavLink href="https://portal.traigent.ai/pricing" target="_blank" rel="noopener noreferrer">
                Pricing
              </NavLink>
              <Dropdown
                label="Resources"
                items={resourcesItems}
                isOpen={openMenu === "resources"}
                onOpen={() => setOpenMenu("resources")}
                onClose={() => setOpenMenu(null)}
              />
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-3 sm:gap-4">
              <a
                href="https://github.com/Traigent/Traigent"
                target="_blank"
                rel="noopener noreferrer"
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
                className="text-sm text-slate-300 hover:text-white transition-colors hidden sm:inline"
              >
                Sign in
              </a>
              <button
                onClick={() => setShowStartNow(true)}
                className="border border-slate-600 hover:border-slate-400 text-slate-200 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
              >
                Start Now
              </button>
              <a
                href="https://calendar.app.google/VLcx8bnYahw37jva9"
                target="_blank"
                rel="noopener noreferrer"
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
