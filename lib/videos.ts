import fs from "fs";
import path from "path";
import matter from "gray-matter";

const videosDirectory = path.join(process.cwd(), "content/videos");

// ─── Types ────────────────────────────────────────────────────────────────────

export interface VideoSpeaker {
  name: string;
  /** sb-id of the person's KG profile (sb0002, ...) — links to /kg/person/<kgId>. */
  kgId?: string;
  /** Explicit link when the person has a page outside /kg (e.g. /authors/...). */
  url?: string;
}

export interface VideoMeta {
  slug: string;
  title: string;
  /** YouTube video id. */
  videoId: string;
  /** Kyiv date of the stream / upload, yyyy-mm-dd. */
  date: string;
  /**
   * Full ISO 8601 publish moment with Kyiv offset, e.g. 2026-08-12T18:42:32+03:00.
   * Google requires a timezone on VideoObject uploadDate; a bare date gets flagged
   * in Search Console ("missing a timezone").
   */
  uploadTime?: string;
  /** Length in seconds. */
  duration: number;
  /** live = стрім, video = звичайне відео. */
  type: "live" | "video";
  description: string;
  speakers: VideoSpeaker[];
  /** Ведучий, коли відрізняється від спікерів. */
  host?: VideoSpeaker;
  status: "draft" | "published";
  /** 1200×630 featured image under /images/videos/. */
  image?: string;
}

export interface Video extends VideoMeta {
  content: string;
}

// ─── Read helpers ─────────────────────────────────────────────────────────────

function toIsoDate(value: unknown): string {
  if (!value) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

function readVideoFile(filename: string): Video {
  const fullPath = path.join(videosDirectory, filename);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);

  return {
    slug: filename.replace(/\.mdx$/, ""),
    title: data.title ?? "",
    videoId: data.videoId ?? "",
    date: toIsoDate(data.date),
    uploadTime: data.uploadTime,
    duration: Number(data.duration ?? 0),
    type: data.type === "live" ? "live" : "video",
    description: data.description ?? "",
    speakers: Array.isArray(data.speakers) ? data.speakers : [],
    host: data.host,
    status: data.status === "published" ? "published" : "draft",
    image: data.image,
    content: content.trim(),
  };
}

export function getAllVideos(includeDrafts = false): Video[] {
  if (!fs.existsSync(videosDirectory)) return [];
  return fs
    .readdirSync(videosDirectory)
    .filter((f) => f.endsWith(".mdx"))
    .map(readVideoFile)
    .filter((v) => includeDrafts || v.status === "published")
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function getVideoBySlug(slug: string): Video | null {
  const fullPath = path.join(videosDirectory, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;
  return readVideoFile(`${slug}.mdx`);
}

// ─── Presentation helpers ─────────────────────────────────────────────────────

/** 4017 → "1 год 7 хв"; 382 → "6 хв". */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  if (h > 0) return m > 0 ? `${h} год ${m} хв` : `${h} год`;
  return `${m} хв`;
}

/** 4017 → "PT1H6M57S" (ISO 8601 for schema.org duration). */
export function isoDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `PT${h > 0 ? `${h}H` : ""}${m > 0 ? `${m}M` : ""}${s > 0 ? `${s}S` : ""}` || "PT0S";
}

// ─── Structured data ──────────────────────────────────────────────────────────

const SITE = "https://seobaza.com.ua";

// The video series entity: every recording on /videos is an episode of
// My Dudes Production (KG node sb0013). CreativeWorkSeries is the generic
// series type — not PodcastSeries (no RSS audio feed) and not TVSeries.
export const SERIES_ID = `${SITE}/videos#series`;

export function seriesJsonLd(): Record<string, unknown> {
  return {
    "@type": "CreativeWorkSeries",
    "@id": SERIES_ID,
    name: "My Dudes Production",
    description: "Відеосерія SEO Baza: лайвстріми і відео української SEO-спільноти.",
    url: `${SITE}/videos`,
    inLanguage: "uk",
    publisher: {
      "@type": "Organization",
      name: "SEO BAZA",
      url: SITE,
    },
  };
}

function speakerJsonLd(s: VideoSpeaker): Record<string, unknown> {
  const url = s.kgId ? `${SITE}/kg/person/${s.kgId}` : s.url ? `${SITE}${s.url}` : undefined;
  return {
    "@type": "Person",
    name: s.name,
    ...(url ? { url } : {}),
  };
}

/** schema.org/VideoObject JSON-LD. Учасники відео розмічаються як спікери.
 *  bare: без @context, для вкладання у спільний @graph. */
export function videoToJsonLd(
  video: VideoMeta,
  opts?: { bare?: boolean },
): Record<string, unknown> {
  const pageUrl = `${SITE}/videos/${video.slug}`;
  const people = [...video.speakers, ...(video.host ? [video.host] : [])];

  return {
    ...(opts?.bare ? {} : { "@context": "https://schema.org" }),
    "@type": "VideoObject",
    name: video.title,
    description: video.description,
    thumbnailUrl: video.image
      ? `${SITE}${video.image}`
      : `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`,
    // Full datetime with offset when known; midnight Kyiv otherwise, so the
    // value always carries a timezone.
    uploadDate: video.uploadTime || `${video.date}T00:00:00+03:00`,
    ...(video.duration > 0 ? { duration: isoDuration(video.duration) } : {}),
    ...(video.videoId
      ? {
          contentUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
          embedUrl: `https://www.youtube.com/embed/${video.videoId}`,
        }
      : {}),
    url: pageUrl,
    inLanguage: "uk",
    isPartOf: { "@id": SERIES_ID },
    ...(people.length
      ? {
          // schema.org VideoObject has no "speaker" property; actor is the
          // property for people appearing in a video. The on-page section and
          // the knowledge graph edge still call them спікери.
          actor: people.map(speakerJsonLd),
        }
      : {}),
    publisher: {
      "@type": "Organization",
      name: "SEO BAZA",
      url: SITE,
    },
  };
}
