import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import { getCategoryDisplayName } from "@/lib/taxonomy";
import { pageMeta } from "@/lib/page-metadata";

export const metadata = pageMeta({
  title: "Статті — Карта сайту — SEO BAZA",
  description: "Список усіх вічнозелених статей на SEO BAZA.",
  path: "/sitemap-page/articles",
});

function pluralizeArticles(n: number) {
  if (n === 1) return "стаття";
  if (n < 5) return "статті";
  return "статей";
}

export default function SitemapArticlesPage() {
  const articles = getAllArticles();

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
            <span itemProp="name" className="text-foreground">Статті</span>
            <link itemProp="item" href="https://seobaza.com.ua/sitemap-page/articles" />
            <meta itemProp="position" content="2" />
          </span>
        </nav>

        <h1 className="text-4xl sm:text-5xl font-display mb-4 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Статті
        </h1>
        <p className="text-muted-foreground mb-10">
          {articles.length} {pluralizeArticles(articles.length)}
        </p>

        <ul
          className="space-y-2"
          itemScope
          itemType="https://schema.org/ItemList"
        >
          <meta itemProp="numberOfItems" content={String(articles.length)} />
          {articles.map((a, i) => (
            <li
              key={a.slug}
              className="flex flex-wrap items-baseline gap-3"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <meta itemProp="position" content={String(i + 1)} />
              <link itemProp="url" href={`https://seobaza.com.ua/articles/${a.slug}`} />
              <Link
                href={`/articles/${a.slug}`}
                className="text-foreground hover:text-accent transition-colors"
              >
                <span itemProp="name">{a.title}</span>
              </Link>
              <span className="text-xs text-muted-foreground">
                {new Date(a.date).toLocaleDateString("uk-UA", { year: "numeric", month: "short" })}
                {a.category ? ` · ${getCategoryDisplayName(a.category)}` : ""}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
