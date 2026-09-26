import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";

const TITLE = "Чорна п'ятниця 2026 в українському SEO: знижки | SEO Baza";
const DESCRIPTION =
  "Знижки й бонуси від українських SEO-компаній на Чорну п'ятницю 2026: сервіси, інструменти, лінкбілдинг. Додайте свою пропозицію через форму.";
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

        {/* Збір пропозицій на сезон 2026. Google Форма, заявки перевіряємо вручну. */}
        <section className="mb-12 rounded-2xl p-6 border-2 border-accent/50 bg-accent/10">
          <h2 className="text-xl sm:text-2xl font-display mb-3">
            Збираємо пропозиції на 2026 рік
          </h2>
          <p className="mb-4">
            Готуємо сторінку зі знижками й бонусами для SEO-спільноти. Якщо ви українська
            компанія і не працюєте з рф, додайте свою пропозицію. Розміщення безкоштовне.
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
