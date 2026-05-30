import { useEffect, useRef, useState, type ReactNode } from "react";

type AutoHorizontalScrollProps = {
  children: ReactNode;
  durationSec?: number;
  className?: string;
  trackClassName?: string;
};

/** Horizontal auto-scroll with manual touch/drag scrolling supported. */
export function AutoHorizontalScroll({
  children,
  durationSec = 42,
  className = "",
  trackClassName = "gap-4",
}: AutoHorizontalScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const el = scrollRef.current;
    if (!el) return;

    let raf = 0;

    const tick = () => {
      const half = el.scrollWidth / 2;
      if (!paused && half > el.clientWidth) {
        const pxPerFrame = half / (durationSec * 60);
        el.scrollLeft += pxPerFrame;
        if (el.scrollLeft >= half - 1) {
          el.scrollLeft -= half;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, durationSec, reduceMotion, children]);

  return (
    <div
      ref={scrollRef}
      className={`overflow-x-auto scrollbar-hide ${className}`}
      style={{ WebkitOverflowScrolling: "touch" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => {
        window.setTimeout(() => setPaused(false), 2500);
      }}
      onPointerDown={() => setPaused(true)}
      onPointerUp={() => {
        window.setTimeout(() => setPaused(false), 2500);
      }}
    >
      <div className={`flex w-max ${trackClassName}`}>
        <div className={`flex shrink-0 ${trackClassName}`}>{children}</div>
        <div className={`flex shrink-0 ${trackClassName}`} aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
