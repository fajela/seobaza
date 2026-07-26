import { getArticleBySlug, getAllArticles } from '@/lib/markdown';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Стаття не знайдена',
    };
  }

  return {
    title: `${article.title} - SEO BAZA`,
    description: article.description,
    keywords: article.keywords,
    authors: [{ name: article.author }],
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.date,
      authors: [article.author],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <article
      vocab="http://schema.org/"
      typeof="Article BlogPosting"
      className="max-w-3xl mx-auto"
    >
      {/* Dublin Core & RDF Metadata */}
      <div style={{ display: 'none' }}>
        <meta property="dc:title" content={article.title} />
        <meta property="dc:creator" content={article.author} />
        <meta property="dc:date" content={article.date} />
        <meta property="dc:description" content={article.description} />
        <link property="dc:publisher" href="https://seobaza.com.ua" />
        <link property="dc:relation" href={`https://seobaza.com.ua/articles/${slug}`} />
      </div>

      {/* Back button */}
      <Link
        href="/articles"
        className="inline-flex items-center text-primary hover:text-primary-hover mb-8 font-semibold transition-colors"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
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

      {/* Article Header */}
      <header className="mb-8">
        <h1
          property="headline name"
          className="font-heading text-4xl md:text-5xl font-bold mb-4 text-text-primary"
        >
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span property="author" typeof="Person">
              <span property="name">{article.author}</span>
            </span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <time property="datePublished" dateTime={article.date}>
              {article.date}
            </time>
          </div>
        </div>

        <p property="description" className="text-xl text-gray-700 leading-relaxed">
          {article.description}
        </p>
      </header>

      <hr className="divider-seobaza" />

      {/* Article Content */}
      <div
        property="articleBody"
        className="prose prose-lg max-w-none
          prose-headings:font-heading prose-headings:font-bold
          prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4
          prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3
          prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
          prose-a:content-link
          prose-ul:my-4 prose-ol:my-4
          prose-li:text-gray-700
          prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded
          prose-pre:bg-gray-900 prose-pre:text-gray-100
          prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:pl-4 prose-blockquote:italic
          prose-img:rounded-lg prose-img:shadow-lg"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: article.title,
            description: article.description,
            author: {
              '@type': 'Person',
              name: article.author,
            },
            datePublished: article.date,
            publisher: {
              '@type': 'Organization',
              name: 'SEO BAZA',
              url: 'https://seobaza.com.ua',
              logo: {
                '@type': 'ImageObject',
                url: 'https://seobaza.com.ua/seobaza.png',
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://seobaza.com.ua/articles/${slug}`,
            },
          }),
        }}
      />
    </article>
  );
}
