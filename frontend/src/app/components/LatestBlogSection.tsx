import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE from "../../config/api";

type BlogPreview = {
  slug?: string;
  id?: string;
  _id?: string;
  title: string;
  excerpt: string;
  category: string;
  readTime?: string;
  author?: string;
  image: string;
  createdAt?: string;
  date?: string;
};

const FALLBACK_POSTS: BlogPreview[] = [
  {
    slug: "startup-finance-strategies-2026",
    title: "Best Startup Finance Strategies to Grow Faster in 2026",
    excerpt:
      "Practical finance moves founders use to scale faster with stronger cash control and investor-ready numbers.",
    category: "Finance",
    readTime: "6 min read",
    createdAt: "2026-07-08",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400",
  },
  {
    slug: "compliance-checklist-early-stage",
    title: "Top Compliance Checklist for Early-Stage Startups",
    excerpt:
      "A focused compliance roadmap for new companies to stay audit-ready without slowing product growth.",
    category: "Compliance",
    readTime: "5 min read",
    createdAt: "2026-07-08",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400",
  },
  {
    slug: "investor-ready-financial-reports",
    title: "How to Build Investor-Ready Financial Reports",
    excerpt:
      "Learn how to structure reports that build trust with investors and speed up fundraising conversations.",
    category: "Growth",
    readTime: "7 min read",
    createdAt: "2026-07-08",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400",
  },
  {
    slug: "gst-filing-tips-smes",
    title: "GST Filing Tips Every SME Should Know",
    excerpt:
      "Avoid common GST mistakes with clear filing habits, deadline tracking, and cleaner invoice workflows.",
    category: "Tax",
    readTime: "5 min read",
    createdAt: "2026-06-20",
    image: "https://images.unsplash.com/photo-1554224154-26032ffc0d62?auto=format&fit=crop&q=80&w=400",
  },
  {
    slug: "virtual-cfo-for-startups",
    title: "When Your Startup Needs a Virtual CFO",
    excerpt:
      "Signs you have outgrown DIY finance — and how a virtual CFO keeps growth and compliance aligned.",
    category: "CFO",
    readTime: "6 min read",
    createdAt: "2026-06-12",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400",
  },
];

const PAUSE_MS = 5000;
const BLOG_CACHE_KEY = "finovert_blog_preview_v1";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function blogImageSrc(image: string) {
  if (!image) return FALLBACK_POSTS[0].image;
  if (image.startsWith("http") || image.startsWith("data:")) return image;
  return `${API_BASE}${image.startsWith("/") ? image : `/${image}`}`;
}

