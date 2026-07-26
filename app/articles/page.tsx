import Link from 'next/link';
import { getAllArticles } from '@/lib/markdown';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Статті - SEO BAZA',
  description: 'Корисні статті про SEO від української спільноти',
};

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="font-heading text-4xl font-bold mb-4 text-text-primary">
          Статті SEO BAZA
        </h1>
        <p className="text-lg text-gray-600">
          Корисні матеріали про SEO від нашої спільноти
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-600 mb-4">
            Статей поки що немає. Станьте першим автором!
          </p>
          <p className="text-sm text-gray-500">
            Дізнайтесь як додати статтю в{' '}
            <a
              href="https://github.com/yourusername/seobaza"
              className="content-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              README
            </a>
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {articles.map((article) => (
            <article
              key={article.slug}
              className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <Link href={`/articles/${article.slug}`}>
                <h2 className="font-heading text-2xl font-bold mb-2 hover:text-primary transition-colors">
                  {article.title}
                </h2>
              </Link>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <time dateTime={article.date}>{article.date}</time>
                <span>•</span>
                <span>{article.author}</span>
              </div>
              <p className="text-gray-700 mb-4">{article.description}</p>
              <Link
                href={`/articles/${article.slug}`}
                className="inline-flex items-center text-primary hover:text-primary-hover font-semibold transition-colors"
              >
                Читати далі
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
