"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { externalRel } from "@/lib/own-sites";
import { type Tool, type ToolCategory, type UaMark, UA_MARK_LABELS, toolSectionId } from "@/lib/tools-types";

type UaFilter = "all" | UaMark;

const UA_FILTERS: { key: UaFilter; label: string }[] = [
  { key: "all", label: "Усі" },
  { key: "in-ukraine", label: "🇺🇦 " + UA_MARK_LABELS["in-ukraine"] },
  { key: "founded-by-ukrainians", label: "🇺🇦 " + UA_MARK_LABELS["founded-by-ukrainians"] },
  { key: "supports-ukraine", label: "💙💛 " + UA_MARK_LABELS["supports-ukraine"] },
];

// Розділи за алфавітом; матеріали для читання і «Інше» йдуть наприкінці.
const TAIL_SECTIONS = ["Довідкові матеріали", "Почитати", "Почитати і подивитися", "Послухати", "Інше"];

function sectionRank(name: string): number {
  const i = TAIL_SECTIONS.indexOf(name);
  return i === -1 ? 0 : i + 1;
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function ToolCard({ tool, showReview, position }: { tool: Tool; showReview: boolean; position: number }) {
  const absUrl = tool.url.startsWith("/") ? `https://seobaza.com.ua${tool.url}` : tool.url;
  return (
    <li
      itemProp="itemListElement"
      itemScope
      itemType="https://schema.org/ListItem"
      className="bg-secondary/30 rounded-xl p-4 border border-border transition-colors hover:border-accent/50"
    >
      <meta itemProp="position" content={String(position)} />
      <meta itemProp="name" content={tool.name} />
      <link itemProp="url" href={absUrl} />
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        {tool.url.startsWith("/") ? (
          <Link href={tool.url} className="font-medium text-foreground hover:text-accent transition-colors">
            {tool.name}
          </Link>
        ) : (
          <a
            href={tool.url}
            target="_blank"
            rel={externalRel(tool.url)}
            className="font-medium text-foreground hover:text-accent transition-colors"
          >
            {tool.name}
          </a>
        )}
        <span className="text-xs text-muted-foreground">
          {tool.url.startsWith("/") ? "seobaza.com.ua" : hostOf(tool.url)}
        </span>
        {tool.peopleRefs?.map((p) => (
          <Link key={p.href} href={p.href} className="text-xs text-primary hover:text-accent transition-colors">
            {p.name} →
          </Link>
        ))}
        {tool.entityHref && (
          <Link href={tool.entityHref} className="text-xs text-primary hover:text-accent transition-colors">
            Граф знань →
          </Link>
        )}
      </div>
      {tool.description && (
        <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
      )}
      {tool.mentions?.length ? (
        <p className="text-xs text-muted-foreground mt-2">
          У новинах SEO Baza:{" "}
          {tool.mentions.map((m, i) => (
            <span key={m.url}>
              {i > 0 && " · "}
              <Link href={m.url} className="text-primary hover:text-accent transition-colors">
                {m.title}
              </Link>
            </span>
          ))}
        </p>
      ) : null}
      {(tool.ua?.length || (showReview && tool.review)) && (
        <div className="flex flex-wrap gap-2 mt-2 text-xs font-medium">
          {tool.ua?.map((m) => (
            <span key={m} className="px-2 py-0.5 bg-accent/15 text-accent rounded-full">
              {m === "supports-ukraine" ? "💙💛" : "🇺🇦"} {UA_MARK_LABELS[m]}
            </span>
          ))}
          {showReview && tool.review && (
            <span
              className="px-2 py-0.5 bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 rounded-full"
              title={tool.review}
            >
              перевірити: {tool.review}
            </span>
          )}
        </div>
      )}
    </li>
  );
}

/**
 * Список сервісів з пошуком і фільтром українських позначок.
 * Повний список рендериться на сервері, JS лише фільтрує.
 */
export function ToolsCatalog({
  tools,
  categories,
  showCategoryHeadings,
  showReview,
  sectionConcepts = {},
  categoryConcepts = {},
}: {
  tools: Tool[];
  categories: ToolCategory[];
  /** На хабі групуємо за категоріями, на сторінці категорії тільки за розділами. */
  showCategoryHeadings: boolean;
  /** Примітки редактору, тільки в dev. */
  showReview: boolean;
  /** Розділ → опублікований хаб концепту в графі знань. */
  sectionConcepts?: Record<string, { name: string; href: string }>;
  /** Категорія → опублікований хаб концепту. */
  categoryConcepts?: Record<string, { name: string; href: string }>;
}) {
  const [query, setQuery] = useState("");
  const [ua, setUa] = useState<UaFilter>("all");

  const hasUa = tools.some((t) => t.ua?.length);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((t) => {
      if (ua !== "all" && !t.ua?.includes(ua)) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.section.toLowerCase().includes(q) ||
        t.url.toLowerCase().includes(q)
      );
    });
  }, [tools, query, ua]);

  // category → section → tools, у порядку з даних
  const groups = useMemo(() => {
    const out: { category: ToolCategory; sections: { name: string; tools: Tool[] }[] }[] = [];
    for (const category of categories) {
      const inCat = filtered.filter((t) => t.category === category.slug);
      if (!inCat.length) continue;
      const sections: { name: string; tools: Tool[] }[] = [];
      for (const t of inCat) {
        let s = sections.find((x) => x.name === t.section);
        if (!s) sections.push((s = { name: t.section, tools: [] }));
        s.tools.push(t);
      }
      for (const s of sections) s.tools.sort((a, b) => a.name.localeCompare(b.name, "uk"));
      sections.sort(
        (a, b) => sectionRank(a.name) - sectionRank(b.name) || a.name.localeCompare(b.name, "uk")
      );
      out.push({ category, sections });
    }
    return out;
  }, [filtered, categories]);

  // Порядкові номери для розмітки ItemList, у тому порядку, в якому сервіси показано.
  const positions = new Map<Tool, number>();
  for (const g of groups) for (const s of g.sections) for (const t of s.tools) positions.set(t, positions.size + 1);

  return (
    <div itemScope itemType="https://schema.org/ItemList">
      <meta itemProp="numberOfItems" content={String(filtered.length)} />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Пошук: назва, задача або домен"
        aria-label="Пошук сервісу"
        className="w-full mb-4 px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:border-accent"
      />

      {hasUa && (
        <div className="flex flex-wrap gap-2 mb-8">
          {UA_FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setUa(f.key)}
              aria-pressed={ua === f.key}
              className={
                ua === f.key
                  ? "px-4 py-1.5 rounded-full text-sm font-medium bg-accent text-background"
                  : "px-4 py-1.5 rounded-full text-sm font-medium border border-border hover:border-accent/50 hover:text-accent transition-colors"
              }
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {!showCategoryHeadings && groups.length > 0 && (
        <nav aria-label="Зміст" className="mb-8 p-4 rounded-xl border border-border bg-muted/30">
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {groups[0].sections.map((s) => (
              <li key={s.name}>
                <a href={`#${toolSectionId(groups[0].category.slug, s.name)}`} className="hover:text-accent transition-colors">
                  {s.name}
                </a>{" "}
                <span className="text-muted-foreground">{s.tools.length}</span>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <p className="text-sm text-muted-foreground mb-8">Сервісів: {filtered.length}</p>

      {groups.length === 0 ? (
        <p className="text-muted-foreground py-8">За цим запитом нічого не знайшлося.</p>
      ) : (
        groups.map(({ category, sections }) => (
          <section key={category.slug} id={category.slug} className="mb-12 scroll-mt-24">
            {showCategoryHeadings && (
              <h2 className="text-2xl sm:text-3xl font-display mb-6">
                {category.name}
                {categoryConcepts[category.slug] && (
                  <Link
                    href={categoryConcepts[category.slug].href}
                    className="ml-3 text-sm font-sans font-normal text-primary hover:text-accent transition-colors"
                  >
                    {categoryConcepts[category.slug].name} у графі знань →
                  </Link>
                )}
              </h2>
            )}
            {sections.map((s) => {
              const Heading = showCategoryHeadings ? "h3" : "h2";
              return (
                <div key={s.name} id={toolSectionId(category.slug, s.name)} className="mb-8 scroll-mt-24">
                  <Heading className="text-lg font-display mb-3">
                    {s.name}
                    {sectionConcepts[s.name] && (
                      <Link
                        href={sectionConcepts[s.name].href}
                        className="ml-2 text-xs font-sans font-normal text-primary hover:text-accent transition-colors"
                      >
                        {sectionConcepts[s.name].name} у графі знань →
                      </Link>
                    )}
                  </Heading>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {s.tools.map((t) => (
                      <ToolCard key={t.url + t.name} tool={t} showReview={showReview} position={positions.get(t) ?? 0} />
                    ))}
                  </ul>
                </div>
              );
            })}
          </section>
        ))
      )}
    </div>
  );
}
