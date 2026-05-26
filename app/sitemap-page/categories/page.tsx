import Link from "next/link";
import { getAllCategoriesWithCounts } from "@/lib/articles";
import { pageMeta } from "@/lib/page-metadata";

export const metadata = pageMeta({
  title: "Категорії — Карта сайту — SEO BAZA",
  description: "Пілар-категорії SEO на SEO BAZA.",
  path: "/sitemap-page/categories",
});

function pluralizeCats(n: number) {
  if (n === 1) return "категорія";
  if (n < 5) return "категорії";
  return "категорій";
}

export default function SitemapCategoriesPage() {
  const categories = getAllCategoriesWithCounts();

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
            <span itemProp="name" className="text-foreground">Категорії</span>
            <link itemProp="item" href="https://seobaza.com.ua/sitemap-page/categories" />
            <meta itemProp="position" content="2" />
          </span>
        </nav>

        <h1 className="text-4xl sm:text-5xl font-display mb-4 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Категорії
        </h1>
        <p className="text-muted-foreground mb-10">
          {categories.length} {pluralizeCats(categories.length)}
        </p>

        <ul
          className="grid sm:grid-cols-2 gap-3"
          itemScope
          itemType="https://schema.org/ItemList"
        >
          <meta itemProp="numberOfItems" content={String(categories.length)} />
          {categories.map((c, i) => (
            <li
              key={c.slug}
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <meta itemProp="position" content={String(i + 1)} />
              <link itemProp="url" href={`https://seobaza.com.ua/category/${c.slug}`} />
              <Link
                href={`/category/${c.slug}`}
                className="block p-4 rounded-lg border border-border bg-secondary/20 hover:border-accent/50 hover:bg-secondary/40 transition-all group"
              >
                <div className="flex items-baseline justify-between gap-3 mb-1">
                  <span
                    itemProp="name"
                    className="font-medium group-hover:text-accent transition-colors"
                  >
                    {c.displayName}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">{c.count}</span>
                </div>
                {c.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{c.description}</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
