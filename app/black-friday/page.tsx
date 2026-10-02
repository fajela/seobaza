import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";

const TITLE = "Чорна п'ятниця 2026 в українському SEO: знижки | SEO Baza";
const DESCRIPTION =
  "Знижки й бонуси від українських SEO-компаній на Чорну п'ятницю 2026: VYDAI, INeedTexts, Referr, UAHOSTING. Сторінка поповнюється, додайте свою пропозицію через форму.";
const OG_IMAGE = "https://seobaza.com.ua/images/og/black-friday-2026.jpg";
const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSey7ryJzTCv1N61XJNV8Lklf9J6_2BQBDZB2UUiqHTN-9rKwA/viewform";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    // Evergreen "general" page — self-canonical. The current year's archive
    // page (/events/<year>/black-friday-<year>) canonicals HERE while it is the
    // active season; when a new year is added it stops doing so automatically.
    canonical: "https://seobaza.com.ua/black-friday",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://seobaza.com.ua/black-friday",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Black Friday 2026 від SEO Baza: знижки від українських SEO-компаній",
      },
    ],
    locale: "uk_UA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

// Current-season offers. Source of truth is the Google Form responses sheet
// (kept outside the repo, it holds private contacts); mirrored with SaleEvent
// markup in content/events/2026/black-friday-2026.mdx.
const OFFERS_2026 = [
  {
    id: "vydai",
    name: "VYDAI",
    title: "Знижка 20% на ліміти VYDAI",
    text: "Сервіс моніторингу видимості бренду у відповідях ШІ від Inweb. 8 грн замість 10 грн за ліміт.",
    dates: "24–30 листопада 2026",
    promo: null,
    url: "https://vydai.inweb.ua/",
    cta: "Перейти до VYDAI",
  },
  {
    id: "ineedtexts",
    name: "INeedTexts",
    title: "25% знижки на перше замовлення в INeedTexts",
    text: "Агенція копірайтингу: SEO-тексти, статті, гостьові публікації, переклади й локалізація понад 30 мовами.",
    dates: "16–30 листопада 2026",
    promo: "BlackFriday",
    url: "https://ineedtexts.com/ua/",
    cta: "Замовити тексти",
  },
  {
    id: "referr",
    name: "Referr",
    title: "$100 на баланс і 10% на Link Insertion від Referr",
    text: "Бонус $100 при поповненні від $400 на крауд-маркетинг і сабміти, плюс 10% на перше замовлення Link Insertion.",
    dates: "23–30 листопада 2026",
    promo: "BlackFRREF-26",
    url: "https://referr.com.ua/",
    cta: "Поповнити баланс",
  },
  {
    id: "uahosting",
    name: "UAHOSTING",
    title: "До -90% на перші місяці хостингу від UAHOSTING",
    text: "Для нових клієнтів: 1–3 місяці хостингу зі знижкою 90% на тарифи S і M або 60% на тарифи L. Тариф M-1 на 3 місяці за 30 грн замість 300 грн.",
    dates: "лише 27 листопада 2026",
    promo: "SEOBAZA26",
    url: "https://uahosting.com.ua/hosting.php",
    cta: "Обрати тариф",
  },
];

// Past seasons live on their own archive pages; the offers of each year are
// listed there with SaleEvent markup.
const ARCHIVE = [
  { year: "2025", href: "/events/2025/black-friday-2025" },
  { year: "2024", href: "/events/2024/black-friday-2024" },
  { year: "2023", href: "/events/2023/black-friday-2023" },
];

export default function BlackFridayPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs items={[{ name: "Головна", href: "/" }, { name: "Black Friday", href: "/black-friday" }]} />
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display mb-8 text-center bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          💥 Чорна п'ятниця 2026: пропозиції українських SEO компаній
        </h1>

        <section className="mb-12 space-y-6">
          {OFFERS_2026.map((o) => (
            <article key={o.id} id={`${o.id}-black-friday`} className="rounded-2xl p-6 border border-border bg-muted/30">
              <h2 className="text-xl sm:text-2xl font-display mb-2">{o.title}</h2>
              <p className="mb-3">{o.text}</p>
              <p className="mb-3 text-sm">
                <strong>Діє:</strong> {o.dates}
                {o.promo && (
                  <>
                    {" · "}
                    <strong>Промокод:</strong> <code className="px-1.5 py-0.5 rounded bg-background">{o.promo}</code>
                  </>
                )}
              </p>
              <a
                href={o.url}
                target="_blank"
                rel="nofollow noopener"
                className="text-primary hover:text-accent underline transition-colors"
              >
                {o.cta} 👈
              </a>
            </article>
          ))}
        </section>

        {/* Збір пропозицій на сезон 2026. Google Форма, заявки перевіряємо вручну. */}
        <section className="mb-12 rounded-2xl p-6 border-2 border-accent/50 bg-accent/10">
          <h2 className="text-xl sm:text-2xl font-display mb-3">
            Додайте свою пропозицію
          </h2>
          <p className="mb-4">
            Сторінка поповнюється до кінця листопада. Якщо ви українська компанія і не
            працюєте з рф, додайте свою пропозицію. Розміщення безкоштовне.
          </p>
          <a
            href={FORM_URL}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center px-5 py-2.5 rounded-full bg-accent text-accent-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            Додати пропозицію
          </a>
        </section>

        <section className="p-6 bg-muted/30 rounded-xl border border-border">
          <h2 className="text-xl font-display mb-3">Пропозиції минулих років</h2>
          <ul className="space-y-2">
            {ARCHIVE.map((a) => (
              <li key={a.year}>
                <Link href={a.href} className="text-primary hover:text-accent underline transition-colors">
                  Чорна п'ятниця {a.year} в українському SEO
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
