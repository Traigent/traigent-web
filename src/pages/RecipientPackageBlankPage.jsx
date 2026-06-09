// Bland page rendered for /vc, /channel, /customer (no slug) and for any
// recipient URL that doesn't resolve to a registered package. Goal: reveal
// nothing about other recipients while telling a misdirected visitor they
// likely need a more specific URL.
//
// No <Helmet> title that identifies the section. No links to other
// recipient packages. No robots indexing.
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import BrandMark from "../components/BrandMark";

export default function RecipientPackageBlankPage() {
  return (
    <>
      <Helmet>
        <title>Traigent</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="googlebot" content="noindex,nofollow" />
      </Helmet>
      <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <Link to="/" className="inline-block mb-8 hover:opacity-80 transition-opacity" aria-label="Traigent">
            <BrandMark size="lg" />
          </Link>
          <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-3">
            If you&apos;re looking for a specific presentation, please use the
            full link you were sent.
          </p>
          <p className="text-slate-500 text-sm">
            Otherwise, head back to{" "}
            <Link to="/" className="text-[#4D8EF8] hover:text-[#7BA8F9] underline underline-offset-4">
              traigent.ai
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
}
