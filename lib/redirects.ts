/**
 * Single source of truth for permanent redirects.
 *
 * Imported by BOTH next.config.ts (to actually serve the 3xx) and
 * lib/sitemap-data.ts (to guarantee no redirecting URL ever ships in a sitemap).
 * A sitemap must list only canonical 200 URLs — a redirecting <loc> is an SEO
 * defect (Ahrefs "3XX redirect in sitemap", Search Console soft errors).
 *
 * Keep every literal redirect here. All `source` values must be exact paths
 * (no wildcards) so the sitemap filter below can match them.
 */
interface RedirectBase {
  source: string;
  destination: string;
}

/** 301 (permanent: true) або 308/307 (permanent: false). */
interface PermanentFlagRedirect extends RedirectBase {
  permanent: boolean;
}

/** Явний код, коли потрібен саме 302, а не 307. */
interface StatusCodeRedirect extends RedirectBase {
  statusCode: number;
}

export type Redirect = PermanentFlagRedirect | StatusCodeRedirect;

export const REDIRECTS: Redirect[] = [
  {
    // Гайди живуть у Базі знань, а не як категорія серед статей/новин.
    source: "/category/guides",
    destination: "/knowledge-base",
    permanent: true,
  },
  {
    source: "/news/2026/06/dmytro-bondar-boosta-pro-realnyi-stan-seo-1645",
    destination: "/news/2026/06/dmytro-bondar-boosta-pro-realnyi-stan-seo-1646",
    permanent: true,
  },
  {
    // Опубліковано з порожнім telegramMessageId → слаг без суфікса потрапив у
    // sitemap-news.xml і Google його побачив; згодом файл перейменували на -1652.
    source: "/news/2026/06/google-search-console-statystyka-v-ai-overviews-ta-ai-mode",
    destination: "/news/2026/06/google-search-console-statystyka-v-ai-overviews-ta-ai-mode-1652",
    permanent: true,
  },
  {
    // Reclassified from /articles to /news (it's a news item, NewsArticle schema).
    source: "/articles/google-pochav-indeksuvaty-profili-vydavtsiv-publisher-profiles",
    destination: "/news/2026/06/google-tykho-buduie-profili-vydavtsiv-i-vony-pochaly-potraplia-1660",
    permanent: true,
  },
  {
    // Convenience alias → evergreen Black Friday page. Server-side 308, so the
    // browser never renders /events/black-friday. Canonical lives on /black-friday.
    source: "/events/black-friday",
    destination: "/black-friday",
    permanent: true,
  },
  {
    // Jobs restructured to /jobs/[company]/[position-YYYY-MM] shortly after
    // launch; both earlier slug shapes were briefly live.
    source: "/jobs/seo-aeo-geo-specialist-whitelobby",
    destination: "/jobs/whitelobby/seo-aeo-geo-specialist-2026-07",
    permanent: true,
  },
  {
    source: "/jobs/whitelobby/seo-aeo-geo-specialist",
    destination: "/jobs/whitelobby/seo-aeo-geo-specialist-2026-07",
    permanent: true,
  },
  {
    // Тимчасово: медіакіт зараз тільки для відео. Коли зʼявиться загальний
    // медіакіт, він стане на цю адресу, а редірект прибираємо. Тому 302.
    source: "/sponsors/media-kit",
    destination: "/sponsors/media-kit-video",
    statusCode: 302,
  },
  {
    // Дубль у таксономії: частина матеріалів мала тег technical-seo замість
    // канонічного technical, тож сторінка тегу існувала й індексувалася.
    // Теги зведені до technical, стара сторінка більше не генерується.
    source: "/tags/technical-seo",
    destination: "/tags/technical",
    permanent: true,
  },
];

/** Exact redirect source paths — used to filter sitemap entries. */
export const REDIRECT_SOURCES: ReadonlySet<string> = new Set(
  REDIRECTS.map((r) => r.source)
);
