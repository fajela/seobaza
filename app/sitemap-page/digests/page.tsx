import Link from "next/link";
import { getAllNews, getNewsYears } from "@/lib/news";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Місячні дайджести — Карта сайту — SEO BAZA",
  description: "Усі місячні дайджести SEO BAZA — підбірки новин за кожен місяць.",
  alternates: { canonical: "https://seobaza.com.ua/sitemap-page/digests" },
};

function pluralizeDigests(n: number) {
  if (n === 1) return "дайджест";
  if (n < 5) return "дайджести";
  return "дайджестів";
}

export default function SitemapDigestsPage() {
  const digests = getAllNews().filter((n) => n.type === "digest");
  const years = getNewsYears();

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
            <Link href="/sitemap-page" className="hover:text-accent transition-colors">
              <span itemProp="name">Карта сайту</span>
            </Link>
            <link itemProp="item" href="https://seobaza.com.ua/sitemap-page" />
            <meta itemProp="position" content="1" />
          </span>
          <span>/</span>
          <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span itemProp="name" className="text-foreground">Дайджести</span>
            <link itemProp="item" href="https://seobaza.com.ua/sitemap-page/digests" />
            <meta itemProp="position" content="2" />
          </span>
        </nav>

        <h1 className="text-4xl sm:text-5xl font-display mb-4 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Місячні дайджести
        </h1>
        <p className="text-muted-foreground mb-10">
          {digests.length} {pluralizeDigests(digests.length)}
        </p>

        <div itemScope itemType="https://schema.org/ItemList">
          <meta itemProp="numberOfItems" content={String(digests.length)} />
          {(() => {
            let pos = 0;
            return years.map((year) => {
              const yearDigests = digests.filter((d) => d.year === year);
              if (yearDigests.length === 0) return null;
              return (
                <section key={year} className="mb-8">
                  <h2 className="text-xl font-display mb-3">
                    <Link href={`/news/${year}`} className="hover:text-accent transition-colors">
                      {year}
                    </Link>
                  </h2>
                  <ul className="space-y-1">
                    {yearDigests.map((d) => {
                      pos += 1;
                      const url = d.month
                        ? `/news/${d.year}/${d.month}/${d.slug}`
                        : `/news/${d.year}/${d.slug}`;
                      return (
                        <li
                          key={d.slug}
                          itemProp="itemListElement"
                          itemScope
                          itemType="https://schema.org/ListItem"
                        >
                          <meta itemProp="position" content={String(pos)} />
                          <link itemProp="url" href={`https://seobaza.com.ua${url}`} />
                          <Link
                            href={url}
                            className="text-sm text-foreground hover:text-accent transition-colors"
                          >
                            <span itemProp="name">{d.title}</span>
                          </Link>
                          {d.itemCount && (
                            <span className="ml-2 text-xs text-muted-foreground">
                              {d.itemCount} постів
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            });
          })()}
        </div>
      </div>
    </div>
  );
}
