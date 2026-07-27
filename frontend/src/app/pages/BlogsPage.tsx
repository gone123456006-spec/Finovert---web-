import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { Search, Calendar, User, ArrowRight, BookOpen, Clock } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { SEO } from "../components/SEO";
import API_BASE from "../../config/api";
import { blogHref, blogImageSrc, blogKey, formatBlogDate } from "../utils/blog";

interface BlogPost {
  id?: string;
  slug?: string;
  _id?: string;
  title: string;
  excerpt: string;
  category: string;
  date?: string;
  createdAt?: string;
  readTime: string;
  author: string;
  image: string;
  sourceLink?: string;
  sourceName?: string;
}

// Mock data - in a real app this would come from a CMS or API
const BLOG_POSTS = [
  {
    id: "seo-in-2026",
    title: "The Ultimate Guide to FinTech SEO in 2026",
    excerpt: "Learn how modern financial technology companies are dominating search results through technical SEO and schema markup.",
    category: "SEO",
    date: "April 25, 2026",
    readTime: "8 min read",
    author: "Elena Gupta",
    image: "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "future-of-finance",
    title: "How AI is Shaping the Future of Personal Finance",
    excerpt: "Artificial intelligence is no longer just a buzzword. See how it's being used to predict market trends and manage portfolios.",
    category: "Technology",
    date: "April 20, 2026",
    readTime: "5 min read",
    author: "Michael Chen",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "tax-planning-strategies",
    title: "Essential Tax Planning Strategies for Startups",
    excerpt: "A comprehensive breakdown of how new businesses can legally minimize their tax liability during the first crucial years.",
    category: "Finance",
    date: "April 15, 2026",
    readTime: "12 min read",
    author: "Sarah Johnson",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "react-performance",
    title: "Optimizing React Performance for Dashboard Applications",
    excerpt: "Technical dive into memoization, virtual lists, and state management techniques we use at Finovert.",
    category: "Engineering",
    date: "April 10, 2026",
    readTime: "10 min read",
    author: "Aarav Patel",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "remote-culture",
    title: "Building a Remote-First Engineering Culture",
    excerpt: "Our journey and lessons learned while scaling a distributed team of financial software engineers.",
    category: "Company",
    date: "April 05, 2026",
    readTime: "6 min read",
    author: "Priya Sharma",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "security-audits",
    title: "Preparing for Financial Security Audits",
    excerpt: "A checklist and guide on how to prepare your systems for rigorous compliance and security audits.",
    category: "Security",
    date: "March 28, 2026",
    readTime: "15 min read",
    author: "David Kim",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=400",
  }
];

const CATEGORIES = ["All", "Finance", "Technology", "SEO", "Engineering", "Company", "Security"];
const BLOG_CACHE_KEY = "finovert_blogs_cache_v1";

export function BlogsPage() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
  const [activeCategory, setActiveCategory] = useState("All");
  const [blogs, setBlogs] = useState<BlogPost[]>(BLOG_POSTS as BlogPost[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    // Show cached blogs immediately for faster first paint.
    try {
      const cached = localStorage.getItem(BLOG_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBlogs(parsed);
          setLoading(false);
        }
      }
    } catch (_error) {
      // Ignore cache parsing errors.
    }

    // Fetch latest blogs from backend
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/blogs`, { signal: controller.signal });
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setBlogs(data);
            localStorage.setItem(BLOG_CACHE_KEY, JSON.stringify(data));
          }
        }
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.error("Failed to fetch blogs from backend, using fallback/cached data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    setSearchQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  const filteredPosts = useMemo(() => {
    return blogs.filter((post) => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "All" || post.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, blogs]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <SEO 
        title="Finovert Blog - Finance, Compliance and Technology Insights"
        description="Read the latest Finovert blog posts on finance, compliance, startup growth, and technology insights for modern businesses."
        keywords={[
          "finovert blog",
          "finance blog",
          "compliance insights",
          "startup finance tips",
          "technology articles",
          "business growth blog",
        ]}
        type="website"
        path="/blog"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Finovert Blog",
          description:
            "Finance, compliance, and technology insights from the Finovert team.",
          url: "https://finovert.com/blog",
          publisher: {
            "@type": "Organization",
            name: "Finovert",
            url: "https://finovert.com",
          },
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Finovert <span className="text-blue-600">Blog</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Latest updates, news, and practical guides on finance, compliance, and technology.
          </p>
        </motion.div>

        {/* Sticky Search Container */}
        <div className="sticky top-[68px] sm:top-[72px] z-40 bg-gray-50/95 backdrop-blur-xl py-4 mb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 transition-all duration-300 border-b border-transparent shadow-none">
          <div className="max-w-7xl mx-auto">
            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-2xl mx-auto relative"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Search articles, topics, or keywords..."
              />
            </motion.div>
          </div>
        </div>

        {/* Categories Section (Scrolls away) */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-2.5 mb-12"
        >
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === category
                  ? "bg-gray-900 text-white shadow-lg scale-105"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900 shadow-sm"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Blog Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div className="animate-pulse">
                  <div className="h-56 bg-slate-200" />
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-20 rounded-full bg-slate-200" />
                      <div className="h-4 w-16 rounded bg-slate-100" />
                    </div>
                    <div className="h-6 w-full rounded bg-slate-200" />
                    <div className="h-6 w-4/5 rounded bg-slate-200" />
                    <div className="space-y-2">
                      <div className="h-4 w-full rounded bg-slate-100" />
                      <div className="h-4 w-11/12 rounded bg-slate-100" />
                      <div className="h-4 w-4/5 rounded bg-slate-100" />
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200" />
                        <div className="h-4 w-20 rounded bg-slate-200" />
                      </div>
                      <div className="h-4 w-24 rounded bg-slate-200" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, idx) => (
              <motion.article
                key={blogKey(post, idx)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group"
              >
                {/* Featured Image */}
                <div className="relative h-56 overflow-hidden">
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                      {post.category}
                    </span>
                  </div>
                  <img 
                    src={blogImageSrc(post.image)} 
                    alt={post.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    width="400"
                    height="300"
                    decoding="async"
                  />
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> {formatBlogDate(post)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> {post.readTime}
                    </span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    <Link to={blogHref(post)}>
                      {post.title}
                    </Link>
                  </h2>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">Finovert</span>
                    </div>
                    
                    <Link
                      to={blogHref(post)}
                      className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-semibold transition-colors"
                    >
                      Read More <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              We couldn't find any articles matching your search criteria. Try adjusting your filters or search query.
            </p>
            <button 
              onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
              className="mt-6 text-blue-600 font-medium hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
