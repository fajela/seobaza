import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import {
  ENTITY_TYPE_LABELS,
  entityUrl,
  getPublishedEntities,
  getPublishedEntity,
  resolveEntityRef,
} from "@/lib/kg-entities";
import { EntityChips, EntityMentions } from "@/components/kg-mentions";
import { googleKgUrl } from "@/lib/authors";
import { buildOgImage } from "@/lib/og-image";
import { MdxImg, MdxLink } from "@/components/mdx-img";

const BASE = "https://seobaza.com.ua";
const mdxComponents = { img: MdxImg, a: MdxLink };

// Only published hubs get a page; everything else is a real 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  return getPublishedEntities().map((e) => ({ type: e.type, slug: e.slug }));
}

function hubTitle(name: string): string {
  return `${name}: новини та матеріали SEO Baza`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string; slug: string }>;
}): Promise<Metadata> {
  const { type, slug } = await params;
  const entity = getPublishedEntity(type, slug);
  if (!entity) return { title: "Сторінку не знайдено | SEO BAZA" };
  const url = `${BASE}${entityUrl(entity)}`;
  const title = hubTitle(entity.name);
  const og = buildOgImage(entity.image, entity.name);
  return {
    title,
    description: entity.description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: entity.description,
      url,
      siteName: "SEO BAZA",
      locale: "uk_UA",
      type: "website",
      images: [{ url: og.url, width: og.width, height: og.height, alt: og.alt, type: og.type }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: entity.description,
      images: [{ url: og.url, alt: og.alt }],
    },
  };
}

export default async function EntityHubPage({
  params,
}: {
  params: Promise<{ type: string; slug: string }>;
}) {
  const { type, slug } = await params;
  const entity = getPublishedEntity(type, slug);
  if (!entity) notFound();

  const labels = ENTITY_TYPE_LABELS[entity.type];
  const pageUrl = `${BASE}${entityUrl(entity)}`;
  const typeIndexUrl = `${BASE}/kg/${entity.type}`;
  const related = entity.related.map(resolveEntityRef);

  return (
    <div
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-12"
      itemScope
      itemType="https://schema.org/CollectionPage"
      itemID={`${pageUrl}#page`}
    >
      <link itemProp="url" href={pageUrl} />
      <meta itemProp="inLanguage" content="uk-UA" />
      <div
        className="max-w-4xl mx-auto"
        itemProp="mainEntity"
        itemScope
        itemType={labels.schema}
        itemID={`${pageUrl}#entity`}
      >
        <link itemProp="url" href={pageUrl} />
        {entity.type === "concept" && <link itemProp="inDefinedTermSet" href={typeIndexUrl} />}
        {entity.aliases
          .filter((a) => a !== entity.name)
          .map((a) => (
            <meta key={a} itemProp="alternateName" content={a} />
          ))}
        {entity.wikidata && <link itemProp="sameAs" href={`https://www.wikidata.org/wiki/${entity.wikidata}`} />}
        {entity.googleKgId && <link itemProp="sameAs" href={googleKgUrl(entity.googleKgId)} />}

        <nav
          className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-8"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link href="/kg" className="hover:text-accent transition-colors">
              <span itemProp="name">Граф знань</span>
            </Link>
            <link itemProp="item" href={`${BASE}/kg`} />
            <meta itemProp="position" content="1" />
          </span>
          <span>/</span>
          <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link href={`/kg/${entity.type}`} className="hover:text-accent transition-colors">
              <span itemProp="name">{labels.many}</span>
            </Link>
            <link itemProp="item" href={typeIndexUrl} />
            <meta itemProp="position" content="2" />
          </span>
          <span>/</span>
          <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span itemProp="name" className="text-foreground">{entity.name}</span>
            <link itemProp="item" href={pageUrl} />
            <meta itemProp="position" content="3" />
          </span>
        </nav>

        <header className="mb-10 p-6 rounded-xl border border-border bg-secondary/20">
          <p className="text-xs uppercase tracking-wide text-primary mb-2">{labels.one}</p>
          <h1 className="text-3xl font-display mb-3" itemProp="name">
            {entity.name}
          </h1>
          <p className="text-lg leading-relaxed" itemProp="description">
            {entity.description}
          </p>
        </header>

        {entity.content.trim().length > 0 && (
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <MDXRemote
              source={entity.content}
              components={mdxComponents}
              options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } }}
            />
          </div>
        )}

        <EntityMentions id={entity.slug} name={entity.name} />

        {related.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4">Повʼязане</h2>
            <EntityChips items={related} />
          </section>
        )}

        {entity.sameAs.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4">Офіційні сторінки</h2>
            <div className="flex flex-wrap gap-2">
              {entity.sameAs.map((url) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener"
                  itemProp="sameAs"
                  className="px-3 py-1.5 text-sm border border-border rounded-full hover:border-primary hover:text-primary transition-colors"
                >
                  {url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
