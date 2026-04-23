import { motion } from "motion/react";
import homeImg from "@/assets/home ng no.PNG";
import leftImg from "@/assets/comrerh Com reg no bg .PNG";
import rightImg from "@/assets/tracking no bg .PNG";

export function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden min-h-[640px] lg:min-h-[800px] pt-20"
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
        {Array.from({ length: 28 }, (_, i) => {
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
            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-[4.15rem] font-extrabold leading-[1.08] text-[#0F2A5F] mb-5 sm:mb-6 tracking-[-0.02em]"
            >
              <span className="bg-gradient-to-r from-[#0F2A5F] via-[#1E3A8A] to-[#2563EB] bg-clip-text text-transparent sm:whitespace-nowrap">
                Finovert: Your Virtual
              </span>
              <br />
              <span className="text-[#0B1220]">CFO Platform</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-2xl lg:text-[2rem] text-gray-700 italic mb-8 sm:mb-10 leading-snug font-medium"
            >
              Control and grow your entire business
              <br />
              with professional expertise.
            </motion.p>

            {/* Google Play Button Only */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="flex items-center justify-center lg:justify-start gap-4 flex-wrap mb-10 lg:pl-40"
            >
              <a
                href="https://play.google.com/store/apps/details?id=com.brandovert.finovert&pcampaignid=web_share"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full max-w-[320px] sm:w-auto items-center justify-center gap-3 sm:gap-4 bg-black hover:bg-gray-900 text-white px-8 sm:px-11 py-3.5 sm:py-4 rounded-3xl transition-all duration-200 hover:shadow-xl active:scale-95 border border-gray-800"
              >
                {/* Official Google Play multicolor icon */}
                <svg className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#4CAF50" d="M 8.4394531 6.078125 L 26.972656 24 L 8.4394531 41.921875 C 7.5554531 41.483875 7 40.578 7 39.556 L 7 8.4440001 C 7 7.422 7.5554531 6.516125 8.4394531 6.078125 z"/>
                  <path fill="#F44336" d="M 34.123047 16.707031 L 26.972656 24 L 8.4394531 6.078125 C 8.6084531 5.994125 8.793 5.946 8.984 5.946 C 9.445 5.946 9.874 6.108 10.228 6.408 L 34.123047 16.707031 z"/>
                  <path fill="#FFC107" d="M 41 24 C 41 25.385 40.245875 26.587 39.046875 27.212 L 34.123047 29.707031 L 26.972656 24 L 34.123047 16.707031 L 39.046875 20.788 C 40.245875 21.413 41 22.615 41 24 z"/>
                  <path fill="#2196F3" d="M 34.123047 29.707031 L 10.228 41.592 C 9.874 41.892 9.445 42.054 8.984 42.054 C 8.793 42.054 8.6084531 42.005875 8.4394531 41.921875 L 26.972656 24 L 34.123047 29.707031 z"/>
                </svg>
                <div className="text-left leading-none">
                  <div className="text-[10px] sm:text-xs font-normal text-gray-400 tracking-widest uppercase mb-1">Get it on</div>
                  <div className="text-2xl sm:text-[1.7rem] font-semibold tracking-tight leading-none">Google Play</div>
                </div>
              </a>
            </motion.div>
          </div>


          {/* Right Side: Phone Mockups */}
          <div className="relative flex items-end justify-center lg:justify-end overflow-visible min-h-[340px] sm:min-h-[450px]">
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
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <img
                  src={leftImg}
                  alt="Company Registration"
                  className="w-auto object-contain drop-shadow-xl"
                  style={{ height: 340 }}
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
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <img
                  src={homeImg}
                  alt="App Home"
                  className="h-[340px] sm:h-[440px] w-auto object-contain drop-shadow-2xl"
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
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <img
                  src={rightImg}
                  alt="Tracking"
                  className="w-auto object-contain drop-shadow-xl"
                  style={{ height: 340 }}
                />

              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}