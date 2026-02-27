import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import logo from "@/assets/logogogw.png";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.95)"]
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Why Finovert", href: "#why" },
    { name: "Use Cases", href: "#use-cases" },
  ];

  const menuVariants = {
    closed: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
      }
    },
    open: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, y: 20 },
    open: { opacity: 1, y: 0 }
  };

  return (
    <motion.nav
      style={{ backgroundColor }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "shadow-lg backdrop-blur-lg" : ""
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="z-50"
          >
            <a href="#" className="flex items-center gap-2">
              <img src={logo} alt="Finovert Logo" className="h-10 w-auto object-contain" />
            </a>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex items-center gap-8"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
              >
                {link.name}
              </a>
            ))}
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all active:scale-95">
              Get Started
            </button>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            initial={false}
            animate={isMobileMenuOpen ? "open" : "closed"}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden z-50 p-2 text-gray-700 bg-gray-100/50 rounded-full hover:bg-gray-200/50 transition-colors focus:outline-none"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Improved Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-0 bg-white/95 backdrop-blur-xl z-40 md:hidden flex flex-col items-center justify-center p-6 pt-20"
            >
              <div className="flex flex-col items-center gap-8 w-full max-w-md">
                {navLinks.map((link) => (
                  <motion.a
                    key={link.name}
                    variants={itemVariants}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-3xl font-bold text-gray-900 hover:text-purple-600 transition-colors tracking-tight"
                  >
                    {link.name}
                  </motion.a>
                ))}

                <motion.div
                  variants={itemVariants}
                  className="w-full pt-8 mt-4 border-t border-gray-100 flex flex-col gap-4"
                >
                  <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:shadow-xl active:scale-95 transition-all">
                    Get Started <ArrowRight className="w-5 h-5" />
                  </button>
                  <button className="w-full bg-gray-50 text-gray-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all">
                    Sign In
                  </button>
                </motion.div>
              </div>

              {/* Decorative elements in menu */}
              <div className="absolute top-0 right-0 -z-10 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 left-0 -z-10 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}