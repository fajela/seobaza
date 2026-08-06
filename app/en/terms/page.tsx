import { pageMeta } from "@/lib/page-metadata";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { UkrainianPrimaryNotice } from "@/components/language-notice";

export const metadata = pageMeta({
  title: "Terms of Use: Content License and Rules | SEO BAZA",
  description:
    "Rules for using seobaza.com.ua: an open content license, newsletter terms, external links and liability. Read the terms before reusing content.",
  path: "/en/terms",
  locale: "en",
  altPath: "/terms",
});

const UPDATED = "June 29, 2026";

export default function EnglishTermsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12" lang="en">
      <article className="max-w-3xl mx-auto">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/en" },
            { name: "Terms of use", href: "/en/terms" },
          ]}
        />
        <UkrainianPrimaryNotice ukPath="/terms" />
        <h1 className="text-4xl sm:text-5xl font-display mb-3 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Terms of use
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Last updated: {UPDATED}
        </p>

        <div className="space-y-8 text-foreground/90 leading-relaxed">
          <section>
            <p>
              These terms govern the use of seobaza.com.ua. By opening the
              site and using its materials you agree to the terms below. If
              you do not agree with them, do not use the site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display mb-3">About the site</h2>
            <p>
              SEO BAZA is a Ukrainian community of SEO professionals and a
              media outlet about search engine optimization: industry news,
              analysis, educational materials and events. The owner and
              publisher of the site is Olesia Korobka. The content is
              informational.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display mb-3">Using the content</h2>
            <p>
              SEO BAZA is an open-source project. You can do whatever you like
              with the materials provided here: read, copy, translate, rework
              and distribute them, including for commercial purposes, and even
              publish them under your own name. No separate permission or
              source attribution is required.
            </p>
            <p className="mt-3">
              Keep in mind: if a material does not belong to SEO BAZA (quotes,
              images or texts of third parties), permission from the original
              source may be required.
            </p>
            <p className="mt-3">
              The only thing you cannot do is impersonate SEO BAZA: use the
              name, brand or logo in a way that creates the impression that
              your material, site or project is official SEO BAZA output or
              released on our behalf.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display mb-3">Newsletter</h2>
            <p>
              Subscribing to the newsletter is voluntary and confirmed by
              email. You can unsubscribe at any time via the link at the end
              of every email. Data processing details are described in the{" "}
              <a href="/en/privacy" className="text-primary underline hover:text-accent">
                Privacy policy
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display mb-3">
              Links to other resources
            </h2>
            <p>
              The site links to external sources and services. We do not
              control their content and are not responsible for it. You follow
              such links at your own discretion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display mb-3">Liability</h2>
            <p>
              Materials are provided &quot;as is&quot;. We aim to give
              accurate and current information, but SEO and search engine
              algorithms change quickly, so we do not guarantee results from
              applying the advice. Decisions based on the site&apos;s
              materials are yours to make.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display mb-3">Changes to the terms</h2>
            <p>
              We may update these terms. The current version with its date is
              always on this page. Send questions to{" "}
              <a
                href="mailto:info@seobaza.com.ua"
                className="text-primary underline hover:text-accent"
              >
                info@seobaza.com.ua
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
