import type { Metadata } from "next";
import { Open_Sans, Proza_Libre } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";

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
  authors: [{ name: "Olesia Korobka", url: "https://olesiakorobka.com" }],
  creator: "Olesia Korobka",
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
        url: "https://seobaza.com.ua/seobaza.png",
        width: 1200,
        height: 630,
        alt: "SEO BAZA logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SEO BAZA - українська SEO-спільнота",
    description:
      "Ресурс з SEO з новинами, учбовими матеріалами, відео-каналом і телеграм-каналом",
    images: ["https://seobaza.com.ua/seobaza.png"],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["WebSite", "Organization"],
              name: "SEO BAZA",
              url: "https://seobaza.com.ua/",
              description:
                "Ресурс з SEO з новинами, учбовими матеріалами, відео-каналом і телеграм-каналом",
              logo: "https://seobaza.com.ua/seobaza.png",
              sameAs: [
                "https://www.youtube.com/c/SEOBAZA",
                "https://t.me/SEOBAZA",
              ],
              creator: {
                "@type": "Person",
                name: "Olesia Korobka",
                url: "https://olesiakorobka.com",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${openSans.variable} ${prozaLibre.variable} antialiased min-h-screen flex flex-col`}
        vocab="https://schema.org/"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <Navigation />
          <main className="flex-1 pt-16">{children}</main>
          <footer className="border-t border-border bg-muted/30 transition-theme">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center">
                <h2 className="text-xl font-display mb-4">Ми в соцмережах</h2>
                <div className="flex justify-center space-x-6 mb-6">
                  <a
                    rel="external noopener"
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
                    rel="external noopener"
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
                </div>
                <p className="text-sm text-muted-foreground">
                  Зроблено з{" "}
                  <span className="text-red-500" aria-label="love">
                    ♥
                  </span>{" "}
                  для української SEO-спільноти
                  <span
                    property="dc:creator"
                    className="hidden"
                    itemProp="creator"
                    itemScope
                    itemType="https://schema.org/Person"
                  >
                    <link
                      itemProp="url"
                      href="https://olesiakorobka.com"
                    />
                    <meta itemProp="name" content="Olesia Korobka" />
                  </span>
                </p>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
