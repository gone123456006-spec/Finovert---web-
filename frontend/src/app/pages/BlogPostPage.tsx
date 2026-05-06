import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import API_BASE from "../../config/api";
import { SEO } from "../components/SEO";
import { buildBlogPostMetadata } from "../config/seo";

// Hardcoded fallback posts matching BlogsPage local data
const LOCAL_POSTS: Record<string, { title: string; author: string; category: string; date: string; readTime: string; image: string; content: string }> = {
  "seo-in-2026": {
    title: "The Ultimate Guide to FinTech SEO in 2026",
    author: "Elena Gupta",
    category: "SEO",
    date: "April 25, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?auto=format&fit=crop&q=80&w=800",
    content: `Search engine optimization in the FinTech sector has evolved beyond simple keyword stuffing. In 2026, Google's algorithm prioritizes E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) signals above almost everything else, making authority-building the #1 priority for any financial technology company.\n\nThe most effective strategies include:\n\n**1. Schema Markup for Financial Products** — Implementing FinancialProduct and LoanOrCredit schema helps search engines understand your offering and can result in rich snippets that dramatically improve click-through rates.\n\n**2. Core Web Vitals** — A slow website is penalized hard in financial sectors. Users abandon pages that don't load within 2 seconds, and Google's ranking algorithms reflect this. Invest in edge caching and image optimization.\n\n**3. Topical Authority Clusters** — Rather than writing one-off articles, build interconnected content hubs around topics like "personal investing," "tax planning," and "crypto regulations." Each cluster reinforces every other article.\n\n**4. Long-form, Trust-building Content** — Articles under 800 words rarely rank for competitive financial keywords. Aim for comprehensive 2,000+ word guides backed by real data and citations from regulatory bodies.\n\nFinovert has used these strategies to grow organic traffic by 340% in under 12 months.`,
  },
};

interface BlogPost {
  _id?: string;
  title: string;
  author: string;
  category: string;
  date?: string;
  createdAt?: string;
  readTime: string;
  image: string;
  content: string;
  excerpt?: string;
  sourceName?: string;
  sourceLink?: string;
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchPost = async () => {
      // 1. Try local hardcoded posts first
      if (slug && LOCAL_POSTS[slug]) {
        setPost(LOCAL_POSTS[slug]);
        setLoading(false);
        return;
      }

      // 2. Try fetching from the backend API
      try {
        const res = await fetch(`${API_BASE}/api/blogs/${slug}`);
        if (res.ok) {
          let data = await res.json();

          // If the stored content is too short, try to scrape the full article
          if (data.sourceLink && (!data.content || data.content.length < 300)) {
            try {
              const scrapeRes = await fetch(`${API_BASE}/api/blogs/scrape-full/${slug}`, { method: 'POST' });
              if (scrapeRes.ok) {
                // Re-fetch the blog now that content has been updated in DB
                const updatedRes = await fetch(`${API_BASE}/api/blogs/${slug}`);
                if (updatedRes.ok) data = await updatedRes.json();
              }
            } catch {
              // Scraping failed — just show what we have
            }
          }

          setPost(data);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center pt-24 px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Article Not Found</h1>
        <p className="text-gray-500 mb-8">This article doesn't exist or may have been removed.</p>
        <Link to="/blog" className="flex items-center gap-2 text-blue-600 font-semibold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>
    );
  }

  const displayDate = post.date || (post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })
    : "");

  // Convert plain-text newlines to paragraphs
  const paragraphs = post.content
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(Boolean);

  const seoMeta = buildBlogPostMetadata({
    title: post.title,
    excerpt: post.excerpt || post.content.slice(0, 160),
    slug: slug || "",
    image: post.image,
    author: post.author || "Finovert Team",
    publishedTime: post.createdAt,
    modifiedTime: post.createdAt,
    category: post.category,
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <SEO
        title={seoMeta.title}
        description={seoMeta.description}
        type={seoMeta.type}
        image={seoMeta.image}
        path={seoMeta.path}
        author={seoMeta.author}
        publishedTime={seoMeta.publishedTime}
        modifiedTime={seoMeta.modifiedTime}
        keywords={seoMeta.keywords}
        structuredData={seoMeta.structuredData}
      />
      {/* Hero Image */}
      <div className="w-full h-72 md:h-96 overflow-hidden relative">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
        <div className="absolute bottom-6 left-6">
          <span className="bg-white/90 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
            {post.category}
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 mb-6">
          <Link to="/blog" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
        </motion.div>

        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-200">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span className="font-medium text-gray-800">Finovert</span>
            </span>
            {displayDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> {displayDate}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> {post.readTime}
            </span>
          </div>

          {/* Content */}
          <div className="prose prose-gray max-w-none">
            {paragraphs.map((para, i) => {
              // Bold markdown **text**
              const parts = para.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
                if (part.startsWith("**") && part.endsWith("**")) {
                  return <strong key={j}>{part.slice(2, -2)}</strong>;
                }
                return part;
              });

              return (
                <p key={i} className="text-gray-700 text-lg leading-relaxed mb-5">
                  {parts}
                </p>
              );
            })}
          </div>

        </motion.article>
      </div>
    </div>
  );
}
