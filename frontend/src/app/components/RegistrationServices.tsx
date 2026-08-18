import { Link } from "react-router-dom";
import { useState } from "react";
import { findServiceSlugByName } from "../data/services-seo";

const CATEGORIES = [
  "Company Registration",
  "NGO",
  "Licenses & Certifications",
  "FSSAI Registration",
  "Trade License",
  "BIS Registration",
  "International Business Setup",
  "Other Services",
];

const SERVICES_BY_CATEGORY: Record<string, string[]> = {
  "Company Registration": [
    "Company Registration",
    "Private Limited Company",
    "LLP registration",
    "Public Limited Company",
    "Partnership Firm",
    "Sole Proprietorship",
    "One Person Company",
    "Startup India",
    "Startup",
    "Nidhi Company",
    "Microfinance Company",
    "Producer Company",
    "Indian Subsidiary",
    "Foreign Subsidiary Company",
    "Foreign Company",
  ],
  "NGO": [
    "Section 8 Company",
    "Trust Registration",
    "Society Registration",
    "NGO Registration",
    "80G & 12A Registration",
    "FCRA Registration",
    "NGO Annual Compliance",
    "CSR Registration",
    "Charitable Trust",
  ],
  "Licenses & Certifications": [
    "ISO Certification",
    "MSME Registration",
    "Import Export Code (IEC)",
    "Shop & Establishment License",
    "Professional Tax Registration",
    "Drug License",
    "Digital Signature Certificate",
    "GST Registration",
    "Trademark Registration",
  ],
  "FSSAI Registration": [
    "FSSAI Basic Registration",
    "FSSAI State License",
    "FSSAI Central License",
    "FSSAI License Renewal",
    "FSSAI License Modification",
    "Food Product Approval",
    "FSSAI Annual Return Filing",
  ],
  "Trade License": [
    "Trade License Registration",
    "Trade License Renewal",
    "Municipal Trade License",
    "State Trade License",
    "Trade License Amendment",
  ],
  "BIS Registration": [
    "BIS Certification",
    "BIS CRS Registration",
    "ISI Mark Certification",
    "BIS License Renewal",
    "Product Certification",
    "Hallmark Registration",
  ],
  "International Business Setup": [
    "Foreign Company Registration",
    "Branch Office Registration",
    "Liaison Office Registration",
    "Project Office Registration",
    "Foreign Direct Investment (FDI)",
    "FEMA Compliance",
    "International Trade Setup",
  ],
  "Other Services": [
    "Virtual CFO Services",
    "Accounting & Bookkeeping",
    "Payroll Management",
    "Annual Compliance",
    "Income Tax Filing",
    "TDS Return Filing",
    "ROC Compliance",
    "Business Valuation",
    "Due Diligence",
  ],
};

export function RegistrationServices() {
  const [activeCategory, setActiveCategory] = useState("Company Registration");

  return (
    <>
      <section
        className="py-4 sm:py-6 bg-white"
        id="registration-services"
        itemScope
        itemType="https://schema.org/Service"
        aria-label="Business Registration Services"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Responsive container: vertical on mobile, horizontal on desktop */}
          <article className="flex flex-col lg:flex-row gap-0 bg-white rounded-lg lg:rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            {/* Sidebar - horizontal scroll on mobile, vertical on desktop */}
            <nav
              className="w-full lg:w-52 bg-[#2d3e50] flex-shrink-0 overflow-x-auto lg:overflow-x-visible"
              aria-label="Service Categories"
              role="navigation"
            >
              <div className="flex lg:flex-col min-w-max lg:min-w-0">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-3 text-left text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${activeCategory === category
                      ? "bg-[#1e2936] text-white"
                      : "text-gray-300 hover:bg-[#374b5e] hover:text-white"
                      }`}
                    aria-current={activeCategory === category ? "page" : undefined}
                    aria-label={`${category} services`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </nav>

            {/* Content area - responsive grid */}
            <div className="flex-1 bg-gray-50" role="main">
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y divide-gray-300 sm:divide-y-0"
                itemScope
                itemType="https://schema.org/ItemList"
              >
                <meta itemProp="name" content={`${activeCategory} Services`} />
                {SERVICES_BY_CATEGORY[activeCategory]?.map((service, idx, array) => {
                  const isLastInRow = {
                    mobile: true, // single column
                    tablet: (idx + 1) % 2 === 0,
                    desktop: (idx + 1) % 3 === 0,
                  };

                  const isLastRow = {
                    mobile: idx === array.length - 1,
                    tablet: idx >= array.length - (array.length % 2 || 2),
                    desktop: idx >= array.length - (array.length % 3 || 3),
                  };

                  return (
                    <div
                      key={idx}
                      className={`
                        flex items-center justify-between 
                        px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-4
                        border-gray-300
                        ${!isLastRow.mobile ? 'border-b sm:border-b' : ''}
                        ${!isLastRow.tablet ? 'sm:border-b' : 'sm:border-b-0'}
                        ${!isLastRow.desktop ? 'lg:border-b' : 'lg:border-b-0'}
                        ${!isLastInRow.tablet ? 'sm:border-r' : 'sm:border-r-0'}
                        ${!isLastInRow.desktop ? 'lg:border-r' : 'lg:border-r-0'}
                      `}
                      itemScope
                      itemType="https://schema.org/Service"
                      itemProp="itemListElement"
                    >
                      {(() => {
                        const serviceSlug = findServiceSlugByName(service);
                        return serviceSlug ? (
                          <Link
                            to={`/services/${serviceSlug}`}
                            className="text-xs sm:text-sm text-[#4a5568] font-medium flex-1 pr-2 hover:text-blue-600 transition-colors"
                            itemProp="name"
                            aria-label={`Learn more about ${service}`}
                          >
                            {service}
                          </Link>
                        ) : (
                          <span
                            className="text-xs sm:text-sm text-[#4a5568] font-medium flex-1 pr-2"
                            itemProp="name"
                          >
                            {service}
                          </span>
                        );
                      })()}
                      <meta itemProp="serviceType" content={activeCategory} />
                      <meta itemProp="provider" content="Finovert" />
                      <meta itemProp="areaServed" content="India" />
                      <Link
                        to={`/book-consultation?service=${encodeURIComponent(service)}`}
                        className="ml-2 px-2 py-1 sm:px-3 sm:py-1 text-xs font-semibold text-white bg-blue-500 hover:bg-blue-600 hover:scale-105 active:scale-95 rounded transition-all duration-300 whitespace-nowrap shadow-sm hover:shadow-md"
                        aria-label={`Apply for ${service}`}
                        itemProp="url"
                      >
                        Apply
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