function formatBlogDate(post: BlogPreview) {
  if (post.date) return post.date;
  if (!post.createdAt) return "Recently";
  return new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function postHref(post: BlogPreview) {
  return `/blog/${post.slug || post.id || post._id || ""}`;
}

function postKey(post: BlogPreview, index: number) {
  return post.slug || post._id || post.id || `${post.title}-${index}`;
}

function BlogCard({ post }: { post: BlogPreview }) {
  return (
    <article className="flex h-full flex-col">
      <Link to={postHref(post)} className="group flex h-full flex-col">
        <div className="aspect-[16/10] overflow-hidden rounded-lg bg-slate-100">
          <img
            src={blogImageSrc(post.image)}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
            width="360"
            height="225"
            decoding="async"
          />
        </div>

        <div className="mt-4 flex flex-1 flex-col">
          <span className="inline-flex w-fit items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
            {formatBlogDate(post)}
          </span>

          <h4 className="mt-3 line-clamp-2 text-[17px] font-bold leading-snug tracking-tight text-[#1d1d1f] transition-colors group-hover:text-[#0F2A5F] sm:text-lg">
            {post.title}
          </h4>

          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-500 sm:text-[15px]">
            {post.excerpt}
          </p>
        </div>
      </Link>
    </article>
  );
}

function BlogCardSkeleton() {
  return (
    <div className="w-[min(85vw,320px)] shrink-0 snap-start sm:w-[340px] lg:w-[360px]">
      <div className="animate-pulse">
        <div className="aspect-[16/10] rounded-lg bg-slate-200" />
        <div className="mt-4 space-y-3">
          <div className="h-5 w-24 rounded-full bg-slate-200" />
          <div className="h-6 w-full rounded bg-slate-200" />
          <div className="h-4 w-11/12 rounded bg-slate-100" />
          <div className="h-4 w-4/5 rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

export function LatestBlogSection() {
  const [posts, setPosts] = useState<BlogPreview[]>(() => {
    try {
      const cached = sessionStorage.getItem(BLOG_CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL_MS) {
          return data;
        }
      }
    } catch {}
    return FALLBACK_POSTS;
  });
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchLatest = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/blogs`, { 
          signal: controller.signal,
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          const data: BlogPreview[] = await res.json();
          if (data.length > 0) {
            setPosts(data);
            try {
              sessionStorage.setItem(BLOG_CACHE_KEY, JSON.stringify({
                data,
                timestamp: Date.now()
              }));
            } catch {}
          }
        }
      } catch (err) {
        if (!(err instanceof DOMException && err.name === "AbortError")) {
          console.error("Failed to load latest blogs:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLatest();
    return () => controller.abort();
  }, []);

  const scrollToIndex = useMemo(() => 
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const el = scrollRef.current;
      if (!el) return;
      const cards = el.querySelectorAll<HTMLElement>("[data-blog-card]");
      const target = cards[index];
      if (!target) return;
      el.scrollTo({ left: target.offsetLeft - el.offsetLeft, behavior });
      setActiveIndex(index);
    },
  []);

  // Auto-scroll all blogs with a 5s pause between steps
  useEffect(() => {
    if (loading || posts.length <= 1 || paused) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = window.setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      const cards = el.querySelectorAll<HTMLElement>("[data-blog-card]");
      if (!cards.length) return;

      setActiveIndex((prev) => {
        const next = (prev + 1) % posts.length;
        const target = cards[next];
        if (target) {
          el.scrollTo({ left: target.offsetLeft - el.offsetLeft, behavior: "smooth" });
        }
        return next;
      });
    }, PAUSE_MS);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [loading, posts.length, paused]);

  // Keep activeIndex in sync when user scrolls manually
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const cards = el.querySelectorAll<HTMLElement>("[data-blog-card]");
      if (!cards.length) return;
      let closest = 0;
      let minDist = Number.POSITIVE_INFINITY;
      cards.forEach((card, idx) => {
        const dist = Math.abs(card.offsetLeft - el.offsetLeft - el.scrollLeft);
        if (dist < minDist) {
          minDist = dist;
          closest = idx;
        }
      });
      setActiveIndex(closest);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [posts.length, loading]);

  return (
    <section className="bg-white py-12 sm:py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
          <h3 className="text-2xl font-bold tracking-tight text-[#1d1d1f] sm:text-3xl md:text-[2rem]">
            Related Blogs
          </h3>
          <Link
            to="/blog"
            className="shrink-0 text-sm font-semibold text-[#C9A227] transition-colors hover:text-[#a8861f]"
          >
            View All
          </Link>
        </div>

        <div
          ref={scrollRef}
          className="scrollbar-hide flex snap-x snap-mandatory gap-7 overflow-x-auto scroll-smooth lg:gap-8"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => {
            window.setTimeout(() => setPaused(false), 2500);
          }}
        >
          {loading
            ? [0, 1, 2].map((i) => <BlogCardSkeleton key={i} />)
            : posts.map((post, index) => (
                <div
                  key={postKey(post, index)}
                  data-blog-card
                  className="w-[min(85vw,320px)] shrink-0 snap-start sm:w-[340px] lg:w-[360px]"
                >
                  <BlogCard post={post} />
                </div>
              ))}
        </div>

        {!loading && posts.length > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            {posts.map((post, idx) => (
              <button
                key={postKey(post, idx)}
                type="button"
                onClick={() => {
                  setPaused(true);
                  scrollToIndex(idx);
                  window.setTimeout(() => setPaused(false), PAUSE_MS);
                }}
                aria-label={`Go to blog ${idx + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  activeIndex === idx
                    ? "h-2 w-6 bg-[#C9A227]"
                    : "h-2 w-2 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
