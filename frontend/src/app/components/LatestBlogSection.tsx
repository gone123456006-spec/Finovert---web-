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
    <section className="pt-12 pb-6 sm:pt-16 sm:pb-8 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h3 className="text-3xl sm:text-[2.2rem] font-bold text-[#1d1d1f] tracking-tight">
            Latest from our blog
          </h3>
          <p className="text-[#86868b] mt-3 text-[1.1rem] max-w-xl font-medium">
            Finance, compliance, and growth tips — curated for founders and teams.
          </p>
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
                      className="group flex flex-col h-full bg-[#fbfbfd] rounded-[24px] overflow-hidden border border-gray-100/60 shadow-sm hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all duration-300"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 border-b border-gray-100/50">
                        <img
                          src={blogImageSrc(post.image)}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <span className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-white text-[11px] font-semibold tracking-wide text-[#1d1d1f] shadow-sm">
                          {post.category}
                        </span>
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <h4 className="text-[17px] font-semibold text-[#1d1d1f] leading-snug line-clamp-2 tracking-tight">{post.title}</h4>
                        <p className="mt-2 text-[14px] text-[#86868b] font-medium line-clamp-2">{post.excerpt}</p>
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
                    className="group flex flex-col h-full bg-[#fbfbfd] rounded-[24px] overflow-hidden border border-gray-100/60 shadow-sm hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:bg-white transition-all duration-300"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 border-b border-gray-100/50">
                      <img
                        src={blogImageSrc(post.image)}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      <span className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-white text-[11px] font-semibold tracking-wide text-[#1d1d1f] shadow-sm">
                        {post.category}
                      </span>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex flex-wrap items-center gap-3 text-[13px] text-[#86868b] mb-3 font-medium">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatBlogDate(post)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readTime || "5 min read"}
                        </span>
                      </div>

                      <h4 className="text-[18px] sm:text-[20px] font-semibold text-[#1d1d1f] leading-snug line-clamp-2 tracking-tight group-hover:text-black transition-colors">
                        {post.title}
                      </h4>

                      <p className="mt-3 text-[14px] text-[#86868b] leading-relaxed font-medium line-clamp-2 flex-1">
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

        <div className="flex justify-end mt-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1428A0] hover:text-[#0f1d75] transition-colors group/viewall"
          >
            View all
            <ArrowRight className="w-4 h-4 group-hover/viewall:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
