import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ENTITY_TYPES,
  ENTITY_TYPE_LABELS,
  entityUrl,
  getMaterialsForEntity,
  getPublishedEntities,
  isEntityType,
  materialsLabel,
} from "@/lib/kg-entities";
import { buildOgImage } from "@/lib/og-image";

const BASE = "https://seobaza.com.ua";

// A type index exists only once it has at least one published hub.
export const dynamicParams = false;

export async function generateStaticParams() {
  return ENTITY_TYPES.filter((t) => getPublishedEntities(t).length > 0).map((type) => ({ type }));
}

const INDEX_TITLES: Record<string, string> = {
  concept: "SEO-концепти в графі знань SEO Baza",
  tool: "SEO-інструменти в графі знань SEO Baza",
  org: "Компанії в графі знань SEO Baza",
};

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> {
  const { type } = await params;
  if (!isEntityType(type)) return { title: "Сторінку не знайдено | SEO BAZA" };
  const title = INDEX_TITLES[type];
  const names = getPublishedEntities(type).slice(0, 4).map((e) => e.name).join(", ");
  const description = `${ENTITY_TYPE_LABELS[type].many} з графа знань SEO Baza: ${names}. Усі матеріали спільноти про кожен в одному місці. Переходьте.`;
  const url = `${BASE}/kg/${type}`;
  const og = buildOgImage(undefined, title);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "SEO BAZA",
      locale: "uk_UA",
      type: "website",
      images: [{ url: og.url, width: og.width, height: og.height, alt: og.alt, type: og.type }],
    },
    twitter: { card: "summary_large_image", title, images: [{ url: og.url, alt: og.alt }] },
  };
}

export default async function EntityTypeIndexPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (!isEntityType(type)) notFound();
  const entities = getPublishedEntities(type);
  if (entities.length === 0) notFound();
  const labels = ENTITY_TYPE_LABELS[type];
  const url = `${BASE}/kg/${type}`;

  return (
    <div
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-12"
      itemScope
      itemType={type === "concept" ? "https://schema.org/DefinedTermSet" : "https://schema.org/CollectionPage"}
      itemID={`${url}#page`}
    >
      <link itemProp="url" href={url} />
      <div className="max-w-4xl mx-auto">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/kg" className="hover:text-accent transition-colors">
            Граф знань
          </Link>
          <span>/</span>
          <span className="text-foreground">{labels.many}</span>
        </nav>
        <h1 className="text-4xl font-display mb-8" itemProp="name">
          {INDEX_TITLES[type]}
        </h1>
        <div className="grid gap-4 sm:grid-cols-2">
          {entities.map((e) => {
            const count = getMaterialsForEntity(e.slug).length;
            return (
              <Link key={e.slug} href={entityUrl(e)} className="block group">
                <div className="h-full p-5 rounded-xl border border-border bg-secondary/20 group-hover:border-accent/50 group-hover:bg-secondary/40 transition-all">
                  <h2 className="font-display text-xl mb-1 group-hover:text-accent transition-colors">{e.name}</h2>
                  <p className="text-sm text-muted-foreground mb-2">{e.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {materialsLabel(count)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
