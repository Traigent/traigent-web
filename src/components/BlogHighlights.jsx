import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { getAllPosts } from "../lib/blog";
import { trackEvent } from "../lib/analytics";

// Surfaces the 3 latest blog posts on the homepage to make objection-handler
// content discoverable without forcing visitors into the nav.
export default function BlogHighlights() {
  const posts = getAllPosts().slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section className="py-20 bg-[#080808] border-t border-slate-800/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Traigent</h2>
          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Direct arguments for engineering leaders evaluating AI agent optimization.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 * i }}
              className="bg-slate-900/60 border border-slate-700/50 hover:border-slate-600 rounded-2xl p-6 transition-colors"
            >
              <Link
                to={`/blog/${post.slug}`}
                onClick={() => trackEvent("blog_highlight_clicked", { slug: post.slug, location: "homepage" })}
                className="block group h-full flex flex-col"
              >
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
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#4D8EF8] transition-colors leading-tight">
                  {post.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-grow">{post.summary}</p>
                <div className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1A6BF5] group-hover:text-[#4D8EF8] transition-colors">
                  Read <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/blog"
            onClick={() => trackEvent("blog_index_clicked", { location: "homepage" })}
            className="inline-flex items-center gap-1.5 text-base font-medium text-slate-300 hover:text-white transition-colors"
          >
            See all arguments <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
