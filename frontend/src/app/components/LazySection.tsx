import {
  Suspense,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type LazyExoticComponent,
  type ReactNode,
} from "react";
import { SectionErrorBoundary } from "./SectionErrorBoundary";

type LazySectionProps = {
  /** Lazy component to mount only when this section is near the viewport */
  component: LazyExoticComponent<ComponentType>;
  /** Placeholder height so layout does not jump before load */
  minHeight?: number;
  /** Start loading this many px before the section enters view */
  rootMargin?: string;
  /** Idle timeout before forcing load once visible */
  idleTimeout?: number;
  /**
   * Skip the viewport check and load on idle after mount. Renders no wrapper
   * element, so position:fixed widgets keep the viewport as containing block.
   */
  loadOnIdle?: boolean;
  name?: string;
  fallback?: ReactNode;
  className?: string;
};

function scheduleIdle(run: () => void, timeout: number) {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(run, { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(run, Math.min(timeout, 800));
  return () => window.clearTimeout(id);
}

/**
 * Loads one page section independently:
 * - IntersectionObserver: only when near viewport
 * - requestIdleCallback: lowest priority once visible
 * - Error boundary: a broken section cannot take down the page
 */
export function LazySection({
  component: LazyComponent,
  minHeight = 280,
  rootMargin = "180px",
  idleTimeout = 1800,
  loadOnIdle = false,
  name,
  fallback,
  className,
}: LazySectionProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldLoad) return;

    let cancelIdle: (() => void) | undefined;
    const startLoad = () => {
      cancelIdle = scheduleIdle(() => setShouldLoad(true), idleTimeout);
    };

    if (loadOnIdle) {
      startLoad();
      return () => cancelIdle?.();
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          observer.disconnect();
          startLoad();
        }
      },
      { rootMargin, threshold: 0.01 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelIdle?.();
    };
  }, [idleTimeout, loadOnIdle, rootMargin, shouldLoad]);

  // `null` is a valid "render nothing" placeholder, so only default on undefined
  const placeholder =
    fallback !== undefined ? fallback : <SectionSkeleton minHeight={minHeight} />;

  const content = shouldLoad ? (
    <SectionErrorBoundary name={name}>
      <Suspense fallback={placeholder}>
        <LazyComponent />
      </Suspense>
    </SectionErrorBoundary>
  ) : (
    placeholder
  );

  // Floating widgets must not sit inside a contained wrapper
  if (loadOnIdle) return <>{content}</>;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        // layout-only containment: isolates reflow without clipping visuals
        contain: "layout",
        minHeight: shouldLoad ? undefined : minHeight,
      }}
    >
      {content}
    </div>
  );
}

function SectionSkeleton({ minHeight }: { minHeight: number }) {
  return (
    <div
      className="w-full animate-pulse bg-gradient-to-b from-slate-50 to-white"
      style={{ minHeight }}
      aria-hidden="true"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto mb-8 h-8 w-48 rounded bg-slate-200 sm:w-64" />
        <div className="mx-auto mb-10 h-4 max-w-md rounded bg-slate-100" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-36 rounded-xl bg-slate-100 sm:h-44" />
          ))}
        </div>
      </div>
    </div>
  );
}
