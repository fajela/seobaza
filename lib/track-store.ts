/**
 * Лічильник показів і кліків у Upstash Redis через REST (без залежностей).
 *
 * Змінні середовища (ставить інтеграція Upstash у Vercel, підтримуємо обидві назви):
 *   KV_REST_API_URL / KV_REST_API_TOKEN  або  UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
 *   TRACK_SALT  — секрет для хешу відвідувача (необов'язковий, але бажаний)
 *   STATS_KEY   — ключ доступу до сторінки /stats
 *
 * Що зберігаємо, по днях за Києвом (D = YYYY-MM-DD), ключі живуть 400 днів:
 *   l:D   hash  посилання -> кліки
 *   lp:D  hash  "сторінка|посилання" -> кліки
 *   a:D   hash  "view|<реклама>" / "click|<реклама>" -> кількість
 *   au:D:<view|click>:<реклама>  HyperLogLog унікальних відвідувачів
 * IP і User-Agent не зберігаємо: тільки хеш із щоденною сіллю, тож відвідувача
 * не можна відстежити між днями.
 */

const URL_ = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
const TTL = 400 * 24 * 3600;

export const trackingEnabled = Boolean(URL_ && TOKEN);

type Cmd = (string | number)[];

export async function redis(commands: Cmd[]): Promise<unknown[]> {
  if (!trackingEnabled) return [];
  const res = await fetch(`${URL_}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(commands),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Upstash ${res.status}`);
  const out = (await res.json()) as { result?: unknown; error?: string }[];
  return out.map((r) => r.result);
}

/** Дата за Києвом, YYYY-MM-DD. */
export function kyivDay(d = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Kyiv" }).format(d);
}

export async function visitorHash(ip: string, ua: string, day: string): Promise<string> {
  const salt = process.env.TRACK_SALT ?? "seobaza";
  const data = new TextEncoder().encode(`${salt}|${day}|${ip}|${ua}`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf).slice(0, 12), (b) => b.toString(16).padStart(2, "0")).join("");
}

export type TrackEvent = {
  /** c = клік по посиланню, v = показ реклами */
  t: "c" | "v";
  /** куди веде посилання (для кліку) */
  h?: string;
  /** сторінка, де сталася подія */
  p: string;
  /** id реклами з data-ad, якщо подія в рекламному блоці */
  a?: string;
};

export async function record(ev: TrackEvent, visitor: string) {
  const day = kyivDay();
  const cmds: Cmd[] = [];
  const touch = (key: string) => cmds.push(["EXPIRE", key, TTL]);
  if (ev.t === "c" && ev.h) {
    cmds.push(["HINCRBY", `l:${day}`, ev.h, 1]);
    cmds.push(["HINCRBY", `lp:${day}`, `${ev.p}|${ev.h}`, 1]);
    touch(`l:${day}`);
    touch(`lp:${day}`);
  }
  if (ev.a) {
    const kind = ev.t === "v" ? "view" : "click";
    cmds.push(["HINCRBY", `a:${day}`, `${kind}|${ev.a}`, 1]);
    cmds.push(["PFADD", `au:${day}:${kind}:${ev.a}`, visitor]);
    touch(`a:${day}`);
    touch(`au:${day}:${kind}:${ev.a}`);
  }
  if (cmds.length) await redis(cmds);
}

/** Дні між from і to включно, YYYY-MM-DD. */
export function daysBetween(from: string, to: string): string[] {
  const out: string[] = [];
  const d = new Date(`${from}T12:00:00Z`);
  const end = new Date(`${to}T12:00:00Z`);
  while (d <= end && out.length < 400) {
    out.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return out;
}
