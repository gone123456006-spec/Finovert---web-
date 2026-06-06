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
    if (window.innerWidth < 768) return;

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
    const updateAnimationPref = () => {
      const lowPowerMobile = window.innerWidth < 768;
      setShouldAnimate(!mediaQuery.matches && !lowPowerMobile);
    };
    updateAnimationPref();
    mediaQuery.addEventListener("change", updateAnimationPref);
    window.addEventListener("resize", updateAnimationPref);
    return () => {
      mediaQuery.removeEventListener("change", updateAnimationPref);
      window.removeEventListener("resize", updateAnimationPref);
    };
  }, []);

  return (
    <section
      id="home"
      className="relative overflow-hidden min-h-0 md:min-h-[640px] lg:min-h-[800px] pt-20 pb-8 md:pb-0"
      style={{ background: "linear-gradient(135deg, #f8f4ff 0%, #fce8f8 30%, #f5f0ff 60%, #ede8ff 100%)" }}
    >
      {/* Purple/lavender blob — top left */}
      <div className="absolute -top-20 -left-20 w-[380px] h-[380px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(180,140,255,0.35) 0%, rgba(200,170,255,0.08) 70%, transparent 100%)" }} />

      {/* Pink blob — center */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[500px] h-[300px] rounded-full pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(255,180,220,0.18) 0%, transparent 70%)" }} />

      {/* Teal/blue blob — bottom */}
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[200px] rounded-full pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(140,210,255,0.22) 0%, transparent 70%)" }} />

      {/* SVG Wave Lines — matching reference exactly */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Single S-curve wave bundle: top-right → center → bottom-right */}
        {Array.from({ length: 16 }, (_, i) => {
          const o = i * 5; // 5px spacing between lines
          return (
            <path
              key={i}
              d={`M ${1300} ${-60 + o} C ${900} ${80 + o}, ${700} ${200 + o}, ${580} ${360 + o} S ${420} ${560 + o}, ${-100} ${720 + o}`}
              stroke={`rgba(180, 170, 230, ${0.22 - i * 0.003})`}
              strokeWidth="1"
              fill="none"
            />
          );
        })}
      </svg>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left Side: Content */}
          <div className="text-center lg:text-left">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-sm sm:text-base font-bold text-[#1428A0] mb-3 sm:mb-4 tracking-tight"
            >
              Finovert — Corporate Services & Compliance Platform
            </motion.p>
            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-[4.15rem] font-extrabold leading-[1.08] text-[#0F2A5F] mb-5 sm:mb-6 tracking-[-0.02em]"
            >
              <span className="bg-gradient-to-r from-[#0F2A5F] via-[#1E3A8A] to-[#2563EB] bg-clip-text text-transparent sm:whitespace-nowrap">
                Finance and compliance
              </span>
              <br />
              <span className="text-[#0B1220]">for startups in one platform.</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-2xl lg:text-[2rem] text-gray-700 mb-8 sm:mb-10 leading-snug font-medium"
            >
              Built for founders and growing teams.
              <br />
              Faster decisions, cleaner compliance, and expert-backed execution.
            </motion.p>

            {/* Primary + Secondary CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="flex flex-nowrap items-center justify-center lg:justify-start gap-2 sm:gap-4 mb-4 w-full overflow-x-auto scrollbar-hide"
            >
              <a
                href={WHATSAPP_GET_STARTED}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 whitespace-nowrap items-center justify-center bg-[#0F2A5F] hover:bg-[#0b1f47] text-white px-5 py-3 sm:px-8 sm:py-3.5 text-sm sm:text-base rounded-2xl transition-all duration-200 hover:shadow-lg font-semibold"
              >
                Get Started
              </a>
              <a
                href="https://wa.me/916205425499"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 whitespace-nowrap items-center justify-center bg-white hover:bg-gray-50 text-[#0F2A5F] px-5 py-3 sm:px-8 sm:py-3.5 text-sm sm:text-base rounded-2xl transition-all duration-200 border border-gray-300 font-semibold"
              >
                Talk to Expert
              </a>
            </motion.div>
            <p className="text-sm text-gray-600 text-center lg:text-left">
              Trusted by 500+ startups across finance, tax, and compliance workflows.
            </p>
          </div>


          {/* Phone mockups — desktop/tablet only (hidden on mobile) */}
          <div className="relative hidden md:flex items-end justify-center lg:justify-end overflow-visible min-h-[450px]">
            {/* Subtle glow under phones */}
            <div className="absolute bottom-0 right-0 lg:right-20 w-[400px] h-24 bg-purple-100 blur-3xl opacity-40 rounded-full -z-10" />

            {/* Left phone in the group */}
            <motion.div
              initial={{ opacity: 0, x: 40, y: 40 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative z-10 hidden sm:block"
              style={{ marginRight: "-40px", marginBottom: "0px" }}
            >
              <motion.div
                animate={shouldAnimate ? { y: [0, -10, 0] } : undefined}
                transition={shouldAnimate ? { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 } : undefined}
              >
                <img
                  src={leftImg}
                  alt="Company Registration"
                  className="w-auto object-contain drop-shadow-xl"
                  style={{ height: 340 }}
                  loading="lazy"
                />
              </motion.div>
            </motion.div>

            {/* Center phone in the group */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative z-20"
            >
              <motion.div
                animate={shouldAnimate ? { y: [0, -14, 0] } : undefined}
                transition={shouldAnimate ? { duration: 4.5, repeat: Infinity, ease: "easeInOut" } : undefined}
              >
                <img
                  src={homeImg}
                  alt="App Home"
                  className="h-[340px] sm:h-[440px] w-auto object-contain drop-shadow-2xl"
                  loading="eager"
                  fetchPriority="high"
                />
              </motion.div>
            </motion.div>

            {/* Right phone in the group */}
            <motion.div
              initial={{ opacity: 0, x: -40, y: 40 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative z-10 hidden sm:block"
              style={{ marginLeft: "-40px", marginBottom: "0px" }}
            >
              <motion.div
                animate={shouldAnimate ? { y: [0, -10, 0] } : undefined}
                transition={shouldAnimate ? { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 } : undefined}
              >
                <img
                  src={rightImg}
                  alt="Tracking"
                  className="w-auto object-contain drop-shadow-xl"
                  style={{ height: 340 }}
                  loading="lazy"
                />

              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}