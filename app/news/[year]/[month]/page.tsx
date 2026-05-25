import { notFound } from "next/navigation";
import Link from "next/link";
import { getNewsYears, getMonthsForYear, getNewsSlugsForMonth, getNewsBySlug } from "@/lib/news";
import { ukMonthName } from "@/lib/months";
import type { Metadata } from "next";

/**
 * Month archive page at /news/[year]/[month]. Plain list of all posts in
 * content/news/[year]/[month]/ folder — including the auto-generated monthly
 * combined-short-posts post (seo-novyny-[uk-month]-[year]).
 * No byline, no reading-time. This is an archive list.
 */

export async function generateStaticParams() {
  const out: Array<{ year: string; month: string }> = [];
  for (const year of getNewsYears()) {
    for (const month of getMonthsForYear(year)) {
      out.push({ year, month });
    }
  }
  return out;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}): Promise<Metadata> {
  const { year, month } = await params;
  const monthName = ukMonthName(month);
  const url = `https://seobaza.com.ua/news/${year}/${month}`;
  return {
    title: `SEO новини: ${monthName} ${year} — SEO BAZA`,
    description: `Усі SEO-новини за ${monthName.toLowerCase()} ${year} року.`,
    alternates: { canonical: url },
    openGraph: {
      title: `SEO новини: ${monthName} ${year}`,
      description: `Усі SEO-новини за ${monthName.toLowerCase()} ${year} року.`,
      url,
      siteName: "SEO BAZA",
      locale: "uk_UA",
      type: "website",
    },
  };
}

export default async function NewsMonthPage({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year, month } = await params;
  const monthName = ukMonthName(month);

  // Long-form posts that have individual pages
  const longSlugs = getNewsSlugsForMonth(year, month);
  const longPosts = longSlugs
    .map((slug) => {
      try {
        return getNewsBySlug(year, slug, month);
      } catch {
        return null;
      }
    })
    .filter((p): p is NonNullable<typeof p> => p !== null)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (longPosts.length === 0) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumbs — microdata BreadcrumbList */}
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
            <span itemProp="name" className="text-foreground">{monthName}</span>
            <link itemProp="item" href={`https://seobaza.com.ua/news/${year}/${month}`} />
            <meta itemProp="position" content="3" />
          </span>
        </nav>

        <h1 className="text-4xl sm:text-5xl font-display mb-2 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          {monthName} {year}
        </h1>
        <p className="text-muted-foreground mb-10">
          {longPosts.length} {longPosts.length === 1 ? "стаття" : longPosts.length < 5 ? "статті" : "статей"}
        </p>

        {/* Long-form posts — clickable cards, wrapped in ItemList microdata */}
        {longPosts.length > 0 && (
          <section
            className="mb-12"
            itemScope
            itemType="https://schema.org/ItemList"
          >
            <meta itemProp="numberOfItems" content={String(longPosts.length)} />
            <meta itemProp="itemListOrder" content="https://schema.org/ItemListOrderAscending" />
            <div className="grid gap-3">
              {longPosts.map((p, i) => {
                const postUrl = `https://seobaza.com.ua/news/${year}/${month}/${p.slug}`;
                return (
                  <div
                    key={p.slug}
                    itemProp="itemListElement"
                    itemScope
                    itemType="https://schema.org/ListItem"
                  >
                    <meta itemProp="position" content={String(i + 1)} />
                    <link itemProp="url" href={postUrl} />
                    <Link
                      href={`/news/${year}/${month}/${p.slug}`}
                      className="block group"
                    >
                      <article className="p-4 rounded-xl border border-border bg-secondary/20 hover:border-accent/50 hover:bg-secondary/40 transition-all">
                        <h2
                          itemProp="name"
                          className="font-medium group-hover:text-accent transition-colors line-clamp-2"
                        >
                          {p.title}
                        </h2>
                        {p.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {p.description}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <time dateTime={p.date}>
                            {new Date(p.date).toLocaleDateString("uk-UA", {
                              month: "long",
                              day: "numeric",
                            })}
                          </time>
                          {p.readingTime && (
                            <>
                              <span>·</span>
                              <span>{p.readingTime} хв</span>
                            </>
                          )}
                        </div>
                      </article>
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Back to year */}
        <div className="mt-12 pt-8 border-t border-border">
          <Link
            href={`/news/${year}`}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Всі новини {year}
          </Link>
        </div>
      </div>
    </div>
  );
}
