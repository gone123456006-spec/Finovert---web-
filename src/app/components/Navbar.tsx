import { motion, AnimatePresence } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logogogw.png";

export function Navbar() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : previousOverflow || "";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const syncHash = () => setActiveHash(window.location.hash || "#home");
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [location.pathname]);

  const navLinks = useMemo(
    () => [
      { name: "Home", hash: "#home" },
      { name: "About", hash: "#about" },
      { name: "Services", hash: "#services" },
      { name: "Features", hash: "#features" },
      { name: "Get In Touch", hash: "#contact" },
    ],
    [],
  );

  const getHref = (hash: string) => (location.pathname === "/" ? hash : `/${hash}`);

  const getLinkClasses = (hash: string) =>
    `text-[15px] font-medium transition-colors duration-200 relative group ${
      activeHash === hash ? "text-purple-600" : "text-gray-700 hover:text-purple-600"
    }`;

  const getContactButtonClasses = (isActive: boolean) =>
    `inline-flex items-center justify-center rounded-full px-4 py-2 text-[14px] font-semibold transition-all duration-200 ${
      isActive
        ? "bg-blue-700 text-white shadow-md"
        : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md"
    }`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${isScrolled ? "shadow-md" : "border-b border-gray-100"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[68px]">
          {/* Logo */}
          <motion.a
            href={getHref("#home")}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center flex-shrink-0"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <img src={logo} alt="Finovert Logo" className="h-9 w-auto object-contain" />
          </motion.a>

          {/* Desktop Nav Links — center */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex items-center gap-7"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={getHref(link.hash)}
                className={
                  link.hash === "#contact"
                    ? getContactButtonClasses(activeHash === link.hash)
                    : getLinkClasses(link.hash)
                }
              >
                {link.name}
                {link.hash !== "#contact" && (
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-purple-600 rounded-full transition-all duration-300 ${
                      activeHash === link.hash ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                )}
              </a>
            ))}
          </motion.div>



          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none z-50"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={getHref(link.hash)}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={
                    link.hash === "#contact"
                      ? `mt-2 text-base font-semibold py-2.5 px-3 rounded-lg text-center transition-colors ${
                          activeHash === link.hash
                            ? "bg-blue-700 text-white"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`
                      : `text-base font-medium py-2.5 px-3 rounded-lg transition-colors ${
                          activeHash === link.hash
                            ? "text-purple-700 bg-purple-50"
                            : "text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                        }`
                  }
                >
                  {link.name}
                </a>
              ))}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}