import { motion } from "framer-motion";
import { ArrowRight, Mail, MapPin } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { trackEvent } from "../lib/analytics";

const BLUE = "#1A6BF5";

// === Team — fill in real bios and photos. ===
// Photo paths can point to /public/team/*.jpg (recommended) or external URLs.
const TEAM = [
  // Founders (per OnePager / Investors pages):
  // - Achi Solomon — Co-founder, CEO (achi@traigent.ai)
  // - Dr. Nimrod Busany — Founder (nimrod@traigent.ai)
  // - Michael Sokolski — Co-founder, CTO (michael@traigent.ai)
  // Fill in real bios and photos when ready; placeholders below.
  {
    name: "Achi Solomon",
    role: "Co-founder & CEO",
    photo: null,
    bio: "Driving Traigent's mission to make AI agent optimization a solved problem.",
    linkedin: "",
  },
  {
    name: "Dr. Nimrod Busany",
    role: "Founder",
    photo: null,
    bio: "",
    linkedin: "",
  },
  {
    name: "Michael Sokolski",
    role: "Co-founder & CTO",
    photo: null,
    bio: "",
    linkedin: "",
  },
  {
    name: "Amir Barnea",
    role: "VP Sales",
    photo: null,
    bio: "Helping engineering leaders see what Traigent can save them — in inference cost, engineer time, and shipping speed.",
    linkedin: "",
  },
];

const VALUES = [
  {
    title: "Mathematical, not magical",
    desc: "We don't replace engineer judgement with a black box. We replace one-dimensional guessing with principled, mathematically grounded exploration.",
  },
  {
    title: "Convergence, not coverage",
    desc: "The goal isn't to test every configuration — it's to find the right one fast. Our optimization engine is designed to converge, not exhaust.",
  },
  {
    title: "Built-in, not bolted-on",
    desc: "Observability and benchmark refinement aren't separate products. Optimization needs them, so they ship together — as one coherent platform.",
  },
];

export default function About() {
  return (
    <>
      <Helmet>
        <title>About · Traigent</title>
        <meta
          name="description"
          content="Traigent is building the AI Agent Optimization Platform — automatic, mathematical, continuous. Meet the team and the principles behind the product."
        />
        <meta property="og:title" content="About Traigent" />
        <meta property="og:description" content="The team and principles behind Traigent." />
      </Helmet>

      <section className="bg-[#080808] text-white min-h-screen py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-16 text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              We're building the <span style={{ color: BLUE }}>optimization layer</span> for AI agents.
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Optimization is the missing piece between agents that *exist* and agents that are *production-grade*. We're making it automatic.
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-20 max-w-3xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">The problem we exist to solve</h2>
            <p className="text-lg text-slate-300 leading-relaxed mb-4">
              Every AI agent has hundreds — often millions — of valid configurations. The one a team picks decides whether their monthly bill is $10k or $100k, whether accuracy is 95% or 70%, whether they ship in weeks or months.
            </p>
            <p className="text-lg text-slate-300 leading-relaxed mb-4">
              Today, that decision is made on gut feel. Senior engineers pick a model, fix every other dimension at "vibes," and ship whatever cost-quality point falls out. The configuration space is too big to explore by hand.
            </p>
            <p className="text-lg text-slate-300 leading-relaxed">
              <span className="text-white font-semibold">That's the gap we close.</span> Traigent makes finding the optimum a mathematical certainty — in hours, not weeks. Automatically, not manually.
            </p>
          </motion.div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-20"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">What we believe</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {VALUES.map((v) => (
                <div key={v.title} className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-3">{v.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Team */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-20"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">Team</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {TEAM.map((m) => (
                <div key={m.name} className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 text-center">
                  {m.photo ? (
                    <img src={m.photo} alt={m.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border border-slate-700" />
                  ) : (
                    <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl font-bold text-slate-500">
                      {m.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                  )}
                  <div className="text-lg font-bold text-white">{m.name}</div>
                  <div className="text-sm font-mono mb-3" style={{ color: BLUE }}>{m.role}</div>
                  <p className="text-sm text-slate-400 leading-relaxed">{m.bio}</p>
                  {m.linkedin && (
                    <a
                      href={m.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-sm text-[#1A6BF5] hover:text-[#4D8EF8] transition-colors"
                    >
                      LinkedIn →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Company info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 mb-16"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm text-slate-500 font-mono uppercase tracking-wider mb-1">Where</div>
                  <div className="text-slate-200">Traigent Ltd, Hartglas 16, Tel-Aviv, Israel</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm text-slate-500 font-mono uppercase tracking-wider mb-1">Contact</div>
                  <a
                    href="mailto:amir@traigent.ai"
                    onClick={() => trackEvent("email_clicked", { location: "about" })}
                    className="text-[#1A6BF5] hover:text-[#4D8EF8] transition-colors"
                  >
                    amir@traigent.ai
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Want to work with us, or just talk?</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://meetings-eu1.hubspot.com/amir8"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("demo_booking_clicked", { location: "about" })}
                className="inline-flex items-center bg-[#1A6BF5] hover:bg-[#4D8EF8] text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                Book a 15-min call
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
