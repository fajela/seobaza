import Link from "next/link";
import {
  getEntityStats,
  getMaterialsForEntity,
  getMentionSnippet,
  materialsLabel,
  type EntityRef,
} from "@/lib/kg-entities";
import { UK_MONTH_GENITIVE } from "@/lib/months";

const BASE = "https://seobaza.com.ua";

export function ukDate(iso?: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${Number(d)} ${UK_MONTH_GENITIVE[m] ?? m} ${y}`;
}

export function EntityChips({ items, withCount = false }: { items: Array<EntityRef & { count?: number }>; withCount?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((r) => {
        const label = withCount && r.count ? `${r.name} · ${r.count}` : r.name;
        const cls = "px-3 py-1 text-sm rounded-full";
        return r.href ? (
          <Link key={r.id} href={r.href} className={`${cls} bg-primary/10 text-primary hover:bg-primary/20 transition-colors`}>
            {label}
          </Link>
        ) : (
          <span key={r.id} className={`${cls} bg-muted text-muted-foreground`}>
            {label}
          </span>
        );
      })}
    </div>
  );
}

/**
 * Everything the site has published about one entity (hub slug or person
 * sb-id): counts, period, co-occurring entities and people, and the full list
 * of materials by year. Must sit inside the entity's microdata scope: each
 * material is emitted as `subjectOf`.
 */
export function EntityMentions({ id, name }: { id: string; name: string }) {
  const materials = getMaterialsForEntity(id);
  if (materials.length === 0) return null;
  const stats = getEntityStats(id);

  const byYear = new Map<string, typeof materials>();
  for (const m of materials) {
    const y = m.date.slice(0, 4) || "Без дати";
    byYear.set(y, [...(byYear.get(y) ?? []), m]);
  }

  return (
    <>
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">{name} у матеріалах SEO Baza</h2>
        <p className="mb-4">
          {materialsLabel(stats.materialCount)}
          {stats.firstDate && stats.lastDate && stats.firstDate !== stats.lastDate
            ? `, з ${ukDate(stats.firstDate)} по ${ukDate(stats.lastDate)}`
            : stats.firstDate
              ? `, ${ukDate(stats.firstDate)}`
              : ""}
          .
        </p>
        {stats.byYear.length > 1 && (
          <ul className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground mb-6">
            {stats.byYear.map((y) => (
              <li key={y.year}>
                {y.year}: {y.count}
              </li>
            ))}
          </ul>
        )}
        {stats.coOccurring.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Найчастіше в одних матеріалах</h3>
            <EntityChips items={stats.coOccurring} withCount />
          </div>
        )}
        {stats.people.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Люди зі спільноти в цих матеріалах</h3>
            <EntityChips items={stats.people} withCount />
          </div>
        )}
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Усі матеріали</h2>
        {[...byYear.entries()].map(([year, items]) => (
          <div key={year} className="mb-6">
            <h3 className="font-semibold text-muted-foreground mb-2">{year}</h3>
            <ul className="divide-y divide-border">
              {items.map((m) => {
                const snippet = getMentionSnippet(m, id);
                return (
                  <li key={m.url} className="py-4 flex gap-4" itemProp="subjectOf" itemScope itemType="https://schema.org/CreativeWork">
                    <link itemProp="url" href={`${BASE}${m.url}`} />
                    <div className="flex-1 min-w-0">
                      <Link href={m.url} className="font-semibold hover:text-accent transition-colors">
                        <span itemProp="name">{m.title}</span>
                      </Link>
                      {snippet && (
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed" itemProp="abstract">
                          {snippet}
                        </p>
                      )}
                      {m.date && (
                        <time dateTime={m.date} itemProp="datePublished" className="block text-xs text-muted-foreground mt-2">
                          {ukDate(m.date)}
                        </time>
                      )}
                    </div>
                    {m.image && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={`/_next/image?url=${encodeURIComponent(m.image)}&w=256&q=75`}
                        alt=""
                        width={128}
                        height={67}
                        loading="lazy"
                        className="hidden sm:block w-32 h-[67px] object-cover rounded-md border border-border shrink-0"
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </section>
    </>
  );
}
