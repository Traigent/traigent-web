// Shared slide content reused by both the short deck (/pitch, Pitch.jsx) and
// the long deck (/pitch-full, PitchFull.jsx). Extracting these here keeps the
// two decks in sync — any visual change lands in both decks via one edit.

const BLUE = "#1A6BF5";
const AMBER = "#f59e0b";
const VIOLET = "#a78bfa";

/**
 * Manual-tuning-vs-Traigent convergence diagram. Used on the "killer stat"
 * slide of both decks to visualize random-search-then-stop versus
 * monotonic-convergence-to-optimum.
 */
export function ConvergenceDiagram({ className = "w-full max-w-5xl mx-auto" }) {
  return (
    <svg viewBox="0 0 1000 280" className={className}>
      {/* Left: Manual */}
      <rect x="40" y="20" width="430" height="240" rx="12" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
      <text x="255" y="55" textAnchor="middle" fill="white" fontSize="22" fontWeight="700">Manual Tuning</text>
      <text x="255" y="80" textAnchor="middle" fill="#94a3b8" fontSize="14">scattered guesses · no convergence</text>
      <line x1="60" y1="225" x2="450" y2="225" stroke="#334155" strokeWidth="0.8" />
      <line x1="60" y1="100" x2="60" y2="225" stroke="#334155" strokeWidth="0.8" />
      {[[95, 180], [135, 210], [170, 155], [210, 200], [245, 135], [280, 195], [320, 165], [355, 215], [395, 175], [430, 195]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="4" fill="#64748b" />
      ))}
      <text x="255" y="252" textAnchor="middle" fill="#475569" fontSize="13" fontFamily="monospace">5–20 guesses · weeks · no certainty</text>
      {/* Right: Traigent */}
      <rect x="510" y="20" width="450" height="240" rx="12" fill="#0f172a" stroke={BLUE} strokeWidth="2.5" />
      <text x="735" y="55" textAnchor="middle" fill="white" fontSize="22" fontWeight="700">With Traigent</text>
      <text x="735" y="80" textAnchor="middle" fill={BLUE} fontSize="14" fontWeight="600">under 10% of the space → converged to optimal</text>
      <line x1="530" y1="225" x2="940" y2="225" stroke="#334155" strokeWidth="0.8" />
      <line x1="530" y1="100" x2="530" y2="225" stroke="#334155" strokeWidth="0.8" />
      <line x1="540" y1="145" x2="930" y2="145" stroke="#4ade80" strokeWidth="0.8" strokeDasharray="4,3" opacity="0.5" />
      <text x="555" y="138" fill="#4ade80" fontSize="11" fontFamily="monospace">optimal</text>
      <path d="M 555 220 C 600 200, 640 175, 690 160 S 780 148, 830 146 S 900 145, 920 145" stroke={BLUE} strokeWidth="2.5" fill="none" />
      {[[555, 220], [595, 200], [635, 180], [680, 163], [725, 155], [770, 150], [820, 147], [870, 146]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="5" fill={BLUE} />
      ))}
      <circle cx="920" cy="145" r="8" fill="#4ade80" />
      <text x="735" y="252" textAnchor="middle" fill={BLUE} fontSize="13" fontFamily="monospace">&lt;10% of search space · hours · certain</text>
    </svg>
  );
}

/**
 * Three-card stats grid that pairs with ConvergenceDiagram on the killer-stat
 * slide: &lt;10% / Hours / Certain.
 */
export function KillerStatsGrid({ className = "grid grid-cols-3 gap-3 max-w-4xl mx-auto text-center" }) {
  return (
    <div className={className}>
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4">
        <div className="text-2xl md:text-3xl font-bold" style={{ color: BLUE }}>&lt;10%</div>
        <p className="text-slate-400 text-sm mt-1">of the search space</p>
      </div>
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4">
        <div className="text-2xl md:text-3xl font-bold" style={{ color: BLUE }}>Hours</div>
        <p className="text-slate-400 text-sm mt-1">not weeks</p>
      </div>
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4">
        <div className="text-2xl md:text-3xl font-bold" style={{ color: BLUE }}>Certain</div>
        <p className="text-slate-400 text-sm mt-1">not gut feel</p>
      </div>
    </div>
  );
}

/**
 * Three-product cards: Optimization (primary, blue), Benchmark Refinement
 * (built-in, amber), Observability (built-in, violet). Both decks use this
 * on the "Three Products In One" slide; each deck owns the heading + tagline
 * + closing copy itself so the surrounding text can be tuned per audience.
 */
export function ThreeProductsGrid() {
  return (
    <div className="grid md:grid-cols-3 gap-5">
      <div className="bg-slate-900/60 border rounded-2xl p-8" style={{ borderColor: `${BLUE}66` }}>
        <div className="text-sm font-mono mb-3" style={{ color: BLUE }}>● PRIMARY</div>
        <h3 className="text-2xl font-bold text-white mb-4">Optimization</h3>
        <ul className="space-y-2 text-slate-300 text-base">
          <li>Auto-finds best config</li>
          <li>Converges in &lt;10% of the search space</li>
          <li>Multi-KPI weighted</li>
        </ul>
      </div>
      <div className="bg-slate-900/60 border rounded-2xl p-8" style={{ borderColor: `${AMBER}66` }}>
        <div className="text-sm font-mono mb-3" style={{ color: AMBER }}>● BUILT IN</div>
        <h3 className="text-2xl font-bold text-white mb-4">Benchmark Refinement</h3>
        <ul className="space-y-2 text-slate-300 text-base">
          <li>Flags useless test cases</li>
          <li>Shorter, sharper benchmarks</li>
          <li>Compounds over time</li>
        </ul>
      </div>
      <div className="bg-slate-900/60 border rounded-2xl p-8" style={{ borderColor: `${VIOLET}66` }}>
        <div className="text-sm font-mono mb-3" style={{ color: VIOLET }}>● BUILT IN</div>
        <h3 className="text-2xl font-bold text-white mb-4">Observability</h3>
        <ul className="space-y-2 text-slate-300 text-base">
          <li>Full trace tree per run</li>
          <li>Tokens · cost · latency</li>
          <li>No separate stack needed</li>
        </ul>
      </div>
    </div>
  );
}
