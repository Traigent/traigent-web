// =============================================================================
// ARCHIVED — "Optimization in Action" section
// =============================================================================
// Removed from Homepage.jsx on 2026-05-18. Sat between the products area and
// "How It Works". Showed a live-playing OptimizationTable demo.
//
// To restore: import this component into Homepage.jsx and drop it in BEFORE
// the "How It Works" section:
//
//   import OptimizationInActionSection from "../_archive/OptimizationInActionSection";
//   ...
//   <OptimizationInActionSection />
//   {/* How It Works */}
// =============================================================================

import { motion } from "framer-motion";
import OptimizationTable from "../components/OptimizationTable";

export default function OptimizationInActionSection() {
  return (
    <section className="py-20 bg-[#080808] border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Optimization in Action</h2>
          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Watch Traigent sweep hundreds of model and configuration combinations and converge to the optimum — accuracy, cost, latency, or any KPI you choose.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-slate-700/50"
        >
          <OptimizationTable autoPlay={true} embedded={true} />
        </motion.div>
      </div>
    </section>
  );
}
