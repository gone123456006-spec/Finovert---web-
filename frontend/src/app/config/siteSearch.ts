export type SiteSearchItem = {
  title: string;
  href: string;
  category: string;
  keywords?: string[];
};

/** Pages and site sections searchable from the navbar. */
export const SITE_SEARCH_INDEX: SiteSearchItem[] = [
  { title: "Home", href: "/", category: "Page", keywords: ["finovert", "homepage"] },
  {
    title: "Company Registration Online",
    href: "/#company-registration",
    category: "Service",
    keywords: ["pvt ltd", "private limited", "llp", "opc", "incorporate", "mca", "startup registration"],
  },
  {
    title: "Special Services",
    href: "/#services",
    category: "Section",
    keywords: ["gst", "itr", "tds", "invoice", "accounting"],
  },
  { title: "Why Finovert", href: "/#why-finovert", category: "Section", keywords: ["about", "choose"] },
  { title: "About Us", href: "/about", category: "Page", keywords: ["company", "mission", "team"] },
  { title: "Blog", href: "/blog", category: "Page", keywords: ["articles", "guides", "insights"] },
  { title: "Finance Guides", href: "/finance-guides", category: "Page", keywords: ["tax", "compliance", "guide"] },
  { title: "My App", href: "/my-app", category: "Page", keywords: ["application", "dashboard"] },
  { title: "Join Our Team", href: "/careers", category: "Page", keywords: ["careers", "jobs", "hiring"] },
  { title: "Book Consultation", href: "/book-consultation", category: "Page", keywords: ["inquiry", "expert", "talk"] },
  { title: "ID Verification", href: "/verify", category: "Page", keywords: ["verify", "portal"] },
  { title: "Contributors", href: "/contributors", category: "Page" },
  { title: "Privacy Policy", href: "/privacy", category: "Page" },
  { title: "Contact", href: "/#contact", category: "Page", keywords: ["support", "help"] },
];

function resolveServiceHref(name: string, fallback: string) {
  const n = name.toLowerCase();
  if (
    n.includes("company") ||
    n.includes("llp") ||
    n.includes("opc") ||
    n.includes("partnership") ||
    n.includes("proprietorship") ||
    n.includes("startup") ||
    n.includes("nidhi") ||
    n.includes("subsidiary") ||
    n.includes("registration") ||
    n.includes("incorporation") ||
    n.includes("section 8") ||
    n.includes("trust") ||
    n.includes("society")
  ) {
    return "/#company-registration";
  }
  if (
    n.includes("gst") ||
    n.includes("itr") ||
    n.includes("tds") ||
    n.includes("accounting") ||
    n.includes("bookkeeping") ||
    n.includes("cfo") ||
    n.includes("trademark") ||
    n.includes("roc")
  ) {
    return "/#services";
  }
  return fallback;
}

export function buildServiceSearchItems(
  menus: Record<string, { name: string; links: { name: string; href: string }[] }[]>,
): SiteSearchItem[] {
  const items: SiteSearchItem[] = [];
  const seen = new Set<string>();

  for (const [menuName, categories] of Object.entries(menus)) {
    for (const category of categories) {
      for (const link of category.links) {
        const key = link.name.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        items.push({
          title: link.name,
          href: resolveServiceHref(link.name, link.href),
          category: category.name || menuName,
          keywords: [menuName.toLowerCase(), category.name.toLowerCase()],
        });
      }
    }
  }

  return items;
}

export function searchSiteContent(query: string, extra: SiteSearchItem[] = [], limit = 8): SiteSearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const pool = [...SITE_SEARCH_INDEX, ...extra];
  const scored = pool
    .map((item) => {
      const title = item.title.toLowerCase();
      const category = item.category.toLowerCase();
      const keywords = (item.keywords ?? []).join(" ").toLowerCase();
      let score = 0;
      if (title === q) score += 100;
      else if (title.startsWith(q)) score += 80;
      else if (title.includes(q)) score += 60;
      if (category.includes(q)) score += 25;
      if (keywords.includes(q)) score += 40;
      const tokens = q.split(/\s+/).filter(Boolean);
      if (tokens.length > 1 && tokens.every((t) => title.includes(t) || keywords.includes(t) || category.includes(t))) {
        score += 35;
      }
      return { item, score };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score);

  const seen = new Set<string>();
  const results: SiteSearchItem[] = [];
  for (const row of scored) {
    const key = `${row.item.title}|${row.item.href}`;
    if (seen.has(key)) continue;
    seen.add(key);
    results.push(row.item);
    if (results.length >= limit) break;
  }
  return results;
}
