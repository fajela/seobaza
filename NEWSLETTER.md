# Newsletter — how the SEO Baza email signup works

The site collects newsletter subscribers and sends via **Kit (ConvertKit)**.

## Code
- `components/newsletter-form.tsx` — the styled signup form (client). Variants: `default` (boxed) and `compact` (footer). Honeypot + email validation + success/error states.
- `app/api/subscribe/route.ts` — server route. Validates the email, then calls Kit v3 `POST https://api.convertkit.com/v3/forms/{FORM_ID}/subscribe` with `{ api_key, email }`. Honeypot field `website` is silently dropped.
- Placements: footer (`app/layout.tsx`), end of `/articles/[slug]` and `/knowledge-base/[slug]`, and the `/newsletter` landing page. Nav + footer link to `/newsletter`.

## Env vars (required)
Set in `.env.local` (local) **and** Vercel → Project → Settings → Environment Variables (Production):

```
CONVERTKIT_API_KEY=<Kit account public API key>
CONVERTKIT_FORM_ID=<numeric id of the "SEO Baza Newsletter" form>
```

Notes:
- The route returns `503` if either var is missing — so set them in Vercel **before** deploying, and remember env changes only apply to **new** deployments.
- The Kit embed `data-uid` (e.g. `3444eb5578`) is NOT the numeric form id the v3 API needs. Get the numeric id from `GET https://api.convertkit.com/v3/forms?api_key=<key>` (match by `uid`).

## Sending / receiving on the seo-baza.com.ua domain (optional, Kit + DNS)
The on-site form works without any of this. Domain email only affects the *emails* Kit sends/receives:
- **Send branded** from `@seo-baza.com.ua`: set up a Kit Verified Sending Domain (DKIM/SPF CNAMEs at the domain). No per-address confirmation needed once verified.
- **Receive replies**: ImprovMX free forwarding (MX `mx1/mx2.improvmx.com` + SPF TXT), alias forwards to a real inbox.
- **Redirect** `seo-baza.com.ua` → `seobaza.com.ua`: done via Vercel (add the domain to the project, set to Redirect 308) — not via a DNS record. `@` A `216.198.79.1`, `www` CNAME to the Vercel-provided host.

Gotcha: a registrar "parking page" can force its own MX and ignore custom MX until the domain is pointed at a real IP.
