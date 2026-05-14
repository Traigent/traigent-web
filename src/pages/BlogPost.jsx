import { Link, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPostBySlug } from "../lib/blog";

// Renderers that map Markdown elements to our brand typography.
// Keep this small and easy to tweak.
const mdComponents = {
  h1: ({ node, ...props }) => (
    <h1 className="text-3xl md:text-4xl font-bold text-white mt-12 mb-6 tracking-tight" {...props} />
  ),
  h2: ({ node, ...props }) => (
    <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-4 tracking-tight" {...props} />
  ),
  h3: ({ node, ...props }) => (
    <h3 className="text-xl md:text-2xl font-semibold text-white mt-8 mb-3" {...props} />
  ),
  p: ({ node, ...props }) => <p className="text-slate-300 leading-relaxed my-5" {...props} />,
  ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-6 space-y-2 my-5 text-slate-300" {...props} />,
  ol: ({ node, ...props }) => <ol className="list-decimal list-outside ml-6 space-y-2 my-5 text-slate-300" {...props} />,
  li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
  blockquote: ({ node, ...props }) => (
    <blockquote
      className="border-l-4 border-[#1A6BF5] pl-5 py-1 my-6 italic text-slate-200 bg-[#1A6BF5]/5 rounded-r"
      {...props}
    />
  ),
  a: ({ node, ...props }) => (
    <a className="text-[#1A6BF5] hover:text-[#4D8EF8] underline underline-offset-4 transition-colors" {...props} />
  ),
  code: ({ node, inline, className, children, ...props }) =>
    inline ? (
      <code className="px-1.5 py-0.5 rounded bg-slate-800 text-[#93c5fd] text-[0.9em] font-mono" {...props}>
        {children}
      </code>
    ) : (
      <code className="block bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-200 text-sm font-mono overflow-x-auto" {...props}>
        {children}
      </code>
    ),
  pre: ({ node, ...props }) => <pre className="my-6" {...props} />,
  strong: ({ node, ...props }) => <strong className="text-white font-semibold" {...props} />,
  em: ({ node, ...props }) => <em className="italic text-slate-200" {...props} />,
  hr: () => <hr className="border-slate-800 my-12" />,
  table: ({ node, ...props }) => (
    <div className="my-8 overflow-x-auto">
      <table className="w-full border-collapse" {...props} />
    </div>
  ),
  thead: ({ node, ...props }) => <thead className="border-b border-slate-700" {...props} />,
  th: ({ node, ...props }) => (
    <th className="text-left text-[#93c5fd] font-semibold py-3 px-4 text-sm" {...props} />
  ),
  td: ({ node, ...props }) => (
    <td className="border-b border-slate-800 py-3 px-4 text-slate-300 text-sm" {...props} />
  ),
};

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  if (!post) return <Navigate to="/blog" replace />;

  const ogDescription = post.summary || "";

  return (
    <>
      <Helmet>
        <title>{post.title} · Traigent Blog</title>
        <meta name="description" content={ogDescription} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:type" content="article" />
        {post.author && <meta property="article:author" content={post.author} />}
        {post.date && <meta property="article:published_time" content={post.date} />}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: ogDescription,
            datePublished: post.date,
            author: post.author ? { "@type": "Person", name: post.author } : undefined,
            publisher: {
              "@type": "Organization",
              name: "Traigent",
              url: "https://traigent.ai",
            },
          })}
        </script>
      </Helmet>

      <section className="bg-[#080808] text-white min-h-screen py-16 md:py-20">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            All posts
          </Link>

          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-4 font-mono">
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
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              {post.title}
            </h1>
            {post.author && (
              <p className="mt-6 text-slate-500 text-sm">By {post.author}</p>
            )}
          </motion.header>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="prose-invert"
          >
            <ReactMarkdown components={mdComponents} remarkPlugins={[remarkGfm]}>
              {post.body}
            </ReactMarkdown>
          </motion.div>

          {/* CTA at end of post */}
          <div className="mt-16 pt-8 border-t border-slate-800 text-center">
            <p className="text-slate-400 mb-4">Ready to see Traigent in action?</p>
            <a
              href="https://meetings-eu1.hubspot.com/amir8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#1A6BF5] hover:bg-[#4D8EF8] text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Book a 15-minute demo →
            </a>
          </div>
        </article>
      </section>
    </>
  );
}
