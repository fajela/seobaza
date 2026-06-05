"use client";

import { usePathname } from "next/navigation";
import { NewsletterForm } from "./newsletter-form";

/**
 * Footer newsletter block. Rendered site-wide EXCEPT on pages that already
 * show a dedicated newsletter form (the /newsletter page and the end-of-article
 * forms on /articles/* and /knowledge-base/*), to avoid two signup forms on one page.
 */
export function FooterNewsletter() {
  const pathname = usePathname();

  const alreadyHasForm =
    pathname === "/newsletter" ||
    pathname.startsWith("/articles/") ||
    pathname.startsWith("/knowledge-base/");

  if (alreadyHasForm) return null;

  return (
    <div className="max-w-xl mx-auto mb-10 pb-8 border-b border-border">
      <NewsletterForm variant="compact" />
    </div>
  );
}
