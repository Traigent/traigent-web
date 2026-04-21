import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { demoRequestUrl, portalUrl, tvlLinks } from "../content/siteContent";
import { trackEvent } from "../utils/analytics";

export default function MarketingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="text-lg font-semibold text-slate-950">Traigent</div>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
              Measure, optimize, govern, and promote AI agents in production.
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-950">Explore</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link className="text-slate-600 hover:text-slate-950" to="/demos">Demos</Link></li>
              <li><Link className="text-slate-600 hover:text-slate-950" to="/academy">Academy</Link></li>
              <li><Link className="text-slate-600 hover:text-slate-950" to="/resources">Resources</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-950">Product</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a className="text-slate-600 hover:text-slate-950" href={portalUrl}>Try Traigent</a></li>
              <li><a className="text-slate-600 hover:text-slate-950" href={demoRequestUrl}>Request a demo</a></li>
              <li><Link className="text-slate-600 hover:text-slate-950" to="/specifications">Specifications</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-950">TVL</h2>
            <a
              href={tvlLinks.home}
              onClick={() => trackEvent("specifications_page_outbound_click_to_tvl", { location: "footer" })}
              className="mt-3 inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-950"
            >
              tvl-lang.org
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
