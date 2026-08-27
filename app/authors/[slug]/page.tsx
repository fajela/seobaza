import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAuthorSlugs,
  getAuthorBySlug,
  getArticlesByAuthorName,
  getNewsByAuthorName,
  altNames,
  absoluteUrl,
  profileUrls,
  hiddenSameAs,
  googleKgUrl,
} from "@/lib/authors";
import { getTagDisplayName } from "@/lib/taxonomy";
import { MdxImg, MdxLink } from "@/components/mdx-img";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

const mdxComponents = { img: MdxImg, a: MdxLink };

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
  const latinNames = altNames(author.alternateName);
  // When the person is a node of the SEO Baza knowledge graph, the entity home
  // is /kg/person/<kgId>: this page becomes a CollectionPage of their work and
  // references that single Person entity instead of minting a second one.
  const kgPersonUrl = author.kgId
    ? `https://seobaza.com.ua/kg/person/${author.kgId}`
    : null;

  return (
    <div
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-12"
      itemScope
      itemType={
        kgPersonUrl
          ? "https://schema.org/CollectionPage"
          : "https://schema.org/ProfilePage"
      }
      itemID={`${authorUrl}#${kgPersonUrl ? "collectionpage" : "profilepage"}`}
    >
      <div
        className="max-w-4xl mx-auto"
        itemProp={kgPersonUrl ? "about" : "mainEntity"}
        itemScope
        itemType="https://schema.org/Person"
        itemID={kgPersonUrl ? `${kgPersonUrl}#person` : `${authorUrl}#person`}
      >
        <meta itemProp="url" content={kgPersonUrl ?? authorUrl} />
        {/* Google Knowledge Graph MID: ties this page to the entity Google
            already holds, so both spellings of the name resolve to one thing. */}
        {author.googleKgId && (
          <span itemProp="identifier" itemScope itemType="https://schema.org/PropertyValue">
            <meta itemProp="propertyID" content="Google Knowledge Graph ID" />
            <meta itemProp="value" content={author.googleKgId} />
          </span>
        )}
        {/* sameAs values that belong in the markup only, never as a chip. */}
        {hiddenSameAs(author).map((url) => (
          <link key={url} itemProp="sameAs" href={url} />
        ))}

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
        {/* Header: h1 first in the DOM, avatar after it (order-first keeps it visually left) */}
        <div className="flex flex-col sm:flex-row gap-6 mb-10 p-6 rounded-xl border border-border bg-secondary/20">
          <div className="flex-1">
            <h1 className="text-3xl font-display mb-1" itemProp="name">
              {author.name}
            </h1>
            {latinNames.length > 0 && (
              <p className="text-muted-foreground mb-1">
                {latinNames.map((n, i) => (
                  <span key={n}>
                    {i > 0 && ", "}
                    <span itemProp="alternateName">{n}</span>
                  </span>
                ))}
              </p>
            )}
            <p className="text-muted-foreground mb-3">
              <span itemProp="jobTitle">{author.role}</span>
              {author.company && (
                <span itemProp="worksFor" itemScope itemType="https://schema.org/Organization">
                  {author.companyGoogleKgId && (
                    <link itemProp="sameAs" href={googleKgUrl(author.companyGoogleKgId)} />
                  )}
                  {" · "}
                  {author.companyUrl ? (
                    <a
                      href={author.companyUrl}
                      target="_blank"
                      itemProp="url"
                      className="hover:text-accent transition-colors"
                    >
                      <span itemProp="name">{author.company}</span>
                    </a>
                  ) : (
                    <span itemProp="name">{author.company}</span>
                  )}
                </span>
              )}
              {author.city && (
                <span itemProp="homeLocation" itemScope itemType="https://schema.org/Place">
                  {" · "}
                  <span itemProp="name">{author.city}</span>
                </span>
              )}
            </p>

            {/* Social links — visual only. The markup lives in the deduped
                profile list below, so one URL is never a sameAs twice. */}
            <div className="flex flex-wrap gap-3 mb-4">
              {author.telegram && (
                <a
                  href={author.telegram}
                  target="_blank"
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
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  X / Twitter
                </a>
              )}
              {author.instagram && (
                <a
                  href={author.instagram}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                  Instagram
                </a>
              )}
              {author.facebook && (
                <a
                  href={author.facebook}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </a>
              )}
              {author.website && (
                <a
                  href={author.website}
                  target="_blank"
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
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Fajela
                </a>
              )}
              {author.kgId && (
                <Link
                  href={`/kg/person/${author.kgId}`}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M13.828 10.172a4 4 0 010 5.656l-3 3a4 4 0 01-5.656-5.656l1.5-1.5m8.828-1.672a4 4 0 000-5.656 4 4 0 00-5.656 0l-1.5 1.5" />
                  </svg>
                  Профіль у графі знань
                </Link>
              )}
            </div>

            {/* Bio */}
            <p className="text-muted-foreground" itemProp="description">{author.bio}</p>
            {/* knowsAbout — topics the author is expert in (uses tag slugs) */}
            {author.expertise.map((tag) => (
              <meta key={tag} itemProp="knowsAbout" content={getTagDisplayName(tag)} />
            ))}
            {!author.company && (
              <meta itemProp="worksFor" content="SEO BAZA" />
            )}
          </div>

          {/* Avatar — uses author.image when set; falls back to the initial letter.
              The markup value goes out separately, as an absolute URL. */}
          {author.image && <link itemProp="image" href={absoluteUrl(author.image)} />}
          {author.image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={author.image}
              srcSet={`/_next/image?url=${encodeURIComponent(author.image)}&w=96&q=75 1x, /_next/image?url=${encodeURIComponent(author.image)}&w=256&q=75 2x`}
              alt={author.name}
              width={96}
              height={96}
              fetchPriority="high"
              className="order-first w-24 h-24 rounded-full object-cover shrink-0 border border-border"
            />
          ) : (
            <div className="order-first w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center text-accent font-display text-3xl shrink-0">
              {author.name.charAt(0)}
            </div>
          )}
        </div>

        {/* Expertise: linked tag chips + free-form knowsAbout topics */}
        {(author.expertise.length > 0 || (author.topics?.length ?? 0) > 0) && (
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
              {author.topics?.filter((t) => !author.expertise.some((tag) => getTagDisplayName(tag).toLowerCase() === t.toLowerCase())).map((t) => (
                <span
                  key={t}
                  itemProp="knowsAbout"
                  className="px-3 py-1.5 text-sm bg-muted text-muted-foreground rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Extended MDX bio: key facts, notable work, talks */}
        {author.content.trim().length > 0 && (
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <MDXRemote
              source={author.content}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [rehypeSlug],
                },
              }}
            />
          </div>
        )}

        {/* All profiles: socials + speaker pages, mentor profiles, catalogs */}
        {(() => {
          const allProfiles = profileUrls(author);
          const profileLabel = (url: string): string => {
            const host = url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0];
            const known: Record<string, string> = {
              "t.me": "Telegram",
              "linkedin.com": "LinkedIn",
              "instagram.com": "Instagram",
              "facebook.com": "Facebook",
              "x.com": "X",
              "twitter.com": "X",
              "youtube.com": "YouTube",
              "nazahid.com": "НаЗахід",
              "conference.collaborator.pro": "Collaborator Conference",
              "collaborator.pro": "Collaborator",
              "prjctr.com": "Projector",
              "theways.io": "TheWays",
              "flyerone.vc": "Flyer One Ventures",
              "affcatalog.com": "AFFCatalog",
              "fajela.com": "Fajela",
              "bsky.app": "Bluesky",
            };
            return known[host] ?? host;
          };
          return allProfiles.length > 0 ? (
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-4">Профілі та згадки</h2>
            <div className="flex flex-wrap gap-2">
              {allProfiles.map((url) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener"
                  itemProp="sameAs"
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm border border-border rounded-full text-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  {profileLabel(url)}
                  <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M7 7h10v10" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
          ) : null;
        })()}

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
