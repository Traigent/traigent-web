import { ArrowRight } from "lucide-react";

/**
 * Reusable Flow Diagram component showing Input → Traigent → Output
 * @param {Object} props
 * @param {string} props.variant - "light" for Homepage (white bg), "dark" for OnePager (dark bg)
 */
export default function FlowDiagram({ variant = "light" }) {
  const isDark = variant === "dark";

  const boxBg = isDark ? "bg-slate-800" : "bg-slate-900";
  const arrowColor1 = isDark ? "text-blue-400" : "text-blue-500";
  const arrowColor2 = isDark ? "text-emerald-400" : "text-emerald-500";
  const mobileTextColor = isDark ? "text-blue-400" : "text-indigo-600";

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
        {/* Input Box */}
        <div className={`md:col-span-2 ${boxBg} rounded-xl p-5 border border-slate-700`}>
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
        </div>

        {/* Arrow 1 */}
        <div className="hidden md:flex justify-center">
          <ArrowRight className={`w-6 h-6 ${arrowColor1}`} />
        </div>

        {/* Center - Traigent Engine */}
        <div className="md:col-span-1 flex justify-center">
          <div className="relative">
            <div className={isDark ? "w-24 h-24" : "w-20 h-20"}>
              <img
                src={`${import.meta.env.BASE_URL}images/traigent-logo-icon.png`}
                alt="Traigent"
                className={`w-full h-full object-contain ${isDark ? "drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "drop-shadow-[0_0_12px_rgba(99,102,241,0.4)]"}`}
              />
            </div>
            <div className={`absolute ${isDark ? '-bottom-4' : '-bottom-6'} left-1/2 -translate-x-1/2 whitespace-nowrap`}>
              <span className={`text-xs ${isDark ? 'text-blue-400' : 'text-indigo-600'} font-semibold`}>TRAIGENT</span>
            </div>
          </div>
        </div>

        {/* Arrow 2 */}
        <div className="hidden md:flex justify-center">
          <ArrowRight className={`w-6 h-6 ${arrowColor2}`} />
        </div>

        {/* Output Box */}
        <div className={`md:col-span-2 ${boxBg} rounded-xl p-5 border border-emerald-500/30`}>
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
        </div>
      </div>

      {/* Mobile arrows */}
      <div className="flex md:hidden justify-center my-4">
        <div className={`flex flex-col items-center gap-2 ${mobileTextColor}`}>
          <span className="rotate-90">→</span>
          <span className="text-xs font-semibold">TRAIGENT</span>
          <span className="rotate-90">→</span>
        </div>
      </div>
    </div>
  );
}
