import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import OptimizationTable from '../components/OptimizationTable';
import { replayColumns, replayDemos } from '../data/demoArtifacts/replays';

const formatPercent = (value) => `${new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
}).format(Number(value) * 100)}%`;

const formatPp = (value) => new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
}).format(Number(value));

const headlineFor = (dataset) => {
  const heldout = dataset.frames.heldout;
  return `${heldout.baseline.correct}/${heldout.baseline.total} = ${formatPercent(heldout.baseline.accuracy)} -> ${heldout.optimized.correct}/${heldout.optimized.total} = ${formatPercent(heldout.optimized.accuracy)} (+${formatPp(heldout.delta.accuracy_pp)}pp)`;
};

export default function DemoGallery() {
  const [activeDemoId, setActiveDemoId] = useState(replayDemos[0].id);
  const activeDemo = replayDemos.find((demo) => demo.id === activeDemoId) || replayDemos[0];

  return (
    <>
      <Helmet>
        <title>Real Optimization Replays | Traigent</title>
        <meta
          name="description"
          content="Real fixed-slice optimization replays for BIRD, Spider, and HotpotQA using Bedrock Haiku artifacts."
        />
      </Helmet>
      <main className="min-h-screen bg-[#080808] text-white">
        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 max-w-3xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#4D8EF8]">
                Real optimization replay gallery
              </p>
              <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
                Fixed-slice benchmark demos, separated by evidence scope.
              </h1>
              <p className="text-lg leading-relaxed text-slate-300">
                Each card expands a three-frame replay: optimization search, held-out check, and isolation levers.
                The limitations are shown in the replay for each benchmark.
              </p>
            </div>

            <div className="mb-8 grid gap-4 md:grid-cols-3">
              {replayDemos.map((demo) => {
                const isActive = demo.id === activeDemo.id;
                return (
                  <button
                    key={demo.id}
                    type="button"
                    onClick={() => setActiveDemoId(demo.id)}
                    className={`rounded-lg border p-5 text-left transition-colors ${
                      isActive
                        ? 'border-[#4D8EF8] bg-[#4D8EF8]/12'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-600'
                    }`}
                  >
                    <span className="mb-3 block text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                      {demo.deck}
                    </span>
                    <strong className="mb-3 block text-2xl font-bold text-white">{demo.name}</strong>
                    <span className="block font-mono text-sm leading-relaxed text-slate-300">
                      {headlineFor(demo.dataset)}
                    </span>
                    <span className="mt-4 inline-flex rounded-md border border-slate-700 px-3 py-1 text-sm font-semibold text-slate-200">
                      {isActive ? 'Showing replay' : 'Open replay'}
                    </span>
                  </button>
                );
              })}
            </div>

            <OptimizationTable
              dataset={activeDemo.dataset}
              columns={replayColumns(activeDemo.dataset)}
              demoLabel={activeDemo.label}
              autoPlay={false}
            />
          </div>
        </section>
      </main>
    </>
  );
}
