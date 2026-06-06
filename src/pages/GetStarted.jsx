import React, { useState } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import InstallCommand from "../components/InstallCommand";
import HubSpotStartNowForm from "../components/HubSpotStartNowForm";
import { isUnlocked, markUnlocked } from "../lib/startNowGate";
import { trackEvent } from "../lib/analytics";

const createPageUrl = (path) => path;
const SDK_SKILL_INSTALL_COMMAND = [
  "npx skills add Traigent/agents-skills",
  "--skill traigent",
  "--skill traigent-quickstart",
  "--skill traigent-configuration-space",
  "--skill traigent-decorator-setup",
  "--skill traigent-run-optimization",
  "--skill traigent-analyze-results",
  "--skill traigent-debugging",
  "--skill traigent-integrations",
].join(" ");

export default function GetStarted() {
  // Gate the install commands behind the HubSpot form on first visit.
  // Same 90-day localStorage memory as the Start Now modal so a visitor
  // who unlocked there doesn't see the form again here, and vice versa.
  const [unlocked, setUnlocked] = useState(() => isUnlocked());
  const handleSubmitted = () => {
    markUnlocked();
    setUnlocked(true);
    trackEvent("start_now_form_submitted", { location: "get_started_page" });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Helmet>
        <title>Get Started · Traigent</title>
        <meta name="description" content="Start with the SDK or with TVL. Two onramps for optimizing your AI agent with Traigent — specify the tunable decisions, evaluate, optimize, apply." />
        <meta property="og:title" content="Get Started with Traigent" />
        <meta property="og:description" content="Start optimizing your AI agent in minutes. SDK + TVL onramps." />
        <meta property="og:type" content="website" />
      </Helmet>
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

        {!unlocked && (
          <div className="mb-10 p-6 rounded-xl bg-slate-900/60 border border-slate-800">
            <h2 className="text-xl font-semibold mb-2">First, tell us where to send setup tips</h2>
            <p className="text-slate-300 mb-4 max-w-3xl">
              The install commands below appear as soon as you submit. We won't
              email you more than once a month, and you can unsubscribe with one
              click.
            </p>
            <HubSpotStartNowForm onSuccess={handleSubmitted} targetId="hs-form-getstarted" />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col">
            <h2 className="text-xl font-semibold mb-2">TVL (Specification)</h2>
            <p className="text-slate-300 mb-6 flex-grow">
              Write a TVL module that captures the tunable decisions, objectives, and constraints for your agentic system.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.tvl-lang.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center font-medium bg-white text-slate-900 hover:bg-gray-100 px-5 py-3 rounded-lg"
              >
                Learn TVL
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col">
            <h2 className="text-xl font-semibold mb-2">Traigent SDK</h2>
            <p className="text-slate-300 mb-4 flex-grow">
              Attach to your existing AI calls with a decorator, run governed optimization on real workloads, and apply the best config. The bundled <code className="px-1 py-0.5 rounded bg-slate-800 text-sm">traigent quickstart</code> demo runs locally in mock mode — no API keys, no LLM provider calls — so you can validate the pipeline before pointing it at real LLMs.
            </p>
            {unlocked && (
              <InstallCommand
                command='uv tool install "traigent[recommended]" && traigent quickstart'
                secondary="Prefer pip? `pip install` is a drop-in replacement."
                className="mb-4"
              />
            )}
            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/Traigent/Traigent"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center font-medium bg-white text-slate-900 hover:bg-gray-100 px-5 py-3 rounded-lg"
              >
                View on GitHub
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 p-6 rounded-xl bg-slate-900/60 border border-slate-800">
          <h2 className="text-xl font-semibold mb-2">Drive it from your coding agent</h2>
          <p className="text-slate-300 mb-4 max-w-3xl">
            Claude Code, Cursor, Codex, Gemini CLI and 30+ other agents pick up the Traigent skill bundle automatically. They&apos;ll guide you through dry-run-first setup, generate the eval dataset, and apply the best config — without you leaving your editor.
          </p>
          {unlocked && (
            <InstallCommand
              command={SDK_SKILL_INSTALL_COMMAND}
              secondary="Installs only the user-facing Traigent SDK skills. Internal review, PR, and security tools stay out of the bundle."
            />
          )}
        </div>

        <div className="mt-12 p-6 rounded-xl bg-gradient-to-br from-indigo-600/20 to-purple-700/20 border border-white/10">
          <h3 className="text-xl font-semibold mb-2">Enterprise teams</h3>
          <p className="text-slate-200 mb-6 max-w-3xl">
            Git hooks and GitHub Actions are included in the SDK. Want managed CI/CD dashboards, team analytics, and audit trails? Let's talk about enterprise options.
          </p>
          <a
            href="https://meetings-eu1.hubspot.com/amir8"
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
