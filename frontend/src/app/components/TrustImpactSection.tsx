import { motion } from "motion/react";
import { Rocket, ShieldCheck, Zap, Star, Quote } from "lucide-react";
import { AutoHorizontalScroll } from "./AutoHorizontalScroll";

const STATS = [
  { value: "500+", label: "Startups supported", icon: Rocket, accent: "from-[#1428A0] to-[#3b5bdb]" },
  { value: "20+", label: "Compliance workflows", icon: ShieldCheck, accent: "from-[#0d9488] to-[#2dd4bf]" },
  { value: "3x", label: "Avg reporting speed-up", icon: Zap, accent: "from-[#7c3aed] to-[#a78bfa]" },
  { value: "98%", label: "Client satisfaction", icon: Star, accent: "from-[#ea580c] to-[#fb923c]" },
] as const;

const TESTIMONIALS = [
  {
    id: "saas-founder",
    quote:
      "Finovert helped us reduce compliance stress and improve investor reporting quality within weeks.",
    role: "Founder",
    company: "SaaS Startup",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200",
    imageAlt: "Founder portrait",
  },
  {
    id: "d2c-ops",
    quote:
      "We now run monthly finance ops in one place. Faster close cycles and better decision visibility.",
    role: "Operations Lead",
    company: "D2C Brand",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
    imageAlt: "Operations lead portrait",
  },
  {
    id: "fintech-cfo",
    quote:
      "Our CFO workflows are cleaner. Board packs and MIS reports are ready in hours, not days.",
    role: "Finance Head",
    company: "Fintech Scale-up",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
    imageAlt: "Finance head portrait",
  },
  {
    id: "agency-founder",
    quote:
      "GST and payroll compliance used to slow us down. Finovert made it predictable and audit-ready.",
    role: "Co-founder",
    company: "Creative Agency",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200",
    imageAlt: "Co-founder portrait",
  },
  {
    id: "logistics-director",
    quote:
      "Cash flow visibility improved immediately. We catch risks early and plan growth with confidence.",
    role: "Director",
    company: "Logistics SME",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200",
    imageAlt: "Director portrait",
  },
  {
    id: "healthtech-ceo",
    quote:
      "From incorporation to monthly filings, the team handles execution while we focus on product.",
    role: "CEO",
    company: "Healthtech Startup",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200",
    imageAlt: "CEO portrait",
  },
] as const;

const TAGS = [
  { label: "CA-led advisory", className: "bg-[#1428A0]/10 text-[#1428A0] border-[#1428A0]/15" },
  { label: "Compliance-focused workflows", className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/15" },
  { label: "Startup-first finance stack", className: "bg-violet-500/10 text-violet-700 border-violet-500/15" },
] as const;

function TestimonialCard({
  item,
  layout = "scroll",
}: {
  item: (typeof TESTIMONIALS)[number];
  layout?: "scroll" | "grid";
}) {
  return (
    <blockquote
      className={`relative bg-white rounded-[28px] p-6 sm:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-white/80 ${
        layout === "scroll" ? "w-[min(88vw,320px)] shrink-0" : "w-full h-full"
      }`}
    >
      <Quote className="absolute top-5 right-5 w-9 h-9 text-[#1428A0]/10" />
      <p className="text-[#0B1220] text-base sm:text-lg leading-relaxed font-medium pr-6">
        &ldquo;{item.quote}&rdquo;
      </p>
      <footer className="mt-5 flex items-center gap-3">
        <div>
          <cite className="not-italic text-sm font-bold text-[#0B1220]">{item.role}</cite>
          <p className="text-sm text-gray-500">{item.company}</p>
        </div>
      </footer>
    </blockquote>
  );
}

export function TrustImpactSection() {
  return (
    <section className="pt-14 pb-8 sm:pt-16 sm:pb-10 md:py-20 bg-gradient-to-b from-white via-[#f7f8fa] to-[#f4f5f8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-center mb-10 sm:mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-gray-100 text-[#1d1d1f] text-[13px] font-semibold tracking-wide mb-4 border border-gray-200/50">Trusted by Startups</span>
          <h2 className="text-3xl sm:text-[2.5rem] font-bold text-[#1d1d1f] tracking-tight sm:tracking-tighter">
            Built for speed, clarity, and compliance
          </h2>
          <p className="text-[#86868b] mt-3 text-[1.1rem] max-w-2xl mx-auto font-medium">
            Real outcomes from founders and operators who run finance on Finovert.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-8">
          {STATS.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="group relative bg-[#fbfbfd] rounded-[24px] p-6 text-center hover:bg-white hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all duration-300 border border-gray-100/60 overflow-hidden"
              >
                <div
                  className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.accent} text-white shadow-sm`}
                  aria-hidden
                >
                  <Icon
                    className={`w-6 h-6 shrink-0 stroke-white ${stat.icon === Star ? "fill-white" : "fill-none"}`}
                    strokeWidth={2.25}
                  />
                </div>
                <div className="text-[2rem] sm:text-[2.25rem] font-bold text-[#1d1d1f] tracking-tight leading-none mb-2">{stat.value}</div>
                <div className="text-[14px] text-[#86868b] leading-snug font-medium">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile: auto-scroll testimonials */}
        <div className="lg:hidden mb-6 -mx-4">
          <AutoHorizontalScroll durationSec={48} trackClassName="gap-4 px-4">
            {TESTIMONIALS.map((item) => (
              <TestimonialCard key={item.id} item={item} />
            ))}
          </AutoHorizontalScroll>
        </div>

        {/* Desktop: grid */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-5 lg:gap-6 mb-8">
          {TESTIMONIALS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.1 + index * 0.06 }}
            >
              <TestimonialCard item={item} layout="grid" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-nowrap justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible"
        >
          {TAGS.map((tag) => (
            <span
              key={tag.label}
              className={`shrink-0 whitespace-nowrap px-3 py-2 sm:px-4 text-xs sm:text-sm font-semibold rounded-full border ${tag.className}`}
            >
              {tag.label}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
