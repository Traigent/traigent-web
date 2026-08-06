// Live debate surface for the competitive "Pains × Solution Types × Moats"
// matrix. Edit the ROWS data below and the page hot-reloads instantly — no
// file to close/reopen. Once locked we fold it into the Product Presentation
// deck (PitchShort) as end slides.
//
// Route: /#/moat-matrix
//
// Blue side = what the MARKET does: observe / flag / guard / audit the symptom,
// plus at most a PARTIAL (single-lever) change to the agent. "Improve the agent
// (whole-config, certified)" is NOT a blue column — it's Traigent's moat ①.
//
// Cell model: { v: competitor text (or "—"), tr: optional "Traigent —" line }.
// When tr is present it renders on its own green line under the vendors.
// moats = [buildsBetter, proof, insideInfo] booleans (✓ = applies significantly).

const DASH = "—";
// adv = optional { level: "red" | "yellow", text } — a competitor-advantage note.
// red = competitor is genuinely ahead here; yellow = they lead this cell but a
// Traigent moat wins the pain overall.
const cell = (v, tr = null, adv = null) => ({ v, tr, adv });
const D = cell(DASH);

const ROWS = [
  {
    pain: "1 · Won't blow up in prod",
    sub: "edge cases before launch",
    observe: cell(
      "DeepEval, Braintrust, Arize — eval & surface failure modes",
      "Traigent — maps failures too · moat ⇒ optimizes the agent to survive them (①)"
    ),
    flag: cell(
      "Promptfoo, DeepEval (CI); Arato, Plurai — adversarial pre-release sim",
      "Traigent — probes & CI-gates too · moat ⇒ optimizes to pass them (①)",
      { level: "yellow", text: "Arato / Plurai run DEEPER sims — but they only FIND failures; our moat FIXES the agent" }
    ),
    guard: cell(
      "Guardrails AI, Llama Guard — catch some at runtime",
      "Traigent — a fitted guardrail for the residual edge cases, coded into the agent & sized to your risk (not a generic filter) — in progress"
    ),
    audit: cell(
      DASH,
      "Traigent — the optimization trace IS the proof (config → KPI, run plans, aggXL) · moat ⇒ reproducible, superior improvement-proof (②)"
    ),
    weak: cell(DASH, "moat ⇒ Traigent builds the agent to survive the edge cases (①)"),
    moats: [true, true, true, true],
  },
  {
    pain: "2 · Reduce LLM costs",
    sub: "cost is exploding — Traigent's home turf",
    observe: cell(
      "Helicone, Langfuse, Arize — cost dashboards",
      "Traigent — tracks cost too · moat ⇒ cuts it whole-config at held quality (①)"
    ),
    flag: cell(
      "Portkey, Helicone — budget / spend alerts, caps & rate limits",
      "Traigent — flags cost too · moat ⇒ cuts it whole-config (①)"
    ),
    guard: D,
    audit: cell(
      DASH,
      "Traigent — the optimization trace IS the proof (config → KPI, run plans, aggXL) · moat ⇒ reproducible, superior improvement-proof (②)"
    ),
    weak: cell(
      "Portkey / Martian / RouteLLM — routing & caching; distill platforms — train a smaller model (each a SINGLE lever)",
      "Traigent — many cheaper paths, optimized jointly: model cascade in sequence · per-question-type routing · cheaper-model swaps · model-knob tuning · structural-knob tuning · distilled / LoRA as a candidate · moat ⇒ whole-config cost cut, not just one lever (①)",
      { level: "yellow", text: "Portkey / Martian adapt continuously at RUNTIME per request; our whole-config moat is deeper but offline / periodic" }
    ),
    moats: [true, true, true, true],
  },
  {
    pain: "3 · Can't measure quality",
    observe: cell(
      "DeepEval, Braintrust, Arize — eval frameworks, LLM-judge, metric libs",
      "Traigent — evaluates & calibrates the judge too · moat ⇒ then optimizes to it (①), on your private context (③)"
    ),
    flag: D,
    guard: D,
    audit: cell(
      DASH,
      "Traigent — the optimization trace IS the proof (config → KPI, run plans, aggXL) · moat ⇒ reproducible, superior improvement-proof (②)"
    ),
    weak: cell(DASH, "moat ⇒ Traigent builds a better agent once quality is measurable (①)"),
    moats: [true, true, true, true],
  },
  {
    pain: "4 · No test data / golden set",
    observe: cell(
      "Braintrust, DeepEval — synthetic data; Arato — scenario generation",
      "Traigent — generates synthetic data, turns your logs into datasets, flags problematic data points for improvement, and surfaces retrieval gaps to treat with advanced RAG (parity here — the moat only kicks in once you optimize on the data)"
    ),
    flag: D,
    guard: D,
    audit: D,
    weak: D,
    moats: [false, false, false, false],
  },
  {
    pain: "5 · No visibility in prod",
    observe: cell(
      "Langfuse, Helicone, Arize, LangSmith, Opik, HoneyHive, W&B Weave — mature tracing / dashboards",
      "Traigent — has observability too (native trace emission at build time), but it's not our strength here — no moat on the visibility pain itself",
      { level: "red", text: "Langfuse / Arize lead on observability maturity — Traigent isn't optimizing on this pain, so no moat applies (parity at best)" }
    ),
    flag: cell(
      "Arize — alerting",
      "Traigent — can alert off its pass-rate / difficulty signal too (parity)"
    ),
    guard: D,
    audit: cell(
      "Arize, Langfuse — audit trails",
      "Traigent — captures trace evidence too (the improvement-proof moat only kicks in once you optimize — see the pains where ① fires)"
    ),
    weak: D,
    moats: [false, false, false, false],
  },
  {
    pain: "6 · Endless manual tuning",
    observe: cell(
      "Braintrust, Vellum, LangSmith — prompt experimentation",
      "Traigent — runs the experiments automatically · moat ⇒ near-best config, certified (①)"
    ),
    flag: D,
    guard: D,
    audit: cell(
      DASH,
      "Traigent — the optimization trace IS the proof (config → KPI, run plans, aggXL) · moat ⇒ reproducible, superior improvement-proof (②)"
    ),
    weak: cell(
      "DeepEval GEPA, Opik — prompt-only optimization; Vellum, LangSmith — manual prompt tuning",
      "Traigent — prompt tuned jointly with model + params + RAG, embedded in the agent"
    ),
    moats: [true, true, true, true],
  },
  {
    pain: "7 · Runtime safety / guardrail",
    sub: "regulated",
    observe: cell(
      "DeepEval — safety metrics (eval only)",
      "Traigent — measures safety too · moat ⇒ builds & embeds the guardrail that fixes it — in progress (①)"
    ),
    flag: D,
    guard: cell(
      "Avon, Guardrails AI, NeMo, Llama Guard — runtime block / redact / human-in-loop",
      "Traigent — cascade guardrail coded INTO the agent, not a bolt-on — in progress (see moat ①)",
      { level: "yellow", text: "Production-proven today (ours in progress); some regulated buyers prefer an INDEPENDENT guardrail for separation of duties" }
    ),
    audit: cell(
      "Avon — audit",
      "Traigent — a certificate (live) + guardrail-fire evidence, coverage + fire-rate (in progress), not just an event log · moat ⇒ superior improvement-proof (②)"
    ),
    weak: cell(DASH, "moat ⇒ Traigent builds & embeds the guardrail into the agent — in progress (①)"),
    moats: [true, true, true, true],
  },
  {
    pain: "8 · Too slow",
    observe: cell(
      "Helicone, Arize, Langfuse — latency dashboards",
      "Traigent — measures latency too · moat ⇒ optimizes to a latency budget at held quality (①)"
    ),
    flag: cell(
      "Arize — latency alerts",
      "Traigent — flags latency too · moat ⇒ optimizes to a latency budget (①)"
    ),
    guard: D,
    audit: cell(
      DASH,
      "Traigent — the optimization trace IS the proof (config → KPI, run plans, aggXL) · moat ⇒ reproducible, superior improvement-proof (②)"
    ),
    weak: cell(
      "Portkey / Martian — routing & smaller-model swaps",
      "Traigent — model / latency tradeoff baked into the agent config, not a runtime gateway",
      { level: "yellow", text: "Runtime, continuous adaptation is theirs; our whole-config optimization is deeper but offline / periodic" }
    ),
    moats: [true, true, true, true],
  },
  {
    pain: "9 · Quality drifted",
    observe: cell(
      "Arize — drift monitors",
      "Traigent — detects drift too (pass-rate / difficulty) · moat ⇒ re-optimize (①) + proof over time (②)"
    ),
    flag: cell(
      "Arize — drift alerting",
      "Traigent — flags drift too · moat ⇒ re-probe & re-optimize (①)"
    ),
    guard: D,
    audit: cell(
      DASH,
      "Traigent — the optimization trace IS the proof (config → KPI, run plans, aggXL) · moat ⇒ reproducible, superior improvement-proof (②)"
    ),
    weak: cell(DASH, "moat ⇒ Traigent re-optimizes the agent on drift (①)"),
    moats: [true, true, true, true],
  },
  {
    pain: "10 · Should I switch models?",
    observe: cell(
      "Braintrust, DeepEval, Promptfoo — eval / A-B",
      "Traigent — evaluates the new model too · moat ⇒ re-optimizes & re-fits to it (①)"
    ),
    flag: D,
    guard: D,
    audit: cell(
      DASH,
      "Traigent — the optimization trace IS the proof (config → KPI, run plans, aggXL) · moat ⇒ reproducible, superior improvement-proof (②)"
    ),
    weak: cell(
      "Portkey — routing; manual re-prompting",
      "Traigent — new model selected & prompts re-fit inline; per-request routing embedded in the agent"
    ),
    moats: [true, true, true, true],
  },
  {
    pain: "11 · CI regression gate",
    observe: D,
    flag: cell(
      "DeepEval, Braintrust, Promptfoo — gate on a fixed threshold",
      "Traigent — gate CI on the certificate (regression vs the optimum) · moat ⇒ re-optimize to recover (①)"
    ),
    guard: D,
    audit: cell(
      DASH,
      "Traigent — the optimization trace IS the proof (config → KPI, run plans, aggXL) · moat ⇒ reproducible, superior improvement-proof (②)"
    ),
    weak: cell(DASH, "moat ⇒ Traigent re-optimizes to recover on regression (①)"),
    moats: [true, true, true, true],
  },
  {
    pain: "12 · RAG gives wrong answers",
    observe: cell(
      "Arize Phoenix, Ragas, DeepEval RAG — RAG eval metrics",
      "Traigent — scores RAG too · moat ⇒ implements & tunes the RAG fix (①)"
    ),
    flag: D,
    guard: D,
    audit: cell(
      DASH,
      "Traigent — the optimization trace IS the proof (config → KPI, run plans, aggXL) · moat ⇒ reproducible, superior improvement-proof (②)"
    ),
    weak: cell(
      "RAG tooling — add / tune retrieval (manual)",
      "Traigent — RAG implemented in the agent and tuned jointly with the rest of the config"
    ),
    moats: [true, true, true, true],
  },
  {
    pain: "13 · Prove it to auditors",
    observe: cell(
      "Arize, Langfuse — observability audit trails",
      "Traigent — captures evidence too · moat ⇒ reproducible proof of the improvement (②)"
    ),
    flag: D,
    guard: cell(
      "Avon — policy enforcement",
      "Traigent — the policy enforced by a guardrail coded into the agent, plus evidence it fires correctly"
    ),
    audit: cell(
      "Avon — governance, audit logs",
      "Traigent — reproducible proof the agent was MADE better and HOW: certificates + optimization provenance + aggXL + run plans + guardrail evidence · moat ⇒ superior improvement-proof (②)",
      { level: "red", text: "Avon leads on compliance-ops / GRC workflow (retention, GDPR, sign-off) — Traigent doesn't replace it" }
    ),
    weak: D,
    moats: [true, true, true, true],
  },
  {
    pain: "14 · Increase CONVERSION (revenue)",
    star: true,
    observe: cell(
      "Conversation-quality eval; manual A/B (generic tools)",
      "Traigent — measures conversion too · moat ⇒ optimizes DIRECTLY to it via outcome attribution — in progress (①③)"
    ),
    flag: D,
    guard: D,
    audit: cell(
      DASH,
      "Traigent — the optimization trace IS the proof (config → KPI, run plans, aggXL) · moat ⇒ reproducible, superior improvement-proof (②)"
    ),
    weak: cell(
      "manual prompt A/B",
      "Traigent — optimizes to conversion automatically, inline (outcome attribution in progress)"
    ),
    moats: [true, true, true, true],
  },
  {
    pain: "15 · Increase RESOLUTION (support)",
    star: true,
    observe: cell(
      "Arato — test / observe support agent; CSAT & resolution tracked in ticketing",
      "Traigent — measures resolution too · moat ⇒ optimizes DIRECTLY to it via outcome attribution — in progress (①③)"
    ),
    flag: D,
    guard: cell("Avon — human-in-loop"),
    audit: cell(
      DASH,
      "Traigent — the optimization trace IS the proof (config → KPI, run plans, aggXL) · moat ⇒ reproducible, superior improvement-proof (②)"
    ),
    weak: cell(
      "manual prompt A/B",
      "Traigent — optimizes to resolution automatically, inline (outcome attribution in progress)"
    ),
    moats: [true, true, true, true],
  },
  {
    pain: "16 · Not accurate / good enough",
    sub: "the universal early lead",
    star: true,
    observe: cell(
      "DeepEval, Braintrust, Arize — measure accuracy",
      "Traigent — measures accuracy too · moat ⇒ optimizes the whole config to hit it (①) — the moat"
    ),
    flag: D,
    guard: D,
    audit: cell(
      DASH,
      "Traigent — the optimization trace IS the proof (config → KPI, run plans, aggXL) · moat ⇒ reproducible, superior improvement-proof (②)"
    ),
    weak: cell(
      "DeepEval GEPA, Opik — prompt-only optimization",
      "Traigent — whole-config (model + prompt + params + RAG), not prompt-only, embedded in the agent"
    ),
    moats: [true, true, true, true],
  },
];

