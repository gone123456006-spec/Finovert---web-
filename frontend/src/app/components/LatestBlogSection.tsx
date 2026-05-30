import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import API_BASE from "../../config/api";
import { AutoHorizontalScroll } from "./AutoHorizontalScroll";

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
    excerpt: "Practical finance moves founders use to scale faster with stronger cash control and investor-ready numbers.",
    category: "Finance",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=900",
  },
  {
    slug: "compliance-checklist-early-stage",
    title: "Top Compliance Checklist for Early-Stage Startups",
    excerpt: "A focused compliance roadmap for new companies to stay audit-ready without slowing product growth.",
    category: "Compliance",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=900",
  },
  {
    slug: "investor-ready-financial-reports",
    title: "How to Build Investor-Ready Financial Reports",
    excerpt: "Learn how to structure reports that build trust with investors and speed up fundraising conversations.",
    category: "Growth",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=900",
  },
];

function blogImageSrc(image: string) {
  if (!image) return FALLBACK_POSTS[0].image;
  if (image.startsWith("http") || image.startsWith("data:")) return image;
  return `${API_BASE}${image.startsWith("/") ? image : `/${image}`}`;
}

function formatBlogDate(post: BlogPreview) {
  if (post.date) return post.date;
  if (!post.createdAt) return "Recently";
  return new Date(post.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function postHref(post: BlogPreview) {
  return `/blog/${post.slug || post.id || post._id || ""}`;
}

export function LatestBlogSection() {
  const [posts, setPosts] = useState<BlogPreview[]>(FALLBACK_POSTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchLatest = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/blogs`, { signal: controller.signal });
        if (res.ok) {
          const data: BlogPreview[] = await res.json();
          if (data.length > 0) {
            setPosts(data.slice(0, 3));
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

  return (
    <section className="pt-12 pb-6 sm:pt-16 sm:pb-8 md:py-20 bg-gradient-to-b from-[#f7f8fa] via-[#f4f5f8] to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h3 className="text-3xl sm:text-4xl font-bold text-[#0B1220] tracking-tight">
              Latest from our blog
            </h3>
            <p className="text-gray-500 mt-2 text-base max-w-xl">
              Finance, compliance, and growth tips — curated for founders and teams.
            </p>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center justify-center gap-2 self-start sm:self-auto px-6 py-3 rounded-full bg-[#0B1220] text-white text-sm font-semibold shadow-lg shadow-gray-900/10 hover:bg-[#1428A0] transition-colors"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <>
            <div className="md:hidden -mx-4">
              <AutoHorizontalScroll durationSec={50} trackClassName="gap-4 px-4">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="shrink-0 w-[min(85vw,320px)] rounded-[28px] bg-white overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] animate-pulse"
                  >
                    <div className="aspect-[16/10] bg-gray-200" />
                    <div className="p-6 space-y-3">
                      <div className="h-3 bg-gray-200 rounded-full w-1/3" />
                      <div className="h-5 bg-gray-200 rounded-full w-full" />
                      <div className="h-4 bg-gray-100 rounded-full w-4/5" />
                    </div>
                  </div>
                ))}
              </AutoHorizontalScroll>
            </div>
            <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-[28px] bg-white overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] animate-pulse"
                >
                  <div className="aspect-[16/10] bg-gray-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-3 bg-gray-200 rounded-full w-1/3" />
                    <div className="h-5 bg-gray-200 rounded-full w-full" />
                    <div className="h-4 bg-gray-100 rounded-full w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="md:hidden -mx-4">
              <AutoHorizontalScroll durationSec={52} trackClassName="gap-4 px-4">
                {posts.map((post) => (
                  <article
                    key={post.slug || post._id || post.id || post.title}
                    className="shrink-0 w-[min(85vw,320px)]"
                  >
                    <Link
                      to={postHref(post)}
                      className="group flex flex-col h-full bg-white rounded-[28px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-white/80"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-[#eef0f4]">
                        <img
                          src={blogImageSrc(post.image)}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                        <span className="absolute bottom-4 left-4 px-3.5 py-1.5 rounded-full bg-white/95 text-[11px] font-bold uppercase tracking-wide text-[#0B1220]">
                          {post.category}
                        </span>
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <h4 className="text-lg font-bold text-[#0B1220] leading-snug line-clamp-2">{post.title}</h4>
                        <p className="mt-2 text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
                      </div>
                    </Link>
                  </article>
                ))}
              </AutoHorizontalScroll>
            </div>

            <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8">
              {posts.map((post, index) => (
                <motion.article
                  key={post.slug || post._id || post.id || post.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                >
                  <Link
                    to={postHref(post)}
                    className="group flex flex-col h-full bg-white rounded-[28px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1.5 border border-white/80"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#eef0f4]">
                      <img
                        src={blogImageSrc(post.image)}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                      <span className="absolute bottom-4 left-4 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-bold uppercase tracking-wide text-[#0B1220] shadow-sm">
                        {post.category}
                      </span>
                    </div>

                    <div className="p-6 sm:p-7 flex flex-col flex-1">
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatBlogDate(post)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readTime || "5 min read"}
                        </span>
                      </div>

                      <h4 className="text-lg sm:text-xl font-bold text-[#0B1220] leading-snug line-clamp-2 group-hover:text-[#1428A0] transition-colors">
                        {post.title}
                      </h4>

                      <p className="mt-3 text-sm text-gray-500 leading-relaxed line-clamp-2 flex-1">
                        {post.excerpt}
                      </p>

                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#1428A0]">
                        Read article
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1428A0]/10 group-hover:bg-[#1428A0] group-hover:text-white transition-colors">
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
