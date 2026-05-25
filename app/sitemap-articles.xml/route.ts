import { buildArticles, entriesToUrlset } from "@/lib/sitemap-data";

export function GET() {
  const xml = entriesToUrlset(buildArticles());
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
