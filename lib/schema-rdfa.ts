/**
 * Helpers to build small JSX fragments that emit schema.org structured data
 * using **RDFa Lite** attributes (vocab / typeof / property / resource).
 *
 * Why RDFa instead of JSON-LD: matches the existing pattern on this site
 * (events MDX already uses `vocab="https://schema.org/"`, the footer uses
 * microdata, and the user explicitly chose RDF over JSON-LD).
 *
 * Microdata (itemscope / itemprop) is used only for breadcrumbs — see the
 * <BreadcrumbList> JSX where it's inlined directly (microdata is the
 * historically dominant choice for breadcrumb rich results).
 */

/** Convert YYYY-MM-DD or full ISO to a clean ISO 8601 date. */
export function isoDate(d: string | undefined): string {
  if (!d) return new Date().toISOString();
  try {
    return new Date(d).toISOString();
  } catch {
    return new Date().toISOString();
  }
}

export interface BreadcrumbCrumb {
  name: string;
  url: string;
}

/**
 * Render breadcrumbs as visible HTML AND as microdata BreadcrumbList.
 * The visible part is whatever you want; the microdata <meta itemprop="…">
 * lives inside the same wrapper so Google can crawl it.
 *
 * Usage pattern in a page:
 *   <nav itemScope itemType="https://schema.org/BreadcrumbList">
 *     {crumbs.map((c, i) => (
 *       <span key={c.url} itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
 *         <Link itemProp="item" href={c.url}><span itemProp="name">{c.name}</span></Link>
 *         <meta itemProp="position" content={String(i + 1)} />
 *       </span>
 *     ))}
 *   </nav>
 */
