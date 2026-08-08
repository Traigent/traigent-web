// Internal ICP — channel-first. ① Land MSPs & integrators (the multiplier the
// competitors ignore); ② they deliver Traigent to their clients — the end-user
// segments, cut by the KPI they optimize to. Grounded in the competitive
// pricing map + the Pains×Moats matrix. Route: /#/icp (hidden, noindex).
import { Helmet } from "react-helmet-async";

const CHANNEL_CARDS = [
  { h: "What they sell on our back", b: "Agent-optimization projects · “AI quality” retainers · cost-reduction engagements · guardrail / compliance packages · ongoing tuning as models & requirements drift." },
  { h: "The economics", b: "One partner = many end clients → very low CAC. They may pay us little directly at first — land the channel cheap, then monetize via rev-share / per-client / partner tier as their book grows." },
  { h: "Whitespace — why now", b: "Arize · Braintrust · Arato · Galileo & co. sell direct / product-led and largely ignore the channel. First-mover: become the optimization layer every integrator resells." },
  { h: "How we hook them", b: "The free first optimization = a $0 trial on any client. Our privacy (④) + proof (②) moats make us safe to put in front of their clients — data never leaves." },
];

const FIT = {
  BEST: { label: "BEST", cls: "bg-emerald-500/20 text-emerald-300 border-emerald-500/50" },
  STRONG: { label: "STRONG", cls: "bg-[#1A6BF5]/20 text-[#4D8EF8] border-[#1A6BF5]/50" },
};

// The end-user segments the channel serves (and our direct targets), cut by the
// KPI they optimize to — not funding stage. Sized by team / agents / spend / traffic.
const SEGMENTS = [
  {
    name: "Make it good enough", tag: "volume", fit: "BEST",
    kpi: "#1 Not accurate / good enough ★ · #3 can't measure quality · #6 endless tuning",
    who: "Agent in dev / early prod · 1–2 agents · team < 150 · AI-native / vertical-AI",
    moat: "① builds a better agent · ② proof · ③ private context",
    wtp: "Free wedge → SMB self-serve (usage), grows into the Arato band.",
    why: "Eval tools only MEASURE; Arato only TESTS. Traigent optimizes the agent to hit the number.",
  },
  {
    name: "Drive a business outcome", tag: "uncontested", fit: "BEST",
    kpi: "#11 Increase CONVERSION ★ · #12 Increase RESOLUTION ★",
    who: "Customer-facing agent · thousands of conversations / mo · e-comm · SDR · CX · fintech",
    moat: "① · ③ outcome data only your stack sees · ② proof of lift",
    wtp: "ROI-priced to revenue / deflection → enterprise band $50–100K+.",
    why: "Everyone measures conversation quality; ONLY Traigent optimizes directly to the business KPI (attribution in progress).",
  },
  {
    name: "Cut the cost", tag: "KINGS", fit: "STRONG",
    kpi: "#2 Reduce LLM costs — our KINGS row · #7 too slow",
    who: "LLM bill > $10–50K / mo · scaled traffic · quality bar already set",
    moat: "① whole-config cost cut · ② proof",
    wtp: "ROI-priced — a slice of LLM spend saved. $20–60K/yr.",
    why: "Routers / distill tweak ONE lever externally; Traigent cuts cost whole-config, inline, at held quality.",
  },
  {
    name: "Prove it / keep it private", tag: "privacy", fit: "STRONG",
    kpi: "#13 Prove it to auditors · #15 runtime safety / guardrail",
    who: "1,000+ employees · regulated (finance · insurance · health · gov) · data can't leave",
    moat: "④ PRIVACY — optimize without seeing the data · ② certificates · ①",
    wtp: "Enterprise $60–100K+/yr; on-prem premium (Avon band).",
    why: "Competitors ingest your data or bolt on a filter; Traigent optimizes privately + proves it. (Partner for full GRC; guardrail in progress.)",
  },
];

