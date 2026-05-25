import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Про SEO BAZA — українська SEO-спільнота",
  description:
    "SEO BAZA — українська спільнота SEO-фахівців. Новини індустрії, аналіз оновлень Google, події, навчальні матеріали.",
  alternates: { canonical: "https://seobaza.com.ua/about" },
  openGraph: {
    title: "Про SEO BAZA",
    description: "Українська спільнота SEO-фахівців.",
    url: "https://seobaza.com.ua/about",
    siteName: "SEO BAZA",
    locale: "uk_UA",
    type: "website",
  },
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": "https://seobaza.com.ua/about",
  url: "https://seobaza.com.ua/about",
  name: "Про SEO BAZA",
  description:
    "SEO BAZA — українська спільнота SEO-фахівців. Новини індустрії, аналіз оновлень Google, події, навчальні матеріали.",
  inLanguage: "uk-UA",
  isPartOf: {
    "@type": "WebSite",
    "@id": "https://seobaza.com.ua/",
    name: "SEO BAZA",
    url: "https://seobaza.com.ua/",
  },
  mainEntity: {
    "@type": "Organization",
    "@id": "https://seobaza.com.ua/",
    name: "SEO BAZA",
    url: "https://seobaza.com.ua/",
    logo: {
      "@type": "ImageObject",
      url: "https://seobaza.com.ua/seobaza.png",
      width: 640,
      height: 640,
    },
    description:
      "Українська спільнота SEO-фахівців. Новини індустрії, аналіз оновлень Google, події, навчальні матеріали, щоденний Telegram-канал та активний чат.",
    foundingDate: "2022-11",
    knowsAbout: [
      "SEO",
      "Search Engine Optimization",
      "AI Search",
      "Google Updates",
      "Knowledge Graph",
      "Technical SEO",
      "Link Building",
    ],
    areaServed: { "@type": "Country", name: "Ukraine" },
    inLanguage: "uk-UA",
    sameAs: [
      "https://www.youtube.com/c/SEOBAZA",
      "https://t.me/SEOBAZA",
    ],
    founder: {
      "@type": "Person",
      "@id": "https://seobaza.com.ua/authors/olesia-korobka",
      name: "Олеся Коробка",
      alternateName: "Olesia Korobka",
      url: "https://olesiakorobka.com/",
      jobTitle: "Засновниця SEO BAZA",
      sameAs: [
        "https://t.me/Fajela",
        "https://www.linkedin.com/in/okorobka/",
        "https://fajela.com/about-olesia-korobka/",
      ],
    },
    subjectOf: [
      { "@type": "WebPage", "@id": "https://seobaza.com.ua/news",       name: "Новини" },
      { "@type": "WebPage", "@id": "https://seobaza.com.ua/articles",   name: "Статті" },
      { "@type": "WebPage", "@id": "https://seobaza.com.ua/events",     name: "Події" },
      { "@type": "WebPage", "@id": "https://seobaza.com.ua/category",   name: "Категорії" },
      { "@type": "WebPage", "@id": "https://seobaza.com.ua/tags",       name: "Теги" },
      { "@type": "WebPage", "@id": "https://seobaza.com.ua/authors",    name: "Автори" },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "general",
      url: "https://t.me/fajela",
      availableLanguage: ["uk", "en"],
    },
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Головна",
        item: "https://seobaza.com.ua/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Про SEO BAZA",
        item: "https://seobaza.com.ua/about",
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-display mb-6 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Про SEO BAZA
        </h1>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>
            SEO BAZA — українська спільнота SEO-фахівців. Тут діляться новинами
            індустрії, розбирають оновлення Google, обговорюють AI-пошук та
            формати контенту, проводять зустрічі та конференції.
          </p>

          <h2>Що ви знайдете на сайті</h2>
          <ul>
            <li>
              <Link href="/news">Новини</Link> — щоденні короткі та довгі дописи
              про події індустрії: оновлення Google, AI-пошук, дослідження,
              реакції спільноти.
            </li>
            <li>
              <Link href="/articles">Статті</Link> — вічнозелені матеріали:
              розбори патентів, методології, гайди.
            </li>
            <li>
              <Link href="/events">Події</Link> — мітапи, конференції, акції на
              кшталт «Чорна п'ятниця в українському SEO».
            </li>
            <li>
              <Link href="/category">Категорії</Link> та{" "}
              <Link href="/tags">теги</Link> — швидка навігація за темами.
            </li>
          </ul>

          <h2>Хто стоїть за SEO BAZA</h2>
          <p>
            Спільноту заснувала{" "}
            <Link href="/authors/olesia-korobka">Олеся Коробка</Link> —
            SEO-консультантка з понад 10-річним досвідом у технічному SEO,
            оптимізації під граф знань і AI-пошук, засновниця SEO-консалтингу{" "}
            <a
              href="https://fajela.com/"
              target="_blank"

            >
              Fajela
            </a>
            .
          </p>

          <h2>Де нас знайти</h2>
          <ul>
            <li>
              <strong>Telegram-канал:</strong>{" "}
              <a
                href="https://t.me/SEOBAZA"
                target="_blank"

              >
                @SEOBAZA
              </a>{" "}
              — щоденні дописи, новини, реакції на події.
            </li>
            <li>
              <strong>Чат спільноти:</strong>{" "}
              <a
                href="https://t.me/seobazachat"
                target="_blank"

              >
                @seobazachat
              </a>{" "}
              — обговорення, питання, нетворкінг.
            </li>
            <li>
              <strong>YouTube:</strong>{" "}
              <a
                href="https://www.youtube.com/c/SEOBAZA"
                target="_blank"

              >
                @SEOBAZA
              </a>{" "}
              — відео-формат для більших тем.
            </li>
          </ul>

          <h2>Зв'язатися</h2>
          <p>
            Питання, пропозиції, бажання долучитися — пишіть у{" "}
            <Link href="/contact">контакти</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
