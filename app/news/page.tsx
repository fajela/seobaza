import Link from "next/link";
import { getAllNews, getNewsYears } from "@/lib/news";
import { CATEGORIES, getCategoryDisplayName } from "@/lib/taxonomy";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SEO новини — SEO BAZA",
  description:
    "Архів SEO-новин від спільноти SEO BAZA: оновлення Google, тренди AI та події SEO-індустрії.",
  alternates: { canonical: "https://seobaza.com.ua/news" },
};

export default function NewsPage() {
  const allNews = getAllNews();
  const years = getNewsYears();

  // Separate individual posts from digest summaries
  const posts = allNews.filter((n) => n.type === "news");
  const digests = allNews.filter((n) => n.type === "digest");

  // Show the 24 most recent individual posts on this page
  const recentPosts = posts.slice(0, 24);

  // Category pills — count news+digests per category so the navigation matches
  // what users actually see on /category/[slug]. Pills link to the canonical
  // /category/[slug] page (no query strings).
  const countsByCategory = new Map<string, number>();
  for (const n of allNews) {
    if (n.category) {
      countsByCategory.set(n.category, (countsByCategory.get(n.category) ?? 0) + 1);
    }
  }
  const activeCategories = CATEGORIES
    .map((c) => ({ ...c, count: countsByCategory.get(c.slug) ?? 0 }))
    .filter((c) => c.count > 0);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-display mb-4 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Новини
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          SEO-новини від спільноти SEO BAZA
        </p>

        {/* Category navigation — pills link to /category/[slug] */}
        {activeCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-accent text-background">
              Всі{" "}
              <span className="ml-1.5 text-xs opacity-80">
                {posts.length + digests.length}
              </span>
            </span>
            {activeCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="px-4 py-1.5 rounded-full text-sm font-medium border border-border hover:border-accent/50 hover:text-accent transition-colors"
              >
                {cat.displayName}
                <span className="ml-1.5 text-xs opacity-70">{cat.count}</span>
              </Link>
            ))}
          </div>
        )}

        {posts.length === 0 && digests.length === 0 ? (
          <p className="text-muted-foreground">Новини з'являться найближчим часом.</p>
        ) : (
          <div className="space-y-16">

            {/* ── Recent individual posts ── */}
            {recentPosts.length > 0 && (
              <section>
                <div className="flex flex-wrap items-baseline justify-between gap-3 mb-6">
                  <h2 className="text-2xl font-display">Останні новини</h2>
                  {posts.length > recentPosts.length && (
                    <span className="text-sm text-muted-foreground">
                      Показано {recentPosts.length} з {posts.length}
                    </span>
                  )}
                </div>
                <div
                  className="grid gap-3"
                  itemScope
                  itemType="https://schema.org/ItemList"
                >
                  <meta itemProp="numberOfItems" content={String(recentPosts.length)} />
                  {recentPosts.map((item, i) => {
                    const postPath = item.month
                      ? `/news/${item.year}/${item.month}/${item.slug}`
                      : `/news/${item.year}/${item.slug}`;
                    return (
                    <div
                      key={item.slug}
                      itemProp="itemListElement"
                      itemScope
                      itemType="https://schema.org/ListItem"
                    >
                      <meta itemProp="position" content={String(i + 1)} />
                      <link itemProp="url" href={`https://seobaza.com.ua${postPath}`} />
                      <Link href={postPath} className="block group">
                      <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-secondary/20 hover:border-accent/50 hover:bg-secondary/40 transition-all">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            {item.category && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                                {getCategoryDisplayName(item.category)}
                              </span>
                            )}
                          </div>
                          <h3
                            itemProp="name"
                            className="font-medium group-hover:text-accent transition-colors line-clamp-2"
                          >
                            {item.title}
                          </h3>
                          {item.description && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <time dateTime={item.date}>
                              {new Date(item.date).toLocaleDateString("uk-UA", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </time>
                            {item.readingTime && (
                              <>
                                <span>·</span>
                                <span>{item.readingTime} хв</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                    </div>
                    );
                  })}
                </div>

                {/* Year archive links */}
                <div className="mt-8 flex flex-wrap gap-3">
                  {years.map((year) => {
                    const count = posts.filter((p) => p.year === year).length;
                    if (count === 0) return null;
                    return (
                      <Link
                        key={year}
                        href={`/news/${year}`}
                        className="px-4 py-2 text-sm font-medium rounded-lg border border-border bg-secondary/20 hover:border-accent/50 hover:bg-secondary/40 transition-all"
                      >
                        {year} <span className="text-muted-foreground ml-1">({count})</span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ── Monthly digest archive ── */}
            {digests.length > 0 && (
              <section>
                <h2 className="text-2xl font-display mb-2">Місячні дайджести</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Зведені огляди по місяцях
                </p>
                <div className="space-y-8">
                  {years.map((year) => {
                    const yearDigests = digests.filter((d) => d.year === year);
                    if (yearDigests.length === 0) return null;
                    return (
                      <div key={year}>
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                          {year}
                        </h3>
                        <div
                          className="grid sm:grid-cols-2 gap-3"
                          itemScope
                          itemType="https://schema.org/ItemList"
                        >
                          <meta itemProp="numberOfItems" content={String(yearDigests.length)} />
                          {yearDigests.map((item, i) => {
                            const url = item.month
                              ? `/news/${item.year}/${item.month}/${item.slug}`
                              : `/news/${item.year}/${item.slug}`;
                            return (
                              <div
                                key={item.slug}
                                itemProp="itemListElement"
                                itemScope
                                itemType="https://schema.org/ListItem"
                              >
                                <meta itemProp="position" content={String(i + 1)} />
                                <link itemProp="url" href={`https://seobaza.com.ua${url}`} />
                                <Link href={url} className="block group">
                                  <div className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border bg-secondary/20 hover:border-accent/50 hover:bg-secondary/40 transition-all">
                                    <span
                                      itemProp="name"
                                      className="text-sm font-medium group-hover:text-accent transition-colors truncate"
                                    >
                                      {item.title}
                                    </span>
                                    {item.itemCount && (
                                      <span className="shrink-0 text-xs text-muted-foreground">
                                        {item.itemCount} пост{item.itemCount === 1 ? "" : "ів"}
                                      </span>
                                    )}
                                  </div>
                                </Link>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
