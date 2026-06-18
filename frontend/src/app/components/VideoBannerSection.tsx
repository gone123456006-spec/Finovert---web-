import { useEffect, useRef, useState } from 'react';

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
        Kya startup shuru<br />
        <span className="text-blue-600">kr rhe hai?</span>
      </>
    ),
    points: [
      "Startup India Initiative",
      "Fund of Funds for Startups",
      "Credit Guarantee for Startups",
      "PMMY LOAN"
    ],
    videoId: "gboe1-7fwFM",
    videoTitle: "Top Government Schemes for Startup",
    bgColor: "bg-[#FDF3E1]"
  },
  {
    title: "Why 90% Startups Fail ?",
    mobileTitle: (
      <>
        Why 90% Startups<br />
        <span className="text-red-500">Fail ?</span>
      </>
    ),
    points: [
      "No Product-Market Fit",
      "Cash Depletion & Runout",
      "Execution & Team Gaps",
      "Ignoring Taxes & Compliance"
    ],
    videoId: "P_hcpcwBW-E",
    videoTitle: "Biggest Startup Mistakes Every Founder Must Avoid",
    bgColor: "bg-[#F0F4FF]"
  }
];

const embedUrl = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&controls=1&rel=0&playsinline=1&modestbranding=1&enablejsapi=1`;

const thumbUrl = (id: string) =>
  `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

