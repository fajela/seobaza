import { pageMeta } from "@/lib/page-metadata";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata = pageMeta({
  title: "Політика конфіденційності — SEO BAZA",
  description:
    "Як SEO BAZA збирає, використовує та захищає ваші дані: розсилка, аналітика, файли cookie, Google Reader Revenue Manager та ваші права.",
  path: "/privacy",
});

const UPDATED = "29 червня 2026";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article className="max-w-3xl mx-auto">
        <Breadcrumbs items={[{ name: "Головна", href: "/" }, { name: "Політика конфіденційності", href: "/privacy" }]} />
        <h1 className="text-4xl sm:text-5xl font-display mb-3 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Політика конфіденційності
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Останнє оновлення: {UPDATED}
        </p>

        <div className="space-y-8 text-foreground/90 leading-relaxed">
          <section>
            <p>
              SEO BAZA (далі «ми», «сайт», «спільнота») поважає вашу
              приватність. Ця політика пояснює, які персональні дані ми збираємо
              на seobaza.com.ua, для чого їх використовуємо та які у вас є права.
              Контролером даних є власниця сайту Олеся Коробка. Зв&apos;язатися
              можна на{" "}
              <a href="mailto:info@seobaza.com.ua" className="text-primary underline hover:text-accent">
                info@seobaza.com.ua
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display mb-3">Які дані ми збираємо</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Email для розсилки.</strong> Якщо ви підписуєтесь на
                нашу розсилку, ми отримуємо вашу електронну адресу. Підписка
                відбувається з підтвердженням (double opt-in): лист додається до
                бази лише після того, як ви натиснете посилання у листі
                підтвердження.
              </li>
              <li>
                <strong>Знеособлена аналітика.</strong> Ми бачимо агреговану
                статистику відвідувань (які сторінки переглядають, з яких країн,
                з яких джерел) без прив&apos;язки до конкретної особи.
              </li>
              <li>
                <strong>Технічні дані.</strong> Стандартні дані, які браузер
                передає будь-якому сайту: IP-адреса, тип браузера, час запиту.
                Вони потрібні для роботи й безпеки сайту.
              </li>
              <li>
                <strong>Налаштування.</strong> Вибір світлої чи темної теми
                зберігається у вашому браузері й не передається нам.
              </li>
            </ul>
            <p className="mt-3">
              Ми не збираємо платіжних даних і не просимо чутливої інформації.
              Коментарі під матеріалами працюють через Telegram і регулюються
              політикою конфіденційності Telegram.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display mb-3">Сервіси, якими ми користуємось</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Kit (ConvertKit)</strong> — сервіс розсилки. Зберігає
                вашу email-адресу й керує підпискою.{" "}
                <a href="https://kit.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-accent">
                  Політика Kit
                </a>
                .
              </li>
              <li>
                <strong>Vercel</strong> — хостинг сайту та знеособлена аналітика
                Vercel Analytics, яка не використовує рекламних файлів cookie й
                не ідентифікує окремих відвідувачів.{" "}
                <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-accent">
                  Політика Vercel
                </a>
                .
              </li>
              <li>
                <strong>Google Reader Revenue Manager</strong> — інструмент
                Google для підписки на розсилку та підтримки видання. Коли він
                показує форму на сайті, Google може встановлювати власні файли
                cookie відповідно до{" "}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-accent">
                  Політики конфіденційності Google
                </a>
                .
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-display mb-3">Файли cookie</h2>
            <p>
              Власні файли cookie ми використовуємо лише для роботи сайту
              (наприклад, запам&apos;ятати обрану тему). Сторонні cookie можуть
              встановлювати сервіси вище, коли ви взаємодієте з їхніми формами.
              Ви можете вимкнути або видалити cookie в налаштуваннях браузера,
              але частина функцій може працювати інакше.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display mb-3">Для чого ми використовуємо дані</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>надсилати розсилку, на яку ви підписались;</li>
              <li>підтримувати роботу, безпеку й стабільність сайту;</li>
              <li>розуміти в загальних цифрах, які матеріали корисні читачам.</li>
            </ul>
            <p className="mt-3">
              Ми не продаємо ваші дані й не передаємо їх третім особам для
              реклами.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display mb-3">Ваші права</h2>
            <p>
              Ви можете будь-коли відписатися від розсилки (посилання є в кожному
              листі), запитати, які ваші дані ми зберігаємо, виправити їх або
              попросити видалити. Для цього напишіть нам на{" "}
              <a href="mailto:info@seobaza.com.ua" className="text-primary underline hover:text-accent">
                info@seobaza.com.ua
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display mb-3">Зміни</h2>
            <p>
              Ми можемо оновлювати цю політику. Актуальна дата вгорі сторінки.
              Питання щодо конфіденційності надсилайте на{" "}
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
