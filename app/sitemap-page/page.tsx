import Link from "next/link";
import { getAllArticles, getAllCategoriesWithCounts, getAllTagsWithCounts } from "@/lib/articles";
import { getAllNews } from "@/lib/news";
import { getAllAuthors } from "@/lib/authors";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Карта сайту — SEO BAZA",
  description: "Повна карта сайту SEO BAZA: статті, новини, дайджести, теги, категорії, автори.",
  alternates: { canonical: "https://seobaza.com.ua/sitemap-page" },
};

export default function SitemapIndexPage() {
  const articles   = getAllArticles();
  const allNews    = getAllNews();
  const news       = allNews.filter((n) => n.type !== "digest");
  const digests    = allNews.filter((n) => n.type === "digest");
  const categories = getAllCategoriesWithCounts().filter((c) => c.count > 0);
  const tags       = getAllTagsWithCounts();
  const authors    = getAllAuthors();

  const sections: Array<{
    href: string;
    title: string;
    count: number;
    desc: string;
  }> = [
    {
      href: "/sitemap-page/articles",
      title: "Статті",
      count: articles.length,
      desc: "Усі вічнозелені статті: розбори патентів, гайди, методології.",
    },
    {
      href: "/sitemap-page/news",
      title: "Новини",
      count: news.length,
      desc: "Індивідуальні новинні дописи, згруповані за роком і місяцем.",
    },
    {
      href: "/sitemap-page/digests",
      title: "Місячні дайджести",
      count: digests.length,
      desc: "Щомісячні підбірки SEO-новин.",
    },
    {
      href: "/sitemap-page/categories",
      title: "Категорії",
      count: categories.length,
      desc: "Пілар-категорії SEO: новини індустрії, новини SEO BAZA, дайджести, гайди, думки.",
    },
    {
      href: "/sitemap-page/tags",
      title: "Теги",
      count: tags.length,
      desc: "Тематичні мітки — конкретні підтеми всередині категорій.",
    },
    {
      href: "/sitemap-page/authors",
      title: "Автори",
      count: authors.length,
      desc: "Профілі авторів спільноти SEO BAZA.",
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-display mb-6 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Карта сайту
        </h1>
        <p className="text-lg text-muted-foreground mb-4">
          Все, що опубліковано на SEO BAZA — для пошуку та навігації.
        </p>
        <p className="text-sm text-muted-foreground mb-12">
          XML-версію для пошукових систем дивіться за адресою{" "}
          <Link href="/sitemap.xml" className="underline hover:text-accent">
            /sitemap.xml
          </Link>
          .
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="block p-6 rounded-xl border border-border bg-secondary/20 hover:border-accent/50 hover:bg-secondary/40 transition-all group"
            >
              <div className="flex items-baseline justify-between gap-3 mb-2">
                <h2 className="text-xl font-display group-hover:text-accent transition-colors">
                  {s.title}
                </h2>
                <span className="shrink-0 text-sm font-medium text-muted-foreground">
                  {s.count}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
