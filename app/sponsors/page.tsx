import Link from "next/link";
import { pageMeta } from "@/lib/page-metadata";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata = pageMeta({
  title: "Спонсорам - SEO BAZA",
  description:
    "Формати співпраці та реклами в SEO BAZA: спонсор новинного дайджесту, спонсор відео, дошка вакансій. Доступ до української SEO-спільноти.",
  path: "/sponsors",
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
    id: "news",
    title: "Спонсор новинного дайджесту",
    price: "$120",
    priceNote: "за випуск · пакет 4 випуски — $400",
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
    id: "video",
    title: "Спонсор відео",
    price: "від $200",
    priceNote: "за випуск · пакет 10 випусків",
    description:
      "Згадка спонсора на початку відео на YouTube та посилання в описі. Ціна залежить від формату і переглядів випуску.",
    includes: [
      "Усна згадка «за підтримки» у відео",
      "Логотип або згадка в кадрі",
      "Посилання в описі під відео",
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
  "Українська SEO-спільнота: фахівці, агенції, інхаус-команди й фрилансери",
  "B2B-аудиторія, яка реально купує інструменти, посилання й послуги",
  "Телеграм-канал, email-розсилка, YouTube і сайт під одним брендом",
];

export default function SponsorsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs items={[{ name: "Головна", href: "/" }, { name: "Спонсорам", href: "/sponsors" }]} />
        <h1 className="text-4xl sm:text-5xl font-display mb-6 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Спонсорам SEO BAZA
        </h1>
        <p className="text-lg text-muted-foreground mb-10">
          Розкажіть про свій продукт українській SEO-спільноті без нав&apos;язливої
          реклами. Інтегровані формати, які люди читають, а не гортають.
        </p>

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

        {/* CTA */}
        <div className="p-6 bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl border border-accent/40 text-center">
          <h2 className="text-2xl font-display mb-3">Обговорити співпрацю</h2>
          <p className="text-muted-foreground mb-6">
            Напишіть Bronso, і ми підберемо формат під ваші задачі
          </p>
          <a
            href="https://t.me/TheBronso"
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
