/**
 * "Свіжі SEO-вакансії з ринку" on /jobs: vacancies collected once a day from
 * Ukrainian job boards (DOU, Djinni). Shown as plain links to the
 * original posting — no JobPosting markup, that stays on our own jobs only.
 * robota.ua and Work.ua are not used: robota.ua sits behind a Cloudflare bot
 * challenge, Work.ua has no feed.
 */

export type MarketJobSource = "DOU" | "Djinni";

export interface MarketJob {
  title: string;
  company: string;
  location?: string;
  salary?: string;
  datePosted: string; // yyyy-mm-dd
  url: string;
  source: MarketJobSource;
}

/** Revalidate the /jobs page (and these fetches) once a day. */
export const MARKET_JOBS_REVALIDATE = 86400;

const MAX_AGE_DAYS = 30;
const UA = "Mozilla/5.0 (compatible; SEOBazaJobs/1.0; +https://seobaza.com.ua/jobs)";

/** Djinni's SEO category also holds Amazon, PPC-only and similar roles. */
const SEO_TITLE = /\bseo\b|\bgeo\b|сео|лінкбілд|linkbuild|link build|аутріч|outreach|organic/i;

/**
 * Companies we never show: SEO Baza black/grey list (C:\seobaza\CHORNYI-SPYSOK.md)
 * by company or project name. Lowercase substrings of the company name.
 */
const BLOCKED_COMPANIES = [
  "unmiss",
  "seotools.tv",
  "rankup",
  "jugabet",
  "wdn.team",
  "wooden",
  "justseo",
  "links-stream",
];

function isBlocked(company: string): boolean {
  const c = company.toLowerCase();
  return BLOCKED_COMPANIES.some((b) => c.includes(b));
}

function decodeEntities(s: string): string {
  let out = s;
  // DOU double-encodes ampersands (&amp;amp;), so decode until stable.
  for (let i = 0; i < 3; i++) {
    const next = out
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;|&#x27;|&apos;/g, "'")
      .replace(/&nbsp;/g, " ");
    if (next === out) break;
    out = next;
  }
  return out.trim();
}

async function getText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": UA },
    next: { revalidate: MARKET_JOBS_REVALIDATE },
  });
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  return res.text();
}

// ─── DOU: RSS of the SEO category ────────────────────────────────────────────

/** DOU item titles look like "SEO Specialist в Company, $1500–3000, Київ, віддалено". */
function parseDouTitle(raw: string): Pick<MarketJob, "title" | "company" | "location" | "salary"> {
  const t = decodeEntities(raw);
  const m = t.match(/^(.+) в ([^,]+?)(?:, (.*))?$/);
  if (!m) return { title: t, company: "" };
  const parts = (m[3] ?? "").split(",").map((p) => p.trim()).filter(Boolean);
  const salary = parts.filter((p) => /[$€₴]|грн/.test(p));
  const places = parts.filter((p) => !salary.includes(p));
  return {
    title: m[1].trim(),
    company: m[2].trim(),
    salary: salary.join(", ") || undefined,
    location: places.join(", ") || undefined,
  };
}

async function fetchDou(): Promise<MarketJob[]> {
  const xml = await getText("https://jobs.dou.ua/vacancies/feeds/?category=SEO");
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
  return items.map((item) => {
    const pick = (tag: string) =>
      item.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`))?.[1] ?? "";
    const url = decodeEntities(pick("link")).replace(/\?utm_source=jobsrss$/, "");
    return {
      ...parseDouTitle(pick("title")),
      datePosted: new Date(pick("pubDate")).toISOString().slice(0, 10),
      url,
      source: "DOU" as const,
    };
  });
}

// ─── Djinni: JobPosting JSON-LD on the SEO listing pages ─────────────────────

interface DjinniPosting {
  title?: string;
  url?: string;
  datePosted?: string;
  jobLocationType?: string;
  hiringOrganization?: { name?: string };
  baseSalary?: {
    currency?: string;
    value?: { minValue?: number; maxValue?: number };
  };
}

function formatSalary(min?: number, max?: number, currency?: string): string | undefined {
  if (!min && !max) return undefined;
  const sign = currency === "USD" ? "$" : currency === "EUR" ? "€" : "";
  const range = min && max && min !== max ? `${min}–${max}` : `${min || max}`;
  return sign ? `${sign}${range}` : `${range} грн`;
}

async function fetchDjinni(): Promise<MarketJob[]> {
  const jobs: MarketJob[] = [];
  for (let page = 1; page <= 4; page++) {
    const html = await getText(`https://djinni.co/jobs/?primary_keyword=SEO&page=${page}`);
    const json = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
    if (!json) break;
    const postings = JSON.parse(json) as DjinniPosting[];
    if (!Array.isArray(postings) || !postings.length) break;
    for (const p of postings) {
      if (!p.title || !p.url || !p.datePosted || !SEO_TITLE.test(p.title)) continue;
      jobs.push({
        title: decodeEntities(p.title),
        company: decodeEntities(p.hiringOrganization?.name ?? ""),
        location: p.jobLocationType === "TELECOMMUTE" ? "віддалено" : undefined,
        salary: formatSalary(
          p.baseSalary?.value?.minValue,
          p.baseSalary?.value?.maxValue,
          p.baseSalary?.currency
        ),
        datePosted: p.datePosted.slice(0, 10),
        url: p.url,
        source: "Djinni",
      });
    }
  }
  return jobs;
}

// ─── Merge ───────────────────────────────────────────────────────────────────

function dedupeKey(j: MarketJob): string {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-zа-яіїєґ0-9]+/gi, "");
  return `${norm(j.company)}|${norm(j.title)}`;
}

export interface MarketJobsResult {
  jobs: MarketJob[];
  updatedAt: string; // ISO timestamp of this build/revalidation
}

/** Collect, filter, de-duplicate and sort. A failing source is skipped, never fatal. */
export async function getMarketJobs(): Promise<MarketJobsResult> {
  const settled = await Promise.allSettled([fetchDou(), fetchDjinni()]);
  const all: MarketJob[] = [];
  for (const r of settled) {
    if (r.status === "fulfilled") all.push(...r.value);
    else console.error("[market-jobs]", r.reason);
  }

  const cutoff = new Date(Date.now() - MAX_AGE_DAYS * 86400_000).toISOString().slice(0, 10);
  const seen = new Set<string>();
  const jobs = all
    .filter((j) => j.company && j.datePosted >= cutoff && !isBlocked(j.company))
    .sort((a, b) => (a.datePosted < b.datePosted ? 1 : a.datePosted > b.datePosted ? -1 : 0))
    .filter((j) => {
      const key = dedupeKey(j);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

  return { jobs, updatedAt: new Date().toISOString() };
}
