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
    }, 4000);
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
      { threshold: 0.15 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="why-finovert"
      className="relative overflow-hidden bg-[#F8FAFC] pt-8 pb-12 sm:pt-12 sm:pb-16"
    >
      <div ref={sectionRef} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="transition-all duration-700"
          style={{
            opacity: headingVisible ? 1 : 0,
            transform: headingVisible ? "translateY(0)" : "translateY(24px)",
          }}
        >
          {/* Article header */}
          <header className="mb-6 sm:mb-8 lg:mb-10">
            <h2 className="text-center font-[family-name:var(--font-display)] text-[1.85rem] font-bold leading-tight tracking-tight text-[#0F2A5F] sm:text-3xl lg:text-[2.5rem]">
              Why to choose Finovert?
            </h2>
          </header>

          {/* Article: image floats right on desktop so text wraps around and below it */}
          <article className="lg:flow-root">
            {/* Image — floats right on desktop */}
            <aside className="order-2 mb-5 w-full lg:float-right lg:mb-3 lg:ml-10 lg:w-[44%] xl:ml-12 xl:w-[42%]">
              <div className="relative mx-auto aspect-[16/9] w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_12px_40px_rgba(15,42,95,0.1)] sm:aspect-[2/1] lg:aspect-[16/10]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <img
                      src={CARDS[activeIndex].image}
                      alt={CARDS[activeIndex].alt}
                      className="h-full w-full object-contain"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              <p className="mt-2 text-center text-xs font-medium tracking-wide text-slate-400 lg:text-left">
                {CARDS[activeIndex].title}
              </p>
            </aside>

            <p className="text-[1.05rem] font-medium leading-[1.75] text-[#334155] sm:text-lg sm:leading-[1.8]">
              <span className="font-serif font-bold italic text-[#0F2A5F]">Finovert</span> brings
              together everything your business needs to achieve financial excellence — from
              real-time analytics and seamless GST compliance to smart cash flow forecasting and
              intelligent expense tracking. Built specifically for modern Indian businesses, our
              comprehensive platform acts as your dedicated digital CFO, helping founders,
              Chartered Accountants (CAs), and finance teams make confident, data-driven decisions
              while staying effortlessly audit-ready.
              {!isExpanded && (
                <button
                  type="button"
                  onClick={() => setIsExpanded(true)}
                  className="ml-1 inline font-semibold text-[#0F2A5F] hover:text-[#163a7a] sm:hidden"
                >
                  Read more...
                </button>
              )}
            </p>

            <p
              className={`mt-5 text-[15px] leading-[1.8] text-[#475569] sm:text-base sm:leading-[1.85] ${isExpanded ? "block" : "hidden sm:block"
                }`}
            >
              We understand that managing finances across scattered spreadsheets and outdated
              software creates unnecessary chaos and bottlenecks. That&apos;s why{" "}
              <span className="font-semibold text-[#0F2A5F]">Finovert</span> consolidates your
              entire financial ecosystem into one intuitive dashboard. Whether you are generating
              highly detailed financial reports, reconciling bank accounts automatically, tracking
              your company&apos;s burning rate, or managing complex vendor payments, every feature
              is designed to eliminate manual data entry and minimize human error. Our advanced
              analytics engine digs deep into your business data to uncover actionable insights,
              allowing you to identify cost-saving opportunities and forecast future revenue
              trends instantly.
            </p>

            <p
              className={`mt-5 text-[15px] leading-[1.8] text-[#475569] sm:text-base sm:leading-[1.85] ${isExpanded ? "block" : "hidden sm:block"
                }`}
            >
              Furthermore, <span className="font-semibold text-[#0F2A5F]">Finovert</span>
              &apos;s robust compliance architecture ensures that you never miss a tax deadline
              again. With automated tax calculations, direct filing integrations, and intelligent
              alert systems, your business remains fully compliant with the latest Indian tax
              regulations. By streamlining everything from daily bookkeeping to long-term
              strategic forecasting,{" "}
              <span className="font-semibold text-[#0F2A5F]">Finovert</span> empowers you to focus
              on what truly matters: scaling your business with complete financial clarity,
              impenetrable security, and absolute peace of mind.
              {isExpanded && (
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="ml-2 inline font-semibold text-[#0F2A5F] hover:text-[#163a7a] sm:hidden"
                >
                  Read less
                </button>
              )}
            </p>
          </article>

          {/* What is Finovert? */}
          <div className="mt-12 border-t border-slate-200/80 pt-10 sm:mt-16 sm:pt-12">
            <h3 className="mb-4 text-xl font-bold tracking-tight text-[#0F2A5F] sm:text-2xl">
              What is Finovert?
            </h3>
            <div className="space-y-4 text-[15px] leading-[1.8] text-[#475569] sm:text-base sm:leading-[1.85]">
              <p>
                <span className="font-semibold text-[#0F2A5F]">Finovert</span> is a comprehensive
                financial management and compliance platform designed specifically for Indian
                startups, SMEs, and growing enterprises. We simplify complex finance operations by
                bringing everything together in one place. From{" "}
                <a
                  href="#services"
                  className="font-medium text-[#0F2A5F] underline underline-offset-2 transition-colors hover:text-[#163a7a]"
                >
                  GST and tax filings
                </a>{" "}
                to complete business accounting and{" "}
                <a
                  href="#features"
                  className="font-medium text-[#0F2A5F] underline underline-offset-2 transition-colors hover:text-[#163a7a]"
                >
                  cash flow forecasting
                </a>
                , Finovert acts as your dedicated digital CFO. We help founders and businesses
                replace messy spreadsheets with smart, automated workflows so you can focus on
                scaling your business with complete financial clarity and peace of mind.
              </p>
              <p>
                Beyond day-to-day bookkeeping, Finovert brings together company registration, ROC
                and MCA compliance, TDS management, payroll, invoicing, and vendor payments into a
                single connected dashboard. Every filing deadline, tax calculation, and compliance
                task is tracked automatically, so you never miss a due date or pay an avoidable
                penalty — and everything stays audit-ready around the clock.
              </p>
              <p>
                What truly sets Finovert apart is the blend of intelligent automation with real
                human expertise. Our platform pairs AI-driven insights with a team of Chartered
                Accountants and finance specialists who review your numbers, answer your questions,
                and guide key decisions. Whether you are registering your first company or managing
                finances across multiple entities, Finovert scales with you — combining accuracy,
                bank-grade security, and transparent pricing so you can grow with confidence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
