import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SEP, daysBetween, kyivDay, redis, trackingEnabled } from "@/lib/track-store";
import { PARTNER } from "@/lib/partner";

/**
 * Приватна статистика лічильника: /stats?key=<STATS_KEY>&from=YYYY-MM-DD&to=YYYY-MM-DD
 * Без правильного ключа віддає 404. Не індексується.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Статистика кліків",
  robots: { index: false, follow: false },
};

type SP = Promise<Record<string, string | string[] | undefined>>;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const isDay = (s?: string) => !!s && /^\d{4}-\d{2}-\d{2}$/.test(s);
const fmt = (n: number) => n.toLocaleString("uk-UA");

/** Тестові кліки під час налаштування лічильника: день, сторінка, посилання. */
const TEST_CLICKS = [
  "2026-10-16|/|/x",
  "2026-10-16|/sponsors|/seobaza.png",
];

const pageHtml = new Map<string, Promise<string>>();

/** Текст посилання href на сторінці page нашого сайту (для кліків без тексту). */
async function anchorText(page: string, href: string): Promise<string | undefined> {
  if (!pageHtml.has(page)) {
    pageHtml.set(
      page,
      fetch(`https://seobaza.com.ua${page}`, { next: { revalidate: 86400 } })
        .then((r) => (r.ok ? r.text() : ""))
        .catch(() => ""),
    );
  }
  const html = await pageHtml.get(page)!;
  const esc = href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/&/g, "&(?:amp;)?");
  const m = html.match(new RegExp(`<a\\b[^>]*href="${esc}"[^>]*>([\\s\\S]*?)</a>`));
  if (!m) return undefined;
  const t = m[1]
    .replace(/<img[^>]*alt="([^"]*)"[^>]*>/g, " $1 ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
  return t ? t.slice(0, 100) : undefined;
}

