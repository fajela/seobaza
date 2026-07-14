import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  CATEGORIES,
  TAGS,
  getCategoryDisplayName,
  type CategorySlug,
  type ArticleType,
  type ArticleStatus,
  type CategoryMeta,
} from "./taxonomy";

const articlesDirectory = path.join(process.cwd(), "content/articles");
const draftsDirectory = path.join(process.cwd(), "content/drafts");

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ArticleMetadata {
  // Core (existing)
  title: string;
  h1?: string;
  description: string;
  image?: string;
  author: string;
  authorLink?: string;
  editor?: string;
  editorLink?: string;
  date: string;
  tags: string[];
  slug: string;
  // New
  category: CategorySlug;
  type: ArticleType;
  status?: ArticleStatus;
  featured?: boolean;
  // NOTE: sourceUrl usually holds an INTERNAL site path (rewritten by the
  // cross-reference pass), not the Telegram URL. For t.me links build from
  // telegramMessageId (https://telegram.me/SEOBAZA/{id}) — see <TelegramComments>.
  sourceUrl?: string;
  telegramMessageId?: number;
  // Computed (not in frontmatter)
  readingTime?: number;
}

export interface Article extends ArticleMetadata {
  content: string;
}

export interface TagWithCount {
  slug: string;
  displayName: string;
  count: number;
}

export interface CategoryWithCount extends CategoryMeta {
  count: number;
}

export interface RelatedArticle extends ArticleMetadata {
  sharedTagCount: number;
}

// ─── Reading time ─────────────────────────────────────────────────────────────

export function computeReadingTime(content: string): number {
  const stripped = content
    .replace(/```[\s\S]*?```/g, " ")              // fenced code blocks
    .replace(/`[^`]*`/g, " ")                      // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")         // images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")      // markdown links → keep visible text
    .replace(/https?:\/\/\S+/g, " ")              // bare URLs
    .replace(/<[^>]+>/g, " ")                      // HTML/JSX tags
    .replace(/&[#a-z0-9]+;/gi, " ")               // HTML entities (&#123; etc)
    .replace(/[#*_~>|!]/g, " ")                    // markdown syntax chars
    .replace(/\s+/g, " ")
    .trim();
  const wordCount = stripped.split(" ").filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

// ─── Core read helpers ────────────────────────────────────────────────────────

export function getArticleSlugs(includeDir?: string): string[] {
  const dir = includeDir ?? articlesDirectory;
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
}

export function getArticleBySlug(slug: string, dir?: string): Article {
  const realSlug = slug.replace(/\.mdx$/, "");
  const directory = dir ?? articlesDirectory;
  const fullPath = path.join(directory, `${realSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const readingTime = computeReadingTime(content);

  return {
    slug: realSlug,
    title: data.title,
    h1: data.h1,
    description: data.description ?? "",
    image: data.image,
    author: data.author ?? "SEO BAZA",
    authorLink: data.authorLink,
    editor: data.editor,
    editorLink: data.editorLink,
    date: data.date ? String(data.date) : new Date().toISOString().slice(0, 10),
    tags: data.tags ?? [],
    category: data.category ?? "community-and-news",
    type: data.type ?? "article",
    status: data.status,
    featured: data.featured ?? false,
    sourceUrl: data.sourceUrl,
    telegramMessageId: data.telegramMessageId,
    readingTime,
    content,
  };
}

// ─── Collection helpers ───────────────────────────────────────────────────────

/**
 * Returns all published articles sorted newest-first.
 * Pass includeDrafts=true to also include draft articles (e.g. for admin views).
 */
export function getAllArticles(includeDrafts = false): ArticleMetadata[] {
  const dirs: Array<{ dir: string }> = [{ dir: articlesDirectory }];
  if (includeDrafts && fs.existsSync(draftsDirectory)) {
    dirs.push({ dir: draftsDirectory });
  }

  const articles: Article[] = [];

  for (const { dir } of dirs) {
    const slugs = getArticleSlugs(dir);
    for (const slug of slugs) {
      try {
        const article = getArticleBySlug(slug, dir);
        if (!includeDrafts && article.status === "draft") continue;
        articles.push(article);
      } catch {
        // skip unreadable files
      }
    }
  }

  articles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Strip content before returning metadata
  return articles.map(({ content, ...metadata }) => metadata);
}

// ─── Filter helpers ───────────────────────────────────────────────────────────

export function getArticlesByTag(
  tagSlug: string,
  includeDrafts = false
): ArticleMetadata[] {
  return getAllArticles(includeDrafts).filter((a) =>
    a.tags.includes(tagSlug)
  );
}

export function getArticlesByCategory(
  categorySlug: CategorySlug,
  includeDrafts = false
): ArticleMetadata[] {
  return getAllArticles(includeDrafts).filter(
    (a) => a.category === categorySlug
  );
}

// ─── Aggregation helpers ──────────────────────────────────────────────────────

/** Collect tags from /articles AND individual /news posts. */
function collectTagSources(): Array<{ tags: string[] }> {
  const out: Array<{ tags: string[] }> = [];
  for (const a of getAllArticles()) out.push({ tags: a.tags ?? [] });

  // Also scan news individual posts (year/MM/slug.mdx) — read filesystem directly
  // to avoid a circular import with lib/news.ts.
  const newsBase = path.join(process.cwd(), "content/news");
  if (fs.existsSync(newsBase)) {
    const stack: string[] = [newsBase];
    while (stack.length) {
      const dir = stack.pop()!;
      for (const entry of fs.readdirSync(dir)) {
        const full = path.join(dir, entry);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          stack.push(full);
        } else if (entry.endsWith(".mdx")) {
          try {
            const raw = fs.readFileSync(full, "utf8");
            const { data } = matter(raw);
            if (data.type === "digest") continue; // skip digest aggregations
            if (Array.isArray(data.tags) && data.tags.length) {
              out.push({ tags: data.tags as string[] });
            }
          } catch {
            // skip
          }
        }
      }
    }
  }
  return out;
}

