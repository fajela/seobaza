/**
 * Sitemap URL builders — shared by all `app/sitemap-*.xml/route.ts` handlers.
 * Each function returns `Entry[]`, which the route handler serializes to XML.
 */
import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { getAllArticles, getAllTagSlugs } from "./articles";
import { getAllNews, getNewsYears, getMonthsForYear } from "./news";
import { getAllAuthors } from "./authors";
import { CATEGORIES } from "./taxonomy";

export const BASE = "https://seobaza.com.ua";

export interface Entry {
  url: string;
  lastModified?: Date;
  changeFrequency?:
    | "always" | "hourly" | "daily" | "weekly"
    | "monthly" | "yearly" | "never";
}

async function readContentDir(
  rel: string
): Promise<Array<{ slug: string; year?: string; date: string }>> {
  const dir = path.join(process.cwd(), "content", rel);
  const out: Array<{ slug: string; year?: string; date: string }> = [];
  try {
    const entries = await fs.readdir(dir);
    for (const entry of entries) {
      const sub = path.join(dir, entry);
      const stat = await fs.stat(sub);
      if (stat.isDirectory()) {
        const files = await fs.readdir(sub);
        for (const f of files.filter((x) => x.endsWith(".mdx"))) {
          const filePath = path.join(sub, f);
          const c = await fs.readFile(filePath, "utf8");
          const { data } = matter(c);
          out.push({
            slug: f.replace(".mdx", ""),
            year: entry,
            // Empty string when frontmatter date missing — caller will decide what to do
          // instead of silently bumping lastmod on every rebuild.
          date: data.date || "",
          });
        }
      } else if (entry.endsWith(".mdx")) {
        const c = await fs.readFile(sub, "utf8");
        const { data } = matter(c);
        out.push({
          slug: entry.replace(".mdx", ""),
          // Empty string when frontmatter date missing — caller will decide what to do
          // instead of silently bumping lastmod on every rebuild.
          date: data.date || "",
        });
      }
    }
  } catch {
    /* dir missing — ignore */
  }
  return out;
}

export async function buildPages(): Promise<Entry[]> {
  const now = new Date();
  const events = await readContentDir("events");
  const tests = await readContentDir("tests");
  const authors = getAllAuthors();

  const staticPages: Entry[] = [
    { url: BASE,                              lastModified: now, changeFrequency: "weekly" },
    { url: `${BASE}/articles`,                lastModified: now, changeFrequency: "weekly" },
    { url: `${BASE}/news`,                    lastModified: now, changeFrequency: "daily" },
    { url: `${BASE}/category`,                lastModified: now, changeFrequency: "weekly" },
    { url: `${BASE}/tags`,                    lastModified: now, changeFrequency: "weekly" },
    { url: `${BASE}/authors`,                 lastModified: now },
    { url: `${BASE}/events`,                  lastModified: now },
    { url: `${BASE}/test`,                    lastModified: now },
    { url: `${BASE}/knowledge-base`,          lastModified: now },
    { url: `${BASE}/about`,                   lastModified: now },
    { url: `${BASE}/contact`,                 lastModified: now },
    // /black-friday is a soft alias whose canonical points to /events/2025/black-friday-2025.
    // Don't list it in the sitemap — let the canonical do its job.
    { url: `${BASE}/sitemap-page`,            lastModified: now },
    { url: `${BASE}/sitemap-page/articles`,   lastModified: now },
    { url: `${BASE}/sitemap-page/news`,       lastModified: now },
    { url: `${BASE}/sitemap-page/digests`,    lastModified: now },
    { url: `${BASE}/sitemap-page/categories`, lastModified: now },
    { url: `${BASE}/sitemap-page/tags`,       lastModified: now },
    { url: `${BASE}/sitemap-page/authors`,    lastModified: now },
  ];

  const eventPages: Entry[] = events.map((e) => ({
    url: `${BASE}/events/${e.year}/${e.slug}`,
    lastModified: e.date ? new Date(e.date) : now,
  }));

  const testPages: Entry[] = tests.map((t) => ({
    url: `${BASE}/test/${t.slug}`,
    lastModified: t.date ? new Date(t.date) : now,
  }));

  const authorPages: Entry[] = authors.map((a) => ({
    url: `${BASE}/authors/${a.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
  }));

  return [...staticPages, ...eventPages, ...testPages, ...authorPages];
}

export function buildArticles(): Entry[] {
  return getAllArticles().map((a) => ({
    url: `${BASE}/articles/${a.slug}`,
    lastModified: new Date(a.date),
    changeFrequency: "monthly" as const,
  }));
}

export function buildNews(): Entry[] {
  return getAllNews()
    .filter((n) => n.type !== "digest")
    .map((n) => ({
      url: n.month
        ? `${BASE}/news/${n.year}/${n.month}/${n.slug}`
        : `${BASE}/news/${n.year}/${n.slug}`,
      lastModified: new Date(n.date),
      changeFrequency: "yearly" as const,
    }));
}

export function buildDigests(): Entry[] {
  const now = new Date();
  const yearPages: Entry[] = getNewsYears().map((y) => ({
    url: `${BASE}/news/${y}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
  }));
  // Month-archive pages: /news/[year]/[month]
  const monthPages: Entry[] = getNewsYears().flatMap((y) =>
    getMonthsForYear(y).map((m) => ({
      url: `${BASE}/news/${y}/${m}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
    }))
  );
  const digests: Entry[] = getAllNews()
    .filter((n) => n.type === "digest")
    .map((d) => ({
      // Digests now live as regular posts INSIDE the month folder:
      // /news/[year]/[month]/[slug]. Old pattern /news/[year]/[slug] no longer exists.
      url: d.month
        ? `${BASE}/news/${d.year}/${d.month}/${d.slug}`
        : `${BASE}/news/${d.year}/${d.slug}`,
      lastModified: new Date(d.date),
      changeFrequency: "monthly" as const,
    }));
  return [...yearPages, ...monthPages, ...digests];
}

export function buildTaxonomy(): Entry[] {
  const now = new Date();
  const categoryPages: Entry[] = CATEGORIES.map((c) => ({
    url: `${BASE}/category/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
  }));
  const tagPages: Entry[] = getAllTagSlugs().map((slug) => ({
    url: `${BASE}/tags/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
  }));
  return [...categoryPages, ...tagPages];
}

// ─── XML serialization ───────────────────────────────────────────────────────

export function entriesToUrlset(entries: Entry[]): string {
  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const items = entries
    .map((e) => {
      const parts = [`    <loc>${escape(e.url)}</loc>`];
      if (e.lastModified) {
        parts.push(`    <lastmod>${e.lastModified.toISOString()}</lastmod>`);
      }
      if (e.changeFrequency) {
        parts.push(`    <changefreq>${e.changeFrequency}</changefreq>`);
      }
      return `  <url>\n${parts.join("\n")}\n  </url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>`;
}

export function buildIndex(): string {
  const now = new Date().toISOString();
  const subs = [
    "sitemap-pages.xml",
    "sitemap-articles.xml",
    "sitemap-news.xml",
    "sitemap-digests.xml",
    "sitemap-taxonomy.xml",
  ];
  const items = subs
    .map(
      (s) => `  <sitemap>
    <loc>${BASE}/${s}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</sitemapindex>`;
}
