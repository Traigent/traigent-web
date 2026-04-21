import { useEffect } from "react";
import { DEFAULT_PAGE_IMAGE, applyPageMeta } from "../utils/pageMeta";

export function usePageMeta({
  title,
  description,
  path = "/",
  image = DEFAULT_PAGE_IMAGE,
  structuredData,
}) {
  useEffect(() => {
    applyPageMeta({ title, description, path, image });

    const scriptId = "page-structured-data";
    document.getElementById(scriptId)?.remove();

    if (structuredData) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    return () => {
      document.getElementById(scriptId)?.remove();
    };
  }, [description, image, path, structuredData, title]);
}
