import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight,
  Check,
  Sparkles,
  Eye,
  Zap,
  Github,
  MessageSquare,
} from "lucide-react";
import { trackEvent } from "../lib/analytics";
import StartNowModal from "../components/StartNowModal";

const BLUE = "#1A6BF5";
const BLUE_LIGHT = "#4D8EF8";

// ============================================================================
// Animation helper
// ============================================================================
const FadeIn = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

// ============================================================================
// The two-layer stack visualization that anchors the page
// ============================================================================
function StackDiagram() {
  return (
    <div className="relative max-w-3xl mx-auto">
      {/* Top layer — optimization */}
      <div className="relative bg-gradient-to-br from-[#1A6BF5]/20 to-[#1A6BF5]/5 border-2 border-[#1A6BF5]/60 rounded-2xl p-6 md:p-8 shadow-[0_0_50px_rgba(26,107,245,0.15)] mb-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-[#1A6BF5]/30 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#4D8EF8]" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#4D8EF8]">Layer 2 · Premium — Unique to Traigent</div>
            <h3 className="text-xl md:text-2xl font-bold text-white">Agent Optimization</h3>
          </div>
        </div>
        <ul className="space-y-2 text-sm md:text-base text-slate-300 leading-relaxed pl-13">
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 mt-1 flex-shrink-0 text-[#4D8EF8]" />
            <span><span className="text-white font-semibold">Auto-finds</span> the best cost-performance configuration.</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 mt-1 flex-shrink-0 text-[#4D8EF8]" />
            <span><span className="text-white font-semibold">Multi-KPI weighted</span> optimization.</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 mt-1 flex-shrink-0 text-[#4D8EF8]" />
            <span><span className="text-white font-semibold">Re-optimizes</span> when models, costs, or usage drift.</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 mt-1 flex-shrink-0 text-[#4D8EF8]" />
            <span><span className="text-white font-semibold">Benchmark insights</span> — flag easy / always-fail / redundant test cases so your benchmark <span className="text-white font-semibold">keeps improving</span>.</span>
          </li>
        </ul>
        <p className="text-sm md:text-base text-slate-200 italic leading-relaxed pl-13 mt-3 font-semibold">
          The piece other tooling leaves out.
        </p>
      </div>

      {/* Bottom layer — observability baseline */}
      <div className="relative bg-slate-900/60 border border-slate-700 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
            <Eye className="w-5 h-5 text-slate-300" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Layer 1 · Foundation</div>
            <h3 className="text-xl md:text-2xl font-bold text-white">Observability &amp; Tracing</h3>
          </div>
        </div>
        <p className="text-sm md:text-base text-slate-200 italic leading-relaxed pl-13 mb-3">
          Everything you'd expect from <span className="not-italic font-semibold">Langfuse</span>, <span className="not-italic font-semibold">Arize</span>, or <span className="not-italic font-semibold">Helicone</span> is included in this baseline default layer.
        </p>
        <ul className="space-y-2 text-sm md:text-base text-slate-300 leading-relaxed pl-13">
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 mt-1 flex-shrink-0 text-slate-400" />
            <span><span className="text-white font-semibold">Full trace tree per run</span> &mdash; nested spans, parent/child links, durations.</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 mt-1 flex-shrink-0 text-slate-400" />
            <span><span className="text-white font-semibold">Token, cost, and error capture</span> on every LLM call, tool call, and retrieval.</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 mt-1 flex-shrink-0 text-slate-400" />
            <span><span className="text-white font-semibold">Eval framework</span> &mdash; run agents against datasets, score them, and version the results.</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 mt-1 flex-shrink-0 text-slate-400" />
            <span><span className="text-white font-semibold">Per-environment retention</span>, project isolation, and dashboard exports.</span>
          </li>
        </ul>
      </div>

      {/* Side annotation — where other vendors stop */}
      <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 translate-x-full">
        <div className="flex items-start gap-2 pl-4">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-500 max-w-[120px] leading-tight">
            Other vendors stop at the foundation
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Pricing card
// ============================================================================
function FeatureList({ items, highlight }) {
  return (
    <ul className="space-y-2 mb-1">
      {items.map((f, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-slate-300 min-h-[3.25rem]">
          <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${highlight ? "text-[#4D8EF8]" : "text-slate-500"}`} />
          <span dangerouslySetInnerHTML={{ __html: f }} />
        </li>
      ))}
    </ul>
  );
}

function StackSection({ label, icon: Icon, color, items, highlight }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-3.5 h-3.5" style={{ color }} />
        <span className="text-[10px] font-mono uppercase tracking-widest font-bold" style={{ color }}>
          {label}
        </span>
        <div className="flex-1 h-px bg-slate-800" />
      </div>
      <FeatureList items={items} highlight={highlight} />
    </div>
  );
}

function PricingCard({ tier, price, priceSuffix, summary, observability, optimization, features, cta, highlight = false, badge }) {
  return (
    <div
      className={`relative h-full flex flex-col rounded-2xl p-7 md:p-8 transition-all ${
        highlight
          ? "bg-gradient-to-br from-[#1A6BF5]/15 to-slate-900/40 border-2 border-[#1A6BF5]/60 shadow-[0_0_40px_rgba(26,107,245,0.15)]"
          : "bg-slate-900/40 border border-slate-800"
      }`}
    >
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#1A6BF5] text-white text-[10px] font-mono uppercase tracking-widest font-bold">
          {badge}
        </div>
      )}
      <div className="mb-6">
        <div className="text-sm font-mono uppercase tracking-widest text-slate-400 mb-2">{tier}</div>
        <div className="mb-3 h-[6rem]">
          <div className={`text-4xl md:text-5xl font-extrabold leading-tight ${highlight ? "text-[#4D8EF8]" : "text-white"}`}>{price}</div>
          {priceSuffix && <div className="text-slate-500 text-sm mt-1">{priceSuffix}</div>}
        </div>
        <p className="text-sm text-slate-400 leading-relaxed h-[6rem]">{summary}</p>
      </div>

      <div className="mb-6">
        {cta}
      </div>

      <div className="flex-1">
        {optimization && (
          <StackSection
            label="Optimization"
            icon={Sparkles}
            color="#4D8EF8"
            items={optimization}
            highlight={true}
          />
        )}
        {observability && (
          <StackSection
            label="Observability"
            icon={Eye}
            color="#94a3b8"
            items={observability}
            highlight={false}
          />
        )}
        {features && (
          <StackSection
            label="Security & deployment"
            icon={Zap}
            color="#94a3b8"
            items={features}
            highlight={highlight}
          />
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Feature comparison row
// ============================================================================
function FeatureRow({ label, free, starter, pro, enterprise, section = false }) {
  if (section) {
    return (
      <tr className="border-t border-slate-800">
        <td colSpan="5" className="py-4 text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">{label}</td>
      </tr>
    );
  }
  const render = (v) => {
    if (v === true) return <Check className="w-4 h-4 text-[#4D8EF8] mx-auto" />;
    if (v === false || v === "—") return <span className="text-slate-700">—</span>;
    return <span className="text-slate-300 text-sm">{v}</span>;
  };
  return (
    <tr className="border-t border-slate-900">
      <td className="py-3 pr-4 text-sm text-slate-300">{label}</td>
      <td className="py-3 text-center">{render(free)}</td>
      <td className="py-3 text-center">{render(starter)}</td>
      <td className="py-3 text-center bg-[#1A6BF5]/5">{render(pro)}</td>
      <td className="py-3 text-center">{render(enterprise)}</td>
    </tr>
  );
}

// ============================================================================
// Page
// ============================================================================
export default function Pricing() {
  const [showStartNow, setShowStartNow] = useState(false);
  return (
    <div className="bg-[#080808] text-white min-h-screen">
      <Helmet>
        <title>Pricing · Traigent</title>
        <meta
          name="description"
          content="Built on observability. Powered by optimization. Three tiers: Free open-source, Pro for production teams, Enterprise for scale. Everything Langfuse offers — plus the optimization layer no one else has."
        />
        <meta property="og:title" content="Traigent — Pricing" />
        <meta
          property="og:description"
          content="Observability is the baseline. Optimization is the premium. Pricing that reflects the stack."
        />
      </Helmet>

      {/* ===== Stack diagram ===== */}
      <section className="border-b border-slate-900 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-12">
              <div className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-3">The Traigent Stack</div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3" style={{ textWrap: "balance" }}>
                Two layers. One platform. Priced as one.{" "}
                <a
                  href="#tiers"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("tiers")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="text-[#4D8EF8] hover:text-white underline underline-offset-4 decoration-[#4D8EF8]/50 hover:decoration-white transition-colors"
                >
                  Pick your tier.
                </a>
              </h2>
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <StackDiagram />
          </FadeIn>
        </div>
      </section>

      {/* ===== Pricing tiers ===== */}
      <section id="tiers" className="border-b border-slate-900 py-16 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-3" style={{ textWrap: "balance" }}>
              Pick your tier.
            </h2>
            <p className="text-slate-400 text-center mb-6 max-w-2xl mx-auto">
              Optimization and Observability in every plan.
            </p>
            {/* Pricing-anchor callout — the key positioning claim: matches competitor pricing, but you get the optimization layer free */}
            <div className="max-w-3xl mx-auto mb-12 bg-gradient-to-br from-blue-500/10 to-slate-900/0 border-2 rounded-2xl p-5 md:p-6 text-center" style={{ borderColor: `${BLUE}66` }}>
              <p className="text-base md:text-lg leading-relaxed font-semibold" style={{ color: "#4D8EF8", textWrap: "balance" }}>
                The Agent Optimization layer is included in every tier.
              </p>
              <p className="text-base md:text-lg text-slate-200 mt-3 leading-relaxed" style={{ textWrap: "balance" }}>
                But, prices are comparable to observability / eval products that{" "}
                <span className="text-white font-semibold">do not have optimization</span>.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {/* ===== FREE ===== */}
            <FadeIn delay={0}>
              <PricingCard
                tier="Free"
                price="$0"
                priceSuffix="per month"
                summary="Local / OSS SDK plus a scoped non-production POC of the full optimization suite."
                observability={[
                  "Full trace tree · spans · tokens · costs",
                  "Eval framework",
                  "<strong>10K observations / month</strong>",
                  "7-day data retention",
                  "1 project · 1 user · non-production",
                  "Community support",
                ]}
                optimization={[
                  "<strong class=\"text-white\">Scoped POC · 1 agent · 1 team</strong>",
                  "Full optimization suite (time-boxed pilot)",
                  "Multi-KPI weighted optimization",
                  "Drift detection &amp; re-optimization",
                  "Benchmark insights",
                ]}
                cta={
                  <button
                    type="button"
                    onClick={() => {
                      trackEvent("pricing_cta_clicked", { tier: "free" });
                      setShowStartNow(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 w-full h-12 bg-[#1A6BF5] hover:bg-[#4D8EF8] text-white px-5 rounded-lg font-medium transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    Start free on GitHub
                  </button>
                }
              />
            </FadeIn>

            {/* ===== STARTER ===== */}
            <FadeIn delay={0.05}>
              <PricingCard
                tier="Starter"
                price="$99"
                priceSuffix="per month"
                summary="For one team optimizing one agent. Plus observability volumes as defined."
                observability={[
                  "<strong>100K observations / month</strong>",
                  "30-day retention",
                  "3 projects · up to 3 users",
                  "Eval framework",
                  "Email support",
                ]}
                optimization={[
                  "<strong class=\"text-white\">Ongoing · 1 agent · 1 team</strong> (post-POC, no time limit)",
                  "Full optimization suite (unlimited runs)",
                  "Multi-KPI weighted optimization",
                  "Drift detection &amp; re-optimization",
                  "Benchmark insights · saved run history",
                ]}
                cta={
                  <a
                    href="https://meetings-eu1.hubspot.com/amir8"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent("pricing_cta_clicked", { tier: "starter" })}
                    className="inline-flex items-center justify-center gap-2 w-full h-12 bg-[#1A6BF5] hover:bg-[#4D8EF8] text-white px-5 rounded-lg font-medium transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Talk to sales
                  </a>
                }
              />
            </FadeIn>

            {/* ===== PRO ===== */}
            <FadeIn delay={0.1}>
              <PricingCard
                tier="Pro"
                price="$249"
                priceSuffix="per month"
                summary="Full observability volume plus the complete optimization suite. Up to 5 agents · 5 teams."
                badge="Most popular"
                highlight
                observability={[
                  "<strong>1M observations / month</strong> (org-wide; overages billed)",
                  "90-day retention",
                  "Unlimited projects · up to 10 users",
                  "Eval framework",
                  "Email + Slack support",
                ]}
                optimization={[
                  "<strong class=\"text-white\">Up to 5 agents · 5 teams</strong>",
                  "Full optimization suite + priority compute",
                  "Multi-KPI weighted optimization",
                  "Drift detection &amp; re-optimization (continuous, automated)",
                  "<strong class=\"text-[#4D8EF8]\">Premium benchmark insights</strong> (flag easy/fail/redundant)",
                ]}
                cta={
                  <a
                    href="https://meetings-eu1.hubspot.com/amir8"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent("pricing_cta_clicked", { tier: "pro" })}
                    className="inline-flex items-center justify-center gap-2 w-full h-12 bg-[#1A6BF5] hover:bg-[#4D8EF8] text-white px-5 rounded-lg font-medium transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Talk to sales
                  </a>
                }
              />
            </FadeIn>

            {/* ===== ENTERPRISE ===== */}
            <FadeIn delay={0.15}>
              <PricingCard
                tier="Enterprise"
                price="Let's talk."
                summary="For high-volume, regulated, or on-prem deployments. Custom terms."
                observability={[
                  "<strong>Custom observation volume</strong> (org-wide)",
                  "Custom retention",
                  "Custom projects · custom users",
                  "Eval framework",
                  "Dedicated solutions engineer",
                ]}
                optimization={[
                  "<strong class=\"text-white\">Custom agents · custom teams</strong>",
                  "Full optimization suite + priority compute",
                  "Multi-KPI weighted optimization",
                  "Drift detection &amp; re-optimization (continuous, automated)",
                  "<strong class=\"text-[#4D8EF8]\">Premium benchmark insights</strong> (flag easy/fail/redundant)",
                ]}
                cta={
                  <a
                    href="https://meetings-eu1.hubspot.com/amir8"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent("pricing_cta_clicked", { tier: "enterprise" })}
                    className="inline-flex items-center justify-center gap-2 w-full h-12 bg-[#1A6BF5] hover:bg-[#4D8EF8] text-white px-5 rounded-lg font-medium transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Talk to sales
                  </a>
                }
              />
            </FadeIn>
          </div>

          {/* ROI callout */}
          <FadeIn delay={0.3}>
            <div className="mt-12 max-w-3xl mx-auto bg-slate-900/40 border border-slate-800 rounded-2xl p-6 text-center">
              <Link
                to="/roi"
                className="inline-flex items-center gap-1 text-[#4D8EF8] hover:text-[#1A6BF5] text-sm font-medium transition-colors"
              >
                Run the ROI calculator for your numbers <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== Feature comparison table ===== */}
      <section className="border-b border-slate-900 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-3" style={{ textWrap: "balance" }}>
              What's in each tier
            </h2>
            <p className="text-slate-400 text-center mb-6">
              Observability rows are the Langfuse/Helicone baseline. Optimization rows are Traigent-only.
            </p>
            {/* Observation unit definition — pinned just above the table */}
            <div className="max-w-3xl mx-auto mb-10 bg-slate-900/40 border border-slate-800 rounded-xl p-4 text-sm text-slate-300">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#4D8EF8] block mb-1">Observation</span>
              An <span className="text-white font-semibold">observation</span> is one captured span in a trace &mdash; a single LLM call, tool call, retrieval, or eval score logged by the SDK. A typical agent turn produces 3&ndash;10 observations. Limits are measured org-wide and reset monthly; overages on Pro are billed at $0.10 per 1K. Enterprise plans negotiate custom volume.
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left py-3 pr-4 text-sm font-mono uppercase tracking-wider text-slate-500">Feature</th>
                    <th className="py-3 text-center text-sm font-mono uppercase tracking-wider text-slate-400">Free</th>
                    <th className="py-3 text-center text-sm font-mono uppercase tracking-wider text-slate-400">Starter</th>
                    <th className="py-3 text-center text-sm font-mono uppercase tracking-wider text-[#4D8EF8] bg-[#1A6BF5]/5">Pro</th>
                    <th className="py-3 text-center text-sm font-mono uppercase tracking-wider text-slate-400">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  <FeatureRow label="Observability foundation" section />
                  <FeatureRow label="Full trace tree (spans, tokens, costs)" free starter pro enterprise />
                  <FeatureRow label="Eval framework" free starter pro enterprise />
                  <FeatureRow label="Observations / month" free="10K" starter="100K" pro="1M (org)" enterprise="Custom" />
                  <FeatureRow label="Data retention" free="7 days" starter="30 days" pro="90 days" enterprise="Custom" />
                  <FeatureRow label="Projects" free="1" starter="3" pro="Unlimited" enterprise="Custom" />

                  <FeatureRow label="Optimization layer (Traigent-only)" section />
                  <FeatureRow label="Access" free="Scoped POC" starter="Ongoing" pro="Ongoing" enterprise="Ongoing" />
                  <FeatureRow label="Agents" free="1" starter="1" pro="Up to 5" enterprise="Custom" />
                  <FeatureRow label="Teams" free="1" starter="1" pro="Up to 5" enterprise="Custom" />
                  <FeatureRow label="Single-KPI optimization" free={true} starter={true} pro={true} enterprise={true} />
                  <FeatureRow label="Multi-KPI weighted optimization" free={true} starter={true} pro={true} enterprise={true} />
                  <FeatureRow label="Drift detection &amp; re-optimization" free={true} starter={true} pro={true} enterprise={true} />
                  <FeatureRow label="Benchmark insights (easy/fail/redundant)" free={true} starter="—" pro={true} enterprise={true} />
                  <FeatureRow label="TVL — Tuned Variables Language" free={true} starter={true} pro={true} enterprise={true} />

                  <FeatureRow label="Team &amp; security" section />
                  <FeatureRow label="Users" free="1" starter="Up to 3" pro="Up to 10" enterprise="Custom" />
                  <FeatureRow label="SSO" free="—" starter="—" pro="—" enterprise={true} />
                  <FeatureRow label="Audit logs" free="—" starter="—" pro="—" enterprise={true} />
                  <FeatureRow label="SLA" free="—" starter="—" pro="—" enterprise={true} />
                  <FeatureRow label="Custom deployment (VPC, on-prem)" free="—" starter="—" pro="—" enterprise={true} />

                  <FeatureRow label="Support" section />
                  <FeatureRow label="Support channel" free="Community" starter="Email" pro="Email + Slack" enterprise="Dedicated SE" />
                  <FeatureRow label="Outcome-based pricing" free="—" starter="—" pro="—" enterprise={true} />
                </tbody>
              </table>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="border-b border-slate-900 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Pricing FAQ</h2>
          </FadeIn>
          <div className="space-y-6">
            {[
              {
                q: "How is this different from Langfuse, Arize, Helicone, LangSmith, or Braintrust?",
                a: "Those tools cover the observability and eval layer. Some now include prompt-version comparison or single-axis tuning. <em>None</em> of them automate the full multi-variable cost-quality search across <strong>model · prompt · retrieval · tools · constraints · drift</strong> — that's Traigent's optimization loop. The Pro tier roughly matches what you'd pay them for observability alone, applied to a platform that also runs the optimization on top.",
              },
              {
                q: "How are optimization runs metered?",
                a: "They're not. The wrapper runs locally in your infrastructure — we don't charge per run. You pay a flat fee, run as much as you want.",
              },
              {
                q: "What if I outgrow Pro's 10 users?",
                a: "Talk to sales. Enterprise has unlimited users and a few features Pro doesn't (SSO, audit logs, SLA). Pricing is negotiated.",
              },
              {
                q: "Do you offer outcome-based pricing?",
                a: "Yes, on Enterprise. We can structure a portion of the fee tied to measured LLM cost savings beyond a baseline. This works best when you have a stable baseline to measure against.",
              },
              {
                q: "Can we self-host?",
                a: "Yes — Enterprise only. We support VPC peering, private cloud, and on-prem deployment for compliance-sensitive teams.",
              },
              {
                q: "Is there a free trial of Pro?",
                a: "We typically offer a 2–4 week scoped pilot for teams evaluating Pro or Enterprise. Book a 15-min call and we'll scope it together.",
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={0.05 * i}>
                <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
                  <h3 className="text-white font-semibold mb-2">{item.q}</h3>
                  <p
                    className="text-slate-400 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: item.a }}
                  />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Final CTA ===== */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <Zap className="w-10 h-10 text-[#4D8EF8] mx-auto mb-5" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ textWrap: "balance" }}>
              Not sure which tier fits?
            </h2>
            <p className="text-slate-400 mb-8 max-w-2xl mx-auto" style={{ textWrap: "balance" }}>
              15 minutes. We'll look at your stack, your spend, your team — and tell you which tier makes sense. No upsell pressure, no commitment.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://meetings-eu1.hubspot.com/amir8"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("demo_booking_clicked", { location: "pricing_final" })}
                className="inline-flex items-center gap-2 bg-[#1A6BF5] hover:bg-[#4D8EF8] text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Book a 15-min call <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                to="/roi"
                className="inline-flex items-center gap-2 border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Run the ROI calculator
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
      {showStartNow && <StartNowModal onClose={() => setShowStartNow(false)} location="pricing" />}
    </div>
  );
}
