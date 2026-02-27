import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Bot, Zap, Target, TrendingUp } from "lucide-react";

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-24 bg-white overflow-hidden">
      {/* Curved Top Decor */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
        <svg
          className="relative block w-full h-[40px] sm:h-[60px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C300,120 900,120 1200,0 L1200,120 L0,120 Z"
            className="fill-white"
          ></path>
        </svg>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8">
            What is <span className="text-purple-600">Finovert</span>?
          </h2>

          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            Finovert is a next-generation Virtual CFO platform designed to simplify and automate financial management.
            It combines AI, analytics, and automation to help businesses make smarter financial decisions in real time.
          </p>

          <p className="text-lg text-gray-600 leading-relaxed">
            Whether it's forecasting, compliance, or expense tracking — Finovert becomes your digital finance head.
          </p>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { label: "AI-Powered", icon: Bot, color: "text-purple-600" },
              { label: "Real-Time", icon: Zap, color: "text-blue-600" },
              { label: "Automated", icon: Target, color: "text-indigo-600" },
              { label: "Scalable", icon: TrendingUp, color: "text-violet-600" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl flex flex-col items-center group hover:bg-white hover:shadow-xl transition-all duration-300"
              >
                <div className={`${item.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-10 h-10" />
                </div>
                <div className="font-semibold text-gray-900">{item.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
