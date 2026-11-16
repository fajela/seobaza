import { externalRel } from "@/lib/own-sites";
import { pageMeta } from "@/lib/page-metadata";
import { Breadcrumbs } from "@/components/breadcrumbs";

const JAR_URL = "https://send.monobank.ua/jar/8nacjrPTZs";
const IBAN = "UA683220010000026200346147626";
const IBAN_SPACED = "UA 68 322001 00000 2620 0346 1476 26";
const REPORTS_URL =
  "https://www.instagram.com/p/DdimQ5bDU0B/?stkn=azk1aDlsZWZ1d3R2";
const WITHDRAWALS_URL = "https://linktr.ee/n.meleshko";

export const metadata = pageMeta({
  title: "Збір на роту 411 бригади Яструби | SEO Baza",
  description:
    "Збір SEO Baza на розгортання роти в 411 бригаді Яструби успішно закрили: транспорт, зв'язок, техніка. Звіти про покупки і як написати щодо нових зборів.",
  path: "/zbir",
  image: {
    path: "/images/og/zbir-na-rotu-411-bryhady-yastruby.jpg",
    alt: "Збір на роту в 411 бригаді Яструби, картка SEO Baza",
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
        <div className="rounded-xl border-2 border-accent bg-secondary/30 p-6 mb-8">
          <p className="text-xl font-bold mb-2">✅ Збір успішно закрили</p>
          <p>
            Дякуємо всім, хто донатив і поширював. Щодо нових зборів пишіть
            Олесі в Telegram{" "}
            <a
              href="https://t.me/fajela"
              target="_blank"
              rel="nofollow noopener"
              className="text-accent hover:underline"
            >
              @fajela
            </a>
            . Нижче опис збору, як він ішов, і звіти.
          </p>
        </div>
        <p className="text-lg text-muted-foreground mb-8">
          SEO Baza допомагає збирати донати для роти в 411 бригаді Яструби.
          Рота розгортається і вже виконує спеціальні завдання на Запоріжжі,
          і там зібралась одна з найфаховіших команд. Ініціатива Софії,
          SEOшниці, яка зараз служить.
        </p>

        <h2 className="text-2xl font-display mb-3">Підсумки: що купили</h2>
        <p className="mb-4">
          За звітами Наді, із зібраних грошей роті купили техніку і спорядження
          на <strong>206 557 гривень</strong>:
        </p>
        <ul className="mb-4 space-y-2">
          {[
            "2 пари FPV-окулярів, 54 000 грн",
            "2 оптичні рефлектометри, 48 308 грн",
            "2 пульти керування FPV-дронів, 27 296 грн",
            "метал і розхідні матеріали для додаткового захисту двох авто, 23 113 грн",
            "12 похідних ліжок, 16 310 грн",
            "2 обігрівачі вебасто, 15 240 грн",
            "2 тепломаскувальні полотна і 2 антитепловізорні чохли, 11 800 грн",
            "зарядка для FPV, 10 490 грн",
          ].map((item) => (
            <li key={item} className="flex gap-3">
              <span className="text-accent">→</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mb-10">
          Звіти з фото до кожної покупки:{" "}
          <a
            href={WITHDRAWALS_URL}
            target="_blank"
            rel={externalRel(WITHDRAWALS_URL)}
            className="text-accent hover:underline"
          >
            звіти Наді на linktr.ee
          </a>
          .
        </p>

        <h2 className="text-2xl font-display mb-3">На що збирали</h2>
        <p className="mb-4">
          На розгортання підрозділу: транспорт, зв&apos;язок, техніка,
          відновлення втрат, енергорезерв.
        </p>

        <h2 className="text-2xl font-display mb-3">Реквізити збору</h2>
        <ul className="mb-10 space-y-2">
          <li className="flex gap-3">
            <span className="text-accent">→</span>
            <span>
              Банка:{" "}
              <a
                href={JAR_URL}
                target="_blank"
                rel={externalRel(JAR_URL)}
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
            rel={externalRel(REPORTS_URL)}
            className="text-accent hover:underline"
          >
            звітує в Instagram
          </a>
          . Звіти про кожне зняття коштів з фото:{" "}
          <a
            href={WITHDRAWALS_URL}
            target="_blank"
            rel={externalRel(WITHDRAWALS_URL)}
            className="text-accent hover:underline"
          >
            linktr.ee/n.meleshko
          </a>
          .
        </p>
        <p className="mb-10">
          Софія написала нам сама і спитала, чи можна взяти участь у
          благодійній прожарці, щоб залучити донати в підрозділ. Ми вирішили,
          що людина на бойових завданнях не має ще й працювати заради донатів.
          Давайте спробуємо зібрати без прожарок.
        </p>

      </div>
    </div>
  );
}
