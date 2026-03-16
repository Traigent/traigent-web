const toneStyles = {
  cyan: {
    wrap:
      "border-cyan-300/70 bg-cyan-50 text-cyan-800 dark:border-cyan-300/40 dark:bg-cyan-300/10 dark:text-cyan-100",
    mark:
      "border-cyan-300/80 bg-cyan-100 text-cyan-700 dark:border-cyan-300/60 dark:bg-cyan-300/20 dark:text-cyan-200",
  },
  amber: {
    wrap:
      "border-amber-300/70 bg-amber-50 text-amber-800 dark:border-amber-300/40 dark:bg-amber-300/10 dark:text-amber-100",
    mark:
      "border-amber-300/80 bg-amber-100 text-amber-700 dark:border-amber-300/60 dark:bg-amber-300/20 dark:text-amber-200",
  },
  emerald: {
    wrap:
      "border-emerald-300/70 bg-emerald-50 text-emerald-800 dark:border-emerald-300/40 dark:bg-emerald-300/10 dark:text-emerald-100",
    mark:
      "border-emerald-300/80 bg-emerald-100 text-emerald-700 dark:border-emerald-300/60 dark:bg-emerald-300/20 dark:text-emerald-200",
  },
  violet: {
    wrap:
      "border-violet-300/70 bg-violet-50 text-violet-800 dark:border-violet-300/40 dark:bg-violet-300/10 dark:text-violet-100",
    mark:
      "border-violet-300/80 bg-violet-100 text-violet-700 dark:border-violet-300/60 dark:bg-violet-300/20 dark:text-violet-200",
  },
  indigo: {
    wrap:
      "border-indigo-300/70 bg-indigo-50 text-indigo-800 dark:border-indigo-300/40 dark:bg-indigo-300/10 dark:text-indigo-100",
    mark:
      "border-indigo-300/80 bg-indigo-100 text-indigo-700 dark:border-indigo-300/60 dark:bg-indigo-300/20 dark:text-indigo-200",
  },
  slate: {
    wrap:
      "border-slate-300/80 bg-slate-100 text-slate-700 dark:border-slate-500/60 dark:bg-slate-800 dark:text-slate-200",
    mark:
      "border-slate-300/80 bg-slate-50 text-slate-600 dark:border-slate-500/60 dark:bg-slate-900 dark:text-slate-300",
  },
};

export default function LogomarkBadge({
  mark,
  label,
  tone = "cyan",
  className = "",
  markClassName = "",
  labelClassName = "",
  logoSrc = "",
  logoAlt = "",
  logoClassName = "",
}) {
  const styles = toneStyles[tone] ?? toneStyles.cyan;
  const markSize = logoSrc ? "h-5 w-5 min-w-5 p-[3px]" : "h-5 min-w-5 px-1";
  const markSurface = logoSrc ? "bg-white text-slate-900" : "";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 ${styles.wrap} ${className}`.trim()}
    >
      <span
        className={`inline-flex items-center justify-center rounded-full border text-[10px] font-bold leading-none uppercase ${markSize} ${styles.mark} ${markSurface} ${markClassName}`.trim()}
        aria-hidden="true"
      >
        {logoSrc ? (
          <img
            src={logoSrc}
            alt={logoAlt}
            className={`h-full w-full object-contain ${logoClassName}`.trim()}
            loading="lazy"
          />
        ) : (
          mark
        )}
      </span>
      <span className={`text-xs font-semibold ${labelClassName}`.trim()}>{label}</span>
    </span>
  );
}
