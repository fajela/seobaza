import Link from "next/link";
import { getCatalogLinksForConcept, getToolsForEntity, TOOL_CATEGORIES, UA_MARK_LABELS, type UaMark } from "@/lib/tools";
import { toolCategoryUrl } from "@/lib/tools-types";
import { externalRel } from "@/lib/own-sites";

/**
 * Блок на сторінці сутності графу: сервіси з каталогу /kg/tool, якими є ця сутність,
 * та українські позначки з джерелами.
 */
export function KgCatalogFacts({ slug }: { slug: string }) {
  const tools = getToolsForEntity(slug);
  const catalogLinks = getCatalogLinksForConcept(slug);
  if (!tools.length && !catalogLinks.length) return null;
  if (!tools.length)
    return (
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4">Інструменти в каталозі</h2>
        <ul className="flex flex-col gap-2">
          {catalogLinks.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-primary hover:text-accent transition-colors">
                {l.label}
              </Link>{" "}
              <span className="text-sm text-muted-foreground">{l.count}</span>
            </li>
          ))}
        </ul>
      </section>
    );

  const marks = new Map<UaMark, string>();
  for (const t of tools) {
    for (const m of t.ua ?? []) {
      const src = t.uaSources?.[m];
      if (src && !marks.has(m)) marks.set(m, src);
    }
  }

  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold mb-4">У каталозі сервісів</h2>
      <ul className="grid gap-3 mb-6">
        {tools.map((t) => {
          const cat = TOOL_CATEGORIES.find((c) => c.slug === t.category);
          return (
            <li key={t.url + t.name} className="bg-secondary/30 rounded-xl p-4 border border-border">
              <a href={t.url} target="_blank" rel={externalRel(t.url)} className="font-medium hover:text-accent transition-colors">
                {t.name}
              </a>
              {cat && (
                <span className="text-xs text-muted-foreground">
                  {" · "}
                  <Link href={toolCategoryUrl(cat.slug)} className="hover:text-accent transition-colors">
                    {cat.name}
                  </Link>
                  {` · ${t.section}`}
                </span>
              )}
              {t.description && <p className="text-sm text-muted-foreground mt-1">{t.description}</p>}
            </li>
          );
        })}
      </ul>
      {marks.size > 0 && (
        <ul className="flex flex-col gap-2 text-sm">
          {[...marks].map(([m, src]) => (
            <li key={m}>
              <span className="px-2 py-0.5 bg-accent/15 text-accent rounded-full text-xs font-medium mr-2">
                {m === "supports-ukraine" ? "💙💛" : "🇺🇦"} {UA_MARK_LABELS[m]}
              </span>
              {src.startsWith("http") && (
                <a href={src} target="_blank" rel="nofollow noopener" className="text-muted-foreground underline hover:text-accent">
                  джерело
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
