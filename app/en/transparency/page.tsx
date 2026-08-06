import { pageMeta } from "@/lib/page-metadata";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { UkrainianPrimaryNotice } from "@/components/language-notice";

export const metadata = pageMeta({
  title: "Publication Transparency: Ownership and Funding | SEO BAZA",
  description:
    "Who owns SEO BAZA, how the publication earns money, how the editorial process works and where to report errors. Read the transparency policy.",
  path: "/en/transparency",
  locale: "en",
  altPath: "/transparency",
});

const UPDATED = "June 30, 2026";

export default function EnglishTransparencyPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12" lang="en">
      <article className="max-w-3xl mx-auto">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/en" },
            { name: "Publication transparency", href: "/en/transparency" },
          ]}
        />
        <UkrainianPrimaryNotice ukPath="/transparency" />
        <h1 className="text-4xl sm:text-5xl font-display mb-3 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Publication transparency
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Last updated: {UPDATED}
        </p>

        <div className="space-y-8 text-foreground/90 leading-relaxed">
          <section>
            <p>
              This page openly explains who is behind SEO BAZA, how we earn
              money and what rules the editorial team follows.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display mb-3">Who we are</h2>
            <p>
              SEO BAZA is a Ukrainian community of SEO professionals and a
              media outlet about search engine optimization. The community has
              been active since November 2022: a daily Telegram channel, an
              active chat, YouTube, news and analysis on the site, and events
              for the industry.
            </p>
            <p className="mt-3">
              The founder, owner and editor-in-chief is Olesia Korobka, an SEO
              consultant. She runs the site and the publishing activity. More
              about the project:{" "}
              <a href="/en/about" className="text-primary underline hover:text-accent">
                the About page
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display mb-3">How we earn money</h2>
            <p>SEO BAZA is funded by:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>the founder&apos;s own funds;</li>
              <li>news and video sponsorships;</li>
              <li>job listings;</li>
              <li>partnerships with companies relevant to the community.</li>
            </ul>
            <p className="mt-3">
              The site has no paywall: all materials are open. Advertising and
              sponsored placements are labeled. Formats and terms of
              cooperation are on the{" "}
              <a href="/sponsors" className="text-primary underline hover:text-accent">
                sponsors page
              </a>{" "}
              (in Ukrainian).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display mb-3">
              Editorial independence
            </h2>
            <p>
              Sponsorship does not grant any influence over assessments and
              conclusions in editorial materials. Sponsored content is always
              labeled as such. We write news and analysis independently of
              whoever currently supports the publication.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display mb-3">
              Where our facts come from
            </h2>
            <p>
              Every claim in our news and analysis rests on a specific source:
              official Google statements, documentation, industry research or
              primary sources, linked directly in the text. We credit authors
              and show publication dates.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display mb-3">Corrections</h2>
            <p>
              If you spot an error or inaccuracy, write to us and we will
              verify and correct the material. Email{" "}
              <a
                href="mailto:info@seobaza.com.ua"
                className="text-primary underline hover:text-accent"
              >
                info@seobaza.com.ua
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display mb-3">
              Contacts and documents
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Email:{" "}
                <a
                  href="mailto:info@seobaza.com.ua"
                  className="text-primary underline hover:text-accent"
                >
                  info@seobaza.com.ua
                </a>
                . Other ways to reach us:{" "}
                <a href="/contact" className="text-primary underline hover:text-accent">
                  the contact page
                </a>
                .
              </li>
              <li>
                <a href="/en/privacy" className="text-primary underline hover:text-accent">
                  Privacy policy
                </a>{" "}
                and{" "}
                <a href="/en/terms" className="text-primary underline hover:text-accent">
                  Terms of use
                </a>
                .
              </li>
            </ul>
          </section>
        </div>
      </article>
    </div>
  );
}
