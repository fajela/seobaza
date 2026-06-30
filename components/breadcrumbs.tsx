import Link from "next/link";

const BASE = "https://seobaza.com.ua";

export interface Crumb {
  name: string;
  /** Absolute path beginning with "/" (or a full URL). */
  href: string;
}

/**
 * Visible breadcrumb trail + schema.org BreadcrumbList microdata.
 * The last crumb is the current page (rendered as plain text, no link).
 * Matches the inline pattern used on detail pages (category/[slug] etc.).
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-8"
      itemScope
      itemType="https://schema.org/BreadcrumbList"
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        const abs = item.href.startsWith("http") ? item.href : `${BASE}${item.href}`;
        return (
          <span key={item.href} className="flex items-center gap-2">
            <span
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {isLast ? (
                <span itemProp="name" className="text-foreground">
                  {item.name}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-accent transition-colors">
                  <span itemProp="name">{item.name}</span>
                </Link>
              )}
              <link itemProp="item" href={abs} />
              <meta itemProp="position" content={String(i + 1)} />
            </span>
            {!isLast && <span aria-hidden="true">/</span>}
          </span>
        );
      })}
    </nav>
  );
}
