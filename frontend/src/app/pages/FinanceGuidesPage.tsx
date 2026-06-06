import { SEO } from "../components/SEO";
import financeImage from "@/assets/serverer.jpeg";
import appImage from "@/assets/home ng no.PNG";
import trackingImage from "@/assets/tracking no bg .PNG";

const guides = [
  {
    title: "Build a Strong Finance Foundation",
    text: "A strong finance foundation starts with clear bookkeeping, monthly reporting, and disciplined cash flow tracking. Startups that review numbers regularly make faster and safer decisions. With the right structure, you can reduce financial stress and focus more on scaling your product and team.",
    image: financeImage,
  },
  {
    title: "Stay Ahead with Compliance Planning",
    text: "Compliance should not be a last-minute task. A planned approach to GST, tax, and statutory filings helps avoid penalties and protects your business reputation. When compliance is integrated into your routine workflow, operations become smoother and leadership gains confidence in long-term growth.",
    image: appImage,
  },
  {
    title: "Use Reporting to Drive Growth",
    text: "Smart reporting turns financial data into action. Track revenue trends, cost patterns, and business margins to understand what is working. Consistent reporting helps founders prepare for investor meetings, manage runway better, and prioritize high-impact business decisions.",
    image: trackingImage,
  },
];

export function FinanceGuidesPage() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <SEO
        title="Finovert - Finance Guides | GST, ITR & Compliance Resources"
        description="Read practical finance and compliance guides for startups and SMEs — GST filing, income tax returns, ROC compliance, cash flow, and virtual CFO insights."
        path="/finance-guides"
        keywords={[
          "finance guides",
          "startup finance guide",
          "business compliance guide",
          "virtual cfo insights",
          "finovert finance tips",
        ]}
      />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Read Finance Guides</h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          Actionable finance, compliance, and growth insights explained in a simple and practical format.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {guides.map((guide, index) => (
          <div
            key={guide.title}
            className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${
              index % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
            }`}
          >
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">{guide.title}</h2>
              <p className="text-gray-600 leading-8">{guide.text}</p>
            </div>
            <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
              <img
                src={guide.image}
                alt={guide.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
