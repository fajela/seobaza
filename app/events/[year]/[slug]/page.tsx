import { notFound } from "next/navigation";
import Link from "next/link";
import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import { MdxImg, MdxLink } from "@/components/mdx-img";
import { Speakers } from "@/components/speakers";
import { normalizeEvent, eventToJsonLd, getLatestDealsEvent } from "@/lib/events";
import type { Metadata } from "next";

const mdxComponents = { img: MdxImg, a: MdxLink, Speakers };

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
  const hasOwnImage = Boolean(frontmatter.image);
  const ogImage = hasOwnImage
    ? `https://seobaza.com.ua${frontmatter.image}`
    : "https://seobaza.com.ua/og-image.png";

  // Black Friday strategy: while a year page is the CURRENT (latest) deals page
  // it canonicals to the evergreen /black-friday hub. Older years are
  // self-canonical archives — this flips automatically once a newer year exists.
  const latestDeals = getLatestDealsEvent();
  const isCurrentDeals =
    frontmatter.type === "deals" &&
    latestDeals?.year === year &&
    latestDeals?.slug === slug;
  const canonical = isCurrentDeals
    ? "https://seobaza.com.ua/black-friday"
    : url;

  return {
    title: `${frontmatter.title} - SEO BAZA`,
    description: frontmatter.description || frontmatter.title,
    authors: frontmatter.author ? [{ name: frontmatter.author }] : undefined,
    alternates: {
      canonical,
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
        hasOwnImage
          ? {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: frontmatter.title,
            }
          : {
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

  const eventUrl = `https://seobaza.com.ua/events/${year}/${slug}`;

  // Emit schema.org/Event for real events. Deals pages keep their inline
  // SaleEvent microdata in the MDX, so skip them here to avoid double markup.
  const meta = normalizeEvent(year, slug, frontmatter);
  const eventJsonLd = meta.type !== "deals" ? eventToJsonLd(meta) : null;

  return (
    <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
      {eventJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
        />
      )}
      {/* Breadcrumbs — microdata BreadcrumbList */}
      <nav
        className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-8"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
          <Link href="/events" className="hover:text-accent transition-colors">
            <span itemProp="name">Події</span>
          </Link>
          <link itemProp="item" href="https://seobaza.com.ua/events" />
          <meta itemProp="position" content="1" />
        </span>
        <span>/</span>
        <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
          <span itemProp="name">{year}</span>
          <link itemProp="item" href={`https://seobaza.com.ua/events/${year}`} />
          <meta itemProp="position" content="2" />
        </span>
        <span>/</span>
        <span
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
          className="text-foreground truncate max-w-[240px]"
        >
          <span itemProp="name">{frontmatter.title}</span>
          <link itemProp="item" href={eventUrl} />
          <meta itemProp="position" content="3" />
        </span>
      </nav>
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <MDXRemote source={content} components={mdxComponents} />
      </div>
    </article>
  );
}
