const SITE_URL = (process.env.SITE_URL || "https://finovert.com").replace(/\/+$/, "");
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;
const PING_URL = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;

async function run() {
  try {
    const res = await fetch(PING_URL);
    const body = await res.text();

    if (res.ok) {
      console.log(`[sitemap:ping] Submitted sitemap to Google: ${SITEMAP_URL}`);
      return;
    }

    const combinedMessage = `${res.status} ${res.statusText} ${body}`.toLowerCase();
    if (combinedMessage.includes("deprecated")) {
      console.warn(
        "[sitemap:ping] Google sitemap ping endpoint is deprecated. " +
          "Use Google Search Console for sitemap discovery and rely on robots.txt + regular crawling.",
      );
      console.warn(`[sitemap:ping] Sitemap URL remains: ${SITEMAP_URL}`);
      return;
    }

    throw new Error(`Google ping failed: ${res.status} ${res.statusText}`);
  } catch (error) {
    console.error(`[sitemap:ping] ${error.message}`);
    process.exitCode = 1;
  }
}

run();
