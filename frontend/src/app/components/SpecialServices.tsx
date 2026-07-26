import { motion } from "motion/react";
import { Link } from "react-router-dom";

const SERVICES = [
  {
    image: "/service-1.png",
    title: "Company Registration",
    link: "/book-consultation"
  },
  {
    image: "/service-2.png",
    title: "CFO Services",
    link: "/book-consultation"
  },
  {
    image: "/service-4.png",
    title: "GST Filing",
    link: "/book-consultation"
  },
  {
    image: "/service-3.png",
    title: "ITR Filing",
    link: "/book-consultation"
  },
];

export function SpecialServices() {
  return (
    <section id="services" className="pt-4 pb-6 sm:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 sm:mb-14 text-center"
        >
          <h2 className="text-3xl sm:text-[2.5rem] font-bold text-[#1d1d1f] mb-4 tracking-tight sm:tracking-tighter leading-tight">
            Special Services
          </h2>
          {/* Mobile Sub-heading */}
          <p className="sm:hidden text-sm text-[#86868b] max-w-2xl mx-auto leading-relaxed font-medium px-4">
            Tailored financial solutions for startups — expert-led and on time.
          </p>
          {/* Desktop Sub-heading */}
          <p className="hidden sm:block text-[1.1rem] text-[#86868b] max-w-2xl mx-auto leading-relaxed font-medium">
            Tailored financial solutions designed for startups and growing businesses — expert-led, transparent, and on time.
          </p>
        </motion.div>

        {/* Services Container */}
        <div className="-mx-4 sm:mx-0">
          <div className="flex lg:grid lg:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto scrollbar-hide px-4 sm:px-0" style={{ WebkitOverflowScrolling: "touch" }}>
            {SERVICES.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="shrink-0 w-[min(82vw,300px)] lg:w-auto"
              >
                {/* Card Container */}
                <div className="relative bg-white rounded-[24px] shadow-lg overflow-hidden" style={{ height: '400px' }}>
                  {/* Service Image */}
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                  
                  {/* Button overlaid on image at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-center">
                    <Link
                      to={service.link}
                      className="px-8 py-2 text-xs font-semibold text-black bg-white/20 border border-white/40 hover:bg-white/30 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-md"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
