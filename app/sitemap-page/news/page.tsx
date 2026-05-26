import Link from "next/link";
import { getAllNews, getNewsYears, getMonthsForYear } from "@/lib/news";
import { ukMonthName } from "@/lib/months";
import { pageMeta } from "@/lib/page-metadata";

export const metadata = pageMeta({
  title: "Новини — Карта сайту — SEO BAZA",
  description: "Усі індивідуальні новинні дописи SEO BAZA, згруповані за роком і місяцем.",
  path: "/sitemap-page/news",
});

function pluralizeNews(n: number) {
  if (n === 1) return "допис";
  if (n < 5) return "дописи";
  return "дописів";
}

export default function SitemapNewsPage() {
  const news = getAllNews().filter((n) => n.type !== "digest");
  const years = getNewsYears();

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
            <span itemProp="name" className="text-foreground">Новини</span>
            <link itemProp="item" href="https://seobaza.com.ua/sitemap-page/news" />
            <meta itemProp="position" content="2" />
          </span>
        </nav>

        <h1 className="text-4xl sm:text-5xl font-display mb-4 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Новини
        </h1>
        <p className="text-muted-foreground mb-10">
          {news.length} {pluralizeNews(news.length)}
        </p>

        <div itemScope itemType="https://schema.org/ItemList">
          <meta itemProp="numberOfItems" content={String(news.length)} />
          {(() => {
            let pos = 0;
            return years.map((year) => {
              const yearNews = news.filter((n) => n.year === year);
              if (yearNews.length === 0) return null;
              const months = getMonthsForYear(year);
              return (
                <section key={year} className="mb-10">
                  <h2 className="text-2xl font-display mb-4">
                    <Link href={`/news/${year}`} className="hover:text-accent transition-colors">
                      {year}
                    </Link>{" "}
                    <span className="text-base text-muted-foreground">({yearNews.length})</span>
                  </h2>
                  {months.map((mm) => {
                    const monthNews = yearNews.filter((n) => n.month === mm);
                    if (monthNews.length === 0) return null;
                    return (
                      <div key={mm} className="mb-6">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                          <Link
                            href={`/news/${year}/${mm}`}
                            className="hover:text-accent transition-colors"
                          >
                            {ukMonthName(mm)}
                          </Link>{" "}
                          <span className="text-xs normal-case">({monthNews.length})</span>
                        </h3>
                        <ul className="ml-2 space-y-1">
                          {monthNews.map((n) => {
                            pos += 1;
                            const url = `/news/${n.year}/${n.month}/${n.slug}`;
                            return (
                              <li
                                key={n.slug}
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
                                  <span itemProp="name">{n.title}</span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  })}
                </section>
              );
            });
          })()}
        </div>
      </div>
    </div>
  );
}
