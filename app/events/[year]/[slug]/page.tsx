import { notFound } from "next/navigation";
import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { Metadata } from "next";

interface EventPageProps {
  params: Promise<{
    year: string;
    slug: string;
  }>;
}

async function getEvent(year: string, slug: string) {
  try {
    const filePath = path.join(
      process.cwd(),
      "content",
      "events",
      year,
      `${slug}.mdx`
    );
    const fileContent = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(fileContent);

    return {
      frontmatter: data,
      content: content.trim(),
      year,
      slug,
    };
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { year, slug } = await params;
  const event = await getEvent(year, slug);

  if (!event) {
    return {
      title: "Подія не знайдена - SEO BAZA",
    };
  }

  const { frontmatter } = event;
  const url = `https://seobaza.com.ua/events/${year}/${slug}`;
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
          width: 1200,
          height: 630,
          alt: frontmatter.title,
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
  const eventsPath = path.join(process.cwd(), "content", "events");

  try {
    const years = await fs.readdir(eventsPath);
    const params = [];

    for (const year of years) {
      const yearPath = path.join(eventsPath, year);
      const stat = await fs.stat(yearPath);

      if (stat.isDirectory()) {
        const files = await fs.readdir(yearPath);
        const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

        for (const file of mdxFiles) {
          params.push({
            year,
            slug: file.replace(".mdx", ""),
          });
        }
      }
    }

    return params;
  } catch (error) {
    return [];
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const { year, slug } = await params;
  const event = await getEvent(year, slug);

  if (!event) {
    notFound();
  }

  const { frontmatter, content } = event;

  return (
    <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <MDXRemote source={content} />
      </div>
    </article>
  );
}
