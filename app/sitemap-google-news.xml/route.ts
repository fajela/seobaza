import { buildGoogleNews, entriesToNewsUrlset } from "@/lib/sitemap-data";

// Google News sitemap — recent articles in the news: namespace.
// Revalidated hourly so the time window slides between deploys instead of
// freezing (and emptying) at build time.
export const revalidate = 3600;

export function GET() {
  const xml = entriesToNewsUrlset(buildGoogleNews());
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
