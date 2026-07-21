// Slide: Optimization in Action — real, data-driven replay.
// Uses the same honest replay artifact shown on /demos and /table-demo (real
// fixed-slice Bedrock Haiku run, BIRD mini-dev) rather than the legacy scripted
// animation, wrapped in a slide-sized title + description shell so it fits the
// PitchShort canvas (1280×720 with px-10 pt-16 pb-12 wrapper). Shown right
// after "Two Components, One Loop" so the audience sees the concept and then
// watches it actually happen on real data.
import OptimizationTable from "../../components/OptimizationTable";
import { birdDemo, replayColumns } from "../../data/demoArtifacts/replays";

export default function SlideOptimizationInActionDemo() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div className="text-center mb-5">
        <h2 className="text-4xl font-bold text-white mb-2">
          Optimization in Action <span className="text-slate-400 font-medium">(Live Replay)</span>
        </h2>
        <p className="text-base text-slate-400 max-w-3xl mx-auto leading-snug">
          A real fixed-slice run — Traigent sweeps configurations and converges,
          lifting held-out accuracy on a real benchmark. Optimize for accuracy,
          cost, latency, or any KPI you pick.
        </p>
      </div>
      <div className="flex-1 w-full max-w-[1080px] rounded-xl overflow-hidden border border-slate-700/50 shadow-xl">
        <OptimizationTable
          dataset={birdDemo.dataset}
          columns={replayColumns(birdDemo.dataset)}
          demoLabel={birdDemo.label}
          autoPlay={true}
          embedded={true}
        />
      </div>
    </div>
  );
}
