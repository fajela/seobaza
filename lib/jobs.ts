import fs from "fs";
import path from "path";
import matter from "gray-matter";

const jobsDirectory = path.join(process.cwd(), "content/jobs");

/** schema.org employmentType values Google accepts for JobPosting. */
export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACTOR"
  | "TEMPORARY"
  | "INTERN"
  | "VOLUNTEER"
  | "PER_DIEM"
  | "OTHER";

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  FULL_TIME: "Повна зайнятість",
  PART_TIME: "Часткова зайнятість",
  CONTRACTOR: "Контракт",
  TEMPORARY: "Тимчасова робота",
  INTERN: "Стажування",
  VOLUNTEER: "Волонтерство",
  PER_DIEM: "Погодинна робота",
  OTHER: "Інше",
};

export interface JobMeta {
  /** Company folder name in content/jobs/ — first URL segment. */
  companySlug: string;
  slug: string;
  /** Job title only — no company name, location or dates (Google requirement). */
  title: string;
  company: string;
  companyUrl?: string;
  /** Site-relative or absolute logo URL (Google recommends it for job boards). */
  companyLogo?: string;
  /** Meta description for the page, NOT the JobPosting description. */
  description: string;
  datePosted: string; // yyyy-mm-dd
  /** Application deadline. Past date = the job auto-closes on the site. */
  validThrough?: string; // yyyy-mm-dd
  employmentType: EmploymentType;
  /** true = 100% remote → TELECOMMUTE + applicantLocationRequirements. */
  remote: boolean;
  city?: string;
  /** ISO 3166-1 alpha-2, e.g. "UA". */
  country: string;
  /** Country name for applicantLocationRequirements (remote jobs). */
  applicantCountryName?: string;
  applyUrl: string;
  identifierName?: string;
  identifierValue?: string;
  /** true when applying is one short step (e.g. an email), false for external multi-step flows. */
  directApply: boolean;
  /** Manual switch to close a job before validThrough. */
  closed: boolean;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  salaryUnit?: "HOUR" | "DAY" | "WEEK" | "MONTH" | "YEAR";
}

function toIsoDate(value: unknown): string {
  if (!value) return "";
  // gray-matter may parse an unquoted YAML date into a Date object.
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

export function normalizeJob(
  companySlug: string,
  slug: string,
  data: Record<string, unknown>
): JobMeta {
  return {
    companySlug,
    slug,
    title: (data.title as string) ?? "Вакансія",
    company: (data.company as string) ?? "",
    companyUrl: (data.companyUrl as string) ?? undefined,
    companyLogo: (data.companyLogo as string) ?? undefined,
    description: (data.description as string) ?? "",
    datePosted: toIsoDate(data.datePosted),
    validThrough: data.validThrough ? toIsoDate(data.validThrough) : undefined,
    employmentType: (data.employmentType as EmploymentType) ?? "FULL_TIME",
    remote: (data.remote as boolean) ?? false,
    city: (data.city as string) ?? undefined,
    country: (data.country as string) ?? "UA",
    applicantCountryName: (data.applicantCountryName as string) ?? undefined,
    applyUrl: (data.applyUrl as string) ?? "",
    identifierName: (data.identifierName as string) ?? undefined,
    identifierValue:
      data.identifierValue != null ? String(data.identifierValue) : undefined,
    directApply: (data.directApply as boolean) ?? false,
    closed: (data.closed as boolean) ?? false,
    salaryMin: (data.salaryMin as number) ?? undefined,
    salaryMax: (data.salaryMax as number) ?? undefined,
    salaryCurrency: (data.salaryCurrency as string) ?? undefined,
    salaryUnit: (data.salaryUnit as JobMeta["salaryUnit"]) ?? undefined,
  };
}

/** URL pattern: /jobs/[companySlug]/[slug]. */
export function jobPath(job: Pick<JobMeta, "companySlug" | "slug">): string {
  return `/jobs/${job.companySlug}/${job.slug}`;
}

export function getAllJobs(): JobMeta[] {
  const jobs: JobMeta[] = [];
  if (!fs.existsSync(jobsDirectory)) return jobs;

  for (const company of fs.readdirSync(jobsDirectory)) {
    const companyPath = path.join(jobsDirectory, company);
    if (!fs.statSync(companyPath).isDirectory()) continue;

    for (const file of fs.readdirSync(companyPath)) {
      if (!file.endsWith(".mdx")) continue;
      try {
        const raw = fs.readFileSync(path.join(companyPath, file), "utf8");
        const { data } = matter(raw);
        jobs.push(normalizeJob(company, file.replace(/\.mdx$/, ""), data));
      } catch {
        // skip unreadable files
      }
    }
  }

  // Newest first.
  jobs.sort((a, b) => (a.datePosted < b.datePosted ? 1 : a.datePosted > b.datePosted ? -1 : 0));
  return jobs;
}

/** Today as yyyy-mm-dd. ISO date strings compare correctly as plain strings. */
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** A job is closed manually or once its application deadline passes. */
export function isClosedJob(job: JobMeta): boolean {
  if (job.closed) return true;
  return !!job.validThrough && job.validThrough < today();
}

export interface SplitJobs {
  active: JobMeta[];
  closedJobs: JobMeta[];
}

export function getSplitJobs(): SplitJobs {
  const all = getAllJobs();
  return {
    active: all.filter((j) => !isClosedJob(j)),
    closedJobs: all.filter((j) => isClosedJob(j)),
  };
}

// ─── Structured data ──────────────────────────────────────────────────────────

const SITE = "https://seobaza.com.ua";

function absUrl(maybePath?: string): string | undefined {
  if (!maybePath) return undefined;
  return maybePath.startsWith("http") ? maybePath : `${SITE}${maybePath}`;
}

/**
 * Minimal markdown → HTML for the JobPosting `description` property. Google
 * wants the FULL description with paragraph/list structure preserved, so the
 * markup must match the visible page content one-to-one.
 */
export function jobDescriptionHtml(md: string): string {
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const stripMd = (s: string) =>
    s.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/\*\*/g, "");

  const out: string[] = [];
  let list: string[] = [];
  const flushList = () => {
    if (list.length) {
      out.push(`<ul>${list.map((l) => `<li>${l}</li>`).join("")}</ul>`);
      list = [];
    }
  };

  for (const raw of md.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) {
      flushList();
      continue;
    }
    const plain = esc(stripMd(line));
    if (/^#{1,6}\s/.test(line)) {
      flushList();
      out.push(`<p><strong>${plain.replace(/^#{1,6}\s*/, "")}</strong></p>`);
    } else if (/^[-*]\s/.test(line)) {
      list.push(plain.replace(/^[-*]\s*/, ""));
    } else {
      flushList();
      out.push(`<p>${plain}</p>`);
    }
  }
  flushList();
  return out.join("");
}

