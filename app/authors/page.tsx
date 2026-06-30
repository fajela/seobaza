import Link from "next/link";
import { getAllAuthors } from "@/lib/authors";
import { getTagDisplayName } from "@/lib/taxonomy";
import { pageMeta } from "@/lib/page-metadata";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata = pageMeta({
  title: "Автори — SEO BAZA",
  description: "Автори матеріалів SEO BAZA — SEO-спеціалісти та експерти українського ком'юніті.",
  path: "/authors",
});

export default function AuthorsPage() {
  const authors = getAllAuthors();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs items={[{ name: "Головна", href: "/" }, { name: "Автори", href: "/authors" }]} />
        <h1 className="text-4xl sm:text-5xl font-display mb-6 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Автори
        </h1>
        <p className="text-lg text-muted-foreground mb-12">
          SEO-спеціалісти та експерти, які створюють матеріали для SEO BAZA
        </p>

        <div
          className="grid sm:grid-cols-2 gap-6"
          itemScope
          itemType="https://schema.org/ItemList"
        >
          <meta itemProp="numberOfItems" content={String(authors.length)} />
          {authors.map((author, i) => (
            <div
              key={author.slug}
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <meta itemProp="position" content={String(i + 1)} />
              <link itemProp="url" href={`https://seobaza.com.ua/authors/${author.slug}`} />
              <Link href={`/authors/${author.slug}`} className="block group">
                <div className="h-full p-6 rounded-xl border border-border bg-secondary/20 hover:border-accent/50 hover:bg-secondary/30 transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    {/* Avatar — photo if available, else initial */}
                    {author.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={author.image}
                        srcSet={`/_next/image?url=${encodeURIComponent(author.image)}&w=64&q=75 1x, /_next/image?url=${encodeURIComponent(author.image)}&w=128&q=75 2x`}
                        alt={author.name}
                        width={56}
                        height={56}
                        loading="lazy"
                        decoding="async"
                        className="w-14 h-14 rounded-full object-cover shrink-0 border border-border"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center text-accent font-display text-xl shrink-0">
                        {author.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h2
                        itemProp="name"
                        className="font-display text-lg group-hover:text-accent transition-colors"
                      >
                        {author.name}
                      </h2>
                      <p className="text-sm text-muted-foreground">{author.role}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {author.bio}
                  </p>
                  {author.expertise.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {author.expertise.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full"
                        >
                          {getTagDisplayName(tag)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
