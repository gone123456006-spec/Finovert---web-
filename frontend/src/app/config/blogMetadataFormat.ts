export interface BlogPageMetadata {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: string;
  image: string;
  publishedTime: string; // ISO format: 2026-05-06T10:30:00.000Z
  modifiedTime?: string; // ISO format
  readTime: string; // Example: "6 min read"
}

export const BLOG_METADATA_EXAMPLE: BlogPageMetadata = {
  title: "How Startups Can Improve Cash Flow in 2026",
  slug: "how-startups-can-improve-cash-flow-2026",
  excerpt:
    "A practical guide for founders to manage burn rate, improve receivables, and build predictable cash flow.",
  category: "Finance",
  author: "Finovert Team",
  image: "https://finovert.com/default-og-image.jpg",
  publishedTime: "2026-05-06T10:30:00.000Z",
  modifiedTime: "2026-05-06T10:30:00.000Z",
  readTime: "6 min read",
};
