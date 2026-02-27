import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Shield, Zap, Award, Clock } from "lucide-react";

const reasons = [
  {
    icon: "🇮🇳",
    title: "Built for modern Indian businesses",
    description: "Designed specifically for Indian market regulations and compliance",
  },
  {
    icon: Shield,
    title: "AI-driven decision making",
    description: "Leverage artificial intelligence for smarter financial strategies",
  },
  {
    icon: Zap,
    title: "No complex accounting knowledge required",
    description: "Intuitive interface that anyone can use",
  },
  {
    icon: Award,
    title: "Secure and scalable platform",
    description: "Bank-grade security with enterprise-level scalability",
  },
  {
    icon: Clock,
    title: "Saves time, reduces cost",
    description: "Automate repetitive tasks and cut operational expenses",
  },
];

export function WhyFinovert() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Why Choose Finovert?
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-6">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 flex flex-row items-center gap-6"
            >
              <div className="text-4xl sm:text-5xl shrink-0 group-hover:scale-110 transition-transform duration-300">
                {typeof reason.icon === 'string' ? reason.icon : <reason.icon className="w-12 h-12" />}
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-1">
                  {reason.title}
                </h3>
                <p className="text-purple-100 leading-relaxed text-sm sm:text-base">
                  {reason.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}