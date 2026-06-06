import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { EventMeta, EventType, EventFormat } from "./events-types";

export type { EventMeta, EventType, EventFormat } from "./events-types";
export { EVENT_TYPE_LABELS, EVENT_FORMAT_LABELS } from "./events-types";

const eventsDirectory = path.join(process.cwd(), "content/events");

// ─── Read helpers ───────────────────────────────────────────────────────────

function toIsoDate(value: unknown): string {
  if (!value) return "";
  // gray-matter may parse an unquoted YAML date into a Date object.
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

/** Best-effort defaults so legacy frontmatter (without the new fields) still works. */
export function normalizeEvent(
  year: string,
  slug: string,
  data: Record<string, unknown>
): EventMeta {
  const isBlackFriday = slug.includes("black-friday");
  const type = (data.type as EventType) ?? (isBlackFriday ? "deals" : "other");
  const format = (data.format as EventFormat) ?? "online";
  const organizer = (data.organizer as string) ?? "SEO BAZA";

  return {
    year,
    slug,
    title: (data.title as string) ?? "Подія",
    subtitle: (data.subtitle as string) ?? undefined,
    description: (data.description as string) ?? "",
    date: toIsoDate(data.date),
    endDate: data.endDate ? toIsoDate(data.endDate) : undefined,
    dateLabel: (data.dateLabel as string) ?? undefined,
    type,
    format,
    organizer,
    organizerType:
      (data.organizerType as EventMeta["organizerType"]) ?? "Organization",
    organizerUrl: (data.organizerUrl as string) ?? undefined,
    isPartner: (data.isPartner as boolean) ?? organizer !== "SEO BAZA",
    city: (data.city as string) ?? undefined,
    country: (data.country as string) ?? undefined,
    venue: (data.venue as string) ?? undefined,
    streetAddress: (data.streetAddress as string) ?? undefined,
    postalCode: (data.postalCode as string) ?? undefined,
    language: (data.language as string) ?? "uk",
    registrationUrl: (data.registrationUrl as string) ?? undefined,
    status: (data.status as EventMeta["status"]) ?? "active",
    cover: (data.cover as string) ?? undefined,
    image: (data.image as string) ?? undefined,
    isFree: (data.isFree as boolean) ?? undefined,
    price: data.price != null ? String(data.price) : undefined,
    priceCurrency: (data.priceCurrency as string) ?? undefined,
    performers: Array.isArray(data.performers)
      ? (data.performers as EventMeta["performers"])
      : undefined,
  };
}

export function getAllEvents(): EventMeta[] {
  const events: EventMeta[] = [];

  if (!fs.existsSync(eventsDirectory)) return events;

  for (const year of fs.readdirSync(eventsDirectory)) {
    const yearPath = path.join(eventsDirectory, year);
    if (!fs.statSync(yearPath).isDirectory()) continue;

    for (const file of fs.readdirSync(yearPath)) {
      if (!file.endsWith(".mdx")) continue;
      try {
        const raw = fs.readFileSync(path.join(yearPath, file), "utf8");
        const { data } = matter(raw);
        events.push(normalizeEvent(year, file.replace(/\.mdx$/, ""), data));
      } catch {
        // skip unreadable files
      }
    }
  }

  // Newest first by start date.
  events.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return events;
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

/** Today as yyyy-mm-dd. ISO date strings compare correctly as plain strings. */
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** An event is past once its end date (or start date, if no end) is behind us. */
export function isPastEvent(event: EventMeta): boolean {
  const end = event.endDate || event.date;
  return end !== "" && end < today();
}

// ─── Collection helpers ─────────────────────────────────────────────────────

export interface SplitEvents {
  /** Future + currently-ongoing real events, soonest first. */
  upcoming: EventMeta[];
  /** Finished real events, newest first. */
  past: EventMeta[];
}

/**
 * Real events (meetups, conferences, webinars …) split into upcoming/past.
 * Deals (Black Friday) are excluded — they live in their own seasonal hub.
 */
export function getSplitEvents(): SplitEvents {
  const real = getAllEvents().filter((e) => e.type !== "deals");

  const upcoming = real
    .filter((e) => !isPastEvent(e))
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  const past = real.filter((e) => isPastEvent(e)); // already newest-first

  return { upcoming, past };
}

/** Newest Black Friday (deals) event, for the /events/black-friday hub. */
export function getLatestDealsEvent(): EventMeta | null {
  return getAllEvents().find((e) => e.type === "deals") ?? null;
}

// ─── Structured data ──────────────────────────────────────────────────────────

const SITE = "https://seobaza.com.ua";

function attendanceMode(format: EventFormat): string {
  if (format === "online") return "https://schema.org/OnlineEventAttendanceMode";
  if (format === "hybrid") return "https://schema.org/MixedEventAttendanceMode";
  return "https://schema.org/OfflineEventAttendanceMode";
}

function absUrl(maybePath?: string): string | undefined {
  if (!maybePath) return undefined;
  return maybePath.startsWith("http") ? maybePath : `${SITE}${maybePath}`;
}

/** schema.org/Event JSON-LD object — drives Google event rich results. */
export function eventToJsonLd(event: EventMeta): Record<string, unknown> {
  const url = `${SITE}/events/${event.year}/${event.slug}`;

  const location =
    event.format === "online"
      ? { "@type": "VirtualLocation", url: event.registrationUrl || url }
      : {
          "@type": "Place",
          name:
            event.venue ||
            [event.city, event.country].filter(Boolean).join(", ") ||
            "Україна",
          address: {
            "@type": "PostalAddress",
            ...(event.streetAddress ? { streetAddress: event.streetAddress } : {}),
            ...(event.postalCode ? { postalCode: event.postalCode } : {}),
            addressLocality: event.city,
            addressCountry: event.country,
          },
        };

  // Ticket offer — explicit price, or a $0 offer for free events.
  let offers: Record<string, unknown> | undefined;
  if (event.isFree) {
    offers = {
      "@type": "Offer",
      url: event.registrationUrl || url,
      price: "0",
      priceCurrency: event.priceCurrency || "UAH",
      availability: "https://schema.org/InStock",
    };
  } else if (event.price) {
    offers = {
      "@type": "Offer",
      url: event.registrationUrl || url,
      price: event.price,
      priceCurrency: event.priceCurrency || "USD",
      availability: "https://schema.org/InStock",
    };
  }

  const performer = event.performers?.length
    ? event.performers.map((p) => ({
        "@type": "Person",
        name: p.name,
        ...(p.sameAs ? { sameAs: p.sameAs } : {}),
      }))
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: event.date,
    ...(event.endDate ? { endDate: event.endDate } : {}),
    eventAttendanceMode: attendanceMode(event.format),
    eventStatus:
      event.status === "cancelled"
        ? "https://schema.org/EventCancelled"
        : "https://schema.org/EventScheduled",
    url,
    inLanguage: event.language,
    ...(absUrl(event.image) ? { image: absUrl(event.image) } : {}),
    location,
    ...(event.isFree != null ? { isAccessibleForFree: event.isFree } : {}),
    ...(offers ? { offers } : {}),
    ...(performer ? { performer } : {}),
    organizer: {
      "@type": event.organizerType,
      name: event.organizer,
      url: event.organizerUrl || SITE,
    },
  };
}
