import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { BarChart3, TrendingUp, FileCheck, Brain, Wallet, Users } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Live dashboards",
    gradient: "from-purple-500 to-purple-600",
  },
  {
    icon: TrendingUp,
    title: "Forecasting",
    description: "Predict cash flow",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    icon: FileCheck,
    title: "Compliance",
    description: "Auto taxes & GST",
    gradient: "from-indigo-500 to-indigo-600",
  },
  {
    icon: Brain,
    title: "AI Advisor",
    description: "Smart insights",
    gradient: "from-violet-500 to-violet-600",
  },
  {
    icon: Wallet,
    title: "Expenses",
    description: "Track spending",
    gradient: "from-purple-500 to-pink-600",
  },
  {
    icon: Users,
    title: "Team",
    description: "Collaborate",
    gradient: "from-blue-500 to-purple-600",
  },
];

export function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" ref={ref} className="py-12 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            Powerful Finance Features
          </h2>
        </motion.div>

        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group relative bg-white p-3 sm:p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-purple-200 flex flex-col items-center text-center"
            >
              {/* Icon */}
              <div className={`p-2 rounded-lg bg-gradient-to-br ${feature.gradient} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-5 h-5 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1">
                {feature.title}
              </h3>
              <p className="text-[10px] text-gray-500 leading-tight hidden sm:block">
                {feature.description}
              </p>

              {/* Hover effect line */}
              <motion.div
                className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r ${feature.gradient}`}
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
