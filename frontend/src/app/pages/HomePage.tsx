import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";

import API_BASE from "../../config/api";
import { SpecialServices } from "../components/SpecialServices";
import { VideoBannerSection } from "../components/VideoBannerSection";
import { WhyFinovert } from "../components/WhyFinovert";
import { PowerfulFinanceTools } from "../components/PowerfulFinanceTools";
import { SEO } from "../components/SEO";
import {
  buildHomePageStructuredData,
  DEFAULT_SEO_KEYWORDS,
  HOME_PAGE_DESCRIPTION,
  HOME_PAGE_TITLE,
} from "../config/seo";
import { LatestBlogSection } from "../components/LatestBlogSection";
import { FinanceChatBoard } from "../components/FinanceChatBoard";

export function HomePage() {
  const [leadForm, setLeadForm] = useState({
    name: "",
    contact: "",
    businessType: "Startup",
  });
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [showFloatingButtons, setShowFloatingButtons] = useState(true);
  const [showMoreFaq, setShowMoreFaq] = useState(false);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);
  const lastScrollYRef = useRef(0);
  const scrollStopTimerRef = useRef<number | null>(null);

  const faqItems = [
    {
      question: "What does Finovert do?",
      answer:
        "Finovert helps startups and businesses manage accounting, compliance, tax filings, and finance operations in one platform.",
    },
    {
      question: "Who is Finovert for?",
      answer:
        "Finovert is built for founders, startup teams, SMEs, and growing companies that need structured finance and compliance support.",
    },
    {
      question: "How is Finovert different?",
      answer:
        "You get AI-driven insights, expert-led support, and execution workflows in one place instead of managing multiple disconnected tools.",
    },
    {
      question: "Does Finovert support GST and ITR filing?",
      answer:
        "Yes. Finovert supports GST registration, monthly or quarterly returns, and business ITR filing with expert review and deadline tracking.",
    },
    {
      question: "How fast can we get started?",
      answer:
        "Most teams onboard within a few days. We collect your business details, set up workflows, and assign a finance expert for your company stage.",
    },
    {
      question: "Can Finovert replace our accountant or CFO?",
      answer:
        "Finovert complements your team with software plus expert execution. Many startups use it as a virtual finance and compliance layer before hiring full-time finance leaders.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate: phone number only (10 digits, optionally starting with +91 or 0)
    const phoneRegex = /^(?:\+91|0)?[6-9]\d{9}$/;
    const cleaned = leadForm.contact.replace(/\s+/g, "");
    if (!phoneRegex.test(cleaned)) {
      setPhoneError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }
    setPhoneError("");
    setLeadSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/api/consultations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadForm),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || "Failed to submit consultation request.");
      }
      setLeadForm({ name: "", contact: "", businessType: "Startup" });
      alert("Consultation request submitted successfully.");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Could not submit right now. Please try again.");
    } finally {
      setLeadSubmitting(false);
    }
  };

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const isScrollingDown = currentY > lastScrollYRef.current;

      // Hide while actively scrolling down; show when scrolling up.
      if (isScrollingDown && currentY > 120) {
        setShowFloatingButtons(false);
      } else {
        setShowFloatingButtons(true);
      }

      lastScrollYRef.current = currentY;

      // Show again when user stops scrolling.
      if (scrollStopTimerRef.current) {
        window.clearTimeout(scrollStopTimerRef.current);
      }
      scrollStopTimerRef.current = window.setTimeout(() => {
        setShowFloatingButtons(true);
      }, 180);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollStopTimerRef.current) {
        window.clearTimeout(scrollStopTimerRef.current);
      }
    };
  }, []);

  return (
    <>
      <SEO
        title={HOME_PAGE_TITLE}
        description={HOME_PAGE_DESCRIPTION}
        path="/"
        keywords={DEFAULT_SEO_KEYWORDS}
        structuredData={buildHomePageStructuredData(faqSchema)}
      />

      <FinanceChatBoard />

      <section className="bg-[#f4f8fc] pt-8 pb-8 sm:pt-20 sm:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── MOBILE LAYOUT ── */}
          <div className="sm:hidden flex flex-col">
            {/* Heading + Paragraph */}
            <h2 className="text-center text-[1.6rem] font-bold text-[#1d1d1f] mb-3 tracking-tight leading-[1.15]">
              One platform for finance &{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-emerald-500 font-extrabold italic">growth</span>
                <span className="absolute -bottom-0.5 left-0 w-full h-[3px] bg-emerald-400/50 rounded-full" />
              </span>
            </h2>
            <p className="text-center text-[13px] text-[#515154] font-medium leading-relaxed mb-4">
              Consolidate accounting, compliance, and reporting into one tool with expert support to move faster.
            </p>

            {/* Image with Sparkles */}
            <div className="relative mb-4">
              <img
                src="/cartoon.png"
                alt="Finance professional"
                className="w-full object-contain mix-blend-multiply relative z-10"
              />

              {/* Blue/Purple Sparkle */}
              <motion.div
                className="absolute top-[10%] left-[10%] z-0 text-[#9E9EFF] drop-shadow-[0_0_12px_rgba(158,158,255,0.8)]"
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" />
                </svg>
              </motion.div>

              {/* Green Sparkle */}
              <motion.div
                className="absolute top-[20%] right-[35%] z-0 text-[#A8FF9E] drop-shadow-[0_0_10px_rgba(168,255,158,0.8)]"
                animate={{ opacity: [0.2, 0.9, 0.2], scale: [0.7, 1, 0.7] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" />
                </svg>
              </motion.div>

              {/* Small Blue Sparkle */}
              <motion.div
                className="absolute top-[35%] left-[5%] z-0 text-[#9E9EFF] drop-shadow-[0_0_8px_rgba(158,158,255,0.6)]"
                animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.2, 0.9] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" />
                </svg>
              </motion.div>
            </div>

            {/* Buttons in one row */}
            <div className="flex flex-row justify-center items-center gap-2">
              <Link
                to="/finance-guides"
                className="flex-1 text-center whitespace-nowrap text-[12px] px-3 py-2 rounded-full bg-[#1d1d1f] text-white font-semibold hover:bg-black transition-colors"
              >
                Read Finance Guides
              </Link>
              <a
                href="#services"
                className="flex-1 text-center whitespace-nowrap text-[12px] px-3 py-2 rounded-full bg-white border border-gray-200 text-[#1d1d1f] font-semibold hover:bg-gray-50 transition-colors shadow-sm"
              >
                Explore Services
              </a>
            </div>
          </div>

          {/* ── DESKTOP LAYOUT ── */}
          <div className="hidden sm:grid grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left Column - Text + Buttons */}
            <div>
              <h2 className="text-[2.75rem] lg:text-[3.25rem] font-bold text-[#1d1d1f] mb-6 tracking-tight leading-[1.1]">
                One platform for finance, compliance, and{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-emerald-500 font-extrabold italic">growth</span>
                  <span className="absolute -bottom-1.5 left-0 w-full h-[4px] bg-emerald-400/50 rounded-full" />
                </span>{" "}
                execution
              </h2>
              <p className="text-[#515154] text-[1.15rem] mb-8 font-medium leading-relaxed pr-8">
                Most startups use multiple tools for accounting, compliance, and reporting. Finovert combines everything with expert support so your team moves faster with fewer errors.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/finance-guides"
                  className="whitespace-nowrap text-[16px] px-8 py-3.5 rounded-full bg-[#1d1d1f] text-white font-semibold hover:bg-black transition-colors"
                >
                  Read Finance Guides
                </Link>
                <a
                  href="#services"
                  className="whitespace-nowrap text-[16px] px-8 py-3.5 rounded-full bg-white border border-gray-200 text-[#1d1d1f] font-semibold hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Explore Services
                </a>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="flex items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-[480px]">
                <img
                  src="/cartoon.png"
                  alt="Finance professional"
                  className="w-full object-contain mix-blend-multiply relative z-10"
                />

                {/* Blue/Purple Sparkle */}
                <motion.div
                  className="absolute top-[8%] left-[10%] z-0 text-[#9E9EFF] drop-shadow-[0_0_12px_rgba(158,158,255,0.8)]"
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" />
                  </svg>
                </motion.div>

                {/* Green Sparkle */}
                <motion.div
                  className="absolute top-[18%] right-[35%] z-0 text-[#A8FF9E] drop-shadow-[0_0_10px_rgba(168,255,158,0.8)]"
                  animate={{ opacity: [0.2, 0.9, 0.2], scale: [0.7, 1, 0.7] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" />
                  </svg>
                </motion.div>

                {/* Small Blue Sparkle */}
                <motion.div
                  className="absolute top-[35%] left-[0%] z-0 text-[#9E9EFF] drop-shadow-[0_0_8px_rgba(158,158,255,0.6)]"
                  animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.2, 0.9] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" />
                  </svg>
                </motion.div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <SpecialServices />
      <VideoBannerSection />
      <WhyFinovert />
      <PowerfulFinanceTools />

      <section id="consultation" className="pt-2 pb-10 sm:pt-4 sm:pb-14 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full p-6 sm:p-8 lg:p-12">
            <h3 className="text-2xl sm:text-[2.2rem] font-bold text-[#1d1d1f] mb-2 tracking-tight">
              Book a{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-emerald-500 font-extrabold italic">free</span>
                <span className="absolute -bottom-0.5 left-0 w-full h-[3px] bg-emerald-400/50 rounded-full" />
              </span>
              {" "}consultation
            </h3>
            <p className="text-[#86868b] mb-8 font-medium">
              Share your details and our team will connect with you.
            </p>
            <form onSubmit={handleLeadSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                required
                type="text"
                placeholder="Name"
                value={leadForm.name}
                onChange={(e) => setLeadForm((prev) => ({ ...prev, name: e.target.value }))}
                className="rounded-[20px] border border-gray-200/80 px-5 py-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white transition-all shadow-sm text-[#1d1d1f]"
              />
              <div className="flex flex-col gap-1">
                <input
                  required
                  type="tel"
                  placeholder="Phone number (e.g. 9876543210)"
                  value={leadForm.contact}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9+]/g, "");
                    setLeadForm((prev) => ({ ...prev, contact: val }));
                    if (phoneError) setPhoneError("");
                  }}
                  maxLength={13}
                  className={`rounded-[20px] border px-5 py-4 outline-none focus:ring-1 bg-white transition-all shadow-sm text-[#1d1d1f] ${phoneError
                      ? "border-red-400 focus:border-red-500 focus:ring-red-300"
                      : "border-gray-200/80 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                />
                {phoneError && (
                  <p className="text-red-500 text-xs px-2 font-medium">{phoneError}</p>
                )}
              </div>
              <select
                value={leadForm.businessType}
                onChange={(e) => setLeadForm((prev) => ({ ...prev, businessType: e.target.value }))}
                className="rounded-[20px] border border-gray-200/80 px-5 py-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white transition-all shadow-sm text-[#1d1d1f]"
              >
                <option>Startup</option>
                <option>SME</option>
                <option>Enterprise</option>
              </select>
              <button
                type="submit"
                disabled={leadSubmitting}
                className="md:col-span-3 rounded-full bg-[#1d1d1f] text-white font-semibold text-[17px] py-4 hover:bg-black active:scale-[0.99] transition-all shadow-sm tracking-wide"
              >
                {leadSubmitting ? "Submitting..." : "Book Free Consultation"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <LatestBlogSection />

      <section className="pt-4 pb-10 sm:pt-8 sm:pb-14 md:py-16 bg-[#fbfbfd]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl sm:text-[2.2rem] font-bold text-[#1d1d1f] mb-8 sm:mb-10 text-center tracking-tight">
            Frequently asked{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-emerald-500 font-extrabold italic">questions</span>
              <span className="absolute -bottom-1.5 left-0 w-full h-[3px] bg-emerald-400/50 rounded-full" />
            </span>
          </h3>

          {/* Stacked numbered FAQ list for all screens */}
          <div className="flex flex-col gap-3">
            {faqItems.slice(0, showMoreFaq ? faqItems.length : 4).map((item, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={item.question}
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="rounded-[20px] border border-gray-100/80 bg-white p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex gap-4 items-start cursor-pointer hover:border-gray-200/85 transition-all duration-200 select-none"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1d1d1f] text-white font-bold text-[14px] flex items-center justify-center mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center gap-4">
                      <h4 className="font-semibold text-[#1d1d1f] text-[16px] sm:text-[17px] tracking-tight leading-snug">
                        {item.question}
                      </h4>
                      <ChevronDown
                        className={`w-5 h-5 text-[#86868b] transition-transform duration-300 shrink-0 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <p className="text-[#86868b] mt-3 text-[13px] sm:text-[15px] leading-relaxed font-medium">
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>

          {faqItems.length > 4 && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowMoreFaq(!showMoreFaq)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1428A0] hover:text-[#0f1d75] transition-colors group/faq-more cursor-pointer"
              >
                {showMoreFaq ? "Show less" : `Show ${faqItems.length - 4} more`}
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    showMoreFaq ? "rotate-180" : "group-hover/faq-more:translate-y-0.5"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>

      <Link
        to="/my-app"
        className={`fixed right-4 bottom-20 z-50 hidden md:inline-flex items-center gap-2 px-4 h-12 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 border border-blue-500 transition-all duration-200 ${showFloatingButtons ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
          }`}
        aria-label="Open My App page"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="7" y="2" width="10" height="20" rx="2" ry="2"></rect>
          <line x1="11" y1="18" x2="13" y2="18"></line>
        </svg>
        <span className="text-sm font-semibold">MyApp</span>
      </Link>

      <a
        href="https://wa.me/916205425499"
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed right-4 bottom-6 z-50 hidden md:inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-all duration-200 ${showFloatingButtons ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
          }`}
        aria-label="Chat on WhatsApp"
      >
        <svg
          viewBox="0 0 32 32"
          className="w-6 h-6"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M19.11 17.27c-.27-.14-1.59-.78-1.84-.87-.25-.09-.43-.14-.61.14-.18.27-.7.87-.86 1.05-.16.18-.32.2-.59.07-.27-.14-1.16-.43-2.2-1.37-.81-.72-1.36-1.62-1.52-1.89-.16-.27-.02-.42.12-.56.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.46-.84-2-.22-.53-.44-.46-.61-.47l-.52-.01c-.18 0-.48.07-.73.34-.25.27-.95.93-.95 2.27s.97 2.64 1.11 2.82c.14.18 1.91 2.91 4.62 4.08.65.28 1.16.45 1.55.57.65.21 1.24.18 1.7.11.52-.08 1.59-.65 1.82-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.32z" />
          <path d="M16 3C8.83 3 3 8.72 3 15.76c0 2.46.72 4.83 2.08 6.87L3.72 29l6.55-1.71A13.12 13.12 0 0 0 16 28.52c7.17 0 13-5.72 13-12.76S23.17 3 16 3zm0 23.42c-1.94 0-3.85-.52-5.52-1.51l-.4-.24-3.89 1.01 1.04-3.77-.26-.39a11.45 11.45 0 0 1-1.77-6.06C5.2 9.63 10.03 5.1 16 5.1s10.8 4.53 10.8 10.36S21.97 26.42 16 26.42z" />
        </svg>
      </a>

    </>
  );
}
