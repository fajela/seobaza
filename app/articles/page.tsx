import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import { CATEGORIES, getTagDisplayName, getCategoryDisplayName } from "@/lib/taxonomy";
import { pageMeta } from "@/lib/page-metadata";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata = pageMeta({
  title: "Статті — SEO BAZA",
  description: "Навчальні матеріали та статті від української SEO-спільноти",
  path: "/articles",
});

export default async function ArticlesPage() {
  // Guides live in /knowledge-base, not in the articles feed (avoids the same
  // guide showing both here and under the "Гайди" category).
  const articles = getAllArticles().filter((a) => a.category !== "guides");

  // Count articles per category for the navigation pills.
  // These pills LINK to /category/[slug] — that's the canonical filtered listing.
  // No query strings, no duplicate routes.
  const articleCountsByCategory = new Map<string, number>();
  for (const a of articles) {
    if (a.category) {
      articleCountsByCategory.set(a.category, (articleCountsByCategory.get(a.category) ?? 0) + 1);
    }
  }
  const activeCategories = CATEGORIES
    .map((c) => ({ ...c, count: articleCountsByCategory.get(c.slug) ?? 0 }))
    .filter((c) => c.count > 0);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs items={[{ name: "Головна", href: "/" }, { name: "Статті", href: "/articles" }]} />
        <h1 className="text-4xl sm:text-5xl font-display mb-6 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Статті
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Навчальні матеріали та статті від української SEO-спільноти
        </p>

        {/* Category navigation — pills link to /category/[slug] (the canonical category page) */}
        {activeCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-accent text-background">
              Всі <span className="ml-1.5 text-xs opacity-80">{articles.length}</span>
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

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              Поки що немає опублікованих статей.
            </p>
          </div>
        ) : (
          <div
            className="grid gap-6"
            itemScope
            itemType="https://schema.org/ItemList"
          >
            <meta itemProp="numberOfItems" content={String(articles.length)} />
            {articles.map((article, i) => (
              <div
                key={article.slug}
                className="relative group"
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                <meta itemProp="position" content={String(i + 1)} />
                <link itemProp="url" href={`https://seobaza.com.ua/articles/${article.slug}`} />
                {/* Full-card overlay link — z-10 puts it above the article content;
                    nested category/tag links use z-20 to escape it. */}
                <Link
                  href={`/articles/${article.slug}`}
                  className="absolute inset-0 z-10 rounded-xl"
                  aria-label={article.title}
                />
                <article className="relative bg-secondary/30 rounded-xl p-6 border border-border transition-all group-hover:border-accent/50 group-hover:shadow-lg group-hover:shadow-accent/10">
                  {/* Category badge */}
                  {article.category && (
                    <Link
                      href={`/category/${article.category}`}
                      className="relative z-20 inline-block mb-3 px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                    >
                      {getCategoryDisplayName(article.category)}
                    </Link>
                  )}

                  <h2
                    itemProp="name"
                    className="text-2xl font-display mb-2 group-hover:text-accent transition-colors"
                  >
                    {article.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                    <span>{article.author}</span>
                    <span>•</span>
                    <time dateTime={article.date}>
                      {new Date(article.date).toLocaleDateString("uk-UA", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    {article.readingTime && (
                      <>
                        <span>•</span>
                        <span>{article.readingTime} хв читання</span>
                      </>
                    )}
                  </div>

                  <p className="text-muted-foreground mb-4">
                    {article.description}
                  </p>

                  {article.tags.length > 0 && (
                    <div className="relative z-20 flex flex-wrap gap-2">
                      {article.tags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/tags/${tag}`}
                          className="px-3 py-1 text-xs font-medium bg-accent/10 text-accent rounded-full hover:bg-accent/20 transition-colors"
                        >
                          {getTagDisplayName(tag)}
                        </Link>
                      ))}
                    </div>
                  )}
                </article>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
