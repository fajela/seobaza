import { pageMeta } from "@/lib/page-metadata";

// Медіакіт відео. НЕ в індексі й НЕ в сайтмапі, посилань на нього не ставимо:
// адресу надсилаємо рекламодавцю руками. У robots.txt НЕ закривати, інакше
// Google не прочитає noindex.
// /sponsors/media-kit поки веде сюди через 302: пізніше там стане загальний
// медіакіт, а банери й розсилка отримають свої media-kit-* адреси.
export const metadata = {
  ...pageMeta({
    title: "Медіакіт відеосеред - SEO BAZA",
    description: "Охоплення, формати й ціни спонсорства відеосеред SEO BAZA.",
    path: "/sponsors/media-kit-video",
    image: {
      path: "/images/og/sponsorstvo-videoserad.jpg",
      alt: "Темна картка з логотипом SEO BAZA і написом «Спонсорство відеосеред» та ціною 350 доларів за випуск",
    },
  }),
  robots: { index: false, follow: false },
};

const stats = [
  { num: "1 800–2 700", lbl: "переглядів має анонс ефіру в телеграмі", hi: true },
  { num: "774", lbl: "медіана переглядів випуску на YouTube", hi: false },
  { num: "6 083", lbl: "підписники телеграм-каналу", hi: false },
];

const deliverables = [
  {
    h: "Слово про спонсора на початку ефіру",
    p: "Ми зачитуємо узгоджений з вами текст: що робить продукт і кому він потрібен. Це окремий розділ у плеєрі, підписаний назвою спонсора.",
    img: "/images/mediakit/youtube-pleer-sponsor.jpg",
    alt: "Плеєр YouTube із випуском про RAG, у рядку розділів підписано інтро і слово спонсора",
  },
  {
    h: "Блок і посилання в описі під відео",
    p: "Ваш текст і посилання з вашими UTM-мітками лишаються під відео після ефіру.",
    img: "/images/mediakit/youtube-opys-sponsor.jpg",
    alt: "Опис відео на YouTube із виділеним блоком про спонсора стріму Collaborator і посиланням",
  },
  {
    h: "Анонс і пост із записом у телеграмі",
    p: "Анонс виходить у каналі напередодні ефіру, спонсор названий у ньому. Після ефіру виходить пост із записом. Анонс випуску про RAG зібрав 2 730 переглядів.",
    img: "/images/mediakit/telegram-anons-efiru.jpg",
    alt: "Анонс ефіру про RAG у телеграм-каналі SEO BAZA зі згадкою спонсора Collaborator і 2,73 тисячі переглядів",
  },
  {
    h: "Постійна сторінка випуску на сайті",
    p: "Запис, конспект розмови й таймкоди зі згадкою спонсора. Сторінка має розмітку VideoObject і перелінковку з новинами й статтями.",
    img: "/images/mediakit/storinka-vypusku-taimkody.jpg",
    alt: "Сторінка випуску на сайті SEO Baza з таймкодами, перший рядок про слово спонсора",
  },
];

const extras = [
  "Рядок про спонсора в email-розсилці того тижня, коли виходить випуск.",
  "Розіграш від спонсора просто в ефірі, якщо є що розігрувати. Люди пишуть у чат і переходять за посиланням.",
  "Найкорисніший блок ефіру виходить окремою статтею. Розмова про RAG стала покроковим гайдом.",
];

const reach = [
  {
    name: "Телеграм",
    sub: "t.me/SEOBAZA",
    num: "6 083 підписники",
    num2: "медіана 2 235 переглядів на пост, максимум 4 810",
    role: "Анонс ефіру й пост із записом, обидва зі згадкою",
  },
  {
    name: "YouTube",
    sub: "@SEOBAZA",
    num: "1 905 підписників",
    num2: "медіана 774 перегляди на випуск, найкращий 1 821",
    role: "Сам ефір: слово в кадрі, розділ у плеєрі, посилання в описі",
  },
];

const tiers = [
  { name: "Один випуск", amount: "$350", per: "", note: "Разове розміщення в одному ефірі", pick: false },
  { name: "4 випуски", amount: "$1 200", per: "", note: "$300 за випуск. Два місяці присутності поспіль", pick: false },
  { name: "10 випусків", amount: "$2 500", per: "", note: "$250 за випуск, ціна зафіксована наперед. Плюс банер у розсилці на весь період і пріоритет у виборі дат і тем", pick: true },
];

