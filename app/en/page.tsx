import Link from "next/link";
import { pageMeta } from "@/lib/page-metadata";
import { UkrainianPrimaryNotice } from "@/components/language-notice";

export const metadata = pageMeta({
  title: "Ukrainian SEO Community: News, Guides, Events | SEO BAZA",
  description:
    "SEO news, analysis and guides from the Ukrainian SEO community: Google updates, AI search, meetups and a daily Telegram channel. Join SEO BAZA!",
  path: "/en",
  locale: "en",
  altPath: "/",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://seobaza.com.ua/en",
  url: "https://seobaza.com.ua/en",
  name: "SEO BAZA: Ukrainian SEO Community",
  description:
    "SEO news, analysis and guides from the Ukrainian SEO community: Google updates, AI search, meetups and a daily Telegram channel.",
  inLanguage: "en",
  isPartOf: {
    "@type": "WebSite",
    "@id": "https://seobaza.com.ua/",
    name: "SEO BAZA",
    url: "https://seobaza.com.ua/",
    inLanguage: "uk-UA",
  },
  about: {
    "@type": "Organization",
    "@id": "https://seobaza.com.ua/",
    name: "SEO BAZA",
    url: "https://seobaza.com.ua/",
  },
};

export default function EnglishHomePage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12" lang="en">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto">
        <UkrainianPrimaryNotice ukPath="/" />

        {/* Hero — mirrors the (visually hidden) hero of the Ukrainian homepage */}
        <section className="mb-14 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display mb-3 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            SEO BAZA
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Ukrainian SEO community · 600+ materials · news, guides and
            monthly digests
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              href="/articles"
              className="px-5 py-2.5 rounded-lg bg-accent text-background font-medium hover:bg-accent/90 transition-colors"
            >
              Read the articles
            </Link>
            <Link
              href="/news"
              className="px-5 py-2.5 rounded-lg border border-border font-medium hover:border-accent/50 hover:text-accent transition-colors"
            >
              Latest news
            </Link>
          </div>
        </section>

        {/* What is SEO Baza — mirrors the About section of the homepage */}
        <section className="mb-14">
          <div className="bg-secondary/30 rounded-2xl p-8 border border-border transition-theme">
            <div className="grid md:grid-cols-[1fr,auto] gap-8 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl font-display mb-4">
                  What is SEO Baza
                </h2>
                <p className="text-lg leading-relaxed">
                  First of all, it is wonderful people, great SEO specialists,
                  a Ukrainian community. Formally, it is an SEO resource with
                  news, educational materials, a{" "}
                  <a
                    href="https://www.youtube.com/@SEOBAZA"
                    target="_blank"
                    className="text-primary hover:text-accent underline transition-colors"
                  >
                    video channel
                  </a>{" "}
                  and a{" "}
                  <a
                    href="https://t.me/SEOBAZA"
                    target="_blank"
                    className="text-primary hover:text-accent underline transition-colors"
                  >
                    Telegram channel
                  </a>
                  .<br />
                  <br />
                  And the best community in the world! 💛
                </p>
              </div>
              <div className="flex justify-center md:justify-end">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/seobaza.png"
                  alt="SEO BAZA logo, green base station of the Ukrainian SEO community"
                  width={192}
                  height={192}
                  className="w-48 h-48 rounded-2xl object-cover shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Site sections — the news/articles feeds are Ukrainian-only, so the
            English homepage links to them instead of reproducing the feeds */}
        <section className="mb-14">
          <h2 className="text-2xl sm:text-3xl font-display mb-6">
            On this site
          </h2>
          <ul className="space-y-3 text-lg">
            <li>
              <Link href="/news" className="text-primary underline hover:text-accent">
                News
              </Link>
              : daily posts on Google updates, AI search, research and
              community reactions (in Ukrainian).
            </li>
            <li>
              <Link href="/articles" className="text-primary underline hover:text-accent">
                Articles
              </Link>
              : evergreen deep dives into patents, methodologies and case
              studies.
            </li>
            <li>
              <Link href="/knowledge-base" className="text-primary underline hover:text-accent">
                Knowledge base
              </Link>
              : practical guides on technical SEO and search fundamentals.
            </li>
            <li>
              <Link href="/events" className="text-primary underline hover:text-accent">
                Events
              </Link>
              : meetups, conferences and community deals such as Black Friday
              in Ukrainian SEO.
            </li>
            <li>
              <Link href="/jobs" className="text-primary underline hover:text-accent">
                Jobs
              </Link>
              : SEO vacancies from companies hiring in the Ukrainian market.
            </li>
          </ul>
        </section>

        {/* Community band — mirrors the homepage community section */}
        <section className="mb-14">
          <h2 className="text-2xl sm:text-3xl font-display mb-6 text-center">
            SEO BAZA community
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl p-6 border border-border bg-secondary/30 transition-theme">
              <h3 className="text-xl font-display mb-1">
                Most active on Telegram
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Daily news, discussions and community announcements
              </p>
              <a
                href="https://t.me/SEOBAZA"
                target="_blank"
                className="text-sm text-primary hover:text-accent underline transition-colors"
              >
                Subscribe on Telegram →
              </a>
            </div>
            <div className="rounded-2xl p-6 border border-border bg-secondary/30 transition-theme">
              <h3 className="text-xl font-display mb-1">SEO BAZA on YouTube</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Talks, breakdowns and interviews from the community
              </p>
              <a
                href="https://www.youtube.com/@SEOBAZA"
                target="_blank"
                className="text-sm text-primary hover:text-accent underline transition-colors"
              >
                Watch all videos on the channel →
              </a>
            </div>
          </div>
        </section>

        {/* English pages + pointer back to the primary Ukrainian site */}
        <section className="mb-4">
          <h2 className="text-2xl sm:text-3xl font-display mb-4">
            English pages
          </h2>
          <ul className="space-y-2">
            <li>
              <Link href="/en/about" className="text-primary underline hover:text-accent">
                About SEO BAZA
              </Link>
            </li>
            <li>
              <Link href="/en/transparency" className="text-primary underline hover:text-accent">
                Publication transparency
              </Link>
            </li>
            <li>
              <Link href="/en/privacy" className="text-primary underline hover:text-accent">
                Privacy policy
              </Link>
            </li>
            <li>
              <Link href="/en/terms" className="text-primary underline hover:text-accent">
                Terms of use
              </Link>
            </li>
          </ul>
          <p className="mt-4 text-muted-foreground">
            Everything else, including all articles and news, is published in
            Ukrainian only. Start from the{" "}
            <Link href="/" hrefLang="uk" className="text-primary underline hover:text-accent">
              Ukrainian homepage
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
