import Link from "next/link";
import { getToolsForPerson, TOOL_CATEGORIES } from "@/lib/tools";
import { toolSectionId, TOOLS_BASE } from "@/lib/tools-types";
import { externalRel } from "@/lib/own-sites";

/** Блок на сторінці людини: інструменти з каталогу /kg/tool, які вона створила. */
export function KgPersonTools({ kgId }: { kgId: string }) {
  const tools = getToolsForPerson(kgId);
  if (!tools.length) return null;

  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold mb-4">Інструменти</h2>
      <ul className="grid gap-3">
        {tools.map((t) => {
          const cat = TOOL_CATEGORIES.find((c) => c.slug === t.category);
          return (
            <li key={t.url + t.name} className="bg-secondary/30 rounded-xl p-4 border border-border">
              {t.url.startsWith("/") ? (
                <Link href={t.url} className="font-medium hover:text-accent transition-colors">
                  {t.name}
                </Link>
              ) : (
                <a href={t.url} target="_blank" rel={externalRel(t.url)} className="font-medium hover:text-accent transition-colors">
                  {t.name}
                </a>
              )}
              {cat && (
                <span className="text-xs text-muted-foreground">
                  {" · "}
                  <Link
                    href={`${TOOLS_BASE}#${toolSectionId(cat.slug, t.section)}`}
                    className="hover:text-accent transition-colors"
                  >
                    у каталозі: {cat.name}, {t.section}
                  </Link>
                </span>
              )}
              {t.description && <p className="text-sm text-muted-foreground mt-1">{t.description}</p>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
