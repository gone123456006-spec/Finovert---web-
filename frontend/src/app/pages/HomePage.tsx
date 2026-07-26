import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Check, ChevronDown } from "lucide-react";

import API_BASE from "../../config/api";
import { rafThrottle } from "../utils/performance";
import { SpecialServices } from "../components/SpecialServices";
import { HowItWorks } from "../components/HowItWorks";
import { WhyFinovert } from "../components/WhyFinovert";
import { PowerfulFinanceTools } from "../components/PowerfulFinanceTools";
import { RegistrationServices } from "../components/RegistrationServices";
import { RegistrationSection } from "../components/RegistrationSection";
import { SEO } from "../components/SEO";
import {
  buildHomePageStructuredData,
  DEFAULT_SEO_KEYWORDS,
  HOME_PAGE_DESCRIPTION,
  HOME_PAGE_TITLE,
} from "../config/seo";
import { LatestBlogSection } from "../components/LatestBlogSection";
import { TrustedPartners } from "../components/TrustedPartners";
import { FinanceChatBoard } from "../components/FinanceChatBoard";
import {
  TextField,
  PhoneField,
  SelectField,
  formButtonClass,
} from "../components/corporate/OutlinedField";

const HERO_FEATURES = [
  "Company Registration & GST Filing",
  "ITR Filing with CA Review",
  "Accounting & Bookkeeping",
  "ROC Compliance Support",
  "Virtual CFO Insights",
  "Expert-Led Execution",
] as const;

const HERO_ICONS = [
  { src: "/invoice-icon.png", alt: "Invoice Financing", delay: 0.25, x: -16, y: 14 },
  { src: "/itr.png", alt: "ITR Filing", delay: 0.7, x: 16, y: 10 },
  { src: "/tds-filing.png", alt: "TDS Filing", delay: 1.15, x: -12, y: -10 },
  { src: "/gst-filing.png", alt: "GST Filing", delay: 1.6, x: 14, y: -12 },
] as const;

const REGISTRATION_FEATURES = [
  "Certificate of Incorporation, PAN, TAN & DIN in 7–15 Working Days",
  "Free Company Name Search & Reservation (up to 2 options)",
  "Professionally Drafted MoA, AoA + GST Registration via AGILE-PRO-S",
  "Bank-Account-Ready Document Kit",
  "Complete Post-incorporation Compliance Support",
] as const;

const SERVICE_OPTIONS = [
  "Private Limited Company Registration",
  "LLP Registration",
  "OPC Registration",
  "Partnership Firm Registration",
  "GST Registration",
  "Trademark Registration",
  "Accounting & Bookkeeping",
  "ITR Filing",
  "Other",
] as const;

