import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" ref={ref} className="relative py-16 sm:py-24 bg-white overflow-hidden">
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
          <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-6 sm:mb-8">
            What is <span className="text-black">Finovert</span>?
          </h2>

          <p className="text-base sm:text-lg text-gray-600 mb-5 sm:mb-6 leading-relaxed">
            Finovert is a next-generation Virtual CFO platform designed to simplify and automate financial management.
            It combines AI, analytics, and automation to help businesses make smarter financial decisions in real time.
          </p>

          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Whether it's forecasting, compliance, or expense tracking — Finovert becomes your digital finance head.
          </p>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10 sm:mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
          >
            {[
              {
                label: "AI-Powered",
                iconSrc: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f9e0.png",
                iconAlt: "AI icon",
              },
              {
                label: "Real-Time",
                iconSrc: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/23f1.png",
                iconAlt: "Real-time icon",
              },
              {
                label: "Automated",
                iconSrc: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/2699.png",
                iconAlt: "Automation icon",
              },
              {
                label: "Scalable",
                iconSrc: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f4c8.png",
                iconAlt: "Scalable growth icon",
              },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="p-4 sm:p-6 bg-gray-50 rounded-2xl flex flex-col items-center group hover:bg-[#EAF4FF] hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#C7E3FF]"
              >
                <div className="mb-4 w-11 h-11 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                  <img
                    src={item.iconSrc}
                    alt={item.iconAlt}
                    className="w-11 h-11 object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="font-semibold text-gray-900 group-hover:text-sky-800 transition-colors">{item.label}</div>
              </motion.div>
            ))}
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
