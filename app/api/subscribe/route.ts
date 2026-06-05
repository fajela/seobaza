import { NextResponse } from "next/server";

/**
 * Newsletter subscribe endpoint.
 *
 * Forwards the email to Kit (ConvertKit) via the v3 Forms API:
 *   POST https://api.convertkit.com/v3/forms/{FORM_ID}/subscribe
 *   body: { api_key, email }
 *
 * Credentials come from env (set in .env.local locally and in Vercel):
 *   CONVERTKIT_API_KEY  — account public API key (fajela.kit.com)
 *   CONVERTKIT_FORM_ID  — the dedicated SEO Baza form id
 *
 * If the Kit form has double opt-in enabled (default), this triggers the
 * confirmation email; the subscriber is only added after they confirm.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: { email?: string; website?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некоректний запит" }, { status: 400 });
  }

  // Honeypot: bots fill hidden "website" field. Pretend success, do nothing.
  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const email = (body.email || "").trim();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Введіть коректний email" }, { status: 400 });
  }

  const apiKey = process.env.CONVERTKIT_API_KEY;
  const formId = process.env.CONVERTKIT_FORM_ID;
  if (!apiKey || !formId) {
    return NextResponse.json(
      { error: "Підписка тимчасово недоступна" },
      { status: 503 }
    );
  }

  try {
    const res = await fetch(
      `https://api.convertkit.com/v3/forms/${formId}/subscribe`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: apiKey, email }),
      }
    );
    if (!res.ok) {
      return NextResponse.json(
        { error: "Не вдалося підписати. Спробуйте пізніше." },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Не вдалося підписати. Спробуйте пізніше." },
      { status: 502 }
    );
  }
}
