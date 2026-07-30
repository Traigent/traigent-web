/* eslint-disable react/prop-types */
import ModalShell from "./ModalShell";
import LeadFunnel from "./LeadFunnel";

/**
 * Modal wrapper for the lead-funnel front door (Marketing front door unit A2).
 * Shares the site's ModalShell (backdrop, Esc-to-close, body scroll lock, close
 * button) with StartNowModal and hosts <LeadFunnel/>, which owns all per-step
 * copy including its own headings — so this shell carries a static aria-label
 * rather than a per-step title.
 *
 * `location` is the breadcrumb of where the visitor opened the funnel
 * (homepage_hero, …) — passed straight through to the funnel's analytics.
 */
export default function LeadFunnelModal({ onClose, location = "unknown" }) {
  return (
    <ModalShell onClose={onClose} ariaLabel="Get started with Traigent">
      <LeadFunnel surface={location} />
    </ModalShell>
  );
}
