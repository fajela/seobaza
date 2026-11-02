import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MdxWithLiveBanner } from "@/components/mdx-with-live-banner";
import { MdxImg, MdxLink } from "@/components/mdx-img";
import { MaterialEntities } from "@/components/material-entities";
import { RatingPhoto } from "@/components/rating-photo";
import { buildOgImage } from "@/lib/og-image";
import { isoDate } from "@/lib/schema-rdfa";
import { getCurrentRating } from "@/lib/rating";

const PAGE_URL = "https://seobaza.com.ua/rating";
const mdxComponents = { img: MdxImg, a: MdxLink, RatingPhoto };

export function generateMetadata(): Metadata {
  const rating = getCurrentRating();
  if (!rating) return { title: "Рейтинг SEO-спеціалістів - SEO Baza" };
  const og = buildOgImage(rating.image, rating.h1);
  return {
    title: `${rating.title} | SEO Baza`,
    description: rating.description,
    alternates: { canonical: PAGE_URL },
    openGraph: {
      title: rating.title,
      description: rating.description,
      url: PAGE_URL,
      siteName: "SEO Baza",
      locale: "uk_UA",
      type: "article",
      publishedTime: isoDate(rating.date),
      images: [{ url: og.url, width: og.width, height: og.height, alt: og.alt, type: og.type }],
    },
    twitter: {
      card: "summary_large_image",
      title: rating.title,
      description: rating.description,
      images: [{ url: og.url, alt: og.alt }],
    },
  };
}

export default function RatingPage() {
  const rating = getCurrentRating();
  if (!rating) notFound();
  const image = rating.image ? `https://seobaza.com.ua${rating.image}` : "https://seobaza.com.ua/og-image.png";

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article className="max-w-3xl mx-auto" itemScope itemType="https://schema.org/Article">
        <meta itemProp="mainEntityOfPage" content={PAGE_URL} />
        <meta itemProp="datePublished" content={isoDate(rating.date)} />
        <meta itemProp="dateModified" content={isoDate(rating.date)} />
        <meta itemProp="image" content={image} />
        <meta itemProp="inLanguage" content="uk-UA" />
        <meta itemProp="description" content={rating.description} />
        <div className="hidden" itemProp="publisher" itemScope itemType="https://schema.org/Organization" itemID="https://seobaza.com.ua/">
          <meta itemProp="name" content="SEO Baza" />
          <link itemProp="url" href="https://seobaza.com.ua/" />
          <div itemProp="logo" itemScope itemType="https://schema.org/ImageObject">
            <link itemProp="url" href="https://seobaza.com.ua/seobaza.png" />
          </div>
        </div>
        <div className="hidden" itemProp="author" itemScope itemType="https://schema.org/Person" itemID="https://seobaza.com.ua/kg/person/sb0011">
          <meta itemProp="name" content={rating.author} />
          <link itemProp="url" href="https://seobaza.com.ua/kg/person/sb0011" />
        </div>

        <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-8" itemScope itemType="https://schema.org/BreadcrumbList">
          <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link href="/" className="hover:text-accent transition-colors">
              <span itemProp="name">Головна</span>
            </Link>
            <link itemProp="item" href="https://seobaza.com.ua/" />
            <meta itemProp="position" content="1" />
          </span>
          <span>/</span>
          <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="text-foreground">
            <span itemProp="name">Рейтинг SEO-спеціалістів</span>
            <link itemProp="item" href={PAGE_URL} />
            <meta itemProp="position" content="2" />
          </span>
        </nav>

        <h1 itemProp="headline name" className="text-4xl sm:text-5xl font-display mb-8 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          {rating.h1}
        </h1>

        <div
          itemProp="articleBody"
          className="prose prose-lg dark:prose-invert max-w-none [&_h3]:clear-both [&_h2]:clear-both [&_hr]:clear-both [&_details]:my-8 [&_details]:rounded-xl [&_details]:border [&_details]:border-border [&_details]:px-5 [&_details]:py-3 [&_summary]:cursor-pointer [&_summary]:font-semibold [&_summary]:text-accent"
        >
          <MdxWithLiveBanner source={rating.content} components={mdxComponents} banner={false} />
        </div>

        <MaterialEntities url="/rating" />
      </article>
    </div>
  );
}
