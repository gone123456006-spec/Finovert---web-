/**
 * Services hub page (/services) — links every service landing page for
 * crawlability, internal linking, and AI discoverability.
 */

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { SEO } from "../components/SEO";
import {
  SERVICE_CATEGORIES,
  getServicesByCategory,
  SERVICES,
} from "../data/services-seo";
import { buildBreadcrumbSchema } from "../utils/seo-helpers";
import { SEO_SITE, toAbsoluteUrl } from "../config/seo";

export function ServicesIndexPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const structuredData = [
    buildBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Services", url: "/services" },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Finovert Business, Finance & Compliance Services",
      description:
        "Complete list of business registration, licensing, certification, taxation, and compliance services offered by Finovert in India.",
      numberOfItems: SERVICES.length,
      itemListElement: SERVICES.map((service, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: service.name,
        url: toAbsoluteUrl(`/services/${service.slug}`),
      })),
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <SEO
        title="All Services | Company Registration, Licenses, Tax & Compliance | Finovert"
        description={`Explore ${SERVICES.length}+ business services from ${SEO_SITE.name}: company registration, NGO registration, GST, FSSAI, trade license, BIS certification, international business setup, accounting, tax filing, and virtual CFO — all online with CA-backed experts.`}
        path="/services"
        keywords={[
          "business services india",
          "company registration services",
          "business registration",
          "license registration services",
          "tax and compliance services",
          "legal services for business",
          "financial services india",
          "business consultant india",
        ]}
        structuredData={structuredData}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500">
          <ol className="flex items-center gap-1">
            <li>
              <Link to="/" className="hover:text-blue-600">Home</Link>
              <span className="mx-1">/</span>
            </li>
            <li className="text-gray-800 font-medium" aria-current="page">
              Services
            </li>
          </ol>
        </nav>

        <header className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0F2A5F] tracking-tight mb-4">
            Business Registration, Licenses, Tax & Compliance Services
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto" data-geo-definition>
            Finovert offers {SERVICES.length}+ finance, legal, and compliance
            services for startups and businesses across India — from company
            registration and GST to FSSAI licensing, BIS certification, and
            virtual CFO support. Everything is handled 100% online by
            CA-backed experts.
          </p>
        </header>

        <div className="space-y-12">
          {SERVICE_CATEGORIES.map((category) => (
            <section key={category} aria-labelledby={`cat-${category}`}>
              <h2
                id={`cat-${category}`}
                className="text-2xl font-bold text-[#0F2A5F] mb-5"
              >
                {category}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {getServicesByCategory(category).map((service) => (
                  <Link
                    key={service.slug}
                    to={`/services/${service.slug}`}
                    className="flex items-center justify-between px-4 py-3.5 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all"
                  >
                    <span className="text-sm font-medium text-gray-800">
                      {service.name}
                    </span>
                    <ArrowRight className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <section className="mt-16 text-center py-10 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-[#0F2A5F] mb-3">
            Not sure which service you need?
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Talk to a Finovert expert for free. We'll recommend the right
            structure, licenses, and compliance plan for your business.
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
