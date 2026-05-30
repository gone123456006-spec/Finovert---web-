import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useState } from "react";
import { ShieldCheck, Zap, Globe, Lock, TrendingUp, type LucideIcon } from "lucide-react";
import { AutoHorizontalScroll } from "./AutoHorizontalScroll";

const reasons: {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string;
  image: string;
  imageAlt: string;
}[] = [
  {
    icon: Globe,
    title: "Built for Modern India",
    description: "Designed specifically for Indian market regulations and tax compliance frameworks.",
    accent: "from-[#1428A0] to-[#3b5bdb]",
    image:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=800",
    imageAlt: "India skyline and modern business district",
  },
  {
    icon: ShieldCheck,
    title: "AI Decision Intelligence",
    description: "Leverage advanced AI to transform raw data into actionable financial strategies.",
    accent: "from-[#0d9488] to-[#2dd4bf]",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    imageAlt: "Financial analytics and AI dashboards",
  },
  {
    icon: Zap,
    title: "Zero Learning Curve",
    description: "An intuitive interface designed for business owners, not just accountants.",
    accent: "from-[#7c3aed] to-[#a78bfa]",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800",
    imageAlt: "Team using intuitive business software",
  },
  {
    icon: Lock,
    title: "Bank-Grade Security",
    description: "Enterprise-level encryption and security protocols to keep your data safe.",
    accent: "from-[#ea580c] to-[#fb923c]",
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=800",
    imageAlt: "Secure digital finance and data protection",
  },
  {
    icon: TrendingUp,
    title: "Scalable Growth",
    description: "Automate repetitive tasks and reduce overhead as your business expands.",
    accent: "from-[#db2777] to-[#f472b6]",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
    imageAlt: "Business team planning scalable growth",
  },
];

function ReasonCardImage({
  src,
  alt,
  fallbackSrc,
}: {
  src: string;
  alt: string;
  fallbackSrc: string;
}) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      loading="lazy"
      onError={() => {
        if (imgSrc !== fallbackSrc) setImgSrc(fallbackSrc);
      }}
    />
  );
}

function ReasonCard({
  reason,
  scrollLayout = false,
}: {
  reason: (typeof reasons)[number];
  scrollLayout?: boolean;
}) {
  const Icon = reason.icon;
  return (
    <div
      className={`group h-full bg-white rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.05)] border border-white/90 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col ${
        scrollLayout ? "w-[min(88vw,300px)] shrink-0" : "w-full"
      }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#eef0f4]">
        <ReasonCardImage
          src={reason.image}
          alt={reason.imageAlt}
          fallbackSrc="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
        <div
          className={`absolute top-3 left-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${reason.accent} text-white shadow-lg`}
          aria-hidden
        >
          <Icon className="w-5 h-5" strokeWidth={2.2} />
        </div>
      </div>
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-[#0B1220] mb-2 group-hover:text-[#1428A0] transition-colors">
          {reason.title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed">{reason.description}</p>
      </div>
    </div>
  );
}

export function WhyFinovert() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="why-finovert"
      ref={ref}
      className="relative bg-[#f4f6f9] pb-2 sm:pb-24 overflow-hidden"
    >
      <div className="relative z-10 pt-3 sm:pt-14 md:pt-16">
        <div className="absolute top-24 right-0 w-[420px] h-[420px] bg-[#1428A0]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[320px] h-[320px] bg-[#3b5bdb]/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6 sm:mb-14"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-[#0B1220] tracking-tight leading-tight">
              Why choose{" "}
              <span className="text-[#1428A0]">Finovert?</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-gray-500 max-w-2xl mx-auto">
              Everything you need to run finance and compliance with confidence.
            </p>
          </motion.div>

          <div className="md:hidden -mx-4">
            <AutoHorizontalScroll durationSec={50} trackClassName="gap-3 px-4">
              {reasons.map((reason) => (
                <ReasonCard key={reason.title} reason={reason} scrollLayout />
              ))}
            </AutoHorizontalScroll>
          </div>

          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-5">
            {reasons.map((reason, index) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 28 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <ReasonCard reason={reason} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
