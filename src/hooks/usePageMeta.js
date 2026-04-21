import { useEffect } from "react";
import { applyPageMeta } from "../utils/pageMeta";

export function usePageMeta({
  title,
  description,
  path = "/",
  structuredData,
}) {
  useEffect(() => {
    applyPageMeta({ title, description, path });

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
  }, [description, path, structuredData, title]);
}
