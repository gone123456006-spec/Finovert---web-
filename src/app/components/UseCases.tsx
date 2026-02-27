import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Rocket, Building2, Building } from "lucide-react";

const useCases = [
  {
    icon: Rocket,
    title: "Startups",
    description: "Track runway, burn rate, and investor reports.",
    color: "from-purple-500 to-pink-500",
    benefits: ["Runway tracking", "Burn rate analysis", "Investor reports", "Growth metrics"],
  },
  {
    icon: Building2,
    title: "SMEs",
    description: "Manage expenses, compliance, and growth.",
    color: "from-blue-500 to-purple-500",
    benefits: ["Expense management", "Compliance automation", "Growth planning", "Team collaboration"],
  },
  {
    icon: Building,
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
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Who is it for?
          </h2>
          <p className="text-xl text-gray-600">
            Tailored solutions for every business stage
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="group relative"
            >
              {/* Card */}
              <div className="relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl border-2 border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-300 h-full">
                {/* Gradient border on hover */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${useCase.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl`} />

                {/* Icon */}
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${useCase.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <useCase.icon className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {useCase.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {useCase.description}
                </p>

                {/* Benefits List */}
                <ul className="space-y-3">
                  {useCase.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-gray-700">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${useCase.color}`} />
                      <span>{benefit}</span>
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
