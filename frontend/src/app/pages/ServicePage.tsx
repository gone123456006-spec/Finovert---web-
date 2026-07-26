/**
 * Dynamic SEO landing page for every Finovert service (/services/:slug).
 * Content, metadata, and Schema.org markup are generated from services-seo.ts.
 */

import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock,
  FileText,
  IndianRupee,
  ListChecks,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import { SEO } from "../components/SEO";
import { FAQSection } from "../components/FAQSection";
import { getServiceContent } from "../data/services-seo";
import {
  buildBreadcrumbSchema,
  buildFAQSchema,
  buildHowToSchema,
  buildServiceSchema,
} from "../utils/seo-helpers";

export function ServicePage() {
  const { slug } = useParams<{ slug: string }>();
  const content = slug ? getServiceContent(slug) : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!content) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-20 px-4 text-center">
        <SEO
          title="Service Not Found"
          description="The service page you are looking for does not exist."
          noindex
        />
        <h1 className="text-3xl font-bold text-[#0F2A5F] mb-4">
          Service not found
        </h1>
        <p className="text-gray-600 mb-8">
          The service you are looking for may have moved. Explore all our
          services below.
        </p>
        <Link
          to="/services"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          View All Services <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const structuredData = [
    buildBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Services", url: "/services" },
      { name: content.name, url: `/services/${content.slug}` },
    ]),
    buildServiceSchema({
      name: content.name,
      description: content.description,
      category: content.category,
    }),
    buildFAQSchema(content.faqs),
    buildHowToSchema({
      name: `How to complete ${content.name} in India`,
      description: `Step-by-step process for ${content.name} with Finovert.`,
      steps: content.process,
    }),
  ];

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <SEO
        title={content.metaTitle}
        description={content.metaDescription}
        path={`/services/${content.slug}`}
        keywords={content.allKeywords}
        structuredData={structuredData}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link to="/" className="hover:text-blue-600">Home</Link>
              <span className="mx-1">/</span>
            </li>
            <li>
              <Link to="/services" className="hover:text-blue-600">Services</Link>
              <span className="mx-1">/</span>
            </li>
            <li className="text-gray-800 font-medium" aria-current="page">
              {content.name}
            </li>
          </ol>
        </nav>

        {/* Hero + direct answer */}
        <header className="mb-10">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">
            {content.category}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0F2A5F] tracking-tight mb-4">
            {content.name} in India — Online Process, Documents & Fees
          </h1>
          <p
            className="text-lg text-gray-700 leading-relaxed max-w-3xl"
            data-geo-definition
          >
            {content.description}
          </p>
        </header>

        {/* Quick facts */}
        <section
          aria-label="Quick facts"
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
        >
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Timeline</p>
              <p className="text-sm text-gray-600">{content.timeline}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <IndianRupee className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Pricing</p>
              <p className="text-sm text-gray-600">
                Transparent fees — free consultation
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <ShieldCheck className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Support</p>
              <p className="text-sm text-gray-600">
                CA-backed experts, 100% online
              </p>
            </div>
          </div>
        </section>

        {/* Primary CTA */}
        <div className="mb-12">
          <Link
            to="/book-consultation"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors"
            aria-label={`Book a free consultation for ${content.name}`}
          >
            Get Started — Free Consultation <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Benefits */}
        <section className="mb-12" aria-labelledby="benefits-heading">
          <h2
            id="benefits-heading"
            className="flex items-center gap-2 text-2xl font-bold text-[#0F2A5F] mb-5"
          >
            <BadgeCheck className="w-6 h-6 text-blue-600" />
            Benefits of {content.name}
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {content.benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{benefit}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Eligibility */}
        <section className="mb-12" aria-labelledby="eligibility-heading">
          <h2
            id="eligibility-heading"
            className="flex items-center gap-2 text-2xl font-bold text-[#0F2A5F] mb-5"
          >
            <ListChecks className="w-6 h-6 text-blue-600" />
            Eligibility for {content.name}
          </h2>
          <ul className="space-y-2.5">
            {content.eligibility.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Documents */}
        <section className="mb-12" aria-labelledby="documents-heading">
          <h2
            id="documents-heading"
            className="flex items-center gap-2 text-2xl font-bold text-[#0F2A5F] mb-5"
          >
            <FileText className="w-6 h-6 text-blue-600" />
            Documents Required for {content.name}
          </h2>
          <ul className="space-y-2.5">
            {content.documents.map((doc) => (
              <li key={doc} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{doc}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Step-by-step process */}
        <section className="mb-12" aria-labelledby="process-heading">
          <h2
            id="process-heading"
            className="text-2xl font-bold text-[#0F2A5F] mb-6"
          >
            {content.name}: Step-by-Step Process
          </h2>
          <ol className="space-y-5">
            {content.process.map((step, idx) => (
              <li key={step.name} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center"
                >
                  {idx + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-gray-900">{step.name}</h3>
                  <p className="text-gray-600">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Common mistakes */}
        <section className="mb-12" aria-labelledby="mistakes-heading">
          <h2
            id="mistakes-heading"
            className="text-2xl font-bold text-[#0F2A5F] mb-5"
          >
            Common Mistakes to Avoid
          </h2>
          <ul className="space-y-2.5">
            {content.commonMistakes.map((mistake) => (
              <li key={mistake} className="flex items-start gap-2.5">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{mistake}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Pricing & timeline */}
        <section
          className="mb-12 p-6 sm:p-8 bg-[#0F2A5F] rounded-2xl text-white"
          aria-labelledby="pricing-heading"
        >
          <h2 id="pricing-heading" className="text-2xl font-bold mb-3">
            {content.name} — Pricing & Timeline
          </h2>
          <p className="text-blue-100 leading-relaxed mb-2">
            <strong className="text-white">Timeline:</strong> {content.timeline}
          </p>
          <p className="text-blue-100 leading-relaxed mb-6">
            {content.pricingNote}
          </p>
          <Link
            to="/book-consultation"
            className="inline-flex items-center gap-2 px-7 py-3 bg-white text-[#0F2A5F] font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Get an Exact Quote <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* FAQs (People Also Ask) */}
        <FAQSection
          title={`${content.name} — Frequently Asked Questions`}
          description="Answers to the questions people also ask about this service."
          faqs={content.faqs}
          className="!py-0 mb-12"
        />

        {/* Related services */}
        {content.related.length > 0 && (
          <section className="mb-12" aria-labelledby="related-heading">
            <h2
              id="related-heading"
              className="text-2xl font-bold text-[#0F2A5F] mb-5"
            >
              Related {content.category} Services
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {content.related.map((service) => (
                <Link
                  key={service.slug}
                  to={`/services/${service.slug}`}
                  className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all text-gray-800 font-medium"
                >
                  <span className="text-sm">{service.name}</span>
                  <ArrowRight className="w-4 h-4 text-blue-600 flex-shrink-0" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Final CTA */}
        <section className="text-center py-10 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-[#0F2A5F] mb-3">
            Ready to start your {content.name}?
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Talk to a Finovert expert today. Free consultation, transparent
            pricing, and CA-backed execution — 100% online.
          </p>
          <Link
            to="/book-consultation"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors"
          >
            Book Free Consultation <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
