// Client-safe event types & labels — NO Node (`fs`/`path`) imports here, so this
// module can be pulled into client components. FS reading lives in lib/events.ts.

export type EventType =
  | "meetup"
  | "conference"
  | "webinar"
  | "course"
  | "deals"
  | "other";

export type EventFormat = "offline" | "online" | "hybrid";

/** A speaker / panelist — maps to schema.org Person with an authority link. */
export interface Performer {
  name: string;
  /** Authority URL (LinkedIn, Wikidata, personal site …) for sameAs. */
  sameAs?: string;
}

export interface EventMeta {
  year: string;
  slug: string;
  title: string;
  /** Optional tagline shown under the title (e.g. "Search & AI"). */
  subtitle?: string;
  description: string;
  /** ISO start date — full "yyyy-mm-dd", or month precision "yyyy-mm" when TBD. */
  date: string;
  /** ISO end date — for multi-day events or a deals period. */
  endDate?: string;
  /** Human date label shown instead of a formatted date when the day is TBD,
   *  e.g. "Серпень 2026". The machine-readable `date` still drives sorting/schema. */
  dateLabel?: string;
  type: EventType;
  format: EventFormat;
  /** "SEO BAZA" for our own events, otherwise the partner/community name. */
  organizer: string;
  /** schema.org organizer type. */
  organizerType: "Organization" | "Person";
  /** Authority URL for the organizer. */
  organizerUrl?: string;
  /** true → event we were asked to share, not organized by us. */
  isPartner: boolean;
  city?: string;
  country?: string;
  /** Offline venue name, e.g. "OCTO Tower". */
  venue?: string;
  streetAddress?: string;
  postalCode?: string;
  language: string;
  registrationUrl?: string;
  /** Official standalone site of the event, if it has one. */
  website?: string;
  /** "active" | "cancelled". Past/upcoming is derived from dates, not this. */
  status: "active" | "cancelled";
  cover?: string;
  /** OG/social image for the event (schema.org image). */
  image?: string;
  /** Free admission → schema.org isAccessibleForFree + a $0 offer. */
  isFree?: boolean;
  price?: string;
  priceCurrency?: string;
  /** Speakers / panelists. */
  performers?: Performer[];
}

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  meetup: "Мітап",
  conference: "Конференція",
  webinar: "Вебінар",
  course: "Курс",
  deals: "Знижки",
  other: "Подія",
};

export const EVENT_FORMAT_LABELS: Record<EventFormat, string> = {
  offline: "Офлайн",
  online: "Онлайн",
  hybrid: "Офлайн + Онлайн",
};
