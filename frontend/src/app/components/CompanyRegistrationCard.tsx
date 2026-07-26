import { motion } from "motion/react";
import { Link } from "react-router-dom";

export function CompanyRegistrationCard() {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-8 sm:p-12 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#2563eb] mb-4">
                Company Registration
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed">
                Full assistance in registering your business entity with end-to-end documentation support.
              </p>

              <div className="relative max-w-sm mx-auto mb-8">
                <img
                  src="/company-registration-phone.png"
                  alt="Company Registration App"
                  className="w-full h-auto drop-shadow-2xl"
                  loading="lazy"
                  width="400"
                  height="600"
                />
              </div>

              <Link
                to="/book-consultation"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-[#0F2A5F] rounded-lg hover:bg-[#0b1f47] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
