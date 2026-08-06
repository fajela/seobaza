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
  /** Language of the page. Ukrainian unless stated. */
  locale?: "uk" | "en";
  /**
   * Path of the same page in the other language — e.g. "/en/terms" from
   * "/terms". Adds reciprocal hreflang alternates; x-default is always the
   * Ukrainian version (the primary one).
   */
  altPath?: string;
}): Metadata {
  const url = `${BASE}${opts.path}`;
  const locale = opts.locale ?? "uk";
  let languages: Record<string, string> | undefined;
  if (opts.altPath) {
    const altUrl = `${BASE}${opts.altPath}`;
    const ukUrl = locale === "uk" ? url : altUrl;
    const enUrl = locale === "en" ? url : altUrl;
    languages = { uk: ukUrl, en: enUrl, "x-default": ukUrl };
  }
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url, ...(languages ? { languages } : {}) },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: "SEO BAZA",
      locale: locale === "en" ? "en_US" : "uk_UA",
      ...(opts.altPath
        ? { alternateLocale: locale === "en" ? "uk_UA" : "en_US" }
        : {}),
      type: "website",
    },
  };
}
