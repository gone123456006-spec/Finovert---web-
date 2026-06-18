import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const CARDS = [
  {
    image: "/png 1 .PNG",
    alt: "Built for Modern India - Finovert",
    title: "Built for Modern India",
  },
  {
    image: "/Png 2 .PNG",
    alt: "Scalable Growth - Finovert",
    title: "Scalable Growth",
  },
  {
    image: "/png 3 .PNG",
    alt: "Zero Learning Curve - Finovert",
    title: "Zero Learning Curve",
  },
  {
    image: "/png 4 .PNG",
    alt: "AI Decision Intelligence - Finovert",
    title: "AI Decision Intelligence",
  },
  {
    image: "/png 5.PNG",
    alt: "Bank-Grade Security - Finovert",
    title: "Bank-Grade Security",
  },
];

export function WhyFinovert() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [headingVisible, setHeadingVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % CARDS.length);
    }, 4000); // Flips every 4 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHeadingVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="why-finovert"
      className="relative bg-white pt-4 pb-12 sm:pt-6 sm:pb-24 overflow-hidden"
    >
      <div ref={sectionRef} className="relative">

        {/* Heading */}
        <div
          className="text-center mb-10 sm:mb-14 px-4 sm:px-6 lg:px-8 transition-all duration-700"
          style={{
            opacity: headingVisible ? 1 : 0,
            transform: headingVisible ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <h2 className="hidden text-3xl sm:text-[2.5rem] font-bold text-[#1d1d1f] tracking-tight sm:tracking-tighter leading-tight">
            Why choose Finovert?
          </h2>
          <div className="mt-3 text-base sm:text-[1rem] text-[#515154] w-full font-normal leading-relaxed text-justify space-y-4">
            <p>
              <span className="font-serif italic font-bold text-[#1a73e8]">Finovert</span> brings together everything your business needs to achieve financial excellence — from real-time analytics and seamless GST compliance to smart cash flow forecasting and intelligent expense tracking. Built specifically for modern Indian businesses, our comprehensive platform acts as your dedicated digital CFO, helping founders, Chartered Accountants (CAs), and finance teams make confident, data-driven decisions while staying effortlessly audit-ready.
              {!isExpanded && (
                <button
                  onClick={() => setIsExpanded(true)}
                  className="inline sm:hidden text-[#1a73e8] hover:text-[#1558b0] font-semibold ml-1"
                >
                  Read more...
                </button>
              )}
            </p>
            <p className={`${isExpanded ? "block" : "hidden sm:block"}`}>
              We understand that managing finances across scattered spreadsheets and outdated software creates unnecessary chaos and bottlenecks. That's why <span className="font-serif italic font-bold text-[#1a73e8]">Finovert</span> consolidates your entire financial ecosystem into one intuitive dashboard. Whether you are generating highly detailed financial reports, reconciling bank accounts automatically, tracking your company's burning rate, or managing complex vendor payments, every feature is designed to eliminate manual data entry and minimize human error. Our advanced analytics engine digs deep into your business data to uncover actionable insights, allowing you to identify cost-saving opportunities and forecast future revenue trends instantly.
            </p>
            <p className={`${isExpanded ? "block" : "hidden sm:block"}`}>
              Furthermore, <span className="font-serif italic font-bold text-[#1a73e8]">Finovert</span>'s robust compliance architecture ensures that you never miss a tax deadline again. With automated tax calculations, direct filing integrations, and intelligent alert systems, your business remains fully compliant with the latest Indian tax regulations. By streamlining everything from daily bookkeeping to long-term strategic forecasting, <span className="font-serif italic font-bold text-[#1a73e8]">Finovert</span> empowers you to focus on what truly matters: scaling your business with complete financial clarity, impenetrable security, and absolute peace of mind.
              {isExpanded && (
                <button
                  onClick={() => setIsExpanded(false)}
                  className="inline sm:hidden text-[#1a73e8] hover:text-[#1558b0] font-semibold ml-2"
                >
                  Read less
                </button>
              )}
            </p>
          </div>
        </div>

        {/* Auto-flipping cards */}
        <div className="relative w-full max-w-[min(90vw,600px)] sm:max-w-[min(70vw,760px)] mx-auto aspect-[16/9] sm:aspect-[21/9] rounded-[24px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.14)] transition-shadow duration-500 bg-white perspective-[1000px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, rotateX: 90 }}
              animate={{ opacity: 1, rotateX: 0 }}
              exit={{ opacity: 0, rotateX: -90 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
            >
              <img
                src={CARDS[activeIndex].image}
                alt={CARDS[activeIndex].alt}
                className="w-full h-full object-contain"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* What is Finovert? */}
        <div className="mt-12 sm:mt-16 px-4 sm:px-6 lg:px-8">
          <h3 className="text-xl sm:text-2xl font-bold text-[#1d1d1f] mb-4 tracking-tight">
            What is <span className="font-serif italic font-extrabold text-[#1a73e8]">Finovert</span>?
          </h3>
          <p className="text-base sm:text-[1rem] text-[#515154] font-normal leading-relaxed text-justify">
            <span className="font-serif italic font-bold text-[#1a73e8]">Finovert</span> is a comprehensive financial management and compliance platform designed specifically for Indian businesses. We simplify complex finance operations by bringing everything together in one place. From{" "}
            <a href="#services" className="text-[#1a73e8] underline underline-offset-2 hover:text-[#1558b0] transition-colors">GST and tax filings</a>{" "}
            to complete business accounting and{" "}
            <a href="#features" className="text-[#1a73e8] underline underline-offset-2 hover:text-[#1558b0] transition-colors">cash flow forecasting</a>,{" "}
            <span className="font-serif italic font-bold text-[#1a73e8]">Finovert</span> acts as your dedicated digital CFO. We help founders and businesses replace messy spreadsheets with smart, automated workflows so you can focus on scaling your business with complete financial clarity and peace of mind.
          </p>
        </div>

      </div>
    </section>
  );
}

