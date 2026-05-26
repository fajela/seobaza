import type { Metadata } from "next";

const BASE = "https://seobaza.com.ua";

/**
 * Build Metadata for a static page so that `og:url` ALWAYS equals the canonical
 * URL. Both are derived from the same `path`, removing the class of bug where a
 * page sets `canonical` but inherits the homepage `og:url` from the root layout.
 *
 * Use for listing / utility pages. Detail pages (articles, news, authors, …)
 * build their own richer metadata but follow the same url===canonical rule.
 */
export function pageMeta(opts: {
  title: string;
  description: string;
  /** Absolute path beginning with "/" — e.g. "/tags" or "/sitemap-page/news". */
  path: string;
}): Metadata {
  const url = `${BASE}${opts.path}`;
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: "SEO BAZA",
      locale: "uk_UA",
      type: "website",
    },
  };
}