// Display order: most common + most painful first. Values are the ORIGINAL pain
// numbers in each row's label; rows are sorted by this order and renumbered
// 1..N at render time (so merging/removing a row needs no relabeling here).
const RANK_ORDER = [16, 2, 3, 1, 6, 9, 8, 4, 5, 10, 14, 15, 12, 11, 7, 13];
const painNum = (r) => parseInt(r.pain, 10);
const orderedRows = () =>
  [...ROWS].sort((a, b) => RANK_ORDER.indexOf(painNum(a)) - RANK_ORDER.indexOf(painNum(b)));

const SOLUTION_COLS = [
  { key: "observe", label: "Observe / Measure", note: "market = dashboards / eval · Traigent measures it too, to drive optimization" },
  { key: "flag", label: "Flag / Alert / Gate", note: "market = alerts / gates · Traigent signals from its own pass-rate / difficulty" },
  { key: "guard", label: "External Guardrail", note: "market = generic bolt-on layer · Traigent = fitted & coded INTO the agent" },
  { key: "audit", label: "Audit / Compliance Proof", note: "market = a few runtime logs · Traigent = its optimization trace IS the proof, wherever it optimizes (②)" },
  { key: "weak", label: "Partial agent change", note: "market = single lever, in isolation / external · Traigent does each inline & jointly" },
];

