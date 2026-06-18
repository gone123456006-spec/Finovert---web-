import { motion, AnimatePresence } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
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
      {
        name: "Explore",
        dropdown: [
          { name: "About", path: "/about" },
          { name: "Services", hash: "#services" },
          { name: "Features", hash: "#features" },
        ],
      },
      { 
        name: "Company", 
        dropdown: [
          { name: "ID Verification", path: "/verify" },
          { name: "Contributors", path: "/contributors" },
          { name: "Blog & Insights", path: "/blog" }
        ]
      },
      { name: "My App", path: "/my-app" },
      { name: "Join Our Team", path: "/careers" },
      { name: "Get In Touch", hash: "#contact" },
    ],
    [],
  );

  const getHref = (hash?: string) => {
    if (!hash) return "#";
    return location.pathname === "/" ? hash : `/${hash}`;
  };

  const getLinkClasses = (hash: string) =>
    `text-[14px] font-medium transition-colors duration-200 relative group ${
      activeHash === hash ? "text-[#1d1d1f]" : "text-[#86868b] hover:text-[#1d1d1f]"
    }`;

  const getContactButtonClasses = (isActive: boolean) =>
    `inline-flex items-center justify-center rounded-full px-5 py-2.5 text-[14px] font-semibold transition-all duration-200 ${
      isActive
        ? "bg-black text-white shadow-sm"
        : "bg-[#1d1d1f] text-white hover:bg-black shadow-sm"
    }`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "bg-white/80 backdrop-blur-lg shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border-b border-gray-200/50 py-0.5" 
          : "bg-white/50 backdrop-blur-sm border-b border-transparent py-1"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-10 sm:h-11">
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
              link.dropdown ? (
                <div key={link.name} className="relative group">
                  <button className="text-[14px] font-medium text-[#86868b] hover:text-[#1d1d1f] transition-colors duration-200 flex items-center gap-1 py-2">
                    {link.name}
                    <ChevronDown className="w-4 h-4 opacity-70 group-hover:rotate-180 transition-transform duration-200" />
                  </button>
                  <div className="absolute top-full -left-2 mt-2 w-56 bg-[#fbfbfd]/95 backdrop-blur-xl rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-gray-100/80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-3 group-hover:translate-y-0 z-50">
                    <div className="p-2 flex flex-col gap-1">
                      {link.dropdown.map(item => (
                        <a 
                          key={item.name} 
                          href={item.path || getHref(item.hash)} 
                          className="flex items-center px-4 py-3 text-[14px] font-medium text-[#86868b] hover:bg-white hover:text-[#1d1d1f] rounded-xl transition-all duration-200"
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <a
                  key={link.name}
                  href={link.path || getHref(link.hash)}
                  className={
                    link.hash === "#contact"
                      ? getContactButtonClasses(activeHash === link.hash)
                      : getLinkClasses(link.path || link.hash!)
                  }
                >
                  {link.name}
                </a>
              )
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

      {/* Mobile Right Sidebar Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 bg-black/35 z-[90]"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="md:hidden fixed top-0 right-0 h-dvh w-[82%] max-w-[340px] bg-white shadow-2xl z-[100] border-l border-gray-200 flex flex-col"
            >
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Menu</div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-4 py-3 flex-1 overflow-y-auto flex flex-col gap-1">
                {navLinks.map((link) => (
                  link.dropdown ? (
                    <div key={link.name} className="flex flex-col gap-1 py-2 border-b border-gray-100 last:border-b-0">
                      <div className="text-[11px] font-semibold px-3 text-gray-500 uppercase tracking-wider mb-1">{link.name}</div>
                      {link.dropdown.map((item) => (
                        <a
                          key={item.name}
                          href={item.path || getHref(item.hash)}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-[15px] font-medium py-2 px-3 rounded-lg text-gray-700 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <a
                      key={link.name}
                      href={link.path || getHref(link.hash)}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={
                        link.hash === "#contact"
                          ? `mt-3 text-[15px] font-semibold py-3 px-4 rounded-full text-center transition-colors ${
                              activeHash === link.hash
                                ? "bg-black text-white"
                                : "bg-[#1d1d1f] text-white hover:bg-black"
                            }`
                          : `text-[15px] font-medium py-2.5 px-3 rounded-xl transition-colors ${
                              activeHash === (link.path || link.hash)
                                ? "text-[#1d1d1f] bg-gray-100"
                                : "text-[#86868b] hover:text-[#1d1d1f] hover:bg-gray-50"
                            }`
                      }
                    >
                      {link.name}
                    </a>
                  )
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}