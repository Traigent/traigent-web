// ===================================================================
// PitchInvestor — 11-slide React mirror of the canonical investor deck.
//
// Source (verbatim):
//   https://docs.google.com/presentation/d/12wWQlc_2rZir_VgDzyxZ7NndatmTI9J8YekjbevWwHs/
//
// Native copies preserved alongside this port:
//   D:\2026 job search\TRAIGENT-AI\investor-deck-source\pitch-deck-2026-06.pptx
//   D:\2026 job search\TRAIGENT-AI\investor-deck-source\pitch-deck-2026-06.pdf
//   D:\2026 job search\TRAIGENT-AI\investor-deck-source\pitch-deck-2026-06-source.md
//
// This page reproduces the source deck slide-for-slide so the conversation
// can iterate from a faithful baseline. Slide images live in
// /public/investor-deck/ and are 1:1 exports from the PPTX media.
// ===================================================================
import { Helmet } from "react-helmet-async";
import { PitchDeck } from "./PitchFull";
import { useKnownContactNotify } from "../lib/useKnownContactNotify";
import { notifyPitchDeckViewed } from "../lib/hubspotForms";
import { usePageView } from "../lib/usePageView";

const BLUE = "#1A6BF5";
const AMBER = "#f59e0b";
const VIOLET = "#a78bfa";
const RED = "#ef4444";

// Tiny shared helpers ------------------------------------------------
function SectionEyebrow({ children }) {
  return (
    <div className="text-sm md:text-base font-mono uppercase tracking-[0.3em] text-slate-500 mb-6 text-center">
      {children}
    </div>
  );
}

// ===================================================================
// Slide 1 — Title
// "Trust your AI agent at scale."
// "The Continuous Optimization Infrastructure for Enterprise GenAI"
// ===================================================================
function Slide1Title() {
  return (
    <div className="text-center max-w-5xl mx-auto">
      <h1
        className="text-5xl md:text-7xl font-bold text-white mb-10 leading-tight"
        style={{ textWrap: "balance" }}
      >
        Trust your <span style={{ color: BLUE }}>AI</span> agent at scale.
      </h1>
      <div
        className="inline-block px-6 py-3 rounded-full border border-slate-700/60"
        style={{ background: `${BLUE}11` }}
      >
        <p className="text-xl md:text-2xl text-slate-200 leading-relaxed">
          The Continuous Optimization Infrastructure for Enterprise GenAI
        </p>
      </div>
    </div>
  );
}