export default function MediaKitPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent mb-4">
          Медіакіт · SEO BAZA
        </p>
        <h1 className="text-4xl sm:text-5xl font-display mb-5">
          Спонсорство відеосеред
        </h1>
        <p className="text-lg text-muted-foreground mb-4">
          По середах раз на два тижні Олександра Хілова й Олеся Коробка розбирають
          те, що зараз реально болить в SEO. Ваш продукт звучить в ефірі, в описі
          під відео, в анонсі в телеграмі й на сторінці випуску.
        </p>
        <p className="text-2xl font-display font-bold text-accent mb-4">
          Від $350 за випуск
        </p>
        <p className="text-sm text-muted-foreground border-l-[3px] border-accent pl-3 mb-14">
          Усі цифри зняті 30 серпня 2026.
        </p>

        {/* Ключові числа */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border border border-border rounded-xl overflow-hidden mb-16">
          {stats.map((s) => (
            <div
              key={s.lbl}
              className={`p-5 flex flex-col gap-1 ${s.hi ? "bg-accent/10" : "bg-secondary/30"}`}
            >
              <span
                className={`font-display text-3xl font-bold leading-none tabular-nums ${s.hi ? "text-accent" : ""}`}
              >
                {s.num}
              </span>
              <span className="text-sm text-muted-foreground">{s.lbl}</span>
            </div>
          ))}
        </div>

        {/* Що отримує спонсор */}
        <h2 className="text-2xl font-display mb-2">Що отримує спонсор випуску</h2>
        <p className="text-muted-foreground mb-8">
          Один спонсор на випуск. Двох рекламодавців в один ефір ми не ставимо.
          Нижче кожен пункт зі скріншотом того, як це виглядало у спонсорованому
          випуску 26 серпня 2026.
        </p>
        <div className="space-y-10 mb-10">
          {deliverables.map((d, i) => (
            <div key={d.h}>
              <div className="flex gap-3 items-baseline mb-2">
                <span className="font-display font-bold text-accent tabular-nums">
                  {i + 1}
                </span>
                <h3 className="font-display text-xl">{d.h}</h3>
              </div>
              <p className="text-muted-foreground mb-4">{d.p}</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={d.img}
                alt={d.alt}
                className="w-full h-auto rounded-lg border border-border"
              />
            </div>
          ))}
        </div>
        <h3 className="font-display text-xl mb-3">Додаткові можливості</h3>
        <ul className="list-disc pl-5 space-y-2 mb-16 text-muted-foreground">
          {extras.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>

        {/* Аудиторія */}
        <h2 className="text-2xl font-display mb-2">Де це бачать</h2>
        <p className="text-muted-foreground mb-6">
          Українські SEO-фахівці: інхаус-команди, агенції, фрилансери й власники
          проєктів. Це люди, які самі обирають інструменти, біржі посилань
          і підрядників.
        </p>
        <div className="overflow-x-auto border border-border rounded-xl mb-16">
          <table className="w-full text-[15px] min-w-[560px]">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-4 font-display text-xs uppercase tracking-wide text-muted-foreground">
                  Майданчик
                </th>
                <th className="text-left p-4 font-display text-xs uppercase tracking-wide text-muted-foreground">
                  Скільки
                </th>
                <th className="text-left p-4 font-display text-xs uppercase tracking-wide text-muted-foreground">
                  Роль у спонсорстві
                </th>
              </tr>
            </thead>
            <tbody>
              {reach.map((r) => (
                <tr key={r.name} className="border-t border-border align-top">
                  <td className="p-4">
                    <strong>{r.name}</strong>
                    {r.sub && (
                      <span className="block text-muted-foreground text-sm">{r.sub}</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="tabular-nums font-semibold block">{r.num}</span>
                    <span className="text-sm text-muted-foreground">{r.num2}</span>
                  </td>
                  <td className="p-4 text-muted-foreground">{r.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Ціни */}
        <h2 className="text-2xl font-display mb-2">Скільки це коштує</h2>
        <p className="text-muted-foreground mb-6">
          Оплата наперед за пакет. Підготовка тексту згадки й вставка логотипа
          входять у ціну.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-16">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`bg-secondary/30 border rounded-xl p-5 flex flex-col gap-1.5 ${
                t.pick ? "border-accent shadow-lg" : "border-border"
              }`}
            >
              <span className="font-display font-bold">{t.name}</span>
              <span
                className={`font-display text-3xl font-bold tabular-nums leading-tight ${t.pick ? "text-accent" : ""}`}
              >
                {t.amount}
              </span>
              {t.per && (
                <span className="text-sm font-semibold text-muted-foreground">{t.per}</span>
              )}
              <span className="text-sm text-muted-foreground">{t.note}</span>
            </div>
          ))}
        </div>

        {/* Обмеження */}
        <h2 className="text-2xl font-display mb-6">Чого ми не робимо</h2>
        <div className="bg-muted/40 rounded-xl p-6 mb-16">
          <ul className="list-disc pl-5 space-y-2.5">
            <li>
              Не публікуємо окремих рекламних постів у каналі. Спонсор живе
              всередині випуску.
            </li>
            <li>
              Не читаємо чужий рекламний текст дослівно. Ми переказуємо суть
              своїми словами.
            </li>
            <li>Не беремо продукти, якими не готові користуватися самі.</li>
            <li>
              Не ставимо follow-посилань. Посилання спонсора на сайті йде
              з rel=&quot;nofollow&quot;.
            </li>
          </ul>
        </div>

        {/* Що потрібно */}
        <h2 className="text-2xl font-display mb-6">Що потрібно від вас</h2>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>Бриф до однієї сторінки: що за продукт, кому корисний, дві або три тези.</li>
          <li>Одне посилання, з вашими UTM-мітками, якщо потрібні.</li>
          <li>Логотип у png на прозорому фоні, від 1000 px по ширині.</li>
          <li>Якщо хочете розіграш, приз і умови.</li>
        </ul>
        <p className="text-sm text-muted-foreground mb-16">
          Матеріали за 5 днів до ефіру. Текст згадки ми повертаємо вам
          на погодження за 3 дні до нього.
        </p>

        {/* Контакт */}
        <div className="border-t border-border pt-10">
          <h2 className="text-2xl font-display mb-3">Написати нам</h2>
          <p className="text-muted-foreground mb-5">
            Bronso відповідає за партнерства й скаже, які випуски вільні.
          </p>
          <a
            href="https://t.me/TheBronso"
            target="_blank"
            rel="noopener"
            className="inline-block bg-accent text-accent-foreground font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            @TheBronso
          </a>
          <p className="text-sm text-muted-foreground mt-4">
            Або листом на{" "}
            <a
              href="mailto:info@seobaza.com.ua"
              className="text-primary hover:text-accent underline"
            >
              info@seobaza.com.ua
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
