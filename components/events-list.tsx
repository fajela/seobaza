"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { type EventMeta, EVENT_TYPE_LABELS } from "@/lib/events-types";

type FilterKey = "all" | "offline" | "online" | "seobaza";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "Усі" },
  { key: "offline", label: "Офлайн" },
  { key: "online", label: "Онлайн" },
  { key: "seobaza", label: "Від SEO Baza" },
];

function matchesFilter(event: EventMeta, filter: FilterKey): boolean {
  switch (filter) {
    case "offline":
      return event.format === "offline" || event.format === "hybrid";
    case "online":
      return event.format === "online" || event.format === "hybrid";
    case "seobaza":
      return !event.isPartner;
    default:
      return true;
  }
}

function formatDate(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("uk-UA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** "12 — 14 вересня 2025" style range, collapsing shared month/year. */
function formatDateRange(date: string, endDate?: string): string {
  if (!endDate || endDate === date) return formatDate(date);
  return `${formatDate(date)} — ${formatDate(endDate)}`;
}

function PlaceLabel({ event }: { event: EventMeta }) {
  if (event.format === "online") return <>🟢 Онлайн</>;
  const place = [event.city, event.country].filter(Boolean).join(", ");
  const icon = event.format === "hybrid" ? "🟢📍" : "📍";
  return <>{`${icon} ${place || "Офлайн"}`}</>;
}

function EventCard({ event, past }: { event: EventMeta; past: boolean }) {
  const href = `/events/${event.year}/${event.slug}`;
  const cancelled = event.status === "cancelled";

  return (
    <div className={`relative group ${past ? "opacity-70" : ""}`}>
      <Link
        href={href}
        className="absolute inset-0 z-10 rounded-xl"
        aria-label={event.title}
      />
      <article className="relative bg-secondary/30 rounded-xl p-6 border border-border transition-all group-hover:border-accent/50 group-hover:shadow-lg group-hover:shadow-accent/10">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3 text-xs font-medium">
          <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full">
            {EVENT_TYPE_LABELS[event.type]}
          </span>
          <span className="px-2 py-0.5 bg-secondary text-muted-foreground rounded-full">
            <PlaceLabel event={event} />
          </span>
          {!event.isPartner ? (
            <span className="px-2 py-0.5 bg-accent/15 text-accent rounded-full">
              Від SEO Baza
            </span>
          ) : (
            <span className="px-2 py-0.5 bg-secondary text-muted-foreground rounded-full">
              {event.organizer}
            </span>
          )}
          {cancelled && (
            <span className="px-2 py-0.5 bg-destructive/15 text-destructive rounded-full">
              Скасовано
            </span>
          )}
          {past && !cancelled && (
            <span className="px-2 py-0.5 bg-secondary text-muted-foreground rounded-full">
              Завершено
            </span>
          )}
        </div>

        <h3 className="text-xl sm:text-2xl font-display mb-1 group-hover:text-accent transition-colors">
          {event.title}
        </h3>

        {event.subtitle && (
          <p className="text-sm font-medium text-accent mb-2">{event.subtitle}</p>
        )}

        <time
          dateTime={event.date}
          className="block text-sm text-muted-foreground mb-3"
        >
          {event.dateLabel || formatDateRange(event.date, event.endDate)}
        </time>

        <p className="text-muted-foreground mb-4">{event.description}</p>

        {!past && !cancelled && !event.registrationUrl && (
          <p className="text-sm text-muted-foreground italic">
            Дата, спікери та реєстрація — згодом. Слідкуйте за анонсами.
          </p>
        )}

        {!past && !cancelled && event.registrationUrl && (
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-20 inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-accent text-white rounded-lg font-medium transition-colors"
          >
            Зареєструватися
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        )}
      </article>
    </div>
  );
}

export function EventsList({
  upcoming,
  past,
}: {
  upcoming: EventMeta[];
  past: EventMeta[];
}) {
  const [filter, setFilter] = useState<FilterKey>("all");

  const filteredUpcoming = useMemo(
    () => upcoming.filter((e) => matchesFilter(e, filter)),
    [upcoming, filter]
  );
  const filteredPast = useMemo(
    () => past.filter((e) => matchesFilter(e, filter)),
    [past, filter]
  );

  const nothing = filteredUpcoming.length === 0 && filteredPast.length === 0;

  return (
    <div>
      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-10">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            aria-pressed={filter === f.key}
            className={
              filter === f.key
                ? "px-4 py-1.5 rounded-full text-sm font-medium bg-accent text-background"
                : "px-4 py-1.5 rounded-full text-sm font-medium border border-border hover:border-accent/50 hover:text-accent transition-colors"
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {nothing ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-6">
            За цим фільтром подій немає.
          </p>
          <p className="text-sm text-muted-foreground">
            Слідкуйте за оновленнями в{" "}
            <a
              href="https://t.me/SEOBAZA"
              target="_blank"
              className="text-primary hover:text-accent underline transition-colors"
            >
              Telegram каналі
            </a>
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-display mb-6">Найближчі події</h2>
            {filteredUpcoming.length > 0 ? (
              <div className="grid gap-6">
                {filteredUpcoming.map((event) => (
                  <EventCard
                    key={`${event.year}-${event.slug}`}
                    event={event}
                    past={false}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                Найближчих подій поки немає — стежте за анонсами.
              </p>
            )}
          </section>

          {filteredPast.length > 0 && (
            <section>
              <h2 className="text-2xl font-display mb-6">Архів</h2>
              <div className="grid gap-6">
                {filteredPast.map((event) => (
                  <EventCard
                    key={`${event.year}-${event.slug}`}
                    event={event}
                    past
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
