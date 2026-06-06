export const SEO_SITE = {
  name: "Finovert",
  tagline: "Corporate Services & Compliance Platform",
  baseUrl: (import.meta.env.VITE_SITE_URL || "https://www.finovert.com").replace(/\/+$/, ""),
  defaultImage: "https://www.finovert.com/app-logo.png",
  logoUrl: "https://www.finovert.com/app-logo.png",
  defaultAuthor: "Finovert Team",
  email: "Fintaxcoach@gmail.com",
  phone: "+91-9153832948",
  linkedIn: "https://www.linkedin.com/company/finovert",
};

export const HOME_PAGE_TITLE = `${SEO_SITE.name} - ${SEO_SITE.tagline}`;

export const HOME_PAGE_DESCRIPTION =
  "India compliance, automated. Stay compliant with GST filing, income tax returns, ROC compliance, and annual filings for startups and SMEs — with expert support, virtual CFO services, and smart finance workflows.";

export const DEFAULT_SEO_KEYWORDS = [
  "finovert",
  "corporate services india",
  "business compliance platform",
  "gst filing india",
  "income tax return filing",
  "roc compliance",
  "startup finance",
  "virtual cfo india",
  "company registration india",
  "annual compliance filing",
];

export const SITE_NAV_LINKS = [
  { name: "Contact Us", path: "/#contact", description: "Get in touch with Finovert for finance and compliance support." },
  { name: "Careers", path: "/careers", description: "Join the Finovert team and build the future of finance." },
  { name: "About", path: "/about", description: "Learn about Finovert's mission, team, and compliance expertise." },
  { name: "Services", path: "/#services", description: "GST filing, ITR filing, company registration, and CFO services." },
  { name: "Finance Guides", path: "/finance-guides", description: "Expert guides on tax, compliance, and startup finance." },
  { name: "Blog", path: "/blog", description: "Latest insights on finance, tax, and compliance for businesses." },
] as const;

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

export function buildOrganizationSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SEO_SITE.baseUrl}/#organization`,
    name: SEO_SITE.name,
    alternateName: "Finovert Finance",
    url: SEO_SITE.baseUrl,
    logo: {
      "@type": "ImageObject",
      url: SEO_SITE.logoUrl,
      width: 512,
      height: 512,
    },
    image: SEO_SITE.defaultImage,
    description: HOME_PAGE_DESCRIPTION,
    email: SEO_SITE.email,
    telephone: SEO_SITE.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "335, 3rd Floor, Vardhman Sunrize Plaza, Vashundhara Enclave",
      addressLocality: "New Delhi",
      postalCode: "110096",
      addressCountry: "IN",
    },
    sameAs: [SEO_SITE.linkedIn],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SEO_SITE.phone,
      contactType: "customer support",
      email: SEO_SITE.email,
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
  };
}

export function buildWebSiteSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SEO_SITE.baseUrl}/#website`,
    url: SEO_SITE.baseUrl,
    name: SEO_SITE.name,
    alternateName: SEO_SITE.tagline,
    description: HOME_PAGE_DESCRIPTION,
    publisher: { "@id": `${SEO_SITE.baseUrl}/#organization` },
    inLanguage: "en-IN",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SEO_SITE.baseUrl}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildProfessionalServiceSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SEO_SITE.baseUrl}/#service`,
    name: SEO_SITE.name,
    url: SEO_SITE.baseUrl,
    image: SEO_SITE.defaultImage,
    description: HOME_PAGE_DESCRIPTION,
    priceRange: "$$",
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    serviceType: [
      "GST Filing",
      "Income Tax Return Filing",
      "Company Registration",
      "ROC Compliance",
      "Virtual CFO Services",
      "Business Compliance",
    ],
    provider: { "@id": `${SEO_SITE.baseUrl}/#organization` },
  };
}

export function buildSiteNavigationSchemas(): JsonLd[] {
  return SITE_NAV_LINKS.map((link) => ({
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: link.name,
    description: link.description,
    url: toAbsoluteUrl(link.path),
  }));
}

export function buildHomePageStructuredData(faqSchema?: JsonLd): JsonLd[] {
  const schemas: JsonLd[] = [
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    buildProfessionalServiceSchema(),
    ...buildSiteNavigationSchemas(),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${SEO_SITE.baseUrl}/#webpage`,
      url: SEO_SITE.baseUrl,
      name: HOME_PAGE_TITLE,
      description: HOME_PAGE_DESCRIPTION,
      isPartOf: { "@id": `${SEO_SITE.baseUrl}/#website` },
      about: { "@id": `${SEO_SITE.baseUrl}/#organization` },
      primaryImageOfPage: SEO_SITE.defaultImage,
      inLanguage: "en-IN",
    },
  ];

  if (faqSchema) {
    schemas.push(faqSchema);
  }

  return schemas;
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
