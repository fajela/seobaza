import { notFound } from "next/navigation";
import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";

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
    const ogImage = "https://seobaza.com.ua/og-image.png";

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
        publishedTime: article.date,
        authors: [article.author],
        images: [
          {
            url: ogImage,
            width: 640,
            height: 640,
            alt: "SEO BAZA logo",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: article.title,
        description: article.description,
        images: [ogImage],
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

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article className="max-w-3xl mx-auto">
        <Link
          href="/articles"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-accent transition-colors mb-8"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Назад до статей
        </Link>

        <header className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-display mb-4 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-muted-foreground mb-4">
            <span className="font-medium">{article.author}</span>
            <span>•</span>
            <time dateTime={article.date}>
              {new Date(article.date).toLocaleDateString("uk-UA", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-medium bg-accent/10 text-accent rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <MDXRemote source={article.content} />
        </div>
      </article>
    </div>
  );
}
