import { externalRel } from "@/lib/own-sites";
import Link from "next/link";
import { pageMeta } from "@/lib/page-metadata";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata = pageMeta({
  title: "Спонсорам - SEO Baza",
  description:
    "Формати співпраці та реклами в SEO Baza: спонсор відеосереди, спонсор новинного дайджесту, банери, дошка вакансій. Доступ до української SEO-спільноти.",
  path: "/sponsors",
  image: {
    path: "/images/og/reklama-v-seo-baza.jpg",
    alt: "Темна картка з логотипом SEO BAZA і написом «Реклама в SEO BAZA» та цінами від 50 доларів",
  },
});

interface Format {
  id: string;
  title: string;
  price: string;
  priceNote?: string;
  description: string;
  includes: string[];
}

// Ціни орієнтовані на український ринок (бенчмарк прямих конкурентів) і
// формат інтегрованої згадки, а не окремого рекламного поста.
const formats: Format[] = [
  {
    id: "video",
    title: "Спонсор відеосереди",
    price: "$250",
    priceNote: "за випуск · 4 випуски $900 · 10 випусків $2 000",
    description:
      "Раз на два тижні по середах Олександра Хілова й Олеся Коробка розбирають те, що зараз реально болить в SEO. Ефір живе на трьох майданчиках, і до переглядів на YouTube додається анонс у телеграмі на 1 800–2 700 людей.",
    includes: [
      "Зачитане в ефірі слово про спонсора й окремий розділ у плеєрі",
      "Блок і посилання з вашими UTM в описі під відео",
      "Згадка в анонсі ефіру й у пості із записом у телеграмі",
      "Постійна сторінка випуску на сайті",
      "За бажанням розіграш вашого призу просто в ефірі, без доплати",
    ],
  },
  {
    id: "news",
    title: "Спонсор новинного дайджесту",
    price: "$180",
    priceNote: "за випуск · 4 випуски $500",
    description:
      "Одна інтегрована згадка всередині щотижневого дайджесту, без окремого рекламного поста. Працює одразу на трьох майданчиках за одну ціну.",
    includes: [
      "Блок спонсора в новинах на сайті",
      "Та сама згадка в дайджесті в Telegram",
      "Та сама згадка в email-розсилці",
      "Один спонсор на випуск, без конкуренції за увагу",
    ],
  },
  {
    id: "partner",
    title: "Партнер місяця",
    price: "$600",
    priceNote: "за 4 тижні · 12 тижнів $1 500",
    description:
      "Банерний ексклюзив: 4 тижні ваш банер єдиний на сайті й у розсилці, інших банерних партнерів у цей час немає.",
    includes: [
      "Банер на кожній сторінці сайту: під меню, а в новинах, статтях і відео одразу після вступу",
      "Банер у кожному листі email-розсилки за цей період",
      "Згадка в новинних дайджестах цього періоду",
      "За бажанням окремий варіант банера для нічного режиму сайту",
    ],
  },
  {
    id: "jobs",
    title: "Дошка вакансій",
    price: "$50",
    priceNote: "за слот на 30 днів · +$20 за включення в дайджест",
    description:
      "Розміщення вакансії перед цільовою українською SEO-аудиторією на фіксований термін.",
    includes: [
      "Вакансія на сайті на 30 днів",
      "Опційно: згадка у щотижневому дайджесті",
      "Прямий вихід на профільних фахівців",
    ],
  },
];

const audience = [
  "Телеграм t.me/SEOBAZA: 6 147 підписників, медіана 2 960 переглядів на пост",
  "Email-розсилка: щотижневий лист, спонсор названий і в ньому",
  "YouTube @SEOBAZA: 1 930 підписників, медіана 902 перегляди на випуск",
  "Сайт seobaza.com.ua: 2 076 відвідувачів і 3 610 переглядів за 30 днів",
  "B2B-аудиторія, яка реально купує інструменти, посилання й послуги",
];

const siteColors = { darkBg: "#11100E" };

const bannerSpecs = [
  "Широкий банер 1536×512 пікселів, пропорція 3:1. На сайті показується 768×256, у листі розсилки 600×200",
  "Мобільний банер 600×500 пікселів, на екрані телефона це 300×250",
  "Статичний jpg або png, без анімації, до 500 КБ",
  "Кути банера на сайті заокруглені на 12 пікселів, тому текст і кнопку тримайте щонайменше за 24 пікселі від країв",
  "Посилання з вашими UTM-мітками. Чужих скриптів і лічильників не ставимо",
];

const brandFonts = [
  {
    name: "Proza Libre",
    use: "заголовки на сайті",
    url: "https://fonts.google.com/specimen/Proza+Libre",
  },
  {
    name: "Open Sans",
    use: "основний текст",
    url: "https://fonts.google.com/specimen/Open+Sans",
  },
];

const brandColors = [
  { hex: "#7CFF3D", use: "салатовий логотипу" },
  { hex: "#262626", use: "графіт логотипу" },
  { hex: "#004CA3", use: "синій посилань і кнопок на сайті" },
  { hex: "#A4DB57", use: "салатовий акцентів на сайті" },
  { hex: "#242424", use: "колір тексту" },
  { hex: "#FFFFFF", use: "фон денної теми" },
  { hex: "#11100E", use: "фон нічної теми" },
  { hex: "#22201C", use: "картки в нічній темі" },
];

