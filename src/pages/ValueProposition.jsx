import { motion } from "framer-motion";
import { Zap, TrendingUp, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const FadeInView = ({ children, className, delay = 0 }) => (
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

const DifficultyBadge = ({ level }) => {
  const styles = {
    hard: "bg-red-500/15 text-red-400",
    medium: "bg-yellow-500/15 text-yellow-400",
    easy: "bg-blue-500/15 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]"
  };
  return (
    <span className={`text-[8px] px-1.5 py-0.5 rounded uppercase tracking-wide font-mono ${styles[level]}`}>
      {level}
    </span>
  );
};

// Cyberpunk Neon Scale Graph Component
const ScaleGraph = () => {
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (delay) => ({
      pathLength: 1,
      opacity: 1,
      transition: { duration: 2, delay, ease: "easeInOut" }
    })
  };

  const fadeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (delay) => ({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, delay }
    })
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <svg viewBox="0 0 800 460" className="w-full h-auto">
        <defs>
          {/* Neon glow filters */}
          <filter id="glowBlue" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feFlood floodColor="#3b82f6" floodOpacity="0.8"/>
            <feComposite in2="blur" operator="in"/>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="glowPurple" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feFlood floodColor="#a855f7" floodOpacity="0.8"/>
            <feComposite in2="blur" operator="in"/>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="glowRed" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur"/>
            <feFlood floodColor="#ef4444" floodOpacity="0.9"/>
            <feComposite in2="blur" operator="in"/>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="glowGray" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feFlood floodColor="#94a3b8" floodOpacity="0.6"/>
            <feComposite in2="blur" operator="in"/>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="glowCyan" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur"/>
            <feFlood floodColor="#22d3ee" floodOpacity="0.8"/>
            <feComposite in2="blur" operator="in"/>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Zone backgrounds */}
          <linearGradient id="rightZoneGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent"/>
            <stop offset="100%" stopColor="rgba(127, 29, 29, 0.15)"/>
          </linearGradient>

          {/* Radial gradients for image glow */}
          <radialGradient id="blueRadial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6"/>
            <stop offset="70%" stopColor="#1e40af" stopOpacity="0.2"/>
            <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="purpleRadial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.5"/>
            <stop offset="70%" stopColor="#6b21a8" stopOpacity="0.15"/>
            <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="redRadial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.7"/>
            <stop offset="70%" stopColor="#991b1b" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
          </radialGradient>

          {/* Arrowhead markers */}
          <marker id="arrowRed" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#ef4444"/>
          </marker>
          <marker id="arrowGray" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#64748b"/>
          </marker>
          <marker id="arrowDarkRed" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#991b1b"/>
          </marker>
        </defs>

        {/* Deep black background */}
        <rect x="0" y="0" width="800" height="450" fill="#000000"/>

        {/* Right zone red tint */}
        <rect x="533" y="120" width="237" height="280" fill="url(#rightZoneGradient)"/>

        {/* Subtle grid */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line key={`h-${i}`} x1="50" y1={170 + i * 40} x2="750" y2={170 + i * 40} stroke="#1a1a2e" strokeWidth="1" />
        ))}

        {/* Zone dividers - dashed lines */}
        <line x1="300" y1="120" x2="300" y2="400" stroke="#334155" strokeWidth="1" strokeDasharray="8,4" />
        <line x1="533" y1="120" x2="533" y2="400" stroke="#4a1515" strokeWidth="1" strokeDasharray="8,4" />

        {/* Axes */}
        <line x1="50" y1="370" x2="750" y2="370" stroke="#374151" strokeWidth="2" />
        <line x1="50" y1="170" x2="50" y2="370" stroke="#374151" strokeWidth="2" />

        {/* Axis labels */}
        <text x="400" y="420" textAnchor="middle" fill="#4b5563" fontSize="11" fontFamily="monospace" letterSpacing="1">
          LOAD (REQ/SEC • DATA VOLUME • COMPLEXITY) →
        </text>
        <text x="20" y="270" textAnchor="middle" fill="#4b5563" fontSize="11" fontFamily="monospace" letterSpacing="1" transform="rotate(-90, 20, 270)">
          EFFICIENCY
        </text>

        {/* ===== ANDROID ILLUSTRATIONS - Image placeholders ===== */}

        {/* Left Zone - Happy Blue Android */}
        <motion.g variants={fadeVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.5}>
          {/* Glow effect behind image */}
          <circle cx="175" cy="70" r="50" fill="url(#blueRadial)" opacity="0.6"/>
          <image
            href={`${import.meta.env.BASE_URL}images/robot-happy.png`}
            x="120" y="15"
            width="110" height="110"
            preserveAspectRatio="xMidYMid meet"
          />
        </motion.g>

        {/* Middle Zone - Confused Purple Android */}
        <motion.g variants={fadeVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
          {/* Glow effect behind image */}
          <circle cx="416" cy="70" r="50" fill="url(#purpleRadial)" opacity="0.5"/>
          <image
            href={`${import.meta.env.BASE_URL}images/robot-confused.png`}
            x="361" y="15"
            width="110" height="110"
            preserveAspectRatio="xMidYMid meet"
          />
        </motion.g>

        {/* Right Zone - Error Red Android */}
        <motion.g variants={fadeVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1.5}>
          {/* Glow effect behind image */}
          <circle cx="641" cy="70" r="50" fill="url(#redRadial)" opacity="0.6"/>
          <image
            href={`${import.meta.env.BASE_URL}images/robot-error.png`}
            x="586" y="15"
            width="110" height="110"
            preserveAspectRatio="xMidYMid meet"
          />
        </motion.g>

        {/* ===== CURVES with enhanced glow ===== */}

        {/* AI SDLC curve - dark red, starts high, drops strongly - GLOW LAYER */}
        <motion.path
          d="M 60 180 C 120 182, 180 195, 240 215 C 300 235, 360 270, 420 305 C 480 340, 540 355, 600 360 C 660 365, 700 367, 740 368"
          fill="none"
          stroke="#991b1b"
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.4"
          filter="url(#glowRed)"
          variants={pathVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.2}
        />
        {/* AI SDLC curve - main line */}
        <motion.path
          d="M 60 180 C 120 182, 180 195, 240 215 C 300 235, 360 270, 420 305 C 480 340, 540 355, 600 360 C 660 365, 700 367, 740 368"
          fill="none"
          stroke="#dc2626"
          strokeWidth="3"
          strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.2}
        />

        {/* Credibility curve - dark gray - GLOW LAYER */}
        <motion.path
          d="M 60 195 C 140 198, 220 210, 300 235 C 380 260, 460 290, 540 315 C 620 340, 680 350, 740 355"
          fill="none"
          stroke="#6b7280"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.3"
          filter="url(#glowGray)"
          variants={pathVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.4}
        />
        {/* Credibility curve - main line */}
        <motion.path
          d="M 60 195 C 140 198, 220 210, 300 235 C 380 260, 460 290, 540 315 C 620 340, 680 350, 740 355"
          fill="none"
          stroke="#9ca3af"
          strokeWidth="2.5"
          strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.4}
        />

        {/* Quality curve - bright gray - GLOW LAYER */}
        <motion.path
          d="M 60 210 C 140 215, 220 235, 300 260 C 380 285, 460 310, 540 332 C 620 354, 680 360, 740 362"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.4"
          filter="url(#glowGray)"
          variants={pathVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.6}
        />
        {/* Quality curve - main line */}
        <motion.path
          d="M 60 210 C 140 215, 220 235, 300 260 C 380 285, 460 310, 540 332 C 620 354, 680 360, 740 362"
          fill="none"
          stroke="#f1f5f9"
          strokeWidth="2.5"
          strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.6}
        />

        {/* Cost curve - bright red - GLOW LAYER (strongest glow) - exponential growth y=2^x */}
        <motion.path
          d="M 60 365 C 200 364, 350 362, 450 358 C 530 352, 580 330, 620 280 C 660 220, 700 180, 740 168"
          fill="none"
          stroke="#ef4444"
          strokeWidth="12"
          strokeLinecap="round"
          opacity="0.5"
          filter="url(#glowRed)"
          variants={pathVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.8}
        />
        {/* Cost curve - main line */}
        <motion.path
          d="M 60 365 C 200 364, 350 362, 450 358 C 530 352, 580 330, 620 280 C 660 220, 700 180, 740 168"
          fill="none"
          stroke="#f87171"
          strokeWidth="4"
          strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.8}
        />

        {/* Zone labels at bottom */}
        <text x="175" y="395" textAnchor="middle" fill="#3b82f6" fontSize="10" fontFamily="monospace" fontWeight="600" letterSpacing="1">OPTIMAL</text>
        <text x="416" y="395" textAnchor="middle" fill="#a855f7" fontSize="10" fontFamily="monospace" fontWeight="600" letterSpacing="1">DEGRADING</text>
        <text x="641" y="395" textAnchor="middle" fill="#ef4444" fontSize="10" fontFamily="monospace" fontWeight="600" letterSpacing="1" filter="url(#glowRed)">CRITICAL</text>

        {/* ===== COMPACT LEGEND - Bottom ===== */}
        <motion.g initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 2.5 }}>
          {/* AI SDLC - dark red with glow */}
          <line x1="85" y1="438" x2="110" y2="438" stroke="#991b1b" strokeWidth="6" strokeLinecap="round" opacity="0.4" filter="url(#glowRed)"/>
          <line x1="85" y1="438" x2="110" y2="438" stroke="#dc2626" strokeWidth="3" strokeLinecap="round"/>
          <text x="118" y="441" fill="#dc2626" fontSize="9" fontFamily="monospace" fontWeight="500">AI SDLC</text>

          {/* Credibility - gray */}
          <line x1="200" y1="438" x2="225" y2="438" stroke="#6b7280" strokeWidth="5" strokeLinecap="round" opacity="0.3" filter="url(#glowGray)"/>
          <line x1="200" y1="438" x2="225" y2="438" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round"/>
          <text x="233" y="441" fill="#9ca3af" fontSize="9" fontFamily="monospace" fontWeight="500">Credibility</text>

          {/* Quality - bright white/gray */}
          <line x1="330" y1="438" x2="355" y2="438" stroke="#e2e8f0" strokeWidth="5" strokeLinecap="round" opacity="0.4" filter="url(#glowGray)"/>
          <line x1="330" y1="438" x2="355" y2="438" stroke="#f1f5f9" strokeWidth="2.5" strokeLinecap="round"/>
          <text x="363" y="441" fill="#f1f5f9" fontSize="9" fontFamily="monospace" fontWeight="500">Quality</text>

          {/* Cost - bright red with strong glow */}
          <line x1="445" y1="438" x2="470" y2="438" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" opacity="0.5" filter="url(#glowRed)"/>
          <line x1="445" y1="438" x2="470" y2="438" stroke="#f87171" strokeWidth="4" strokeLinecap="round"/>
          <text x="478" y="441" fill="#f87171" fontSize="9" fontFamily="monospace" fontWeight="500">Cost</text>
        </motion.g>
      </svg>
    </div>
  );
};

