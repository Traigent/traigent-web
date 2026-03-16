import { useEffect, useState } from "react";
import { ArrowRight, ExternalLink, FlaskConical } from "lucide-react";
import { track } from "../lib/analytics";
import LogomarkBadge from "../components/LogomarkBadge";
import SiteHeader from "../components/SiteHeader";

const LOGOMARK_BASE = `${import.meta.env.BASE_URL}images/logomarks`;
const TRAIGENT_LOGO_MARK = `${import.meta.env.BASE_URL}images/traigent-logo-icon.png`;

const pilotMetrics = [
  {
    label: "Behavior Reliability",
    value: "Add validated metric",
    detail: "Example: +X% acceptance pass rate on production-like evals",
  },
  {
    label: "Regression Prevention",
    value: "Add validated metric",
    detail: "Example: Y risky changes blocked by gates before release",
  },
  {
    label: "Engineering Velocity",
    value: "Add validated metric",
    detail: "Example: -Z% cycle time from change request to safe rollout",
  },
];

const designPartners = ["Design Partner 1", "Design Partner 2", "Design Partner 3"];
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
    symbol: "ECO",
    tone: "cyan",
    entity: "Traigent / ECO",
    label: "ICSE 2025 Paper",
    title: "ECO (Exploration Configuration Optimization) at ICSE 2025",
    detail:
      "Configuration optimization problem framed with Pareto-efficient tradeoffs for AI-enabled systems.",
    href: "https://ieeexplore.ieee.org/abstract/document/11023950/",
  },
  {
    date: "2025 (MLOps Community)",
    symbol: "TVL",
    tone: "cyan",
    entity: "Traigent",
    label: "MLOps Production Talk",
    title: "Traigent presents agent tuning in production",
    detail:
      "Public talk introducing tuned variables and agent behavior engineering in production workflows.",
    href: "https://youtu.be/--le-yBdVPk?si=Eypk3O04B6d_5Cb4&t=38",
    logoSrc: TRAIGENT_LOGO_MARK,
  },
  {
    date: "September 2025",
    symbol: "TVL",
    tone: "cyan",
    entity: "Traigent",
    label: "Close Beta Launch",
    title: "Traigent close beta released",
    detail:
      "Design partners start applying specification-driven tuning loops in real engineering workflows.",
    logoSrc: TRAIGENT_LOGO_MARK,
  },
  {
    date: "December 2025",
    symbol: "AN",
    tone: "violet",
    entity: "Anthropic",
    label: "Bloom Release",
    title: "Anthropic publishes Bloom",
    detail: "Bloom introduces automated behavioral evaluations as an open-source framework.",
    href: "https://www.anthropic.com/research/bloom",
    logoSrc: `${LOGOMARK_BASE}/anthropic.svg`,
  },
  {
    date: "December 2025",
    symbol: "NV",
    tone: "emerald",
    entity: "NVIDIA",
    label: "NeMo Convergence",
    title: "NVIDIA NeMo adds configuration optimization",
    detail:
      "Large platform releases start converging on configuration optimization as a core capability.",
    logoSrc: `${LOGOMARK_BASE}/nvidia.svg`,
  },
  {
    date: "CAIN 2026",
    symbol: "TVL",
    tone: "cyan",
    entity: "Traigent / TVL",
    label: "CAIN Acceptance",
    title: "TVL accepted at IEEE/ACM CAIN 2026",
    detail:
      "Governed Configuration for AI-Enabled Systems: Maintaining Tuned Variables in CI/CD.",
    href: "https://conf.researchr.org/details/cain-2026/cain-2026-call-for-papers/22/Governed-Configuration-for-AI-Enabled-Systems-Maintaining-Tuned-Variables-in-CI-CD",
    logoSrc: TRAIGENT_LOGO_MARK,
  },
];

const SectionHeader = ({ children }) => (
  <div className="bg-blue-500 text-white font-bold text-xl md:text-2xl px-6 py-3 rounded-lg mb-4">
    {children}
  </div>
);

