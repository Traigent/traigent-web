import { Link } from "react-router-dom";

/**
 * Top action bar shared by ROICalculator and TTMCalculator. Shows the
 * "both calculators are in sync" reminder + cross-links + the reset button.
 * The two calculators share inputs via shared state, so the cross-link copy
 * applies identically to both pages.
 */
export default function CalculatorTopBar({ onReset }) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 mb-4">
      <p className="text-xs text-slate-400">
        Both{" "}
        <Link
          to="/ttm"
          className="text-[#4D8EF8] hover:text-white underline underline-offset-2"
        >
          TTM
        </Link>{" "}
        and{" "}
        <Link
          to="/roi"
          className="text-[#4D8EF8] hover:text-white underline underline-offset-2"
        >
          ROI
        </Link>{" "}
        calculators are always in sync per your inputs. Reset to default
        settings if you want to start over.
      </p>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-700 bg-slate-900/60 text-xs font-mono text-slate-400 hover:text-[#4D8EF8] hover:border-[#4D8EF8]/50 transition-colors flex-shrink-0"
      >
        ↺ Reset all settings to defaults
      </button>
    </div>
  );
}
