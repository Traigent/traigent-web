import { useEffect } from "react";
import { X, ArrowRight, Github } from "lucide-react";
import InstallCommand from "./InstallCommand";

export default function StartNowModal({ onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="start-now-title"
        className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full p-8"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 id="start-now-title" className="text-2xl font-bold text-white mb-2">Start Now</h2>
        <p className="text-slate-400 mb-6">
          Run the keyless demo on your laptop in under a minute — no API keys, no LLM provider calls, no spend.
        </p>

        <InstallCommand
          command='uv tool install "traigent[recommended]" && traigent quickstart'
          secondary="No API keys. No LLM provider calls. No spend. Just python. (Have pip instead? `pip install` works too.)"
        />

        <div className="flex flex-wrap gap-3 mt-6">
          <a
            href="https://github.com/Traigent/Traigent"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-[#1A6BF5] hover:bg-[#4D8EF8] text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
          >
            <Github className="mr-2 h-4 w-4" />
            View on GitHub
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
