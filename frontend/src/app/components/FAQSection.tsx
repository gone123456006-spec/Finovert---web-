/**
 * SEO-Optimized FAQ Component
 * Provides FAQ sections with proper Schema.org markup for enhanced AI discoverability
 */

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface FAQItemType {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  description?: string;
  faqs: FAQItemType[];
  className?: string;
  defaultOpenIndex?: number;
}

export function FAQSection({
  title = "Frequently Asked Questions",
  description,
  faqs,
  className = "",
  defaultOpenIndex,
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(
    defaultOpenIndex !== undefined ? defaultOpenIndex : null
  );

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      className={`py-12 sm:py-16 ${className}`}
      itemScope
      itemType="https://schema.org/FAQPage"
      aria-labelledby="faq-heading"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            id="faq-heading"
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            {title}
          </h2>
          {description && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
              className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <h3
                  itemProp="name"
                  className="text-lg font-semibold text-gray-900 pr-4 flex-1"
                >
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    id={`faq-answer-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    itemScope
                    itemProp="acceptedAnswer"
                    itemType="https://schema.org/Answer"
                  >
                    <div className="px-6 pb-5 text-gray-700 leading-relaxed">
                      <div itemProp="text">{faq.answer}</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Compact FAQ Component (for inline use)
 */
interface CompactFAQProps {
  faqs: FAQItemType[];
  className?: string;
}

export function CompactFAQ({ faqs, className = "" }: CompactFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={`space-y-3 ${className}`}>
      {faqs.map((faq, index) => (
        <details
          key={index}
          itemScope
          itemProp="mainEntity"
          itemType="https://schema.org/Question"
          className="group border border-gray-200 rounded-lg bg-white"
          open={openIndex === index}
          onToggle={() => setOpenIndex(openIndex === index ? null : index)}
        >
          <summary
            className="px-4 py-3 cursor-pointer list-none flex items-center justify-between hover:bg-gray-50 transition-colors"
            itemProp="name"
          >
            <span className="font-medium text-gray-900">{faq.question}</span>
            <ChevronDown className="w-4 h-4 text-gray-500 group-open:rotate-180 transition-transform" />
          </summary>
          <div
            className="px-4 pb-3 text-sm text-gray-700"
            itemScope
            itemProp="acceptedAnswer"
            itemType="https://schema.org/Answer"
          >
            <div itemProp="text">{faq.answer}</div>
          </div>
        </details>
      ))}
    </div>
  );
}