// ===================================================================
// Slide 2 — Team
// Dr. Nimrod Busany — Co-Founder & Chief Research Officer
// Amir Barnea — Co-Founder & VP Sales
// ===================================================================
function Slide2Team() {
  return (
    <div className="max-w-6xl mx-auto">
      <SectionEyebrow>Team</SectionEyebrow>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Nimrod */}
        <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-6 md:p-8 flex gap-5">
          <img
            src={`${import.meta.env.BASE_URL}investor-deck/portrait-nimrod.png`}
            alt="Dr. Nimrod Busany"
            className="w-28 h-28 md:w-32 md:h-32 rounded-2xl object-cover flex-shrink-0 border border-slate-700/60"
          />
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">Dr. Nimrod Busany</h3>
            <div className="text-sm font-mono uppercase tracking-wider mb-3 mt-1" style={{ color: BLUE }}>
              Co-Founder &amp; Chief Research Officer
            </div>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              <span className="text-white font-semibold">15+ yrs</span> Research Leader. <span className="text-white">PhD Computer Science</span> (Technion/TAU). Expert in AI/ML optimization with{" "}
              <span className="text-white font-semibold">20+ Publications</span> (CAIN'26, ICSE'25, NLBSE'25) &amp; Patents. Recognized thought leader: <span className="text-white">IEEE/ACM Committee Member</span>.
            </p>
          </div>
        </div>
        {/* Amir */}
        <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-6 md:p-8 flex gap-5">
          <div
            className="w-28 h-28 md:w-32 md:h-32 rounded-2xl flex items-center justify-center flex-shrink-0 border border-slate-700/60 text-3xl md:text-4xl font-bold text-white"
            style={{ background: `${BLUE}33` }}
          >
            AB
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">Amir Barnea</h3>
            <div className="text-sm font-mono uppercase tracking-wider mb-3 mt-1" style={{ color: BLUE }}>
              Co-Founder &amp; VP Sales
            </div>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              <span className="text-white font-semibold">20+ yrs</span> Global Sales and Marketing Leader in <span className="text-white">B2B SW companies</span>. Expert in Enterprise sales. <span className="text-white">BSc Physics and Computer Science</span> (TAU) and <span className="text-white">MBA from Carnegie Mellon University</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===================================================================
// Slide 3 — The Execution Gap
// Gartner 30% + MIT 95% stats
// ===================================================================
function Slide3ExecutionGap() {
  return (
    <div className="max-w-6xl mx-auto">
      <SectionEyebrow>The Execution Gap</SectionEyebrow>
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <div
            className="bg-slate-900/60 border rounded-2xl p-6"
            style={{ borderColor: `${RED}55` }}
          >
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-6xl md:text-7xl font-bold" style={{ color: RED }}>~30%</span>
              <span className="text-sm font-mono uppercase tracking-wider text-slate-500">Gartner</span>
            </div>
            <p className="text-lg text-slate-200 leading-relaxed">
              of <span className="text-white font-semibold">GenAI projects fail</span> after PoC due to poor quality and trust.
            </p>
          </div>
          <div
            className="bg-slate-900/60 border rounded-2xl p-6"
            style={{ borderColor: `${AMBER}55` }}
          >
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-6xl md:text-7xl font-bold" style={{ color: AMBER }}>95%</span>
              <span className="text-sm font-mono uppercase tracking-wider text-slate-500">MIT</span>
            </div>
            <p className="text-lg text-slate-200 leading-relaxed">
              of pilots <span className="text-white font-semibold">fail</span> because companies avoid the friction of <span className="text-white">manual tuning</span>.
            </p>
          </div>
        </div>
        <div>
          <img
            src={`${import.meta.env.BASE_URL}investor-deck/trust-at-scale.jpg`}
            alt="Do you trust your AI agent at scale?"
            className="w-full rounded-2xl border border-slate-700/60"
          />
        </div>
      </div>
    </div>
  );
}

// ===================================================================
// Slide 4 — Defining The Optimization Category
// ===================================================================
function Slide4Category() {
  return (
    <div className="max-w-6xl mx-auto">
      <SectionEyebrow>Defining the Optimization Category</SectionEyebrow>
      <h2
        className="text-3xl md:text-5xl font-bold text-white mb-10 text-center leading-tight"
        style={{ textWrap: "balance" }}
      >
        Manual prompt engineering and model selection is a{" "}
        <span style={{ color: AMBER }}>high-variance</span>,{" "}
        <span style={{ color: BLUE }}>high-cost</span> endeavor.
      </h2>
      <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-2 md:p-3">
        <img
          src={`${import.meta.env.BASE_URL}investor-deck/config-table.png`}
          alt="Configuration table — model, prompt, temperature, instructions, max_tokens vs. accuracy, cost, latency"
          className="w-full rounded-xl"
        />
      </div>
      <p className="mt-6 text-center text-slate-400 text-sm md:text-base">
        One agent, four configurations — three orders of magnitude apart in cost and accuracy.
      </p>
    </div>
  );
}

// ===================================================================
// Slide 5 — Our Value Proposition
// EFFICIENCY / TIME SAVED / TRUST & SAFETY
// + Patented Algorithms callout
// ===================================================================
function Slide5ValueProp() {
  const pillars = [
    {
      tag: "EFFICIENCY",
      body: "Eliminate inaccurate, slow, and expensive agents. Optimized routing reduces token waste.",
      tint: BLUE,
    },
    {
      tag: "TIME SAVED",
      body: "40-60% reduction in AI Agent SDLC. Shift from manual guesswork to automated tuning.",
      tint: AMBER,
    },
    {
      tag: "TRUST & SAFETY",
      body: "Standardized, qualified agents with zero-touch hallucination control and bias detection.",
      tint: VIOLET,
    },
  ];
  return (
    <div className="max-w-6xl mx-auto">
      <SectionEyebrow>Our Value Proposition</SectionEyebrow>
      <div className="grid md:grid-cols-3 gap-5 mb-10">
        {pillars.map((p) => (
          <div
            key={p.tag}
            className="bg-slate-900/60 border rounded-2xl p-6"
            style={{ borderColor: `${p.tint}55` }}
          >
            <div className="text-sm font-mono uppercase tracking-wider mb-5" style={{ color: p.tint }}>
              {p.tag}
            </div>
            <p className="text-slate-200 text-base leading-relaxed">{p.body}</p>
          </div>
        ))}
      </div>
      <div
        className="rounded-2xl p-6 text-center border"
        style={{
          borderColor: `${BLUE}55`,
          background: "linear-gradient(90deg, rgba(26,107,245,0.08), rgba(245,158,11,0.08), rgba(167,139,250,0.08))",
        }}
      >
        <div className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">
          Our Patented Algorithms
        </div>
        <p className="text-xl md:text-2xl text-white" style={{ textWrap: "balance" }}>
          Ship Agents Faster by <span style={{ color: BLUE }}>Automating Manual Trial-and-Error</span>, Saving Engineering Time on Failed Experimentation
        </p>
      </div>
    </div>
  );
}

// ===================================================================
// Slide 6 — Demo (Before / After)
// Source deck's director note: "Show the 'Before' (it should be very bad),
// then show the 'After.' Keep them with a taste of more."
// Source visual: code editor screenshot showing CONFIG_SPACE definition.
// ===================================================================
function Slide6Demo() {
  return (
    <div className="max-w-6xl mx-auto">
      <SectionEyebrow>Demo · Before / After</SectionEyebrow>
      <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 text-center leading-tight">
        Show the <span style={{ color: RED }}>Before</span>. Show the{" "}
        <span style={{ color: BLUE }}>After</span>. Leave them wanting more.
      </h2>
      <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-2 md:p-3">
        <img
          src={`${import.meta.env.BASE_URL}investor-deck/demo-screenshot.jpg`}
          alt="Agent code with CONFIG_SPACE and objective definitions"
          className="w-full rounded-xl"
        />
      </div>
      <p className="mt-6 text-center text-slate-400 text-sm md:text-base">
        A handful of lines describe the search space. The engine handles the rest.
      </p>
    </div>
  );
}

// ===================================================================
// Slide 7 — Market Opportunity
// $150B TAM (Gartner, IDC) · $20B SAM · 40%+ CAGR
// ===================================================================
function Slide7Market() {
  return (
    <div className="max-w-6xl mx-auto">
      <SectionEyebrow>Market Opportunity</SectionEyebrow>
      <h2 className="text-3xl md:text-5xl font-bold text-white mb-12 text-center">
        The Next Infrastructure Layer.
      </h2>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-8 text-center">
          <div className="text-6xl md:text-8xl font-bold mb-3" style={{ color: BLUE }}>$150B</div>
          <div className="text-base font-mono uppercase tracking-wider text-slate-500 mb-3">TAM</div>
          <p className="text-slate-200 text-lg leading-relaxed">
            Total Enterprise AI Software Market
          </p>
          <p className="text-slate-500 text-xs mt-3">Gartner · IDC</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-8 text-center">
          <div className="text-6xl md:text-8xl font-bold mb-3" style={{ color: AMBER }}>$20B</div>
          <div className="text-base font-mono uppercase tracking-wider text-slate-500 mb-3">SAM · Optimization Layer</div>
          <p className="text-slate-200 text-lg leading-relaxed">
            Growing at <span className="text-white font-semibold">40%+ CAGR</span>
          </p>
          <p className="text-slate-500 text-xs mt-3">marketsandmarkets · grandviewresearch · mordorintelligence</p>
        </div>
      </div>
      <p
        className="text-center text-lg text-slate-300 max-w-3xl mx-auto"
        style={{ textWrap: "balance" }}
      >
        We are capturing the <span className="text-white font-semibold">"Optimization Layer"</span> within the Serviceable Market.
      </p>
    </div>
  );
}

// ===================================================================
// Slide 8 — They Report, We Fix.
// Subhead: They monitor. We optimize. Continuously.
// Visual: competitive layers table (LLM Gateway / Observability /
// Evaluation / Optimization vs. Traigent Advantage).
// ===================================================================
function Slide8TheyReportWeFix() {
  return (
    <div className="max-w-6xl mx-auto">
      <h2
        className="text-5xl md:text-7xl font-bold text-white mb-4 text-center"
        style={{ textWrap: "balance" }}
      >
        They Report, <span style={{ color: BLUE }}>We Fix.</span>
      </h2>
      <p className="text-xl md:text-2xl text-slate-300 mb-10 text-center" style={{ textWrap: "balance" }}>
        They monitor. We optimize. <span className="text-white font-semibold">Continuously.</span>
      </p>
      <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-2 md:p-3">
        <img
          src={`${import.meta.env.BASE_URL}investor-deck/competitive-layers.png`}
          alt="Competitive layers — LLM Gateway / Observability / Evaluation / Optimization vs. Traigent Advantage"
          className="w-full rounded-xl"
        />
      </div>
    </div>
  );
}

// ===================================================================
// Slide 9 — GTM & Traction
// Design Partners + PLG Motion + Thought Leadership
// ===================================================================
function Slide9GTM() {
  const designPartners = [
    { name: "Bazak", src: "partner-bazak.jpg" },
    { name: "Yotpo", src: "partner-yotpo.png" },
    { name: "Profisea", src: "partner-profisea.png" },
  ];
  const thoughtLeadership = [
    { name: "CAIN 2026", src: "thought-cain.png" },
    { name: "MLOps Community", src: "thought-mlops.png" },
    { name: "AI Community Summit", src: "thought-aisummit.png" },
  ];
  return (
    <div className="max-w-6xl mx-auto">
      <SectionEyebrow>Go-To-Market &amp; Traction</SectionEyebrow>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Design Partners */}
        <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-6">
          <div className="text-sm font-mono uppercase tracking-wider mb-4" style={{ color: BLUE }}>
            Design Partners
          </div>
          <p className="text-slate-300 text-base mb-5 leading-relaxed">
            <span className="text-white font-semibold">PLG Motion:</span> Zero-touch freemium model targeting R&amp;D teams directly; Conferences, podcasts, and social media.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {designPartners.map((p) => (
              <div
                key={p.name}
                className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 h-20 flex items-center justify-center"
              >
                <img
                  src={`${import.meta.env.BASE_URL}investor-deck/${p.src}`}
                  alt={p.name}
                  className="max-h-12 max-w-full object-contain"
                  style={{ filter: p.src.endsWith(".jpg") ? "none" : "brightness(0.95)" }}
                />
              </div>
            ))}
          </div>
        </div>
        {/* Thought Leadership */}
        <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-6">
          <div className="text-sm font-mono uppercase tracking-wider mb-4" style={{ color: VIOLET }}>
            Thought Leadership
          </div>
          <ul className="space-y-2 text-slate-300 text-sm leading-relaxed mb-5">
            <li className="flex gap-2">
              <span style={{ color: VIOLET }}>▸</span>
              <span><span className="text-white font-semibold">CAIN 2026</span> — 5th International Conference on AI Engineering, Rio, Brazil</span>
            </li>
            <li className="flex gap-2">
              <span style={{ color: VIOLET }}>▸</span>
              <span>MLOps Community</span>
            </li>
            <li className="flex gap-2">
              <span style={{ color: VIOLET }}>▸</span>
              <span>Responsible AI Community Summit</span>
            </li>
          </ul>
          <div className="grid grid-cols-3 gap-3">
            {thoughtLeadership.map((p) => (
              <div
                key={p.name}
                className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 h-20 flex items-center justify-center"
              >
                <img
                  src={`${import.meta.env.BASE_URL}investor-deck/${p.src}`}
                  alt={p.name}
                  className="max-h-12 max-w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===================================================================
// Slide 10 — Financial Projections
// "Scaling to $9M ARR via 500+ customers by Year 3"
// ===================================================================
function Slide10Financials() {
  const rows = [
    { metric: "Paying Customers", y1: "10", y2: "90", y3: "500" },
    { metric: "Conversion Rate", y1: "1%", y2: "3%", y3: "5%" },
  ];
  return (
    <div className="max-w-6xl mx-auto">
      <SectionEyebrow>Financial Projections</SectionEyebrow>
      <h2
        className="text-3xl md:text-5xl font-bold text-white mb-10 text-center leading-tight"
        style={{ textWrap: "balance" }}
      >
        Scaling to <span style={{ color: BLUE }}>$9M ARR</span> via{" "}
        <span style={{ color: AMBER }}>500+ customers</span> by Year 3.
      </h2>
      <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-6 md:p-8 mb-8">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-700/60">
              <th className="text-sm font-mono uppercase tracking-wider text-slate-500 py-3 pr-4">Metric</th>
              <th className="text-sm font-mono uppercase tracking-wider text-slate-500 py-3 px-4 text-center">Year 1</th>
              <th className="text-sm font-mono uppercase tracking-wider text-slate-500 py-3 px-4 text-center">Year 2</th>
              <th className="text-sm font-mono uppercase tracking-wider text-slate-500 py-3 pl-4 text-center">Year 3</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.metric} className="border-b border-slate-800/60 last:border-0">
                <td className="text-slate-300 text-base py-4 pr-4">{r.metric}</td>
                <td className="text-white text-xl md:text-2xl font-bold py-4 px-4 text-center">{r.y1}</td>
                <td className="text-white text-xl md:text-2xl font-bold py-4 px-4 text-center">{r.y2}</td>
                <td className="text-white text-xl md:text-2xl font-bold py-4 pl-4 text-center" style={{ color: BLUE }}>
                  {r.y3}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-3">
        <img
          src={`${import.meta.env.BASE_URL}investor-deck/growth-bars.png`}
          alt="Seed / Growth / Scale phases"
          className="w-full rounded-xl"
        />
      </div>
    </div>
  );
}

// ===================================================================
// Slide 11 — Questions
// Contacts: Dr. Nimrod Busany + Amir Barnea
// ===================================================================
function Slide11Questions() {
  const contacts = [
    {
      name: "Dr. Nimrod Busany",
      email: "nimrod@traigent.ai",
      phone: "+972-54-4553811",
      linkedin: "https://www.linkedin.com/in/nimrod-busany-phd-0b938216/",
    },
    {
      name: "Amir Barnea",
      email: "amir@traigent.ai",
      phone: "+972-52-8548911",
      linkedin: "https://www.linkedin.com/in/amir-barnea-1aa449/",
    },
  ];
  return (
    <div className="text-center max-w-4xl mx-auto">
      <h2 className="text-6xl md:text-8xl font-bold text-white mb-6">QUESTIONS?</h2>
      <p
        className="text-2xl md:text-3xl text-slate-300 mb-14 leading-relaxed"
        style={{ textWrap: "balance" }}
      >
        Let's build the future of <span style={{ color: BLUE }} className="font-semibold">trusted AI</span> together.
      </p>
      <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
        {contacts.map((c) => (
          <div key={c.name} className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-6 text-left">
            <h3 className="text-lg md:text-xl font-bold text-white">{c.name}</h3>
            <div className="mt-3 text-slate-300 text-sm md:text-base space-y-1">
              <div>
                <a href={`mailto:${c.email}`} className="hover:text-white" style={{ color: BLUE }}>
                  {c.email}
                </a>
              </div>
              <div className="text-slate-400">{c.phone}</div>
              <div>
                <a
                  href={c.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                  style={{ color: BLUE }}
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===================================================================
// Slide list — order matches source deck 1:1.
// Sections map onto the existing PitchDeck tab bar.
// ===================================================================
export const INVESTOR_SLIDES = [
  { title: "Trust your AI agent at scale.", section: "Traigent intro", component: Slide1Title },
  { title: "Team", section: "Traigent intro", component: Slide2Team },
  { title: "The Execution Gap", section: "Problem", component: Slide3ExecutionGap },
  { title: "Defining the Optimization Category", section: "Problem", component: Slide4Category },
  { title: "Our Value Proposition", section: "Solution", component: Slide5ValueProp },
  { title: "Before / After", section: "Solution", component: Slide6Demo },
  { title: "Market Opportunity", section: "TTM", component: Slide7Market },
  { title: "They Report, We Fix.", section: "Solution", component: Slide8TheyReportWeFix },
  { title: "Go-To-Market & Traction", section: "Proof", component: Slide9GTM },
  { title: "Financial Projections", section: "ROI", component: Slide10Financials },
  { title: "Questions?", section: "CTA", component: Slide11Questions },
];

export default function PitchInvestor() {
  usePageView();
  useKnownContactNotify({
    notify: notifyPitchDeckViewed,
    location: "pitch_investor",
    eventName: "pitch_deck_viewed_known",
    gateKey: "pitch_deck",
  });
  return (
    <>
      <Helmet>
        <title>Traigent — Investor presentation</title>
        <meta
          name="description"
          content="Traigent investor presentation — Trust your AI agent at scale. The Continuous Optimization Infrastructure for Enterprise GenAI."
        />
      </Helmet>
      <PitchDeck slides={INVESTOR_SLIDES} />
    </>
  );
}