export default function OnePager() {
  const [activeTimelineIndex, setActiveTimelineIndex] = useState(null);

  useEffect(() => {
    const previousTitle = document.title;
    const descriptionContent =
      "Traigent defines specification-driven agent engineering with TVL, a new behavior specification aligned with IEEE/ACM CAIN'26.";

    document.title = "Traigent One-Pager | Specification-Driven Agent Engineering";

    let descriptionMeta = document.querySelector('meta[name="description"]');
    const previousDescription = descriptionMeta?.getAttribute("content") ?? "";

    if (!descriptionMeta) {
      descriptionMeta = document.createElement("meta");
      descriptionMeta.setAttribute("name", "description");
      document.head.appendChild(descriptionMeta);
    }

    descriptionMeta.setAttribute("content", descriptionContent);

    return () => {
      document.title = previousTitle;
      descriptionMeta?.setAttribute("content", previousDescription);
    };
  }, []);

  const activeTimelineEvent =
    activeTimelineIndex === null ? null : convergenceTimeline[activeTimelineIndex];
  const activeTimelinePointerLeft =
    activeTimelineIndex === null
      ? "50%"
      : `${((activeTimelineIndex + 0.5) / convergenceTimeline.length) * 100}%`;
  const timelineHighlights = [
    { symbol: "ECO", label: "ICSE'25", tone: "cyan" },
    {
      symbol: "AN",
      label: "Bloom Dec'25",
      tone: "violet",
      logoSrc: `${LOGOMARK_BASE}/anthropic.svg`,
    },
    {
      symbol: "NV",
      label: "NeMo Dec'25",
      tone: "emerald",
      logoSrc: `${LOGOMARK_BASE}/nvidia.svg`,
    },
    { symbol: "TVL", label: "CAIN'26", tone: "cyan", logoSrc: TRAIGENT_LOGO_MARK },
  ];

  const getTimelineMarkerClasses = (tone, isActive, hasLogo = false) => {
    const activeClasses = {
      cyan: "border-cyan-200 bg-cyan-300 text-slate-950 shadow-[0_0_0_4px_rgba(34,211,238,0.18)]",
      violet: "border-violet-200 bg-violet-300 text-slate-950 shadow-[0_0_0_4px_rgba(167,139,250,0.2)]",
      emerald: "border-emerald-200 bg-emerald-300 text-slate-950 shadow-[0_0_0_4px_rgba(52,211,153,0.2)]",
      amber: "border-amber-200 bg-amber-300 text-slate-950 shadow-[0_0_0_4px_rgba(251,191,36,0.2)]",
      slate: "border-slate-200 bg-slate-300 text-slate-950 shadow-[0_0_0_4px_rgba(148,163,184,0.2)]",
    };

    const idleClasses = {
      cyan: "border-cyan-500/60 bg-white dark:bg-slate-900 text-cyan-700 dark:text-cyan-200 hover:border-cyan-300",
      violet:
        "border-violet-500/60 bg-white dark:bg-slate-900 text-violet-700 dark:text-violet-200 hover:border-violet-300",
      emerald:
        "border-emerald-500/60 bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-200 hover:border-emerald-300",
      amber:
        "border-amber-500/60 bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-200 hover:border-amber-300",
      slate: "border-slate-500/60 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-slate-300",
    };

    const activeLogoClasses = {
      cyan: "border-cyan-300 bg-white text-slate-900 shadow-[0_0_0_4px_rgba(34,211,238,0.18)]",
      violet:
        "border-violet-300 bg-white text-slate-900 shadow-[0_0_0_4px_rgba(167,139,250,0.2)]",
      emerald:
        "border-emerald-300 bg-white text-slate-900 shadow-[0_0_0_4px_rgba(52,211,153,0.2)]",
      amber: "border-amber-300 bg-white text-slate-900 shadow-[0_0_0_4px_rgba(251,191,36,0.2)]",
      slate: "border-slate-300 bg-white text-slate-900 shadow-[0_0_0_4px_rgba(148,163,184,0.2)]",
    };

    const idleLogoClasses = {
      cyan: "border-cyan-500/60 bg-white text-slate-900 hover:border-cyan-300",
      violet: "border-violet-500/60 bg-white text-slate-900 hover:border-violet-300",
      emerald: "border-emerald-500/60 bg-white text-slate-900 hover:border-emerald-300",
      amber: "border-amber-500/60 bg-white text-slate-900 hover:border-amber-300",
      slate: "border-slate-500/60 bg-white text-slate-900 hover:border-slate-300",
    };

    const active = hasLogo
      ? (activeLogoClasses[tone] ?? activeLogoClasses.cyan)
      : (activeClasses[tone] ?? activeClasses.cyan);
    const idle = hasLogo
      ? (idleLogoClasses[tone] ?? idleLogoClasses.cyan)
      : (idleClasses[tone] ?? idleClasses.cyan);
    return isActive ? active : idle;
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <SiteHeader className="mb-10" />

        {/* Top Signal */}
        <section className="mb-8">
          <div className="rounded-2xl border border-cyan-400/30 bg-gradient-to-r from-cyan-50 via-white to-indigo-50 px-4 py-4 md:px-5 md:py-5 dark:from-slate-900 dark:to-slate-800">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <FlaskConical className="w-5 h-5 text-cyan-300 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-slate-900 dark:text-slate-100">
                    <span className="inline-flex items-center gap-2 font-semibold">
                      <img
                        src={TRAIGENT_LOGO_MARK}
                        alt="Traigent"
                        className="h-4 w-4 object-contain"
                        loading="lazy"
                      />
                      TVL accepted at IEEE/ACM CAIN 2026.
                    </span>{" "}
                    <span className="text-slate-700 dark:text-slate-300">
                      Specification-driven agent engineering with peer-reviewed grounding.
                    </span>
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {timelineHighlights.map((item) => (
                      <LogomarkBadge
                        key={`${item.symbol}-${item.label}`}
                        mark={item.symbol}
                        label={item.label}
                        tone={item.tone}
                        logoSrc={item.logoSrc}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <a
                href="#research-trajectory"
                className="inline-flex items-center justify-center rounded-lg border border-cyan-300/40 bg-cyan-300/10 px-3 py-2 text-sm font-semibold text-cyan-700 dark:text-cyan-200 hover:bg-cyan-300/20"
              >
                Explore trajectory
              </a>
            </div>
          </div>
        </section>

        {/* Company Overview */}
        <section className="mb-10">
          <SectionHeader>Thesis: Agent Engineering Needs a Compiler Moment</SectionHeader>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            Agent behavior is no longer only coded. It is tuned across instructions, retrieval, tools, and
            policies. Most workflows still treat this like configuration edits. Traigent brings software
            engineering discipline to that reality: define{" "}
            <strong>what must hold</strong> in a machine-checkable specification, then optimize{" "}
            <strong>how to achieve it</strong> with governed experiments and release gates. This is a discipline
            layer for agent engineering, not another standalone feature tool.
          </p>
        </section>

        {/* The Insight */}
        <section className="mb-10">
          <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-50 via-white to-indigo-50 p-6 md:p-8 dark:from-cyan-950/40 dark:to-slate-900">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300 mb-3">
              The foundational insight
            </p>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-snug mb-4">
              You are not configuring agents.{" "}
              <span className="text-cyan-300">You are training them.</span>
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-5">
              Every prompt edit, model swap, retrieval change, and policy update reshapes behavior
              probabilistically. This is not deployment. It is a statistical training loop with no
              specification, no regression gates, and no reproducibility. We were the first to name this
              reality and build for it.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4">
                <p className="text-xs text-red-400 font-semibold uppercase tracking-wide mb-2">Before compilers</p>
                <p className="text-slate-700 dark:text-slate-300 text-sm font-mono">
                  Write machine instructions. Hope they work. Debug by reading hex dumps.
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-cyan-500/30 p-4">
                <p className="text-xs text-cyan-300 font-semibold uppercase tracking-wide mb-2">Before Traigent</p>
                <p className="text-slate-700 dark:text-slate-300 text-sm font-mono">
                  Edit prompts. Hope behavior holds. Debug by re-reading logs.
                </p>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-4">
              Compilers gave software engineering a specification layer that made intent explicit, checkable, and
              scalable. Traigent does the same for agent engineering: specification-driven, peer-reviewed,
              statistically rigorous.
            </p>
          </div>
        </section>

        {/* Problem & Solution Side by Side */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* The Problem */}
          <section className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-red-500/30">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={`${import.meta.env.BASE_URL}images/robot-error.png`}
                alt="AI Agent Error"
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h2 className="text-red-400 font-bold text-xl md:text-2xl">Today&apos;s Failure Mode</h2>
                <p className="text-slate-600 dark:text-slate-400 text-xs">Agent behavior changes faster than teams can govern it</p>
              </div>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <span className="text-red-400 text-sm flex-shrink-0">✗</span>
                <p className="text-slate-800 dark:text-slate-200 text-sm">
                  <strong>Hidden training loop:</strong> Every change reshapes behavior, but teams review it like static code.
                </p>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400 text-sm flex-shrink-0">✗</span>
                <p className="text-slate-800 dark:text-slate-200 text-sm">
                  <strong>Under-specified intent:</strong> Requirements live in docs and people, not enforceable artifacts.
                </p>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400 text-sm flex-shrink-0">✗</span>
                <p className="text-slate-800 dark:text-slate-200 text-sm">
                  <strong>Disconnected tooling:</strong> Prompt tools, eval dashboards, and cost views do not produce one release decision.
                </p>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400 text-sm flex-shrink-0">✗</span>
                <p className="text-slate-800 dark:text-slate-200 text-sm">
                  <strong>Risky shipping:</strong> Teams push changes without reproducible evidence that behavior improved.
                </p>
              </li>
            </ul>
          </section>

          {/* The Solution */}
          <section className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-emerald-500/30">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={`${import.meta.env.BASE_URL}images/robot-happy.png`}
                alt="Optimized AI Agent"
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h2 className="text-slate-900 dark:text-white font-bold text-xl md:text-2xl">Traigent Approach</h2>
                <p className="text-slate-600 dark:text-slate-400 text-xs">Specification-driven statistical software engineering</p>
              </div>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 text-sm flex-shrink-0">✓</span>
                <p className="text-slate-800 dark:text-slate-200 text-sm">
                  <strong>Specification first:</strong> TVL defines tunables, objectives, and hard constraints.
                </p>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 text-sm flex-shrink-0">✓</span>
                <p className="text-slate-800 dark:text-slate-200 text-sm">
                  <strong>Disciplined loop:</strong> Specify, evaluate, optimize, and apply on representative workloads.
                </p>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 text-sm flex-shrink-0">✓</span>
                <p className="text-slate-800 dark:text-slate-200 text-sm">
                  <strong>Governed release:</strong> Changes ship only when they beat baseline and satisfy constraints.
                </p>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 text-sm flex-shrink-0">✓</span>
                <p className="text-slate-800 dark:text-slate-200 text-sm">
                  <strong>Peer-reviewable evidence:</strong> Every trial and decision is tracked, auditable, and reproducible.
                </p>
              </li>
            </ul>
          </section>
        </div>

        {/* Category Definition */}
        <section className="mb-10">
          <SectionHeader>We Are Defining a New Engineering Category</SectionHeader>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-5">
            Existing tools solve fragments of the problem: one rewrites prompts, another benchmarks models, another
            tracks cost. None of them treat agent behavior as a{" "}
            <strong className="text-slate-900 dark:text-white">governed statistical system</strong> that requires specification,
            evaluation, optimization, and release gates as a single discipline. Traigent does.
          </p>

          {/* Tuned Variables callout */}
          <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-5 mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300 mb-2">
              A concept we gave birth to
            </p>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Tuned Variables &amp; TVL
            </h4>
            <p className="text-slate-700 dark:text-slate-300 text-sm">
              We identified that agent decisions (instructions, retrieval depth, model routing, policy thresholds)
              are not static configuration. They are{" "}
              <strong className="text-slate-900 dark:text-white">tuned variables</strong> that shape behavior probabilistically and
              must be governed like compiled artifacts. TVL is the first specification language for this reality,
              now peer-reviewed and accepted at IEEE/ACM CAIN 2026.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
              <p className="text-xs text-red-400 font-semibold mb-2">Prompt tools say</p>
              <p className="text-slate-900 dark:text-white font-bold mb-2">&quot;Rewrite this prompt&quot;</p>
              <p className="text-slate-700 dark:text-slate-300 text-sm">
                Prompts are one tuned variable. Optimizing them in isolation ignores the system.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
              <p className="text-xs text-red-400 font-semibold mb-2">Model selectors say</p>
              <p className="text-slate-900 dark:text-white font-bold mb-2">&quot;Switch to this model&quot;</p>
              <p className="text-slate-700 dark:text-slate-300 text-sm">
                Model choice is one tuned variable. Without constraints and evals, switching is guessing.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
              <p className="text-xs text-red-400 font-semibold mb-2">FinOps dashboards say</p>
              <p className="text-slate-900 dark:text-white font-bold mb-2">&quot;You spent too much&quot;</p>
              <p className="text-slate-700 dark:text-slate-300 text-sm">
                Cost is one constraint. Governing it means trading off against quality, latency, and safety together.
              </p>
            </div>
          </div>
          <p className="text-cyan-700 dark:text-cyan-200 text-sm font-semibold mt-4">
            Traigent governs the full decision surface. The what, not the how.
          </p>
        </section>

        {/* The Discipline In Practice */}
        <section className="mb-10">
          <SectionHeader>How The Discipline Works In Practice</SectionHeader>
          <div className="relative">
            {/* Flow Diagram */}
            <div className="flex flex-col md:grid md:grid-cols-7 gap-4 items-center">
              {/* Input Box */}
              <div className="w-full md:col-span-2 rounded-xl border border-slate-300 bg-slate-100 p-5 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-blue-400 text-lg">📥</span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Input</h4>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                    Behavior specification (TVL, IEEE/ACM CAIN&apos;26)
                  </li>
                  <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                    Representative workload and acceptance evals
                  </li>
                  <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                    Quality, safety, latency, and budget constraints
                  </li>
                </ul>
              </div>

              {/* Arrow 1 */}
              <div className="flex justify-center">
                <ArrowRight className="w-6 h-6 text-blue-400 rotate-90 md:rotate-0" />
              </div>

              {/* Center - Traigent Engine */}
              <div className="w-full md:col-span-1 flex justify-center">
                <div className="relative">
                  <div className="w-24 h-24 flex items-center justify-center">
                    <img
                      src={`${import.meta.env.BASE_URL}images/traigent-logo-icon.png`}
                      alt="Traigent"
                      className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                    />
                  </div>
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="text-xs text-blue-400 font-semibold">TRAIGENT</span>
                  </div>
                </div>
              </div>

              {/* Arrow 2 */}
              <div className="flex justify-center">
                <ArrowRight className="w-6 h-6 text-emerald-400 rotate-90 md:rotate-0" />
              </div>

              {/* Output Box */}
              <div className="w-full md:col-span-2 rounded-xl border border-emerald-500/30 bg-slate-100 p-5 dark:bg-slate-800">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-emerald-400 text-lg">📤</span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Output</h4>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                    Validated policy update (not a blind tweak)
                  </li>
                  <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                    Frontier tradeoffs and decision rationale
                  </li>
                  <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                    CI gates and reproducible run history
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Pilot Results */}
        <section className="mb-10">
          <SectionHeader>Pilot Results & Design Partners</SectionHeader>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            Replace placeholders below with validated outcomes and customer-approved references.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {pilotMetrics.map((metric) => (
              <div key={metric.label} className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">{metric.label}</p>
                <p className="text-slate-900 dark:text-white font-bold text-lg mb-2">{metric.value}</p>
                <p className="text-slate-700 dark:text-slate-300 text-sm">{metric.detail}</p>
              </div>
            ))}
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 mb-6">
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">Pilot quote placeholder</p>
            <blockquote className="text-slate-800 dark:text-slate-200 italic">
              &quot;Insert one customer-approved sentence describing measurable impact and deployment confidence.&quot;
            </blockquote>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {designPartners.map((partner) => (
              <div
                key={partner}
                className="h-20 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center"
              >
                <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">{partner}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Personas */}
        <section className="mb-10">
          <SectionHeader>Who It&apos;s For</SectionHeader>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
            <div>
              <p className="text-slate-800 dark:text-slate-200">
                <strong>AI Platform and ML Engineers:</strong> Ship agent changes with enforceable specs and release gates.
              </p>
            </div>
            <div>
              <p className="text-slate-800 dark:text-slate-200">
                <strong>Product and Ops Teams:</strong> Define business outcomes as measurable constraints and acceptance criteria.
              </p>
            </div>
            <div>
              <p className="text-slate-800 dark:text-slate-200">
                <strong>QA and Evaluation Teams:</strong> Turn behavioral requirements into repeatable, audited eval gates.
              </p>
            </div>
            <div>
              <p className="text-slate-800 dark:text-slate-200">
                <strong>Engineering Leaders:</strong> Approve releases with peer-reviewable evidence, rollback safety, and traceability.
              </p>
            </div>
          </div>
        </section>

        {/* POC */}
        <section className="mb-10">
          <SectionHeader>POC Program</SectionHeader>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">Before (Day 0-1)</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Customer inputs:</p>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 text-sm">
                <li>Current workflow, target use cases, and known failure patterns</li>
                <li>Behavior goals, constraints, and acceptance thresholds</li>
                <li>Representative workloads and baseline release criteria</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">POC (Week 1)</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Execution:</p>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 text-sm">
                <li>Map workflow to explicit tunables, objectives, and hard constraints</li>
                <li>Run specification-driven evaluation and governed optimization loop</li>
                <li>Joint review of frontier options, failures, and release recommendations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">After (End of Week 1)</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Deliverables:</p>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 text-sm">
                <li>Specification package and CI gate definitions for your workflow</li>
                <li>Baseline versus improved behavior scorecard with failure analysis</li>
                <li>TVL behavior specification template aligned with IEEE/ACM CAIN&apos;26 framing</li>
                <li>Rollout and rollback plan with measurable success criteria</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Research Trajectory */}
        <section id="research-trajectory" className="mb-10 scroll-mt-24">
          <SectionHeader>Research Trajectory: We Published First</SectionHeader>
          <p className="text-slate-700 dark:text-slate-300">
            Traigent framed configuration optimization for AI-enabled systems at{" "}
            <strong className="text-slate-900 dark:text-white">ICSE 2025</strong>, the premier software engineering venue.
            Months later, Anthropic (Bloom) and NVIDIA (NeMo) arrived at the same conclusion independently.
            This is not coincidence. It is validation that specification-driven agent engineering is the
            direction the field is converging on, and we are ahead.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {cainSupporters.map((org) => (
              <LogomarkBadge
                key={org.label}
                mark={org.mark}
                label={org.label}
                tone={org.tone}
                logoSrc={org.logoSrc}
                className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              />
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 md:p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-cyan-300 font-semibold">
              Click A Milestone Dot
            </p>

            {/* Desktop timeline */}
            <div className="relative mt-5 hidden md:block">
              <div className="absolute left-6 right-6 top-5 h-px bg-gradient-to-r from-cyan-300/20 via-cyan-300/80 to-cyan-300/20" />
              <div
                className="grid gap-2"
                style={{ gridTemplateColumns: `repeat(${convergenceTimeline.length}, minmax(0, 1fr))` }}
              >
                {convergenceTimeline.map((item, index) => {
                  const isActive = index === activeTimelineIndex;

                  return (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => setActiveTimelineIndex(isActive ? null : index)}
                      className="relative pt-1 pb-2 text-center"
                      aria-pressed={isActive}
                    >
                      <div
                        className={`mx-auto inline-flex h-8 w-8 items-center justify-center rounded-full border-2 text-[10px] font-bold transition ${getTimelineMarkerClasses(item.tone, isActive, Boolean(item.logoSrc))}`}
                      >
                        {item.logoSrc ? (
                          <img
                            src={item.logoSrc}
                            alt=""
                            className="h-full w-full object-contain p-[4px]"
                            loading="lazy"
                          />
                        ) : (
                          item.symbol
                        )}
                      </div>
                      <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-300">
                        {item.date}
                      </p>
                      <p
                        className={`mt-1 text-sm font-semibold transition ${
                          isActive
                            ? "text-slate-900 dark:text-white"
                            : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                        }`}
                      >
                        {item.label}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile timeline */}
            <div className="mt-4 grid gap-2 md:hidden">
              {convergenceTimeline.map((item, index) => {
                const isActive = index === activeTimelineIndex;

                return (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => setActiveTimelineIndex(isActive ? null : index)}
                    className={`rounded-xl border px-3 py-2 text-left transition ${
                      isActive
                        ? "border-cyan-300/60 bg-cyan-300/10"
                        : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-cyan-300/40"
                    }`}
                    aria-pressed={isActive}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full border text-[9px] font-bold leading-none ${getTimelineMarkerClasses(item.tone, isActive, Boolean(item.logoSrc))}`}
                      >
                        {item.logoSrc ? (
                          <img
                            src={item.logoSrc}
                            alt=""
                            className="h-full w-full object-contain p-[3px]"
                            loading="lazy"
                          />
                        ) : (
                          item.symbol
                        )}
                      </span>
                      <span className="text-xs font-semibold text-cyan-300">{item.date}</span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">{item.label}</p>
                  </button>
                );
              })}
            </div>

            {activeTimelineEvent ? (
              <div className="relative mt-4">
                <div
                  className="hidden md:block absolute -top-2 h-4 w-4 border-l border-t border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950"
                  style={{
                    left: activeTimelinePointerLeft,
                    transform: "translateX(-50%) rotate(45deg)",
                  }}
                />
                <div className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-300">
                        {activeTimelineEvent.date}
                      </p>
                      <h4 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{activeTimelineEvent.title}</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTimelineIndex(null)}
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 transition hover:border-slate-500 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:text-white"
                    >
                      Close
                    </button>
                  </div>

                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{activeTimelineEvent.detail}</p>
                  <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1">
                    <span
                      className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full border text-[9px] font-bold ${getTimelineMarkerClasses(activeTimelineEvent.tone, false, Boolean(activeTimelineEvent.logoSrc))}`}
                    >
                      {activeTimelineEvent.logoSrc ? (
                        <img
                          src={activeTimelineEvent.logoSrc}
                          alt=""
                          className="h-full w-full object-contain p-[3px]"
                          loading="lazy"
                        />
                      ) : (
                        activeTimelineEvent.symbol
                      )}
                    </span>
                    <span className="text-xs text-slate-700 dark:text-slate-300">{activeTimelineEvent.entity}</span>
                  </div>

                  {activeTimelineEvent.href ? (
                    <a
                      href={activeTimelineEvent.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-cyan-700 dark:text-cyan-300 hover:text-cyan-800 dark:hover:text-cyan-200"
                    >
                      View source
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-slate-600 dark:text-slate-500">
                      Internal milestone
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                Click any dot to open details.
              </p>
            )}
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-500 mt-3">
            Conference supporter names are referenced for context only and do not imply endorsement, partnership, or
            affiliation.
          </p>
        </section>

        {/* Contact */}
        <section className="mb-10">
          <SectionHeader>Contact</SectionHeader>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Achi Solomon | Co-founder, CEO</p>
              <p className="text-slate-700 dark:text-slate-300">
                <a href="mailto:achi@traigent.ai" className="text-indigo-400 hover:underline">achi@traigent.ai</a>
                {" | "}
                <a href="https://linkedin.com/in/achisolomon" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">LinkedIn</a>
              </p>
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Dr. Nimrod Busany | Co-founder, CTO</p>
              <p className="text-slate-700 dark:text-slate-300">
                <a href="mailto:nimrod@traigent.ai" className="text-indigo-400 hover:underline">nimrod@traigent.ai</a>
                {" | "}
                <a href="https://linkedin.com/in/nimrodbusany" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">LinkedIn</a>
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="https://cal.com/nimrod-busany"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("cta_click", { location: "one_pager", target: "book_demo" })}
            className="group relative inline-flex items-center bg-blue-500 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:bg-blue-600 hover:scale-105 shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_40px_rgba(59,130,246,0.8)] overflow-hidden"
          >
            {/* Animated shine effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></span>

            <span className="relative z-10 flex items-center">
              Book a 30-minute engineering fit call
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </a>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-3">
            Typical next step: define one concrete workflow and map it into a specification-driven pilot.
          </p>
        </div>
      </div>
    </div>
  );
}
