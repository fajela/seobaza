"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const STORAGE_KEY = "sticky-newsletter-dismissed";

/**
 * Evergreen sticky bar pinned to the bottom of the viewport, promoting the
 * newsletter. Dismissible (remembered per-browser). Hidden on the pages that
 * already show a signup form, to avoid two asks on one screen.
 */
export function StickyNewsletter() {
  const pathname = usePathname();
  // Visible by default (renders in SSR); hide only if dismissed in this browser.
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "1") setHidden(true);
  }, []);

  const onFormPage =
    pathname === "/newsletter" ||
    pathname.startsWith("/articles/") ||
    pathname.startsWith("/knowledge-base/");

  if (hidden || onFormPage) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-lg">
      <div className="container mx-auto flex items-center justify-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <p className="text-sm text-foreground">
          <span className="hidden sm:inline">📬 </span>
          Новини SEO українською раз на тиждень.
        </p>
        <Link
          href="/newsletter"
          className="shrink-0 rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-background hover:bg-accent/90 transition-colors"
        >
          Підписатися
        </Link>
        <button
          type="button"
          onClick={() => {
            localStorage.setItem(STORAGE_KEY, "1");
            setHidden(true);
          }}
          aria-label="Сховати"
          className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
