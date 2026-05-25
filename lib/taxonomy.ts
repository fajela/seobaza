export type CategorySlug =
  | "industry-news"
  | "seobaza-news"
  | "digests"
  | "guides"
  | "opinions";

export type ArticleType =
  | "article"
  | "news"
  | "digest"
  | "guide"
  | "case-study"
  | "opinion"
  | "interview";

export type ArticleStatus = "published" | "draft";

export interface CategoryMeta {
  slug: CategorySlug;
  displayName: string;
  description: string;
}

export interface TagMeta {
  slug: string;
  displayName: string;
}

// ─── Categories — 5 structural buckets ────────────────────────────────────────
// These describe WHAT KIND of content a post is, not what it's about.
// Topical labels live in TAGS below.

export const CATEGORIES: CategoryMeta[] = [
  {
    slug: "industry-news",
    displayName: "Новини індустрії",
    description:
      "Найновіші події зі світу SEO та пошукової оптимізації: оновлення Google, AI-функції, дослідження, реакції індустрії.",
  },
  {
    slug: "seobaza-news",
    displayName: "Новини SEO BAZA",
    description:
      "Анонси та підсумки заходів SEO BAZA: мітапи, SEO Charity, конференції, новини самої спільноти.",
  },
  {
    slug: "digests",
    displayName: "Дайджести",
    description:
      "Щомісячні підбірки SEO-новин від спільноти SEO BAZA — все найважливіше за місяць в одному місці.",
  },
  {
    slug: "guides",
    displayName: "Гайди",
    description:
      "Вічнозелені матеріали: розбори патентів Google, методології, покрокові інструкції, що залишаються актуальними.",
  },
  {
    slug: "opinions",
    displayName: "Думки",
    description:
      "Аналітичні матеріали, прогнози, особисті спостереження та глибокі розбори трендів від спільноти.",
  },
];

// ─── Tags — topical labels ───────────────────────────────────────────────────
// Multi-valued per post. Concept-first naming so brand renames don't break tags.

export const TAGS: TagMeta[] = [
  // AI / search
  { slug: "ai-search",         displayName: "AI-пошук" },
  { slug: "ai-content",        displayName: "AI-контент" },
  { slug: "ai-industry",       displayName: "AI-індустрія" },
  { slug: "llms",              displayName: "LLM" },

  // Algorithm updates (specific named updates)
  { slug: "core-update",       displayName: "Core Update" },
  { slug: "helpful-content",   displayName: "Helpful Content Update" },
  { slug: "spam-update",       displayName: "Spam Update" },

  // Tools
  { slug: "tools",             displayName: "Інструменти" },

  // Companies / platforms
  { slug: "google",            displayName: "Google" },

  // Technical (absorbs indexing, crawling, performance/CWV)
  { slug: "technical",         displayName: "Технічне" },
  { slug: "structured-data",   displayName: "Структуровані дані" },
  { slug: "redirects",         displayName: "Редиректи" },

  // Concepts
  { slug: "internal-linking",  displayName: "Внутрішня перелінковка" },
  { slug: "semantics",         displayName: "Семантика" },
  { slug: "serp",              displayName: "SERP" },
  { slug: "knowledge-graph",   displayName: "Граф знань" },
  { slug: "eeat",              displayName: "E-E-A-T" },

  // Strategy / verticals
  { slug: "link-building",     displayName: "Лінкбілдинг" },
  { slug: "local",             displayName: "Локальне" },
  { slug: "ecommerce",         displayName: "Ecommerce" },
  { slug: "international",     displayName: "Міжнародне" },
];

export function getCategoryMeta(slug: string): CategoryMeta | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getTagMeta(slug: string): TagMeta | undefined {
  return TAGS.find((t) => t.slug === slug);
}

/** Returns display name for a tag slug. Falls back to the slug itself if not found. */
export function getTagDisplayName(slug: string): string {
  return getTagMeta(slug)?.displayName ?? slug;
}

/** Returns display name for a category slug. Falls back to the slug itself if not found. */
export function getCategoryDisplayName(slug: string): string {
  return getCategoryMeta(slug)?.displayName ?? slug;
}
