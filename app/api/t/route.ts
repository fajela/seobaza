import { record, trackingEnabled, visitorHash, kyivDay, type TrackEvent } from "@/lib/track-store";

/**
 * Приймає події лічильника від components/link-tracker.tsx (navigator.sendBeacon).
 * Ботів і запити з чужих сайтів відкидаємо. Завжди відповідаємо 204.
 */

const BOT_RE = /bot|crawl|spider|slurp|headless|preview|lighthouse|facebookexternalhit|embedly|whatsapp|telegram/i;
const ALLOWED_HOSTS = new Set(["seobaza.com.ua", "www.seobaza.com.ua", "localhost"]);

const clean = (s: unknown, max: number) =>
  typeof s === "string" ? s.replace(/[\r\n\t]/g, " ").slice(0, max) : undefined;

export async function POST(req: Request) {
  const done = new Response(null, { status: 204 });
  if (!trackingEnabled) return done;

  const ua = req.headers.get("user-agent") ?? "";
  if (!ua || BOT_RE.test(ua)) return done;

  const origin = req.headers.get("origin") ?? req.headers.get("referer") ?? "";
  try {
    if (!ALLOWED_HOSTS.has(new URL(origin).hostname)) return done;
  } catch {
    return done;
  }

  let body: Partial<TrackEvent> = {};
  try {
    body = JSON.parse(await req.text());
  } catch {
    return done;
  }
  const ev: TrackEvent = {
    t: body.t === "v" ? "v" : "c",
    h: clean(body.h, 300),
    p: clean(body.p, 200) ?? "/",
    a: clean(body.a, 80),
  };
  if (ev.p.startsWith("/stats")) return done;
  if (ev.t === "v" && !ev.a) return done;

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim();
  try {
    await record(ev, await visitorHash(ip, ua, kyivDay()));
  } catch (e) {
    console.error("track", e);
  }
  return done;
}
