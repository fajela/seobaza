"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * Перемикач теми з двома видимими станами. Зберігаємо вибір, тільки коли він
 * відрізняється від системної теми. Якщо людина повертає ту саму тему, що й
 * у системі, сайт знову йде за системним налаштуванням.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        className="p-2 rounded-lg hover:bg-secondary transition-colors"
        aria-label="Перемкнути тему"
      >
        <div className="w-5 h-5" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    const target = isDark ? "light" : "dark";
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    const newTheme = target === systemTheme ? "system" : target;
    setTheme(newTheme);
    // Immediately sync to cookie for SSR
    document.cookie = `theme=${newTheme}; path=/; max-age=31536000`;
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-secondary transition-colors group"
      aria-label={isDark ? "Увімкнути світлу тему" : "Увімкнути темну тему"}
    >
      {isDark ? (
        <svg
          className="w-5 h-5 text-foreground group-hover:text-accent transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg
          className="w-5 h-5 text-foreground group-hover:text-accent transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
}