export function getAllTagsWithCounts(includeDrafts = false): TagWithCount[] {
  void includeDrafts;
  const sources = collectTagSources();
  const countMap = new Map<string, number>();

  for (const src of sources) {
    for (const tag of src.tags) {
      countMap.set(tag, (countMap.get(tag) ?? 0) + 1);
    }
  }

  const result: TagWithCount[] = [];
  for (const [slug, count] of countMap.entries()) {
    const meta = TAGS.find((t) => t.slug === slug);
    result.push({
      slug,
      displayName: meta?.displayName ?? slug,
      count,
    });
  }

  return result.sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug));
}

export function getAllTagSlugs(includeDrafts = false): string[] {
  void includeDrafts;
  const slugs = new Set<string>();
  for (const src of collectTagSources()) {
    for (const tag of src.tags) slugs.add(tag);
  }
  return Array.from(slugs);
}

export function getAllCategoriesWithCounts(
  includeDrafts = false
): CategoryWithCount[] {
  void includeDrafts;
  const countMap = new Map<string, number>();

  // Articles
  for (const article of getAllArticles()) {
    const cat = article.category;
    if (cat) countMap.set(cat, (countMap.get(cat) ?? 0) + 1);
  }

  // Individual news posts (skip digests + digest-only short items)
  const newsBase = path.join(process.cwd(), "content/news");
  if (fs.existsSync(newsBase)) {
    const stack: string[] = [newsBase];
    while (stack.length) {
      const dir = stack.pop()!;
      for (const entry of fs.readdirSync(dir)) {
        const full = path.join(dir, entry);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          stack.push(full);
        } else if (entry.endsWith(".mdx")) {
          try {
            const { data } = matter(fs.readFileSync(full, "utf8"));
            if (data.type === "digest") continue;
            const cat = data.category as string | undefined;
            if (cat) countMap.set(cat, (countMap.get(cat) ?? 0) + 1);
          } catch {
            // skip
          }
        }
      }
    }
  }

  return CATEGORIES.map((cat) => ({
    ...cat,
    count: countMap.get(cat.slug) ?? 0,
  }));
}

// ─── Related articles ─────────────────────────────────────────────────────────

export function getRelatedArticles(
  currentSlug: string,
  limit = 3
): RelatedArticle[] {
  const all = getAllArticles();
  const current = all.find((a) => a.slug === currentSlug);
  if (!current) return [];

  const currentTags = new Set(current.tags);

  const scored: RelatedArticle[] = all
    .filter((a) => a.slug !== currentSlug)
    .map((a) => ({
      ...a,
      sharedTagCount: a.tags.filter((t) => currentTags.has(t)).length,
    }))
    .filter((a) => a.sharedTagCount > 0)
    .sort((a, b) => b.sharedTagCount - a.sharedTagCount || new Date(b.date).getTime() - new Date(a.date).getTime());

  if (scored.length >= limit) return scored.slice(0, limit);

  // Pad with articles from same category if not enough tag matches
  const needed = limit - scored.length;
  const scoredSlugs = new Set(scored.map((a) => a.slug));
  const sameCat = all
    .filter(
      (a) =>
        a.slug !== currentSlug &&
        !scoredSlugs.has(a.slug) &&
        a.category === current.category
    )
    .slice(0, needed)
    .map((a) => ({ ...a, sharedTagCount: 0 }));

  return [...scored, ...sameCat];
}

// ─── Re-exports for convenience ───────────────────────────────────────────────
export { getCategoryDisplayName, CATEGORIES, TAGS };
