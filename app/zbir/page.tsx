import { pageMeta } from "@/lib/page-metadata";
import { Breadcrumbs } from "@/components/breadcrumbs";

const JAR_URL = "https://send.monobank.ua/jar/8nacjrPTZs";
const IBAN = "UA683220010000026200346147626";
const IBAN_SPACED = "UA 68 322001 00000 2620 0346 1476 26";
const REPORTS_URL =
  "https://www.instagram.com/p/DdimQ5bDU0B/?stkn=azk1aDlsZWZ1d3R2";

export const metadata = pageMeta({
  title: "Збір на роту 411 бригади Яструби | SEO BAZA",
  description:
    "SEO Baza допомагає зібрати на розгортання роти в 411 бригаді Яструби: транспорт, зв'язок, техніка. Банка monobank, IBAN, звіти про кожну покупку. Долучайтеся.",
  path: "/zbir",
  image: {
    path: "/images/og/zbir-na-rotu-411-bryhady-yastruby.jpg",
    alt: "Збір на роту в 411 бригаді Яструби, картка SEO BAZA",
  },
});

export default function ZbirPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl mx-auto">
        <Breadcrumbs
          items={[
            { name: "Головна", href: "/" },
            { name: "Збір", href: "/zbir" },
          ]}
        />
        <h1 className="text-4xl sm:text-5xl font-display mb-6 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Збір на роту в 411 бригаді Яструби
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          SEO Baza допомагає збирати донати для роти в 411 бригаді Яструби.
          Рота розгортається і вже виконує спеціальні завдання на Запоріжжі,
          і там зібралась одна з найфаховіших команд. Ініціатива Софії,
          SEOшниці, яка до мобілізації була тімлідеркою SEO і зараз служить.
        </p>

        <a
          href={JAR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center rounded-xl bg-accent px-6 py-5 text-xl font-bold text-black hover:opacity-90 transition-opacity mb-4"
        >
          Закинути в банку monobank
        </a>
        <p className="text-sm text-muted-foreground mb-10">
          Банка підписана «На нову суперроту». Якщо зручніше переказом, IBAN
          нижче.
        </p>

        <h2 className="text-2xl font-display mb-3">На що збираємо</h2>
        <p className="mb-4">
          На розгортання підрозділу: транспорт, зв&apos;язок, техніка,
          відновлення втрат, енергорезерв.
        </p>

        <h2 className="text-2xl font-display mb-3">Реквізити</h2>
        <ul className="mb-10 space-y-2">
          <li className="flex gap-3">
            <span className="text-accent">→</span>
            <span>
              Банка:{" "}
              <a
                href={JAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline break-all"
              >
                send.monobank.ua/jar/8nacjrPTZs
              </a>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent">→</span>
            <span>
              IBAN: <code className="text-sm">{IBAN_SPACED}</code> (без
              пробілів: <code className="text-sm">{IBAN}</code>)
            </span>
          </li>
        </ul>

        <h2 className="text-2xl font-display mb-3">Хто веде збір і де звіти</h2>
        <p className="mb-4">
          Збір веде Надя: у неї офіційно зареєстрований волонтерський рахунок,
          усі покупки на підрозділ офіційні, з документами й підтвердженнями.
          Про кожну покупку вона{" "}
          <a
            href={REPORTS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            звітує в Instagram
          </a>
          .
        </p>
        <p className="mb-10">
          Софія написала нам сама і спитала, чи можна взяти участь у
          благодійній прожарці, щоб залучити донати в підрозділ. Ми вирішили,
          що людина на бойових завданнях не має ще й працювати заради донатів.
          Давайте спробуємо зібрати без прожарок.
        </p>

        <h2 className="text-2xl font-display mb-3">Як допомогти</h2>
        <ul className="mb-10 space-y-2">
          <li className="flex gap-3">
            <span className="text-accent">→</span>
            <span>Закинути в банку, скільки зручно.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent">→</span>
            <span>
              Переслати цю сторінку колегам або{" "}
              <a
                href="https://t.me/SEOBAZA"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                пост у нашому Telegram
              </a>
              .
            </span>
          </li>
        </ul>

        <p className="text-sm text-muted-foreground">
          Банка стоїть під кожним стрімом на{" "}
          <a href="/videos" className="text-accent hover:underline">
            сторінках відео
          </a>{" "}
          і в п&apos;ятничних випусках новин. Підсумки збору і куплене
          дописуватимемо сюди.
        </p>
      </div>
    </div>
  );
}
