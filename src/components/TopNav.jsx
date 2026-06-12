import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, Github, Menu, X } from "lucide-react";
import StartNowModal from "./StartNowModal";
import PortalGateModal from "./PortalGateModal";
import BrandMark from "./BrandMark";
import { trackEvent } from "../lib/analytics";
import { listAllForAdmin } from "../lib/recipientPackages";
import {
  isUnlocked,
  markUnlocked,
  getUnlockedEmail,
  shouldNotifyForGate,
} from "../lib/startNowGate";
import { notifyPortalRepeat } from "../lib/hubspotForms";
import { hasAcceptedCurrent } from "../lib/accessAgreement";
import { checkKnownContact } from "../lib/hubspotIdentify";

const PORTAL_URL = "https://portal.traigent.ai";
const DEMO_URL = "https://meetings-eu1.hubspot.com/amir8";

// Hidden access point: presentations menu behind the obscure ▸ glyph in the
// far-right of the nav. Each item opens the scroll-mode deck in a new tab
// with a different ?range= filter (see PitchShort2.jsx).
const PITCH_DECK_OPTIONS = [
  {
    label: "Extended product presentation",
    desc: "Full product deck + live demo (no investor section)",
    href: "/#/extended-product-presentation",
  },
  {
    label: "Short summary",
    desc: "Slides 1–5 + live demo — the headline arc",
    href: "/#/short-summary",
  },
  {
    label: "Market opportunity",
    desc: "Investor section + live demo",
    href: "/#/market-opportunity",
  },
  {
    label: "Investor presentation",
    desc: "Seed-round narrative · problem → solution → market → team",
    href: "/#/investor-pitch",
  },
  {
    label: "Knob explorer",
    desc: "Configure a search space — knobs, values, combinatorics",
    href: "/#/knob-explorer",
  },
  {
    label: "Optimization Engine (no narration)",
    desc: "Accuracy/Cost Optimization (2-step)",
    href: "/#/demo",
  },
  {
    label: "Agent Optimization Demo (1-min)",
    desc: "Narrated walkthrough · problem → solution → the win",
    href: "/#/story",
  },
  {
    label: "Agent Knobs 101 (3-min read)",
    desc: "Primer · three concrete knobs, what they do, why they matter",
    href: "/#/agent-knobs-101",
  },
  {
    label: "Implementing Agent Knobs (18-min read)",
    desc: "Reference · every knob with effect + code you can paste in",
    href: "/#/implementing-agent-knobs",
  },
];

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
  { label: "Research", href: "/research", desc: "CAIN 2026 paper, TVL, and governed optimization" },
  // Code access is email-gated: Docs routes through /get-started (unlocks the
  // GitHub repo + install command after the visitor leaves an email).
  { label: "Docs", href: "/get-started", desc: "SDK install + GitHub — unlocks with your email" },
  { label: "Academy", href: "/academy", desc: "Short courses for teams shipping AI agents" },
  { label: "About", href: "/about", desc: "Team, mission, values" },
  { label: "Get Started", href: "/get-started" },
  { label: "Value Proposition", href: "/value-proposition" },
  { label: "See It In Action", href: "/see-it-in-action", desc: "Watch Traigent converge live" },
  { label: "Optimization in Action", href: "/optimization-in-action", desc: "Live optimization-table demo · sweep & converge" },
];

// Main top-level tabs (between the Product and Resources dropdowns on desktop;
// shown as a flat list in the mobile drawer). Centralized so the desktop nav
// and mobile drawer stay in sync.
const mainTabs = [
  { label: "The Problem", href: "/value-proposition" },
  { label: "Why Traigent", href: "/blog" },
  { label: "Pricing", href: "/pricing" },
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

// Mobile-drawer link row. Same handling as MenuItem (external / scrollId /
// in-app Link) but tap-friendly sized and self-closes the drawer.
function MobileMenuItem({ item, onClose, onScroll }) {
  const inner = (
    <>
      <div className="text-base text-white font-medium">{item.label}</div>
      {item.desc && <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>}
    </>
  );
  const className = "block px-3 py-3 -mx-3 rounded-lg hover:bg-slate-800 active:bg-slate-800 transition-colors";

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClose}
        className={className}
      >
        {inner}
      </a>
    );
  }
  if (item.scrollId) {
    return (
      <a
        href="#"
        onClick={(e) => { onClose(); onScroll(item.scrollId)(e); }}
        className={className}
      >
        {inner}
      </a>
    );
  }
  return (
    <Link to={item.href} onClick={onClose} className={className}>
      {inner}
    </Link>
  );
}

