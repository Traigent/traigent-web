import { Clock } from "lucide-react";

/**
 * Two side-by-side cards that link to live workshop slide decks.
 * Used by both /academy/agents-in-production and /academy/statistical-se-workshop
 * so the markup lives in one place.
 *
 * Pass `cards` as an array of { href, label, title, description } objects.
 */
export default function WorkshopDeckCards({ cards }) {
  return (
    <div className="grid sm:grid-cols-2 gap-3 mb-12">
      {cards.map((c) => (
        <a
          key={c.href}
          href={c.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group block bg-slate-900/60 border border-slate-800 hover:border-[#4D8EF8]/40 rounded-xl p-5 transition-colors"
        >
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-[#4D8EF8] mb-2">
            <Clock className="w-3.5 h-3.5" /> {c.label}
          </div>
          <div className="text-lg font-semibold text-white mb-1 group-hover:text-[#4D8EF8] transition-colors">
            {c.title}
          </div>
          <div className="text-sm text-slate-400">{c.description}</div>
        </a>
      ))}
    </div>
  );
}
