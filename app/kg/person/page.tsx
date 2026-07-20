import Link from "next/link";
import { getAllKgPeople } from "@/lib/kg";
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

export default function KgPeopleIndexPage() {
  const people = getAllKgPeople();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-display mb-3">Граф знань: люди</h1>
        <p className="text-muted-foreground mb-10">
          SEO Baza будує власний граф знань української SEO-спільноти. Тут живуть
          його люди: спікери наших мітапів та експерти галузі, кожен зі своїм
          стабільним ідентифікатором.
        </p>

        <div
          className="grid gap-4 sm:grid-cols-2"
          itemScope
          itemType="https://schema.org/ItemList"
        >
          <meta itemProp="numberOfItems" content={String(people.length)} />
          {people.map((p, i) => (
            <div
              key={p.kgId}
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <meta itemProp="position" content={String(i + 1)} />
              <link itemProp="url" href={`https://seobaza.com.ua/kg/person/${p.kgId}`} />
              <Link href={`/kg/person/${p.kgId}`} className="block group h-full">
                <div className="flex items-center gap-4 p-5 h-full rounded-xl border border-border bg-secondary/20 group-hover:border-accent/50 group-hover:bg-secondary/40 transition-all">
                  <div>
                    <h2
                      itemProp="name"
                      className="font-display text-lg group-hover:text-accent transition-colors"
                    >
                      {p.name}
                    </h2>
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
      </div>
    </div>
  );
}
