import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE from "../../config/api";
import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { SpecialServices } from "../components/SpecialServices";
import { Features } from "../components/Features";
import { WhyFinovert } from "../components/WhyFinovert";
import { SEO } from "../components/SEO";
import { LatestBlogSection } from "../components/LatestBlogSection";
import { TrustImpactSection } from "../components/TrustImpactSection";
import { WaveDivider } from "../components/WaveDivider";
import { AutoHorizontalScroll } from "../components/AutoHorizontalScroll";
import { FinanceChatBoard } from "../components/FinanceChatBoard";

export function HomePage() {
  const [leadForm, setLeadForm] = useState({
    name: "",
    contact: "",
    businessType: "Startup",
  });
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [showFloatingButtons, setShowFloatingButtons] = useState(true);
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
    setLeadSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/api/consultations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadForm),
      });
      if (!response.ok) {
        throw new Error("Failed to submit consultation request.");
      }
      setLeadForm({ name: "", contact: "", businessType: "Startup" });
      alert("Consultation request submitted successfully.");
    } catch (error) {
      alert("Could not submit right now. Please try again.");
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
        title="Virtual CFO Platform for Startup Finance and Compliance"
        description="Finovert helps startups manage finance, accounting, tax, and compliance with AI-powered workflows and expert virtual CFO support."
        path="/"
        keywords={[
          "finovert",
          "virtual cfo platform",
          "startup finance",
          "business compliance services",
          "accounting and compliance",
          "finance automation",
          "startup growth solutions",
        ]}
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Finovert",
            url: "https://finovert.com",
            description:
              "Virtual CFO, finance, and compliance platform for startups and growing businesses.",
            sameAs: ["https://www.linkedin.com"],
          },
          faqSchema,
        ]}
      />

      <Hero />

      <FinanceChatBoard />

      <section className="pt-4 pb-4 sm:pt-10 sm:pb-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            One platform for finance, compliance, and growth execution
          </h2>
          <p className="text-gray-600 text-lg mb-6 sm:mb-8">
            Most startups use multiple tools for accounting, compliance, and reporting. Finovert combines everything with expert support so your team moves faster with fewer errors.
          </p>
          <div className="flex flex-nowrap items-center justify-center gap-2 sm:gap-3 w-full overflow-x-auto scrollbar-hide">
            <Link
              to="/finance-guides"
              className="shrink-0 whitespace-nowrap text-sm px-3.5 py-2.5 sm:text-base sm:px-5 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
            >
              Read Finance Guides
            </Link>
            <a
              href="#services"
              className="shrink-0 whitespace-nowrap text-sm px-3.5 py-2.5 sm:text-base sm:px-5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Explore Services
            </a>
          </div>
        </div>
      </section>

      <SpecialServices />
      <WaveDivider />
      <WhyFinovert />
      <WaveDivider topColor="#f4f6f9" fill="#ffffff" className="!h-6 sm:!h-20" />
      <Features />

      <section id="consultation" className="pt-2 pb-10 sm:pt-4 sm:pb-14 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full rounded-3xl border border-gray-200 p-6 sm:p-8 lg:p-10 bg-gray-50 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Book a{" "}
              <span className="text-emerald-600 font-bold">free</span> consultation
            </h3>
            <p className="text-gray-600 mb-6">
              Share your details and our team will connect with you.
            </p>
            <form onSubmit={handleLeadSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                required
                type="text"
                placeholder="Name"
                value={leadForm.name}
                onChange={(e) => setLeadForm((prev) => ({ ...prev, name: e.target.value }))}
                className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 bg-white"
              />
              <input
                required
                type="text"
                placeholder="Phone or email"
                value={leadForm.contact}
                onChange={(e) => setLeadForm((prev) => ({ ...prev, contact: e.target.value }))}
                className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 bg-white"
              />
              <select
                value={leadForm.businessType}
                onChange={(e) => setLeadForm((prev) => ({ ...prev, businessType: e.target.value }))}
                className="rounded-xl border border-gray-300 px-4 py-3 outline-none bg-white focus:border-blue-500"
              >
                <option>Startup</option>
                <option>SME</option>
                <option>Enterprise</option>
              </select>
              <button
                type="submit"
                disabled={leadSubmitting}
                className="md:col-span-3 rounded-xl bg-[#0F2A5F] text-white font-semibold py-3.5 hover:bg-[#0b1f47] transition-colors"
              >
                {leadSubmitting ? "Submitting..." : "Book Free Consultation"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <TrustImpactSection />

      <LatestBlogSection />

      <section className="pt-4 pb-10 sm:pt-8 sm:pb-14 md:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">Frequently asked questions</h3>

          {/* Mobile: auto-scroll FAQ cards */}
          <div className="lg:hidden -mx-4 mb-0">
            <AutoHorizontalScroll durationSec={55} trackClassName="gap-3 px-4">
              {faqItems.map((item) => (
                <div
                  key={item.question}
                  className="w-[min(85vw,300px)] shrink-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm min-h-[140px] flex flex-col"
                >
                  <h4 className="font-semibold text-gray-900 text-sm leading-snug">{item.question}</h4>
                  <p className="text-gray-600 mt-2 text-sm leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </AutoHorizontalScroll>
          </div>

          {/* Desktop: stacked list */}
          <div className="hidden lg:flex lg:flex-col lg:gap-4">
            {faqItems.map((item) => (
              <div
                key={item.question}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col"
              >
                <h4 className="font-semibold text-gray-900">{item.question}</h4>
                <p className="text-gray-600 mt-2 text-sm leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <About />

      <Link
        to="/my-app"
        className={`fixed right-4 bottom-20 z-50 hidden md:inline-flex items-center gap-2 px-4 h-12 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 border border-blue-500 transition-all duration-200 ${
          showFloatingButtons ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
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
        className={`fixed right-4 bottom-6 z-50 hidden md:inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-all duration-200 ${
          showFloatingButtons ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
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
