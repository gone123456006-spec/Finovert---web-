import { useEffect, useRef, useState } from "react";

/* Pre-connect to YouTube domains so the browser resolves DNS before the iframe even mounts */
const PreconnectLinks = () => (
  <>
    <link rel="preconnect" href="https://www.youtube-nocookie.com" />
    <link rel="preconnect" href="https://i.ytimg.com" />
    <link rel="dns-prefetch" href="https://www.youtube-nocookie.com" />
    <link rel="dns-prefetch" href="https://i.ytimg.com" />
  </>
);

const CARD_DATA = [
  {
    title: "Kya startup shuru kr rhe hai ?",
    mobileTitle: (
      <>
        Kya startup shuru
        <br />
        <span className="text-blue-600">kr rhe hai?</span>
      </>
    ),
    points: [
      "Startup India Initiative",
      "Fund of Funds for Startups",
      "Credit Guarantee for Startups",
      "PMMY LOAN",
    ],
    videoId: "gboe1-7fwFM",
    videoTitle: "Top Government Schemes for Startup",
    bgColor: "bg-[#FDF3E1]",
  },
  {
    title: "Why 90% Startups Fail ?",
    mobileTitle: (
      <>
        Why 90% Startups
        <br />
        <span className="text-red-500">Fail ?</span>
      </>
    ),
    points: [
      "No Product-Market Fit",
      "Cash Depletion & Runout",
      "Execution & Team Gaps",
      "Ignoring Taxes & Compliance",
    ],
    videoId: "P_hcpcwBW-E",
    videoTitle: "Biggest Startup Mistakes Every Founder Must Avoid",
    bgColor: "bg-[#F0F4FF]",
  },
];

