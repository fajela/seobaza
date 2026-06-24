import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { computeReadingTime } from "./articles";
import type { CategorySlug, ArticleType, ArticleStatus } from "./taxonomy";

const newsDirectory = path.join(process.cwd(), "content/news");

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NewsMetadata {
  slug: string;
  year: string;
  month?: string;  // "01"-"12" for individual posts; absent for digests
  title: string;
  h1?: string;
  description: string;
  author: string;
  authorLink?: string;
  coAuthor?: string; // optional second author (name must match a content/authors/*.mdx)
  date: string;
  // Date the article was last edited (YYYY-MM-DD or full ISO). Set manually in
  // frontmatter when a post is updated. Feeds NewsArticle `dateModified`; `date`
  // remains the original publish date.
  updatedAt?: string;
  tags: string[];
  category: CategorySlug;
  type: ArticleType;
  status?: ArticleStatus;
  readingTime?: number;
  itemCount?: number; // number of posts in a digest
  // NOTE: despite the name, sourceUrl usually holds an INTERNAL site path
  // (e.g. "/news/2026/04/slug-1564"), NOT the Telegram URL. The cross-reference
  // pass in telegram_to_mdx.py rewrites Telegram links to internal ones, and
  // sourceUrl gets rewritten too. Do NOT use it to link out to Telegram — build
  // the Telegram URL from telegramMessageId instead (https://t.me/SEOBAZA/{id}),
  // as <TelegramComments> does.
  sourceUrl?: string;
  telegramMessageId?: number; // Telegram message id — source of truth for t.me links
  image?: string; // first photo from Telegram, used as OG image
}

export interface NewsArticle extends NewsMetadata {
  content: string;
}

// ─── Directory helpers ────────────────────────────────────────────────────────

export function getNewsYears(): string[] {
  if (!fs.existsSync(newsDirectory)) return [];
  return fs
    .readdirSync(newsDirectory)
    .filter((f) =>
      fs.statSync(path.join(newsDirectory, f)).isDirectory()
    )
    .sort((a, b) => b.localeCompare(a)); // newest first
}

/**
 * Digest filenames live directly under `content/news/[year]/`. A digest is a
 * 2-digit month filename (e.g. `11.mdx` → /news/2022/11). Anything else at the
 * year root is ignored.
 */
export function getDigestSlugsForYear(year: string): string[] {
  const yearDir = path.join(newsDirectory, year);
  if (!fs.existsSync(yearDir)) return [];
  return fs
    .readdirSync(yearDir)
    .filter((f) => /^\d{2}\.mdx$/.test(f))
    .filter((f) => fs.statSync(path.join(yearDir, f)).isFile())
    .map((f) => f.replace(".mdx", ""));
}

/** Month subfolders under a year directory: ["01", "02", …]. */
export function getMonthsForYear(year: string): string[] {
  const yearDir = path.join(newsDirectory, year);
  if (!fs.existsSync(yearDir)) return [];
  return fs
    .readdirSync(yearDir)
    .filter((m) => /^\d{2}$/.test(m) && fs.statSync(path.join(yearDir, m)).isDirectory())
    .sort();
}

/** Individual-post slugs for a given year+month. */
export function getNewsSlugsForMonth(year: string, month: string): string[] {
  const dir = path.join(newsDirectory, year, month);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(".mdx", ""));
}

/** Back-compat shim — returns digest slugs only (individual posts now nest under month). */
export function getNewsSlugsForYear(year: string): string[] {
  return getDigestSlugsForYear(year);
}

// ─── Read helpers ─────────────────────────────────────────────────────────────

/**
 * Read a news item. Digest files live at content/news/[year]/[slug].mdx;
 * individual posts live at content/news/[year]/[month]/[slug].mdx.
 * When `month` is omitted, falls back to looking at the year-root (digest case).
 */
export function getNewsBySlug(year: string, slug: string, month?: string): NewsArticle {
  const fullPath = month
    ? path.join(newsDirectory, year, month, `${slug}.mdx`)
    : path.join(newsDirectory, year, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    year,
    month,
    title: data.title,
    h1: data.h1,
    description: data.description ?? "",
    author: data.author ?? "SEO BAZA",
    authorLink: data.authorLink,
    coAuthor: data.coAuthor,
    date: data.date ? String(data.date) : `${year}-01-01`,
    updatedAt: data.updatedAt ? String(data.updatedAt) : undefined,
    tags: data.tags ?? [],
    category: data.category ?? "community-and-news",
    type: data.type ?? "digest",
    status: data.status,
    itemCount: data.itemCount,
    sourceUrl: data.sourceUrl,
    telegramMessageId: data.telegramMessageId,
    image: data.image,
    readingTime: computeReadingTime(content),
    content,
  };
}

// ─── Collection helpers ───────────────────────────────────────────────────────

