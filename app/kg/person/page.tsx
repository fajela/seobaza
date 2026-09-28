import Link from "next/link";
import { getAllKgPeople } from "@/lib/kg";
import { altNames } from "@/lib/authors";
import { getTagDisplayName } from "@/lib/taxonomy";
import { KgPeopleList, type KgPeopleListItem, type KgPeopleTopic } from "@/components/kg-people-list";
import { buildOgImage } from "@/lib/og-image";
import type { Metadata } from "next";

const ogPeople = buildOgImage(undefined, "Люди в графі знань SEO Baza");

export const metadata: Metadata = {
  title: "Граф знань SEO Baza: люди української SEO-спільноти",
  description:
    "Люди з графа знань SEO Baza: спікери мітапів та експерти української SEO-спільноти. Профілі з виступами, роботами і посиланнями. Знайомтесь зі спільнотою.",
  alternates: { canonical: "https://seobaza.com.ua/kg/person" },
  openGraph: {
    title: "Граф знань SEO Baza: люди української SEO-спільноти",
    description:
      "Люди з графа знань SEO Baza: спікери мітапів та експерти української SEO-спільноти. Профілі з виступами, роботами і посиланнями.",
    url: "https://seobaza.com.ua/kg/person",
    siteName: "SEO BAZA",
    locale: "uk_UA",
    type: "website",
    images: [{ url: ogPeople.url, width: ogPeople.width, height: ogPeople.height, alt: ogPeople.alt, type: ogPeople.type }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Граф знань SEO Baza: люди української SEO-спільноти",
    images: [{ url: ogPeople.url, alt: ogPeople.alt }],
  },
};

/** "Ім'я Прізвище" → "Прізвище Ім'я": the directory is ordered by surname. */
function surnameFirst(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts.length > 1 ? `${parts[parts.length - 1]} ${parts.slice(0, -1).join(" ")}` : name;
}

// Ukrainian (Cyrillic) names first, then Latin ones, each alphabetically by surname.
function byName(a: { sortKey: string }, b: { sortKey: string }): number {
  const cyr = (n: string) => /^[Ѐ-ӿ]/.test(n);
  if (cyr(a.sortKey) !== cyr(b.sortKey)) return cyr(a.sortKey) ? -1 : 1;
  return a.sortKey.localeCompare(b.sortKey, "uk");
}

export default function KgPeopleIndexPage() {
  const people: KgPeopleListItem[] = getAllKgPeople()
    .map((p) => ({
      kgId: p.kgId,
      name: p.name,
      sortKey: surnameFirst(p.name),
      role: p.role,
      company: p.company,
      image: p.image,
      expertise: p.expertise,
      haystack: [p.name, ...altNames(p.alternateName), ...p.aliases, p.company ?? ""]
        .join(" ")
        .toLowerCase()
        .replace(/[’ʼ`]/g, "'"),
    }))
    .sort(byName);

  // Topic chips: every expertise tag in use, most common first.
  const counts = new Map<string, number>();
  for (const p of people) for (const t of p.expertise) counts.set(t, (counts.get(t) ?? 0) + 1);
  const topics: KgPeopleTopic[] = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([slug, count]) => ({ slug, label: getTagDisplayName(slug), count }));

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs — microdata BreadcrumbList */}
        <nav
          className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-8"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link href="/kg" className="hover:text-accent transition-colors">
              <span itemProp="name">Граф знань</span>
            </Link>
            <link itemProp="item" href="https://seobaza.com.ua/kg" />
            <meta itemProp="position" content="1" />
          </span>
          <span>/</span>
          <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span itemProp="name" className="text-foreground">Люди</span>
            <link itemProp="item" href="https://seobaza.com.ua/kg/person" />
            <meta itemProp="position" content="2" />
          </span>
        </nav>

        <h1 className="text-4xl font-display mb-3">Граф знань: люди</h1>
        <p className="text-muted-foreground mb-10">
          SEO Baza будує власний граф знань української SEO-спільноти. Тут живуть
          його люди: спікери наших мітапів та експерти галузі, кожен зі своїм
          стабільним ідентифікатором.
        </p>

        <KgPeopleList people={people} topics={topics} />
      </div>
    </div>
  );
}
