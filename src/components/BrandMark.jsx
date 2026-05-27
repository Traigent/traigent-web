// Brand mark — small icon + "Traigent.ai" text, mirroring the slide-deck
// chrome (PitchShort2 frame). Single source so every header / nav / hero on
// the site speaks with one voice.
//
// Size variants:
//   sm    — sticky nav / inline chrome (h-5 icon + text-xl)        DEFAULT
//   md    — slide / page header        (h-6 icon + text-base/lg)
//   lg    — section header / wordmark replacement (h-10 icon + text-3xl)
//   hero  — deck slide-1 / page hero  (h-14 md:h-20 icon + text-5xl…7xl)
const SIZES = {
  sm: {
    iconClass: "h-5 w-auto",
    textClass: "text-xl font-bold tracking-tight",
    gapClass: "gap-2",
  },
  md: {
    iconClass: "h-6 w-auto",
    textClass: "text-base md:text-lg font-bold tracking-tight",
    gapClass: "gap-2",
  },
  lg: {
    iconClass: "h-10 md:h-12 w-auto",
    textClass: "text-2xl md:text-3xl font-bold tracking-tight",
    gapClass: "gap-3",
  },
  hero: {
    iconClass: "h-14 md:h-16 lg:h-20 w-auto",
    textClass: "text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight",
    gapClass: "gap-3 md:gap-4",
  },
};

export default function BrandMark({
  size = "sm",
  className = "",
  iconClassName,
  textClassName,
  textColorClass = "text-white",
  as: As = "span",
}) {
  const preset = SIZES[size] ?? SIZES.sm;
  return (
    <As className={`inline-flex items-center leading-none ${preset.gapClass} ${className}`}>
      <img
        src="/images/traigent-logo-icon.png"
        alt=""
        aria-hidden="true"
        className={iconClassName ?? preset.iconClass}
      />
      <span className={`${textColorClass} ${textClassName ?? preset.textClass}`}>
        Traigent.ai
      </span>
    </As>
  );
}
