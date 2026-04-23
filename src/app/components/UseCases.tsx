import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";

const useCases = [
  {
    iconSrc: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f680.png",
    iconAlt: "Startups icon",
    title: "Startups",
    description: "Track runway, burn rate, and investor reports.",
    color: "from-purple-500 to-pink-500",
    benefits: ["Runway tracking", "Burn rate analysis", "Investor reports", "Growth metrics"],
  },
  {
    iconSrc: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f3e2.png",
    iconAlt: "SMEs icon",
    title: "SMEs",
    description: "Manage expenses, compliance, and growth.",
    color: "from-blue-500 to-purple-500",
    benefits: ["Expense management", "Compliance automation", "Growth planning", "Team collaboration"],
  },
  {
    iconSrc: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f3e6.png",
    iconAlt: "Enterprises icon",
    title: "Enterprises",
    description: "Advanced analytics and financial strategy at scale.",
    color: "from-indigo-500 to-blue-500",
    benefits: ["Advanced analytics", "Strategic insights", "Multi-team support", "Custom integrations"],
  },
];

export function UseCases() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="use-cases" ref={ref} className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Who is it for?
          </h2>
          <p className="text-base sm:text-xl text-gray-600">
            Tailored solutions for every business stage
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="group relative h-full"
            >
              {/* Card */}
              <div className="relative bg-white p-6 sm:p-8 rounded-[28px] sm:rounded-[32px] border border-gray-100 shadow-[0_4px_25px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-500 h-full flex flex-col">
                {/* Icon */}
                <div className="inline-flex p-4 rounded-2xl bg-gray-100 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <img
                    src={useCase.iconSrc}
                    alt={useCase.iconAlt}
                    className="w-8 h-8 object-contain"
                    loading="lazy"
                  />
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  {useCase.title}
                </h3>

                {/* Description */}
                <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6 leading-relaxed">
                  {useCase.description}
                </p>

                {/* Benefits List */}
                <ul className="space-y-3 sm:space-y-4 mt-auto">
                  {useCase.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3 text-gray-600 group/item">
                      <div className="w-1.5 h-1.5 rounded-full bg-black group-hover/item:scale-125 transition-transform" />
                      <span className="text-sm font-medium">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
