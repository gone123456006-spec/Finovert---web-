import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useState } from "react";
import { Check } from "lucide-react";

const useCases = [
  {
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
    fallback:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
    imageAlt: "Startup team collaborating",
    title: "Startups",
    description: "Track runway, burn rate, and investor reports.",
    benefits: ["Runway tracking", "Burn rate analysis", "Investor reports", "Growth metrics"],
  },
  {
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
    fallback:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
    imageAlt: "SME business operations",
    title: "SMEs",
    description: "Manage expenses, compliance, and growth.",
    benefits: ["Expense management", "Compliance automation", "Growth planning", "Team collaboration"],
  },
  {
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
    fallback:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
    imageAlt: "Enterprise corporate workspace",
    title: "Enterprises",
    description: "Advanced analytics and financial strategy at scale.",
    benefits: ["Advanced analytics", "Strategic insights", "Multi-team support", "Custom integrations"],
  },
];

function UseCaseImage({
  src,
  fallback,
  alt,
}: {
  src: string;
  fallback: string;
  alt: string;
}) {
  const [currentSrc, setCurrentSrc] = useState(src);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => {
        if (currentSrc !== fallback) setCurrentSrc(fallback);
      }}
    />
  );
}

export function UseCases() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="use-cases" ref={ref} className="py-16 sm:py-20 bg-gradient-to-b from-white to-[#f7f8fa] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1428A0] mb-2">Use cases</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0B1220] mb-3 tracking-tight">
            Who is it for?
          </h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto">
            Tailored solutions for every business stage
          </p>
        </motion.div>

        {/* Mobile: horizontal scroll · Desktop: 3-column grid */}
        <div
          className="
            flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4
            md:mx-0 md:px-0 md:pb-0 md:grid md:grid-cols-3 md:gap-6 lg:gap-8 md:overflow-visible
            scrollbar-hide
          "
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {useCases.map((useCase, index) => (
            <motion.article
              key={useCase.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="
                group relative shrink-0 snap-center
                w-[min(88vw,340px)] sm:w-[320px]
                md:w-auto md:shrink
              "
            >
              <div className="relative bg-white rounded-[28px] border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 h-full flex flex-col overflow-hidden">
                <div className="relative aspect-[16/10] overflow-hidden bg-[#eef0f4]">
                  <UseCaseImage
                    src={useCase.image}
                    fallback={useCase.fallback}
                    alt={useCase.imageAlt}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  <span className="absolute bottom-4 left-4 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-xs font-bold text-[#0B1220] shadow-sm">
                    {useCase.title}
                  </span>
                </div>

                <div className="p-6 sm:p-7 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-[#0B1220] mb-2 md:hidden">{useCase.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-5 leading-relaxed">
                    {useCase.description}
                  </p>

                  <ul className="space-y-3 mt-auto">
                    {useCase.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-2.5 text-gray-700">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1428A0]/10 text-[#1428A0]">
                          <Check className="w-3 h-3" strokeWidth={3} />
                        </span>
                        <span className="text-sm font-medium">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
}
