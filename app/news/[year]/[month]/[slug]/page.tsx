import { notFound } from "next/navigation";
import Link from "next/link";
import { getNewsPostPaths, getNewsBySlug, getRelatedNews, getOtherPostsInSameMonth } from "@/lib/news";
import { getAuthorSlugByName } from "@/lib/authors";
import { getTagDisplayName, getCategoryDisplayName } from "@/lib/taxonomy";
import { ukMonthName, digestUrl } from "@/lib/months";
import { isoDate } from "@/lib/schema-rdfa";
import { buildOgImage } from "@/lib/og-image";
import { TelegramComments } from "@/components/telegram-comments";
import { MdxImg, MdxLink } from "@/components/mdx-img";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

const mdxComponents = { img: MdxImg, a: MdxLink };

export async function generateStaticParams() {
  return getNewsPostPaths();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string; month: string; slug: string }>;
}): Promise<Metadata> {
  const { year, month, slug } = await params;
  try {
    const item = getNewsBySlug(year, slug, month);
    const url = `https://seobaza.com.ua/news/${year}/${month}/${slug}`;
    const og = buildOgImage(item.image, item.h1 || item.title);
    return {
      title: `${item.title} — SEO BAZA`,
      description: item.description,
      alternates: { canonical: url },
      openGraph: {
        title: item.title,
        description: item.description,
        url,
        siteName: "SEO BAZA",
        locale: "uk_UA",
        type: "article",
        publishedTime: isoDate(item.date),
        modifiedTime: isoDate(item.date),
        authors: [item.author],
        images: [{ url: og.url, width: og.width, height: og.height, alt: og.alt, type: og.type }],
        tags: item.tags,
        section: getCategoryDisplayName(item.category),
      },
      twitter: {
        card: "summary_large_image",
        title: item.title,
        description: item.description,
        images: [{ url: og.url, alt: og.alt }],
      },
    };
  } catch {
    return { title: "Новину не знайдено — SEO BAZA" };
  }
}