const PRICING = [
  { band: "Free — first optimization", price: "$0", note: "The loss-leader wedge. Draws everyone; a $0 trial for any channel client.", tone: "wedge" },
  { band: "Self-serve paid (SMB)", price: "usage-based", note: "Per optimization · per agent — roughly the Arato band ($19–29K/yr) as they scale.", tone: "ours" },
  { band: "Enterprise", price: "$60–100K+/yr", note: "Business-outcome · regulated · big-cost. On-prem premium for regulated.", tone: "ours" },
  { band: "Observability commodity", price: "$20–250/mo", note: "Where Langfuse / Helicone / LangSmith / DeepEval monetize thin (seat / trace). NOT us.", tone: "not" },
];

const ANTI = [
  { name: "Won't run a second optimization", why: "Tire-kicker with no production agent — the free run already cost ~nothing; don't chase." },
  { name: "Pure observability shoppers", why: "Want dashboards as the product (#5) — Arize / Langfuse turf, the $20/mo commodity." },
  { name: "Pure GRC / compliance-ops buyers", why: "Want retention / GDPR / sign-off workflow, not optimization — Avon's turf." },
];

export default function ICP() {
  return (
    <div className="min-h-screen bg-[#080808] text-slate-200 px-4 py-6">
      <Helmet>
        <title>Traigent — ICP (internal)</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center gap-2 bg-[#3a1212] border border-[#7f1d1d] text-red-200 text-[12px] font-semibold px-4 py-2 rounded-lg mb-4">
          <span className="w-2 h-2 rounded-full bg-red-500" /> INTERNAL — GTM / ICP + competitive pricing. Do not distribute externally.
        </div>

        <div className="rounded-lg bg-[#1F2A44] px-5 py-3 mb-5">
          <h1 className="text-xl md:text-2xl font-bold text-white">Ideal Customer Profile — channel-first</h1>
          <div className="text-[13px] text-slate-300 mt-1">
            <span className="text-amber-300 font-semibold">① Land MSPs &amp; integrators</span> — the multiplier the competitors ignore.
            Then <span className="text-emerald-300 font-semibold">② they deliver Traigent to their clients</span> — the end-user types below, cut by the KPI they optimize to.
          </div>
        </div>

        {/* ① THE CHANNEL */}
        <section className="rounded-xl border border-amber-500/40 bg-gradient-to-br from-amber-500/[0.12] to-slate-900/30 p-5 mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-[11px] font-mono font-bold text-amber-300 border border-amber-500/50 rounded px-1.5 py-0.5">STEP 1</span>
            <h2 className="text-lg md:text-xl font-extrabold text-white">The Channel — MSPs &amp; Integrators</h2>
            <span className="text-[12px] text-slate-400 italic">the force multiplier</span>
            <span className="ml-auto text-[10px] font-bold text-amber-200 border border-amber-500/60 rounded px-2 py-0.5">LAND THESE FIRST</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-amber-300/90 font-bold mb-1">Who</div>
              <div className="text-[14px] text-slate-200 leading-snug">MSPs · systems integrators · dev agencies · AI consultancies — anyone who builds &amp; runs agents <span className="text-white font-semibold">for their clients</span>, not for themselves.</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-amber-300/90 font-bold mb-1">Why they fall head over heels</div>
              <div className="text-[14px] text-slate-200 leading-snug">Traigent = a <span className="text-white font-semibold">new, lucrative services line</span>: implementation + optimization retainers + differentiation + faster delivery + fatter margin. <span className="text-emerald-300">They own the client &amp; sell the hours; we do the hard optimization.</span></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {CHANNEL_CARDS.map((c) => (
              <div key={c.h} className="rounded-lg border border-amber-500/20 bg-slate-950/40 p-3">
                <div className="text-[10px] uppercase tracking-wider text-amber-300/80 font-bold mb-1">{c.h}</div>
                <div className="text-[12px] text-slate-300 leading-snug">{c.b}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ② THE CUSTOMERS THEY SERVE */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-mono font-bold text-emerald-300 border border-emerald-500/50 rounded px-1.5 py-0.5">STEP 2</span>
            <h2 className="text-lg md:text-xl font-extrabold text-white">The customers the channel serves</h2>
            <span className="text-[12px] text-slate-400 italic">the agents they optimize for clients — and our direct-sale targets</span>
          </div>
          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[#2F5597]">
                  {["Type (value driver)", "KPI / pain (matrix #)", "Who (size · industry)", "Moat that lands", "Willingness-to-pay", "Why us"].map((h) => (
                    <th key={h} className="border border-slate-700 text-white text-[12px] font-semibold px-3 py-2 text-left align-bottom">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SEGMENTS.map((s, i) => (
                  <tr key={s.name} className="odd:bg-slate-950/30 align-top">
                    <td className="border border-slate-800 bg-[#151a26] px-3 py-3 w-[170px]">
                      <div className="text-[13px] font-bold text-white">{i + 1} · {s.name}</div>
                      <div className="text-[11px] text-[#4D8EF8] italic mt-0.5">{s.tag}</div>
                      <span className={`inline-block mt-2 text-[10px] font-bold border rounded px-2 py-0.5 ${FIT[s.fit].cls}`}>{FIT[s.fit].label} FIT</span>
                    </td>
                    <td className="border border-slate-800 px-3 py-3 text-[12px] text-slate-300 leading-snug w-[190px]">{s.kpi}</td>
                    <td className="border border-slate-800 px-3 py-3 text-[12px] text-slate-300 leading-snug w-[210px]">{s.who}</td>
                    <td className="border border-emerald-500/30 bg-emerald-500/[0.07] px-3 py-3 text-[12px] text-emerald-100 leading-snug w-[210px]">{s.moat}</td>
                    <td className="border border-slate-800 px-3 py-3 text-[12px] text-slate-300 leading-snug w-[190px]">{s.wtp}</td>
                    <td className="border border-slate-800 px-3 py-3 text-[12px] text-slate-300 leading-snug">{s.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* pricing + anti-ICP, side by side (secondary reference) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <section>
            <h3 className="text-[13px] font-bold text-white mb-2">Pricing — give the wedge free, monetize on value</h3>
            <div className="space-y-1.5">
              {PRICING.map((p) => (
                <div key={p.band} className={`flex items-center gap-3 rounded-lg border px-3 py-2 ${p.tone === "wedge" ? "border-amber-500/50 bg-amber-500/10" : p.tone === "ours" ? "border-emerald-500/40 bg-emerald-500/[0.07]" : "border-slate-700 bg-slate-950/60"}`}>
                  <div className="w-[150px] shrink-0">
                    <div className="text-[12px] font-bold text-white">{p.band}</div>
                    <div className={`text-[13px] font-extrabold tabular-nums ${p.tone === "not" ? "text-slate-500" : "text-slate-100"}`}>{p.price}</div>
                  </div>
                  <div className="text-[11px] text-slate-400 leading-snug">{p.note}</div>
                </div>
              ))}
            </div>
            <div className="text-[11px] text-slate-500 mt-2">Monetize on value (optimizations · agents · outcomes) — never per seat or per trace.</div>
          </section>

          <section>
            <h3 className="text-[13px] font-bold text-white mb-2">Anti-ICP — don't chase</h3>
            <div className="space-y-1.5">
              {ANTI.map((a) => (
                <div key={a.name} className="rounded-lg border border-red-500/25 bg-red-500/[0.05] px-3 py-2">
                  <div className="text-[12px] font-bold text-red-200">✕ {a.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">{a.why}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* takeaway */}
        <div className="rounded-lg bg-[#1F2A44] px-5 py-3">
          <p className="text-sm font-semibold text-white leading-relaxed">
            <span className="text-amber-300">Land the channel first</span> — MSPs &amp; integrators multiply us across their client books at near-zero CAC, and the competitors aren't there.
            They deliver Traigent to the four customer types above; we also sell those direct via the free wedge → self-serve → enterprise. Monetize on <span className="text-emerald-300">value</span>, never seats or traces.
          </p>
        </div>
      </div>
    </div>
  );
}
