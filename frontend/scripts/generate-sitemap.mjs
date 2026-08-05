import { readFileSync, writeFileSync } from "node:fs";
import path, { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendRoot = path.resolve(__dirname, "..");

const SITE_URL = (process.env.SITE_URL || "https://www.finovert.com").replace(/\/+$/, "");
const API_URL = (process.env.SITEMAP_API_URL || process.env.VITE_API_URL || "https://finovert-web-1.onrender.com").replace(/\/+$/, "");
const OUTPUT_PATH = resolve(frontendRoot, "public", "sitemap.xml");
const SERVICES_DATA_PATH = resolve(frontendRoot, "src", "app", "data", "services-seo.ts");

const STATIC_ROUTES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.7" },
  { path: "/blog", changefreq: "daily", priority: "0.8" },
  { path: "/careers", changefreq: "weekly", priority: "0.7" },
  { path: "/contributors", changefreq: "monthly", priority: "0.5" },
  { path: "/verify", changefreq: "monthly", priority: "0.5" },
  { path: "/privacy", changefreq: "yearly", priority: "0.4" },
  { path: "/services", changefreq: "weekly", priority: "0.9" },
];

/** Read service slugs from the services-seo.ts data file. */
function readServiceSlugs() {
  try {
    const source = readFileSync(SERVICES_DATA_PATH, "utf8");
    const slugs = [...source.matchAll(/^\s*slug:\s*"([^"]+)"/gm)].map((m) => m[1]);
    return [...new Set(slugs)];
  } catch (error) {
    console.warn(`[sitemap] Could not read service slugs: ${error.message}`);
    return [];
  }
}

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
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000); // 10s max
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) {
      throw new Error(`Failed to fetch blogs for sitemap: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } finally {
    clearTimeout(timeoutId);
  }
}

function buildSitemapXml(blogs, serviceSlugs) {
  const now = toIsoDate();

  const staticEntries = STATIC_ROUTES.map((route) =>
    renderUrlTag({
      loc: `${SITE_URL}${route.path}`,
      lastmod: now,
      changefreq: route.changefreq,
      priority: route.priority,
    }),
  );

  const serviceEntries = serviceSlugs.map((slug) =>
    renderUrlTag({
      loc: `${SITE_URL}/services/${slug}`,
      lastmod: now,
      changefreq: "monthly",
      priority: "0.8",
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
    ...serviceEntries,
    ...blogEntries,
    "</urlset>",
    "",
  ].join("\n");
}

async function run() {
  const serviceSlugs = readServiceSlugs();
  let blogs = [];
  try {
    blogs = await fetchBlogs();
  } catch (error) {
    // Blog fetch failure should not block sitemap generation for static + service routes.
    console.warn(`[sitemap] Blog fetch failed (${error.message}); generating sitemap without blog routes.`);
  }

  try {
    const xml = buildSitemapXml(blogs, serviceSlugs);
    writeFileSync(OUTPUT_PATH, xml, "utf8");
    console.log(
      `[sitemap] Generated ${OUTPUT_PATH} with ${STATIC_ROUTES.length} static, ${serviceSlugs.length} service, and ${blogs.length} blog routes.`,
    );
  } catch (error) {
    console.error(`[sitemap] ${error.message}`);
    process.exitCode = 1;
  }
}

run();
