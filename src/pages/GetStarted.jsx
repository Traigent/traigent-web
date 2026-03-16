import { ExternalLink } from "lucide-react";
import { track } from "../lib/analytics";
import SiteHeader from "../components/SiteHeader";

export default function GetStarted() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SiteHeader className="mb-12" />

        <h1 className="text-4xl md:text-5xl font-bold mb-4">Get started</h1>
        <p className="mb-10 max-w-2xl text-lg text-slate-700 dark:text-slate-300">
          Start bottom-up with the SDK, or start foundational with TVL. Either way: specify, evaluate, optimize, and apply—like software.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/70">
            <h2 className="text-xl font-semibold mb-2">TVL (Specification)</h2>
            <p className="mb-6 text-slate-700 dark:text-slate-300">
              Write a TVL module that captures the tunable decisions, objectives, and constraints for your agentic system.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.tvl-lang.org/getting-started/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-cyan-500 px-5 py-3 font-medium text-white transition hover:bg-cyan-400"
                onClick={() => track("cta_click", { location: "get_started", target: "tvl_getting_started" })}
              >
                TVL getting started
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
              <a
                href="https://www.tvl-lang.org/reference/language/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-transparent px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-white/5"
                onClick={() => track("cta_click", { location: "get_started", target: "tvl_reference" })}
              >
                Language reference
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/70">
            <h2 className="text-xl font-semibold mb-2">Traigent SDK</h2>
            <p className="mb-4 text-slate-700 dark:text-slate-300">
              Attach to your existing AI calls with a decorator, run governed optimization on real workloads, and apply the best config. Follow the SDK docs to install and get started.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://cal.com/nimrod-busany"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-cyan-500 px-5 py-3 font-medium text-white transition hover:bg-cyan-400"
                onClick={() => track("cta_click", { location: "get_started", target: "sdk_access" })}
              >
                Request SDK access
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-xl border border-indigo-300/40 bg-gradient-to-br from-cyan-100/70 via-indigo-100/60 to-violet-100/60 p-6 dark:border-white/10 dark:from-indigo-600/20 dark:to-purple-700/20">
          <h3 className="text-xl font-semibold mb-2">Enterprise teams</h3>
          <p className="mb-6 max-w-3xl text-slate-700 dark:text-slate-200">
            Git hooks and GitHub Actions are included in the SDK. Want managed CI/CD dashboards, team analytics, and audit trails? Let&apos;s talk about enterprise options.
          </p>
          <a
            href="https://cal.com/nimrod-busany"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-500"
            onClick={() => track("cta_click", { location: "get_started", target: "enterprise_demo" })}
          >
            Request enterprise demo
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
