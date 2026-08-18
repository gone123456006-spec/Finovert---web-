import express from 'express';
import Blog from '../models/Blog.js';
import Parser from 'rss-parser';
import cron from 'node-cron';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { requireAuth } from '../middleware/auth.js';

const parser = new Parser({
  customFields: {
    item: [
      ['media:content',    'mediaContent',    { keepArray: false }],
      ['media:thumbnail',  'mediaThumbnail',  { keepArray: false }],
      ['enclosure',        'enclosure',       { keepArray: false }],
      ['content:encoded',  'contentEncoded',  { keepArray: false }],
    ],
  },
});

// ─── SEO Title Rewriting Engine ──────────────────────────────────────────────
// Implements: SEO Title Rewriting | Dynamic Heading Optimization
//             AI SEO Heading Generation | Duplicate Title Avoidance
// Target: 50–70 characters, high CTR, Google-friendly, no duplicate headings.

const TITLE_STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "for", "to", "of", "in", "on", "with",
  "from", "by", "at", "is", "are", "be", "this", "that", "these", "those",
  "your", "you", "how", "what", "why", "when", "best", "top", "its", "has",
  "have", "will", "was", "were", "can", "could", "do", "did", "not", "but",
  "after", "over", "all", "new", "two", "more", "crore", "lakh", "rs",
]);

// Each template receives: { topic, year }
// Templates are kept 50–70 chars when topic is ~25 chars.
const SEO_TITLE_TEMPLATES = [
  ({ topic, year }) => `Best ${topic} Strategies to Grow Faster in ${year}`,
  ({ topic, year }) => `Top ${topic} Tips for Beginners and Experts in ${year}`,
  ({ topic, year }) => `How to Use ${topic} Effectively: Complete Guide ${year}`,
  ({ topic, year }) => `Latest ${topic} Trends and Strategies in ${year}`,
  ({ topic, year }) => `Advanced ${topic} Guide to Rank Higher on Google ${year}`,
  ({ topic, year }) => `Complete Guide to ${topic} for Better Results in ${year}`,
  ({ topic, year }) => `${topic}: Top Strategies That Work in ${year}`,
  ({ topic, year }) => `How to Master ${topic} and Grow Your Business in ${year}`,
  ({ topic, year }) => `Best ${topic} Methods for Beginners in ${year}`,
  ({ topic, year }) => `Top ${topic} Insights and Strategies for ${year}`,
  ({ topic, year }) => `${topic} Strategies: Complete Beginner Guide for ${year}`,
  ({ topic, year }) => `Latest ${topic} Tips to Boost Growth in ${year}`,
];

function toSlug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function toTitleCase(value) {
  const alwaysLower = new Set(["and", "or", "to", "of", "in", "on", "for", "the", "a", "an"]);
  return value
    .split(" ")
    .filter(Boolean)
    .map((word, i) =>
      i === 0 || !alwaysLower.has(word.toLowerCase())
        ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        : word.toLowerCase()
    )
    .join(" ");
}

function normalizeHeadlineInput(rawTitle) {
  return (rawTitle || "")
    .replace(/\s+/g, " ")
    .replace(/\|.*$/g, "")
    .replace(/\(.*?\)/g, "")
    .replace(/[-–:]\s*(breaking|live|update[s]?|exclusive)[\s.]*$/i, "")
    .replace(/\brs\.?\s*[\d,]+\s*(crore|lakh|billion|million)?\b/gi, "")
    .trim();
}

function extractTopicKeywords(rawTitle) {
  const cleaned = normalizeHeadlineInput(rawTitle)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ");

  const words = cleaned
    .split(/\s+/)
    .filter((w) => w.length > 2 && !TITLE_STOP_WORDS.has(w));

  // Deduplicate while preserving order
  const seen = new Set();
  const unique = [];
  for (const w of words) {
    if (!seen.has(w)) { seen.add(w); unique.push(w); }
  }

  // Prefer 3 keywords; use 2 if 3 makes topic too long
  const keywords = unique.slice(0, 3);
  return keywords.length ? keywords : ["Business", "Growth"];
}

