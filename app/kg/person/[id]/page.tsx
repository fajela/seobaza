import { notFound } from "next/navigation";
import Link from "next/link";
import { getKgPersonIds, getKgPersonById } from "@/lib/kg";
import { getTagDisplayName } from "@/lib/taxonomy";
import { buildOgImage } from "@/lib/og-image";
import { MdxImg, MdxLink } from "@/components/mdx-img";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

const mdxComponents = { img: MdxImg, a: MdxLink };

export async function generateStaticParams() {
  return getKgPersonIds().map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const person = getKgPersonById(id);
    const title = `${person.name}: ${person.role}${person.company ? ` ${person.company}` : ""} | SEO BAZA`;
    const og = buildOgImage(person.image, person.name);
    return {
      title,
      description: person.bio,
      alternates: { canonical: `https://seobaza.com.ua/kg/person/${id}` },
      openGraph: {
        title,
        description: person.bio,
        url: `https://seobaza.com.ua/kg/person/${id}`,
        siteName: "SEO BAZA",
        locale: "uk_UA",
        type: "profile",
        images: [{ url: og.url, width: og.width, height: og.height, alt: og.alt, type: og.type }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: person.bio,
        images: [{ url: og.url, alt: og.alt }],
      },
    };
  } catch {
    return { title: "Людину не знайдено — SEO BAZA" };
  }
}

export default async function KgPersonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let person;
  try {
    person = getKgPersonById(id);
  } catch {
    notFound();
  }

  const personUrl = `https://seobaza.com.ua/kg/person/${id}`;

  return (
    <div
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-12"
      itemScope
      itemType="https://schema.org/ProfilePage"
      itemID={`${personUrl}#profilepage`}
    >
      <div
        className="max-w-4xl mx-auto"
        itemProp="mainEntity"
        itemScope
        itemType="https://schema.org/Person"
        itemID={`${personUrl}#person`}
      >
        <meta itemProp="url" content={personUrl} />
        <meta itemProp="identifier" content={person.kgId} />

        {/* Breadcrumbs — microdata BreadcrumbList */}
        <nav
          className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-8"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link href="/kg/person" className="hover:text-accent transition-colors">
              <span itemProp="name">Граф знань</span>
            </Link>
            <link itemProp="item" href="https://seobaza.com.ua/kg/person" />
            <meta itemProp="position" content="1" />
          </span>
          <span>/</span>
          <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span itemProp="name" className="text-foreground">{person.name}</span>
            <link itemProp="item" href={personUrl} />
            <meta itemProp="position" content="2" />
          </span>
        </nav>

        {/* Profile header. The image sits AFTER the h1 in the DOM (order-first
            keeps it visually on the left) — heading first in code, image under it. */}
        <div className="flex flex-col sm:flex-row gap-6 mb-10 p-6 rounded-xl border border-border bg-secondary/20">
          <div className="flex-1">
            <h1 className="text-3xl font-display mb-1" itemProp="name">
              {person.name}
            </h1>
            {person.alternateName && (
              <meta itemProp="alternateName" content={person.alternateName} />
            )}
            <p className="text-muted-foreground mb-3">
              <span itemProp="jobTitle">{person.role}</span>
              {person.company && (
                <span itemProp="worksFor" itemScope itemType="https://schema.org/Organization">
                  {" · "}
                  {person.companyUrl ? (
                    <a
                      href={person.companyUrl}
                      target="_blank"
                      itemProp="url"
                      className="hover:text-accent transition-colors"
                    >
                      <span itemProp="name">{person.company}</span>
                    </a>
                  ) : (
                    <span itemProp="name">{person.company}</span>
                  )}
                </span>
              )}
              {person.city && (
                <span itemProp="homeLocation" itemScope itemType="https://schema.org/Place">
                  {" · "}
                  <span itemProp="name">{person.city}</span>
                </span>
              )}
            </p>

            {/* Expertise chips inside the header, entity-page style */}
            {(person.expertise.length > 0 || (person.topics?.length ?? 0) > 0) && (
              <div className="flex flex-wrap gap-2 mt-1">
                {person.expertise.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${tag}`}
                    className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                  >
                    {getTagDisplayName(tag)}
                  </Link>
                ))}
                {person.topics?.filter((t) => !person.expertise.some((tag) => getTagDisplayName(tag).toLowerCase() === t.toLowerCase())).map((t) => (
                  <span
                    key={t}
                    itemProp="knowsAbout"
                    className="px-3 py-1 text-sm bg-muted text-muted-foreground rounded-full"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
            {person.expertise.map((tag) => (
              <meta key={tag} itemProp="knowsAbout" content={getTagDisplayName(tag)} />
            ))}
          </div>

          {person.image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={person.image}
              srcSet={`/_next/image?url=${encodeURIComponent(person.image)}&w=96&q=75 1x, /_next/image?url=${encodeURIComponent(person.image)}&w=256&q=75 2x`}
              alt={person.name}
              itemProp="image"
              width={96}
              height={96}
              fetchPriority="high"
              className="order-first w-24 h-24 rounded-full object-cover shrink-0 border border-border"
            />
          ) : (
            <div className="order-first w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center text-accent font-display text-3xl shrink-0">
              {person.name.charAt(0)}
            </div>
          )}
        </div>

        {/* Lead bio, below the header like on entity pages */}
        <p className="text-lg leading-relaxed mb-10" itemProp="description">
          {person.bio}
        </p>

        {/* Extended MDX body: книга, виступи */}
        {person.content.trim().length > 0 && (
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <MDXRemote
              source={person.content}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [rehypeSlug],
                },
              }}
            />
          </div>
        )}

        {/* All profiles: socials + speaker pages, mentor profiles, catalogs */}
        {(() => {
          const allProfiles = [
            person.telegram,
            person.linkedin,
            person.twitter,
            person.instagram,
            person.facebook,
            person.website,
            ...(person.sameAs ?? []),
          ].filter((u): u is string => Boolean(u));
          const profileLabel = (url: string): string => {
            const exact: Record<string, string> = {
              "https://collaborator.pro/ua/blog/seo-women": "Добірка SEO-спеціалісток України",
              "https://t.me/seoideas": "Канал SEO Ideas",
              "https://www.youtube.com/@shozashum": "Подкаст Що за Шум",
            };
            if (exact[url]) return exact[url];
            const host = url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0];
            const known: Record<string, string> = {
              "t.me": "Telegram",
              "linkedin.com": "LinkedIn",
              "instagram.com": "Instagram",
              "facebook.com": "Facebook",
              "x.com": "X",
              "twitter.com": "X",
              "youtube.com": "YouTube",
              "nazahid.com": "НаЗахід",
              "conference.collaborator.pro": "Collaborator Conference",
              "collaborator.pro": "Collaborator",
              "prjctr.com": "Projector",
              "theways.io": "TheWays",
              "flyerone.vc": "Flyer One Ventures",
              "affcatalog.com": "AFFCatalog",
            };
            return known[host] ?? host;
          };
          return allProfiles.length > 0 ? (
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-4">Профілі та згадки</h2>
            <div className="flex flex-wrap gap-2">
              {allProfiles.map((url) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener"
                  itemProp="sameAs"
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm border border-border rounded-full text-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  {profileLabel(url)}
                  <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M7 7h10v10" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
          ) : null;
        })()}
      </div>
    </div>
  );
}
