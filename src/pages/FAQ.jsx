import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { trackEvent } from "../lib/analytics";

const BLUE = "#1A6BF5";

// Edit FAQs here. Each Q/A is rendered AND injected into FAQPage JSON-LD.
// Optional `readMore: { href, label }` adds a deep-dive blog link below the answer.
const FAQS = [
  {
    q: "What is Traigent?",
    a: "Traigent is an AI Agent Optimization Platform. We automatically find the best cost-performance configuration for your agent across hundreds (or millions) of model and configuration combinations. The platform also includes built-in benchmark evolution and full observability and tracing.",
  },
  {
    q: "Doesn't the model determine most of the quality and cost?",
    a: "No — configuration variance is often larger than model variance. A cheaper model with the right prompt, retrieval, and sampling settings routinely beats a frontier model used at defaults. A typical production agent has millions of valid configurations; the chance that frontier-model + default-everything-else happens to be the cost-optimal point for your task is vanishingly small.",
    readMore: { href: "/blog/the-model-myth", label: "Read the full case — The Model Myth" },
  },
  {
    q: "How is Traigent different from evaluation frameworks (Braintrust, Phoenix, etc.)?",
    a: "Evaluation frameworks help you measure quality on a fixed benchmark. Traigent treats evaluation as one half of an optimization loop: the agent wrapper evaluates, the optimization engine learns from each evaluation, and the system converges to the best configuration. Standalone eval tools stop at measurement — they don't decide what to try next.",
    readMore: { href: "/blog/the-eval-trap", label: "Read the full case — The Eval Trap" },
  },
  {
    q: "How is Traigent different from observability tools like Langfuse, Helicone, or Arize?",
    a: "Observability tools tell you what happened on each agent call. Traigent tells you what configuration to use next. Observability is necessary for optimization to work — which is why Traigent ships its own production-grade tracing as a built-in capability — but observability alone doesn't optimize your agent. Traigent closes that loop.",
    readMore: { href: "/blog/observability-is-not-enough", label: "Read the full case — Observability Is Necessary But Not Sufficient" },
  },
  {
    q: "Do I need to rewrite my agent to use Traigent?",
    a: "No. Traigent's agent wrapper sits around your existing agent — you don't change agent code. The wrapper injects the model and configuration parameters for each experiment, executes the agent against your benchmark, and reports KPIs back to the optimization engine.",
  },
  {
    q: "How long does optimization take?",
    a: "For a typical configuration space (~720 combinations), Traigent converges to the optimum in roughly 18 experiments — hours of runtime rather than weeks of manual tuning. The exact time depends on your benchmark size, agent latency, and the number of variables you're tuning.",
  },
  {
    q: "What KPIs can Traigent optimize?",
    a: "Accuracy, cost per run, latency, safety scores, and any custom KPI you define. You provide weights — for example, 0.8 × accuracy + 0.15 × cost + 0.05 × latency — and Traigent finds the configuration that maximizes the weighted score. Re-weight any time to find a different optimum.",
  },
  {
    q: "Which LLM providers and models work with Traigent?",
    a: "All major providers (OpenAI, Anthropic, Google, AWS Bedrock, open-source via vLLM/Ollama, etc.). The agent wrapper is provider-agnostic — if your agent can call a model, Traigent can optimize across that model.",
  },
  {
    q: "What about RAG, tools, and multi-step agents?",
    a: "All optimizable. Traigent treats RAG variables (top-k, chunk size, embedding model, reranker), tool selection, multi-step loops, and self-consistency settings as additional dimensions in the configuration space.",
  },
  {
    q: "Can I keep using my own benchmark / test set?",
    a: "Yes — you bring your benchmark. Traigent's wrapper executes your agent against your test cases and measures the KPIs you care about. As a bonus, the platform flags benchmark patterns (too-easy, always-fails, redundant test cases) so your benchmark sharpens over time.",
  },
  {
    q: "What's TVL?",
    a: "TVL (Tuned Variables Language) is a declarative specification for the tunable decisions, objectives, and constraints of your agent. It's optional — you can also use the Python SDK with a single decorator on your agent function. TVL makes the configuration space explicit and shareable across your team.",
  },
  {
    q: "Is Traigent secure and compliant for production use?",
    a: "Your agent code and data never leave your environment — Traigent's wrapper runs locally. The optimization engine receives only the KPI summaries it needs to learn from. For enterprise deployments, contact us for security review and compliance documentation.",
  },
  {
    q: "How much does Traigent cost?",
    a: "Visit our pricing page or book a 15-minute call — we'll size it to your team and usage. Modeled estimates show 20–60% LLM cost reduction potential at equal or better quality; actual savings depend on baseline configuration and traffic volume, and are confirmed via a scoped pilot.",
  },
];

function FAQItem({ q, a, readMore, isOpen, onToggle, idx }) {
  const panelId = `faq-panel-${idx}`;
  const buttonId = `faq-button-${idx}`;
  return (
    <div className="border-b border-slate-800">
      <button
        id={buttonId}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
      >
        <span className="text-base md:text-lg font-semibold text-white group-hover:text-[#4D8EF8] transition-colors">
          {q}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 flex-shrink-0 mt-1 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        aria-hidden={!isOpen}
        className={`overflow-hidden transition-all duration-300 ease-out ${isOpen ? "max-h-[32rem] pb-5" : "max-h-0"}`}
      >
        <p className="text-slate-300 leading-relaxed">{a}</p>
        {readMore && (
          <Link
            to={readMore.href}
            tabIndex={isOpen ? undefined : -1}
            onClick={() => trackEvent("faq_readmore_clicked", { href: readMore.href })}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1A6BF5] hover:text-[#4D8EF8] mt-3 group/link"
          >
            <span className="underline underline-offset-4 decoration-[#1A6BF5]/40 group-hover/link:decoration-[#4D8EF8]">
              {readMore.label}
            </span>
            <span className="inline-block transition-transform group-hover/link:translate-x-1">→</span>
          </Link>
        )}
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);

  const handleToggle = (i) => {
    if (openIdx !== i) trackEvent("faq_opened", { question: FAQS[i].q });
    setOpenIdx(openIdx === i ? -1 : i);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <Helmet>
        <title>FAQ · Traigent</title>
        <meta
          name="description"
          content="Common questions about Traigent: how the optimization engine works, integration, supported LLM providers, pricing, security, and how Traigent differs from observability and evaluation tools."
        />
        <meta property="og:title" content="Traigent FAQ" />
        <meta property="og:description" content="Common questions about Traigent's optimization platform." />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <section className="bg-[#080808] text-white min-h-screen py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">FAQ</h1>
            <p className="text-lg md:text-xl text-slate-400">
              Common questions about the Traigent platform. Don't see your question? <a href="/#contact" className="text-[#1A6BF5] hover:text-[#4D8EF8] underline underline-offset-4">Reach out directly</a>.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {FAQS.map((faq, i) => (
              <FAQItem
                key={i}
                idx={i}
                q={faq.q}
                a={faq.a}
                readMore={faq.readMore}
                isOpen={openIdx === i}
                onToggle={() => handleToggle(i)}
              />
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16 text-center"
          >
            <p className="text-slate-400 mb-4">Still have questions?</p>
            <a
              href="https://meetings-eu1.hubspot.com/amir8"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("demo_booking_clicked", { location: "faq" })}
              className="inline-block bg-[#1A6BF5] hover:bg-[#4D8EF8] text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Book a 15-min call →
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
