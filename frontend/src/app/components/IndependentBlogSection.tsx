import { lazy, Suspense, useEffect, useState, useRef } from "react";
import { BlogErrorBoundary } from "./BlogErrorBoundary";

// Lazy load the blog section with LOWEST priority
const LatestBlogSectionLazy = lazy(() => 
  import("./LatestBlogSection").then((mod) => ({
    default: mod.LatestBlogSection,
  }))
);

/**
 * Independent blog section wrapper
 * - Loads only when visible (IntersectionObserver)
 * - Uses requestIdleCallback for lowest priority
 * - Isolated with error boundary
 * - CSS containment prevents layout shifts
 */
export function IndependentBlogSection() {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Only load when user scrolls near the blog section
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isVisible) {
          setIsVisible(true);
          
          // Use requestIdleCallback for LOWEST priority loading
          if ('requestIdleCallback' in window) {
            window.requestIdleCallback(() => {
              setShouldLoad(true);
            }, { timeout: 2000 });
          } else {
            // Fallback for browsers without requestIdleCallback
            setTimeout(() => setShouldLoad(true), 1000);
          }
        }
      },
      {
        rootMargin: '200px', // Start loading 200px before visible
        threshold: 0.01
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <div
      ref={ref}
      style={{
        // Complete isolation - blog won't affect rest of page
        isolation: 'isolate',
        contain: 'layout style paint',
        minHeight: shouldLoad ? 'auto' : '400px'
      }}
    >
      {shouldLoad ? (
        <BlogErrorBoundary>
          <Suspense fallback={<BlogLoadingFallback />}>
            <LatestBlogSectionLazy />
          </Suspense>
        </BlogErrorBoundary>
      ) : (
        <BlogLoadingFallback />
      )}
    </div>
  );
}

function BlogLoadingFallback() {
  return (
    <section className="bg-white py-12 sm:py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
          <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
          <div className="h-6 w-20 animate-pulse rounded bg-slate-200" />
        </div>
        <div className="flex gap-7 overflow-hidden lg:gap-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-[min(85vw,320px)] shrink-0 sm:w-[340px] lg:w-[360px]">
              <div className="animate-pulse">
                <div className="aspect-[16/10] rounded-lg bg-slate-200" />
                <div className="mt-4 space-y-3">
                  <div className="h-5 w-24 rounded-full bg-slate-200" />
                  <div className="h-6 w-full rounded bg-slate-200" />
                  <div className="h-4 w-11/12 rounded bg-slate-100" />
                  <div className="h-4 w-4/5 rounded bg-slate-100" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
