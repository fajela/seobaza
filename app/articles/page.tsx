import Link from "next/link";
import { getAllArticles } from "@/lib/articles";

export const metadata = {
  title: "Статті - SEO BAZA",
  description: "Навчальні матеріали та статті від української SEO-спільноти",
};

export default function ArticlesPage() {
  // Виключаємо тестові статті - вони показуються на /test
  const testSlugs = ["makar-telyat", "meta-author-test", "seo-audit-experiment"];
  const articles = getAllArticles().filter(
    (article) => !testSlugs.includes(article.slug)
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-display mb-6 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Статті</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Навчальні матеріали та статті від української SEO-спільноти
        </p>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-6">
              Поки що немає опублікованих статей.
            </p>
            <p className="text-sm text-muted-foreground">
              Хочете додати свою статтю?{" "}
              <Link
                href="/contact"
                className="text-primary hover:text-accent underline transition-colors"
              >
                Зв'яжіться з нами
              </Link>
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="block group"
              >
                <article className="bg-secondary/30 rounded-xl p-6 border border-border transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10">
                  <h2 className="text-2xl font-display mb-2 group-hover:text-accent transition-colors">
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
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {article.description}
                  </p>
                  {article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-xs font-medium bg-accent/10 text-accent rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
