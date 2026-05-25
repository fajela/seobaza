import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllTagSlugs, getArticlesByTag } from "@/lib/articles";
import { getNewsByTag } from "@/lib/news";
import { getTagMeta, getTagDisplayName, getCategoryDisplayName } from "@/lib/taxonomy";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const slugs = getAllTagSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const displayName = getTagDisplayName(slug);

  return {
    title: `${displayName} — Статті за тегом — SEO BAZA`,
    description: `Статті українського SEO-ком'юніті за темою "${displayName}". Практичні матеріали від SEO BAZA.`,
    alternates: {
      canonical: `https://seobaza.com.ua/tags/${slug}`,
    },
    openGraph: {
      title: `${displayName} — SEO BAZA`,
      description: `Статті за тегом "${displayName}"`,
      url: `https://seobaza.com.ua/tags/${slug}`,
      siteName: "SEO BAZA",
      locale: "uk_UA",
      type: "website",
    },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const articles = getArticlesByTag(slug);
  const newsItems = getNewsByTag(slug).filter((n) => n.type !== "digest");

  // Merge into a single list with URL prefix; sort by date desc
  type Item = {
    kind: "article" | "news";
    url: string;
    title: string;
    description: string;
    author: string;
    date: string;
    tags: string[];
    category?: string;
    readingTime?: number;
  };
  const items: Item[] = [
    ...articles.map<Item>((a) => ({
      kind: "article",
      url: `/articles/${a.slug}`,
      title: a.title,
      description: a.description,
      author: a.author,
      date: a.date,
      tags: a.tags ?? [],
      category: a.category,
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
      category: n.category,
      readingTime: n.readingTime,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // 404 if tag slug is not known AND nothing tagged
  const tagMeta = getTagMeta(slug);
  if (!tagMeta && items.length === 0) notFound();

  const displayName = getTagDisplayName(slug);
  const tagUrl = `https://seobaza.com.ua/tags/${slug}`;

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
            <Link href="/tags" className="hover:text-accent transition-colors">
              <span itemProp="name">Теги</span>
            </Link>
            <link itemProp="item" href="https://seobaza.com.ua/tags" />
            <meta itemProp="position" content="1" />
          </span>
          <span>/</span>
          <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span itemProp="name" className="text-foreground">{displayName}</span>
            <link itemProp="item" href={tagUrl} />
            <meta itemProp="position" content="2" />
          </span>
        </nav>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 text-sm font-medium bg-accent/10 text-accent rounded-full">
              {displayName}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display mb-4 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            Статті за тегом
          </h1>
          {items.length > 0 && (
            <p className="text-muted-foreground">
              {items.length} матеріал{items.length === 1 ? "" : items.length < 5 ? "и" : "ів"}
            </p>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              За цим тегом поки що немає матеріалів.
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
                {/* Overlay link for whole-card click — z-10 over content; inner
                    pills/links use z-20 to stay clickable. */}
                <Link
                  href={item.url}
                  className="absolute inset-0 z-10 rounded-xl"
                  aria-label={item.title}
                />
                <article className="relative bg-secondary/30 rounded-xl p-6 border border-border transition-all group-hover:border-accent/50 group-hover:shadow-lg group-hover:shadow-accent/10">
                  <div className="relative z-20 flex items-center gap-2 mb-3">
                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                      item.kind === "article"
                        ? "bg-primary/10 text-primary"
                        : "bg-accent/10 text-accent"
                    }`}>
                      {item.kind === "article" ? "Стаття" : "Новина"}
                    </span>
                    {item.category && (
                      <Link
                        href={`/category/${item.category}`}
                        className="inline-block px-2 py-0.5 text-xs font-medium bg-secondary text-muted-foreground rounded-full hover:bg-primary/20 hover:text-primary transition-colors"
                      >
                        {getCategoryDisplayName(item.category)}
                      </Link>
                    )}
                  </div>
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
                      {item.tags.map((t) => (
                        <Link
                          key={t}
                          href={`/tags/${t}`}
                          className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                            t === slug
                              ? "bg-accent text-background"
                              : "bg-accent/10 text-accent hover:bg-accent/20"
                          }`}
                        >
                          {getTagDisplayName(t)}
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