function MobileSectionLabel({ children }) {
  return (
    <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2 mt-6 first:mt-0">
      {children}
    </div>
  );
}

export default function TopNav() {
  const [openMenu, setOpenMenu] = useState(null);
  const [showStartNow, setShowStartNow] = useState(false);
  const [showPortalGate, setShowPortalGate] = useState(false);

  // Click handler for the "Open portal" CTA. Three paths:
  //   1. Locally unlocked → open portal immediately + silent re-notify
  //   2. Not locally unlocked but recognized as a known HubSpot contact
  //      via the hsutk Worker → mark unlocked + re-notify + open portal
  //   3. Genuinely new visitor → show the gate modal
  // The Worker check is cached for 1h in localStorage so repeat clicks are
  // instant after the first.
  const handleOpenPortal = async (loc) => {
    // Direct open requires BOTH an email unlock AND acceptance of the
    // current Access & Evaluation Agreement; otherwise the gate modal
    // handles whichever step is missing.
    if (isUnlocked() && hasAcceptedCurrent()) {
      const email = getUnlockedEmail();
      if (email && shouldNotifyForGate("portal")) {
        notifyPortalRepeat({ email, location: loc });
      }
      trackEvent("portal_opened", { location: loc });
      window.open(PORTAL_URL, "_blank", "noopener,noreferrer");
      return;
    }
    if (!isUnlocked()) {
      const result = await checkKnownContact();
      if (result && result.known && result.email) {
        markUnlocked(result.email);
        if (shouldNotifyForGate("portal")) notifyPortalRepeat({ email: result.email, location: loc });
        trackEvent("portal_auto_unlocked", { location: loc });
        // Fall through to the gate modal if the agreement is still pending.
        if (hasAcceptedCurrent()) {
          trackEvent("portal_opened", { location: loc });
          window.open(PORTAL_URL, "_blank", "noopener,noreferrer");
          return;
        }
      }
    }
    trackEvent("portal_clicked_gated", { location: loc });
    setShowPortalGate(true);
  };
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pitchMenuOpen, setPitchMenuOpen] = useState(false);
  const pitchMenuRef = useRef(null);
  const [recipientMenuOpen, setRecipientMenuOpen] = useState(false);
  const recipientMenuRef = useRef(null);
  const recipientSections = listAllForAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  // Close the pitch-deck dropdown on outside-click or Escape.
  useEffect(() => {
    if (!pitchMenuOpen) return;
    const onDocClick = (e) => {
      if (pitchMenuRef.current && !pitchMenuRef.current.contains(e.target)) {
        setPitchMenuOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setPitchMenuOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [pitchMenuOpen]);

  // Same outside-click + Escape behavior for the recipient-packages menu.
  useEffect(() => {
    if (!recipientMenuOpen) return;
    const onDocClick = (e) => {
      if (recipientMenuRef.current && !recipientMenuRef.current.contains(e.target)) {
        setRecipientMenuOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setRecipientMenuOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [recipientMenuOpen]);

  // Click handler for in-page anchor scrolling.
  // If we're on the homepage, scrollIntoView directly.
  // If on another framed page, navigate home with a sessionStorage flag
  // so Homepage can scroll after mount.
  const scrollOrNavigate = (id) => (e) => {
    e.preventDefault();
    setOpenMenu(null);
    setMobileOpen(false);
    if (location.pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      sessionStorage.setItem("pendingScroll", id);
      navigate("/");
    }
  };

  // Lock background scroll while the mobile drawer is open, and close on
  // Escape so it follows standard modal a11y conventions.
  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") setMobileOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  // Close the drawer whenever the route changes (e.g. a Link inside the
  // drawer fires; the drawer's own onClick already toggles it but this
  // is a safety net for any indirect navigations).
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#080808]/95 backdrop-blur-md border-b border-slate-800/50 overflow-x-clip">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ width: "100vw" }}>
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
              className="flex items-center leading-none"
              aria-label="Traigent.ai"
            >
              <BrandMark size="sm" />
            </Link>

            {/* Desktop tabs */}
            <div className="hidden lg:flex items-center gap-7 text-sm">
              <Dropdown
                label="Product"
                items={productItems}
                isOpen={openMenu === "product"}
                onOpen={() => setOpenMenu("product")}
                onClose={() => setOpenMenu(null)}
                onScroll={scrollOrNavigate}
              />
              {mainTabs.map((t) => (
                <Link
                  key={t.label}
                  to={t.href}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  {t.label}
                </Link>
              ))}
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

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-3 sm:gap-4">
              {/* Code access is email-gated: the GitHub icon opens the Start
                  Now modal (unlocked visitors see the repo + install command
                  immediately; unknown visitors leave an email first). */}
              <button
                type="button"
                onClick={() => {
                  trackEvent("github_gate_opened", { location: "topnav" });
                  setShowStartNow(true);
                }}
                className="text-slate-400 hover:text-white transition-colors"
                title="Get the SDK (GitHub)"
                aria-label="Get the SDK (GitHub)"
              >
                <Github className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => handleOpenPortal("topnav")}
                className="text-sm text-slate-300 hover:text-white transition-colors whitespace-nowrap"
              >
                Open portal
              </button>
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
                href={DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("demo_booking_clicked", { location: "topnav" })}
                className="bg-[#1A6BF5] hover:bg-[#4D8EF8] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
              >
                Book a demo
              </a>
              {/* Hidden access to the presentations menu. The ▸ glyph is the
                  trigger; right-click toggles a small dropdown of decks, each
                  opening in a new tab. Left-click is intentionally a no-op
                  so the surface stays obscure. */}
              <div className="flex flex-col items-center gap-0 leading-none">
                <div className="relative" ref={pitchMenuRef}>
                  <button
                    type="button"
                    onClick={(e) => e.preventDefault()}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setPitchMenuOpen((v) => !v);
                    }}
                    aria-label="Presentations menu"
                    aria-haspopup="menu"
                    aria-expanded={pitchMenuOpen}
                    title="Presentations"
                    className="text-slate-700 hover:text-slate-200 transition-colors text-base leading-none select-none px-1"
                  >
                    ▸
                  </button>
                  {pitchMenuOpen && (
                    <div
                      role="menu"
                      aria-label="Presentations"
                      className="absolute top-full right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-[60]"
                    >
                      {PITCH_DECK_OPTIONS.map((item) => (
                        <a
                          key={item.href}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          role="menuitem"
                          onClick={() => setPitchMenuOpen(false)}
                          className="block px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                        >
                          <div className="text-sm text-white font-medium">{item.label}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                {/* Second triangle, directly below the first — recipient
                    packages (VC / Channel / Customer). Same right-click
                    gesture, same obscure styling. The dropdown only renders
                    sections that have at least one package in the registry,
                    so empty sections never advertise their existence. */}
                <div className="relative" ref={recipientMenuRef}>
                  <button
                    type="button"
                    onClick={(e) => e.preventDefault()}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setRecipientMenuOpen((v) => !v);
                    }}
                    aria-label="Recipient packages menu"
                    aria-haspopup="menu"
                    aria-expanded={recipientMenuOpen}
                    title="Recipient packages"
                    className="text-slate-700 hover:text-slate-200 transition-colors text-base leading-none select-none px-1"
                  >
                    ▸
                  </button>
                  {recipientMenuOpen && (
                    <div
                      role="menu"
                      aria-label="Recipient packages"
                      className="absolute top-full right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-[60]"
                    >
                      {recipientSections.map((section) => (
                        <div key={section.type} className="mb-2 last:mb-0">
                          <div className="px-3 pt-2 pb-1 text-[10px] font-mono uppercase tracking-widest text-slate-500">
                            {section.label}
                          </div>
                          {section.items.length === 0 ? (
                            <div className="px-3 py-2 text-xs text-slate-600 italic">
                              No packages yet.
                            </div>
                          ) : (
                            section.items.map((item) => (
                              <a
                                key={item.slug}
                                href={`/#/${item.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                role="menuitem"
                                onClick={() => setRecipientMenuOpen(false)}
                                className="block px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                              >
                                <div className="text-sm text-white font-medium">
                                  {item.displayName || item.slug}
                                </div>
                                <div className="text-xs text-slate-400 mt-0.5 flex justify-between gap-2">
                                  <span className="truncate">
                                    {item.internalLabel || `/${item.slug}`}
                                  </span>
                                  {item.dateSent && (
                                    <span className="font-mono text-slate-500 shrink-0">
                                      {item.dateSent}
                                    </span>
                                  )}
                                </div>
                              </a>
                            ))
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile: hamburger only. Drawer below carries all the nav. */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-drawer"
              className="lg:hidden inline-flex items-center justify-center p-2 -mr-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          id="mobile-nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="lg:hidden fixed inset-0 z-[60]"
        >
          {/* Backdrop — button so keyboard users can dismiss via Enter/Space
              in addition to the Escape-to-close handler on the dialog */}
          <button
            type="button"
            aria-label="Close navigation menu"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeMobile}
          />
          {/* Panel */}
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-[#080808] border-l border-slate-800 shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 border-b border-slate-800 flex-shrink-0">
              <Link
                to="/"
                onClick={closeMobile}
                className="flex items-center leading-none"
                aria-label="Traigent.ai"
              >
                <BrandMark size="sm" />
              </Link>
              <button
                type="button"
                onClick={closeMobile}
                aria-label="Close navigation menu"
                className="p-2 -mr-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable nav body */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
              <MobileSectionLabel>Product</MobileSectionLabel>
              {productItems.map((item) => (
                <MobileMenuItem key={item.label} item={item} onClose={closeMobile} onScroll={scrollOrNavigate} />
              ))}

              <MobileSectionLabel>Main</MobileSectionLabel>
              {mainTabs.map((t) => (
                <Link
                  key={t.label}
                  to={t.href}
                  onClick={closeMobile}
                  className="block px-3 py-3 -mx-3 rounded-lg hover:bg-slate-800 active:bg-slate-800 transition-colors text-base text-white font-medium"
                >
                  {t.label}
                </Link>
              ))}
              <a
                href="#"
                onClick={scrollOrNavigate("contact")}
                className="block px-3 py-3 -mx-3 rounded-lg hover:bg-slate-800 active:bg-slate-800 transition-colors text-base text-white font-medium cursor-pointer"
              >
                Contact Us
              </a>

              <MobileSectionLabel>Resources</MobileSectionLabel>
              {resourcesItems.map((item) => (
                <MobileMenuItem key={item.label} item={item} onClose={closeMobile} onScroll={scrollOrNavigate} />
              ))}
            </div>

            {/* CTAs pinned to the bottom */}
            <div className="border-t border-slate-800 px-4 sm:px-6 py-4 flex flex-col gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => { handleOpenPortal("topnav_mobile"); closeMobile(); }}
                className="text-center text-sm text-slate-300 hover:text-white py-2 transition-colors"
              >
                Open portal
              </button>
              <button
                type="button"
                onClick={() => {
                  trackEvent("start_now_clicked", { location: "topnav_mobile" });
                  setShowStartNow(true);
                  closeMobile();
                }}
                className="border border-slate-600 hover:border-slate-400 text-slate-200 hover:text-white py-3 rounded-lg text-sm font-medium transition-colors"
              >
                Start Now
              </button>
              <a
                href={DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => { trackEvent("demo_booking_clicked", { location: "topnav_mobile" }); closeMobile(); }}
                className="bg-[#1A6BF5] hover:bg-[#4D8EF8] text-white py-3 rounded-lg text-sm font-medium text-center transition-colors"
              >
                Book a demo
              </a>
              <button
                type="button"
                onClick={() => { trackEvent("github_gate_opened", { location: "topnav_mobile" }); closeMobile(); setShowStartNow(true); }}
                className="inline-flex items-center justify-center gap-2 text-xs text-slate-500 hover:text-white pt-2 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>Get the SDK (GitHub)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showStartNow && <StartNowModal onClose={() => setShowStartNow(false)} location="topnav" />}
      {showPortalGate && <PortalGateModal onClose={() => setShowPortalGate(false)} location="topnav" />}
    </>
  );
}
