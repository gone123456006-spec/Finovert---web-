import { useEffect } from "react";
import {
  normalizeKeywords,
  SEO_SITE,
  toAbsoluteUrl,
  type JsonLd,
} from "../config/seo";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string | string[];
  type?: "website" | "article";
  image?: string;
  path?: string;
  canonicalUrl?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
  structuredData?: JsonLd | JsonLd[];
}

export function SEO({
  title,
  description,
  keywords,
  type = "website",
  image = SEO_SITE.defaultImage,
  path = "",
  canonicalUrl,
  author = SEO_SITE.defaultAuthor,
  publishedTime,
  modifiedTime,
  noindex = false,
  structuredData,
}: SEOProps) {
  useEffect(() => {
    document.title = title.includes(SEO_SITE.name) ? title : `${title} | ${SEO_SITE.name}`;
    const currentUrl = canonicalUrl || toAbsoluteUrl(path || window.location.pathname);
    const keywordContent = normalizeKeywords(keywords);

    const setMetaTag = (attrName: "name" | "property", attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    const setCanonical = (href: string) => {
      let link = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = href;
    };

    setMetaTag("name", "description", description);
    setMetaTag("name", "keywords", keywordContent);
    setMetaTag("name", "author", author);
    setMetaTag("name", "robots", noindex ? "noindex, nofollow" : "index, follow");

    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:type", type);
    setMetaTag("property", "og:url", currentUrl);
    setMetaTag("property", "og:image", image);
    setMetaTag("property", "og:site_name", SEO_SITE.name);
    setMetaTag("property", "og:locale", "en_IN");

    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:site", "@finovert");
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", image);

    if (type === "article") {
      if (publishedTime) {
        setMetaTag("property", "article:published_time", publishedTime);
      }
      if (modifiedTime) {
        setMetaTag("property", "article:modified_time", modifiedTime);
      }
      setMetaTag("property", "article:author", author);
    }

    setCanonical(currentUrl);

    document
      .querySelectorAll('script[type="application/ld+json"][data-seo="dynamic"]')
      .forEach((node) => node.remove());

    const defaultPageSchema: JsonLd = {
      "@context": "https://schema.org",
      "@type": type === "article" ? "Article" : "WebPage",
      name: title,
      description,
      url: currentUrl,
      image,
      author: {
        "@type": "Organization",
        name: SEO_SITE.name,
      },
    };

    const schemaPayloads = structuredData
      ? Array.isArray(structuredData)
        ? structuredData
        : [structuredData]
      : [defaultPageSchema];

    schemaPayloads.forEach((payload) => {
      const schemaScript = document.createElement("script");
      schemaScript.type = "application/ld+json";
      schemaScript.dataset.seo = "dynamic";
      schemaScript.text = JSON.stringify(payload);
      document.head.appendChild(schemaScript);
    });

    return () => {
      document
        .querySelectorAll('script[type="application/ld+json"][data-seo="dynamic"]')
        .forEach((node) => node.remove());
    };
  }, [
    title,
    description,
    keywords,
    type,
    image,
    path,
    canonicalUrl,
    author,
    publishedTime,
    modifiedTime,
    noindex,
    structuredData,
  ]);

  return null;
}