function VideoCard({
  title,
  mobileTitle,
  points,
  videoId,
  videoTitle,
  bgColor,
  isActive,
}: typeof CARD_DATA[0] & { isActive: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(Array(points.length).fill(false));
  const [headingVisible, setHeadingVisible] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(true);

  // Animate text on first scroll-into-view
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
      { threshold: 0.3 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [points]);

  // When card becomes active: hide thumbnail after a tiny delay so iframe is ready
  useEffect(() => {
    if (isActive && iframeLoaded) {
      const t = setTimeout(() => setShowThumbnail(false), 150);
      return () => clearTimeout(t);
    }
    if (!isActive) {
      setShowThumbnail(true);
    }
  }, [isActive, iframeLoaded]);

  // Pause/play via postMessage when active state changes
  useEffect(() => {
    if (!iframeRef.current) return;
    const msg = isActive
      ? '{"event":"command","func":"playVideo","args":""}'
      : '{"event":"command","func":"pauseVideo","args":""}';
    try {
      iframeRef.current.contentWindow?.postMessage(msg, '*');
    } catch (_) { /* cross-origin — ignore */ }
  }, [isActive]);

  return (
    <div
      ref={cardRef}
      className={`${bgColor} px-4 py-8 sm:px-12 sm:py-10 lg:px-16 lg:py-12 shadow-sm w-full flex flex-col justify-between`}
    >
      {/* Mobile Heading */}
      <h2
        className="block sm:hidden text-center text-[1.3rem] font-bold text-[#1d1d1f] mb-6 tracking-tight leading-tight transition-all duration-700"
        style={{
          opacity: headingVisible ? 1 : 0,
          transform: headingVisible ? 'translateY(0)' : 'translateY(-15px)',
        }}
      >
        {mobileTitle}
      </h2>

      <div className="flex flex-row items-center gap-4 sm:gap-10 lg:gap-14 flex-1">
        {/* Left Column */}
        <div className="flex-1 text-left">
          <h2
            className="hidden sm:block text-[2rem] lg:text-[2.5rem] font-bold text-[#1d1d1f] mb-4 tracking-tight sm:tracking-tighter leading-tight transition-all duration-700"
            style={{
              opacity: headingVisible ? 1 : 0,
              transform: headingVisible ? 'translateX(0)' : 'translateX(-20px)',
            }}
          >
            {title}
          </h2>

          <ul className="space-y-2 sm:space-y-3">
            {points.map((point, index) => (
              <li
                key={index}
                className="flex items-start gap-2.5 text-[0.8rem] sm:text-[0.95rem] text-[#86868b] font-medium leading-relaxed transition-all duration-500"
                style={{
                  opacity: visibleItems[index] ? 1 : 0,
                  transform: visibleItems[index] ? 'translateX(0)' : 'translateX(-15px)',
                }}
              >
                <span
                  className="flex-shrink-0 flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full text-white font-bold text-[0.7rem] sm:text-[0.8rem] shadow-sm mt-0.5"
                  style={{
                    backgroundColor: visibleItems[index] ? '#1d1d1f' : '#aaa',
                    transform: visibleItems[index] ? 'scale(1)' : 'scale(0.5)',
                    transition: 'background-color 0.5s, transform 0.5s',
                  }}
                >
                  {index + 1}
                </span>
                <span className="pt-0.5">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column - Video */}
        <div className="flex-1 w-full flex justify-center sm:justify-end">
          <div className="relative w-full max-w-[420px] flex items-center justify-center sm:justify-end">
            <div className="group relative w-[120px] h-[213px] sm:w-[260px] sm:h-[462px] bg-black rounded-[10px] sm:rounded-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] border sm:border-2 border-white overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 w-[260px] h-[462px] origin-top-left scale-[0.4615] sm:scale-100 sm:w-full sm:h-full">
                {/* Iframe always mounted & pre-loading in background */}
                <iframe
                  ref={iframeRef}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${isActive && !showThumbnail ? 'opacity-100' : 'opacity-0'
                    }`}
                  src={embedUrl(videoId)}
                  title={videoTitle}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  onLoad={() => setIframeLoaded(true)}
                />

                {/* Thumbnail shown until iframe is ready */}
                {showThumbnail && (
                  <div className="absolute inset-0 w-full h-full">
                    <img
                      src={thumbUrl(videoId)}
                      alt={videoTitle}
                      className="w-full h-full object-cover transition-opacity duration-300"
                      loading="eager"
                    />
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors duration-300 pointer-events-none">
                      <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                        <svg
                          className="w-6 h-6 text-black fill-current ml-0.5"
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
    setActiveIndex(Math.round(scrollLeft / clientWidth));
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.addEventListener('scroll', updateState, { passive: true });
    const timer = setTimeout(updateState, 100);
    return () => {
      container.removeEventListener('scroll', updateState);
      clearTimeout(timer);
    };
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollRef.current.clientWidth : scrollRef.current.clientWidth,
      behavior: 'smooth',
    });
  };

  return (
    <section className="py-6 sm:py-12 bg-white overflow-hidden">
      <PreconnectLinks />
      <div className="w-full sm:max-w-7xl sm:mx-auto px-0 sm:px-6 lg:px-8 relative">
        {/* Left Arrow */}
        <button
          onClick={() => handleScroll('left')}
          className={`absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-white text-gray-800 shadow-lg border border-gray-100 rounded-full w-6 h-6 sm:w-10 sm:h-10 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${canScrollLeft ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          aria-label="Previous card"
        >
          <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => handleScroll('right')}
          className={`absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-white text-gray-800 shadow-lg border border-gray-100 rounded-full w-6 h-6 sm:w-10 sm:h-10 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${canScrollRight ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          aria-label="Next card"
        >
          <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="flex items-stretch overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-0 sm:gap-8 pb-4 scroll-smooth"
        >
          {CARD_DATA.map((card, idx) => (
            <div key={idx} className="w-full flex-shrink-0 snap-start flex">
              <VideoCard {...card} isActive={activeIndex === idx} />
            </div>
          ))}
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {CARD_DATA.map((_, idx) => (
            <button
              key={idx}
              onClick={() =>
                scrollRef.current?.scrollTo({
                  left: idx * (scrollRef.current?.clientWidth ?? 0),
                  behavior: 'smooth',
                })
              }
              className={`rounded-full transition-all duration-300 ${activeIndex === idx ? 'w-4 h-1 sm:w-6 sm:h-2 bg-[#1d1d1f]' : 'w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-300 hover:bg-gray-400'
                }`}
              aria-label={`Go to card ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
