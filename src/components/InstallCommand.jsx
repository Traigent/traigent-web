/* eslint-disable react/prop-types --
 * The rest of this codebase ships without PropTypes (e.g. OptimizationTable);
 * the prop contract for this component is documented in the JSDoc below.
 */
import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

/**
 * A single-line install command with a copy-to-clipboard affordance.
 *
 * The bundled `traigent quickstart` is the load-bearing demo on the
 * funnel: no API keys, no LLM provider calls, ~6 seconds to a results
 * table on a fresh laptop. This component is what lets a visitor copy
 * the command in one click without leaving the page.
 *
 * @param {object}  props
 * @param {string}  props.command    — the shell string to display + copy
 * @param {string}  [props.label]    — optional short label rendered above the block
 * @param {string}  [props.secondary]— optional caption rendered below
 * @param {string}  [props.className]— extra wrapper classes
 */
export default function InstallCommand({
  command,
  label,
  secondary,
  className = "",
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (insecure context, etc.) — silent fallback.
    }
  };

  return (
    <div className={className}>
      {label && (
        <div className="text-sm text-slate-400 mb-2 font-medium">{label}</div>
      )}
      <div className="group relative flex items-start gap-3 bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 font-mono text-sm md:text-[0.95rem]">
        <span className="text-slate-500 select-none pt-0.5">$</span>
        <code className="text-slate-100 flex-1 break-all whitespace-pre-wrap">
          {command}
        </code>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Copied" : "Copy install command"}
          className="flex-shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-md border border-slate-600 bg-slate-800 hover:bg-slate-700 hover:border-slate-500 text-slate-200 transition-colors"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
      {secondary && (
        <div className="text-xs text-slate-500 mt-2">{secondary}</div>
      )}
    </div>
  );
}