const MOAT_COLS = [
  { label: "① Builds a better agent", note: "does EVERY lever — prompt · model · routing · RAG · distill — jointly & inline, to your objective (certified)" },
  { label: "② Complete trace & PROOF of the improvement", note: "aggXL + run plans + artifacts" },
  { label: "③ Privileged inside info", note: "via your local coding agent" },
  {
    label: "④ Privacy-preserving",
    note: "optimizes without ever seeing your data — only KPI scores + config",
    disclaimer: "DISCLAIMER: this edge shrinks (or vanishes) once observe / flag are turned on, since those DO expose data — strongest when observability isn't needed",
  },
];

function SolCell({ cell: c }) {
  const hasComp = c && c.v && c.v !== DASH;
  const hasTrai = c && c.tr;
  if (!hasComp && !hasTrai) {
    return <td className="border border-slate-800 px-2 py-2 text-center align-middle text-slate-600">—</td>;
  }
  // Split "... · moat ⇒ ..." (or a bare "moat ⇒ ...") so the moat pointer
  // renders on its own line.
  let traiPart = null;
  let moatPart = null;
  if (hasTrai) {
    if (c.tr.startsWith("moat ⇒")) {
      moatPart = c.tr.replace(/^moat ⇒\s*/, "");
    } else {
      const parts = c.tr.split(/\s*·\s*moat ⇒\s*/);
      traiPart = parts[0];
      moatPart = parts[1] || null;
    }
  }
  return (
    <td
      className={`border px-2 py-2 align-top text-[12px] leading-snug bg-slate-900/40 ${
        hasTrai ? "border-emerald-500/40" : "border-slate-800"
      }`}
    >
      {hasComp ? (
        <div className="text-slate-300">{c.v}</div>
      ) : (
        hasTrai && <div className="text-slate-300 italic">No equivalent competitor offering</div>
      )}
      {c.adv && (
        <div
          className={`mt-1 text-[11px] font-semibold ${
            c.adv.level === "red" ? "text-red-400" : "text-yellow-400"
          }`}
        >
          ⚠ {c.adv.text}
        </div>
      )}
      {traiPart && (
        <div className="text-emerald-200 font-medium mt-1.5 pt-1.5 border-t border-emerald-500/30">
          {traiPart}
        </div>
      )}
      {moatPart && (
        <div
          className={`text-emerald-300 font-semibold ${
            traiPart ? "mt-1" : "mt-1.5 pt-1.5 border-t border-emerald-500/30"
          }`}
        >
          <span className="font-bold text-emerald-400">moat ⇒</span> {moatPart}
        </div>
      )}
    </td>
  );
}