/**
 * schema.org/JobPosting JSON-LD — follows Google's job posting structured data
 * guidelines. Emit ONLY on the individual job page (never on the /jobs list)
 * and ONLY while the job is open; a closed job keeps its page but drops the
 * markup, which is one of Google's accepted ways to expire a posting.
 */
export function jobToJsonLd(job: JobMeta, content: string): Record<string, unknown> {
  const salary =
    job.salaryCurrency && job.salaryUnit && (job.salaryMin || job.salaryMax)
      ? {
          "@type": "MonetaryAmount",
          currency: job.salaryCurrency,
          value: {
            "@type": "QuantitativeValue",
            ...(job.salaryMin ? { minValue: job.salaryMin } : {}),
            ...(job.salaryMax ? { maxValue: job.salaryMax } : {}),
            unitText: job.salaryUnit,
          },
        }
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: jobDescriptionHtml(content),
    datePosted: job.datePosted,
    ...(job.validThrough ? { validThrough: job.validThrough } : {}),
    employmentType: job.employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
      ...(job.companyUrl ? { sameAs: job.companyUrl, url: job.companyUrl } : {}),
      ...(absUrl(job.companyLogo) ? { logo: absUrl(job.companyLogo) } : {}),
    },
    ...(job.identifierValue
      ? {
          identifier: {
            "@type": "PropertyValue",
            name: job.identifierName || job.company,
            value: job.identifierValue,
          },
        }
      : {}),
    // jobLocation is optional for 100% remote jobs that declare
    // applicantLocationRequirements; emit it only when there is a real office.
    ...(!job.remote || job.city
      ? {
          jobLocation: {
            "@type": "Place",
            address: {
              "@type": "PostalAddress",
              ...(job.city ? { addressLocality: job.city } : {}),
              addressCountry: job.country,
            },
          },
        }
      : {}),
    // 100% remote jobs: TELECOMMUTE + where applicants may be based.
    ...(job.remote
      ? {
          jobLocationType: "TELECOMMUTE",
          applicantLocationRequirements: {
            "@type": "Country",
            name: job.applicantCountryName || "Ukraine",
          },
        }
      : {}),
    ...(salary ? { baseSalary: salary } : {}),
    directApply: job.directApply,
  };
}
