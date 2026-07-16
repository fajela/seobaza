import { notFound } from "next/navigation";
import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import { MdxImg, MdxLink } from "@/components/mdx-img";
import {
  normalizeJob,
  isClosedJob,
  jobToJsonLd,
  EMPLOYMENT_TYPE_LABELS,
} from "@/lib/jobs";
import { Breadcrumbs } from "@/components/breadcrumbs";
import type { Metadata } from "next";

const mdxComponents = { img: MdxImg, a: MdxLink };

interface JobPageProps {
  params: Promise<{ company: string; slug: string }>;
}

async function getJob(company: string, slug: string) {
  try {
    const filePath = path.join(
      process.cwd(),
      "content",
      "jobs",
      company,
      `${slug}.mdx`
    );
    const fileContent = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(fileContent);
    return { meta: normalizeJob(company, slug, data), content: content.trim() };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const { company, slug } = await params;
  const job = await getJob(company, slug);

  if (!job) {
    return { title: "Вакансію не знайдено - SEO BAZA" };
  }

  const { meta } = job;
  const url = `https://seobaza.com.ua/jobs/${company}/${slug}`;
  const ogImage = "https://seobaza.com.ua/og-image.png";
  const title = `${meta.title}: вакансія в ${meta.company} - SEO BAZA`;

  return {
    title,
    description: meta.description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: meta.description,
      url,
      siteName: "SEO BAZA",
      locale: "uk_UA",
      type: "article",
      publishedTime: meta.datePosted,
      images: [{ url: ogImage, width: 640, height: 640, alt: "SEO BAZA logo" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: meta.description,
      images: [ogImage],
    },
  };
}

export async function generateStaticParams() {
  const jobsPath = path.join(process.cwd(), "content", "jobs");
  const params: Array<{ company: string; slug: string }> = [];
  try {
    for (const company of await fs.readdir(jobsPath)) {
      const companyPath = path.join(jobsPath, company);
      const stat = await fs.stat(companyPath);
      if (!stat.isDirectory()) continue;
      const files = await fs.readdir(companyPath);
      for (const f of files.filter((x) => x.endsWith(".mdx"))) {
        params.push({ company, slug: f.replace(".mdx", "") });
      }
    }
    return params;
  } catch {
    return [];
  }
}

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

export default async function JobPage({ params }: JobPageProps) {
  const { company, slug } = await params;
  const job = await getJob(company, slug);

  if (!job) {
    notFound();
  }

  const { meta, content } = job;
  const closed = isClosedJob(meta);

  // Google's rules for expired postings: the page may stay, but the JobPosting
  // structured data must go. So closed jobs render WITHOUT the markup.
  const jsonLd = closed ? null : jobToJsonLd(meta, content);

  const facts: Array<[string, React.ReactNode]> = [
    [
      "Компанія",
      meta.companyUrl ? (
        <a
          key="c"
          href={meta.companyUrl}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="text-primary hover:text-accent underline transition-colors"
        >
          {meta.company}
        </a>
      ) : (
        meta.company
      ),
    ],
    [
      "Формат",
      meta.remote
        ? "Повністю віддалено"
        : [meta.city, meta.country === "UA" ? "Україна" : meta.country]
            .filter(Boolean)
            .join(", "),
    ],
    ...(meta.city
      ? ([
          [
            "Локація",
            [meta.city, meta.country === "UA" ? "Україна" : meta.country]
              .filter(Boolean)
              .join(", "),
          ],
        ] as Array<[string, React.ReactNode]>)
      : []),
    ["Зайнятість", EMPLOYMENT_TYPE_LABELS[meta.employmentType]],
    ["Опубліковано", formatUkrDate(meta.datePosted)],
    ...(meta.validThrough && !closed
      ? ([["Актуально до", formatUkrDate(meta.validThrough)]] as Array<
          [string, React.ReactNode]
        >)
      : []),
  ];

  return (
    <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <Breadcrumbs
        items={[
          { name: "Головна", href: "/" },
          { name: "Вакансії", href: "/jobs" },
          { name: meta.company, href: `/jobs/${company}` },
          { name: meta.title, href: `/jobs/${company}/${slug}` },
        ]}
      />

      {closed && (
        <div className="mb-8 rounded-xl border border-border bg-muted/40 p-4 text-muted-foreground">
          Вакансію закрито. Актуальні позиції дивіться на сторінці{" "}
          <a href="/jobs" className="text-primary hover:text-accent underline transition-colors">
            SEO вакансій
          </a>
          .
        </div>
      )}

      <h1 className="text-3xl sm:text-4xl font-display mb-3">{meta.title}</h1>
      <p className="text-lg text-accent font-medium mb-8">{meta.company}</p>

      {/* Key facts — mirror what the structured data says (Google requires
          markup and visible content to match). */}
      <dl className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 rounded-xl border border-border bg-muted/20 p-6 text-sm">
        {facts.map(([label, value]) => (
          <div key={label} className="flex gap-2">
            <dt className="font-medium text-muted-foreground shrink-0">{label}:</dt>
            <dd className="text-foreground">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <MDXRemote source={content} components={mdxComponents} />
      </div>

      {!closed && meta.applyUrl && (
        <div className="mt-10">
          <a
            href={meta.applyUrl}
            {...(meta.applyUrl.startsWith("mailto:")
              ? {}
              : { target: "_blank", rel: "nofollow noopener noreferrer" })}
            className="inline-block rounded-xl bg-accent px-8 py-3 text-lg font-medium text-accent-foreground transition-all hover:shadow-lg hover:shadow-accent/25"
          >
            Відгукнутися на вакансію
          </a>
          {meta.applyUrl.startsWith("mailto:") && (
            <p className="mt-3 text-sm text-muted-foreground">
              Резюме надсилайте на{" "}
              {meta.applyUrl.replace("mailto:", "").split("?")[0]}
            </p>
          )}
        </div>
      )}
    </article>
  );
}
