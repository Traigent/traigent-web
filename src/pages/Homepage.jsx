import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  FlaskConical,
  GaugeCircle,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { Link } from "react-router-dom";
import { track } from "../lib/analytics";
import LogomarkBadge from "../components/LogomarkBadge";
import SiteHeader from "../components/SiteHeader";

const LOGOMARK_BASE = `${import.meta.env.BASE_URL}images/logomarks`;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const fadeGroup = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const trustedStack = [
  { mark: "OA", label: "OpenAI", tone: "emerald" },
  {
    mark: "AN",
    label: "Anthropic",
    tone: "violet",
    logoSrc: `${LOGOMARK_BASE}/anthropic.svg`,
  },
  { mark: "G", label: "Google AI", tone: "cyan", logoSrc: `${LOGOMARK_BASE}/google.svg` },
  {
    mark: "LC",
    label: "LangChain",
    tone: "indigo",
    logoSrc: `${LOGOMARK_BASE}/langchain.svg`,
  },
  { mark: "PC", label: "Pinecone", tone: "cyan" },
  {
    mark: "PG",
    label: "Postgres",
    tone: "slate",
    logoSrc: `${LOGOMARK_BASE}/postgresql.svg`,
  },
];

const cainSupporters = [
  { mark: "ACM", label: "ACM", tone: "cyan", logoSrc: `${LOGOMARK_BASE}/acm.svg` },
  {
    mark: "S",
    label: "ACM SIGSOFT",
    tone: "cyan",
    logoSrc: `${LOGOMARK_BASE}/acm.svg`,
  },
  {
    mark: "IEEE",
    label: "IEEE Computer Society",
    tone: "indigo",
    logoSrc: `${LOGOMARK_BASE}/ieee.svg`,
  },
  {
    mark: "TCSE",
    label: "IEEE-CS TCSE",
    tone: "indigo",
    logoSrc: `${LOGOMARK_BASE}/ieee.svg`,
  },
];

const convergenceTimeline = [
  {
    date: "May 2025",
    title: "ECO (Exploration Configuration Optimization) at ICSE 2025",
    detail:
      "Configuration optimization problem framed with Pareto-efficient tradeoffs for AI-enabled systems.",
    href: "https://ieeexplore.ieee.org/abstract/document/11023950/",
  },
  {
    date: "2025 (MLOps Community)",
    title: "Traigent presents agent tuning in production",
    detail:
      "Public talk introducing tuned variables and agent behavior engineering in production workflows.",
    href: "https://youtu.be/--le-yBdVPk?si=Eypk3O04B6d_5Cb4&t=38",
  },
  {
    date: "September 2025",
    title: "Traigent close beta released",
    detail:
      "Design partners start applying specification-driven tuning loops in real engineering workflows.",
  },
  {
    date: "December 2025",
    title: "NVIDIA NeMo adds configuration optimization",
    detail:
      "Large platform releases start converging on configuration optimization as a core capability.",
  },
  {
    date: "CAIN 2026",
    title: "TVL accepted at IEEE/ACM CAIN 2026",
    detail:
      "Governed Configuration for AI-Enabled Systems: Maintaining Tuned Variables in CI/CD.",
    href: "https://conf.researchr.org/details/cain-2026/cain-2026-call-for-papers/22/Governed-Configuration-for-AI-Enabled-Systems-Maintaining-Tuned-Variables-in-CI-CD",
  },
];

const valueCards = [
  {
    title: "Ship without regression roulette",
    description:
      "Every change is scored against your real workloads before merge. Bad tradeoffs fail fast in CI.",
    metric: "Regression gates in every PR",
    icon: ShieldCheck,
  },
  {
    title: "Optimize for business, not vanity metrics",
    description:
      "Tune prompts, routing, retrieval, and models against your objectives: quality, cost, latency, and policy boundaries.",
    metric: "Pareto-ranked configs, not guesswork",
    icon: GaugeCircle,
  },
  {
    title: "Keep behavior reproducible",
    description:
      "Specs, trials, and applied configs stay versioned so rollbacks are instant and audit trails stay clear.",
    metric: "Deterministic release history",
    icon: FileCheck2,
  },
];

