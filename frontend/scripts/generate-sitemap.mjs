import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const SITE_URL = (process.env.SITE_URL || "https://www.finovert.com").replace(/\/+$/, "");
const API_URL = (process.env.SITEMAP_API_URL || process.env.VITE_API_URL || "https://finovert-web-1.onrender.com").replace(/\/+$/, "");
const OUTPUT_PATH = resolve(process.cwd(), "public", "sitemap.xml");

const STATIC_ROUTES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.7" },
  { path: "/blog", changefreq: "daily", priority: "0.8" },
  { path: "/careers", changefreq: "weekly", priority: "0.7" },
  { path: "/contributors", changefreq: "monthly", priority: "0.5" },
  { path: "/verify", changefreq: "monthly", priority: "0.5" },
  { path: "/privacy", changefreq: "yearly", priority: "0.4" },
];

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function toIsoDate(value) {
  if (!value) return new Date().toISOString().slice(0, 10);
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  return d.toISOString().slice(0, 10);
}

function renderUrlTag({ loc, lastmod, changefreq, priority }) {
  return [
    "  <url>",
    `    <loc>${escapeXml(loc)}</loc>`,
    `    <lastmod>${escapeXml(lastmod)}</lastmod>`,
    `    <changefreq>${escapeXml(changefreq)}</changefreq>`,
    `    <priority>${escapeXml(priority)}</priority>`,
    "  </url>",
  ].join("\n");
}

async function fetchBlogs() {
  const url = `${API_URL}/api/blogs`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch blogs for sitemap: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

function buildSitemapXml(blogs) {
  const now = toIsoDate();

  const staticEntries = STATIC_ROUTES.map((route) =>
    renderUrlTag({
      loc: `${SITE_URL}${route.path}`,
      lastmod: now,
      changefreq: route.changefreq,
      priority: route.priority,
    }),
  );

  const blogEntries = blogs
    .filter((blog) => typeof blog?.slug === "string" && blog.slug.trim().length > 0)
    .map((blog) =>
      renderUrlTag({
        loc: `${SITE_URL}/blog/${blog.slug}`,
        lastmod: toIsoDate(blog.updatedAt || blog.createdAt),
        changefreq: "weekly",
        priority: "0.7",
      }),
    );

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...staticEntries,
    ...blogEntries,
    "</urlset>",
    "",
  ].join("\n");
}

async function run() {
  try {
    const blogs = await fetchBlogs();
    const xml = buildSitemapXml(blogs);
    writeFileSync(OUTPUT_PATH, xml, "utf8");
    console.log(`[sitemap] Generated ${OUTPUT_PATH} with ${blogs.length} blog routes.`);
  } catch (error) {
    console.error(`[sitemap] ${error.message}`);
    process.exitCode = 1;
  }
}

run();
