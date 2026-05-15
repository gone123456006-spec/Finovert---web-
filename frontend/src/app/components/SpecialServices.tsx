import { motion } from "motion/react";
import servicesImg from "@/assets/serverer.jpeg";

const services = [
  {
    title: "Company Registration",
    description: "Full assistance in registering your business entity.",
    iconSrc: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f6e1.png",
    iconAlt: "Company registration icon",
  },
  {
    title: "GST Filing",
    description: "Hassle-free GST registration and monthly filings.",
    iconSrc: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/26a1.png",
    iconAlt: "GST filing icon",
  },
  {
    title: "ITR Filing",
    description: "Expert income tax return filing for businesses.",
    iconSrc: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f4dd.png",
    iconAlt: "ITR filing icon",
  },
  {
    title: "CFO Services",
    description: "Professional financial management for growth.",
    iconSrc: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f4ca.png",
    iconAlt: "CFO services icon",
  },
];

export function SpecialServices() {
  return (
    <section id="services" className="py-16 sm:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
          
          {/* Left Column: Text and Cards */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8 sm:mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-5 sm:mb-6">Special Services</h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-lg leading-relaxed">
                Offers tailored and comprehensive financial solutions to address specific and unique business needs, ensuring personalized care and support.
              </p>
            </motion.div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-5 sm:p-6 rounded-[24px] shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_25px_rgb(0,0,0,0.06)] transition-all duration-300 group border border-gray-100/50 min-h-[170px]"
                >
                  <div className="mb-4 bg-gray-100 w-11 h-11 flex items-center justify-center rounded-xl group-hover:scale-105 transition-transform">
                    <img
                      src={service.iconSrc}
                      alt={service.iconAlt}
                      className="w-6 h-6 object-contain"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-black transition-colors leading-tight">
                    {service.title}
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm mb-0 leading-relaxed">
                    {service.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column: Original Image Size */}
          <div className="relative flex justify-center lg:justify-end mt-2 sm:mt-0">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Service Grid Image (Full Size) */}
              <div className="relative rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100">
                <img
                  src={servicesImg}
                  alt="Finovert Services Grid"
                  className="w-full max-w-[500px] h-auto object-contain"
                  loading="lazy"
                />
              </div>

              {/* Background Decoration */}
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#2D6A4F]/10 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10" />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
