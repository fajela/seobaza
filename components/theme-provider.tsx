"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";
import { useEffect } from "react";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  useEffect(() => {
    // Sync theme changes to cookies for SSR
    const syncTheme = () => {
      const theme = localStorage.getItem('theme') || 'system';
      document.cookie = `theme=${theme}; path=/; max-age=31536000`; // 1 year
    };

    syncTheme();
    window.addEventListener('storage', syncTheme);

    return () => window.removeEventListener('storage', syncTheme);
  }, []);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
