import Link from "next/link";
import { getAllTagsWithCounts } from "@/lib/articles";
import { pageMeta } from "@/lib/page-metadata";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata = pageMeta({
  title: "Теги — SEO BAZA",
  description:
    "Всі теги статей SEO BAZA: знайдіть матеріали за темами Core Web Vitals, E-E-A-T, лінкбілдинг, AI Overviews та іншими ключовими напрямами SEO.",
  path: "/tags",
});

export default function TagsPage() {
  const tags = getAllTagsWithCounts();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs items={[{ name: "Головна", href: "/" }, { name: "Теги", href: "/tags" }]} />
        <h1 className="text-4xl sm:text-5xl font-display mb-6 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Теги
        </h1>
        <p className="text-lg text-muted-foreground mb-12">
          {tags.length > 0
            ? `${tags.reduce((sum, t) => sum + t.count, 0)} матеріалів за ${tags.length} темами`
            : "Матеріали з'являться тут після публікації"}
        </p>

        {tags.length > 0 ? (
          <div
            className="flex flex-wrap gap-3"
            itemScope
            itemType="https://schema.org/ItemList"
          >
            <meta itemProp="numberOfItems" content={String(tags.length)} />
            {tags.map((tag, i) => (
              <div
                key={tag.slug}
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                <meta itemProp="position" content={String(i + 1)} />
                <link itemProp="url" href={`https://seobaza.com.ua/tags/${tag.slug}`} />
                <Link
                  href={`/tags/${tag.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-secondary/30 text-sm font-medium transition-all hover:border-accent/50 hover:bg-accent/10 hover:text-accent"
                >
                  <span itemProp="name">{tag.displayName}</span>
                  <span className="text-xs text-muted-foreground">
                    {tag.count}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            Поки що немає опублікованих статей з тегами.
          </p>
        )}
      </div>
    </div>
  );
}
