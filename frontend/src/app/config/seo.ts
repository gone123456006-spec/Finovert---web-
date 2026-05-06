export const SEO_SITE = {
  name: "Finovert",
  baseUrl: (import.meta.env.VITE_SITE_URL || "https://finovert.com").replace(/\/+$/, ""),
  defaultImage: "https://finovert.com/default-og-image.jpg",
  defaultAuthor: "Finovert Team",
};

export const DEFAULT_SEO_KEYWORDS = [
  "finovert",
  "finance",
  "fintech",
  "business compliance",
  "startup finance",
  "technology",
];

export type JsonLd = Record<string, unknown>;

export interface SeoMetaInput {
  title: string;
  description: string;
  path?: string;
  canonicalUrl?: string;
  image?: string;
  keywords?: string[] | string;
  type?: "website" | "article";
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
  structuredData?: JsonLd | JsonLd[];
}

export interface BlogSeoInput {
  title: string;
  excerpt: string;
  slug: string;
  image?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  category?: string;
}

export function toAbsoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  const normalizedPath = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${SEO_SITE.baseUrl}${normalizedPath}`;
}

export function normalizeKeywords(keywords?: string[] | string): string {
  if (Array.isArray(keywords)) {
    return keywords.join(", ");
  }

  if (typeof keywords === "string" && keywords.trim()) {
    return keywords;
  }

  return DEFAULT_SEO_KEYWORDS.join(", ");
}

export function buildBlogPostMetadata(input: BlogSeoInput): SeoMetaInput {
  const articleUrl = toAbsoluteUrl(`/blog/${input.slug}`);

  return {
    title: input.title,
    description: input.excerpt,
    path: `/blog/${input.slug}`,
    type: "article",
    image: input.image || SEO_SITE.defaultImage,
    author: input.author || SEO_SITE.defaultAuthor,
    publishedTime: input.publishedTime,
    modifiedTime: input.modifiedTime || input.publishedTime,
    keywords: [
      "finovert blog",
      "finance insights",
      "company updates",
      "technology insights",
      input.category || "finance",
    ],
    structuredData: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: input.title,
      description: input.excerpt,
      image: input.image || SEO_SITE.defaultImage,
      datePublished: input.publishedTime,
      dateModified: input.modifiedTime || input.publishedTime,
      author: {
        "@type": "Person",
        name: input.author || SEO_SITE.defaultAuthor,
      },
      publisher: {
        "@type": "Organization",
        name: SEO_SITE.name,
        url: SEO_SITE.baseUrl,
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": articleUrl,
      },
    },
  };
}
