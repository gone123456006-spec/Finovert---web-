import { motion } from "motion/react";

export function RegistrationSection() {
  return (
    <section 
      className="pt-12 pb-4 sm:pt-16 sm:pb-5 bg-gradient-to-b from-gray-50 to-white"
      itemScope
      itemType="https://schema.org/WebPageElement"
      aria-labelledby="registration-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 
            id="registration-heading"
            className="text-3xl sm:text-[2.5rem] font-bold text-[#0F2A5F] mb-4 tracking-tight"
            itemProp="name"
          >
            Business Registration Services in India
          </h2>
          <p 
            className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed text-center"
            itemProp="description"
          >
            Complete business registration services with expert guidance and compliance support for company registration, NGO registration, licenses, certifications, and international business setup across India
          </p>
        </motion.div>
      </div>
    </section>
  );
}
