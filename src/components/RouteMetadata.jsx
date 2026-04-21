import { useEffect } from "react";
import { routeMeta } from "../content/siteContent";
import { applyPageMeta } from "../utils/pageMeta";

export default function RouteMetadata({ path, children }) {
  useEffect(() => {
    const meta = routeMeta[path];

    if (meta) {
      applyPageMeta({ ...meta, path });
    }
  }, [path]);

  return children;
}