export default function SponsorsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs items={[{ name: "Головна", href: "/" }, { name: "Спонсорам", href: "/sponsors" }]} />
        <h1 className="text-4xl sm:text-5xl font-display mb-6 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Спонсорам SEO Baza
        </h1>
        <p className="text-lg text-muted-foreground mb-10">
          Розкажіть про свій продукт українській SEO-спільноті без нав&apos;язливої
          реклами. Інтегровані формати, які люди читають, а не гортають.
        </p>

        {/* Медіакіт */}
        <a
          href="/files/SEO-BAZA-mediakit-2026.pdf"
          className="flex flex-wrap items-center justify-between gap-3 mb-10 p-5 rounded-xl border border-accent/50 bg-accent/10 hover:bg-accent/20 transition-colors"
        >
          <span>
            <span className="block font-display text-lg">Медіакіт у PDF</span>
            <span className="block text-sm text-muted-foreground">
              Усі формати, цифри й приклади реальних розміщень
            </span>
          </span>
          <span className="font-bold text-primary">Завантажити →</span>
        </a>

        {/* Аудиторія */}
        <div className="mb-12 p-6 bg-muted/30 rounded-xl border border-border">
          <h2 className="text-2xl font-display mb-4">Хто вас побачить</h2>
          <ul className="space-y-2">
            {audience.map((a) => (
              <li key={a} className="flex gap-3 text-muted-foreground">
                <span className="text-accent shrink-0">→</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Формати */}
        <h2 className="text-2xl font-display mb-6">Формати співпраці</h2>
        <div className="space-y-6 mb-12">
          {formats.map((f) => (
            <article
              key={f.id}
              className="p-6 bg-secondary/30 rounded-xl border border-border"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
                <h3 className="text-xl font-display">{f.title}</h3>
                <div className="text-right">
                  <span className="text-2xl font-bold text-accent">
                    {f.price}
                  </span>
                  {f.priceNote && (
                    <span className="block text-sm text-muted-foreground">
                      {f.priceNote}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-muted-foreground mb-4">{f.description}</p>
              <ul className="space-y-1.5">
                {f.includes.map((i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-accent shrink-0">•</span>
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <p className="text-sm text-muted-foreground mb-12">
          Для постійних партнерів і пакетів діють знижки.
        </p>

        {/* Вимоги до банерів */}
        <section id="banners" className="mb-12 p-6 bg-muted/30 rounded-xl border border-border">
          <h2 className="text-2xl font-display mb-4">Банери: розміри й вимоги</h2>
          <p className="text-muted-foreground mb-4">
            Потрібні два файли. Один широкий банер працює і на сайті, і в листі
            розсилки, тому окремий макет під email малювати не треба.
          </p>
          <ul className="space-y-2 mb-4">
            {bannerSpecs.map((b) => (
              <li key={b} className="flex gap-3 text-muted-foreground">
                <span className="text-accent shrink-0">→</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <h3 className="text-lg font-display mb-2">Нічний режим</h3>
          <p className="text-muted-foreground">
            На сайті є темна тема, її вмикає перемикач у меню або налаштування
            пристрою. Можна надіслати другий комплект тих самих розмірів під темний
            фон {siteColors.darkBg}, і читачі в нічному режимі бачитимуть його. Якщо
            другого комплекту немає, показуємо світлий. У розсилці завжди світлий
            варіант.
          </p>
        </section>

        {/* Фірмовий стиль для дизайнерів */}
        <section id="brand" className="mb-12 p-6 bg-muted/30 rounded-xl border border-border">
          <h2 className="text-2xl font-display mb-4">Фірмовий стиль SEO Baza</h2>
          <p className="text-muted-foreground mb-4">
            Для дизайнерів, які малюють банер або спільний креатив: шрифти й кольори
            сайту, щоб макет не випадав із загального вигляду.
          </p>
          <h3 className="text-lg font-display mb-2">Шрифти</h3>
          <ul className="space-y-1.5 mb-5">
            {brandFonts.map((f) => (
              <li key={f.name} className="flex gap-2 text-muted-foreground">
                <span className="text-accent shrink-0">•</span>
                <span>
                  <a
                    href={f.url}
                    target="_blank"
                    rel={externalRel(f.url)}
                    className="text-primary hover:text-accent underline transition-colors"
                  >
                    {f.name}
                  </a>
                  : {f.use}
                </span>
              </li>
            ))}
          </ul>
          <h3 className="text-lg font-display mb-3">Кольори</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            {brandColors.map((c) => (
              <div key={c.hex} className="flex items-center gap-3">
                <span
                  className="w-10 h-10 rounded-lg border border-border shrink-0"
                  style={{ backgroundColor: c.hex }}
                  aria-hidden
                />
                <span className="text-sm">
                  <span className="font-mono font-semibold">{c.hex}</span>
                  <span className="block text-muted-foreground">{c.use}</span>
                </span>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground">
            Логотип у png на прозорому тлі:{" "}
            <a
              href="/seobaza.png"
              className="text-primary hover:text-accent underline transition-colors"
            >
              завантажити логотип SEO Baza
            </a>
            .
          </p>
        </section>

        {/* CTA */}
        <div className="p-6 bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl border border-accent/40 text-center">
          <h2 className="text-2xl font-display mb-3">Обговорити співпрацю</h2>
          <p className="text-muted-foreground mb-6">
            Напишіть Bronso, і ми підберемо формат під ваші задачі
          </p>
          <a
            href="https://t.me/TheBronso" rel="nofollow noopener"
            target="_blank"
            className="inline-flex items-center gap-3 text-xl font-bold text-primary hover:text-accent transition-colors"
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
            @TheBronso
          </a>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Хочете додати свою подію в календар?{" "}
          <Link
            href="/events"
            className="text-primary hover:text-accent underline transition-colors"
          >
            Дивіться розділ подій
          </Link>
        </p>
      </div>
    </div>
  );
}
