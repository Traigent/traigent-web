import { Link } from "react-router-dom";

/**
 * Bottom-of-page CTA: "Want to see this on your own agent? → Get started".
 * Shared across Academy course pages so the markup lives in one place.
 */
export default function AcademyGetStartedCTA({
  prompt = "Want to see this on your own agent?",
  buttonLabel = "Get started in 15 minutes",
  withTopBorder = false,
}) {
  return (
    <div
      className={
        withTopBorder
          ? "mt-8 pt-8 border-t border-slate-800 text-center"
          : "text-center"
      }
    >
      <p className="text-slate-400 mb-4">{prompt}</p>
      <Link
        to="/get-started"
        className="inline-flex items-center gap-2 bg-[#1A6BF5] hover:bg-[#4D8EF8] text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        {buttonLabel}
      </Link>
    </div>
  );
}
