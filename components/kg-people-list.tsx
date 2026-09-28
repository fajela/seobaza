"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export interface KgPeopleListItem {
  kgId: string;
  name: string;
  /** "Прізвище Ім'я"; the list is sorted and grouped by it. */
  sortKey: string;
  role: string;
  company?: string;
  image?: string;
  expertise: string[];
  /** Lower-cased name, spellings, aliases and company, for the search box. */
  haystack: string;
}

export interface KgPeopleTopic {
  slug: string;
  label: string;
  count: number;
}

// Apostrophe variants people type (', ’, ʼ) all match each other.
function normalize(value: string): string {
  return value.toLowerCase().replace(/[’ʼ`]/g, "'").trim();
}

function firstLetter(sortKey: string): string {
  return sortKey.charAt(0).toLocaleUpperCase("uk");
}

export function KgPeopleList({
  people,
  topics,
}: {
  people: KgPeopleListItem[];
  topics: KgPeopleTopic[];
}) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = normalize(query);
    return people.filter(
      (p) =>
        (topic === "all" || p.expertise.includes(topic)) &&
        (!q || p.haystack.includes(q))
    );
  }, [people, query, topic]);

  // People arrive sorted by surname; group them under its first letter.
  const groups = useMemo(() => {
    const out: { letter: string; people: KgPeopleListItem[] }[] = [];
    for (const p of filtered) {
      const letter = firstLetter(p.sortKey);
      const last = out[out.length - 1];
      if (last && last.letter === letter) last.people.push(p);
      else out.push({ letter, people: [p] });
    }
    return out;
  }, [filtered]);

  const allLetters = useMemo(
    () => [...new Set(people.map((p) => firstLetter(p.sortKey)))],
    [people]
  );
  const activeLetters = new Set(groups.map((g) => g.letter));

  return (
    <div>
      <label htmlFor="kg-people-search" className="sr-only">
        Пошук людини
      </label>
      <input
        id="kg-people-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ім'я, латиницею теж, або компанія"
        className="w-full px-4 py-3 mb-5 rounded-xl border border-border bg-secondary/20 focus:outline-none focus:border-accent/60"
      />

      {/* Topic chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[{ slug: "all", label: "Усі", count: people.length }, ...topics].map((t) => (
          <button
            key={t.slug}
            type="button"
            onClick={() => setTopic(t.slug)}
            aria-pressed={topic === t.slug}
            className={
              topic === t.slug
                ? "px-4 py-1.5 rounded-full text-sm font-medium bg-accent text-background"
                : "px-4 py-1.5 rounded-full text-sm font-medium border border-border hover:border-accent/50 hover:text-accent transition-colors"
            }
          >
            {t.label} <span className="opacity-60">{t.count}</span>
          </button>
        ))}
      </div>

      {/* Letter index */}
      <nav aria-label="Абетка" className="flex flex-wrap gap-1 mb-10 text-sm">
        {allLetters.map((letter) =>
          activeLetters.has(letter) ? (
            <a
              key={letter}
              href={`#letter-${letter}`}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-border hover:border-accent/50 hover:text-accent transition-colors"
            >
              {letter}
            </a>
          ) : (
            <span
              key={letter}
              className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground/40"
            >
              {letter}
            </span>
          )
        )}
      </nav>

      {groups.length === 0 ? (
        <p className="text-muted-foreground py-12 text-center">
          Нікого не знайшлося. Спробуйте інше написання імені.
        </p>
      ) : (
        <div itemScope itemType="https://schema.org/ItemList" className="space-y-10">
          <meta itemProp="numberOfItems" content={String(filtered.length)} />
          {groups.map((group) => (
            <section key={group.letter} id={`letter-${group.letter}`} className="scroll-mt-24">
              <h2 className="text-2xl font-display mb-4 text-accent">{group.letter}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {group.people.map((p) => (
                  <div
                    key={p.kgId}
                    itemProp="itemListElement"
                    itemScope
                    itemType="https://schema.org/ListItem"
                  >
                    <meta itemProp="position" content={String(filtered.indexOf(p) + 1)} />
                    <link itemProp="url" href={`https://seobaza.com.ua/kg/person/${p.kgId}`} />
                    <Link href={`/kg/person/${p.kgId}`} className="block group h-full">
                      <div className="flex items-center gap-4 p-5 h-full rounded-xl border border-border bg-secondary/20 group-hover:border-accent/50 group-hover:bg-secondary/40 transition-all">
                        <div>
                          <h3
                            itemProp="name"
                            className="font-display text-lg group-hover:text-accent transition-colors"
                          >
                            {p.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {p.role}
                            {p.company ? ` · ${p.company}` : ""}
                          </p>
                        </div>
                        {p.image ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={p.image}
                            alt={p.name}
                            width={56}
                            height={56}
                            loading="lazy"
                            className="order-first w-14 h-14 rounded-full object-cover shrink-0 border border-border"
                          />
                        ) : (
                          <div className="order-first w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center text-accent font-display text-xl shrink-0">
                            {p.name.charAt(0)}
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
