import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  BarChart3,
  LineChart,
  ShieldCheck,
  Landmark,
  Receipt,
  BadgeCheck,
  type LucideIcon,
} from "lucide-react";

const features: {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string;
}[] = [
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Live finance dashboards",
    accent: "bg-[#0B1F47]",
  },
  {
    icon: LineChart,
    title: "Forecasting",
    description: "Cash flow projections",
    accent: "bg-[#0F2A5F]",
  },
  {
    icon: ShieldCheck,
    title: "Compliance",
    description: "GST, tax & filings",
    accent: "bg-[#1428A0]",
  },
  {
    icon: Landmark,
    title: "Banking",
    description: "Accounts & reconciliation",
    accent: "bg-[#1d4ed8]",
  },
  {
    icon: Receipt,
    title: "Expenses",
    description: "Bills & spend tracking",
    accent: "bg-[#2563eb]",
  },
  {
    icon: BadgeCheck,
    title: "Trusted",
    description: "CA-led, bank-grade ops",
    accent: "bg-[#3b5bdb]",
  },
];

function FinanceFeatureIcon({
  icon: Icon,
  className = "w-5 h-5",
}: {
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <Icon
      className={`shrink-0 stroke-white ${Icon === BadgeCheck ? "fill-white/20" : "fill-none"} ${className}`}
      strokeWidth={2.25}
      aria-hidden
    />
  );
}

const MOBILE_CARD_WIDTH_PX = 118;
const MIN_SCALE = 0.86;
const MAX_SCALE = 1.08;

type CardMotion = { scale: number; opacity: number };

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

function useScrollCardMotion(itemCount: number) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);
  const [motions, setMotions] = useState<CardMotion[]>(() =>
    Array.from({ length: itemCount }, () => ({ scale: MIN_SCALE, opacity: 0.5 })),
  );
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;

    const update = () => {
      const viewportCenter = root.scrollLeft + root.clientWidth / 2;
      const falloff = Math.max(root.clientWidth * 0.5, MOBILE_CARD_WIDTH_PX * 1.4);
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;
      const next: CardMotion[] = [];

      cardRefs.current.forEach((card, index) => {
        if (!card) {
          next.push({ scale: MIN_SCALE, opacity: 0.5 });
          return;
        }

        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCenter - viewportCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }

        const proximity = smoothstep(Math.max(0, 1 - distance / falloff));
        next.push({
          scale: MIN_SCALE + proximity * (MAX_SCALE - MIN_SCALE),
          opacity: 0.45 + proximity * 0.55,
        });
      });

      setActiveIndex(closestIndex);
      setMotions(next);
    };

    const onScroll = () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        update();
      });
    };

    const timer = window.setTimeout(update, 50);
    root.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.clearTimeout(timer);
      root.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [itemCount]);

  const setCardRef = (index: number) => (el: HTMLDivElement | null) => {
    cardRefs.current[index] = el;
  };

  return { scrollRef, motions, activeIndex, setCardRef };
}

export function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollRef, motions, activeIndex, setCardRef } = useScrollCardMotion(features.length);
  const sidePadding = `max(1rem, calc(50% - ${MOBILE_CARD_WIDTH_PX / 2}px))`;

  return (
    <section id="features" ref={ref} className="pt-3 sm:pt-14 pb-4 sm:pb-6 bg-[#f4f7fc] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-5 md:mb-10"
        >
          <h2 className="text-3xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            Powerful Finance Features
          </h2>
        </motion.div>

        {/* Mobile: horizontal carousel with centered “hero” card */}
        <div
          ref={scrollRef}
          className="md:hidden flex items-center gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-1 pb-2 -mx-4"
          style={{
            WebkitOverflowScrolling: "touch",
            paddingLeft: sidePadding,
            paddingRight: sidePadding,
            scrollPaddingLeft: sidePadding,
            scrollPaddingRight: sidePadding,
          }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isActive = activeIndex === index;
            const { scale, opacity } = motions[index] ?? { scale: MIN_SCALE, opacity: 0.5 };
            const centered = scale > 0.98;

            return (
              <div
                key={feature.title}
                ref={setCardRef(index)}
                className="shrink-0 snap-center w-[118px] origin-center will-change-transform"
                style={{
                  transform: `scale(${scale})`,
                  opacity,
                  zIndex: isActive ? 10 : 1,
                }}
              >
                <div
                  className={`
                    flex flex-col items-center justify-center text-center rounded-xl border bg-white min-h-[112px] p-3
                    transition-[box-shadow,border-color] duration-200
                    ${centered ? "shadow-[0_10px_28px_rgba(0,0,0,0.12)] border-gray-200" : "shadow-sm border-gray-100"}
                  `}
                >
                  <div
                    className={`
                      mb-2 flex items-center justify-center rounded-lg ${feature.accent} text-white shadow-sm
                      ${centered ? "h-10 w-10 shadow-md" : "h-8 w-8"}
                    `}
                    aria-hidden
                  >
                    <FinanceFeatureIcon icon={Icon} className={centered ? "w-5 h-5" : "w-4 h-4"} />
                  </div>

                  <h3 className={`font-bold text-gray-900 leading-tight ${centered ? "text-sm" : "text-xs"}`}>
                    {feature.title}
                  </h3>
                  {centered && (
                    <p className="mt-1 text-[10px] text-gray-500 leading-tight line-clamp-2">
                      {feature.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Tablet & desktop: grid */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group relative bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-gray-300 flex flex-col items-center text-center min-h-[132px]"
              >
                <div
                  className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${feature.accent} text-white shadow-md group-hover:scale-110 transition-transform duration-300`}
                  aria-hidden
                >
                  <FinanceFeatureIcon icon={Icon} />
                </div>

                <h3 className="text-sm font-bold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-xs text-gray-500 leading-tight">{feature.description}</p>

                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-black"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
