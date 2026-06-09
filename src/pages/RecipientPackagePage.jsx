// Generic recipient-package page. Resolves /:type/:slug via the env-driven
// registry in src/lib/recipientPackages.js. On match, renders a cover slide
// (data-driven from `cover.*` fields) prepended to a SHORT_SLIDES range
// taken from `presetRange`. On miss, falls through to the bland page so a
// guessed URL reveals nothing useful.
//
// This file is intentionally generic — zero recipient-identifying content
// lives here. Everything specific (display name, slug, cover copy) flows
// through VITE_RECIPIENT_PACKAGES_JSON.
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import PitchShort2 from "./PitchShort2";
import RecipientPackageBlankPage from "./RecipientPackageBlankPage";
import { getPackage, isValidType } from "../lib/recipientPackages";

function CoverSlide({ cover, displayName }) {
  const {
    logoSrc,
    logoAlt,
    kicker,
    headline,
    subhead,
    bullets = [],
    footerNote,
  } = cover || {};
  // Track whether the logo image loaded. If it errors (e.g. the asset hasn't
  // been dropped at /recipient-assets/<recipient>.svg yet) we fall back to a
  // plain typographic wordmark using the recipient's display name. This keeps
  // the cover from looking broken while the official brand asset is sourced.
  const [logoFailed, setLogoFailed] = useState(false);
  const showLogo = logoSrc && !logoFailed;
  const showWordmark = !showLogo && displayName;
  return (
    <div className="w-full max-w-[1080px] mx-auto self-stretch flex flex-col items-center justify-center min-h-[600px] text-center">
      {showLogo && (
        <img
          src={logoSrc}
          alt={logoAlt || displayName || ""}
          className="max-h-20 md:max-h-24 w-auto mb-8 select-none"
          draggable={false}
          onError={() => setLogoFailed(true)}
        />
      )}
      {showWordmark && (
        <div
          className="mb-8 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-200 select-none"
          aria-label={displayName}
        >
          {displayName}
        </div>
      )}
      {kicker && (
        <div className="text-xs md:text-sm font-mono uppercase tracking-[0.3em] text-slate-500 mb-6">
          {kicker}
        </div>
      )}
      {headline && (
        <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-4">
          {headline}
        </h2>
      )}
      {subhead && (
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-snug mb-10">
          {subhead}
        </p>
      )}
      {bullets.length > 0 && (
        <ul className="text-left max-w-2xl space-y-3 mb-10">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-3 text-slate-200 text-base md:text-lg">
              <span className="text-[#4D8EF8] font-bold mt-1">&bull;</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
      {footerNote && (
        <div className="text-xs md:text-sm text-slate-500 italic mt-2">{footerNote}</div>
      )}
    </div>
  );
}

export default function RecipientPackagePage({ type }) {
  const { slug } = useParams();
  const valid = isValidType(type);
  const pkg = valid ? getPackage(type, slug) : null;

  if (!pkg) {
    // Unknown slug under a valid type, or invalid type entirely — render the
    // same bland page as /:type so URL-guessers learn nothing.
    return <RecipientPackageBlankPage />;
  }

  const coverSlide = {
    title: "Recipient Cover",
    section: "Cover",
    component: () => (
      <CoverSlide cover={pkg.cover || {}} displayName={pkg.displayName} />
    ),
  };

  return (
    <>
      <Helmet>
        <title>Traigent</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="googlebot" content="noindex,nofollow" />
      </Helmet>
      <PitchShort2 forcedRange={pkg.presetRange} prependSlides={[coverSlide]} />
    </>
  );
}