function MoatCell({ on }) {
  return (
    <td
      className={`border text-center align-middle text-lg font-bold ${
        on
          ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
          : "border-slate-800 bg-slate-950 text-slate-800"
      }`}
    >
      {on ? "✓" : ""}
    </td>
  );
}

export default function MoatMatrix() {
  const tally = [0, 0, 0, 0];
  ROWS.forEach((r) => r.moats.forEach((m, i) => (tally[i] += m ? 1 : 0)));

  return (
    <div className="min-h-screen bg-[#080808] text-slate-200 px-4 py-6">
      {/* Hidden, unlinked internal page — keep it out of search results. */}
      <Helmet>
        <title>Traigent — Moat Matrix (internal)</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="max-w-[1560px] mx-auto">
        {/* Title */}
        <div className="rounded-t-lg bg-[#1F2A44] px-5 py-3">
          <h1 className="text-xl md:text-2xl font-bold text-white">
            Pains × Solution Types — who does WHAT, and the 3 moats where Traigent structurally wins
          </h1>
        </div>
        <p className="text-[13px] text-slate-400 italic px-5 py-2 bg-slate-900/50">
          The market <b>Observes / Flags / Guards / Audits</b> the <i>symptom</i>, and at most makes a <b>partial, single-lever</b>{" "}
          change to the agent (a prompt tweak, a route, a model swap). Traigent's <b>3 moats</b> on the right are what only it does —
          starting with actually <b>building a better agent</b>, whole-config. Flagged per pain where each applies significantly.
        </p>
        <p className="text-[12px] text-slate-500 px-5 pb-3 bg-slate-900/50">
          Legend: <span className="text-emerald-300">green + ✓ = Traigent</span> ·
          <span className="text-red-400">red = competitor genuinely ahead</span> ·
          <span className="text-yellow-400">yellow = they lead this cell, but a moat wins the pain</span> ·
          “—” = not pertinent · <span className="text-amber-300">★</span> = universal-lead pain
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead className="sticky top-0 z-10">
              <tr>
                <th className="border border-slate-800 bg-[#1F2A44] text-white text-sm px-3 py-2 w-[190px]" rowSpan={2}>
                  Customer complaint<br /><span className="text-slate-400 font-normal">(compelling event / entry point)</span>
                </th>
                <th className="border border-slate-700 bg-[#2F5597] text-white text-sm font-bold px-3 py-2 text-center" colSpan={5}>
                  WHAT THE MARKET OFFERS — SYMPTOM TOOLS &amp; PARTIAL AGENT CHANGE{" "}
                  <span className="font-normal text-slate-200">(competitors in white · Traigent in green where it also plays)</span>
                </th>
                <th className="border border-emerald-800 bg-[#2e6b34] text-white text-sm font-bold px-3 py-2 text-center" colSpan={4}>
                  TRAIGENT'S MOATS <span className="font-normal text-emerald-100">(✓ = applies significantly)</span>
                </th>
              </tr>
              <tr>
                {SOLUTION_COLS.map((col) => (
                  <th key={col.key} className="border border-slate-700 bg-[#2F5597] text-white text-[12px] font-semibold px-2 py-2 align-top w-[155px]">
                    {col.label}
                    <div className="text-[10px] font-normal text-slate-200/80">{col.note}</div>
                  </th>
                ))}
                {MOAT_COLS.map((col, i) => (
                  <th key={i} className="border border-emerald-800 bg-[#2e6b34] text-white text-[11px] font-semibold px-2 py-2 align-top w-[118px]">
                    {col.label}
                    {col.note && <div className="text-[10px] font-normal text-emerald-100/80">{col.note}</div>}
                    {col.disclaimer && (
                      <div className="text-[10px] font-semibold text-orange-300 mt-1">{col.disclaimer}</div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orderedRows().map((r, idx) => (
                <tr key={idx} className="odd:bg-slate-950/30">
                  <td className="border border-slate-800 bg-[#151a26] px-3 py-2 align-top w-[190px]">
                    <div className="font-bold text-[13px] text-white">
                      {idx + 1} · {r.pain.replace(/^\d+\s*·\s*/, "")} {r.star && <span className="text-amber-300">★</span>}
                    </div>
                    {r.sub && <div className="text-[11px] text-slate-400 italic mt-0.5">{r.sub}</div>}
                  </td>
                  {SOLUTION_COLS.map((col) => (
                    <SolCell key={col.key} cell={r[col.key]} />
                  ))}
                  {r.moats.map((m, i) => (
                    <MoatCell key={i} on={m} />
                  ))}
                </tr>
              ))}
              <tr>
                <td className="border border-slate-800 bg-[#151a26] px-3 py-2 text-right text-[12px] font-bold text-slate-300" colSpan={6}>
                  Moat coverage (of 16 pains) →
                </td>
                {tally.map((n, i) => (
                  <td key={i} className="border border-emerald-800 bg-[#2e6b34] text-center text-white font-bold text-sm py-2">
                    {n}/16
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Takeaway */}
        <div className="bg-[#1F2A44] px-5 py-3 border-t border-slate-700">
          <p className="text-sm font-semibold text-white">
            Takeaway: the market observes, flags, guards or audits the <span className="italic">symptom</span>, and at best tweaks a{" "}
            <span className="italic">single lever</span>. Traigent is the only one that <span className="text-emerald-300">builds a
            better agent whole-config</span>, <span className="text-emerald-300">proves the improvement end-to-end</span> (aggXL + run
            plans), leverages <span className="text-emerald-300">privileged context</span> via your own coding agent, and does it all
            <span className="text-emerald-300"> privately</span> — without ever seeing your data. Those four moats are the defensible core.
          </p>
        </div>

        {/* Footnote */}
        <p className="rounded-b-lg bg-slate-900/50 text-[11px] text-slate-500 px-5 py-3 leading-relaxed">
          Partial agent change = a single lever only (prompt · routing · model swap). Open-source optimizers <b>DSPy</b> and{" "}
          <b>TextGrad</b> live here too — they optimize prompts / programs for one metric, but not multi-objective cost / quality /
          latency, private guardrail fitting, or a governed certificate. Crucially, Traigent does <i>every one of these levers too</i> —
          but inline on the agent and jointly (so they can't fight each other), which is exactly moat ①; the market does them one lever
          at a time or as an external layer. Guardrails are all a generic layer around the model — out-of-process (Llama Guard, Avon)
          or in-process library (NeMo, Guardrails AI); only Traigent fits and embeds the guardrail inside the agent itself.
          Same on audit: competitors log what the agent <i>did</i> at runtime; Traigent proves what was <i>improved</i> and how,
          reproducibly (moat ②). Pure compliance-ops workflow (data retention, GDPR / GRC, review sign-off) stays a governance-suite
          domain — partner there.
        </p>
      </div>
    </div>
  );
}
