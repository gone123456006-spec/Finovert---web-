import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { ShieldCheck, Zap, Globe, Lock, TrendingUp } from "lucide-react";

const reasons = [
  {
    icon: Globe,
    title: "Built for Modern India",
    description: "Designed specifically for Indian market regulations and tax compliance frameworks.",
    tag: "Native"
  },
  {
    icon: ShieldCheck,
    title: "AI Decision Intelligence",
    description: "Leverage advanced AI to transform raw data into actionable financial strategies.",
    tag: "Smart"
  },
  {
    icon: Zap,
    title: "Zero Learning Curve",
    description: "An intuitive interface designed for business owners, not just accountants.",
    tag: "Easy"
  },
  {
    icon: Lock,
    title: "Bank-Grade Security",
    description: "Enterprise-level encryption and security protocols to keep your data safe.",
    tag: "Secure"
  },
  {
    icon: TrendingUp,
    title: "Scalable Growth",
    description: "Automate repetitive tasks and reduce overhead as your business expands.",
    tag: "Global"
  },
];

export function WhyFinovert() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="why-finovert" ref={ref} className="py-24 bg-[#F0F9FF] relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-sky-200/30 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6 uppercase tracking-tighter">
            Why Choose <span className="text-blue-600">Finovert?</span>
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white p-6 sm:p-8 rounded-[24px] shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgb(0,0,0,0.06)] transition-all duration-300 border border-gray-100"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 tracking-tight group-hover:text-blue-600 transition-colors">
                    {reason.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    {reason.description}
                  </p>
                </div>
                <div className="shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    {reason.tag}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
