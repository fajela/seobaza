// Сайти Олесі Коробки: посилання на них передають вагу, тому без nofollow
// (рішення Олесі 25.10.2026). Решта зовнішніх посилань: nofollow.
export const OWN_DOMAINS = [
  "fajela.com",
  "whitelobby.com",
  "casinofinder.ai",
  "casinolicensecheck.com",
  "seocharity.com",
  "olesiakorobka.com",
  "profirem.ua",
  "profirem.com.ua",
];

export function isOwnSite(url: string): boolean {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return OWN_DOMAINS.some((d) => host === d || host.endsWith(`.${d}`));
  } catch {
    return false;
  }
}

/** rel для зовнішнього посилання: свої сайти без nofollow, решта з nofollow. */
export function externalRel(url: string | undefined): string {
  return url && isOwnSite(url) ? "noopener" : "nofollow noopener";
}
