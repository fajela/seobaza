import Link from "next/link";
import { notFound } from "next/navigation";
import { promises as fs } from "fs";
import path from "path";
import {
  getAllJobs,
  isClosedJob,
  jobPath,
  EMPLOYMENT_TYPE_LABELS,
} from "@/lib/jobs";
import { Breadcrumbs } from "@/components/breadcrumbs";
import type { Metadata } from "next";

interface CompanyPageProps {
  params: Promise<{ company: string }>;
}

export async function generateStaticParams() {
  const jobsPath = path.join(process.cwd(), "content", "jobs");
  try {
    const entries = await fs.readdir(jobsPath, { withFileTypes: true });
    return entries
      .filter((e) => e.isDirectory())
      .map((e) => ({ company: e.name }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: CompanyPageProps): Promise<Metadata> {
  const { company } = await params;
  const jobs = getAllJobs().filter((j) => j.companySlug === company);
  if (!jobs.length) return { title: "Вакансії не знайдено - SEO BAZA" };

  const name = jobs[0].company;
  const url = `https://seobaza.com.ua/jobs/${company}`;
  const title = `Вакансії ${name}: відкриті SEO-позиції - SEO BAZA`;
  const description = `Робота в ${name}: актуальні вакансії для SEO-спеціалістів з описом обов'язків, вимог і умов. Оберіть позицію та відгукніться!`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "SEO BAZA",
      locale: "uk_UA",
      type: "website",
    },
  };
}

export default async function CompanyJobsPage({ params }: CompanyPageProps) {
  const { company } = await params;
  const jobs = getAllJobs().filter((j) => j.companySlug === company);

  if (!jobs.length) {
    notFound();
  }

  const name = jobs[0].company;
  const companyUrl = jobs[0].companyUrl;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs
          items={[
            { name: "Головна", href: "/" },
            { name: "Вакансії", href: "/jobs" },
            { name: name, href: `/jobs/${company}` },
          ]}
        />
        <h1 className="text-4xl sm:text-5xl font-display mb-6 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Вакансії {name}
        </h1>
        {companyUrl && (
          <p className="text-lg text-muted-foreground mb-10">
            Сайт компанії:{" "}
            <a
              href={companyUrl}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="text-primary hover:text-accent underline transition-colors"
            >
              {companyUrl.replace(/^https?:\/\//, "")}
            </a>
          </p>
        )}

        <div className="flex flex-col gap-4">
          {jobs.map((job) => {
            const closed = isClosedJob(job);
            return (
              <Link
                key={job.slug}
                href={jobPath(job)}
                className={`block group rounded-xl p-6 border transition-all ${
                  closed
                    ? "border-border bg-muted/20 opacity-70 hover:opacity-100"
                    : "border-border bg-card hover:border-accent/70 hover:shadow-lg hover:shadow-accent/10"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-display group-hover:text-accent transition-colors">
                      {job.title}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-2">
                      {[
                        job.remote ? "Віддалено" : job.city,
                        EMPLOYMENT_TYPE_LABELS[job.employmentType],
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  {closed ? (
                    <span className="inline-block shrink-0 mt-1 px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground rounded-full">
                      Закрито
                    </span>
                  ) : (
                    <span className="text-accent text-2xl shrink-0">→</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <p className="mt-12 text-muted-foreground">
          Всі відкриті позиції дивіться на сторінці{" "}
          <Link
            href="/jobs"
            className="text-primary hover:text-accent underline transition-colors"
          >
            SEO вакансій
          </Link>
        </p>
      </div>
    </div>
  );
}
