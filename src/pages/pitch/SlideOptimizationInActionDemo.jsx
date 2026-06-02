// Slide: Optimization in Action — live demo.
// Embeds the same OptimizationTable used on /optimization-in-action (autoplay
// mode), wrapped in a slide-sized title + description shell so it fits the
// PitchShort canvas (1280×720 with px-10 pt-16 pb-12 wrapper). Shown right
// after "Two Components, One Loop" so the audience sees the concept and then
// watches it actually happen.
import OptimizationTable from "../../components/OptimizationTable";

export default function SlideOptimizationInActionDemo() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div className="text-center mb-5">
        <h2 className="text-4xl font-bold text-white mb-2">
          Optimization in Action <span className="text-slate-400 font-medium">(Video Demo)</span>
        </h2>
        <p className="text-base text-slate-400 max-w-3xl mx-auto leading-snug">
          Watch Traigent sweep hundreds of model and configuration combinations
          and converge on the optimum — accuracy, cost, latency, or any KPI you
          pick.
        </p>
      </div>
      <div className="flex-1 w-full max-w-[1080px] rounded-xl overflow-hidden border border-slate-700/50 shadow-xl">
        <OptimizationTable autoPlay={true} embedded={true} />
      </div>
    </div>
  );
}
