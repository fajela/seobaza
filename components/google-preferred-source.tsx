/**
 * Google "Preferred sources" badge.
 * seobaza.com.ua was added to Google's preferred sources; this badge lets
 * readers add SEO BAZA as their preferred source in Google Search.
 * Docs: https://developers.google.com/search/docs/appearance/preferred-sources
 *
 * The badge art is Google's official Ukrainian asset and must not be altered,
 * so we ship it as a plain <img> (no Next.js optimization/recompression) and
 * swap light/dark versions via the `dark` class set by next-themes.
 */
export function GooglePreferredSource() {
  const href = "https://www.google.com/preferences/source?q=seobaza.com.ua";
  const alt = "Додати SEO BAZA як бажане джерело в Google";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-label={alt}
      className="inline-block transition-opacity hover:opacity-80"
    >
      {/* Light theme */}
      <img
        src="/images/google-preferred-source/light.png"
        srcSet="/images/google-preferred-source/light.png 1x, /images/google-preferred-source/light@2x.png 2x"
        alt={alt}
        width={169}
        height={53}
        className="block h-auto w-[169px] dark:hidden"
      />
      {/* Dark theme */}
      <img
        src="/images/google-preferred-source/dark.png"
        srcSet="/images/google-preferred-source/dark.png 1x, /images/google-preferred-source/dark@2x.png 2x"
        alt={alt}
        width={169}
        height={53}
        className="hidden h-auto w-[169px] dark:block"
      />
    </a>
  );
}
