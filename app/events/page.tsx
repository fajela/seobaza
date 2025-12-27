import Link from "next/link";
import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";

export const metadata = {
  title: "Події - SEO BAZA",
  description: "SEOшні та околоSEOшні події від української спільноти",
};

async function getEvents() {
  const eventsPath = path.join(process.cwd(), "content", "events");
  const events: Array<{
    year: string;
    slug: string;
    title: string;
    description: string;
    date: string;
  }> = [];

  try {
    const years = await fs.readdir(eventsPath);

    for (const year of years) {
      const yearPath = path.join(eventsPath, year);
      const stat = await fs.stat(yearPath);

      if (stat.isDirectory()) {
        const files = await fs.readdir(yearPath);
        const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

        for (const file of mdxFiles) {
          const filePath = path.join(yearPath, file);
          const fileContent = await fs.readFile(filePath, "utf8");
          const { data } = matter(fileContent);

          events.push({
            year,
            slug: file.replace(".mdx", ""),
            title: data.title || "Untitled Event",
            description: data.description || "",
            date: data.date || "",
          });
        }
      }
    }

    // Sort by date descending (newest first)
    events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return events;
  } catch (error) {
    return [];
  }
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-display mb-6 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          SEOшні та околоSEOшні події
        </h1>
        <p className="text-lg text-muted-foreground mb-12">
          Знайомтеся, спілкуйтеся та розвивайтеся разом з українською
          SEO-спільнотою
        </p>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-6">
              Поки що немає запланованих подій.
            </p>
            <p className="text-sm text-muted-foreground">
              Слідкуйте за оновленнями в{" "}
              <a
                href="https://t.me/SEOBAZA"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-accent underline transition-colors"
              >
                Telegram каналі
              </a>
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {events.map((event) => (
              <Link
                key={`${event.year}-${event.slug}`}
                href={`/events/${event.year}/${event.slug}`}
                className="block group"
              >
                <article className="bg-secondary/30 rounded-xl p-6 border border-border transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-20 h-20 rounded-lg bg-accent/20 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-accent">
                        {new Date(event.date).getDate()}
                      </span>
                      <span className="text-xs text-accent uppercase">
                        {new Date(event.date).toLocaleDateString("uk-UA", {
                          month: "short",
                        })}
                      </span>
                      <span className="text-xs text-accent font-semibold mt-0.5">
                        {new Date(event.date).getFullYear()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-display mb-2 group-hover:text-accent transition-colors">
                        {event.title}
                      </h2>
                      <p className="text-muted-foreground mb-2">
                        {event.description}
                      </p>
                      <time
                        dateTime={event.date}
                        className="text-sm text-muted-foreground"
                      >
                        {new Date(event.date).toLocaleDateString("uk-UA", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 p-6 bg-muted/30 rounded-xl border border-border">
          <h3 className="text-lg font-display mb-3">
            Хочете організувати подію?
          </h3>
          <p className="text-muted-foreground">
            Напишіть{" "}
            <a
              href="https://t.me/fajela"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-accent underline transition-colors"
            >
              @fajela
            </a>{" "}
            в Telegram, і ми обговоримо деталі
          </p>
        </div>
      </div>
    </div>
  );
}
