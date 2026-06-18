import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" ref={ref} className="relative py-16 sm:py-24 bg-[#fbfbfd] overflow-hidden">
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
            className="fill-[#fbfbfd]"
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
          <h2 className="text-3xl sm:text-[3rem] font-bold text-[#1d1d1f] mb-6 sm:mb-8 tracking-tight">
            What is Finovert?
          </h2>

          <p className="text-base sm:text-[1.2rem] text-[#86868b] mb-5 sm:mb-6 leading-relaxed font-medium">
            Finovert is a next-generation Virtual CFO platform designed to simplify and automate financial management.
            It combines AI, analytics, and automation to help businesses make smarter financial decisions in real time.
          </p>

          <p className="text-base sm:text-[1.2rem] text-[#86868b] leading-relaxed font-medium">
            Whether it's forecasting, compliance, or expense tracking — Finovert becomes your digital finance head.
          </p>

        </motion.div>
      </div>
    </section>
  );
}
