import { buildPages, entriesToUrlset } from "@/lib/sitemap-data";

export async function GET() {
  const xml = entriesToUrlset(await buildPages());
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
