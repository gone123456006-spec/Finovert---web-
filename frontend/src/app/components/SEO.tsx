import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  type?: 'website' | 'article';
  image?: string;
  url?: string;
  author?: string;
  datePublished?: string;
  schemaType?: 'WebPage' | 'BlogPosting' | 'Organization';
}

export function SEO({
  title,
  description,
  keywords = 'finovert, fintech, finance, technology',
  type = 'website',
  image = 'https://finovert.com/default-og-image.jpg', // Replace with your actual default image URL
  url = typeof window !== 'undefined' ? window.location.href : '',
  author = 'Finovert Team',
  datePublished,
  schemaType = 'WebPage',
}: SEOProps) {
  useEffect(() => {
    // 1. Update Title
    document.title = `${title} | Finovert`;

    // 2. Helper function to update or create meta tags
    const setMetaTag = (attrName: string, attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard Meta Tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords);
    setMetaTag('name', 'author', author);

    // Open Graph (Facebook/LinkedIn/WhatsApp)
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:url', url);
    setMetaTag('property', 'og:image', image);
    setMetaTag('property', 'og:site_name', 'Finovert');

    // Twitter Cards
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', image);

    // 3. Schema.org JSON-LD (Rich Snippets for Google)
    let schemaObj: any = {
      "@context": "https://schema.org",
      "@type": schemaType,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": url
      },
      "headline": title,
      "description": description,
      "image": image,
      "publisher": {
        "@type": "Organization",
        "name": "Finovert",
        "logo": {
          "@type": "ImageObject",
          "url": "https://finovert.com/logo.png" // Replace with your actual logo URL
        }
      }
    };

    // Add specific schema properties if it's an article/blog post
    if (schemaType === 'BlogPosting') {
      schemaObj.author = {
        "@type": "Person",
        "name": author
      };
      if (datePublished) {
        schemaObj.datePublished = datePublished;
        schemaObj.dateModified = datePublished; // Or pass a separate dateModified if you track updates
      }
    }

    let schemaScript = document.querySelector('#seo-schema-script') as HTMLScriptElement;
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'seo-schema-script';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }
    schemaScript.text = JSON.stringify(schemaObj);

    // Cleanup function when component unmounts
    return () => {
      // Optional: You could clean up the meta tags here if you want a completely clean slate between routes,
      // but usually replacing the content on the next route is sufficient.
      if (document.head.contains(schemaScript)) {
        document.head.removeChild(schemaScript);
      }
    };
  }, [title, description, keywords, type, image, url, author, datePublished, schemaType]);

  return null; // This component doesn't render anything visible
}
