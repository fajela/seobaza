import { notFound } from "next/navigation";
import path from "path";
import { getArticleBySlug, getArticleSlugs } from "@/lib/articles";
import { getAuthorSlugByName } from "@/lib/authors";
import { getTagDisplayName } from "@/lib/taxonomy";
import { MdxImg, MdxLink } from "@/components/mdx-img";
import { KgProfileTool } from "@/components/kg-profile-tool";
import { SoaaDashboard } from "@/components/soaa-dashboard";
import { TelegramComments } from "@/components/telegram-comments";
import { NewsletterForm } from "@/components/newsletter-form";
import { buildOgImage } from "@/lib/og-image";
import { isoDate } from "@/lib/schema-rdfa";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

const mdxComponents = { img: MdxImg, a: MdxLink, KgProfileTool, SoaaDashboard };

const kbDirectory = path.join(process.cwd(), "content/knowledge-base");

export async function generateStaticParams() {
  return getArticleSlugs(kbDirectory).map((file) => ({
    slug: file.replace(/\.mdx$/, ""),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const article = getArticleBySlug(slug, kbDirectory);
    const url = `https://seobaza.com.ua/knowledge-base/${slug}`;
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
        section: "База знань",
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
      title: "Матеріал не знайдено - SEO BAZA",
    };
  }
}

export default async function KnowledgeBaseArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let article;
  try {
    article = getArticleBySlug(slug, kbDirectory);
  } catch {
    notFound();
  }

  // Use h1 from frontmatter or extract from content
  const h1Title = article.h1 || article.title;
  const h1Match = article.content.match(/^#\s+(.+)$/m);
  const contentWithoutH1 = h1Match
    ? article.content.replace(/^#\s+.+$/m, "").trim()
    : article.content;

  const pageUrl = `https://seobaza.com.ua/knowledge-base/${slug}`;
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
            <Link href="/knowledge-base" className="hover:text-accent transition-colors">
              <span itemProp="name">База знань</span>
            </Link>
            <link itemProp="item" href="https://seobaza.com.ua/knowledge-base" />
            <meta itemProp="position" content="1" />
          </span>
          <span>/</span>
          <span
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
            className="text-foreground truncate max-w-[240px]"
          >
            <span itemProp="name">{article.title}</span>
            <link itemProp="item" href={pageUrl} />
            <meta itemProp="position" content="2" />
          </span>
        </nav>

        <header className="mb-8">
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
            {articleAuthorSlug ? (
              <Link
                href={`/authors/${articleAuthorSlug}`}
                className="font-medium hover:text-accent transition-colors"
              >
                {article.author}
              </Link>
            ) : article.authorLink ? (
              <a
                href={article.authorLink}
                target="_blank"
                className="font-medium hover:text-accent transition-colors"
              >
                {article.author}
              </a>
            ) : (
              <span className="font-medium">{article.author}</span>
            )}
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
                rehypePlugins: [rehypeSlug],
              },
            }}
          />
        </div>
      </article>

      {/* Newsletter signup */}
      <div className="max-w-3xl mx-auto mt-16">
        <NewsletterForm />
      </div>

      {/* Telegram comments — OUTSIDE the article RDFa scope */}
      {article.telegramMessageId && (
        <div className="max-w-3xl mx-auto">
          <TelegramComments
            channel="SEOBAZA"
            postId={article.telegramMessageId}
          />
        </div>
      )}

      {/* Back to knowledge base */}
      <div className="max-w-3xl mx-auto mt-16 pt-12 border-t border-border">
        <Link
          href="/knowledge-base"
          className="inline-flex items-center gap-2 text-primary hover:text-accent font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Усі матеріали Бази знань
        </Link>
      </div>
    </div>
  );
}
