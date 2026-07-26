import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "SEO BAZA - українська SEO-спільнота",
  description: "Ресурс з SEO з новинами, учбовими матеріалами, відео-каналом і телеграм-каналом. І найкращою в світі спільнотою!",
  keywords: ["SEO", "Україна", "маркетинг", "оптимізація", "Google"],
  authors: [{ name: "Olesia Korobka", url: "https://olesiakorobka.com" }],
  openGraph: {
    title: "SEO BAZA - українська SEO-спільнота",
    description: "Ресурс з SEO з новинами, учбовими матеріалами, відео-каналом і телеграм-каналом",
    url: "https://seobaza.com.ua",
    siteName: "SEO BAZA",
    locale: "uk_UA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className="dark:[color-scheme:dark]">
      <head>
        <link rel="icon" href="https://seobaza.com.ua/seobaza.png" type="image/png" />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-white dark:bg-black text-gray-900 dark:text-gray-100">
        <Header />
        <main className="flex-1 w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