const embedUrl = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&controls=1&rel=0&playsinline=1&modestbranding=1&enablejsapi=1`;

const thumbUrl = (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

function VideoCard({
  title,
  mobileTitle,
  points,
  videoId,
  videoTitle,
  bgColor,
  isActive,
  compact = false,
}: (typeof CARD_DATA)[0] & { isActive: boolean; compact?: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(Array(points.length).fill(false));
  const [headingVisible, setHeadingVisible] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(true);

  useEffect(() => {
    let hasAnimated = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            setHeadingVisible(true);
            points.forEach((_, i) => {
              setTimeout(() => {
                setVisibleItems((prev) => {
                  const next = [...prev];
                  next[i] = true;
                  return next;
                });
              }, 300 + i * 200);
            });
          }
        });
      },
      { threshold: 0.3 },
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [points]);

  useEffect(() => {
    if (isActive && iframeLoaded) {
      const t = setTimeout(() => setShowThumbnail(false), 150);
      return () => clearTimeout(t);
    }
    if (!isActive) {
      setShowThumbnail(true);
    }
  }, [isActive, iframeLoaded]);

  useEffect(() => {
    if (!iframeRef.current) return;
    const msg = isActive
      ? '{"event":"command","func":"playVideo","args":""}'
      : '{"event":"command","func":"pauseVideo","args":""}';
    try {
      iframeRef.current.contentWindow?.postMessage(msg, "*");
    } catch {
      /* cross-origin — ignore */
    }
  }, [isActive]);

  return (
    <div
      ref={cardRef}
      className={`${bgColor} flex h-full w-full flex-col justify-between shadow-sm ${
        compact
          ? "rounded-2xl px-5 py-8 sm:px-6 sm:py-9 lg:px-8 lg:py-10"
          : "px-4 py-8 sm:px-12 sm:py-10 lg:px-16 lg:py-12"
      }`}
    >
      <h2
        className="mb-6 block text-center text-[1.3rem] font-bold leading-tight tracking-tight text-[#1d1d1f] transition-all duration-700 sm:hidden"
        style={{
          opacity: headingVisible ? 1 : 0,
          transform: headingVisible ? "translateY(0)" : "translateY(-15px)",
        }}
      >
        {mobileTitle}
      </h2>

      <div
        className={`flex flex-1 items-center ${
          compact
            ? "flex-col gap-5 lg:flex-row lg:gap-5"
            : "flex-row gap-4 sm:gap-10 lg:gap-14"
        }`}
      >
        <div className={`text-left ${compact ? "w-full lg:flex-1" : "flex-1"}`}>
          <h2
            className={`mb-3 hidden font-bold leading-tight tracking-tight text-[#1d1d1f] transition-all duration-700 sm:block ${
              compact ? "text-xl lg:text-2xl xl:text-[1.65rem] mb-4" : "text-[2rem] lg:text-[2.5rem] mb-4"
            }`}
            style={{
              opacity: headingVisible ? 1 : 0,
              transform: headingVisible ? "translateX(0)" : "translateX(-20px)",
            }}
          >
            {title}
          </h2>

          <ul className={`space-y-2 ${compact ? "sm:space-y-2.5" : "sm:space-y-3"}`}>
            {points.map((point, index) => (
              <li
                key={point}
                className={`flex items-start gap-2.5 font-medium leading-relaxed text-[#86868b] transition-all duration-500 ${
                  compact ? "text-[0.85rem] lg:text-[0.95rem]" : "text-[0.8rem] sm:text-[0.95rem]"
                }`}
                style={{
                  opacity: visibleItems[index] ? 1 : 0,
                  transform: visibleItems[index] ? "translateX(0)" : "translateX(-15px)",
                }}
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.7rem] font-bold text-white shadow-sm sm:h-6 sm:w-6 sm:text-[0.8rem]`}
                  style={{
                    backgroundColor: visibleItems[index] ? "#1d1d1f" : "#aaa",
                    transform: visibleItems[index] ? "scale(1)" : "scale(0.5)",
                    transition: "background-color 0.5s, transform 0.5s",
                  }}
                >
                  {index + 1}
                </span>
                <span className="pt-0.5">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div
          className={`flex w-full justify-center sm:justify-end ${
            compact ? "lg:w-auto lg:shrink-0" : "flex-1"
          }`}
        >
          <div
            className={`relative flex items-center justify-center sm:justify-end ${
              compact ? "w-auto" : "w-full max-w-[420px]"
            }`}
          >
            <div
              className={`group relative flex-shrink-0 overflow-hidden border border-white bg-black shadow-[0_8px_24px_rgba(0,0,0,0.12)] sm:border-2 ${
                compact
                  ? "h-[340px] w-[192px] rounded-[16px] sm:h-[400px] sm:w-[225px] lg:h-[440px] lg:w-[248px]"
                  : "h-[213px] w-[120px] rounded-[10px] sm:h-[462px] sm:w-[260px] sm:rounded-[20px]"
              }`}
            >
              <div
                className={`absolute inset-0 origin-top-left ${
                  compact
                    ? "h-full w-full scale-100"
                    : "h-[462px] w-[260px] scale-[0.4615] sm:h-full sm:w-full sm:scale-100"
                }`}
              >
                <iframe
                  ref={iframeRef}
                  className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${
                    isActive && !showThumbnail ? "opacity-100" : "opacity-0"
                  }`}
                  src={embedUrl(videoId)}
                  title={videoTitle}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  onLoad={() => setIframeLoaded(true)}
                />

                {showThumbnail && (
                  <div className="absolute inset-0 h-full w-full">
                    <img
                      src={thumbUrl(videoId)}
                      alt={videoTitle}
                      className="h-full w-full object-cover transition-opacity duration-300"
                      loading="eager"
                    />
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/10 transition-colors duration-300">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
                        <svg
                          className="ml-0.5 h-6 w-6 fill-current text-black"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VideoBannerSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateState = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    setActiveIndex(Math.round(scrollLeft / Math.max(clientWidth, 1)));
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.addEventListener("scroll", updateState, { passive: true });
    const timer = setTimeout(updateState, 100);
    return () => {
      container.removeEventListener("scroll", updateState);
      clearTimeout(timer);
    };
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollRef.current.clientWidth : scrollRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative flex min-h-[720px] items-center overflow-hidden py-16 sm:min-h-[820px] sm:py-20 lg:min-h-[900px] lg:py-24">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-55 saturate-50 brightness-110"
        style={{ backgroundImage: "url('/templune-web-1608427_1920.png')" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.75) 0%, rgba(244,249,252,0.55) 35%, rgba(255,255,255,0.45) 65%, rgba(236,246,252,0.7) 100%), linear-gradient(105deg, rgba(255,255,255,0.5) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.4) 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 12% 85%, rgba(255,170,70,0.12) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 88% 25%, rgba(70,170,210,0.14) 0%, transparent 55%)",
        }}
      />
      <PreconnectLinks />
      <div className="relative z-10 w-full px-0 sm:mx-auto sm:max-w-7xl sm:px-6 lg:px-8">
        {/* Desktop / website: both cards on one screen, no scroll */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:items-center lg:gap-6 xl:gap-8">
          {CARD_DATA.map((card) => (
            <VideoCard key={card.videoId} {...card} isActive compact />
          ))}
        </div>

        {/* Mobile / tablet: keep swipe carousel */}
        <div className="relative lg:hidden">
          <button
            type="button"
            onClick={() => handleScroll("left")}
            className={`absolute left-1 top-1/2 z-20 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-gray-100 bg-white/95 text-gray-800 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white active:scale-95 sm:left-4 sm:h-10 sm:w-10 ${
              canScrollLeft ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-label="Previous card"
          >
            <svg className="h-3.5 w-3.5 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => handleScroll("right")}
            className={`absolute right-1 top-1/2 z-20 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-gray-100 bg-white/95 text-gray-800 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white active:scale-95 sm:right-4 sm:h-10 sm:w-10 ${
              canScrollRight ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-label="Next card"
          >
            <svg className="h-3.5 w-3.5 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div
            ref={scrollRef}
            className="scrollbar-hide flex snap-x snap-mandatory items-stretch gap-0 overflow-x-auto scroll-smooth pb-4 sm:gap-8"
          >
            {CARD_DATA.map((card, idx) => (
              <div key={card.videoId} className="flex w-full flex-shrink-0 snap-start">
                <VideoCard {...card} isActive={activeIndex === idx} />
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-center gap-2">
            {CARD_DATA.map((card, idx) => (
              <button
                key={card.videoId}
                type="button"
                onClick={() =>
                  scrollRef.current?.scrollTo({
                    left: idx * (scrollRef.current?.clientWidth ?? 0),
                    behavior: "smooth",
                  })
                }
                className={`rounded-full transition-all duration-300 ${
                  activeIndex === idx
                    ? "h-1 w-4 bg-[#1d1d1f] sm:h-2 sm:w-6"
                    : "h-1.5 w-1.5 bg-gray-300 hover:bg-gray-400 sm:h-2 sm:w-2"
                }`}
                aria-label={`Go to card ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
