import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { Helmet } from "react-helmet-async";
import AcademyEmailGate from "./AcademyEmailGate";

/**
 * Shared chrome for an Academy course page: helmet, dark section, back-link,
 * email gate, and the "TRAIGENT ACADEMY" pill. Course pages pass their content
 * as children and override the pill label if needed.
 */
export default function AcademyCourseLayout({
  metaTitle,
  metaDescription,
  courseSlug,
  courseTitle,
  pillLabel = "TRAIGENT ACADEMY",
  children,
}) {
  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
      </Helmet>

      <section className="bg-[#080808] text-white min-h-screen py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              to="/academy"
              className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Academy
            </Link>

            <AcademyEmailGate courseSlug={courseSlug} courseTitle={courseTitle}>
              <div className="max-w-3xl mx-auto">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-mono tracking-wider mb-4"
                  style={{ color: "#4D8EF8" }}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  {pillLabel}
                </div>
                {children}
              </div>
            </AcademyEmailGate>
          </motion.div>
        </div>
      </section>
    </>
  );
}
