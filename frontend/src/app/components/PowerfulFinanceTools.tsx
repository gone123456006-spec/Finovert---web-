import { motion } from "motion/react";
import { useRef } from "react";
import { BarChart3, TrendingUp, Shield, Building2, FileText, Award } from "lucide-react";

const TOOLS = [
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Live finance dashboards",
  },
  {
    icon: TrendingUp,
    title: "Forecasting",
    description: "Cash flow projections",
  },
  {
    icon: Shield,
    title: "Compliance",
    description: "GST, tax & filings",
  },
  {
    icon: Building2,
    title: "Banking",
    description: "Accounts & reconciliation",
  },
  {
    icon: FileText,
    title: "Expenses",
    description: "Bills & spend tracking",
  },
  {
    icon: Award,
    title: "Trusted",
    description: "CA-led, bank-grade ops",
  },
];

export function PowerfulFinanceTools() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const Illustration = () => (
    <div className="relative mx-0 w-full max-w-[250px] sm:max-w-[320px] lg:ml-auto lg:mr-0 lg:max-w-[380px]">
      <img
        src="/forcasting.jpg"
        alt="Finance tools illustration"
        className="w-full object-contain relative z-10 mix-blend-multiply"
      />

      {/* Yellow Sparkle 1 */}
      <motion.div
        className="absolute top-[8%] left-[10%] z-0 text-[#CA8A04] drop-shadow-[0_0_12px_rgba(202,138,4,0.8)]"
        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="sm:w-12 sm:h-12">
          <path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" />
        </svg>
      </motion.div>

      {/* Yellow Sparkle 2 */}
      <motion.div
        className="absolute top-[18%] right-[35%] z-0 text-[#D97706] drop-shadow-[0_0_10px_rgba(217,119,6,0.8)]"
        animate={{ opacity: [0.2, 0.9, 0.2], scale: [0.7, 1, 0.7] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="sm:w-7 sm:h-7">
          <path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" />
        </svg>
      </motion.div>

      {/* Small Yellow Sparkle */}
      <motion.div
        className="absolute top-[35%] left-[0%] z-0 text-[#EAB308] drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]"
        animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.2, 0.9] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="sm:w-5 sm:h-5">
          <path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" />
        </svg>
      </motion.div>
    </div>
  );

  return (
    <section className="overflow-hidden bg-[linear-gradient(to_bottom,#F8FAFC_0%,#f0f4ff_20%,#f8f9ff_65%,#faf9ff_100%)]">
      <div
        ref={sectionRef}
        className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-14 lg:px-8 lg:py-16"
      >
        <div className="flex flex-col items-start gap-6 sm:gap-8 lg:flex-row lg:items-start lg:gap-16">
          {/* Left Column - Text + Tools */}
          <div className="w-full flex-1 text-left">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="mb-3 text-left text-[1.75rem] font-bold leading-tight tracking-tight text-[#1d1d1f] sm:mb-6 sm:text-[2.25rem] sm:tracking-tighter lg:text-[3.25rem]"
            >
              Powerful Finance{" "}
              <span className="relative inline-block">
                <span className="relative z-10 font-extrabold italic text-emerald-500">Tools</span>
                <span className="absolute -bottom-1.5 left-0 h-[3px] w-full rounded-full bg-emerald-400/50 sm:h-[4px]" />
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="mb-6 text-left text-sm font-medium leading-relaxed text-[#515154] sm:mb-8 sm:px-0 sm:text-base lg:text-[1.15rem]"
            >
              Get smart forecasting, instant compliance automation, real-time risk detection, and
              business intelligence all in one platform. Everything you need to run finance and
              growth with confidence.
            </motion.p>

            {/* Mobile Illustration */}
            <div className="mb-8 flex w-full items-center justify-start lg:hidden">
              <Illustration />
            </div>

            {/* Tools Grid */}
            <div className="mb-6 grid grid-cols-3 justify-items-center gap-3 sm:mb-8 sm:grid-cols-6 sm:justify-items-start sm:gap-4">
              {TOOLS.map((tool, index) => {
                const Icon = tool.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                    className="flex w-full flex-col items-center text-center sm:items-start sm:text-left"
                  >
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-[12px] bg-gradient-to-br from-blue-100 to-purple-100 text-[#1428A0] shadow-sm sm:mb-3 sm:h-16 sm:w-16 sm:rounded-[16px]">
                      <Icon className="h-6 w-6 sm:h-8 sm:w-8" strokeWidth={1.5} />
                    </div>
                    <h4 className="text-center text-[12px] font-semibold tracking-tight text-[#1d1d1f] sm:text-left sm:text-[13px]">
                      {tool.title}
                    </h4>
                    <p className="mt-1 text-center text-[10px] leading-snug text-[#86868b] sm:text-left sm:text-[11px]">
                      {tool.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Desktop Illustration */}
          <div className="hidden w-full flex-1 items-start justify-end lg:flex">
            <Illustration />
          </div>
        </div>
      </div>
    </section>
  );
}
