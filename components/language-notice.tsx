import Link from "next/link";

/**
 * Notice shown at the top of every English page: the Ukrainian version is the
 * primary one. This is also the only language switcher on the site — English
 * pages link to Ukrainian, Ukrainian pages don't link back (the EN versions
 * exist for crawlers, not for navigation).
 */
export function UkrainianPrimaryNotice({ ukPath }: { ukPath: string }) {
  return (
    <div
      lang="en"
      className="mb-8 rounded-xl border border-accent/40 bg-accent/5 px-4 py-3 text-sm"
    >
      The primary version of this page is in Ukrainian. This English version is
      provided for reference; if the two differ, the Ukrainian text prevails.{" "}
      <Link
        href={ukPath}
        hrefLang="uk"
        className="font-medium text-primary underline hover:text-accent transition-colors"
      >
        Читати українською →
      </Link>
    </div>
  );
}
