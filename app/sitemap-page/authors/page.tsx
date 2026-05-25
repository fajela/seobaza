import Link from "next/link";
import { getAllAuthors } from "@/lib/authors";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Автори — Карта сайту — SEO BAZA",
  description: "Профілі авторів SEO BAZA.",
  alternates: { canonical: "https://seobaza.com.ua/sitemap-page/authors" },
};

function pluralizeAuthors(n: number) {
  if (n === 1) return "автор";
  if (n < 5) return "автори";
  return "авторів";
}

export default function SitemapAuthorsPage() {
  const authors = getAllAuthors();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <nav
          className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-8"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link href="/sitemap-page" className="hover:text-accent transition-colors">
              <span itemProp="name">Карта сайту</span>
            </Link>
            <link itemProp="item" href="https://seobaza.com.ua/sitemap-page" />
            <meta itemProp="position" content="1" />
          </span>
          <span>/</span>
          <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span itemProp="name" className="text-foreground">Автори</span>
            <link itemProp="item" href="https://seobaza.com.ua/sitemap-page/authors" />
            <meta itemProp="position" content="2" />
          </span>
        </nav>

        <h1 className="text-4xl sm:text-5xl font-display mb-4 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Автори
        </h1>
        <p className="text-muted-foreground mb-10">
          {authors.length} {pluralizeAuthors(authors.length)}
        </p>

        <ul
          className="grid sm:grid-cols-2 gap-3"
          itemScope
          itemType="https://schema.org/ItemList"
        >
          <meta itemProp="numberOfItems" content={String(authors.length)} />
          {authors.map((a, i) => (
            <li
              key={a.slug}
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <meta itemProp="position" content={String(i + 1)} />
              <link itemProp="url" href={`https://seobaza.com.ua/authors/${a.slug}`} />
              <Link
                href={`/authors/${a.slug}`}
                className="block p-4 rounded-lg border border-border bg-secondary/20 hover:border-accent/50 hover:bg-secondary/40 transition-all group"
              >
                <div
                  itemProp="name"
                  className="font-medium group-hover:text-accent transition-colors"
                >
                  {a.name}
                </div>
                {a.role && (
                  <div className="text-xs text-muted-foreground mt-1">{a.role}</div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
