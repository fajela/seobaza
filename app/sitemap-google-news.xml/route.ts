import { buildGoogleNews, entriesToNewsUrlset } from "@/lib/sitemap-data";

// Google News sitemap — only articles from the last 48h, in the news: namespace.
// Recomputed on every build/deploy (new posts trigger a rebuild), so the window
// stays fresh without needing a dynamic server.
export function GET() {
  const xml = entriesToNewsUrlset(buildGoogleNews());
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
