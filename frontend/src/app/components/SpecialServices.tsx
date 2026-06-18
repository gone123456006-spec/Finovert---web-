import { motion } from "motion/react";

export function SpecialServices() {
  return (
    <section id="services" className="pt-4 pb-6 sm:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 sm:mb-14 text-center"
        >
          <h2 className="text-3xl sm:text-[2.5rem] font-bold text-[#1d1d1f] mb-4 tracking-tight sm:tracking-tighter leading-tight">
            Special Services
          </h2>
          {/* Mobile Sub-heading */}
          <p className="sm:hidden text-sm text-[#86868b] max-w-2xl mx-auto leading-relaxed font-medium px-4">
            Tailored financial solutions for startups — expert-led and on time.
          </p>
          {/* Desktop Sub-heading */}
          <p className="hidden sm:block text-[1.1rem] text-[#86868b] max-w-2xl mx-auto leading-relaxed font-medium">
            Tailored financial solutions designed for startups and growing businesses — expert-led, transparent, and on time.
          </p>
        </motion.div>

        {/* Horizontal Images Container */}
        <div className="-mx-4 sm:mx-0">
          <div className="flex lg:grid lg:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto scrollbar-hide px-4 sm:px-0" style={{ WebkitOverflowScrolling: "touch" }}>
            {[
              "/service-1.png",
              "/service-2.png",
              "/service-4.png",
              "/service-3.png",
            ].map((src, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="shrink-0 w-[min(82vw,300px)] lg:w-auto flex flex-col items-center"
              >
                <img
                  src={src}
                  alt={`Service ${idx + 1}`}
                  className="w-full aspect-[4/5] object-cover object-top drop-shadow-sm rounded-[24px]"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