function buildTopicPhrase(rawTitle) {
  const keywords = extractTopicKeywords(rawTitle);
  const phrase = toTitleCase(keywords.join(" "));
  // Keep topic phrase within ~30 chars so total title stays 50–70 chars
  return phrase.length > 30 ? toTitleCase(keywords.slice(0, 2).join(" ")) : phrase;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildSeoHeading(rawTitle) {
  const topic = buildTopicPhrase(rawTitle);
  const year  = new Date().getFullYear();

  let title = pick(SEO_TITLE_TEMPLATES)({ topic, year });

  // Enforce 50–70 char sweet spot by trimming or padding with year if needed
  if (title.length > 70) {
    const shorterTopic = toTitleCase(extractTopicKeywords(rawTitle).slice(0, 2).join(" "));
    title = pick(SEO_TITLE_TEMPLATES)({ topic: shorterTopic, year });
  }

  return title.replace(/\s+/g, " ").trim();
}


async function buildUniqueSeoTitle(rawTitle) {
  const baseSeoHeading = buildSeoHeading(rawTitle);

  // Retry with a different template if exact title already exists in DB
  let candidate = baseSeoHeading;
  const year = new Date().getFullYear();
  const topic = buildTopicPhrase(rawTitle);
  let attempts = 0;

  while (await Blog.findOne({ title: candidate })) {
    attempts++;
    if (attempts <= SEO_TITLE_TEMPLATES.length) {
      candidate = SEO_TITLE_TEMPLATES[attempts % SEO_TITLE_TEMPLATES.length]({ topic, year });
    } else {
      // All templates exhausted — append a small unique suffix
      candidate = `${baseSeoHeading} (${attempts - SEO_TITLE_TEMPLATES.length + 1})`;
    }
  }

  return candidate;
}

async function createUniqueSlugFromTitle(title) {
  const base = toSlug(title).replace(/(^-|-$)+/g, '');
  let candidate = base;
  let counter = 2;

  // Ensure Mongo unique slug index is respected.
  // eslint-disable-next-line no-await-in-loop
  while (await Blog.findOne({ slug: candidate })) {
    candidate = `${base}-${counter}`;
    counter += 1;
  }

  return candidate;
}

// Extract the best available image URL from an RSS item
function extractImage(item) {
  // 1. media:content (most common in NDTV, Hindu, Al Jazeera)
  if (item.mediaContent && item.mediaContent.$) {
    const u = item.mediaContent.$.url;
    if (u && u.startsWith('http')) return u;
  }
  // 2. media:thumbnail
  if (item.mediaThumbnail && item.mediaThumbnail.$) {
    const u = item.mediaThumbnail.$.url;
    if (u && u.startsWith('http')) return u;
  }
  // 3. enclosure (used by many feeds)
  if (item.enclosure && item.enclosure.url && item.enclosure.url.startsWith('http')) {
    return item.enclosure.url;
  }
  // 4. Pull first <img> src from HTML content
  if (item.content) {
    const match = item.content.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (match && match[1] && match[1].startsWith('http')) return match[1];
  }
  return null; // No image found — will use category fallback
}

const router = express.Router();

// ─── Unique image pools per category ────────────────────────────────────────
const CATEGORY_IMAGES = {
  Finance: [
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&w=800&q=80",
  ],
  Technology: [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
  ],
  News: [
    "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1468779036391-52341f60b55d?auto=format&fit=crop&w=800&q=80",
  ],
};

// Track per-source image index so each article gets a different image
const imageIndexMap = {};
function getUniqueImage(category, sourceName) {
  const pool = CATEGORY_IMAGES[category] || CATEGORY_IMAGES.News;
  const key = `${category}_${sourceName}`;
  if (imageIndexMap[key] === undefined) imageIndexMap[key] = 0;
  const img = pool[imageIndexMap[key] % pool.length];
  imageIndexMap[key]++;
  return img;
}

// ─── News sources ────────────────────────────────────────────────────────────
const NEWS_SOURCES = [
  { name: "Moneycontrol", url: "https://www.moneycontrol.com/rss/latestnews.xml",          category: "Finance" },
  { name: "NDTV",         url: "https://feeds.feedburner.com/ndtvnews-top-stories",        category: "News" },
  { name: "The Hindu",    url: "https://www.thehindu.com/news/national/feeder/default.rss",category: "News" },
  { name: "Al Jazeera",  url: "https://www.aljazeera.com/xml/rss/all.xml",                category: "News" },
  { name: "TechCrunch",  url: "https://techcrunch.com/feed/",                             category: "Technology" },
];

// ─── Core automation function ────────────────────────────────────────────────
async function fetchAndSaveNews() {
  console.log("Running automated news fetcher from all sources...");
  let addedCount = 0;

  for (const source of NEWS_SOURCES) {
    try {
      const feed = await parser.parseURL(source.url);

      for (const item of feed.items.slice(0, 3)) {
        if (!item.title) continue;
        const finovertTitle = await buildUniqueSeoTitle(item.title);
        const existing = await Blog.findOne({
          $or: [
            { sourceLink: item.link || '' },
          ],
        });
        if (!existing) {
          const slug = await createUniqueSlugFromTitle(finovertTitle);

          // Prefer full article HTML from content:encoded, then item.content, then snippet
          const richContent  = item.contentEncoded || item.content || '';
          const cleanContent = richContent.replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s{2,}/g, ' ').trim();
          const cleanExcerpt = item.contentSnippet
            ? item.contentSnippet.substring(0, 200).replace(/<[^>]*>/g, '') + '...'
            : `Read the latest finance and business update, curated by Finovert.`;

          const blog = new Blog({
            title:      finovertTitle,
            slug,
            excerpt:    cleanExcerpt,
            content:    cleanContent || cleanExcerpt,
            category:   source.category,
            author:     "Finovert Team",
            image:      extractImage(item) || getUniqueImage(source.category, source.name),
            readTime:   '3 min read',
            sourceLink: item.link || '',
            sourceName: source.name,
          });
          await blog.save();
          addedCount++;
        }
      }
    } catch (err) {
      console.error(`Error fetching from ${source.name}:`, err.message);
    }
  }

  console.log(`Automated fetch complete. Added ${addedCount} articles.`);
  return addedCount;
}

