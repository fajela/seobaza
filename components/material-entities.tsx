import Link from "next/link";
import { getTaggedMaterials, resolveEntityRef } from "@/lib/kg-entities";

const BASE = "https://seobaza.com.ua";

/**
 * Links from a material to the knowledge-graph pages of everything it is tagged
 * with (entities: frontmatter). Only entities with a live page are shown: a
 * published hub or a public person profile. Each chip is also a microdata
 * `mentions` of the enclosing article, pointing at the entity's itemID, so the
 * block must sit inside the article's itemScope. Pages whose article has no
 * microdata scope (videos, events use JSON-LD) pass microdata={false}.
 */
export function MaterialEntities({ url, microdata = true }: { url: string; microdata?: boolean }) {
  const material = getTaggedMaterials().find((m) => m.url === url);
  if (!material) return null;
  const refs = material.entities.map(resolveEntityRef).filter((r) => r.href);
  if (refs.length === 0) return null;

  return (
    <aside className="mt-10 pt-6 border-t border-border">
      <h2 className="text-sm font-semibold text-muted-foreground mb-3">Люди й теми в графі знань</h2>
      <div className="flex flex-wrap gap-2">
        {refs.map((r) => {
          const isPerson = /^sb\d{4}$/.test(r.id);
          return (
            <span
              key={r.id}
              {...(microdata
                ? {
                    itemProp: "mentions",
                    itemScope: true,
                    itemType: isPerson ? "https://schema.org/Person" : "https://schema.org/Thing",
                    itemID: `${BASE}${r.href}#${isPerson ? "person" : "entity"}`,
                  }
                : {})}
            >
              {microdata && <link itemProp="url" href={`${BASE}${r.href}`} />}
              <Link
                href={r.href!}
                className="inline-block px-3 py-1 text-sm bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
              >
                {microdata ? <span itemProp="name">{r.name}</span> : r.name}
              </Link>
            </span>
          );
        })}
      </div>
    </aside>
  );
}