export default async function StatsPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const key = process.env.STATS_KEY;
  if (!key || one(sp.key) !== key) notFound();

  const today = kyivDay();
  const defFrom = PARTNER?.from ?? kyivDay(new Date(Date.now() - 29 * 864e5));
  const from = isDay(one(sp.from)) ? one(sp.from)! : defFrom;
  const to = isDay(one(sp.to)) ? one(sp.to)! : today;
  const pageFilter = one(sp.page);
  const days = daysBetween(from, to);

  if (!trackingEnabled) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-display mb-4">Статистика кліків</h1>
        <p className="text-muted-foreground">База лічильника не підключена.</p>
      </div>
    );
  }

  const res = await redis(
    days.flatMap((d) => [["HGETALL", `a:${d}`], ["HGETALL", `lp:${d}`], ["HGETALL", `lt:${d}`]]),
  );

  const ads = new Map<string, { view: number; click: number }>();
  const pageLinks = new Map<string, number>();
  // По днях: для рядків із датою.
  const dayPage: { day: string; k: string; n: number }[] = [];
  const dayText: { day: string; k: string; n: number }[] = [];
  const adDaily: { day: string; ad: string; view: number; click: number }[] = [];
  const pairs = (r: unknown): [string, number][] => {
    const arr = (r as string[] | null) ?? [];
    const out: [string, number][] = [];
    for (let i = 0; i < arr.length; i += 2) out.push([arr[i], Number(arr[i + 1])]);
    return out;
  };
  days.forEach((day, i) => {
    const today = new Map<string, { view: number; click: number }>();
    for (const [f, n] of pairs(res[i * 3])) {
      const [kind, ad] = [f.slice(0, f.indexOf("|")), f.slice(f.indexOf("|") + 1)];
      const cur = ads.get(ad) ?? { view: 0, click: 0 };
      const d = today.get(ad) ?? { view: 0, click: 0 };
      if (kind === "view") {
        cur.view += n;
        d.view += n;
      } else {
        cur.click += n;
        d.click += n;
      }
      ads.set(ad, cur);
      today.set(ad, d);
    }
    for (const [ad, v] of today) adDaily.push({ day, ad, ...v });
    for (const [f, n] of pairs(res[i * 3 + 1])) {
      pageLinks.set(f, (pageLinks.get(f) ?? 0) + n);
      dayPage.push({ day, k: f, n });
    }
    for (const [f, n] of pairs(res[i * 3 + 2])) dayText.push({ day, k: f, n });
  });
  adDaily.sort((a, b) => (a.day < b.day ? 1 : a.day > b.day ? -1 : a.ad.localeCompare(b.ad)));

  // Унікальні відвідувачі реклами за весь період: PFCOUNT по всіх днях разом.
  const adIds = [...ads.keys()];
  const uniq = adIds.length
    ? await redis(
        adIds.flatMap((ad) => [
          ["PFCOUNT", ...days.map((d) => `au:${d}:view:${ad}`)],
          ["PFCOUNT", ...days.map((d) => `au:${d}:click:${ad}`)],
        ]),
      )
    : [];

  // Рядки "звідки | текст | куди". Кліки до 16.10.2026 записані без тексту,
  // їх показуємо з порожнім текстом (різниця між lp і lt).
  type Row = { day: string; page: string; text: string; href: string; n: number };
  const rows: Row[] = [];
  const withText = new Map<string, number>();
  for (const { day, k, n } of dayText) {
    const [page, href, text] = k.split(SEP);
    rows.push({ day, page, href, text, n });
    const key2 = `${day}|${page}|${href}`;
    withText.set(key2, (withText.get(key2) ?? 0) + n);
  }
  for (const { day, k, n } of dayPage) {
    const rest = n - (withText.get(`${day}|${k}`) ?? 0);
    if (rest > 0) {
      const i = k.indexOf("|");
      rows.push({ day, page: k.slice(0, i), href: k.slice(i + 1), text: "", n: rest });
    }
  }
  const linkRows = rows
    .filter((r) => !pageFilter || r.page === pageFilter)
    .sort((a, b) => (a.day < b.day ? 1 : a.day > b.day ? -1 : b.n - a.n));
  // Для старих кліків без тексту шукаємо це посилання на сторінці, звідки клікнули.
  await Promise.all(
    linkRows
      .filter((r) => !r.text)
      .map(async (r) => {
        r.text = (await anchorText(r.page, r.href)) ?? "";
      }),
  );
  const dayLabel = (d: string) => `${d.slice(8, 10)}.${d.slice(5, 7)}.${d.slice(0, 4)}`;

  const byPage = new Map<string, number>();
  for (const [k, n] of pageLinks) {
    const pg = k.slice(0, k.indexOf("|"));
    byPage.set(pg, (byPage.get(pg) ?? 0) + n);
  }
  const pageTotals = [...byPage.entries()].sort((a, b) => b[1] - a[1]);

  const q = (extra: Record<string, string>) =>
    "?" + new URLSearchParams({ key, from, to, ...extra }).toString();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-5xl">
      <h1 className="text-3xl font-display mb-2">Статистика кліків</h1>
      <form className="flex flex-wrap items-end gap-3 mb-8 text-sm" method="get">
        <input type="hidden" name="key" value={key} />
        <label className="flex flex-col gap-1">
          Від
          <input type="date" name="from" defaultValue={from} className="border border-border rounded px-2 py-1 bg-background" />
        </label>
        <label className="flex flex-col gap-1">
          До
          <input type="date" name="to" defaultValue={to} className="border border-border rounded px-2 py-1 bg-background" />
        </label>
        {pageFilter && <input type="hidden" name="page" value={pageFilter} />}
        <button className="px-4 py-1.5 rounded bg-primary text-primary-foreground">Показати</button>
        <span className="text-muted-foreground">Дні за Києвом. Покази рахуються, коли банер наполовину на екрані 1 секунду.</span>
      </form>

      <h2 className="text-2xl font-display mb-3">Реклама</h2>
      {adIds.length === 0 ? (
        <p className="text-muted-foreground mb-10">За цей період подій немає.</p>
      ) : (
        <div className="overflow-x-auto mb-10">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b border-border">
                <th className="py-2 pr-4">Рекламний блок</th>
                <th className="py-2 pr-4 text-right">Покази</th>
                <th className="py-2 pr-4 text-right">Унікальні глядачі</th>
                <th className="py-2 pr-4 text-right">Кліки</th>
                <th className="py-2 pr-4 text-right">Унікальні клікери</th>
                <th className="py-2 text-right">CTR</th>
              </tr>
            </thead>
            <tbody>
              {adIds.map((ad, i) => {
                const a = ads.get(ad)!;
                return (
                  <tr key={ad} className="border-b border-border">
                    <td className="py-2 pr-4 font-mono">{ad}</td>
                    <td className="py-2 pr-4 text-right">{fmt(a.view)}</td>
                    <td className="py-2 pr-4 text-right">{fmt(Number(uniq[i * 2] ?? 0))}</td>
                    <td className="py-2 pr-4 text-right">{fmt(a.click)}</td>
                    <td className="py-2 pr-4 text-right">{fmt(Number(uniq[i * 2 + 1] ?? 0))}</td>
                    <td className="py-2 text-right">{a.view ? ((a.click / a.view) * 100).toFixed(2) + "%" : "0%"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {adDaily.length > 0 && (
        <>
          <h2 className="text-2xl font-display mb-1">Реклама по днях</h2>
          <p className="text-sm text-muted-foreground mb-3">
            16.10.2026 серед показів є кілька тестових переглядів під час налаштування лічильника, окремо їх не виділити.
          </p>
          <div className="overflow-x-auto mb-10">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left border-b border-border">
                  <th className="py-2 pr-4">Дата</th>
                  <th className="py-2 pr-4">Рекламний блок</th>
                  <th className="py-2 pr-4 text-right">Покази</th>
                  <th className="py-2 pr-4 text-right">Кліки</th>
                  <th className="py-2 text-right">CTR</th>
                </tr>
              </thead>
              <tbody>
                {adDaily.map((r) => (
                  <tr key={`${r.day}|${r.ad}`} className="border-b border-border">
                    <td className="py-1.5 pr-4 whitespace-nowrap">{dayLabel(r.day)}</td>
                    <td className="py-1.5 pr-4 font-mono">{r.ad}</td>
                    <td className="py-1.5 pr-4 text-right">{fmt(r.view)}</td>
                    <td className="py-1.5 pr-4 text-right">{fmt(r.click)}</td>
                    <td className="py-1.5 text-right">{r.view ? ((r.click / r.view) * 100).toFixed(2) + "%" : "0%"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!pageFilter && pageTotals.length > 0 && (
        <>
          <h2 className="text-2xl font-display mb-3">Де клікають</h2>
          <table className="w-full text-sm border-collapse mb-10">
            <thead>
              <tr className="text-left border-b border-border">
                <th className="py-2 pr-4">Сторінка</th>
                <th className="py-2 text-right">Кліки</th>
              </tr>
            </thead>
            <tbody>
              {pageTotals.slice(0, 50).map(([pg, n]) => (
                <tr key={pg} className="border-b border-border">
                  <td className="py-1.5 pr-4 break-all">
                    <a href={q({ page: pg })} className="text-primary underline">{pg}</a>
                  </td>
                  <td className="py-1.5 text-right">{fmt(n)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <h2 className="text-2xl font-display mb-1">Кліки по посиланнях</h2>
      <p className="text-sm text-muted-foreground mb-3">
        {pageFilter ? (
          <>
            Тільки на сторінці <span className="font-mono">{pageFilter}</span>.{" "}
            <a href={q({})} className="text-primary underline">Усі сторінки</a>
          </>
        ) : (
          "Усі сторінки сайту. Щоб лишити одну сторінку, натисніть її адресу в першій колонці."
        )}
      </p>
      {linkRows.length === 0 ? (
        <p className="text-muted-foreground">За цей період кліків немає.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b border-border">
                <th className="py-2 pr-4 whitespace-nowrap">Дата</th>
                <th className="py-2 pr-4">З якої сторінки</th>
                <th className="py-2 pr-4">На що натиснули</th>
                <th className="py-2 pr-4">Куди веде</th>
                <th className="py-2 text-right">Кліки</th>
              </tr>
            </thead>
            <tbody>
              {linkRows.slice(0, 500).map((r) => (
                <tr key={`${r.day}|${r.page}|${r.href}|${r.text}`} className="border-b border-border align-top">
                  <td className="py-1.5 pr-4 whitespace-nowrap">{dayLabel(r.day)}</td>
                  <td className="py-1.5 pr-4 break-all">
                    <a href={q({ page: r.page })} className="text-primary underline">{r.page}</a>
                  </td>
                  <td className="py-1.5 pr-4">
                    {r.text || <span className="text-muted-foreground">без тексту</span>}
                    {TEST_CLICKS.includes(`${r.day}|${r.page}|${r.href}`) && (
                      <span className="ml-2 inline-block rounded bg-accent/20 px-1.5 py-0.5 text-xs font-semibold">тестовий клік</span>
                    )}
                  </td>
                  <td className="py-1.5 pr-4 break-all">
                    <a href={r.href} target="_blank" rel="noopener noreferrer nofollow" className="hover:text-accent">{r.href}</a>
                  </td>
                  <td className="py-1.5 text-right">{fmt(r.n)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
