/**
 * Optionally pings Google Search Console after a successful sitemap generation.
 *
 * This script NEVER fails the build — it is informational only.
 * The Google ping endpoint is deprecated; rely on Google Search Console
 * and robots.txt for long-term sitemap discovery.
 */
const SITE_URL = (process.env.SITE_URL || "https://www.finovert.com").replace(/\/+$/, "");
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;
const PING_URL = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;

async function run() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8_000);
    const res = await fetch(PING_URL, { signal: controller.signal });
    clearTimeout(timeoutId);
    const body = await res.text();

    if (res.ok) {
      console.log(`[sitemap:ping] Submitted sitemap to Google: ${SITEMAP_URL}`);
      return;
    }

    const combinedMessage = `${res.status} ${res.statusText} ${body}`.toLowerCase();
    if (combinedMessage.includes("deprecated") || combinedMessage.includes("not found")) {
      console.warn(
        "[sitemap:ping] Google sitemap ping endpoint is deprecated. " +
        "Use Google Search Console for sitemap discovery.",
      );
      console.warn(`[sitemap:ping] Sitemap URL: ${SITEMAP_URL}`);
      return;
    }

    // Log failure as warning — never block the build
    console.warn(`[sitemap:ping] Non-OK response: ${res.status} ${res.statusText}`);
  } catch (error) {
    // Network errors, timeouts, and other failures are warnings only
    console.warn(`[sitemap:ping] Skipped (${error.message})`);
  }
}

run();