const workflowSteps = [
  {
    step: "01",
    title: "Specify",
    description:
      "Declare tunables, objectives, and hard constraints in TVL next to your code.",
  },
  {
    step: "02",
    title: "Evaluate",
    description:
      "Run production-like tasks and score outcomes on quality, cost, latency, and safety.",
  },
  {
    step: "03",
    title: "Optimize",
    description:
      "Search the configuration space and compare tradeoffs on an explicit frontier.",
  },
  {
    step: "04",
    title: "Apply",
    description:
      "Promote only winning configs and keep full run history for reproducibility.",
  },
];

const useCases = [
  {
    title: "Support Agent Ops",
    description:
      "Stabilize answer quality while staying under strict per-ticket cost ceilings.",
    highlight: "Protect CSAT and gross margin",
  },
  {
    title: "Sales Assistant Workflows",
    description:
      "Tune routing and retrieval depth to increase conversion without increasing latency.",
    highlight: "Faster responses, better win-rate",
  },
  {
    title: "Internal Copilot Governance",
    description:
      "Enforce compliance and red-team constraints before any model or prompt update rolls out.",
    highlight: "Safer releases across teams",
  },
];

const governancePoints = [
  "Config and run history in source control",
  "CI gate templates for GitHub Actions",
  "Cost, latency, and safety budgets as hard constraints",
  "Fast rollback to known-good configs",
];

const buttonStyles = {
  primary:
    "inline-flex items-center justify-center rounded-xl bg-cyan-300 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-200",
  secondary:
    "inline-flex items-center justify-center rounded-xl border border-cyan-200/40 bg-white/5 px-6 py-3 text-base font-semibold text-cyan-100 transition hover:bg-white/10",
  ghost:
    "inline-flex items-center justify-center rounded-xl border border-slate-200 px-6 py-3 text-base font-semibold text-slate-800 transition hover:border-cyan-300 hover:text-cyan-700 dark:border-slate-700 dark:text-slate-100 dark:hover:text-cyan-300",
};

