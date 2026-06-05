import { notFound } from "next/navigation";
import { getAllArticles, getArticleBySlug, getRelatedArticles } from "@/lib/articles";
import { getAuthorSlugByName } from "@/lib/authors";
import { getTagDisplayName, getCategoryDisplayName } from "@/lib/taxonomy";
import { TelegramComments } from "@/components/telegram-comments";
import { MdxImg, MdxLink } from "@/components/mdx-img";
import { KgProfileTool } from "@/components/kg-profile-tool";
import { NewsletterForm } from "@/components/newsletter-form";
import { buildOgImage } from "@/lib/og-image";
import { isoDate } from "@/lib/schema-rdfa";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { slug } from "github-slugger";

const mdxComponents = { img: MdxImg, a: MdxLink, KgProfileTool };

// Custom slug function with transliteration (kept for potential future use)
function customSlugger(text: string): string {
  const translitMap: { [key: string]: string } = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'h', 'ґ': 'g', 'д': 'd', 'е': 'e', 'є': 'ie',
    'ж': 'zh', 'з': 'z', 'и': 'y', 'і': 'i', 'ї': 'i', 'й': 'i', 'к': 'k', 'л': 'l',
    'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ь': '', 'ю': 'iu',
    'я': 'ia', 'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'H', 'Ґ': 'G', 'Д': 'D', 'Е': 'E',
    'Є': 'Ie', 'Ж': 'Zh', 'З': 'Z', 'И': 'Y', 'І': 'I', 'Ї': 'I', 'Й': 'I', 'К': 'K',
    'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T',
    'У': 'U', 'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch', 'Ь': '',
    'Ю': 'Iu', 'Я': 'Ia'
  };
  let transliterated = text.split('').map(char => translitMap[char] || char).join('');
  return slug(transliterated);
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const article = getArticleBySlug(slug);
    const url = `https://seobaza.com.ua/articles/${slug}`;
    const og = buildOgImage(article.image, article.h1 || article.title);

    return {
      title: `${article.title} - SEO BAZA`,
      description: article.description,
      authors: [{ name: article.author }],
      alternates: {
        canonical: url,
      },
      openGraph: {
        title: article.title,
        description: article.description,
        url: url,
        siteName: "SEO BAZA",
        locale: "uk_UA",
        type: "article",
        publishedTime: isoDate(article.date),
        modifiedTime: isoDate(article.date),
        authors: [article.author],
        section: article.category ? getCategoryDisplayName(article.category) : undefined,
        tags: article.tags,
        images: [
          {
            url: og.url,
            width: og.width,
            height: og.height,
            alt: og.alt,
            type: og.type,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: article.title,
        description: article.description,
        images: [{ url: og.url, alt: og.alt }],
      },
    };
  } catch {
    return {
      title: "Стаття не знайдена - SEO BAZA",
    };
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let article;
  try {
    article = getArticleBySlug(slug);
  } catch {
    notFound();
  }

  const relatedArticles = getRelatedArticles(slug, 3);

  // Use h1 from frontmatter or extract from content
  const h1Title = article.h1 || article.title;
  const h1Match = article.content.match(/^#\s+(.+)$/m);
  const contentWithoutH1 = h1Match
    ? article.content.replace(/^#\s+.+$/m, '').trim()
    : article.content;

  const pageUrl = `https://seobaza.com.ua/articles/${slug}`;
  const articleAuthorSlug = getAuthorSlugByName(article.author);
  const articleAuthorUrl = articleAuthorSlug
    ? `https://seobaza.com.ua/authors/${articleAuthorSlug}`
    : undefined;
  const articleOgImage = article.image
    ? `https://seobaza.com.ua${article.image}`
    : "https://seobaza.com.ua/og-image.png";

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article
        className="max-w-3xl mx-auto"
        itemScope
        itemType="https://schema.org/Article"
      >
        <meta itemProp="mainEntityOfPage" content={pageUrl} />
        <meta itemProp="datePublished" content={isoDate(article.date)} />
        <meta itemProp="dateModified" content={isoDate(article.date)} />
        <meta itemProp="image" content={articleOgImage} />
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

        {/* Breadcrumbs — microdata BreadcrumbList */}
        <nav
          className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-8"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link href="/articles" className="hover:text-accent transition-colors">
              <span itemProp="name">Статті</span>
            </Link>
            <link itemProp="item" href="https://seobaza.com.ua/articles" />
            <meta itemProp="position" content="1" />
          </span>
          {article.category && (
            <>
              <span>/</span>
              <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link
                  href={`/category/${article.category}`}
                  className="hover:text-accent transition-colors"
                >
                  <span itemProp="name">{getCategoryDisplayName(article.category)}</span>
                </Link>
                <link itemProp="item" href={`https://seobaza.com.ua/category/${article.category}`} />
                <meta itemProp="position" content="2" />
              </span>
            </>
          )}
          <span>/</span>
          <span
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
            className="text-foreground truncate max-w-[240px]"
          >
            <span itemProp="name">{article.title}</span>
            <link itemProp="item" href={pageUrl} />
            <meta itemProp="position" content={article.category ? "3" : "2"} />
          </span>
        </nav>

        <header className="mb-8">
          {/* Category badge */}
          {article.category && (
            <Link
              href={`/category/${article.category}`}
              className="inline-block mb-4 px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
            >
              {getCategoryDisplayName(article.category)}
            </Link>
          )}

          <h1
            itemProp="headline name"
            className="text-4xl sm:text-5xl font-display mb-4 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent"
          >
            {h1Title}
          </h1>

          <meta itemProp="description" content={article.description} />

          {/* Hidden Person (author) — microdata item nested via itemProp. */}
          <div
            className="hidden"
            itemProp="author"
            itemScope
            itemType="https://schema.org/Person"
            {...(articleAuthorUrl ? { itemID: articleAuthorUrl } : {})}
          >
            <meta itemProp="name" content={article.author} />
            {articleAuthorUrl && <link itemProp="url" href={articleAuthorUrl} />}
          </div>

          {/* Visible byline — plain UI, no RDFa attributes */}
          <div className="flex flex-wrap items-center gap-3 text-muted-foreground mb-4">
            {(() => {
              if (articleAuthorSlug) {
                return (
                  <Link
                    href={`/authors/${articleAuthorSlug}`}
                    className="font-medium hover:text-accent transition-colors"
                  >
                    {article.author}
                  </Link>
                );
              }
              if (article.authorLink) {
                return (
                  <a
                    href={article.authorLink}
                    target="_blank"
                    className="font-medium hover:text-accent transition-colors"
                  >
                    {article.author}
                  </a>
                );
              }
              return <span className="font-medium">{article.author}</span>;
            })()}
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
            {article.editor && (
              <>
                <span>•</span>
                <span>
                  Редактор по SEO:{" "}
                  {(() => {
                    const editorSlug = getAuthorSlugByName(article.editor!);
                    if (editorSlug) {
                      return (
                        <Link href={`/authors/${editorSlug}`} className="hover:text-accent transition-colors">
                          {article.editor}
                        </Link>
                      );
                    }
                    if (article.editorLink) {
                      return (
                        <a
                          href={article.editorLink}
                          target="_blank"
                          className="hover:text-accent transition-colors"
                        >
                          {article.editor}
                        </a>
                      );
                    }
                    return article.editor;
                  })()}
                </span>
              </>
            )}
          </div>

          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
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
        </header>

        <div className="prose prose-lg dark:prose-invert max-w-none" itemProp="articleBody">
          <MDXRemote
            source={contentWithoutH1}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  rehypeSlug,
                ],
              },
            }}
          />
        </div>
      </article>

      {/* Newsletter signup */}
      <div className="max-w-3xl mx-auto mt-16">
        <NewsletterForm />
      </div>

      {/* Telegram comments — OUTSIDE the article RDFa scope so
          doesn't leak into the Article schema */}
      {article.telegramMessageId && (
        <div className="max-w-3xl mx-auto">
          <TelegramComments
            channel="SEOBAZA"
            postId={article.telegramMessageId}
          />
        </div>
      )}

      {/* Related articles */}
      {relatedArticles.length > 0 && (
        <div className="max-w-3xl mx-auto mt-16 pt-12 border-t border-border">
          <h2 className="text-2xl font-display mb-6">Схожі статті</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedArticles.map((related) => (
              <Link
                key={related.slug}
                href={`/articles/${related.slug}`}
                className="block group"
              >
                <div className="h-full bg-secondary/30 rounded-xl p-4 border border-border transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10">
                  <h3 className="text-sm font-display mb-2 group-hover:text-accent transition-colors line-clamp-3">
                    {related.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <time dateTime={related.date}>
                      {new Date(related.date).toLocaleDateString("uk-UA", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                    {related.readingTime && (
                      <>
                        <span>·</span>
                        <span>{related.readingTime} хв</span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
