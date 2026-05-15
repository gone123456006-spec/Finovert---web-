import { SEO } from "../components/SEO";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.brandovert.finovert&pcampaignid=web_share";

const appFeatures = [
  {
    title: "All Finance Tasks in One App",
    description:
      "Manage accounting, compliance, and reporting from one unified dashboard. Your team can track work status, deadlines, and important updates without switching between multiple tools.",
    image: "/app-logo.png",
  },
  {
    title: "Real-Time Business Visibility",
    description:
      "Get a clear view of your numbers with structured summaries and actionable insights. This helps founders and operators make faster decisions with better confidence.",
    image: "/play-logo.png",
  },
  {
    title: "Built for Startups and Growing Teams",
    description:
      "Designed to support early-stage and scaling businesses with practical workflows. From filings to finance planning, the app is optimized for speed, clarity, and execution.",
    image: "/app-logo.png",
  },
];

export function MyAppPage() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <SEO
        title="My App | Finovert"
        description="Explore the Finovert app for startup finance, compliance workflows, and real-time business visibility."
        path="/my-app"
        keywords={[
          "finovert app",
          "startup finance app",
          "compliance app",
          "virtual cfo app",
          "business finance platform",
        ]}
      />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">My App</h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          A simple and powerful app to manage finance, compliance, and growth workflows in one place.
        </p>
        <div className="mt-6">
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0F2A5F] text-white px-5 py-3 font-semibold hover:bg-[#0b1f47] transition-colors"
          >
            Get the Finovert App on Google Play
          </a>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {appFeatures.map((feature, index) => (
          <div
            key={feature.title}
            className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${
              index % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
            }`}
          >
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">{feature.title}</h2>
              <p className="text-gray-600 leading-8">{feature.description}</p>
            </div>
            <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center p-6 min-h-[260px]">
              <img
                src={feature.image}
                alt={feature.title}
                className="w-44 h-44 object-contain rounded-xl"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to use Finovert App?</h3>
          <p className="text-gray-600 mb-6">
            Download now from Google Play Store and start managing your finance and compliance in one place.
          </p>
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0F2A5F] text-white px-6 py-3 font-semibold hover:bg-[#0b1f47] transition-colors"
          >
            Download the Finovert App on Google Play
          </a>
        </div>
      </section>
    </div>
  );
}
