import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap } from "lucide-react";
import { Helmet } from "react-helmet-async";

const BLUE = "#1A6BF5";

// Course catalog. Add new courses by appending entries here.
const COURSES = [
  {
    slug: "agents-in-production",
    title: "Agents in Production",
    summary:
      "How to take an AI agent from prototype to a production-ready, cost-performance-optimized system — without guessing.",
    duration: "~45 min · self-paced",
    level: "Intro · engineering teams",
    status: "available",
  },
  {
    slug: "statistical-se-workshop",
    title: "Statistical Software Engineering for AI Agents",
    summary:
      "A 40+ minute workshop on governed AI configuration, empirical trade-offs, TVL, tunable patterns, and a runnable Traigent SDK demo. Academic discipline, engineering rigor.",
    duration: "~45–90 min · concise + full versions",
    level: "Advanced · platform / ML / research",
    status: "available",
  },
];

export default function AcademyIndex() {
  return (
    <>
      <Helmet>
        <title>Academy · Traigent</title>
        <meta
          name="description"
          content="Short, focused courses on shipping AI agents in production: cost-performance optimization, evaluation, observability, and governed promotion."
        />
      </Helmet>

      <section className="bg-[#080808] text-white min-h-screen py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-mono tracking-wider mb-4"
              style={{ color: "#4D8EF8" }}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              TRAIGENT ACADEMY
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              Short courses for teams shipping AI agents
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Free, practical, no fluff. Drop your work email to get access to
              each course.
            </p>
          </motion.div>

          <div className="grid gap-5 max-w-3xl mx-auto">
            {COURSES.map((c) => (
              <Link
                key={c.slug}
                to={`/academy/${c.slug}`}
                className="block bg-slate-900/40 border border-slate-800 hover:border-[#4D8EF8]/40 rounded-2xl p-6 md:p-8 transition-colors group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-[#4D8EF8] transition-colors">
                      {c.title}
                    </h2>
                    <p className="text-slate-300 mb-3 leading-relaxed">
                      {c.summary}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono tracking-wider text-slate-500">
                      <span>{c.duration.toUpperCase()}</span>
                      {c.level && <span>· {c.level.toUpperCase()}</span>}
                    </div>
                  </div>
                  <ArrowRight
                    className="w-5 h-5 mt-1 flex-shrink-0 text-slate-500 group-hover:text-[#4D8EF8] group-hover:translate-x-1 transition-all"
                    style={{ color: BLUE }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
