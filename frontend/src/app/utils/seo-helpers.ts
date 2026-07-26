/**
 * SEO Helper Utilities for Enhanced Search Engine and AI Optimization
 * Provides reusable functions for structured data, FAQs, breadcrumbs, and more
 */

import { SEO_SITE, toAbsoluteUrl, type JsonLd } from "../config/seo";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BreadcrumbItem {
  name: string;
  url?: string;
}

export interface ServiceItem {
  name: string;
  description: string;
  category?: string;
}

/**
 * Build FAQ Schema for a page (enhances AI discoverability)
 */
export function buildFAQSchema(faqItems: FAQItem[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/**
 * Build BreadcrumbList Schema for navigation
 */
export function buildBreadcrumbSchema(items: BreadcrumbItem[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url ? toAbsoluteUrl(item.url) : undefined,
    })),
  };
}

/**
 * Build Service Schema for individual services
 */
export function buildServiceSchema(service: ServiceItem): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "Organization",
      name: SEO_SITE.name,
      url: SEO_SITE.baseUrl,
    },
    serviceType: service.category || "Business Services",
    areaServed: {
      "@type": "Country",
      name: "India",
    },
  };
}

/**
 * Build ContactPage Schema
 */
export function buildContactPageSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Finovert",
    description: "Get in touch with Finovert for finance and compliance support",
    url: toAbsoluteUrl("/#contact"),
    mainEntity: {
      "@type": "Organization",
      name: SEO_SITE.name,
      telephone: SEO_SITE.phone,
      email: SEO_SITE.email,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: SEO_SITE.phone,
        contactType: "customer support",
        email: SEO_SITE.email,
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
    },
  };
}

/**
 * Build Person Schema for team members
 */
export function buildPersonSchema(person: {
  name: string;
  role: string;
  bio: string;
  image?: string;
  linkedin?: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    jobTitle: person.role,
    description: person.bio,
    image: person.image,
    worksFor: {
      "@type": "Organization",
      name: SEO_SITE.name,
      url: SEO_SITE.baseUrl,
    },
    sameAs: person.linkedin ? [person.linkedin] : undefined,
  };
}

/**
 * Build HowTo Schema for guide/tutorial pages
 */
export function buildHowToSchema(howTo: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string }>;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: howTo.name,
    description: howTo.description,
    step: howTo.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

/**
 * Build Review Schema for testimonials
 */
export function buildReviewSchema(review: {
  author: string;
  rating: number;
  reviewBody: string;
  datePublished?: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    author: {
      "@type": "Person",
      name: review.author,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.rating,
      bestRating: 5,
    },
    reviewBody: review.reviewBody,
    datePublished: review.datePublished,
    itemReviewed: {
      "@type": "Organization",
      name: SEO_SITE.name,
    },
  };
}

/**
 * Build JobPosting Schema for career pages
 */
export function buildJobPostingSchema(job: {
  title: string;
  description: string;
  datePosted?: string;
  employmentType?: string;
  location?: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.datePosted || new Date().toISOString(),
    employmentType: job.employmentType || "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: SEO_SITE.name,
      url: SEO_SITE.baseUrl,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location || "New Delhi",
        addressCountry: "IN",
      },
    },
  };
}

/**
 * Generate optimized meta description (AI-friendly)
 */
export function generateMetaDescription(
  content: string,
  maxLength: number = 160
): string {
  const cleaned = content.replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.substring(0, maxLength - 3) + "...";
}

/**
 * Generate optimized keywords from content
 */
export function extractKeywords(
  content: string,
  baseKeywords: string[] = []
): string[] {
  // Simple keyword extraction - can be enhanced with NLP
  const words = content
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 4);

  const uniqueWords = [...new Set(words)];
  return [...baseKeywords, ...uniqueWords.slice(0, 10)];
}

/**
 * Build LocalBusiness Schema (if applicable)
 */
export function buildLocalBusinessSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SEO_SITE.baseUrl}/#localbusiness`,
    name: SEO_SITE.name,
    image: SEO_SITE.defaultImage,
    telephone: SEO_SITE.phone,
    email: SEO_SITE.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "335, 3rd Floor, Vardhman Sunrize Plaza, Vashundhara Enclave",
      addressLocality: "New Delhi",
      postalCode: "110096",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 28.6448,
      longitude: 77.2928,
    },
    url: SEO_SITE.baseUrl,
    priceRange: "$$",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
  };
}

/**
 * Build Article Schema for blog posts
 */
export function buildArticleSchema(article: {
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  url: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.headline,
    description: article.description,
    image: article.image || SEO_SITE.defaultImage,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: SEO_SITE.name,
      logo: {
        "@type": "ImageObject",
        url: SEO_SITE.logoUrl,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.url,
    },
  };
}
