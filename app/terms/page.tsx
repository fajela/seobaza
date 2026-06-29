import { pageMeta } from "@/lib/page-metadata";

export const metadata = pageMeta({
  title: "Умови використання — SEO BAZA",
  description:
    "Умови використання сайту SEO BAZA: правила доступу до контенту, авторські права, розсилка, відповідальність та контакти.",
  path: "/terms",
});

const UPDATED = "29 червня 2026";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article className="max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-display mb-3 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Умови використання
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Останнє оновлення: {UPDATED}
        </p>

        <div className="space-y-8 text-foreground/90 leading-relaxed">
          <section>
            <p>
              Ці умови регулюють користування сайтом seobaza.com.ua. Відкриваючи
              сайт і користуючись його матеріалами, ви погоджуєтеся з умовами
              нижче. Якщо ви з ними не згодні, не користуйтеся сайтом.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display mb-3">Про сайт</h2>
            <p>
              SEO BAZA — це українська спільнота SEO-фахівців і медіа про
              пошукову оптимізацію: новини індустрії, аналітика, навчальні
              матеріали та події. Власниця й видавчиня сайту — Олеся Коробка.
              Контент має інформаційний характер.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display mb-3">Користування контентом</h2>
            <p>
              SEO BAZA — open-source проєкт. Ви можете робити з матеріалами, які
              тут надаються, що вам подобається: читати, копіювати, перекладати,
              переробляти, поширювати, зокрема в комерційних цілях, навіть
              публікувати під своїм імʼям. Окремий дозвіл і посилання на джерело
              не потрібні.
            </p>
            <p className="mt-3">
              Памʼятайте: якщо матеріал не належить SEO BAZA (цитати, зображення
              чи тексти третіх сторін), може знадобитися дозвіл від першоджерела.
            </p>
            <p className="mt-3">
              Єдине, чого не можна робити, це видавати себе за SEO BAZA: тобто
              використовувати назву, бренд чи логотип так, що це створює враження,
              ніби ваш матеріал, сайт чи проєкт є офіційним SEO BAZA або випущений
              від нашого імені.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display mb-3">Розсилка</h2>
            <p>
              Підписка на розсилку добровільна й підтверджується листом. Ви
              можете відписатися будь-коли через посилання в кінці кожного листа.
              Деталі обробки даних описані в{" "}
              <a href="/privacy" className="text-primary underline hover:text-accent">
                Політиці конфіденційності
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display mb-3">Посилання на інші ресурси</h2>
            <p>
              На сайті є посилання на зовнішні джерела й сервіси. Ми не
              контролюємо їхній вміст і не відповідаємо за нього. Перехід за
              такими посиланнями ви робите на власний розсуд.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display mb-3">Відповідальність</h2>
            <p>
              Матеріали надаються «як є». Ми намагаємося давати точну й актуальну
              інформацію, але SEO та алгоритми пошукових систем швидко
              змінюються, тож не гарантуємо результату від застосування порад.
              Рішення на основі матеріалів сайту ви ухвалюєте самостійно.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display mb-3">Зміни умов</h2>
            <p>
              Ми можемо оновлювати ці умови. Актуальна редакція з датою завжди на
              цій сторінці. Питання надсилайте на{" "}
              <a href="mailto:info@seobaza.com.ua" className="text-primary underline hover:text-accent">
                info@seobaza.com.ua
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
