import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  getAuthorSlugs,
  getAuthorBySlug,
  getArticlesByAuthorName,
  getNewsByAuthorName,
} from "@/lib/authors";
import { getTagDisplayName } from "@/lib/taxonomy";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return getAuthorSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const author = getAuthorBySlug(slug);
    return {
      title: `${author.name} — Автор SEO BAZA`,
      description: author.bio,
      alternates: { canonical: `https://seobaza.com.ua/authors/${slug}` },
      openGraph: {
        title: `${author.name} — SEO BAZA`,
        description: author.bio,
        url: `https://seobaza.com.ua/authors/${slug}`,
        siteName: "SEO BAZA",
        locale: "uk_UA",
        type: "profile",
      },
    };
  } catch {
    return { title: "Автора не знайдено — SEO BAZA" };
  }
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let author;
  try {
    author = getAuthorBySlug(slug);
  } catch {
    notFound();
  }

  const articles = getArticlesByAuthorName(author.name);
  const allByAuthor = getNewsByAuthorName(author.name);
  // Split news items from digests so each section is labelled correctly —
  // `getNewsByAuthorName` returns both types in one bag.
  const newsItems = allByAuthor.filter((n) => n.type !== "digest");
  const digests = allByAuthor.filter((n) => n.type === "digest");
  const totalCount = articles.length + newsItems.length + digests.length;

  const authorUrl = `https://seobaza.com.ua/authors/${slug}`;

  return (
    <div
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-12"
      {...{ vocab: "https://schema.org/", typeof: "ProfilePage", resource: authorUrl }}
    >
      <div
        className="max-w-4xl mx-auto"
        {...{ property: "mainEntity", typeof: "Person", resource: authorUrl }}
      >
        <span className="hidden" property="url" content={authorUrl} />

        {/* Breadcrumbs — microdata BreadcrumbList */}
        <nav
          className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-8"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link href="/authors" className="hover:text-accent transition-colors">
              <span itemProp="name">Автори</span>
            </Link>
            <link itemProp="item" href="https://seobaza.com.ua/authors" />
            <meta itemProp="position" content="1" />
          </span>
          <span>/</span>
          <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span itemProp="name" className="text-foreground">{author.name}</span>
            <link itemProp="item" href={authorUrl} />
            <meta itemProp="position" content="2" />
          </span>
        </nav>

        {/* Profile header */}
        <div className="flex flex-col sm:flex-row gap-6 mb-10 p-6 rounded-xl border border-border bg-secondary/20">
          {/* Avatar — uses author.image when set; falls back to the initial letter */}
          {author.image ? (
            <Image
              src={author.image}
              alt={author.name}
              property="image"
              width={96}
              height={96}
              sizes="96px"
              className="w-24 h-24 rounded-full object-cover shrink-0 border border-border"
              priority
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center text-accent font-display text-3xl shrink-0">
              {author.name.charAt(0)}
            </div>
          )}

          <div className="flex-1">
            <h1 className="text-3xl font-display mb-1" property="name">
              {author.name}
            </h1>
            {author.alternateName && (
              <span className="hidden" property="alternateName" content={author.alternateName} />
            )}
            <p className="text-muted-foreground mb-3" property="jobTitle">{author.role}</p>

            {/* Social links — each is property="sameAs" for the Person */}
            <div className="flex flex-wrap gap-3 mb-4">
              {author.telegram && (
                <a
                  href={author.telegram}
                  target="_blank"
                  property="sameAs"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.932z"/>
                  </svg>
                  Telegram
                </a>
              )}
              {author.linkedin && (
                <a
                  href={author.linkedin}
                  target="_blank"
                  property="sameAs"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </a>
              )}
              {author.twitter && (
                <a
                  href={author.twitter}
                  target="_blank"
                  property="sameAs"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  X / Twitter
                </a>
              )}
              {author.website && (
                <a
                  href={author.website}
                  target="_blank"
                  property="sameAs url"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-9c2.5 3 3.75 5.667 3.75 9s-1.25 6-3.75 9c-2.5-3-3.75-5.667-3.75-9s1.25-6 3.75-9zM3 12h18" />
                  </svg>
                  Особистий сайт
                </a>
              )}
              {author.fajelaAbout && (
                <a
                  href={author.fajelaAbout}
                  target="_blank"
                  property="sameAs"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Fajela
                </a>
              )}
            </div>

            {/* Bio */}
            <p className="text-muted-foreground" property="description">{author.bio}</p>
            {/* knowsAbout — topics the author is expert in (uses tag slugs) */}
            {author.expertise.map((tag) => (
              <span key={tag} className="hidden" property="knowsAbout" content={getTagDisplayName(tag)} />
            ))}
            <span className="hidden" property="worksFor" content="SEO BAZA" />
          </div>
        </div>

        {/* Expertise */}
        {author.expertise.length > 0 && (
          <div className="mb-10">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Напрями
            </h2>
            <div className="flex flex-wrap gap-2">
              {author.expertise.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${tag}`}
                  className="px-3 py-1.5 text-sm bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                >
                  {getTagDisplayName(tag)}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        {totalCount > 0 && (
          <p className="text-sm text-muted-foreground mb-8">
            {totalCount} матеріал{totalCount === 1 ? "" : totalCount < 5 ? "и" : "ів"} на сайті
          </p>
        )}

        {/* Articles */}
        {articles.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-display mb-6">Статті</h2>
            <div
              className="grid gap-4"
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
                  <Link
                    href={`/articles/${article.slug}`}
                    className="absolute inset-0 z-10 rounded-xl"
                    aria-label={article.title}
                  />
                  <div className="relative p-5 rounded-xl border border-border bg-secondary/20 group-hover:border-accent/50 group-hover:bg-secondary/40 transition-all">
                    <h3
                      itemProp="name"
                      className="font-display text-lg mb-1 group-hover:text-accent transition-colors"
                    >
                      {article.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-2">
                      <time dateTime={article.date}>
                        {new Date(article.date).toLocaleDateString("uk-UA", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                      {article.readingTime && <span>· {article.readingTime} хв</span>}
                    </div>
                    {article.tags.length > 0 && (
                      <div className="relative z-20 flex flex-wrap gap-1.5 mt-2">
                        {article.tags.map((tag) => (
                          <Link
                            key={tag}
                            href={`/tags/${tag}`}
                            className="px-2 py-0.5 text-xs bg-accent/10 text-accent rounded-full hover:bg-accent/20 transition-colors"
                          >
                            {getTagDisplayName(tag)}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* News (individual posts) */}
        {newsItems.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-display mb-6">Новини</h2>
            <div
              className="grid gap-4"
              itemScope
              itemType="https://schema.org/ItemList"
            >
              <meta itemProp="numberOfItems" content={String(Math.min(newsItems.length, 12))} />
              {newsItems.slice(0, 12).map((item, i) => {
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
                      <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border bg-secondary/20 hover:border-accent/50 hover:bg-secondary/40 transition-all">
                        <h3
                          itemProp="name"
                          className="font-medium group-hover:text-accent transition-colors truncate"
                        >
                          {item.title}
                        </h3>
                        <time dateTime={item.date} className="shrink-0 text-sm text-muted-foreground">
                          {new Date(item.date).toLocaleDateString("uk-UA", {
                            year: "numeric",
                            month: "short",
                          })}
                        </time>
                      </div>
                    </Link>
                  </div>
                );
              })}
              {newsItems.length > 12 && (
                <Link
                  href="/news"
                  className="text-sm text-primary hover:text-accent transition-colors"
                >
                  Переглянути всі {newsItems.length} новин →
                </Link>
              )}
            </div>
          </section>
        )}

        {/* News digests */}
        {digests.length > 0 && (
          <section>
            <h2 className="text-2xl font-display mb-6">Дайджести</h2>
            <div
              className="grid gap-4"
              itemScope
              itemType="https://schema.org/ItemList"
            >
              <meta itemProp="numberOfItems" content={String(Math.min(digests.length, 12))} />
              {digests.slice(0, 12).map((item, i) => {
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
                      <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border bg-secondary/20 hover:border-accent/50 hover:bg-secondary/40 transition-all">
                        <h3
                          itemProp="name"
                          className="font-medium group-hover:text-accent transition-colors truncate"
                        >
                          {item.title}
                        </h3>
                        <time dateTime={item.date} className="shrink-0 text-sm text-muted-foreground">
                          {new Date(item.date).toLocaleDateString("uk-UA", {
                            year: "numeric",
                            month: "short",
                          })}
                        </time>
                      </div>
                    </Link>
                  </div>
                );
              })}
              {digests.length > 12 && (
                <Link
                  href="/news"
                  className="text-sm text-primary hover:text-accent transition-colors"
                >
                  Переглянути всі {digests.length}{" "}
                  {digests.length === 1 ? "дайджест" : digests.length < 5 ? "дайджести" : "дайджестів"} →
                </Link>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
