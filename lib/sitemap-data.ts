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
import { getLatestDealsEvent } from "./events";
import { getAllJobs, jobPath } from "./jobs";
import { CATEGORIES } from "./taxonomy";
import { REDIRECT_SOURCES } from "./redirects";

export const BASE = "https://seobaza.com.ua";

/** Drop any entry whose path is a redirect source — a sitemap lists only 200 URLs. */
function dropRedirects<T extends { url: string }>(entries: T[]): T[] {
  return entries.filter((e) => !REDIRECT_SOURCES.has(e.url.replace(BASE, "")));
}

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
    { url: `${BASE}/jobs`,                    lastModified: now, changeFrequency: "weekly" },
    { url: `${BASE}/test`,                    lastModified: now },
    { url: `${BASE}/knowledge-base`,          lastModified: now },
    { url: `${BASE}/about`,                   lastModified: now },
    { url: `${BASE}/contact`,                 lastModified: now },
    { url: `${BASE}/transparency`,            lastModified: now, changeFrequency: "yearly" },
    { url: `${BASE}/privacy`,                 lastModified: now, changeFrequency: "yearly" },
    { url: `${BASE}/terms`,                   lastModified: now, changeFrequency: "yearly" },
    // /black-friday is the evergreen "general" Black Friday page and the canonical
    // target for the current year's archive page — so it belongs in the sitemap.
    { url: `${BASE}/black-friday`,            lastModified: now, changeFrequency: "yearly" },
    { url: `${BASE}/sitemap-page`,            lastModified: now },
    { url: `${BASE}/sitemap-page/articles`,   lastModified: now },
    { url: `${BASE}/sitemap-page/news`,       lastModified: now },
    { url: `${BASE}/sitemap-page/digests`,    lastModified: now },
    { url: `${BASE}/sitemap-page/categories`, lastModified: now },
    { url: `${BASE}/sitemap-page/tags`,       lastModified: now },
    { url: `${BASE}/sitemap-page/authors`,    lastModified: now },
  ];

  // The current year's Black Friday page canonicals to /black-friday, so keep it
  // out of the sitemap (don't advertise a non-canonical URL). Past years stay.
  const latestDeals = getLatestDealsEvent();
  const eventPages: Entry[] = events
    .filter(
      (e) =>
        !(latestDeals && e.year === latestDeals.year && e.slug === latestDeals.slug)
    )
    .map((e) => ({
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

  // Job pages stay in the sitemap after closing too — the page still exists
  // (it renders a "closed" notice and drops the JobPosting markup).
  const jobs = getAllJobs();
  const jobPages: Entry[] = jobs.map((j) => ({
    url: `${BASE}${jobPath(j)}`,
    lastModified: j.datePosted ? new Date(j.datePosted) : now,
  }));
  const jobCompanyPages: Entry[] = [...new Set(jobs.map((j) => j.companySlug))].map(
    (companySlug) => ({
      url: `${BASE}/jobs/${companySlug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
    })
  );
  jobPages.push(...jobCompanyPages);

  return [...staticPages, ...eventPages, ...jobPages, ...testPages, ...authorPages];
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

/**
 * Google News sitemap entries. Per Google's spec a News sitemap must contain
 * ONLY articles published in the last 2 days — older URLs are ignored. So this
 * is a separate file from the full `sitemap-news.xml` archive (which keeps every
 * news URL for regular indexing).
 */
export interface NewsSitemapEntry {
  url: string;
  title: string;
  publicationDate: string; // ISO 8601, with time when known
}

const NEWS_WINDOW_MS = 48 * 60 * 60 * 1000;
export const PUBLICATION_NAME = "SEO BAZA";
export const PUBLICATION_LANGUAGE = "uk";

export function buildGoogleNews(): NewsSitemapEntry[] {
  const now = Date.now();
  return getAllNews()
    .filter((n) => n.type !== "digest")
    .map((n) => ({ n, time: new Date(n.date).getTime() }))
    .filter(({ time }) => Number.isFinite(time) && now - time <= NEWS_WINDOW_MS)
    .map(({ n }) => ({
      url: n.month
        ? `${BASE}/news/${n.year}/${n.month}/${n.slug}`
        : `${BASE}/news/${n.year}/${n.slug}`,
      title: n.title,
      publicationDate: new Date(n.date).toISOString(),
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
  const items = dropRedirects(entries)
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

export function entriesToNewsUrlset(entries: NewsSitemapEntry[]): string {
  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const items = dropRedirects(entries)
    .map(
      (e) => `  <url>
    <loc>${escape(e.url)}</loc>
    <news:news>
      <news:publication>
        <news:name>${escape(PUBLICATION_NAME)}</news:name>
        <news:language>${PUBLICATION_LANGUAGE}</news:language>
      </news:publication>
      <news:publication_date>${e.publicationDate}</news:publication_date>
      <news:title>${escape(e.title)}</news:title>
    </news:news>
  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${items}
</urlset>`;
}

export function buildIndex(): string {
  const now = new Date().toISOString();
  const subs = [
    "sitemap-pages.xml",
    "sitemap-articles.xml",
    "sitemap-news.xml",
    "sitemap-google-news.xml",
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