export function HomePage() {
  const [regForm, setRegForm] = useState({
    name: "",
    contact: "",
    email: "",
    businessType: "",
  });
  const [regSubmitting, setRegSubmitting] = useState(false);
  const [regPhoneError, setRegPhoneError] = useState("");
  const [regEmailError, setRegEmailError] = useState("");
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
    {
      question: "What is the best compliance platform in India for startups?",
      answer:
        "Finovert is recognized as one of India's best compliance and finance platforms for startups, combining automated workflows with expert-led, CA-backed support for GST, ITR, ROC compliance, and company registration.",
    },
    {
      question: "Is Finovert the same as Finovers or Finoverse?",
      answer:
        "No. Finovert is a distinct, India-focused compliance and virtual CFO platform, unrelated to Finovers (an accounting ERP product) or Finoverse (a fintech events and media network).",
    },
    {
      question: "Where can I get finance services online in India?",
      answer:
        "Finovert offers finance services online for Indian startups and SMEs — including accounting, GST filing, ITR filing, company registration, ROC compliance, and virtual CFO support — accessible from anywhere without visiting an office.",
    },
    {
      question: "What is the best finance and compliance company in India?",
      answer:
        "Finovert is widely regarded as one of the best finance and compliance companies in India for startups, combining automated finance workflows with CA-backed expert execution across accounting, tax, and regulatory filings.",
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

  const handleRegSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneRegex = /^[6-9]\d{9}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleaned = regForm.contact.replace(/\D/g, "");
    let hasError = false;

    if (!phoneRegex.test(cleaned)) {
      setRegPhoneError("Please enter a valid 10-digit Indian mobile number.");
      hasError = true;
    } else {
      setRegPhoneError("");
    }

    if (!emailRegex.test(regForm.email.trim())) {
      setRegEmailError("Please enter a valid email address.");
      hasError = true;
    } else {
      setRegEmailError("");
    }

    if (!regForm.businessType) {
      alert("Please select a service.");
      return;
    }

    if (hasError) return;

    setRegSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/api/consultations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regForm.name.trim(),
          contact: cleaned,
          email: regForm.email.trim(),
          businessType: regForm.businessType,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || "Failed to submit consultation request.");
      }
      setRegForm({ name: "", contact: "", email: "", businessType: "" });
      alert("Consultation request submitted successfully.");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Could not submit right now. Please try again.");
    } finally {
      setRegSubmitting(false);
    }
  };

  useEffect(() => {
    let mounted = true; // Prevent state updates after unmount

    const handleScroll = () => {
      if (!mounted) return; // Safety check

      const currentY = window.scrollY;
      const isScrollingDown = currentY > lastScrollYRef.current;

      // Only update state if there's an actual change needed
      if (isScrollingDown && currentY > 120) {
        setShowFloatingButtons(prev => prev ? false : prev);
      } else if (currentY <= 120) {
        setShowFloatingButtons(prev => prev ? prev : true);
      }

      lastScrollYRef.current = currentY;

      // Show again when user stops scrolling
      if (scrollStopTimerRef.current) {
        window.clearTimeout(scrollStopTimerRef.current);
      }
      scrollStopTimerRef.current = window.setTimeout(() => {
        if (mounted) {
          setShowFloatingButtons(true);
        }
      }, 200);
    };

    // Use RAF throttle for better scroll performance
    const throttledScroll = rafThrottle(handleScroll);

    window.addEventListener("scroll", throttledScroll, { passive: true });
    
    return () => {
      mounted = false; // Mark as unmounted
      window.removeEventListener("scroll", throttledScroll);
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

      <section className="relative overflow-hidden bg-[#4a90d9] pt-24 sm:pt-28 pb-10 sm:pb-14">
        {/* Background image */}
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-left-top sm:bg-center"
          aria-hidden="true"
          style={{
            backgroundImage: "url('/4b3ba9b0-f3e8-4230-a16e-518d1c309f72.jpg')",
          }}
        />
        {/* Readability overlay — vertical on mobile, horizontal on desktop */}
        <div
          className="pointer-events-none absolute inset-0 sm:hidden"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.86) 0%, rgba(255,255,255,0.93) 35%, rgba(255,255,255,0.93) 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 hidden sm:block"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.78) 40%, rgba(255,255,255,0.35) 75%, rgba(255,255,255,0.05) 100%)",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8 items-center min-h-[340px] sm:min-h-[380px] lg:min-h-[400px]">
            <div className="max-w-3xl" style={{ willChange: 'auto' }}>
              <h1
                className="text-[1.75rem] sm:text-[2.25rem] lg:text-[2.75rem] font-bold text-[#0F2A5F] tracking-tight leading-[1.2] mb-5 sm:mb-6 animate-fade-in"
                style={{ animationDelay: '0ms' }}
              >
                Finance &amp; Compliance for Growing Businesses
              </h1>

              <p
                className="text-[1.1rem] sm:text-[1.35rem] font-semibold text-[#0F2A5F]/90 leading-snug mb-7 sm:mb-9 max-w-xl animate-fade-in"
                style={{ animationDelay: '100ms' }}
              >
                Get your setup done in just{" "}
                <span className="font-bold text-[#0F2A5F]">7 days</span> starting at{" "}
                <span className="text-[#C9A227] font-bold">Rs.1,999/-</span> only.
              </p>

              <ul
                className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-9 sm:mb-11 animate-fade-in"
                style={{ animationDelay: '200ms' }}
              >
                {HERO_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 min-w-0">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#0F2A5F] text-white">
                      <Check className="w-3.5 h-3.5" strokeWidth={3} />
                    </span>
                    <span className="whitespace-nowrap text-[14px] sm:text-[15px] text-[#0F2A5F] leading-none">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <div
                className="flex w-full flex-nowrap items-center justify-center gap-3 sm:w-auto sm:justify-start sm:gap-4 animate-fade-in"
                style={{ animationDelay: '300ms' }}
              >
                <Link
                  to="/book-consultation"
                  className="inline-flex flex-1 items-center justify-center rounded bg-[#0F2A5F] px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#0b1f47] sm:flex-none sm:px-10 sm:py-4 sm:text-base"
                >
                  Book Inquiry
                </Link>
                <a
                  href="#services"
                  className="inline-flex flex-1 items-center justify-center rounded border border-[#0F2A5F] bg-white px-4 py-3.5 text-sm font-semibold text-[#0F2A5F] transition-colors hover:bg-[#0F2A5F] hover:text-white sm:flex-none sm:px-10 sm:py-4 sm:text-base"
                >
                  Explore Services
                </a>
              </div>
            </div>

            {/* Right: service icons with opening animation */}
            <div className="relative mx-auto hidden lg:block w-full max-w-[300px] sm:max-w-[340px] lg:max-w-[380px] lg:justify-self-end">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-4">
                {HERO_ICONS.map((icon, idx) => (
                  <div
                    key={icon.src}
                    className="relative animate-fade-in"
                    style={{ 
                      animationDelay: `${400 + idx * 200}ms`,
                      willChange: 'auto'
                    }}
                  >
                    <img
                      src={icon.src}
                      alt={icon.alt}
                      className="w-full max-w-[170px] mx-auto h-auto object-contain drop-shadow-[0_12px_24px_rgba(15,42,95,0.16)]"
                      loading="eager"
                      width="170"
                      height="170"
                      decoding="async"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <HowItWorks />
      <RegistrationSection />
      <RegistrationServices />
      <SpecialServices />

      {/* Company registration lead — below special services */}
      <section id="company-registration" className="relative overflow-hidden bg-[#eef3f9] py-12 sm:py-16 scroll-mt-24">
        <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-8">
          <div className="max-w-xl">
            <h2 className="text-[1.85rem] font-bold leading-[1.15] tracking-tight text-[#0F2A5F] sm:text-4xl lg:text-[2.55rem] lg:leading-[1.12]">
              Company Registration Online in India
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-600 sm:text-base">
              Register your company online with Finovert — MCA-compliant Private Limited, LLP &amp; OPC
              filing, CA-led documentation, and end-to-end support from name approval to incorporation.
            </p>

            <ul className="mt-6 space-y-3.5 sm:mt-8 sm:space-y-4">
              {REGISTRATION_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#22c55e] text-white shadow-sm">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
                  </span>
                  <span className="text-[14px] leading-snug text-slate-700 sm:text-[15px]">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full max-w-md justify-self-center lg:max-w-none lg:justify-self-end">
            <form
              onSubmit={handleRegSubmit}
              className="rounded-[20px] border border-slate-200/80 bg-white p-6 shadow-[0_12px_40px_rgba(15,42,95,0.12)] sm:p-7 lg:p-8"
            >
              <h3 className="text-center text-[15px] font-bold leading-snug text-[#0F2A5F] sm:text-base">
                Choose your business structure and get started with your company registration
              </h3>

              <div className="mt-5 space-y-4 sm:mt-6 sm:space-y-5">
                <TextField
                  id="reg-name"
                  label="Full Name"
                  required
                  value={regForm.name}
                  onChange={(e) => setRegForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter Your Name"
                />
                <PhoneField
                  id="reg-phone"
                  required
                  value={regForm.contact}
                  error={regPhoneError || undefined}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setRegForm((prev) => ({ ...prev, contact: digits }));
                    if (regPhoneError) setRegPhoneError("");
                  }}
                  placeholder="Enter your PhoneNo."
                />
                <SelectField
                  id="reg-service"
                  label="Service"
                  required
                  value={regForm.businessType}
                  onChange={(e) => setRegForm((prev) => ({ ...prev, businessType: e.target.value }))}
                >
                  <option value="">-Select-</option>
                  {SERVICE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </SelectField>
                <TextField
                  id="reg-email"
                  label="Enter Your Email"
                  type="email"
                  required
                  value={regForm.email}
                  error={regEmailError || undefined}
                  onChange={(e) => {
                    setRegForm((prev) => ({ ...prev, email: e.target.value }));
                    if (regEmailError) setRegEmailError("");
                  }}
                  placeholder="Enter your Email"
                />
              </div>

              <button type="submit" disabled={regSubmitting} className={`mt-5 sm:mt-6 ${formButtonClass}`}>
                {regSubmitting ? "Submitting..." : "Claim your Free Consultation"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <WhyFinovert />
      <PowerfulFinanceTools />

      <LatestBlogSection />

      <section data-geo-faq className="relative overflow-hidden">
        <div className="bg-white pt-14 sm:pt-16 md:pt-20">
          <TrustedPartners />
        </div>

        <div
          className="relative py-14 sm:py-16 md:py-20"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, #eef1f5 0%, #f7f8fa 45%, #f3f4f6 100%)",
          }}
        >
          <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h3 className="mb-10 text-center text-2xl font-bold tracking-tight text-[#0F2A5F] sm:mb-12 sm:text-3xl md:text-[2.15rem]">
              Frequently Asked{" "}
              <span className="text-[#C9A227]">Questions</span>
            </h3>

            <div className="flex flex-col gap-4">
              {faqItems.slice(0, showMoreFaq ? faqItems.length : 4).map((item, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <button
                    key={item.question}
                    type="button"
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="w-full rounded-xl border-0 bg-white px-5 py-4 text-left shadow-[0_6px_24px_rgba(15,23,42,0.06)] transition-shadow duration-200 hover:shadow-[0_8px_28px_rgba(15,23,42,0.09)] sm:px-6 sm:py-5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h4 className="pr-2 text-[15px] font-medium leading-snug text-[#6b7280] sm:text-base">
                        {item.question}
                      </h4>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-[#6b7280] transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                        strokeWidth={1.75}
                      />
                    </div>
                    {isOpen && (
                      <div 
                        className="overflow-hidden transition-all duration-300 ease-in-out"
                        style={{
                          animation: 'fade-in 0.3s ease-out forwards'
                        }}
                      >
                        <p className="mt-3 text-[13px] font-normal leading-relaxed text-[#6b7280] sm:text-[15px]">
                          {item.answer}
                        </p>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {faqItems.length > 4 && (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowMoreFaq(!showMoreFaq)}
                  className="group/faq-more inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-[#0F2A5F] transition-colors hover:text-[#163a7a]"
                >
                  {showMoreFaq ? "Show less" : `Show ${faqItems.length - 4} more`}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      showMoreFaq ? "rotate-180" : "group-hover/faq-more:translate-y-0.5"
                    }`}
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <a
        href="https://wa.me/916205425499"
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed right-3 bottom-5 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-200 hover:bg-[#1ebe57] sm:right-4 sm:bottom-6 sm:h-14 sm:w-14 ${
          showFloatingButtons ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
        }`}
        aria-label="Chat on WhatsApp"
      >
        <svg
          viewBox="0 0 32 32"
          className="h-5 w-5 sm:h-7 sm:w-7"
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
