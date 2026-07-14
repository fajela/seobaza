import Link from "next/link";
import { getSplitEvents, getLatestDealsEvent, eventToJsonLd } from "@/lib/events";
import { EventsList } from "@/components/events-list";
import { pageMeta } from "@/lib/page-metadata";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata = pageMeta({
  title: "Події - SEO BAZA",
  description: "SEOшні та навколоSEOшні події від української спільноти",
  path: "/events",
});

export default function EventsPage() {
  const { upcoming, past } = getSplitEvents();
  const deals = getLatestDealsEvent();
  const all = [...upcoming, ...past];

  // Banner features only SEO Baza's OWN soonest upcoming event (we don't promote
  // external events here); falls back to the Black Friday hub when there is none.
  const nextEvent = upcoming.find((e) => !e.isPartner);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "SEOшні та навколоSEOшні події",
    numberOfItems: all.length,
    itemListElement: all.map((event, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: eventToJsonLd(event),
    })),
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto">
        <Breadcrumbs items={[{ name: "Головна", href: "/" }, { name: "Події", href: "/events" }]} />
        <h1 className="text-4xl sm:text-5xl font-display mb-6 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          SEOшні та навколоSEOшні події
        </h1>
        <p className="text-lg text-muted-foreground mb-10">
          Знайомтеся, спілкуйтеся та розвивайтеся разом з українською
          SEO-спільнотою
        </p>

        {/* Banner: next upcoming event, else the Black Friday seasonal hub */}
        {nextEvent ? (
          <Link
            href={`/events/${nextEvent.year}/${nextEvent.slug}`}
            className="block group mb-12 rounded-xl p-6 border border-accent/40 bg-gradient-to-r from-accent/10 to-primary/10 transition-all hover:border-accent/70 hover:shadow-lg hover:shadow-accent/10"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="inline-block mb-2 px-2 py-0.5 text-xs font-medium bg-accent/20 text-accent rounded-full">
                  Найближча подія
                </span>
                <h2 className="text-xl sm:text-2xl font-display group-hover:text-accent transition-colors">
                  {nextEvent.title}
                </h2>
                {nextEvent.subtitle && (
                  <p className="text-sm font-medium text-accent mt-1">
                    {nextEvent.subtitle}
                  </p>
                )}
                <p className="text-muted-foreground mt-1">
                  {[
                    nextEvent.dateLabel,
                    nextEvent.city && `📍 ${nextEvent.city}`,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
              <span className="text-accent text-2xl shrink-0">→</span>
            </div>
          </Link>
        ) : deals ? (
          <Link
            href="/black-friday"
            className="block group mb-12 rounded-xl p-6 border border-accent/40 bg-gradient-to-r from-accent/10 to-primary/10 transition-all hover:border-accent/70 hover:shadow-lg hover:shadow-accent/10"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="inline-block mb-2 px-2 py-0.5 text-xs font-medium bg-accent/20 text-accent rounded-full">
                  Сезонна добірка
                </span>
                <h2 className="text-xl sm:text-2xl font-display group-hover:text-accent transition-colors">
                  💥 Чорна п&apos;ятниця в українському SEO
                </h2>
                <p className="text-muted-foreground mt-1">
                  Знижки та бонуси від українських SEO-компаній і сервісів
                </p>
              </div>
              <span className="text-accent text-2xl shrink-0">→</span>
            </div>
          </Link>
        ) : null}

        <EventsList upcoming={upcoming} past={past} />

        <div className="mt-12 p-6 bg-muted/30 rounded-xl border border-border">
          <h2 className="text-lg font-display mb-3">
            Додайте свою подію
          </h2>
          <p className="text-muted-foreground">
            Напишіть{" "}
            <a
              href="https://t.me/TheBronso"
              target="_blank"
              className="text-primary hover:text-accent underline transition-colors"
            >
              @TheBronso
            </a>{" "}
            в Telegram, і ми додамо її в календар
          </p>
        </div>
      </div>
    </div>
  );
}
