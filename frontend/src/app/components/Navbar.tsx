import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Menu, Phone, Search, X } from "lucide-react";
import logo from "@/assets/logogogw.png";
import { buildServiceSearchItems, searchSiteContent } from "../config/siteSearch";
import { rafThrottle } from "../utils/performance";

type MegaLink = { name: string; href: string };
type MegaCategory = { name: string; links: MegaLink[] };

const BOOK = "/book-consultation";

const MEGA_MENUS: Record<string, MegaCategory[]> = {
  Services: [
    {
      name: "Company Registration",
      links: [
        { name: "Company Registration", href: BOOK },
        { name: "Private Limited Company", href: BOOK },
        { name: "LLP registration", href: BOOK },
        { name: "Public Limited Company", href: BOOK },
        { name: "Partnership Firm", href: BOOK },
        { name: "Sole Proprietorship", href: BOOK },
        { name: "One Person Company", href: BOOK },
        { name: "Startup India", href: BOOK },
        { name: "Startup", href: BOOK },
        { name: "Nidhi Company", href: BOOK },
        { name: "Microfinance Company", href: BOOK },
        { name: "Producer Company", href: BOOK },
        { name: "Indian Subsidiary", href: BOOK },
        { name: "Foreign Subsidiary Company", href: BOOK },
        { name: "Foreign Company", href: BOOK },
      ],
    },
    {
      name: "NGO",
      links: [
        { name: "Section 8 Company", href: BOOK },
        { name: "Trust Registration", href: BOOK },
        { name: "Society Registration", href: BOOK },
        { name: "80G & 12A Registration", href: BOOK },
        { name: "FCRA Registration", href: BOOK },
      ],
    },
    {
      name: "Licenses & Certifications",
      links: [
        { name: "ISO Certification", href: BOOK },
        { name: "IEC Code", href: BOOK },
        { name: "MSME Registration", href: BOOK },
        { name: "Shop & Establishment", href: BOOK },
        { name: "Professional Tax", href: BOOK },
      ],
    },
    {
      name: "FSSAI Registration",
      links: [
        { name: "FSSAI Basic Registration", href: BOOK },
        { name: "FSSAI State License", href: BOOK },
        { name: "FSSAI Central License", href: BOOK },
        { name: "FSSAI Renewal", href: BOOK },
      ],
    },
    {
      name: "Trade License",
      links: [
        { name: "Trade License Registration", href: BOOK },
        { name: "Trade License Renewal", href: BOOK },
        { name: "Municipal Trade License", href: BOOK },
      ],
    },
    {
      name: "BIS Registration",
      links: [
        { name: "BIS Certification", href: BOOK },
        { name: "BIS CRS Registration", href: BOOK },
        { name: "ISI Mark Certification", href: BOOK },
      ],
    },
    {
      name: "International Business Setup",
      links: [
        { name: "USA Company Registration", href: BOOK },
        { name: "UK Company Registration", href: BOOK },
        { name: "Dubai Company Setup", href: BOOK },
        { name: "Singapore Company Setup", href: BOOK },
      ],
    },
    {
      name: "Other Services",
      links: [
        { name: "GST Registration", href: BOOK },
        { name: "GST Filing", href: BOOK },
        { name: "ITR Filing", href: BOOK },
        { name: "TDS Filing", href: BOOK },
        { name: "ROC Compliance", href: BOOK },
        { name: "Accounting & Bookkeeping", href: BOOK },
        { name: "Virtual CFO", href: BOOK },
        { name: "Trademark Registration", href: BOOK },
      ],
    },
  ],
  Company: [
    {
      name: "About Finovert",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Contributors", href: "/contributors" },
        { name: "Join Our Team", href: "/careers" },
        { name: "My App", href: "/my-app" },
      ],
    },
    {
      name: "Support",
      links: [
        { name: "Book Inquiry", href: BOOK },
        { name: "ID Verification", href: "/verify" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Contact", href: "/#contact" },
      ],
    },
  ],
};

const TOP_LINKS = [
  { name: "Home", href: "/" },
  { name: "Services", mega: true },
  { name: "Company", mega: true },
  { name: "Blog", href: "/blog" },
  { name: "My App", href: "/my-app" },
  { name: "Join Our Team", href: "/careers" },
] as const;

