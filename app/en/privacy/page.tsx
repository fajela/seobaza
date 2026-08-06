import { pageMeta } from "@/lib/page-metadata";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { UkrainianPrimaryNotice } from "@/components/language-notice";

export const metadata = pageMeta({
  title: "Privacy Policy: How SEO BAZA Handles Your Data",
  description:
    "What personal data seobaza.com.ua collects and why: newsletter, analytics, cookies, third-party services and your rights. Read the full policy.",
  path: "/en/privacy",
  locale: "en",
  altPath: "/privacy",
});

const UPDATED = "June 29, 2026";

export default function EnglishPrivacyPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12" lang="en">
      <article className="max-w-3xl mx-auto">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/en" },
            { name: "Privacy policy", href: "/en/privacy" },
          ]}
        />
        <UkrainianPrimaryNotice ukPath="/privacy" />
        <h1 className="text-4xl sm:text-5xl font-display mb-3 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Privacy policy
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Last updated: {UPDATED}
        </p>

        <div className="space-y-8 text-foreground/90 leading-relaxed">
          <section>
            <p>
              SEO BAZA (referred to as &quot;we&quot;, &quot;the site&quot;,
              &quot;the community&quot;) respects your privacy. This policy
              explains what personal data we collect on seobaza.com.ua, what
              we use it for and what rights you have. The data controller is
              the site owner, Olesia Korobka. You can reach us at{" "}
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
            <h2 className="text-2xl font-display mb-3">Data we collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Newsletter email.</strong> If you subscribe to our
                newsletter, we receive your email address. Subscription uses
                double opt-in: the address is added to the list only after you
                click the link in the confirmation email.
              </li>
              <li>
                <strong>Anonymized analytics.</strong> We see aggregated visit
                statistics (which pages are viewed, from which countries and
                sources) without any link to a specific person.
              </li>
              <li>
                <strong>Technical data.</strong> Standard data a browser sends
                to any site: IP address, browser type, request time. It is
                needed for the site to work and stay secure.
              </li>
              <li>
                <strong>Preferences.</strong> Your light or dark theme choice
                is stored in your browser and is not sent to us.
              </li>
            </ul>
            <p className="mt-3">
              We do not collect payment data and do not ask for sensitive
              information. Comments under materials run through Telegram and
              are governed by Telegram&apos;s privacy policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display mb-3">Services we use</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Kit (ConvertKit)</strong>, the newsletter service. It
                stores your email address and manages your subscription.{" "}
                <a
                  href="https://kit.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:text-accent"
                >
                  Kit&apos;s policy
                </a>
                .
              </li>
              <li>
                <strong>Vercel</strong>, the site host, with anonymized Vercel
                Analytics that uses no advertising cookies and does not
                identify individual visitors.{" "}
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:text-accent"
                >
                  Vercel&apos;s policy
                </a>
                .
              </li>
              <li>
                <strong>Google Reader Revenue Manager</strong>, a Google tool
                for newsletter signups and reader support. When it shows a
                form on the site, Google may set its own cookies under the{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:text-accent"
                >
                  Google Privacy Policy
                </a>
                .
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-display mb-3">Cookies</h2>
            <p>
              We use our own cookies only for the site to function (for
              example, to remember your theme choice). Third-party cookies may
              be set by the services above when you interact with their forms.
              You can disable or delete cookies in your browser settings, but
              some features may then work differently.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display mb-3">What we use data for</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>sending the newsletter you subscribed to;</li>
              <li>keeping the site working, secure and stable;</li>
              <li>
                understanding in aggregate numbers which materials readers
                find useful.
              </li>
            </ul>
            <p className="mt-3">
              We do not sell your data and do not share it with third parties
              for advertising.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display mb-3">Your rights</h2>
            <p>
              You can unsubscribe from the newsletter at any time (every email
              contains a link), ask what data of yours we store, correct it or
              request deletion. To do so, write to{" "}
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
            <h2 className="text-2xl font-display mb-3">Changes</h2>
            <p>
              We may update this policy. The current date is at the top of the
              page. Send privacy questions to{" "}
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
