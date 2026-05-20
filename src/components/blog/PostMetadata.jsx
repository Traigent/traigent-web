import { Calendar, Clock } from "lucide-react";

/**
 * Renders the date · reading-time · tags strip that appears on both the blog
 * index (Blog.jsx) and the individual post page (BlogPost.jsx). Extracted so
 * the markup lives in one place — callers pass their own outer spacing via
 * `className` (e.g. "mb-3" on the index card, "mb-4" on the post page).
 */
export default function PostMetadata({ post, className = "" }) {
  return (
    <div
      className={`flex flex-wrap items-center gap-3 text-xs text-slate-500 font-mono ${className}`}
    >
      {post.date && (
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="w-3 h-3" />
          {post.date}
        </span>
      )}
      {post.readingTime && (
        <span className="inline-flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          {post.readingTime}
        </span>
      )}
      {post.tags && post.tags.length > 0 && (
        <span className="inline-flex flex-wrap gap-1.5">
          {post.tags.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400"
            >
              {t}
            </span>
          ))}
        </span>
      )}
    </div>
  );
}
