import React from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const createPageUrl = (path) => path;

export default function GetStarted() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link
          to={createPageUrl("/")}
          className="inline-flex items-center text-slate-300 hover:text-white transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">Get started</h1>
        <p className="text-lg text-slate-300 mb-10 max-w-2xl">
          Start bottom-up with the SDK, or start foundational with TVL. Either way: specify, evaluate, optimize, and apply—like software.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800">
            <h2 className="text-xl font-semibold mb-2">TVL (Specification)</h2>
            <p className="text-slate-300 mb-6">
              Write a TVL module that captures the tunable decisions, objectives, and constraints for your agentic system.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.tvl-lang.org/getting-started/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center font-medium bg-white text-slate-900 hover:bg-gray-100 px-5 py-3 rounded-lg"
              >
                TVL getting started
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
              <a
                href="https://www.tvl-lang.org/reference/language/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center font-medium bg-transparent border border-slate-700 text-slate-200 hover:bg-white/5 px-5 py-3 rounded-lg"
              >
                Language reference
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800">
            <h2 className="text-xl font-semibold mb-2">Traigent SDK</h2>
            <p className="text-slate-300 mb-4">
              Attach to your existing AI calls with a decorator, run governed optimization on real workloads, and apply the best config. Follow the SDK docs to install and get started.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://cal.com/nimrod-busany"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center font-medium bg-white text-slate-900 hover:bg-gray-100 px-5 py-3 rounded-lg"
              >
                Request SDK access
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 p-6 rounded-xl bg-gradient-to-br from-indigo-600/20 to-purple-700/20 border border-white/10">
          <h3 className="text-xl font-semibold mb-2">Enterprise teams</h3>
          <p className="text-slate-200 mb-6 max-w-3xl">
            Git hooks and GitHub Actions are included in the SDK. Want managed CI/CD dashboards, team analytics, and audit trails? Let's talk about enterprise options.
          </p>
          <a
            href="https://cal.com/nimrod-busany"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center font-medium bg-white text-slate-900 hover:bg-gray-100 px-6 py-3 rounded-lg"
          >
            Request enterprise demo
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
