import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { getAllPosts } from "../lib/blog";

export default function Blog() {
  const posts = getAllPosts();

  return (
    <>
      <Helmet>
        <title>Why Traigent · The Case for AI Agent Optimization</title>
        <meta
          name="description"
          content="The case for Traigent. Direct arguments for engineering leaders evaluating AI agent optimization — addressing the assumptions, misconceptions, and trade-offs at play."
        />
        <meta property="og:title" content="Why Traigent — The Case for AI Agent Optimization" />
        <meta
          property="og:description"
          content="Direct arguments for engineering leaders evaluating AI agent optimization. Each post tackles a common objection with evidence and intuition."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <section className="bg-[#080808] text-white min-h-screen py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">Why Traigent</h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed">
              Direct arguments for engineering leaders evaluating AI agent optimization. Each post takes on a common objection or misconception with evidence and intuition.
            </p>
          </motion.div>

          {/* Posts list */}
          <div className="space-y-8">
            {posts.length === 0 ? (
              <p className="text-slate-500">No posts yet.</p>
            ) : (
              posts.map((post, i) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.05 * i }}
                  className="border border-slate-800 hover:border-slate-700 rounded-2xl p-6 md:p-8 bg-slate-900/40 transition-colors"
                >
                  <Link to={`/blog/${post.slug}`} className="block group">
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-3 font-mono">
                      {post.date && (
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" />
                          {post.date}
                        </span>
                      )}
                      {post.readingTime && (
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          {post.readingTime}
                        </span>
                      )}
                      {post.tags && post.tags.length > 0 && (
                        <span className="inline-flex flex-wrap gap-1.5">
                          {post.tags.map((t) => (
                            <span key={t} className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">
                              {t}
                            </span>
                          ))}
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-[#4D8EF8] transition-colors leading-tight">
                      {post.title}
                    </h2>
                    <p className="text-slate-400 leading-relaxed mb-4">{post.summary}</p>
                    <div className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1A6BF5] group-hover:text-[#4D8EF8] transition-colors">
                      Read →
                    </div>
                  </Link>
                </motion.article>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}
