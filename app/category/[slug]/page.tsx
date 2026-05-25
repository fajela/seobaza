import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticlesByCategory } from "@/lib/articles";
import { getNewsByCategory } from "@/lib/news";
import { CATEGORIES, getCategoryMeta, getTagDisplayName } from "@/lib/taxonomy";
import type { Metadata } from "next";
import type { CategorySlug } from "@/lib/taxonomy";

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryMeta(slug);
  if (!category) return { title: "Категорія не знайдена — SEO BAZA" };

  return {
    title: `${category.displayName} — SEO BAZA`,
    description: category.description,
    alternates: {
      canonical: `https://seobaza.com.ua/category/${slug}`,
    },
    openGraph: {
      title: `${category.displayName} — SEO BAZA`,
      description: category.description,
      url: `https://seobaza.com.ua/category/${slug}`,
      siteName: "SEO BAZA",
      locale: "uk_UA",
      type: "website",
    },
  };
}

type Item = {
  kind: "article" | "news";
  url: string;
  title: string;
  description: string;
  author: string;
  date: string;
  tags: string[];
  readingTime?: number;
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryMeta(slug);
  if (!category) notFound();

  const articles = getArticlesByCategory(slug as CategorySlug);
  // The "digests" category itself IS digests — keep them. For every other
  // category, exclude digest items so monthly summaries don't pollute the
  // industry-news / seobaza-news / guides / opinions listings.
  const newsItems = slug === "digests"
    ? getNewsByCategory(slug as CategorySlug)
    : getNewsByCategory(slug as CategorySlug).filter((n) => n.type !== "digest");

  const items: Item[] = [
    ...articles.map<Item>((a) => ({
      kind: "article",
      url: `/articles/${a.slug}`,
      title: a.title,
      description: a.description,
      author: a.author,
      date: a.date,
      tags: a.tags ?? [],
      readingTime: a.readingTime,
    })),
    ...newsItems.map<Item>((n) => ({
      kind: "news",
      url: n.month ? `/news/${n.year}/${n.month}/${n.slug}` : `/news/${n.year}/${n.slug}`,
      title: n.title,
      description: n.description ?? "",
      author: n.author,
      date: n.date,
      tags: n.tags ?? [],
      readingTime: n.readingTime,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const categoryUrl = `https://seobaza.com.ua/category/${slug}`;

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
            <Link href="/category" className="hover:text-accent transition-colors">
              <span itemProp="name">Категорії</span>
            </Link>
            <link itemProp="item" href="https://seobaza.com.ua/category" />
            <meta itemProp="position" content="1" />
          </span>
          <span>/</span>
          <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span itemProp="name" className="text-foreground">{category.displayName}</span>
            <link itemProp="item" href={categoryUrl} />
            <meta itemProp="position" content="2" />
          </span>
        </nav>

        {/* Pillar header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-display mb-4 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            {category.displayName}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {category.description}
          </p>
          {items.length > 0 && (
            <p className="mt-3 text-sm text-muted-foreground">
              {items.length} матеріал{items.length === 1 ? "" : items.length < 5 ? "и" : "ів"}
            </p>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              У цій категорії поки що немає матеріалів.
            </p>
            <Link
              href="/articles"
              className="text-primary hover:text-accent underline transition-colors text-sm"
            >
              Переглянути всі статті
            </Link>
          </div>
        ) : (
          <div
            className="grid gap-6"
            itemScope
            itemType="https://schema.org/ItemList"
          >
            <meta itemProp="numberOfItems" content={String(items.length)} />
            {items.map((item, i) => (
              <div
                key={item.url}
                className="relative group"
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                <meta itemProp="position" content={String(i + 1)} />
                <link itemProp="url" href={`https://seobaza.com.ua${item.url}`} />
                {/* Overlay link for whole-card click — z-10 puts it above the
                    article content; nested tag links use z-20 to escape it. */}
                <Link
                  href={item.url}
                  className="absolute inset-0 z-10 rounded-xl"
                  aria-label={item.title}
                />
                <article className="relative bg-secondary/30 rounded-xl p-6 border border-border transition-all group-hover:border-accent/50 group-hover:shadow-lg group-hover:shadow-accent/10">
                  <span
                    className={`relative z-20 inline-block mb-3 px-2 py-0.5 text-xs font-medium rounded-full ${
                      item.kind === "article"
                        ? "bg-primary/10 text-primary"
                        : "bg-accent/10 text-accent"
                    }`}
                  >
                    {item.kind === "article" ? "Стаття" : "Новина"}
                  </span>
                  <h2
                    itemProp="name"
                    className="text-2xl font-display mb-2 group-hover:text-accent transition-colors"
                  >
                    {item.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                    <span>{item.author}</span>
                    <span>•</span>
                    <time dateTime={item.date}>
                      {new Date(item.date).toLocaleDateString("uk-UA", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    {item.readingTime && (
                      <>
                        <span>•</span>
                        <span>{item.readingTime} хв</span>
                      </>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {item.description}
                    </p>
                  )}
                  {item.tags.length > 0 && (
                    <div className="relative z-20 flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
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
