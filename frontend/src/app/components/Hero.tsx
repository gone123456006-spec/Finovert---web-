import { motion } from "motion/react";
import { useEffect, useState } from "react";

const WHATSAPP_GET_STARTED =
  "https://wa.me/919153832948?text=" +
  encodeURIComponent(
    "Hi Finovert! I visited your website and would like to get started with finance and compliance services for my startup. Please guide me on the next steps."
  );
import homeImg from "@/assets/home ng no.PNG";
import leftImg from "@/assets/comrerh Com reg no bg .PNG";
import rightImg from "@/assets/tracking no bg .PNG";

export function Hero() {
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useEffect(() => {
    const preload = document.createElement("link");
    preload.rel = "preload";
    preload.as = "image";
    preload.href = homeImg;
    document.head.appendChild(preload);
    return () => {
      document.head.removeChild(preload);
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setShouldAnimate(!mediaQuery.matches);
    };
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return (
    <section
      id="home"
      className="relative overflow-hidden pt-20 pb-10 md:pb-16 md:min-h-[680px] lg:min-h-[820px] bg-[#fbfbfd]"
    >
      {/* Subtle top blur for depth */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-6 sm:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12 items-center">

          {/* ── Left: Content ── */}
          <div className="text-center lg:text-left">

            {/* Badge pill */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-semibold text-[#1d1d1f] bg-gray-100/80 border border-gray-200/60 backdrop-blur-md">
                Finovert — Corporate Services & Compliance
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-[2.8rem] leading-[1.05] sm:text-5xl lg:text-[4.5rem] font-bold text-[#1d1d1f] mb-6 tracking-tight sm:tracking-tighter"
            >
              Finance and compliance
              <br className="hidden sm:block" />
              <span className="text-[#86868b]"> in one clean platform.</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg sm:text-2xl lg:text-[1.7rem] text-[#86868b] mb-10 leading-snug font-medium max-w-xl mx-auto lg:mx-0 tracking-tight"
            >
              Built for founders and growing teams.{" "}
              <span className="text-[#1d1d1f]">Faster decisions</span>, cleaner compliance, expert-backed execution.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-6 px-4 sm:px-0"
            >
              <a
                href={WHATSAPP_GET_STARTED}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-[#1d1d1f] hover:bg-[#000000] active:scale-[0.98] text-white px-8 py-4 text-base sm:text-[17px] rounded-full transition-all duration-200 font-semibold tracking-wide shadow-sm"
              >
                Get Started
              </a>
              <a
                href="https://wa.me/916205425499"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-transparent hover:bg-gray-100 active:scale-[0.98] text-[#1d1d1f] px-8 py-4 text-base sm:text-[17px] rounded-full transition-all duration-200 font-medium border border-gray-300"
              >
                Talk to Expert
              </a>
            </motion.div>

          </div>

          {/* ── Right: Phone Mockups ── */}
          <div className="relative hidden sm:flex items-end justify-center lg:justify-end overflow-visible min-h-[300px] sm:min-h-[480px] mt-4 lg:mt-0">
            {/* Glow */}
            <div className="absolute bottom-0 right-4 lg:right-10 w-[360px] h-28 rounded-full -z-10"
              style={{ background: "radial-gradient(ellipse, rgba(140,100,255,0.25) 0%, transparent 70%)" }} />

            {/* Left phone */}
            <motion.div
              initial={{ opacity: 0, x: 40, y: 40 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4 }}
              className="relative z-10 hidden sm:block"
              style={{ marginRight: "-36px", marginBottom: "0px" }}
            >
              <motion.div
                animate={shouldAnimate ? { y: [0, -12, 0] } : undefined}
                transition={shouldAnimate ? { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 } : undefined}
              >
                <img src={leftImg} alt="Company Registration" className="w-auto object-contain drop-shadow-xl" style={{ height: 300 }} loading="lazy" />
              </motion.div>
            </motion.div>

            {/* Center phone */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="relative z-20"
            >
              <motion.div
                animate={shouldAnimate ? { y: [0, -16, 0] } : undefined}
                transition={shouldAnimate ? { duration: 4.5, repeat: Infinity, ease: "easeInOut" } : undefined}
              >
                <img
                  src={homeImg}
                  alt="App Home"
                  className="h-[280px] sm:h-[420px] lg:h-[480px] w-auto object-contain drop-shadow-[0_24px_60px_rgba(0,0,0,0.22)]"
                  loading="eager"
                  fetchPriority="high"
                />
              </motion.div>
            </motion.div>

            {/* Right phone */}
            <motion.div
              initial={{ opacity: 0, x: -40, y: 40 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4 }}
              className="relative z-10 hidden sm:block"
              style={{ marginLeft: "-36px", marginBottom: "0px" }}
            >
              <motion.div
                animate={shouldAnimate ? { y: [0, -10, 0] } : undefined}
                transition={shouldAnimate ? { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 } : undefined}
              >
                <img src={rightImg} alt="Tracking" className="w-auto object-contain drop-shadow-xl" style={{ height: 300 }} loading="lazy" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

    </section>
  );
}