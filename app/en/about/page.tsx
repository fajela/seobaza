import Link from "next/link";
import { pageMeta } from "@/lib/page-metadata";
import { UkrainianPrimaryNotice } from "@/components/language-notice";
import { seoBazaOrganization, WEBSITE_REF } from "@/lib/organization";

export const metadata = pageMeta({
  title: "About SEO BAZA: Ukrainian SEO Community and Media",
  description:
    "Ukrainian community of SEO professionals: industry news, Google update analysis, events and guides. Learn what SEO BAZA is and who runs it.",
  path: "/en/about",
  locale: "en",
  altPath: "/about",
});

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": "https://seobaza.com.ua/en/about",
  url: "https://seobaza.com.ua/en/about",
  name: "About SEO BAZA",
  description:
    "SEO BAZA is a Ukrainian community of SEO professionals: industry news, Google update analysis, events and educational materials.",
  inLanguage: "en",
  isPartOf: WEBSITE_REF,
  mainEntity: seoBazaOrganization("en"),
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://seobaza.com.ua/en",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "About SEO BAZA",
        item: "https://seobaza.com.ua/en/about",
      },
    ],
  },
};

export default function EnglishAboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12" lang="en">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <div className="max-w-3xl mx-auto">
        <UkrainianPrimaryNotice ukPath="/about" />

        <h1 className="text-4xl sm:text-5xl font-display mb-6 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          About SEO BAZA
        </h1>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>
            SEO BAZA is a Ukrainian community of SEO professionals. Members
            share industry news, break down Google updates, discuss AI search
            and content formats, and run meetups and conferences. The site and
            all editorial content are in Ukrainian.
          </p>

          <h2>What you will find on the site</h2>
          <ul>
            <li>
              <Link href="/news">News</Link>: daily short and long posts on
              industry events, Google updates, AI search, research and
              community reactions.
            </li>
            <li>
              <Link href="/articles">Articles</Link>: evergreen materials
              such as patent breakdowns, methodologies and guides.
            </li>
            <li>
              <Link href="/events">Events</Link>: meetups, conferences and
              deals such as Black Friday in Ukrainian SEO.
            </li>
            <li>
              <Link href="/category">Categories</Link> and{" "}
              <Link href="/tags">tags</Link> for quick navigation by topic.
            </li>
          </ul>

          <h2>Who is behind SEO BAZA</h2>
          <p>
            The community was founded by{" "}
            <Link href="/authors/olesia-korobka">Olesia Korobka</Link>, an SEO
            consultant with more than 10 years of experience in technical SEO,
            knowledge graph optimization and AI search, and the founder of the
            SEO consultancy{" "}
            <a href="https://fajela.com/" target="_blank">
              Fajela
            </a>
            .
          </p>

          <h2>Where to find us</h2>
          <ul>
            <li>
              <strong>Telegram channel:</strong>{" "}
              <a href="https://t.me/SEOBAZA" target="_blank">
                @SEOBAZA
              </a>{" "}
              with daily posts, news and reactions.
            </li>
            <li>
              <strong>Community chat:</strong>{" "}
              <a href="https://t.me/seobazachat" target="_blank">
                @seobazachat
              </a>{" "}
              for discussions, questions and networking.
            </li>
            <li>
              <strong>YouTube:</strong>{" "}
              <a href="https://www.youtube.com/c/SEOBAZA" target="_blank">
                @SEOBAZA
              </a>{" "}
              for bigger topics in video format.
            </li>
          </ul>

          <h2>Get in touch</h2>
          <p>
            Questions, suggestions or a wish to contribute: see the{" "}
            <Link href="/contact">contact page</Link> or write to{" "}
            <a href="mailto:info@seobaza.com.ua">info@seobaza.com.ua</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
