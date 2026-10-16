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
  const textLinks = new Map<string, number>();
  const pairs = (r: unknown): [string, number][] => {
    const arr = (r as string[] | null) ?? [];
    const out: [string, number][] = [];
    for (let i = 0; i < arr.length; i += 2) out.push([arr[i], Number(arr[i + 1])]);
    return out;
  };
  days.forEach((_, i) => {
    for (const [f, n] of pairs(res[i * 3])) {
      const [kind, ad] = [f.slice(0, f.indexOf("|")), f.slice(f.indexOf("|") + 1)];
      const cur = ads.get(ad) ?? { view: 0, click: 0 };
      if (kind === "view") cur.view += n;
      else cur.click += n;
      ads.set(ad, cur);
    }
    for (const [f, n] of pairs(res[i * 3 + 1])) pageLinks.set(f, (pageLinks.get(f) ?? 0) + n);
    for (const [f, n] of pairs(res[i * 3 + 2])) textLinks.set(f, (textLinks.get(f) ?? 0) + n);
  });

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
  type Row = { page: string; text: string; href: string; n: number };
  const rows: Row[] = [];
  const withText = new Map<string, number>();
  for (const [k, n] of textLinks) {
    const [page, href, text] = k.split(SEP);
    rows.push({ page, href, text, n });
    withText.set(`${page}|${href}`, (withText.get(`${page}|${href}`) ?? 0) + n);
  }
  for (const [k, n] of pageLinks) {
    const rest = n - (withText.get(k) ?? 0);
    if (rest > 0) {
      const i = k.indexOf("|");
      rows.push({ page: k.slice(0, i), href: k.slice(i + 1), text: "", n: rest });
    }
  }
  const linkRows = rows.filter((r) => !pageFilter || r.page === pageFilter).sort((a, b) => b.n - a.n);

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
                <th className="py-2 pr-4">З якої сторінки</th>
                <th className="py-2 pr-4">На що натиснули</th>
                <th className="py-2 pr-4">Куди веде</th>
                <th className="py-2 text-right">Кліки</th>
              </tr>
            </thead>
            <tbody>
              {linkRows.slice(0, 500).map((r) => (
                <tr key={`${r.page}|${r.href}|${r.text}`} className="border-b border-border align-top">
                  <td className="py-1.5 pr-4 break-all">
                    <a href={q({ page: r.page })} className="text-primary underline">{r.page}</a>
                  </td>
                  <td className="py-1.5 pr-4">{r.text || <span className="text-muted-foreground">без тексту</span>}</td>
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