const SERVICE_SEARCH_ITEMS = buildServiceSearchItems(MEGA_MENUS);

export function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMega, setOpenMega] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState(0);
  const [mobileOpenSection, setMobileOpenSection] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const isHome = location.pathname === "/";
  const showNavBg =
    scrolled || !isHome || isMobileMenuOpen || Boolean(openMega) || isSearchOpen || isMobileSearchOpen;

  const searchResults = useMemo(
    () => searchSiteContent(searchTerm, SERVICE_SEARCH_ITEMS),
    [searchTerm],
  );

  const closeSearch = () => {
    setIsSearchOpen(false);
    setIsMobileSearchOpen(false);
    setSearchTerm("");
  };

  const goToHref = (href: string) => {
    closeSearch();
    if (href.includes("#")) {
      const [path, hash] = href.split("#");
      const targetPath = path || "/";
      if (location.pathname === targetPath) {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        else window.location.hash = hash;
      } else {
        navigate(href);
      }
      return;
    }
    navigate(href);
  };

  const submitSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const top = searchResults[0];
    if (top) {
      goToHref(top.href);
      return;
    }
    const query = searchTerm.trim();
    if (query) navigate(`/blog?q=${encodeURIComponent(query)}`);
    closeSearch();
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    
    // Use RAF throttle for smoother scroll
    const throttledScroll = rafThrottle(handleScroll);
    
    handleScroll(); // Check initial state
    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledScroll);
  }, []);

  useEffect(() => {
    setScrolled(window.scrollY > 24);
  }, [location.pathname]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : previousOverflow || "";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setOpenMega(null);
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsMobileSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isSearchOpen) searchInputRef.current?.focus();
  }, [isSearchOpen]);

  useEffect(() => {
    if (isMobileSearchOpen) mobileSearchInputRef.current?.focus();
  }, [isMobileSearchOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setIsMobileMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMega(null);
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
        setIsMobileSearchOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const currentCategories = openMega ? MEGA_MENUS[openMega] : null;
  const activeLinks = currentCategories?.[activeCategory]?.links ?? [];

  const openMenu = (name: string) => {
    setOpenMega(name);
    setActiveCategory(0);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        showNavBg
          ? "bg-white/95 shadow-[0_1px_0_rgba(15,42,95,0.08)] backdrop-blur-md"
          : "bg-transparent shadow-none"
      }`}
      onMouseLeave={() => setOpenMega(null)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-4">
          <Link to="/" className="flex items-center shrink-0" onClick={() => setOpenMega(null)}>
            <img src={logo} alt="Finovert Logo" className="h-9 w-auto object-contain" />
          </Link>

          {/* Desktop links */}
          {!isSearchOpen && (
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              {TOP_LINKS.map((link) =>
                "mega" in link && link.mega ? (
                  <button
                    key={link.name}
                    type="button"
                    onMouseEnter={() => openMenu(link.name)}
                    onFocus={() => openMenu(link.name)}
                    className={`inline-flex items-center gap-1 px-3 py-2 text-[14px] font-medium transition-colors ${
                      openMega === link.name
                        ? "text-[#0F2A5F]"
                        : "text-[#0F2A5F]/80 hover:text-[#0F2A5F]"
                    }`}
                  >
                    {link.name}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${
                        openMega === link.name ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    key={link.name}
                    to={"href" in link ? link.href : "/"}
                    onMouseEnter={() => setOpenMega(null)}
                    className="px-3 py-2 text-[14px] font-medium text-[#0F2A5F]/80 hover:text-[#0F2A5F] transition-colors"
                  >
                    {link.name}
                  </Link>
                ),
              )}
            </div>
          )}

          {/* Desktop search bar — replaces nav links only */}
          {isSearchOpen && (
            <form
              onSubmit={submitSearch}
              className="relative hidden min-w-0 flex-1 items-center lg:flex"
              role="search"
            >
              <div className="flex w-full items-center gap-2 rounded-full border border-[#0F2A5F]/25 bg-white px-4 py-2 shadow-sm focus-within:border-[#0F2A5F]">
                <Search className="h-[18px] w-[18px] shrink-0 text-[#0F2A5F]/60" />
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search company registration, GST, pages..."
                  className="w-full border-0 bg-transparent text-[14px] text-[#0F2A5F] outline-none placeholder:text-slate-400"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={closeSearch}
                  className="shrink-0 rounded-full p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#0F2A5F]"
                  aria-label="Close search"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {searchTerm.trim() && (
                <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-[60] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,42,95,0.14)]">
                  {searchResults.length > 0 ? (
                    <ul className="max-h-80 overflow-y-auto py-1">
                      {searchResults.map((item) => (
                        <li key={`${item.title}-${item.href}`}>
                          <button
                            type="button"
                            onClick={() => goToHref(item.href)}
                            className="flex w-full items-start justify-between gap-3 px-4 py-2.5 text-left transition-colors hover:bg-slate-50"
                          >
                            <span className="text-[14px] font-medium text-[#0F2A5F]">{item.title}</span>
                            <span className="shrink-0 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                              {item.category}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="px-4 py-3 text-sm text-slate-500">No matches found on the site.</p>
                  )}
                </div>
              )}
            </form>
          )}

          {/* Desktop CTAs — stay visible while searching */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            {!isSearchOpen && (
              <button
                type="button"
                onClick={() => {
                  setOpenMega(null);
                  setIsSearchOpen(true);
                }}
                className="p-2 text-[#0F2A5F]/70 hover:text-[#0F2A5F] transition-colors"
                aria-label="Search"
                onMouseEnter={() => setOpenMega(null)}
              >
                <Search className="h-[18px] w-[18px]" />
              </button>
            )}
            <Link
              to="/book-consultation"
              onMouseEnter={() => setOpenMega(null)}
              className="inline-flex items-center justify-center rounded-full px-4 py-2 text-[13px] font-semibold text-[#0F2A5F] border border-[#0F2A5F]/35 bg-transparent hover:bg-[#0F2A5F]/5 transition-colors"
            >
              Login
            </Link>
            <a
              href="https://wa.me/919153832948"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setOpenMega(null)}
              className="group inline-flex min-w-[168px] items-center justify-center gap-2 rounded-full bg-[#1d1d1f] px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-black"
            >
              <Phone className="h-3.5 w-3.5 shrink-0" />
              <span className="relative inline-grid place-items-center">
                <span className="col-start-1 row-start-1 transition-opacity duration-200 group-hover:opacity-0">
                  Talk to Experts
                </span>
                <span className="col-start-1 row-start-1 whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  +91 9153832948
                </span>
              </span>
            </a>
          </div>

          {/* Mobile actions */}
          <div className="flex items-center gap-1 lg:hidden">
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsMobileSearchOpen((v) => !v);
              }}
              className="p-2 text-[#0F2A5F] hover:bg-black/5 transition-colors"
              aria-label="Search"
            >
              {isMobileSearchOpen ? <X className="w-6 h-6" /> : <Search className="w-5 h-5" />}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsMobileSearchOpen(false);
                setIsMobileMenuOpen((v) => !v);
              }}
              className="p-2 text-[#0F2A5F] hover:bg-black/5 transition-colors"
              aria-label="Open menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        <AnimatePresence>
          {isMobileSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-visible"
            >
              <form onSubmit={submitSearch} role="search" className="pb-3">
                <div className="flex items-center gap-2 rounded-full border border-[#0F2A5F]/25 bg-white px-4 py-2.5 shadow-sm focus-within:border-[#0F2A5F]">
                  <Search className="h-[18px] w-[18px] shrink-0 text-[#0F2A5F]/60" />
                  <input
                    ref={mobileSearchInputRef}
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search company registration, GST, pages..."
                    className="w-full border-0 bg-transparent text-[14px] text-[#0F2A5F] outline-none placeholder:text-slate-400"
                    autoComplete="off"
                  />
                </div>

                {searchTerm.trim() && (
                  <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,42,95,0.14)]">
                    {searchResults.length > 0 ? (
                      <ul className="max-h-72 overflow-y-auto py-1">
                        {searchResults.map((item) => (
                          <li key={`m-${item.title}-${item.href}`}>
                            <button
                              type="button"
                              onClick={() => goToHref(item.href)}
                              className="flex w-full items-start justify-between gap-3 px-4 py-2.5 text-left transition-colors hover:bg-slate-50"
                            >
                              <span className="text-[14px] font-medium text-[#0F2A5F]">{item.title}</span>
                              <span className="shrink-0 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                {item.category}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="px-4 py-3 text-sm text-slate-500">No matches found on the site.</p>
                    )}
                  </div>
                )}
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mega menu panel */}
      <AnimatePresence>
        {openMega && currentCategories && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 right-0 top-full hidden px-8 pt-3 lg:block xl:px-16 2xl:px-28"
            onMouseEnter={() => setOpenMega(openMega)}
          >
            <div className="max-w-5xl mx-auto">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,42,95,0.14)]">
                <div className="grid grid-cols-[220px_1fr] min-h-[280px]">
                  {/* Sidebar */}
                  <div className="bg-slate-100 border-r border-slate-200 p-2.5">
                    {currentCategories.map((cat, idx) => (
                      <button
                        key={cat.name}
                        type="button"
                        onMouseEnter={() => setActiveCategory(idx)}
                        onClick={() => setActiveCategory(idx)}
                        className={`w-full text-left px-3 py-2.5 text-[14px] font-semibold mb-0.5 transition-colors ${
                          activeCategory === idx
                            ? "bg-[#0F2A5F] text-white"
                            : "text-[#334155] hover:bg-white"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>

                  {/* Links grid */}
                  <div className="p-4 sm:p-5 bg-white">
                    <div className="grid grid-cols-3 gap-x-6 gap-y-0.5">
                      {activeLinks.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="py-2.5 text-[15px] font-medium text-[#334155] hover:text-[#0F2A5F] hover:underline underline-offset-2 transition-colors"
                          onClick={() => setOpenMega(null)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/40 z-[90]"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="lg:hidden fixed top-0 right-0 h-dvh w-full bg-white z-[100] flex flex-col shadow-2xl"
            >
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <img src={logo} alt="Finovert" className="h-8 w-auto object-contain" />
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-slate-600 hover:bg-slate-100"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-3">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2.5 text-[15px] font-medium text-[#0F2A5F]"
                >
                  Home
                </Link>

                {Object.entries(MEGA_MENUS).map(([section, cats]) => (
                  <div key={section} className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        setMobileOpenSection((prev) => (prev === section ? null : section))
                      }
                      className="w-full flex items-center justify-between px-3 py-2.5 text-[15px] font-semibold text-[#0F2A5F]"
                    >
                      {section}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          mobileOpenSection === section ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {mobileOpenSection === section && (
                      <div className="pb-2 pl-2">
                        {cats.map((cat) => (
                          <div key={cat.name} className="mb-2">
                            <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#0F2A5F]">
                              {cat.name}
                            </p>
                            {cat.links.map((item) => (
                              <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-3 py-2 text-[14px] text-slate-600 hover:text-[#0F2A5F] hover:bg-slate-50"
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <Link
                  to="/blog"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2.5 text-[15px] font-medium text-[#0F2A5F] border-t border-slate-100"
                >
                  Blog
                </Link>
                <Link
                  to="/my-app"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2.5 text-[15px] font-medium text-[#0F2A5F]"
                >
                  My App
                </Link>
                <Link
                  to="/careers"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2.5 text-[15px] font-medium text-[#0F2A5F]"
                >
                  Join Our Team
                </Link>
              </div>

              <div className="p-4 border-t border-slate-100 space-y-2">
                <Link
                  to="/book-consultation"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full py-3 text-sm font-semibold border border-[#0F2A5F] text-[#0F2A5F]"
                >
                  Book Inquiry
                </Link>
                <a
                  href="https://wa.me/919153832948"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full rounded-full py-3 text-sm font-semibold text-white bg-[#1d1d1f] hover:bg-black"
                >
                  <Phone className="w-4 h-4" />
                  Talk to Experts
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
