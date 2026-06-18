import { motion } from "motion/react";
import { Twitter, Linkedin, Youtube, Mail, MapPin, Phone } from "lucide-react";
import { useEffect } from "react";
import logo from "@/assets/logogogw.png";

const APP_LINK = "https://play.google.com/store/apps/details?id=com.brandovert.finovert&pcampaignid=web_share";

export function Footer() {
  // Local SEO Schema for Google Business
  useEffect(() => {
    let script = document.querySelector('#local-business-schema') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = 'local-business-schema';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Finovert",
      "image": "https://www.finovert.com/app-logo.png",
      "email": "Fintaxcoach@gmail.com",
      "telephone": "+91 9153832948",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "335, 3rd Floor, Vardhman Sunrize Plaza, Vashundhara Enclave",
        "addressLocality": "New Delhi",
        "postalCode": "110096",
        "addressCountry": "IN"
      },
      "url": "https://www.finovert.com"
    });
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <footer id="contact" className="bg-[#f5f5f7] text-[#86868b] text-[13px] border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 mb-10 sm:mb-12">
          {/* Brand */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <img
                src={logo}
                alt="Finovert Logo"
                className="h-10 w-auto mb-4 object-contain mx-auto md:mx-0 filter drop-shadow-sm"
              />
              <p className="text-[#86868b] leading-relaxed mb-6 text-center md:text-left font-medium">
                Smart Finance for Growing Businesses
              </p>
              
              {/* Download Button */}
              <div className="mb-8 flex justify-center md:justify-start">
                <a 
                  href={APP_LINK}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-[#1d1d1f] text-white px-5 py-3 rounded-xl font-medium hover:bg-black transition-all shadow-sm"
                >
                  {/* Official Google Play Store Icon */}
                  <svg className="w-7 h-7" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#4CAF50" d="M48 428.8V83.2L287.1 256z"/>
                    <path fill="#F44336" d="M287.1 256L48 83.2l53.1-30.7L340 196.2z"/>
                    <path fill="#FFC107" d="M287.1 256l52.9-59.8 112 64.7-112 64.6z"/>
                    <path fill="#2196F3" d="M287.1 256L101.1 459.5 48 428.8l239.1-172.8z"/>
                    <path fill="#4CAF50" d="M340 315.8l-52.9-59.8L452 191.3l-112 124.5z"/>
                  </svg>
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-300">Get it on</span>
                    <span className="text-[16px] font-bold tracking-tight">Google Play</span>
                  </div>
                </a>
              </div>

              <div className="flex gap-4 justify-center md:justify-start">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-200 hover:bg-[#1d1d1f] hover:text-white text-[#1d1d1f] flex items-center justify-center transition-all duration-300">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="https://www.linkedin.com/company/finovert/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-200 hover:bg-[#1d1d1f] hover:text-white text-[#1d1d1f] flex items-center justify-center transition-all duration-300">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-200 hover:bg-[#1d1d1f] hover:text-white text-[#1d1d1f] flex items-center justify-center transition-all duration-300">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </motion.div>

          </div>

          {/* Company Links */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-[#1d1d1f] font-semibold mb-4 text-[14px]">Company</h4>
              <ul className="space-y-3 font-medium">
                <li>
                  <a href="/verify" className="hover:text-[#1d1d1f] transition-colors">ID Verification</a>
                </li>
                <li>
                  <a href="/contributors" className="hover:text-[#1d1d1f] transition-colors">Contributors</a>
                </li>
                <li>
                  <a href="/blog" className="hover:text-[#1d1d1f] transition-colors">Blog & Insights</a>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Contact */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-[#1d1d1f] font-semibold mb-4 text-[14px]">Get in Touch</h4>
              <ul className="space-y-3 font-medium">
                <li className="flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Fintaxcoach@gmail.com</span>
                </li>
                <li className="flex items-start gap-2">
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>+91 9153832948</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>335, 3rd Floor, Vardhman Sunrize Plaza, Vashundhara Enclave, New Delhi-110096</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-gray-200"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-[#86868b] text-[12px] font-medium">
              © 2026 Finovert. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-[12px] font-medium">
              <a href="/privacy" className="hover:text-[#1d1d1f] transition-colors">Privacy Policy</a>
              <a href="/privacy#account-deletion" className="hover:text-[#1d1d1f] transition-colors">Account Delete Policy</a>
              <a href="#terms" className="hover:text-[#1d1d1f] transition-colors">Terms of Service</a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
