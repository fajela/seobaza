import Link from "next/link";
import { getAllVideos, formatDuration, videoToJsonLd, seriesJsonLd } from "@/lib/videos";
import { pageMeta } from "@/lib/page-metadata";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata = pageMeta({
  title: "Відео - SEO BAZA",
  description:
    "Українські SEO-відео від спільноти SEO Baza: стріми по середах, розбори з запрошеними фахівцями і поради спільноти. Дивіться на сайті чи YouTube.",
  path: "/videos",
});

function formatDate(iso: string): string {
  if (!iso) return "";
  const months = [
    "січня", "лютого", "березня", "квітня", "травня", "червня",
    "липня", "серпня", "вересня", "жовтня", "листопада", "грудня",
  ];
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${months[m - 1]} ${y}`;
}

export default function VideosPage() {
  // Drafts show up in dev for review; production lists only published videos.
  const videos = getAllVideos(process.env.NODE_ENV !== "production");

  // One @graph: the series entity (My Dudes Production) plus the episode list.
  // Every VideoObject points at the series via isPartOf @id, and the full
  // series node lives on the same page so the reference always resolves.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      seriesJsonLd(),
      {
        "@type": "ItemList",
        name: "Відео SEO Baza українською",
        numberOfItems: videos.length,
        itemListElement: videos.map((v, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: videoToJsonLd(v, { bare: true }),
        })),
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto">
        <Breadcrumbs
          items={[
            { name: "Головна", href: "/" },
            { name: "Відео", href: "/videos" },
          ]}
        />
        <h1 className="text-4xl sm:text-5xl font-display mb-6 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Відео SEO Baza українською
        </h1>
        <p className="text-lg text-muted-foreground mb-10">
          Стріми по середах і розбори з запрошеними фахівцями. Нові випуски
          виходять приблизно раз на два тижні на{" "}
          <a
            href="https://www.youtube.com/@SEOBAZA"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-accent underline transition-colors"
          >
            нашому YouTube-каналі
          </a>
          .
        </p>

        {videos.length === 0 ? (
          <p className="text-muted-foreground">
            Записи скоро зʼявляться тут. Поки що всі відео на{" "}
            <a
              href="https://www.youtube.com/@SEOBAZA"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-accent underline transition-colors"
            >
              YouTube-каналі SEO BAZA
            </a>
            .
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {videos.map((v) => (
              <Link
                key={v.slug}
                href={`/videos/${v.slug}`}
                className="group block rounded-xl border border-border overflow-hidden bg-secondary/20 hover:border-accent/60 hover:bg-secondary/40 transition-all"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={v.image || `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`}
                  alt={`Обкладинка відео ${v.title}`}
                  width={480}
                  height={270}
                  loading="lazy"
                  className="aspect-video w-full object-cover"
                />
                <div className="p-4">
                  <h2 className="font-display text-lg leading-snug group-hover:text-accent transition-colors">
                    {v.title}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {[formatDate(v.date), formatDuration(v.duration)]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {v.speakers.length > 0 && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {v.speakers.map((s) => s.name).join(", ")}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
