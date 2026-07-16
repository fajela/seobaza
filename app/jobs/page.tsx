import Link from "next/link";
import { getSplitJobs, isClosedJob, jobPath, EMPLOYMENT_TYPE_LABELS } from "@/lib/jobs";
import type { JobMeta } from "@/lib/jobs";
import { pageMeta } from "@/lib/page-metadata";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata = pageMeta({
  title: "SEO вакансії: робота для SEO-спеціалістів в Україні - SEO BAZA",
  description:
    "Актуальні вакансії для SEOшників від українських компаній і проєктів. Віддалена робота, лінкбілдинг, AI SEO. Знайдіть роботу або додайте свою вакансію!",
  path: "/jobs",
});

function formatUkrDate(iso: string): string {
  if (!iso) return "";
  const months = [
    "січня", "лютого", "березня", "квітня", "травня", "червня",
    "липня", "серпня", "вересня", "жовтня", "листопада", "грудня",
  ];
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${months[m - 1]} ${y}`;
}

function JobCard({ job }: { job: JobMeta }) {
  const closed = isClosedJob(job);
  const location = job.remote
    ? "Віддалено" + (job.city ? ` · ${job.city}` : "")
    : [job.city, job.country === "UA" ? "Україна" : job.country]
        .filter(Boolean)
        .join(", ");

  return (
    <Link
      href={jobPath(job)}
      className={`block group rounded-xl p-6 border transition-all ${
        closed
          ? "border-border bg-muted/20 opacity-70 hover:opacity-100"
          : "border-border bg-card hover:border-accent/70 hover:shadow-lg hover:shadow-accent/10"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-display group-hover:text-accent transition-colors">
            {job.title}
          </h3>
          <p className="text-sm font-medium text-accent mt-1">{job.company}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {[
              location,
              EMPLOYMENT_TYPE_LABELS[job.employmentType],
              formatUkrDate(job.datePosted),
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
        <span className="shrink-0 mt-1">
          {closed ? (
            <span className="inline-block px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground rounded-full">
              Закрито
            </span>
          ) : (
            <span className="text-accent text-2xl">→</span>
          )}
        </span>
      </div>
    </Link>
  );
}

export default function JobsPage() {
  const { active, closedJobs } = getSplitJobs();

  // A plain ItemList of URLs. JobPosting markup lives ONLY on the individual
  // job pages — Google's guidelines forbid it on list pages.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "SEO вакансії",
    numberOfItems: active.length,
    itemListElement: active.map((job, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://seobaza.com.ua${jobPath(job)}`,
    })),
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto">
        <Breadcrumbs
          items={[{ name: "Головна", href: "/" }, { name: "Вакансії", href: "/jobs" }]}
        />
        <h1 className="text-4xl sm:text-5xl font-display mb-6 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          SEO вакансії
        </h1>
        <p className="text-lg text-muted-foreground mb-10">
          Робота для SEO-спеціалістів від українських компаній і проєктів
        </p>

        {active.length > 0 ? (
          <div className="flex flex-col gap-4">
            {active.map((job) => (
              <JobCard key={job.slug} job={job} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            Відкритих позицій зараз немає. Зазирніть пізніше або підпишіться на{" "}
            <Link
              href="/newsletter"
              className="text-primary hover:text-accent underline transition-colors"
            >
              розсилку
            </Link>
            , щоб не пропустити нові.
          </p>
        )}

        {closedJobs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-display mb-6">Закриті вакансії</h2>
            <div className="flex flex-col gap-4">
              {closedJobs.map((job) => (
                <JobCard key={job.slug} job={job} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 p-6 bg-muted/30 rounded-xl border border-border">
          <h2 className="text-lg font-display mb-3">Додайте свою вакансію</h2>
          <p className="text-muted-foreground">
            Шукаєте SEOшника в команду? Напишіть{" "}
            <a
              href="https://t.me/TheBronso"
              target="_blank"
              className="text-primary hover:text-accent underline transition-colors"
            >
              @TheBronso
            </a>{" "}
            в Telegram, і ми розмістимо вашу позицію
          </p>
        </div>
      </div>
    </div>
  );
}
