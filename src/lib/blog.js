// Tiny frontmatter parser. We avoid `gray-matter` because it has Node deps that
// don't tree-shake cleanly into the browser bundle.
function parseFrontmatter(raw) {
  // Strip UTF-8 BOM if present (Windows PowerShell 5.1's `-Encoding utf8`
  // prepends U+FEFF, which would otherwise break the `^---` match).
  const clean = raw.replace(/^﻿/, "");
  const m = clean.match(/^---\r?\n([\s\S]+?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) return { meta: {}, body: clean };
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.+)$/);
    if (kv) meta[kv[1]] = kv[2].replace(/^["']|["']$/g, "").trim();
  }
  return { meta, body: m[2] };
}

// Vite import.meta.glob — bundles every .md in src/content/blog at build time.
// `query: '?raw'` returns the file as a string (replaces the deprecated `as: 'raw'`).
const modules = import.meta.glob("/src/content/blog/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

const posts = Object.entries(modules).map(([path, raw]) => {
  const { meta, body } = parseFrontmatter(raw);
  // Derive slug from filename if not in frontmatter
  const filename = path.split("/").pop().replace(/\.md$/, "");
  return {
    slug: meta.slug || filename,
    title: meta.title || filename,
    subtitle: meta.subtitle || "",
    date: meta.date || "",
    summary: meta.summary || "",
    author: meta.author || "",
    readingTime: meta.readingTime || "",
    tags: (meta.tags || "").split(",").map((t) => t.trim()).filter(Boolean),
    featured: meta.featured === "true" || meta.featured === true,
    order: meta.order ? Number(meta.order) : Infinity,
    body,
  };
});

// Featured posts first (ordered by explicit `order` field, ascending).
// Then non-featured posts by date descending.
posts.sort((a, b) => {
  if (a.featured !== b.featured) return a.featured ? -1 : 1;
  if (a.featured && b.featured) return a.order - b.order;
  return (b.date || "").localeCompare(a.date || "");
});

export function getAllPosts() {
  return posts;
}

export function getPostBySlug(slug) {
  return posts.find((p) => p.slug === slug);
}
