/**
 * The ONE description of SEO BAZA as a schema.org Organization, shared by every
 * page that emits it (/, /about, /en, /en/about). Before this file each page
 * carried its own copy and they had drifted: the homepage used `creator` while
 * /about used `founder`, knowsAbout had 7 items, and WebSite and Organization
 * shared the same @id (https://seobaza.com.ua/), which makes them one node.
 *
 * Node ids:
 *   ORG_ID      https://seobaza.com.ua/#organization  (the community / brand)
 *   WEBSITE_ID  https://seobaza.com.ua/#website        (the site)
 *
 * Every fact here is verified, not assumed:
 *   alternateName  = spellings actually used in the Telegram channel export
 *                    (SEO BAZA 1401x, SEO Baza 50x, seobaza 57x, Cyrillic 0x)
 *   foundingDate   = first channel post 24.11.2022
 *   logo           = /seobaza.png is 640x640
 *   sameAs         = every URL returns 200 (checked 2026-09-03)
 *   founder @id    = the Person itemID on /authors/olesia-korobka
 */

export const SITE_URL = "https://seobaza.com.ua";
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Olesia's canonical on-site Person node (same itemID the author page uses). */
export const FOUNDER_ID = `${SITE_URL}/kg/person/sb0011#person`;

export const ORG_SAME_AS = [
  "https://www.youtube.com/@SEOBAZA",
  "https://www.youtube.com/c/SEOBAZA",
  "https://t.me/SEOBAZA",
  "https://www.linkedin.com/company/seo-baza/",
  "https://www.facebook.com/groups/seobaza/",
  "https://www.instagram.com/seobaza/",
  "https://www.threads.com/@seobaza",
];

const DESCRIPTION = {
  uk: "Українська спільнота SEO-фахівців. Новини індустрії, аналіз оновлень Google, події, навчальні матеріали, щоденний Telegram-канал та активний чат.",
  en: "Ukrainian community of SEO professionals. Industry news, Google update analysis, events, educational materials, a daily Telegram channel and an active chat.",
} as const;

const FOUNDER_TITLE = {
  uk: "Засновниця SEO BAZA",
  en: "Founder of SEO BAZA",
} as const;

export type OrgLang = keyof typeof DESCRIPTION;

/** Full Organization node. `lang` only switches the human-readable strings. */
export function seoBazaOrganization(lang: OrgLang = "uk") {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: "SEO BAZA",
    alternateName: ["SEO Baza", "seobaza"],
    url: `${SITE_URL}/`,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/seobaza.png`,
      width: 640,
      height: 640,
    },
    description: DESCRIPTION[lang],
    foundingDate: "2022-11",
    founder: {
      "@type": "Person",
      "@id": FOUNDER_ID,
      name: lang === "uk" ? "Олеся Коробка" : "Olesia Korobka",
      alternateName: lang === "uk" ? "Olesia Korobka" : "Олеся Коробка",
      jobTitle: FOUNDER_TITLE[lang],
      url: "https://olesiakorobka.com/",
      sameAs: [
        "https://g.co/kg/g/11f2bzkqxz",
        "https://fajela.com/entity/people/olesia-korobka/",
        "https://www.linkedin.com/in/okorobka/",
        "https://t.me/Fajela",
      ],
    },
    // Olesia's rule (2026-08-27): 3-5 items, never more.
    knowsAbout: [
      "SEO",
      "AI search",
      "Google updates",
      "Knowledge Graph",
      "Technical SEO",
    ],
    areaServed: { "@type": "Country", name: "Ukraine" },
    inLanguage: "uk-UA",
    sameAs: ORG_SAME_AS,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "general",
      email: "info@seobaza.com.ua",
      url: "https://t.me/fajela",
      availableLanguage: ["uk", "en"],
    },
  };
}

/** Full WebSite node; `publisher` points at the Organization by @id. */
export function seoBazaWebSite() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: "SEO BAZA",
    alternateName: ["SEO Baza", "seobaza"],
    url: `${SITE_URL}/`,
    description:
      "Ресурс з SEO з новинами, учбовими матеріалами, відео-каналом і телеграм-каналом",
    inLanguage: "uk-UA",
    publisher: { "@id": ORG_ID },
  };
}

/** Short references for pages that only need to point at the nodes. */
export const ORG_REF = { "@type": "Organization", "@id": ORG_ID, name: "SEO BAZA", url: `${SITE_URL}/` };
export const WEBSITE_REF = { "@type": "WebSite", "@id": WEBSITE_ID, name: "SEO BAZA", url: `${SITE_URL}/` };
