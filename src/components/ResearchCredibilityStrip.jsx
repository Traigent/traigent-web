import { Braces, ExternalLink, FileText, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { researchLinks, researchPaper, tvlLinks } from "../content/research";
import { trackEvent } from "../lib/analytics";

const badges = [
  {
    label: "Peer-reviewed research",
    detail: researchPaper.venue,
    href: researchLinks.cainPaper,
    icon: FileText,
  },
  {
    label: "Co-located with ICSE",
    detail: "CAIN 2026 / ICSE 2026",
    href: researchLinks.cainHome,
    icon: GraduationCap,
  },
  {
    label: "Formal specification",
    detail: "TVL language",
    href: tvlLinks.home,
    icon: Braces,
  },
];

const variantStyles = {
  dark: {
    shell: "text-white",
    eyebrow: "text-blue-300",
    body: "text-slate-300",
    card: "border-white/10 bg-slate-950/60 hover:border-blue-400/50 hover:bg-slate-900/80",
    icon: "bg-blue-500/15 text-blue-300",
    label: "text-white",
    detail: "text-slate-400",
    note: "text-slate-500",
    cta: "border-white/10 text-slate-200 hover:border-white/25 hover:text-white",
  },
  light: {
    shell: "text-slate-950",
    eyebrow: "text-blue-700",
    body: "text-slate-600",
    card: "border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-white",
    icon: "bg-blue-100 text-blue-700",
    label: "text-slate-950",
    detail: "text-slate-600",
    note: "text-slate-500",
    cta: "border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-950",
  },
};

export default function ResearchCredibilityStrip({ variant = "light", compact = false }) {
  const styles = variantStyles[variant] || variantStyles.light;

  return (
    <section className={`${styles.shell} ${compact ? "py-4" : "py-5 md:py-6"}`}>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.34fr)_minmax(0,0.66fr)] lg:items-center">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${styles.eyebrow}`}>
            Research-backed AI engineering
          </p>
          <p className={`mt-2 text-sm leading-6 ${styles.body}`}>
            Traigent connects product engineering with peer-reviewed work on governed tuned
            variables, CI/CD evidence, and formal agent specifications.
          </p>
          {!compact && (
            <Link
              to="/research"
              onClick={() =>
                trackEvent("research_credibility_strip_click", { destination: "/research" })
              }
              className={`mt-4 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${styles.cta}`}
            >
              See research
            </Link>
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {badges.map(({ label, detail, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent("research_credibility_badge_click", {
                  label,
                  destination: href,
                })
              }
              className={`group rounded-lg border p-4 transition-colors ${styles.card}`}
            >
              <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg ${styles.icon}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className={`text-sm font-semibold ${styles.label}`}>{label}</div>
              <div className={`mt-1 flex items-center gap-1 text-xs leading-5 ${styles.detail}`}>
                {detail}
                <ExternalLink className="h-3 w-3 opacity-70 transition-opacity group-hover:opacity-100" />
              </div>
            </a>
          ))}
        </div>
      </div>
      <p className={`mt-4 text-xs leading-5 ${styles.note}`}>
        Organization and conference names are used for factual identification only; no endorsement
        or sponsorship is implied.
      </p>
    </section>
  );
}