// ─── Routes ──────────────────────────────────────────────────────────────────

// GET all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({}, { content: 0 }).sort({ createdAt: -1 }).lean();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single blog by slug
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE a blog
router.delete('/:id', requireAuth('main_admin', 'sub_admin'), async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE a blog
router.put('/:id', requireAuth('main_admin', 'sub_admin'), async (req, res) => {
  try {
    const { title, excerpt, content, category, author, image, readTime } = req.body;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    const blog = await Blog.findByIdAndUpdate(req.params.id, {
      title, slug, excerpt, content, category, author, image, readTime
    }, { new: true });
    
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new blog manually
router.post('/', requireAuth('main_admin', 'sub_admin'), async (req, res) => {
  try {
    const seoTitle = await buildUniqueSeoTitle(req.body.title);
    const blog = new Blog({
      title: seoTitle,
      slug: await createUniqueSlugFromTitle(seoTitle),
      excerpt: req.body.excerpt,
      content: req.body.content,
      category: req.body.category,
      author: req.body.author,
      image: req.body.image,
      readTime: req.body.readTime || '5 min read',
    });

    const newBlog = await blog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST — trigger fetch manually via admin button
router.post('/fetch-news', requireAuth('main_admin'), async (req, res) => {
  try {
    const addedCount = await fetchAndSaveNews();
    res.json({ message: `Successfully fetched and added ${addedCount} new articles to the blog.` });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch news", error: error.message });
  }
});

// POST — fix images for all existing blogs in DB
router.post('/fix-images', requireAuth('main_admin'), async (req, res) => {
  try {
    const allBlogs = await Blog.find({});
    for (let i = 0; i < allBlogs.length; i++) {
      const blog = allBlogs[i];
      const pool     = CATEGORY_IMAGES[blog.category] || CATEGORY_IMAGES.News;
      const newImage = pool[i % pool.length];
      await Blog.updateOne({ _id: blog._id }, { $set: { image: newImage } });
    }
    res.json({ message: `Updated images for ${allBlogs.length} blogs.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST — one-time cleanup: remove other-site source names from existing
// blog slugs/authors so only Finovert branding is ever shown or linked.
router.post('/fix-source-branding', requireAuth('main_admin'), async (req, res) => {
  try {
    const KNOWN_SOURCES = NEWS_SOURCES.map((s) => s.name);
    const blogs = await Blog.find({});
    let slugsFixed = 0;
    let authorsFixed = 0;

    for (const blog of blogs) {
      let changed = false;

      // Strip trailing "-<source-name>" (and optional "-<n>") suffix from slug.
      for (const sourceName of KNOWN_SOURCES) {
        const suffix = toSlug(sourceName);
        const pattern = new RegExp(`-${suffix}(-\\d+)?$`);
        if (pattern.test(blog.slug)) {
          let base = blog.slug.replace(pattern, '');
          let candidate = base;
          let counter = 2;
          // eslint-disable-next-line no-await-in-loop
          while (await Blog.findOne({ slug: candidate, _id: { $ne: blog._id } })) {
            candidate = `${base}-${counter}`;
            counter += 1;
          }
          blog.slug = candidate;
          changed = true;
          slugsFixed++;
          break;
        }
      }

      if (KNOWN_SOURCES.includes(blog.author)) {
        blog.author = 'Finovert Team';
        changed = true;
        authorsFixed++;
      }

      if (changed) {
        // eslint-disable-next-line no-await-in-loop
        await blog.save();
      }
    }

    res.json({ message: `Cleaned ${slugsFixed} slugs and ${authorsFixed} author fields.`, slugsFixed, authorsFixed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── Cron: auto-fetch every 5 minutes ────────────────────────────────────────
cron.schedule('*/5 * * * *', () => {
  console.log('Cron: auto-fetching latest news...');
  fetchAndSaveNews().catch(console.error);
});

// POST — scrape full article text from source URL and patch blog content
router.post('/scrape-full/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog || !blog.sourceLink) {
      return res.status(404).json({ message: 'Blog or source link not found' });
    }

    const response = await fetch(blog.sourceLink, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Finovert/1.0)' },
      timeout: 10000,
    });

    if (!response.ok) {
      return res.status(502).json({ message: 'Could not fetch original article' });
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove noise elements
    $('script, style, nav, header, footer, .ad, .advertisement, .related, .sidebar, iframe, form').remove();

    // Extract meaningful article text — try common article containers first
    const selectors = [
      'article',
      '[class*="article-body"]',
      '[class*="story-body"]',
      '[class*="post-content"]',
      '[class*="entry-content"]',
      '.content-wrapper',
      'main',
    ];

    let fullText = '';
    for (const sel of selectors) {
      const el = $(sel);
      if (el.length) {
        fullText = el
          .find('p')
          .map((_, p) => $(p).text().trim())
          .get()
          .filter(t => t.length > 40)
          .join('\n\n');
        if (fullText.length > 200) break;
      }
    }

    // Fallback: all <p> tags on page
    if (!fullText || fullText.length < 100) {
      fullText = $('p')
        .map((_, p) => $(p).text().trim())
        .get()
        .filter(t => t.length > 40)
        .join('\n\n');
    }

    if (fullText && fullText.length > 100) {
      await Blog.updateOne({ _id: blog._id }, { $set: { content: fullText } });
      return res.json({ message: 'Content updated successfully', preview: fullText.substring(0, 200) });
    }

    return res.status(422).json({ message: 'Could not extract meaningful content from page' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
