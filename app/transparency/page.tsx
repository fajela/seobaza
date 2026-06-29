import { pageMeta } from "@/lib/page-metadata";

export const metadata = pageMeta({
  title: "Прозорість видання — SEO BAZA",
  description:
    "Хто стоїть за SEO BAZA, як ми заробляємо, як працює редакція, звідки беремо факти й де нас виправити. Прозорість видання.",
  path: "/transparency",
});

const UPDATED = "29 червня 2026";

export default function TransparencyPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article className="max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-display mb-3 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Прозорість видання
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Останнє оновлення: {UPDATED}
        </p>

        <div className="space-y-8 text-foreground/90 leading-relaxed">
          <section>
            <p>
              Тут ми відкрито пояснюємо, хто стоїть за SEO BAZA, як ми
              заробляємо й за якими правилами працює редакція. Це наша версія
              сторінки прозорості, на яку спираються Google та сумлінні читачі.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display mb-3">Хто ми</h2>
            <p>
              SEO BAZA — українська спільнота SEO-фахівців і медіа про пошукову
              оптимізацію. Спільнота працює з листопада 2022 року: щоденний
              Telegram-канал, активний чат, YouTube, новини й аналітика на сайті
              та події для індустрії.
            </p>
            <p className="mt-3">
              Засновниця, власниця й головна редакторка — Олеся Коробка,
              SEO-консультантка. Сайт і видавнича діяльність ведуться нею. Більше
              про проєкт: <a href="/about" className="text-primary underline hover:text-accent">сторінка «Про нас»</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display mb-3">Як ми заробляємо</h2>
            <p>SEO BAZA фінансується за рахунок:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>спонсорства новин і відео;</li>
              <li>розміщення вакансій та анонсів подій;</li>
              <li>партнерств із релевантними для спільноти компаніями.</li>
            </ul>
            <p className="mt-3">
              Сайт не має платного доступу: усі матеріали відкриті. Рекламні та
              спонсорські розміщення ми позначаємо. Формати й умови співпраці —
              на сторінці <a href="/sponsors" className="text-primary underline hover:text-accent">для спонсорів</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display mb-3">Редакційна незалежність</h2>
            <p>
              Спонсорство не дає права впливати на оцінки й висновки в редакційних
              матеріалах. Спонсорський контент завжди підписаний як такий. Новини
              та аналітику ми пишемо незалежно від того, хто наразі підтримує
              видання.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display mb-3">Звідки беремо факти</h2>
            <p>
              Кожне твердження в новинах і аналітиці спирається на конкретне
              джерело: офіційні заяви Google, документацію, дослідження галузі чи
              першоджерела, на які ми ставимо посилання просто в тексті. Авторів і
              дати публікації ми вказуємо.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display mb-3">Виправлення</h2>
            <p>
              Якщо ви помітили помилку чи неточність, напишіть нам, і ми
              перевіримо та виправимо матеріал. Пишіть на{" "}
              <a href="mailto:info@seobaza.com.ua" className="text-primary underline hover:text-accent">
                info@seobaza.com.ua
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display mb-3">Контакти й документи</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Email:{" "}
                <a href="mailto:info@seobaza.com.ua" className="text-primary underline hover:text-accent">info@seobaza.com.ua</a>.
                Інші способи зв&apos;язку —{" "}
                <a href="/contact" className="text-primary underline hover:text-accent">сторінка контактів</a>.
              </li>
              <li>
                <a href="/privacy" className="text-primary underline hover:text-accent">Політика конфіденційності</a>{" "}
                та{" "}
                <a href="/terms" className="text-primary underline hover:text-accent">Умови використання</a>.
              </li>
            </ul>
          </section>
        </div>
      </article>
    </div>
  );
}