function CtaLink({
  to,
  href,
  eventName,
  eventProps,
  className,
  children,
  newTab = false,
}) {
  const handleClick = () => {
    track(eventName, eventProps);
  };

  if (to) {
    return (
      <Link to={to} className={className} onClick={handleClick}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={className}
      onClick={handleClick}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  );
}

function SectionHeading({ kicker, title, subtitle, invert = false }) {
  const kickerTone = invert ? "text-cyan-300" : "text-cyan-600";
  const titleTone = invert ? "text-slate-50" : "text-slate-900 dark:text-slate-100";
  const subtitleTone = invert ? "text-slate-300" : "text-slate-600 dark:text-slate-300";

  return (
    <div className="max-w-3xl">
      <p
        className={`mb-3 text-sm font-semibold uppercase tracking-[0.18em] ${kickerTone}`}
      >
        {kicker}
      </p>
      <h2 className={`mb-4 text-3xl font-semibold md:text-4xl ${titleTone}`}>
        {title}
      </h2>
      <p className={`text-lg ${subtitleTone}`}>{subtitle}</p>
    </div>
  );
}

export default function Homepage() {
  return (
    <div className="bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,198,189,0.35),transparent_45%),radial-gradient(circle_at_80%_-5%,rgba(42,127,255,0.55),transparent_42%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(2,6,23,0.96)_20%,rgba(2,6,23,0.86)_70%,rgba(2,6,23,0.7)_100%)]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8 lg:pb-24 lg:pt-10">
          <SiteHeader variant="inverse" className="mb-14" />

          <div className="grid items-start gap-14 lg:grid-cols-[1.08fr_0.92fr]">
            <motion.div
              variants={fadeGroup}
              initial="hidden"
              animate="show"
              className="max-w-2xl"
            >
              <motion.p
                variants={fadeUp}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-200/30 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100"
              >
                <Sparkles className="h-4 w-4" />
                Spec - Evaluate - Optimize - Apply
              </motion.p>

              <motion.h1
                variants={fadeUp}
                className="mb-6 text-4xl font-semibold leading-tight text-slate-50 md:text-6xl"
              >
                Ship agent changes with engineering discipline.
              </motion.h1>

              <motion.p variants={fadeUp} className="mb-8 text-lg text-slate-200 md:text-xl">
                Traigent turns prompts, models, retrieval, and policy tuning into a
                measurable release workflow. Define your intent in TVL, gate every
                pull request on real evals, and ship only configurations that win on
                your business metrics.
              </motion.p>

              <motion.div variants={fadeUp} className="mb-8 flex flex-wrap gap-3">
                <CtaLink
                  to={"/get-started"}
                  eventName="cta_click"
                  eventProps={{ location: "hero", target: "get_started" }}
                  className={buttonStyles.primary}
                >
                  Start with TVL + SDK
                  <ArrowRight className="ml-2 h-4 w-4" />
                </CtaLink>

                <CtaLink
                  href="https://cal.com/nimrod-busany"
                  newTab
                  eventName="cta_click"
                  eventProps={{ location: "hero", target: "request_demo" }}
                  className={buttonStyles.secondary}
                >
                  Request enterprise demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </CtaLink>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="grid gap-3 text-sm text-cyan-50/90 sm:grid-cols-2"
              >
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                  CI gates for quality, cost, latency, and safety
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                  No dashboard lock-in, works from your codebase
                </p>
                <p className="flex items-center gap-2 sm:col-span-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                  Reproducible runs and one-click rollback path
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-[0_35px_80px_rgba(2,6,23,0.55)] backdrop-blur"
            >
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm font-medium text-cyan-100">Release Gate Summary</p>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                  Merge approved
                </span>
              </div>

              <div className="space-y-4 rounded-2xl border border-slate-700 bg-slate-950 p-5">
                {[
                  { name: "Answer quality", value: "+9.2%", state: "pass" },
                  { name: "Cost per call", value: "-27%", state: "pass" },
                  { name: "P95 latency", value: "890ms", state: "pass" },
                  { name: "Policy violations", value: "0", state: "pass" },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between border-b border-slate-800 pb-3 last:border-b-0 last:pb-0"
                  >
                    <span className="text-sm text-slate-300">{item.name}</span>
                    <span className="text-sm font-semibold text-emerald-300">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm text-cyan-50">
                Winning config promoted from trial <span className="font-semibold">#142</span>{" "}
                after 120 evaluations.
              </div>
            </motion.div>

            {/* Merge Rejected card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-[0_35px_80px_rgba(2,6,23,0.55)] backdrop-blur"
            >
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm font-medium text-cyan-100">Release Gate Summary</p>
                <span className="rounded-full bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-400">
                  Merge rejected
                </span>
              </div>

              <div className="space-y-4 rounded-2xl border border-slate-700 bg-slate-950 p-5">
                {[
                  { name: "Answer quality", value: "+3.1%", state: "pass" },
                  { name: "Cost per call", value: "+18%", state: "fail" },
                  { name: "P95 latency", value: "2,340ms", state: "pass" },
                  { name: "Policy violations", value: "3", state: "fail" },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between border-b border-slate-800 pb-3 last:border-b-0 last:pb-0"
                  >
                    <span className="text-sm text-slate-300">{item.name}</span>
                    <span className={`text-sm font-semibold ${item.state === "fail" ? "text-red-400" : "text-emerald-300"}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm">
                <div className="flex items-start gap-2 text-red-300">
                  <span className="mt-0.5 shrink-0">&#10007;</span>
                  <span><span className="font-semibold">Cost inefficiency:</span> cost per call increased 18% vs. baseline, exceeding the 5% budget constraint.</span>
                </div>
                <div className="flex items-start gap-2 text-red-300">
                  <span className="mt-0.5 shrink-0">&#10007;</span>
                  <span><span className="font-semibold">Policy violation:</span> 3 responses failed the safety guardrail on trial <span className="font-semibold">#87</span>.</span>
                </div>
              </div>

              <div className="mt-3 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-200">
                <span className="font-semibold">Recommendation:</span> trial <span className="font-semibold">#91</span> passed all constraints with comparable quality (+8.4%). Consider promoting that configuration instead.
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-6 dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto grid max-w-7xl items-center gap-4 px-4 text-center sm:px-6 md:grid-cols-[auto_1fr] md:text-left lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Built for modern AI stacks
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-slate-600 dark:text-slate-300 md:justify-start">
            {trustedStack.map((item) => (
              <LogomarkBadge
                key={item.label}
                mark={item.mark}
                label={item.label}
                tone={item.tone}
                logoSrc={item.logoSrc}
                className="border-slate-300/70 bg-white dark:border-slate-700 dark:bg-slate-900"
                labelClassName="text-slate-700 dark:text-slate-200"
                markClassName="border-slate-300/80 text-slate-700 dark:border-slate-700 dark:text-slate-200"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50 py-8 dark:border-slate-700 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-start gap-3">
              <FlaskConical className="mt-0.5 h-5 w-5 flex-shrink-0 text-cyan-700" />
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                  Conference Context
                </p>
                <p className="text-slate-800 dark:text-slate-100">
                  TVL was accepted to IEEE/ACM CAIN 2026.
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  CAIN 2026 conference supporters include:
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {cainSupporters.map((org) => (
                <LogomarkBadge
                  key={org.label}
                  mark={org.mark}
                  label={org.label}
                  tone={org.tone}
                  logoSrc={org.logoSrc}
                  className="border-slate-300/70 bg-slate-50 dark:border-slate-700 dark:bg-slate-900"
                  labelClassName="text-slate-700 dark:text-slate-200"
                  markClassName="border-slate-300/80 text-slate-700 dark:border-slate-700 dark:text-slate-200"
                />
              ))}
            </div>

            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
              Supporter names are referenced for conference context only and do not imply endorsement of Traigent.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-10 dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            kicker="Independent Convergence"
            title="Aligned with frontier research direction"
            subtitle="A clear sequence of milestones showing we were early on specification-driven agent behavior engineering."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {convergenceTimeline.map((item) => (
              <article key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-950">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">{item.date}</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.detail}</p>
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-cyan-700 hover:text-cyan-800"
                  >
                    Source
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    Internal milestone
                  </p>
                )}
              </article>
            ))}
          </div>

          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            This timeline is shared for technical context and does not imply endorsement, partnership, or affiliation.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            kicker="Why Teams Switch"
            title="Prompting is easy. Controlled release engineering is hard."
            subtitle="Traigent gives teams a repeatable way to improve agent behavior without breaking production guardrails."
          />

          <motion.div
            variants={fadeGroup}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-10 grid gap-5 md:grid-cols-3"
          >
            {valueCards.map((card) => {
              const Icon = card.icon;
              return (
                <motion.article
                  key={card.title}
                  variants={fadeUp}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="mb-4 inline-flex rounded-xl bg-cyan-100 p-2 text-cyan-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-slate-100">{card.title}</h3>
                  <p className="mb-4 text-slate-600 dark:text-slate-300">{card.description}</p>
                  <p className="text-sm font-semibold text-cyan-700">{card.metric}</p>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-20 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            kicker="How It Works"
            title="A release loop for agent behavior"
            subtitle="From requirements to production rollout in four explicit steps."
          />

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {workflowSteps.map((item) => (
              <div
                key={item.step}
                className="relative rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950"
              >
                <p className="mb-4 text-sm font-semibold text-cyan-700">Step {item.step}</p>
                <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-7xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionHeading
              kicker="Workflow Preview"
              title="One decorator, full optimization cycle"
              subtitle="Keep your existing stack. Attach Traigent, run evaluation sweeps, and apply the winning configuration."
            />

            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="mb-3 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Bot className="h-4 w-4 text-cyan-600" />
                `support_agent.py`
              </div>
              <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-sm text-cyan-100">
{`@traigent.optimize(
  objectives=["answer_quality", "cost_per_call"],
  constraints=["p95_latency_ms <= 1200", "policy_violations == 0"],
  eval_dataset="support_eval.jsonl"
)
def answer_customer(question: str) -> str:
  config = traigent.get_config()
  return run_agent(question, config)`}
              </pre>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h3 className="mb-6 text-xl font-semibold text-slate-900 dark:text-slate-100">Current experiment snapshot</h3>
            <div className="space-y-4">
              {[
                {
                  label: "Evaluated configurations",
                  value: "120",
                  icon: FlaskConical,
                  tone: "text-emerald-600",
                },
                {
                  label: "Quality target attainment",
                  value: "96%",
                  icon: Workflow,
                  tone: "text-cyan-700",
                },
                {
                  label: "Cost improvement",
                  value: "-27%",
                  icon: GaugeCircle,
                  tone: "text-indigo-700",
                },
              ].map((metric) => {
                const Icon = metric.icon;
                return (
                  <div
                    key={metric.label}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
                  >
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Icon className={`h-4 w-4 ${metric.tone}`} />
                      <span>{metric.label}</span>
                    </div>
                    <span className={`font-semibold ${metric.tone}`}>{metric.value}</span>
                  </div>
                );
              })}
            </div>

            <CtaLink
              href="https://cal.com/nimrod-busany"
              newTab
              eventName="cta_click"
              eventProps={{ location: "workflow", target: "talk_to_team" }}
              className={`${buttonStyles.ghost} mt-6 w-full`}
            >
              Talk to the team
              <ArrowRight className="ml-2 h-4 w-4" />
            </CtaLink>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            kicker="Use Cases"
            title="Built for teams already running real workloads"
            subtitle="Traigent fits where mistakes are expensive and iteration speed matters."
          />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {useCases.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950"
              >
                <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
                <p className="mb-4 text-slate-600 dark:text-slate-300">{item.description}</p>
                <p className="text-sm font-semibold text-cyan-700">{item.highlight}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-slate-950 p-8 text-white md:p-12">
            <SectionHeading
              kicker="Enterprise Ready"
              title="Governance and speed in the same workflow"
              subtitle="Run controlled optimization loops while preserving clear audit and rollback paths."
              invert
            />

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {governancePoints.map((point) => (
                <p key={point} className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 className="h-5 w-5 text-cyan-300" />
                  {point}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-300 py-16 dark:from-cyan-600 dark:via-indigo-700 dark:to-violet-700">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-semibold text-slate-950 dark:text-white md:text-4xl">
            Make your next agent release evidence-backed.
          </h2>
          <p className="mx-auto mb-8 max-w-3xl text-lg text-slate-800 dark:text-slate-100">
            Start with TVL and CI gates this week. Expand into full governed
            optimization as your agent surface area grows.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <CtaLink
              to={"/get-started"}
              eventName="cta_click"
              eventProps={{ location: "final_cta", target: "get_started" }}
              className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-6 py-3 text-base font-semibold text-white transition hover:bg-slate-800"
            >
              Get started
              <ArrowRight className="ml-2 h-4 w-4" />
            </CtaLink>
            <CtaLink
              href="https://cal.com/nimrod-busany"
              newTab
              eventName="cta_click"
              eventProps={{ location: "final_cta", target: "book_demo" }}
              className="inline-flex items-center justify-center rounded-xl border border-slate-950/20 bg-white px-6 py-3 text-base font-semibold text-slate-900 transition hover:bg-slate-100 dark:border-white/30 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
            >
              Book demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </CtaLink>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-10 dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 text-sm text-slate-600 dark:text-slate-300 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} Traigent Ltd. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-5">
            <Link
              to={"/manifesto"}
              className="transition hover:text-cyan-700"
              onClick={() => track("footer_click", { target: "manifesto" })}
            >
              Manifesto
            </Link>
            <Link
              to={"/get-started"}
              className="transition hover:text-cyan-700"
              onClick={() => track("footer_click", { target: "get_started" })}
            >
              Get started
            </Link>
            <a
              href="https://www.tvl-lang.org/getting-started/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-cyan-700"
              onClick={() => track("footer_click", { target: "tvl_docs" })}
            >
              TVL docs
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
