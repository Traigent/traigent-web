// Internal ICP — channel-first, structured in three layers:
//   ① The Channel (MSPs / integrators) — the multiplier competitors ignore.
//   ② The customers the channel serves — by SIZE tier (Enterprise / Mid-Market
//      / SMB-SME), the correct firmographic cut.
//   ③ GTM motion, in priority order: Channel → Direct → PLG (each maps to a tier).
// Route: /#/icp (hidden, noindex). Grounded in the competitive pricing map +
// the Pains×Moats matrix.
import { Helmet } from "react-helmet-async";

const CHANNEL_CARDS = [
  { h: "What they sell on our back", b: "Agent-optimization projects · “AI quality” retainers · cost-reduction engagements · guardrail / compliance packages · ongoing tuning as models & requirements drift." },
  { h: "The economics", b: "One partner = many end clients → very low CAC. They may pay us little directly at first — land the channel cheap, then monetize via rev-share / per-client / partner tier as their book grows." },
  { h: "Whitespace — why now", b: "Arize · Braintrust · Arato · Galileo & co. sell direct / product-led and ignore the channel. Only the giants (DataRobot/syftr, NVIDIA/NeMo) have one — first-mover among the optimization-native tools." },
  { h: "How we hook them", b: "The free first optimization = a $0 trial on any client. Our privacy (④) + proof (②) moats make us safe to put in front of their clients — data never leaves." },
];

// The customers the channel serves, cut by SIZE (the correct firmographic axis).
// Each tier carries the agent/pains it feels, willingness-to-pay, how it buys,
// the moat that lands, and the GTM motion that primarily reaches it.
const TIERS = [
  {
    tier: "Enterprise",
    size: "1,000+ employees · often regulated (finance · insurance · health · gov)",
    agent: "Mission-critical / customer-facing agents; data can't leave. Pains: #13 prove it · #15 guardrail · #11/#12 business outcome",
    wtp: "$60–100K+/yr · on-prem premium",
    buy: "Committee · security review · POC — needs an SI/MSP to build & run the agent",
    moat: "④ Privacy · ② certificates · ① business-KPI",
    gtm: "Channel + Direct",
    gtmTone: "channel",
  },
  {
    tier: "Mid-Market",
    size: "~100–1,000 employees",
    agent: "Scaled agents in prod. Pains: #2 cut cost · #6 endless tuning · #16 accuracy · #9 drift",
    wtp: "$15–50K/yr",
    buy: "Inside sales · faster cycle · some delivered via channel",
    moat: "① whole-config · ② proof",
    gtm: "Direct + Channel",
    gtmTone: "direct",
  },
  {
    tier: "SMB / SME",
    size: "<100 employees · (EU “SME” ≈ same; formal def ≤250 emp / ≤€50M)",
    agent: "Agent in dev / early prod · 1–2 agents. Pains: #1 good enough · #3 can't measure quality",
    wtp: "Free wedge → usage-based self-serve (grows into the Arato band)",
    buy: "Product-led · self-serve · the free first optimization",
    moat: "① builds a better agent · ③ private context",
    gtm: "PLG",
    gtmTone: "plg",
  },
];

// GTM motions, in priority order. Each targets a size tier (② above).
const MOTIONS = [
  {
    n: "①", name: "Channel", tone: "channel", tag: "LAND FIRST",
    who: "MSPs · systems integrators · dev agencies · AI consultancies",
    serves: "Enterprise + Mid-Market",
    why: "One partner = many client books → the lowest CAC. They own the client & sell the hours; we do the hard optimization. The whitespace the agile competitors ignore.",
  },
  {
    n: "②", name: "Direct", tone: "direct", tag: "",
    who: "AE / inside sales",
    serves: "Enterprise + Mid-Market — new logos AND grown-up PLG accounts",
    why: "Two sources: (a) outbound to enterprise & regulated deals a partner doesn't cover; and (b) land-and-expand UP from PLG — self-serve accounts that grow become product-qualified leads a rep converts to the enterprise band. ROI-priced to revenue / deflection / spend saved.",
  },
  {
    n: "③", name: "PLG", tone: "plg", tag: "",
    who: "Self-serve · product-led",
    serves: "SMB / SME → feeds Direct",
    why: "The free first optimization is the loss-leader wedge — the dummie / first install draws everyone and converts bottoms-up into usage-based self-serve. The biggest accounts then graduate into Direct expansion.",
  },
];

const PRICING = [
  { band: "Free — first optimization", price: "$0", note: "The loss-leader wedge (PLG). A $0 trial for any channel client too.", tone: "wedge" },
  { band: "Self-serve paid (SMB/SME)", price: "usage-based", note: "Per optimization · per agent — roughly the Arato band ($19–29K/yr) as they scale.", tone: "ours" },
  { band: "Enterprise", price: "$60–100K+/yr", note: "Business-outcome · regulated · big-cost. On-prem premium for regulated.", tone: "ours" },
  { band: "Observability commodity", price: "$20–250/mo", note: "Where Langfuse / Helicone / LangSmith / DeepEval monetize thin (seat / trace). NOT us.", tone: "not" },
];

const ANTI = [
  { name: "Won't run a second optimization", why: "Tire-kicker with no production agent — the free run already cost ~nothing; don't chase." },
  { name: "Pure observability shoppers", why: "Want dashboards as the product (#5) — Arize / Langfuse turf, the $20/mo commodity." },
  { name: "Pure GRC / compliance-ops buyers", why: "Want retention / GDPR / sign-off workflow, not optimization — Avon's turf." },
];

