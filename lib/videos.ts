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

function speakerJsonLd(s: VideoSpeaker): Record<string, unknown> {
  const url = s.kgId ? `${SITE}/kg/person/${s.kgId}` : s.url ? `${SITE}${s.url}` : undefined;
  return {
    "@type": "Person",
    name: s.name,
    ...(url ? { url } : {}),
  };
}

/** schema.org/VideoObject JSON-LD. Учасники відео розмічаються як спікери. */
export function videoToJsonLd(video: VideoMeta): Record<string, unknown> {
  const pageUrl = `${SITE}/videos/${video.slug}`;
  const people = [...video.speakers, ...(video.host ? [video.host] : [])];

  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description,
    thumbnailUrl: video.image
      ? `${SITE}${video.image}`
      : `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`,
    uploadDate: video.date,
    ...(video.duration > 0 ? { duration: isoDuration(video.duration) } : {}),
    ...(video.videoId
      ? {
          contentUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
          embedUrl: `https://www.youtube.com/embed/${video.videoId}`,
        }
      : {}),
    url: pageUrl,
    inLanguage: "uk",
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
