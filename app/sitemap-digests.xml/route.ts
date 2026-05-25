import { buildDigests, entriesToUrlset } from "@/lib/sitemap-data";

export function GET() {
  const xml = entriesToUrlset(buildDigests());
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