const LifecycleRow = ({ step, before, after, difficulty, beforeDiff, afterDiff, same, highlight, beforeWidth = "w-14", afterWidth = "w-14" }) => (
  <div className={`grid grid-cols-[180px_1fr_1fr] gap-4 px-3 py-1.5 items-center ${highlight ? "bg-blue-500/5 rounded-md border border-blue-500/10 -mx-3 px-6" : ""}`}>
    <div className="text-xs text-white font-medium truncate">{step}</div>
    <div className="flex items-center gap-2">
      <div className={`h-5 rounded flex items-center px-2 ${same ? "bg-slate-700" : "bg-gradient-to-r from-red-400 to-red-300"} ${same ? beforeWidth : beforeWidth}`}>
        <span className={`text-[9px] font-mono font-medium ${same ? "text-slate-400" : "text-slate-900"}`}>{before}</span>
      </div>
      {(difficulty || beforeDiff) && <DifficultyBadge level={beforeDiff || difficulty} />}
    </div>
    <div className="flex items-center gap-2">
      <div className={`h-5 rounded flex items-center px-2 ${same ? "bg-slate-700" : "bg-gradient-to-r from-blue-500 to-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]"} ${same ? afterWidth : afterWidth}`}>
        <span className={`text-[9px] font-mono font-medium ${same ? "text-slate-400" : "text-slate-900"}`}>{after}</span>
      </div>
      {afterDiff && <DifficultyBadge level={afterDiff} />}
    </div>
  </div>
);