export default async function NewsPostPage({
  params,
}: {
  params: Promise<{ year: string; month: string; slug: string }>;
}) {
  const { year, month, slug } = await params;

  let item;
  try {
    item = getNewsBySlug(year, slug, month);
  } catch {
    notFound();
  }

  const h1Title = item.h1 || item.title;
  const monthName = ukMonthName(month);
  const digestHref = digestUrl(year, month);
  const relatedNews = getRelatedNews(slug, 3);
  const monthSiblings = getOtherPostsInSameMonth(year, month, slug, 6);

  const pageUrl = `https://seobaza.com.ua/news/${year}/${month}/${slug}`;
  const authorSlug = getAuthorSlugByName(item.author);
  const authorUrl = authorSlug ? `https://seobaza.com.ua/authors/${authorSlug}` : undefined;
  const ogImage = item.image ? `https://seobaza.com.ua${item.image}` : "https://seobaza.com.ua/og-image.png";

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article
        className="max-w-3xl mx-auto"
        itemScope
        itemType="https://schema.org/NewsArticle"
        itemID={pageUrl}
      >
        <meta itemProp="mainEntityOfPage" content={pageUrl} />
        <meta itemProp="datePublished" content={isoDate(item.date)} />
        <meta itemProp="dateModified" content={isoDate(item.date)} />
        <meta itemProp="image" content={ogImage} />
        <meta itemProp="inLanguage" content="uk-UA" />
        <div
          className="hidden"
          itemProp="publisher"
          itemScope
          itemType="https://schema.org/Organization"
          itemID="https://seobaza.com.ua/"
        >
          <meta itemProp="name" content="SEO BAZA" />
          <link itemProp="url" href="https://seobaza.com.ua/" />
          <div itemProp="logo" itemScope itemType="https://schema.org/ImageObject">
            <link itemProp="url" href="https://seobaza.com.ua/seobaza.png" />
          </div>
        </div>

        {/* Breadcrumbs — microdata BreadcrumbList for Google rich-results */}
        <nav
          className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-8"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link href="/news" className="hover:text-accent transition-colors">
              <span itemProp="name">Новини</span>
            </Link>
            <link itemProp="item" href="https://seobaza.com.ua/news" />
            <meta itemProp="position" content="1" />
          </span>
          <span>/</span>
          <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link href={`/news/${year}`} className="hover:text-accent transition-colors">
              <span itemProp="name">{year}</span>
            </Link>
            <link itemProp="item" href={`https://seobaza.com.ua/news/${year}`} />
            <meta itemProp="position" content="2" />
          </span>
          <span>/</span>
          <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link href={`/news/${year}/${month}`} className="hover:text-accent transition-colors">
              <span itemProp="name">{monthName}</span>
            </Link>
            <link itemProp="item" href={`https://seobaza.com.ua/news/${year}/${month}`} />
            <meta itemProp="position" content="3" />
          </span>
          <span>/</span>
          <span
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
            className="text-foreground truncate max-w-[240px]"
          >
            <span itemProp="name">{item.title}</span>
            <link itemProp="item" href={pageUrl} />
            <meta itemProp="position" content="4" />
          </span>
        </nav>

        <header className="mb-8">
          {/* Category badge — matches the pattern on /articles/[slug] */}
          {item.category && (
            <Link
              href={`/category/${item.category}`}
              className="inline-block mb-4 px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
            >
              {getCategoryDisplayName(item.category)}
            </Link>
          )}

          <h1
            itemProp="headline name"
            className="text-4xl sm:text-5xl font-display mb-4 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent"
          >
            {h1Title}
          </h1>

          <meta itemProp="description" content={item.description} />

          {/* Hidden Person (author) — microdata item nested via itemProp. */}
          <div
            className="hidden"
            itemProp="author"
            itemScope
            itemType="https://schema.org/Person"
            {...(authorUrl ? { itemID: authorUrl } : {})}
          >
            <meta itemProp="name" content={item.author} />
            {(!item.author || item.author === "Олеся Коробка") && (
              <meta itemProp="alternateName" content="Olesia Korobka" />
            )}
            {authorUrl && <link itemProp="url" href={authorUrl} />}
          </div>

          {/* Visible byline — plain UI, no RDFa attributes */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
            {(() => {
              if (authorSlug) {
                return (
                  <Link
                    href={`/authors/${authorSlug}`}
                    className="font-medium hover:text-accent transition-colors"
                  >
                    {item.author}
                  </Link>
                );
              }
              if (item.authorLink) {
                return (
                  <a
                    href={item.authorLink}
                    target="_blank"
                    className="font-medium hover:text-accent transition-colors"
                  >
                    {item.author}
                  </a>
                );
              }
              return <span className="font-medium">{item.author}</span>;
            })()}
            <span>·</span>
            <time dateTime={item.date}>
              {new Date(item.date).toLocaleDateString("uk-UA", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            {item.readingTime && (
              <>
                <span>·</span>
                <span>{item.readingTime} хв читання</span>
              </>
            )}
          </div>

          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
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
        </header>

        <div className="prose prose-lg dark:prose-invert max-w-none" itemProp="articleBody">
          <MDXRemote
            source={item.content}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSlug],
              },
            }}
          />
        </div>
      </article>

      {/* Auxiliary sections OUTSIDE the <article> so external links here don't
          leak into the NewsArticle's RDFa scope ( etc.) */}
      <div className="max-w-3xl mx-auto">

        {/* Telegram comments — lazy-loaded when scrolled into view */}
        {item.telegramMessageId && (
          <TelegramComments
            channel="SEOBAZA"
            postId={item.telegramMessageId}
          />
        )}

        {/* Related news */}
        {relatedNews.length > 0 && (
          <section className="mt-12 pt-8 border-t border-border">
            <h2 className="text-2xl font-display mb-6">Схожі новини</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedNews.map((rel) => (
                <Link
                  key={rel.slug}
                  href={
                    rel.month
                      ? `/news/${rel.year}/${rel.month}/${rel.slug}`
                      : `/news/${rel.year}/${rel.slug}`
                  }
                  className="block group"
                >
                  <div className="h-full bg-secondary/30 rounded-xl p-4 border border-border transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10">
                    <h3 className="text-sm font-display mb-2 group-hover:text-accent transition-colors line-clamp-3">
                      {rel.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <time dateTime={rel.date}>
                        {new Date(rel.date).toLocaleDateString("uk-UA", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                      {rel.readingTime && (
                        <>
                          <span>·</span>
                          <span>{rel.readingTime} хв</span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* More from this month */}
        {monthSiblings.length > 0 && (
          <section className="mt-12 pt-8 border-t border-border">
            <h2 className="text-2xl font-display mb-2">
              Більше за {monthName.toLowerCase()} {year}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Інші новини того ж місяця
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {monthSiblings.map((sib) => (
                <li key={sib.slug}>
                  <Link
                    href={
                      sib.month
                        ? `/news/${sib.year}/${sib.month}/${sib.slug}`
                        : `/news/${sib.year}/${sib.slug}`
                    }
                    className="block py-2 px-3 rounded-lg hover:bg-secondary/40 transition-colors group"
                  >
                    <span className="text-sm group-hover:text-accent transition-colors line-clamp-2">
                      {sib.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Back navigation */}
        <div className="mt-12 pt-8 border-t border-border">
          <Link
            href={digestHref}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {monthName} {year} — всі новини
          </Link>
        </div>
      </div>
    </div>
  );
}
