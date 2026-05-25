import Link from "next/link";
import { getAllTagsWithCounts } from "@/lib/articles";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Теги — Карта сайту — SEO BAZA",
  description: "Усі теги статей і новин SEO BAZA.",
  alternates: { canonical: "https://seobaza.com.ua/sitemap-page/tags" },
};

function pluralizeTags(n: number) {
  if (n === 1) return "тег";
  if (n < 5) return "теги";
  return "тегів";
}

export default function SitemapTagsPage() {
  const tags = getAllTagsWithCounts();

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
            <span itemProp="name" className="text-foreground">Теги</span>
            <link itemProp="item" href="https://seobaza.com.ua/sitemap-page/tags" />
            <meta itemProp="position" content="2" />
          </span>
        </nav>

        <h1 className="text-4xl sm:text-5xl font-display mb-4 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Теги
        </h1>
        <p className="text-muted-foreground mb-10">
          {tags.length} {pluralizeTags(tags.length)}
        </p>

        <ul
          className="flex flex-wrap gap-2"
          itemScope
          itemType="https://schema.org/ItemList"
        >
          <meta itemProp="numberOfItems" content={String(tags.length)} />
          {tags.map((t, i) => (
            <li
              key={t.slug}
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <meta itemProp="position" content={String(i + 1)} />
              <link itemProp="url" href={`https://seobaza.com.ua/tags/${t.slug}`} />
              <Link
                href={`/tags/${t.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-secondary/30 text-sm hover:bg-accent/10 hover:text-accent hover:border-accent/50 transition-all"
              >
                <span itemProp="name">{t.displayName}</span>
                <span className="text-xs text-muted-foreground">{t.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
