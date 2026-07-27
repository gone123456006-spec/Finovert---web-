import { lazy } from "react";
import { LazySection } from "./LazySection";

const LatestBlogSectionLazy = lazy(() =>
  import("./LatestBlogSection").then((mod) => ({
    default: mod.LatestBlogSection,
  }))
);

/** Blog loads only for its own section — never blocks the rest of the homepage. */
export function IndependentBlogSection() {
  return (
    <LazySection
      name="Blog"
      component={LatestBlogSectionLazy}
      minHeight={420}
      rootMargin="160px"
      idleTimeout={2200}
    />
  );
}
