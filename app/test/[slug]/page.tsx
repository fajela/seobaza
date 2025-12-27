import { notFound } from "next/navigation";
import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { Metadata } from "next";
import Link from "next/link";

interface TestPageProps {
  params: Promise<{ slug: string }>;
}

async function getTest(slug: string) {
  try {
    const filePath = path.join(process.cwd(), "content", "tests", `${slug}.mdx`);
    const fileContent = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(fileContent);

    return {
      frontmatter: data,
      content: content.trim(),
      slug,
    };
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({
  params,
}: TestPageProps): Promise<Metadata> {
  const { slug } = await params;
  const test = await getTest(slug);

  if (!test) {
    return {
      title: "Тест не знайдено - SEO BAZA",
    };
  }

  const { frontmatter } = test;
  const url = `https://seobaza.com.ua/test/${slug}`;
  const ogImage = "https://seobaza.com.ua/og-image.png";

  return {
    title: `${frontmatter.title} - SEO BAZA`,
    description: frontmatter.description || frontmatter.title,
    authors: frontmatter.author ? [{ name: frontmatter.author }] : undefined,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description || frontmatter.title,
      url: url,
      siteName: "SEO BAZA",
      locale: "uk_UA",
      type: "article",
      publishedTime: frontmatter.date,
      authors: frontmatter.author ? [frontmatter.author] : undefined,
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
      title: frontmatter.title,
      description: frontmatter.description || frontmatter.title,
      images: [ogImage],
    },
  };
}

export async function generateStaticParams() {
  const testsPath = path.join(process.cwd(), "content", "tests");

  try {
    const files = await fs.readdir(testsPath);
    const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

    return mdxFiles.map((file) => ({
      slug: file.replace(".mdx", ""),
    }));
  } catch (error) {
    return [];
  }
}

export default async function TestPage({ params }: TestPageProps) {
  const { slug } = await params;
  const test = await getTest(slug);

  if (!test) {
    notFound();
  }

  const { frontmatter, content } = test;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article className="max-w-3xl mx-auto">
        <Link
          href="/test"
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
          Назад до тестів
        </Link>

        <header className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-display mb-4 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            {frontmatter.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-muted-foreground mb-4">
            {frontmatter.author && (
              <span className="font-medium">{frontmatter.author}</span>
            )}
            {frontmatter.date && (
              <>
                <span>•</span>
                <time dateTime={frontmatter.date}>
                  {new Date(frontmatter.date).toLocaleDateString("uk-UA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </>
            )}
          </div>
          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {frontmatter.tags.map((tag: string) => (
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
          <MDXRemote source={content} />
        </div>
      </article>
    </div>
  );
}
