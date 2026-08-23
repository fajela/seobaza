"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Bump the id when the announced thing changes — a new id shows the bar again
// to everyone, even those who dismissed the previous one.
const STORAGE_KEY = "announcement-dismissed:boost360-2026";

/**
 * Slim, dismissible announcement strip under the header. Promotes the current
 * headline event. Dismissal is remembered per-browser (localStorage).
 */
export function AnnouncementBar() {
  // Visible by default (so it renders in SSR); hide only if this browser
  // already dismissed it.
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "1") setHidden(true);
  }, []);

  if (hidden) return null;

  return (
    <div className="relative bg-primary text-background">
      <Link
        href="/events/2026/boost360-seo-edition-2026"
        className="block px-10 py-2 text-center text-sm font-medium hover:underline"
      >
        🇺🇦 Boost360° SEO Edition · благодійна онлайн-конференція · 16 вересня 2026.{" "}
        <span className="whitespace-nowrap">Деталі →</span>
      </Link>
      <button
        type="button"
        onClick={() => {
          localStorage.setItem(STORAGE_KEY, "1");
          setHidden(true);
        }}
        aria-label="Сховати анонс"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-background/80 hover:text-background hover:bg-background/10 transition-colors"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
