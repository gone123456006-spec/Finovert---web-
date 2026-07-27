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
  /** Skip viewport check — load on idle after mount (for floating widgets) */
  loadOnIdle?: boolean;
  name?: string;
  fallback?: ReactNode;
  className?: string;
};

/**
 * Loads one page section independently:
 * - IntersectionObserver: only when near viewport
 * - requestIdleCallback: lowest priority once visible
 * - Error boundary + CSS containment: cannot freeze or break other sections
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
  const triggeredRef = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (triggeredRef.current) return;

    const startLoad = () => {
      if (triggeredRef.current) return;
      triggeredRef.current = true;

      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(() => setShouldLoad(true), { timeout: idleTimeout });
      } else {
        window.setTimeout(() => setShouldLoad(true), Math.min(idleTimeout, 800));
      }
    };

    if (loadOnIdle) {
      startLoad();
      return;
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
    return () => observer.disconnect();
  }, [idleTimeout, loadOnIdle, rootMargin]);

  const placeholder = fallback ?? <SectionSkeleton minHeight={minHeight} />;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        isolation: "isolate",
        contain: "layout style paint",
        minHeight: shouldLoad ? undefined : minHeight,
      }}
    >
      {shouldLoad ? (
        <SectionErrorBoundary name={name}>
          <Suspense fallback={placeholder}>
            <LazyComponent />
          </Suspense>
        </SectionErrorBoundary>
      ) : (
        placeholder
      )}
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
