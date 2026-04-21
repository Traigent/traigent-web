export const SITE_URL = "https://traigent.ai";

function upsertMeta(selector, attributes) {
  let tag = document.head.querySelector(selector);

  if (!tag) {
    tag = document.createElement("meta");
    document.head.appendChild(tag);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    tag.setAttribute(key, value);
  });
}

function upsertCanonical(href) {
  let tag = document.head.querySelector('link[rel="canonical"]');

  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", "canonical");
    document.head.appendChild(tag);
  }

  tag.setAttribute("href", href);
}

export function canonicalUrlForPath(path = "/") {
  return `${SITE_URL}${path}`;
}

export function applyPageMeta({
  title,
  description,
  path = "/",
}) {
  const canonicalUrl = canonicalUrlForPath(path);

  document.title = title;
  upsertCanonical(canonicalUrl);
  upsertMeta('meta[name="description"]', { name: "description", content: description });
  upsertMeta('meta[property="og:title"]', { property: "og:title", content: title });
  upsertMeta('meta[property="og:description"]', {
    property: "og:description",
    content: description,
  });
  upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonicalUrl });
  upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
  upsertMeta('meta[name="twitter:description"]', {
    name: "twitter:description",
    content: description,
  });
}
