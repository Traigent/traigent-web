// /pitch-short — abbreviated outreach pitch deck.
// Composes the shared PitchDeck shell from PitchFull with its own trimmed
// slides array. Two slides (Configuration Explosion and ROI Preview) are
// rendered through PitchFull's originals with override props for the
// subtitle / footer; everything else is imported directly. No structural
// JSX is duplicated from PitchFull.
import { ArrowRight } from "lucide-react";
import {
  PitchDeck,
  SlideOnePagerSummary,
  Slide03Explosion,
  Slide06KillerStat,
  Slide07FeedbackLoop,
  Slide10Tradeoff,
  Slide11Confidence,
  Slide12BeyondIntro,
  Slide13Benchmark,
  Slide14Tracing,
  Slide15Lifecycle,
  Slide16ThreeInOne,
  Slide19EngineerFirst,
  SlideTTMPreview,
  SlideROIPreview,
  Slide17Customers,
  Slide20GetStarted,
  Slide21Closing,
} from "./PitchFull";

// Slide 2 in the short deck: same body as the full deck, friendlier
// subtitle pointing readers at the hoverable tiles below.
function Slide03ExplosionShort() {
  return (
    <Slide03Explosion
      subtitle={
        <>
          Every agent has <span className="text-white font-semibold">hundreds (if not thousands)</span> of tunable variable combinations. See example below — <span className="text-slate-400">hover over boxes to see details</span>
        </>
      }
    />
  );
}

// Slide 15: same body as the full deck, with a single centered "Calculate
// your ROI" link in place of the "Plus engineering recovery" callout.
function SlideROIPreviewShort() {
  return (
    <SlideROIPreview
      subtitle="Auto-optimizing the cost-performance saves LLM spend."
      footer={
        <p className="text-center text-slate-300 text-base md:text-lg">
          <a
            href="/#/roi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 underline underline-offset-4 decoration-[#4D8EF8]/50 hover:decoration-[#4D8EF8] font-medium"
            style={{ color: "#4D8EF8" }}
          >
            Calculate your ROI <ArrowRight className="w-4 h-4" />
          </a>
        </p>
      }
    />
  );
}

const SHORT_SLIDES = [
  // ----- ONE-PAGER SUMMARY (opener) -----
  { title: "One-Pager Summary", section: "Traigent intro", component: SlideOnePagerSummary },
  // ----- PROBLEM -----
  { title: "The Configuration Explosion", section: "Problem", component: Slide03ExplosionShort },
  // ----- SOLUTION -----
  { title: "Hours, Not Weeks (opener)", section: "Solution", component: Slide06KillerStat },
  { title: "Two Components, One Loop", section: "Solution", component: Slide07FeedbackLoop },
  { title: "You Pick the Tradeoff", section: "Solution", component: Slide10Tradeoff },
  { title: "Confidence to Ship", section: "Solution", component: Slide11Confidence },
  { title: "Beyond Optimization", section: "Solution", component: Slide12BeyondIntro },
  { title: "Self-Improving Benchmark", section: "Solution", component: Slide13Benchmark },
  { title: "Full Observability & Tracing", section: "Solution", component: Slide14Tracing },
  { title: "Across the Lifecycle", section: "Solution", component: Slide15Lifecycle },
  { title: "Three Products In One", section: "Solution", component: Slide16ThreeInOne },
  { title: "Engineer-First Integration", section: "Solution", component: Slide19EngineerFirst },
  // ----- TTM -----
  { title: "Hours, Not Weeks", section: "TTM", component: Slide06KillerStat },
  { title: "Engineer-weeks recovered (TTM Calc)", section: "TTM", component: SlideTTMPreview },
  // ----- ROI -----
  { title: "Up to 60% LLM Cost Savings (ROI Calc)", section: "ROI", component: SlideROIPreviewShort },
  // ----- PROOF -----
  { title: "Customers", section: "Proof", component: Slide17Customers },
  // ----- CTA -----
  { title: "Get Started", section: "CTA", component: Slide20GetStarted },
  { title: "Better Agents. Faster. Lower Spend. Higher Confidence.", section: "CTA", component: Slide21Closing },
];

export default function PitchShort() {
  return <PitchDeck slides={SHORT_SLIDES} />;
}