const GTM_TONE = {
  channel: "text-amber-300 border-amber-500/50 bg-amber-500/10",
  direct: "text-[#4D8EF8] border-[#1A6BF5]/50 bg-[#1A6BF5]/10",
  plg: "text-emerald-300 border-emerald-500/50 bg-emerald-500/10",
};

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
            Two lenses. <span className="text-white font-semibold">Who</span> — the <span className="text-amber-300 font-semibold">channel</span> (MSPs &amp; integrators) and the customers it serves, by size (Enterprise · Mid-Market · SMB/SME).
            {" "}<span className="text-white font-semibold">How</span> — the <span className="text-emerald-300 font-semibold">GTM motions</span>, in priority order (Channel → Direct → PLG).
          </div>
        </div>

        {/* WHO — the channel + the customers it serves */}
        <div className="text-[11px] font-mono uppercase tracking-widest text-slate-500 mb-2">Who we sell to</div>
        <section className="rounded-xl border border-amber-500/40 bg-gradient-to-br from-amber-500/[0.12] to-slate-900/30 p-5 mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
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

        {/* ② THE CUSTOMERS THEY SERVE — by size tier */}
        <section className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="text-lg md:text-xl font-extrabold text-white">The customers the channel serves</h2>
            <span className="text-[12px] text-slate-400 italic">by size — the correct firmographic cut</span>
          </div>
          <div className="text-[11px] text-slate-500 mb-3">
            Channel primarily serves <span className="text-slate-300">Enterprise + Mid-Market</span> (they need someone to build &amp; run the agent); <span className="text-slate-300">SMB/SME</span> comes mostly through PLG.
          </div>
          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[#2F5597]">
                  {["Tier (size)", "Typical agent & pains", "Willingness-to-pay", "How they buy", "Moat that lands", "GTM motion"].map((h) => (
                    <th key={h} className="border border-slate-700 text-white text-[12px] font-semibold px-3 py-2 text-left align-bottom">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIERS.map((t) => (
                  <tr key={t.tier} className="odd:bg-slate-950/30 align-top">
                    <td className="border border-slate-800 bg-[#151a26] px-3 py-3 w-[190px]">
                      <div className="text-[13px] font-bold text-white">{t.tier}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">{t.size}</div>
                    </td>
                    <td className="border border-slate-800 px-3 py-3 text-[12px] text-slate-300 leading-snug w-[240px]">{t.agent}</td>
                    <td className="border border-slate-800 px-3 py-3 text-[12px] text-slate-300 leading-snug w-[180px]">{t.wtp}</td>
                    <td className="border border-slate-800 px-3 py-3 text-[12px] text-slate-300 leading-snug w-[210px]">{t.buy}</td>
                    <td className="border border-emerald-500/30 bg-emerald-500/[0.07] px-3 py-3 text-[12px] text-emerald-100 leading-snug w-[180px]">{t.moat}</td>
                    <td className="border border-slate-800 px-3 py-3 w-[130px]">
                      <span className={`inline-block text-[10px] font-bold border rounded px-2 py-0.5 ${GTM_TONE[t.gtmTone]}`}>{t.gtm}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* HOW — GTM motions, a separate axis (not a next step) */}
        <div className="text-[11px] font-mono uppercase tracking-widest text-slate-500 mb-2 mt-8">How we go to market</div>
        <section className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="text-lg md:text-xl font-extrabold text-white">GTM motion — in priority order</h2>
            <span className="text-[12px] text-slate-400 italic">a separate lens (how we reach each tier) — not a next step</span>
          </div>
          <div className="text-[11px] text-slate-500 mb-3">
            The three feed each other: <span className="text-emerald-300">PLG</span> lands SMB/SME bottoms-up, the biggest self-serve accounts graduate into <span className="text-[#4D8EF8]">Direct</span> expansion, and <span className="text-amber-300">Channel</span> multiplies both across partner books.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {MOTIONS.map((m) => (
              <div key={m.name} className={`rounded-xl border p-4 ${GTM_TONE[m.tone].replace(/text-\S+/, "")} bg-slate-950/40`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-lg font-extrabold ${GTM_TONE[m.tone].split(" ")[0]}`}>{m.n}</span>
                  <span className="text-[15px] font-bold text-white">{m.name}</span>
                  {m.tag && <span className="ml-auto text-[10px] font-bold text-amber-200 border border-amber-500/60 rounded px-2 py-0.5">{m.tag}</span>}
                </div>
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Who</div>
                <div className="text-[12px] text-slate-300 mb-2 leading-snug">{m.who}</div>
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Serves</div>
                <div className="text-[12px] text-slate-200 font-semibold mb-2">{m.serves}</div>
                <div className="text-[12px] text-slate-300 leading-snug border-t border-slate-800 pt-2">{m.why}</div>
              </div>
            ))}
          </div>
        </section>

        {/* pricing + anti-ICP */}
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
            <span className="text-amber-300">Channel first</span> — MSPs &amp; integrators multiply us across Enterprise &amp; Mid-Market client books at near-zero CAC, where the agile competitors aren't.
            <span className="text-[#4D8EF8]"> Direct</span> takes the enterprise &amp; regulated deals a partner doesn't; <span className="text-emerald-300">PLG</span> captures SMB/SME bottoms-up via the free wedge. Monetize on <span className="text-emerald-300">value</span>, never seats or traces.
          </p>
        </div>
      </div>
    </div>
  );
}
