import { notFound } from "next/navigation";
import Link from "next/link";
import { getNewsYears, getNewsByYear, getMonthsForYear } from "@/lib/news";
import { ukMonthName } from "@/lib/months";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return getNewsYears().map((year) => ({ year }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string }>;
}): Promise<Metadata> {
  const { year } = await params;
  return {
    title: `SEO новини ${year} — SEO BAZA`,
    description: `Усі SEO-новини за ${year} рік від спільноти SEO BAZA.`,
    alternates: { canonical: `https://seobaza.com.ua/news/${year}` },
  };
}

export default async function NewsYearPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  const allItems = getNewsByYear(year);
  if (allItems.length === 0) notFound();

  const posts   = allItems.filter((n) => n.type === "news");
  const digests = allItems.filter((n) => n.type === "digest");
  const months  = getMonthsForYear(year);

  // Count posts per month for the navigation chips
  const postsByMonth = new Map<string, number>();
  for (const p of posts) {
    if (p.month) postsByMonth.set(p.month, (postsByMonth.get(p.month) ?? 0) + 1);
  }

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
            <Link href="/news" className="hover:text-accent transition-colors">
              <span itemProp="name">Новини</span>
            </Link>
            <link itemProp="item" href="https://seobaza.com.ua/news" />
            <meta itemProp="position" content="1" />
          </span>
          <span>/</span>
          <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span itemProp="name" className="text-foreground">{year}</span>
            <link itemProp="item" href={`https://seobaza.com.ua/news/${year}`} />
            <meta itemProp="position" content="2" />
          </span>
        </nav>

        <h1 className="text-4xl sm:text-5xl font-display mb-4 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Новини {year}
        </h1>
        <p className="text-muted-foreground mb-6">
          {posts.length} {posts.length === 1 ? "публікація" : posts.length < 5 ? "публікації" : "публікацій"}
        </p>

        {/* Month navigation — jump straight to /news/[year]/[month] */}
        {months.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {months.map((mm) => {
              const count = postsByMonth.get(mm) ?? 0;
              return (
                <Link
                  key={mm}
                  href={`/news/${year}/${mm}`}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg border border-border bg-secondary/20 hover:border-accent/50 hover:bg-secondary/40 transition-all"
                >
                  {ukMonthName(mm)}
                  {count > 0 && (
                    <span className="ml-1.5 text-xs text-muted-foreground">({count})</span>
                  )}
                </Link>
              );
            })}
          </div>
        )}

        <div className="space-y-16">

          {/* ── Individual posts ── */}
          {posts.length > 0 && (
            <section>
              <div
                className="grid gap-3"
                itemScope
                itemType="https://schema.org/ItemList"
              >
                <meta itemProp="numberOfItems" content={String(posts.length)} />
                {posts.map((item, i) => {
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
                        <h2
                          itemProp="name"
                          className="font-medium group-hover:text-accent transition-colors line-clamp-2"
                        >
                          {item.title}
                        </h2>
                        {item.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <time dateTime={item.date}>
                            {new Date(item.date).toLocaleDateString("uk-UA", {
                              month: "long",
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
            </section>
          )}

          {/* ── Monthly digests ── */}
          {digests.length > 0 && (
            <section>
              <h2 className="text-xl font-display mb-4 text-muted-foreground">
                Місячні дайджести {year}
              </h2>
              <div
                className="grid sm:grid-cols-2 gap-3"
                itemScope
                itemType="https://schema.org/ItemList"
              >
                <meta itemProp="numberOfItems" content={String(digests.length)} />
                {digests.map((item, i) => {
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
                              {item.itemCount} постів
                            </span>
                          )}
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
}
