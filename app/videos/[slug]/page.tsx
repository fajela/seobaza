import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { MdxImg, MdxLink } from "@/components/mdx-img";
import { SponsorBanner } from "@/components/sponsor-banner";
import {
  getAllVideos,
  getVideoBySlug,
  formatDuration,
  videoToJsonLd,
  type VideoSpeaker,
} from "@/lib/videos";

const mdxComponents = { img: MdxImg, a: MdxLink, SponsorBanner };

const isProd = process.env.NODE_ENV === "production";

interface VideoPageProps {
  params: Promise<{ slug: string }>;
}

function visible(slug: string) {
  const video = getVideoBySlug(slug);
  if (!video) return null;
  // Drafts are reachable in dev for review, hidden in production.
  if (isProd && video.status !== "published") return null;
  return video;
}

export async function generateStaticParams() {
  return getAllVideos(!isProd).map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: VideoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const video = visible(slug);
  if (!video) return { title: "Відео не знайдено - SEO BAZA" };

  const url = `https://seobaza.com.ua/videos/${slug}`;
  const ogImage = video.image
    ? `https://seobaza.com.ua${video.image}`
    : `https://i.ytimg.com/vi/${video.videoId}/hq720.jpg`;

  return {
    title: `${video.title} - SEO BAZA`,
    description: video.description,
    alternates: { canonical: url },
    openGraph: {
      title: video.title,
      description: video.description,
      url,
      siteName: "SEO BAZA",
      locale: "uk_UA",
      type: "video.other",
      images: [{ url: ogImage, width: 1200, height: 630, alt: video.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: video.title,
      description: video.description,
      images: [ogImage],
    },
  };
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const months = [
    "січня", "лютого", "березня", "квітня", "травня", "червня",
    "липня", "серпня", "вересня", "жовтня", "листопада", "грудня",
  ];
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${months[m - 1]} ${y}`;
}

function SpeakerName({ speaker }: { speaker: VideoSpeaker }) {
  const href = speaker.kgId ? `/kg/person/${speaker.kgId}` : speaker.url;
  if (href) {
    return (
      <Link
        href={href}
        className="text-primary hover:text-accent underline transition-colors"
      >
        {speaker.name}
      </Link>
    );
  }
  return <span>{speaker.name}</span>;
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { slug } = await params;
  const video = visible(slug);
  if (!video) notFound();

  const url = `https://seobaza.com.ua/videos/${slug}`;
  const jsonLd = videoToJsonLd(video);

  return (
    <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs — microdata BreadcrumbList, як на сторінках подій */}
      <nav
        className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-8"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
          <Link href="/videos" className="hover:text-accent transition-colors">
            <span itemProp="name">Відео</span>
          </Link>
          <link itemProp="item" href="https://seobaza.com.ua/videos" />
          <meta itemProp="position" content="1" />
        </span>
        <span>/</span>
        <span
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
          className="text-foreground truncate max-w-[280px]"
        >
          <span itemProp="name">{video.title}</span>
          <link itemProp="item" href={url} />
          <meta itemProp="position" content="2" />
        </span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-display mb-4">{video.title}</h1>

      <p className="text-muted-foreground mb-6">
        {[
          formatDate(video.date),
          video.duration > 0 ? formatDuration(video.duration) : "",
          video.type === "live" ? "стрім" : "відео",
        ]
          .filter(Boolean)
          .join(" · ")}
      </p>

      <div className="aspect-video w-full rounded-xl overflow-hidden border border-border mb-8">
        {video.videoId ? (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${video.videoId}`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          video.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={video.image}
              alt={video.title}
              className="w-full h-full object-cover"
            />
          )
        )}
      </div>

      {(video.speakers.length > 0 || video.host) && (
        <p className="mb-8 text-foreground">
          {video.speakers.length > 0 && (
            <>
              <span className="font-medium">Спікери: </span>
              {video.speakers.map((s, i) => (
                <span key={s.name}>
                  {i > 0 && ", "}
                  <SpeakerName speaker={s} />
                </span>
              ))}
            </>
          )}
          {video.host && (
            <>
              {video.speakers.length > 0 && ". "}
              <span className="font-medium">Ведуча: </span>
              <SpeakerName speaker={video.host} />
            </>
          )}
        </p>
      )}

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <MDXRemote source={video.content} components={mdxComponents} />
      </div>

      <div className="mt-12 p-6 bg-muted/30 rounded-xl border border-border">
        <p className="text-muted-foreground">
          Більше відео в{" "}
          <Link
            href="/videos"
            className="text-primary hover:text-accent underline transition-colors"
          >
            розділі Відео
          </Link>{" "}
          і на{" "}
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
      </div>
    </article>
  );
}
