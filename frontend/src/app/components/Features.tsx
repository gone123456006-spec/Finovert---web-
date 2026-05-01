import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";

const features = [
  {
    iconSrc: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f4ca.png",
    iconAlt: "Analytics icon",
    title: "Analytics",
    description: "Live dashboards",
  },
  {
    iconSrc: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f4c8.png",
    iconAlt: "Forecasting icon",
    title: "Forecasting",
    description: "Predict cash flow",
  },
  {
    iconSrc: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/2705.png",
    iconAlt: "Compliance icon",
    title: "Compliance",
    description: "Auto taxes & GST",
  },
  {
    iconSrc: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f9e0.png",
    iconAlt: "AI advisor icon",
    title: "AI Advisor",
    description: "Smart insights",
  },
  {
    iconSrc: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f4b0.png",
    iconAlt: "Expenses icon",
    title: "Expenses",
    description: "Track spending",
  },
  {
    iconSrc: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f465.png",
    iconAlt: "Team icon",
    title: "Team",
    description: "Collaborate",
  },
];

export function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" ref={ref} className="py-14 sm:py-16 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            Powerful Finance Features
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group relative bg-white p-4 sm:p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-gray-300 flex flex-col items-center text-center min-h-[132px]"
            >
              {/* Icon */}
              <div className="p-2 rounded-lg bg-gray-100 mb-3 group-hover:scale-110 transition-transform duration-300">
                <img
                  src={feature.iconSrc}
                  alt={feature.iconAlt}
                  className="w-5 h-5 object-contain"
                  loading="lazy"
                />
              </div>

              {/* Content */}
              <h3 className="text-sm font-bold text-gray-900 mb-1">
                {feature.title}
              </h3>
              <p className="text-xs text-gray-500 leading-tight hidden sm:block">
                {feature.description}
              </p>

              {/* Hover effect line */}
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-black"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
