import { buildIndex } from "@/lib/sitemap-data";

/**
 * Sitemap index — references all sub-sitemaps. This is the URL search engines
 * crawl first to discover the rest. List it in robots.txt.
 */
export function GET() {
  return new Response(buildIndex(), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