export default function ValueProposition() {
  return (
    <div className="bg-slate-950 text-white min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-br from-slate-950 to-indigo-950 py-12 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-6">
          <FadeInView>
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/057ce2_TraigentLogoWhiteCropped.png"
              alt="Traigent Logo"
              className="h-14 mb-6"
            />
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              The First <span className="text-indigo-400">AI Agents Continuous Optimization</span> Infrastructure
            </h1>
            <p className="text-xl text-slate-300">
              Building AI agents is easy; making them production-ready is not.
            </p>
          </FadeInView>
        </div>
      </header>

      {/* Graph Section */}
      <section className="py-12 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-6">
          <FadeInView>
            <h2 className="text-2xl font-bold mb-2 text-center">Do You <span className="text-red-400">TRUST</span> Your AI Agent at Scale?</h2>
            <p className="text-slate-400 mb-8 text-center">Building AI agents is easy; making them production-ready is not.</p>
          </FadeInView>

          {/* Animated Graph */}
          <FadeInView className="mb-12">
            <ScaleGraph />
          </FadeInView>

          {/* Problem & Solution Side by Side */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* The Problem */}
            <FadeInView delay={0.1} className="bg-slate-900 rounded-xl p-6 border border-red-500/30">
              <h2 className="text-red-400 font-bold text-xl md:text-2xl mb-4">The Problem</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">✗</span>
                  <p className="text-slate-200 text-sm"><strong>Credibility gaps:</strong> Exploding config space</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">✗</span>
                  <p className="text-slate-200 text-sm"><strong>Inefficiency:</strong> 95% of configs are suboptimal</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">✗</span>
                  <p className="text-slate-200 text-sm"><strong>Quality & Safety:</strong> Risks in production</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">✗</span>
                  <p className="text-slate-200 text-sm"><strong>Wasted time:</strong> Manual tuning drains cycles</p>
                </li>
              </ul>
            </FadeInView>

            {/* The Solution */}
            <FadeInView delay={0.2} className="bg-slate-900 rounded-xl p-6 border border-emerald-500/30">
              <h2 className="text-emerald-400 font-bold text-xl md:text-2xl mb-4">The Solution</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <p className="text-slate-200 text-sm"><strong>Credibility:</strong> Configs backed by data</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <p className="text-slate-200 text-sm"><strong>Efficiency:</strong> Top 5% performance tier</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <p className="text-slate-200 text-sm"><strong>Quality & Safety:</strong> Guardrails built in</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <p className="text-slate-200 text-sm"><strong>40-60% faster:</strong> Reduced time-to-market</p>
                </li>
              </ul>
            </FadeInView>
          </div>
        </div>
      </section>

      {/* Lifecycle Comparison */}
      <section className="py-12 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <FadeInView>
            <h2 className="text-2xl font-bold mb-2">AI Agent Development <span className="text-blue-400">Lifecycle</span></h2>
            <p className="text-slate-400 text-sm mb-6">Timeline comparison: Before vs. With Traigent</p>
          </FadeInView>

          {/* Legend */}
          <div className="flex gap-6 mb-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-400"></div>
              <span className="text-slate-400">Before Traigent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
              <span className="text-slate-400">With Traigent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gray-600"></div>
              <span className="text-slate-400">Unchanged</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_280px] gap-8">
            {/* Timeline */}
            <div className="space-y-4">
              {/* Header */}
              <div className="grid grid-cols-[180px_1fr_1fr] gap-4 px-3 text-[10px] uppercase tracking-wider text-slate-500">
                <span>Step</span>
                <span className="text-red-400">Before</span>
                <span className="text-blue-400">With Traigent</span>
              </div>

              {/* Planning Phase */}
              <div>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/50 rounded-md mb-2">
                  <span>📋</span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-purple-400">Planning</span>
                </div>
                <LifecycleRow step="Problem Definition" before="1-5d" after="Same" difficulty="medium" same />
                <LifecycleRow step="Architecture Design" before="1-2w" after="Same" difficulty="medium" same />
              </div>

              {/* Building Phase */}
              <div>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/50 rounded-md mb-2">
                  <span>🔧</span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-blue-400">Building</span>
                </div>
                <LifecycleRow step="Data Preparation" before="2-6w" after="Same" difficulty="hard" same />
                <LifecycleRow step="Prompt Engineering" before="3-8 weeks" after="<1w" beforeDiff="hard" afterDiff="easy" highlight beforeWidth="w-48" afterWidth="w-12" />
                <LifecycleRow step="Core Development" before="1-4 weeks" after="<1w" beforeDiff="medium" afterDiff="easy" highlight beforeWidth="w-32" afterWidth="w-12" />
                <LifecycleRow step="UX Design" before="2d-2w" after="Same" difficulty="easy" same />
              </div>

              {/* Testing Phase */}
              <div>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/50 rounded-md mb-2">
                  <span>🛡️</span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-yellow-400">Testing & Safety</span>
                </div>
                <LifecycleRow step="Evaluation & Benchmarking" before="1-6 weeks" after="<1w" beforeDiff="hard" afterDiff="easy" highlight beforeWidth="w-40" afterWidth="w-12" />
                <LifecycleRow step="Safety & Guardrails" before="2-4 weeks" after="<1w" beforeDiff="hard" afterDiff="easy" highlight beforeWidth="w-32" afterWidth="w-12" />
              </div>

              {/* Launch Phase */}
              <div>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/50 rounded-md mb-2">
                  <span>🚀</span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-blue-400">Launch</span>
                </div>
                <LifecycleRow step="Deployment & Monitoring" before="1-5d" after="Same" difficulty="easy" same />
              </div>
            </div>

            {/* Summary Panel */}
            <div className="space-y-4">
              {/* Time to Market */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
                <div className="text-xs font-semibold text-slate-400 mb-3">Total Time to Market</div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold font-mono text-red-400">12-34w</div>
                    <div className="text-[10px] text-slate-500 uppercase mt-1">Before</div>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/40 rounded-lg p-3 text-center shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                    <div className="text-xl font-bold font-mono text-blue-400">7-18w</div>
                    <div className="text-[10px] text-slate-500 uppercase mt-1">With Traigent</div>
                  </div>
                </div>
              </div>

              {/* Ongoing Iteration */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
                <div className="text-xs font-semibold text-slate-400 mb-3">Ongoing Iteration & Improvement</div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold font-mono text-red-400">0.5</div>
                    <div className="text-[10px] text-slate-500 uppercase mt-1">Person/Week</div>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/40 rounded-lg p-3 text-center shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                    <div className="text-xl font-bold font-mono text-blue-400">0.25</div>
                    <div className="text-[10px] text-slate-500 uppercase mt-1">Person/Week</div>
                  </div>
                </div>
              </div>

              {/* Time Saved Badge */}
              <div className="bg-blue-500/10 border border-blue-500/40 rounded-lg p-4 text-center shadow-[0_0_25px_rgba(59,130,246,0.25)]">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Time Saved</span>
                <div className="text-2xl font-bold font-mono text-blue-400 mt-1">40-60%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 border-b border-slate-800 bg-slate-900/30">
        <div className="max-w-5xl mx-auto px-6">
          <FadeInView>
            <h2 className="text-2xl font-bold mb-8">How It Works</h2>
          </FadeInView>
          <div className="relative">
            {/* Flow Diagram */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
              {/* Input Box */}
              <FadeInView delay={0.1} className="md:col-span-2 bg-slate-800 rounded-xl p-5 border border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-blue-400 text-lg">📥</span>
                  </div>
                  <h4 className="font-bold text-white">Input</h4>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-slate-300">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                    Prompts & Models
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                    Eval Data & KPIs
                  </li>
                </ul>
              </FadeInView>

              {/* Arrow 1 */}
              <div className="hidden md:flex justify-center">
                <ArrowRight className="w-6 h-6 text-blue-400" />
              </div>

              {/* Center - Traigent Engine */}
              <FadeInView delay={0.2} className="md:col-span-1 flex justify-center">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <span className="text-3xl">⚡</span>
                  </div>
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="text-xs text-blue-400 font-semibold">TRAIGENT</span>
                  </div>
                </div>
              </FadeInView>

              {/* Arrow 2 */}
              <div className="hidden md:flex justify-center">
                <ArrowRight className="w-6 h-6 text-emerald-400" />
              </div>

              {/* Output Box */}
              <FadeInView delay={0.3} className="md:col-span-2 bg-slate-800 rounded-xl p-5 border border-emerald-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-emerald-400 text-lg">📤</span>
                  </div>
                  <h4 className="font-bold text-white">Output</h4>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-slate-300">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                    Optimized Configs
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                    Evidence-backed Reports
                  </li>
                </ul>
              </FadeInView>
            </div>

            {/* Mobile arrows */}
            <div className="flex md:hidden justify-center my-4">
              <div className="flex flex-col items-center gap-2 text-blue-400">
                <span className="rotate-90">→</span>
                <span className="text-xs">TRAIGENT</span>
                <span className="rotate-90">→</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Users */}
      <section className="py-12 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-6">
          <FadeInView>
            <h2 className="text-2xl font-bold mb-6">Who It's For</h2>
          </FadeInView>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Users className="w-5 h-5" />, title: "AI Engineers", desc: "SDK integration for code-first optimization" },
              { icon: <TrendingUp className="w-5 h-5" />, title: "No-Code Users", desc: "Studio interface for visual configuration" },
              { icon: <Zap className="w-5 h-5" />, title: "Business Stakeholders", desc: "Goals & ROI tracking with clear metrics" }
            ].map((item, i) => (
              <FadeInView key={i} delay={i * 0.1} className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-indigo-400 flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </div>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-12 border-b border-slate-800 bg-slate-900/30">
        <div className="max-w-5xl mx-auto px-6">
          <FadeInView>
            <h2 className="text-2xl font-bold mb-6">Built By Engineers, For Engineers</h2>
          </FadeInView>
          <div className="grid md:grid-cols-2 gap-8">
            <FadeInView delay={0.1}>
              <h3 className="font-semibold text-lg">Dr. Nimrod Busany</h3>
              <p className="text-indigo-400 text-sm mb-2">Co-founder, CTO</p>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>15+ years Research in Industry & Academy</li>
                <li>Research group lead at Accenture Labs</li>
                <li>20+ Publications & Patents</li>
                <li>IEEE/ACM Committee Member</li>
              </ul>
            </FadeInView>
            <FadeInView delay={0.2}>
              <h3 className="font-semibold text-lg">Achi Solomon</h3>
              <p className="text-indigo-400 text-sm mb-2">Co-founder, CEO</p>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>15+ years R&D Leader (Infra, Backend, DevOps, SRE)</li>
                <li>Improved Time-To-Market from months to days</li>
                <li>Reduced cloud spend by 40%, raised availability to 99.9%</li>
                <li>Expert in scalable cloud-native platforms</li>
              </ul>
            </FadeInView>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-gradient-to-br from-indigo-900/30 to-purple-900/30">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <FadeInView>
            <h2 className="text-2xl font-bold mb-3">See These Results On Your System</h2>
            <p className="text-slate-300 mb-6">1-week POC to compare results vs. your benchmark</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://cal.com/nimrod-busany"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-white text-slate-900 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium"
              >
                Request a Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <Link
                to="/"
                className="inline-flex items-center bg-transparent border border-slate-600 text-slate-200 hover:bg-white/5 px-6 py-3 rounded-lg font-medium"
              >
                Back to Homepage
              </Link>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-6 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Traigent Ltd. All rights reserved.</p>
          <p className="mt-2">
            <a href="mailto:nimrod@traigent.ai" className="hover:text-white">nimrod@traigent.ai</a>
            {" | "}
            <a href="mailto:achi@traigent.ai" className="hover:text-white">achi@traigent.ai</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
