import type { Metadata } from "next";
import Link from "next/link";
import { Open_Sans, Proza_Libre } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import { Analytics } from "@/components/analytics";
import { FooterNewsletter } from "@/components/footer-newsletter";
import { StickyNewsletter } from "@/components/sticky-newsletter";
import { GooglePreferredSource } from "@/components/google-preferred-source";

const openSans = Open_Sans({
  subsets: ["latin", "cyrillic"],
  variable: "--font-open-sans",
  display: "swap",
});

const prozaLibre = Proza_Libre({
  subsets: ["latin", "latin-ext"],
  weight: ["700"],
  variable: "--font-proza-libre",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SEO BAZA - українська SEO-спільнота",
  description:
    "Ресурс з SEO з новинами, учбовими матеріалами, відео-каналом і телеграм-каналом. І найкращою в світі спільнотою!",
  keywords: ["SEO", "Ukrainian SEO", "SEO community", "SEO Ukraine", "digital marketing"],
  authors: [{ name: "Олеся Коробка", url: "https://olesiakorobka.com" }],
  creator: "Олеся Коробка",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/seobaza.png",
  },
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: "https://seobaza.com.ua/",
    title: "SEO BAZA - українська SEO-спільнота",
    description:
      "Ресурс з SEO з новинами, учбовими матеріалами, відео-каналом і телеграм-каналом",
    siteName: "SEO BAZA",
    images: [
      {
        url: "https://seobaza.com.ua/og-image.png",
        width: 640,
        height: 640,
        alt: "SEO BAZA logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SEO BAZA - українська SEO-спільнота",
    description:
      "Ресурс з SEO з новинами, учбовими матеріалами, відео-каналом і телеграм-каналом",
    images: ["https://seobaza.com.ua/og-image.png"],
  },
  alternates: {
    canonical: "https://seobaza.com.ua/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uk"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = document.cookie.match(/theme=([^;]+)/)?.[1] ||
                              localStorage.getItem('theme') ||
                              'system';
                  if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                  } else {
                    document.documentElement.style.colorScheme = 'light';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        {/* WebSite + Organization JSON-LD lives on the homepage only, see app/page.tsx */}
      </head>
      <body
        className={`${openSans.variable} ${prozaLibre.variable} antialiased min-h-screen flex flex-col`}
      >
        <Analytics />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <Navigation />
          <main className="flex-1 pt-16">
            {children}
          </main>
          <StickyNewsletter />
          <footer className="border-t border-border bg-muted/30 transition-theme">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Newsletter signup (hidden on pages that already have a form) */}
              <FooterNewsletter />

              {/* Footer link rows — keeps /tags, /authors, /sitemap-page reachable
                  from every page so crawlers don't see them as orphans. */}
              <nav
                aria-label="Footer"
                className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-6"
              >
                <Link href="/newsletter" className="hover:text-accent transition-colors">
                  Розсилка
                </Link>
                <Link href="/about" className="hover:text-accent transition-colors">
                  Про нас
                </Link>
                <Link href="/contact" className="hover:text-accent transition-colors">
                  Контакт
                </Link>
                <Link href="/sponsors" className="hover:text-accent transition-colors">
                  Спонсорам
                </Link>
                <Link href="/jobs" className="hover:text-accent transition-colors">
                  Вакансії
                </Link>
                <Link href="/category" className="hover:text-accent transition-colors">
                  Категорії
                </Link>
                <Link href="/tags" className="hover:text-accent transition-colors">
                  Теги
                </Link>
                <Link href="/authors" className="hover:text-accent transition-colors">
                  Автори
                </Link>
                <Link href="/sitemap-page" className="hover:text-accent transition-colors">
                  Карта сайту
                </Link>
              </nav>
              <div className="text-center">
                <h2 className="text-xl font-display mb-4">SEO BAZA в соцмережах</h2>
                <div className="flex justify-center space-x-6 mb-6">
                  <a

                    href="https://www.youtube.com/c/SEOBAZA"
                    target="_blank"
                    className="text-foreground hover:text-accent transition-colors"
                    aria-label="YouTube"
                  >
                    <svg
                      className="w-8 h-8"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                  <a

                    href="https://t.me/SEOBAZA"
                    target="_blank"
                    className="text-foreground hover:text-accent transition-colors"
                    aria-label="Telegram"
                  >
                    <svg
                      className="w-8 h-8"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.linkedin.com/company/seo-baza/"
                    target="_blank"
                    className="text-foreground hover:text-accent transition-colors"
                    aria-label="LinkedIn"
                  >
                    <svg
                      className="w-8 h-8"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0h.002z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.facebook.com/groups/seobaza/"
                    target="_blank"
                    className="text-foreground hover:text-accent transition-colors"
                    aria-label="Facebook"
                  >
                    <svg
                      className="w-8 h-8"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.instagram.com/seobaza/"
                    target="_blank"
                    className="text-foreground hover:text-accent transition-colors"
                    aria-label="Instagram"
                  >
                    <svg
                      className="w-8 h-8"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.threads.com/@seobaza"
                    target="_blank"
                    className="text-foreground hover:text-accent transition-colors"
                    aria-label="Threads"
                  >
                    <svg
                      className="w-8 h-8"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.781 3.631 2.695 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.362-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32l-1.756-1.194c.98-1.453 2.572-2.221 4.493-2.221h.04c3.211.02 5.123 1.99 5.313 5.426.108.046.215.094.32.143 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.018-11.825c-.355 0-.715.014-1.082.044-1.302.094-2.116.83-2.043 1.842.06.83.94 1.342 2.04 1.342.078 0 .156-.003.234-.008 1.62-.117 2.49-1.106 2.674-2.99a8.5 8.5 0 0 0-1.823-.23Z" />
                    </svg>
                  </a>
                </div>
                <div className="mb-6 flex justify-center">
                  <GooglePreferredSource />
                </div>
                <p className="text-sm text-muted-foreground">
                  Зроблено з{" "}
                  <span className="text-red-500" aria-label="love">
                    ♥
                  </span>{" "}
                  для української SEO-спільноти
                </p>
                <nav
                  aria-label="Правова інформація"
                  className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground mt-6"
                >
                  <Link href="/transparency" className="hover:text-accent transition-colors">
                    Прозорість
                  </Link>
                  <Link href="/privacy" className="hover:text-accent transition-colors">
                    Конфіденційність
                  </Link>
                  <Link href="/terms" className="hover:text-accent transition-colors">
                    Умови
                  </Link>
                </nav>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