export function getAllNews(includeDrafts = false): NewsMetadata[] {
  const years = getNewsYears();
  const items: NewsArticle[] = [];

  for (const year of years) {
    // 1) Digests at year root
    for (const slug of getDigestSlugsForYear(year)) {
      try {
        const item = getNewsBySlug(year, slug);
        if (!includeDrafts && item.status === "draft") continue;
        items.push(item);
      } catch {
        // skip unreadable files
      }
    }
    // 2) Individual posts in year/MM/
    for (const month of getMonthsForYear(year)) {
      for (const slug of getNewsSlugsForMonth(year, month)) {
        try {
          const item = getNewsBySlug(year, slug, month);
          if (!includeDrafts && item.status === "draft") continue;
          items.push(item);
        } catch {
          // skip unreadable files
        }
      }
    }
  }

  return items
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(({ content, ...meta }) => meta);
}

export function getNewsByYear(
  year: string,
  includeDrafts = false
): NewsMetadata[] {
  return getAllNews(includeDrafts).filter((item) => item.year === year);
}

export function getNewsByAuthorName(
  authorName: string,
  includeDrafts = false
): NewsMetadata[] {
  const target = authorName.toLowerCase();
  return getAllNews(includeDrafts).filter(
    (item) =>
      item.author.toLowerCase() === target ||
      item.coAuthor?.toLowerCase() === target
  );
}

/** For digest route generateStaticParams — only year/slug shape (no month). */
export function getDigestPaths(): { year: string; slug: string }[] {
  const years = getNewsYears();
  const paths: { year: string; slug: string }[] = [];
  for (const year of years) {
    for (const slug of getDigestSlugsForYear(year)) {
      paths.push({ year, slug });
    }
  }
  return paths;
}

/** For individual post route — year/month/slug. */
export function getNewsPostPaths(): { year: string; month: string; slug: string }[] {
  const years = getNewsYears();
  const paths: { year: string; month: string; slug: string }[] = [];
  for (const year of years) {
    for (const month of getMonthsForYear(year)) {
      for (const slug of getNewsSlugsForMonth(year, month)) {
        paths.push({ year, month, slug });
      }
    }
  }
  return paths;
}

/** Back-compat: returns the union for callers that don't yet distinguish. */
export function getAllNewsPaths(): { year: string; slug: string }[] {
  return [
    ...getDigestPaths(),
    ...getNewsPostPaths().map(({ year, slug }) => ({ year, slug })),
  ];
}

export function getNewsByTag(
  tagSlug: string,
  includeDrafts = false
): NewsMetadata[] {
  return getAllNews(includeDrafts).filter((item) =>
    (item.tags ?? []).includes(tagSlug)
  );
}

/** Other individual news posts from the same year+month as the given post. */
export function getOtherPostsInSameMonth(
  year: string,
  month: string,
  excludeSlug: string,
  limit = 5
): NewsMetadata[] {
  return getAllNews()
    .filter(
      (n) =>
        n.year === year &&
        n.month === month &&
        n.slug !== excludeSlug &&
        n.type !== "digest"
    )
    .slice(0, limit);
}

export function getNewsByCategory(
  categorySlug: CategorySlug,
  includeDrafts = false
): NewsMetadata[] {
  return getAllNews(includeDrafts).filter(
    (item) => item.category === categorySlug
  );
}

/**
 * Find news posts related to a given one — scored by shared tag count,
 * padded by same-category posts if there aren't enough tag matches.
 * Digests are excluded from the candidate pool.
 */
export function getRelatedNews(
  currentSlug: string,
  limit = 3
): NewsMetadata[] {
  const all = getAllNews().filter((n) => n.type !== "digest");
  const current = all.find((n) => n.slug === currentSlug);
  if (!current) return [];

  const currentTags = new Set(current.tags ?? []);
  const currentTime = new Date(current.date).getTime();

  const scored = all
    .filter((n) => n.slug !== currentSlug)
    .map((n) => {
      const sharedTagCount = (n.tags ?? []).filter((t) =>
        currentTags.has(t)
      ).length;
      // Recency decay so old posts that happen to share every tag don't
      // outrank fresher, slightly-less-overlapping news. Half-weight at ~60
      // days from the current post's date.
      const ageDays =
        Math.abs(currentTime - new Date(n.date).getTime()) /
        (1000 * 60 * 60 * 24);
      return {
        item: n,
        sharedTagCount,
        score: sharedTagCount / (1 + ageDays / 60),
      };
    })
    .filter((s) => s.sharedTagCount > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        new Date(b.item.date).getTime() - new Date(a.item.date).getTime()
    );

  const picked: NewsMetadata[] = scored.slice(0, limit).map((s) => s.item);

  if (picked.length < limit) {
    const need = limit - picked.length;
    const used = new Set(picked.map((p) => p.slug));
    used.add(currentSlug);
    const sameCat = all
      .filter((n) => !used.has(n.slug) && n.category === current.category)
      .sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      .slice(0, need);
    picked.push(...sameCat);
  }

  return picked;
}
