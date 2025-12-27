export const metadata = {
  title: "💥 Чорна п'ятниця в українському SEO 2025 | SEO Baza",
  description:
    "Найкращі знижки та пропозиції від українських SEO компаній на Чорну п'ятницю 2025: Serpstat, Luxeo, HyperHost, Shared.Domains, Insert.link та інші. Знижки до -90% на SEO інструменти та сервіси.",
  alternates: {
    canonical: "https://seobaza.com.ua/events/2025/black-friday-2025",
  },
  openGraph: {
    title: "Чорна п'ятниця в українському SEO 2025 | SEO Baza",
    description:
      "Найкращі знижки та пропозиції від українських SEO компаній на Чорну п'ятницю 2025",
    url: "https://seobaza.com.ua/events/2025/black-friday-2025",
    images: [
      {
        url: "https://seobaza.com.ua/black-friday/black-friday-2025.png",
        width: 1200,
        height: 630,
        alt: "Black Friday 2025 SEO Baza",
      },
    ],
    locale: "uk_UA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Чорна п'ятниця в українському SEO 2025 | SEO Baza",
    description:
      "Найкращі знижки від українських SEO компаній. Знижки до -90%!",
    images: ["https://seobaza.com.ua/black-friday/black-friday-2025.png"],
  },
};

interface Offer {
  id: string;
  title: string;
  company: string;
  discount: string;
  description: string;
  endDate: string;
  url: string;
}

const offers: Offer[] = [
  {
    id: "insert-link",
    company: "Insert Link",
    title: "Бонус на баланс від Insert Link",
    discount: "Бонус $100",
    description: "при поповненні рахунку від $1000",
    endDate: "2025-12-05",
    url: "https://insert.link/",
  },
  {
    id: "shared-domains",
    company: "Shared Domains",
    title: "Бонус на баланс від Shared Domains",
    discount: "Бонус +10%",
    description: "при поповненні рахунку від $1000",
    endDate: "2025-12-05",
    url: "https://shared.domains/",
  },
  {
    id: "serpstat",
    company: "Serpstat",
    title: "До 4-х місяців безкоштовно: Black Friday в Serpstat",
    discount: "20% знижки",
    description:
      "на обидва продукти: Serpstat та LLM Brand Monitor. Додатково -20% на річні тарифи Serpstat",
    endDate: "2025-12-07",
    url: "https://serpstat.com/uk/page/pricing-plans/",
  },
  {
    id: "luxeo",
    company: "Luxeo",
    title: "Безкоштовний аудит та аналіз видимості бренду в LLM системах",
    discount: "Грант 500€",
    description:
      "на аудит видимості бренду та стратегію просування LLM. Бонус: 25% знижка на перший місяць при продовженні роботи",
    endDate: "2025-12-12",
    url: "https://luxeo.team/",
  },
  {
    id: "hyperhost",
    company: "HyperHost",
    title: "-90% на послуги хостингу від HyperHost",
    discount: "-90%",
    description: "на перше замовлення послуги Віртуального хостингу",
    endDate: "2025-11-28",
    url: "https://hyperhost.ua/info/uk/chorna-pyatnitsya-2020-znizhki-na-khosting-i-servera",
  },
  {
    id: "drivefoxcopy",
    company: "DriveFoxCopy",
    title: "Знижка 50% від студії DriveFoxCopy",
    discount: "50% знижки",
    description:
      "на всі тексти англійською мовою для учасників SEO BAZA. Діє на перше замовлення",
    endDate: "2025-12-31",
    url: "https://drivefoxcopy.studio/",
  },
];

export default function BlackFridayPage() {
  return (
    <div
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-12"
      vocab="https://schema.org/"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display mb-8 text-center bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          💥 Чорна п'ятниця 2025: пропозиції українських SEO компаній
        </h1>

        <div className="grid gap-6 mb-12">
          {offers.map((offer) => (
            <article
              key={offer.id}
              id={offer.id}
              typeof="SaleEvent"
              className="bg-secondary/30 rounded-2xl p-6 border border-border hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h2 property="name" className="text-xl sm:text-2xl font-display mb-2">
                    {offer.title}
                  </h2>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-bold mb-3">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {offer.discount}
                  </div>
                </div>
              </div>

              <p property="description" className="text-muted-foreground mb-4">
                {offer.description}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <time
                  property="endDate"
                  dateTime={offer.endDate}
                  className="text-sm text-muted-foreground"
                >
                  <strong>Діє до:</strong>{" "}
                  {new Date(offer.endDate).toLocaleDateString("uk-UA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>

                <a
                  href={offer.url}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  property="url"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-accent text-white rounded-lg font-medium transition-colors"
                >
                  Перейти до пропозиції
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 p-6 bg-muted/30 rounded-xl border border-border text-center">
          <h2 className="text-xl font-display mb-3">
            Хочете додати свою пропозицію?
          </h2>
          <p className="text-muted-foreground mb-4">
            Напишіть{" "}
            <a
              href="https://t.me/fajela"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-accent underline transition-colors"
            >
              @fajela
            </a>{" "}
            в Telegram
          </p>
          <p className="text-sm text-muted-foreground">
            <a
              href="/events/2024/black-friday-2024"
              className="text-primary hover:text-accent underline transition-colors"
            >
              Подивитися пропозиції 2024 року →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
