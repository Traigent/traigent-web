/**
 * Shared Problem/Solution comparison section
 * Used by OnePager and ValueProposition pages
 */

const problemItems = [
  { label: "Credibility gaps:", text: "Exploding config space" },
  { label: "Inefficiency:", text: "95% of configs are suboptimal" },
  { label: "Quality & Safety:", text: "Risks in production" },
  { label: "Wasted time:", text: "Manual tuning drains cycles" },
];

const solutionItems = [
  { label: "Credibility:", text: "Configs backed by data" },
  { label: "Efficiency:", text: "Top 5% performance tier" },
  { label: "Quality & Safety:", text: "Guardrails built in" },
  { label: "40-60% faster:", text: "Reduced time-to-market" },
];

const ListItem = ({ icon, iconColor, label, text }) => (
  <li className="flex items-center gap-2">
    <span className={`${iconColor} text-sm flex-shrink-0`}>{icon}</span>
    <p className="text-slate-200 text-sm">
      <strong>{label}</strong> {text}
    </p>
  </li>
);

export const ProblemCard = ({ showImage = false, className = "" }) => (
  <div className={`bg-slate-900 rounded-xl p-6 border border-red-500/30 ${className}`}>
    <div className={`flex ${showImage ? "items-center gap-4" : ""} mb-4`}>
      {showImage && (
        <img
          src={`${import.meta.env.BASE_URL}images/robot-error.png`}
          alt="AI Agent Error"
          className="w-16 h-16 rounded-lg object-cover"
        />
      )}
      <div>
        <h2 className="text-red-400 font-bold text-xl md:text-2xl">The Problem</h2>
        {showImage && <p className="text-slate-400 text-xs">AI agents break at scale</p>}
      </div>
    </div>
    <ul className="space-y-3">
      {problemItems.map((item, i) => (
        <ListItem key={i} icon="✗" iconColor="text-red-400" label={item.label} text={item.text} />
      ))}
    </ul>
  </div>
);

export const SolutionCard = ({ showImage = false, title = "The Solution", className = "" }) => (
  <div className={`bg-slate-900 rounded-xl p-6 border border-emerald-500/30 ${className}`}>
    <div className={`flex ${showImage ? "items-center gap-4" : ""} mb-4`}>
      {showImage && (
        <img
          src={`${import.meta.env.BASE_URL}images/robot-happy.png`}
          alt="Optimized AI Agent"
          className="w-16 h-16 rounded-lg object-cover"
        />
      )}
      <div>
        <h2
          className={`${title === "Traigent" ? "text-white" : "text-emerald-400"} font-bold text-xl md:text-2xl`}
        >
          {title}
        </h2>
        {showImage && <p className="text-slate-400 text-xs">Trust your AI agent at scale</p>}
      </div>
    </div>
    <ul className="space-y-3">
      {solutionItems.map((item, i) => (
        <ListItem
          key={i}
          icon="✓"
          iconColor="text-emerald-400"
          label={item.label}
          text={item.text}
        />
      ))}
    </ul>
  </div>
);

export default function ProblemSolutionSection({
  showImages = false,
  solutionTitle = "The Solution",
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
      <ProblemCard showImage={showImages} />
      <SolutionCard showImage={showImages} title={solutionTitle} />
    </div>
  );
}
