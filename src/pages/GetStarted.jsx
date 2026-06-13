import React, { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Check, Copy, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import InstallCommand from "../components/InstallCommand";
import HubSpotStartNowForm from "../components/HubSpotStartNowForm";
import skillOnboarding from "../data/traigentSkillOnboarding.json";
import {
  isUnlocked,
  markUnlocked,
  getUnlockedEmail,
  shouldNotifyForGate,
} from "../lib/startNowGate";
import { notifyStartNowRepeat, notifyOtpVerified } from "../lib/hubspotForms";
import { checkKnownContact } from "../lib/hubspotIdentify";
import { trackEvent } from "../lib/analytics";
import OtpGate from "../components/OtpGate";
import { isOtpEnabled, isVerified } from "../lib/otpAccess";

const createPageUrl = (path) => path;
const { installPresets, goals: AGENT_GOALS } = skillOnboarding;
const DEFAULT_AGENT_GOAL_IDS = [
  "integrate-decorator",
  "setup-evaluation",
  "run-optimization",
];
const SDK_SKILL_INSTALL_PRESET = installPresets.all;
const TERMINAL_INSTALL_COMMAND = "curl -fsSL https://traigent.ai/install.sh | sh";
// Switch these defaults to traigent[recommended] once that extras bundle ships.
const MANUAL_INSTALL_COMMANDS = [
  "uv tool install 'traigent[recommended]'",
  "pipx install 'traigent[recommended]'",
  "pip install 'traigent[recommended]'",
];

function uniqueSkills(goals) {
  return Array.from(new Set(goals.flatMap((goal) => goal.skills)));
}

function composeAgentPrompt(goals) {
  const selectedGoals = goals.length > 0 ? goals : AGENT_GOALS.slice(0, 1);
  const steps = selectedGoals.flatMap((goal) => goal.promptSteps);
  const skills = uniqueSkills(selectedGoals);

  return [
    "I've installed the Traigent SDK skills. Help me optimize <describe my target function or workflow>.",
    "",
    `Use these Traigent skills when relevant: ${skills.join(", ")}.`,
    "",
    "Work in this order:",
    ...steps.map((step, index) => `${index + 1}. ${step}`),
    `${steps.length + 1}. Keep the first validation in mock or dry-run mode, then ask before spending on a real optimization run.`,
    `${steps.length + 2}. Summarize the evidence, the winning config, and any code change before closing.`,
  ].join("\n");
}

export default function GetStarted() {
  // When the OTP Worker is configured, SDK access requires the stronger
  // verified-email stamp (code entered on this browser) — see StartNowModal.
  const otpMode = isOtpEnabled();
  const [verified, setVerified] = useState(() => isVerified());
  // Gate the install commands behind the HubSpot form on first visit.
  // Same 90-day localStorage memory as the Start Now modal so a visitor
  // who unlocked there doesn't see the form again here, and vice versa.
  const [unlocked, setUnlocked] = useState(() => isUnlocked());
  const [selectedGoalIds, setSelectedGoalIds] = useState(DEFAULT_AGENT_GOAL_IDS);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  // Install commands render only behind the active gate's success state.
  const hasAccess = otpMode ? verified : unlocked;

  // Repeat-visit notification — see StartNowModal for the rationale.
  useEffect(() => {
    if (otpMode ? !verified : !unlocked) return;
    if (!shouldNotifyForGate("get_started_page")) return;
    const email = getUnlockedEmail();
    if (!email) return;
    notifyStartNowRepeat({ email, location: "get_started_page" });
    trackEvent("start_now_repeat_visit", { location: "get_started_page" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Identity check via the hsutk Worker — auto-unlock known contacts.
  // Skipped in OTP mode: recognition can't substitute for mailbox proof.
  useEffect(() => {
    if (otpMode || unlocked) return;
    let cancelled = false;
    checkKnownContact().then((result) => {
      if (cancelled) return;
      if (result && result.known && result.email) {
        markUnlocked(result.email);
        setUnlocked(true);
        notifyStartNowRepeat({ email: result.email, location: "get_started_page" });
        trackEvent("start_now_auto_unlocked", { location: "get_started_page" });
      }
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitted = (email) => {
    markUnlocked(email);
    setUnlocked(true);
    trackEvent("start_now_form_submitted", { location: "get_started_page" });
  };

  // OTP path: Worker has verified the mailbox + written the access receipt.
  const handleVerified = (email) => {
    markUnlocked(email);
    notifyOtpVerified({ email, location: "get_started_page" });
    setVerified(true);
  };

  const selectedGoals = useMemo(
    () => AGENT_GOALS.filter((goal) => selectedGoalIds.includes(goal.id)),
    [selectedGoalIds]
  );
  const selectedSkillNames = useMemo(() => uniqueSkills(selectedGoals), [selectedGoals]);
  const agentPrompt = useMemo(() => composeAgentPrompt(selectedGoals), [selectedGoals]);

  const toggleGoal = (goalId) => {
    setSelectedGoalIds((current) => {
      if (current.includes(goalId)) {
        return current.length === 1 ? current : current.filter((id) => id !== goalId);
      }
      return [...current, goalId];
    });
    setCopiedPrompt(false);
  };

  const copyAgentPrompt = async () => {
    if (!navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(agentPrompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
      trackEvent("agent_prompt_copied", {
        location: "get_started_page",
        selected_goals: selectedGoalIds,
      });
    } catch {
      // Clipboard unavailable (insecure context, etc.) — silent fallback.
    }
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

        {otpMode && !verified && (
          <div className="mb-10 p-6 rounded-xl bg-slate-900/60 border border-slate-800 max-w-2xl">
            <h2 className="text-xl font-semibold mb-2">First, verify your work email</h2>
            <p className="text-slate-300 mb-4 max-w-3xl">
              We&apos;ll send a 6-digit code to confirm the address is yours — the
              install commands below appear as soon as you enter it.
            </p>
            <OtpGate surface="get_started_page" onVerified={handleVerified} />
          </div>
        )}
        {!otpMode && !unlocked && (
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
            <p className="text-slate-300 mb-4">
              Install the published Python SDK from your terminal. The bootstrap is a thin shell script that installs <code className="px-1 py-0.5 rounded bg-slate-800 text-sm">traigent[recommended]</code>, verifies <code className="px-1 py-0.5 rounded bg-slate-800 text-sm">traigent info</code>, refuses root/container installs unless <code className="px-1 py-0.5 rounded bg-slate-800 text-sm">TRAIGENT_ALLOW_ROOT=1</code> is explicitly set, and never prompts for or reads credentials. The installer detects <code className="px-1 py-0.5 rounded bg-slate-800 text-sm">traigent onboard</code> (included in the published SDK) and suggests it next — it sets up device login against <a href="https://portal.traigent.ai" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline underline-offset-4">portal.traigent.ai</a> and your coding agent.
            </p>
            {hasAccess && (
              <>
                <InstallCommand
                  command={TERMINAL_INSTALL_COMMAND}
                  secondary="Set TRAIGENT_VERSION before the command to pin a published SDK version."
                  className="mb-4"
                />
                <div className="border-t border-slate-800 pt-4 mb-4">
                  <h3 className="text-sm font-semibold text-slate-200 mb-2">or install manually</h3>
                  <div className="space-y-1 font-mono text-sm text-slate-300">
                    {MANUAL_INSTALL_COMMANDS.map((command) => (
                      <div key={command}>
                        <span className="text-slate-500 select-none">$ </span>
                        <code>{command}</code>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-slate-800 pt-4 mb-5 flex-grow">
                  <h3 className="text-sm font-semibold text-slate-200 mb-2">next steps</h3>
                  <div className="space-y-3 text-sm text-slate-300">
                    <div>
                      <div className="text-slate-400 mb-1">If your installed SDK includes onboard:</div>
                      <div className="font-mono">
                        <span className="text-slate-500 select-none">$ </span>
                        <code>traigent onboard</code>
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400 mb-1">Current SDK fallback:</div>
                      <div className="space-y-1 font-mono">
                        <div>
                          <span className="text-slate-500 select-none">$ </span>
                          <code>traigent auth login</code>
                        </div>
                        <div>
                          <span className="text-slate-500 select-none">$ </span>
                          <code>python -m traigent.examples.quickstart</code>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">
                        Paste an API key from the portal when prompted; the packaged quickstart is a zero-cost mock run.
                      </p>
                    </div>
                  </div>
                </div>
              </>
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
            Claude Code, Cursor, Codex, Gemini CLI and 30+ other agents pick up the Traigent skill bundle automatically. They&apos;ll guide you through dry-run-first setup, generate the eval dataset, and apply the best config — without you leaving your editor. Coding agent? Point it at <a href="/agent.md" className="text-blue-300 hover:text-blue-200 underline underline-offset-4">traigent.ai/agent.md</a>.
          </p>
          {hasAccess && (
            <InstallCommand
              command={SDK_SKILL_INSTALL_PRESET.command}
              label={SDK_SKILL_INSTALL_PRESET.label}
              secondary={SDK_SKILL_INSTALL_PRESET.secondary}
            />
          )}
          <div className="mt-6 border-t border-slate-800 pt-6">
            <h3 className="text-lg font-semibold mb-3">Build the prompt for your agent</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
              {AGENT_GOALS.map((goal) => {
                const active = selectedGoalIds.includes(goal.id);
                return (
                  <button
                    type="button"
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    aria-pressed={active}
                    className={[
                      "text-left rounded-lg border px-4 py-3 transition-colors min-h-[76px]",
                      active
                        ? "bg-blue-500/15 border-blue-400 text-white"
                        : "bg-slate-950/50 border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800/60",
                    ].join(" ")}
                  >
                    <span className="flex items-start gap-2">
                      <span className={[
                        "mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border",
                        active ? "border-blue-300 bg-blue-400 text-slate-950" : "border-slate-600 text-transparent",
                      ].join(" ")}>
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span className="font-medium leading-5">{goal.label}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mb-3 break-words text-xs uppercase text-slate-500">
              Skills routed: {selectedSkillNames.join(", ")}
            </div>
            <div className="relative rounded-lg border border-slate-700 bg-slate-950/70 p-4">
              <pre className="pr-12 whitespace-pre-wrap break-words text-sm leading-6 text-slate-200 font-mono">
                {agentPrompt}
              </pre>
              <button
                type="button"
                onClick={copyAgentPrompt}
                aria-label={copiedPrompt ? "Copied agent prompt" : "Copy agent prompt"}
                className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-600 bg-slate-800 text-slate-200 transition-colors hover:border-slate-500 hover:bg-slate-700"
              >
                {copiedPrompt ? (
                  <Check className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
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
