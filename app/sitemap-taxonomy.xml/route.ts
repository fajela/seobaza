import { buildTaxonomy, entriesToUrlset } from "@/lib/sitemap-data";

export function GET() {
  const xml = entriesToUrlset(buildTaxonomy());
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
