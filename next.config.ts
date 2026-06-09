import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/news/2026/06/dmytro-bondar-boosta-pro-realnyi-stan-seo-1645",
        destination: "/news/2026/06/dmytro-bondar-boosta-pro-realnyi-stan-seo-1646",
        permanent: true,
      },
      {
        // Reclassified from /articles to /news (it's a news item, NewsArticle schema).
        source: "/articles/google-pochav-indeksuvaty-profili-vydavtsiv-publisher-profiles",
        destination: "/news/2026/06/google-tykho-buduie-profili-vydavtsiv-i-vony-pochaly-potraplia-1660",
        permanent: true,
      },
      {
        // Convenience alias → evergreen Black Friday page. Server-side 308, so the
        // browser never renders /events/black-friday (no 404, zero layout shift).
        // The SEO canonical still lives on /black-friday.
        source: "/events/black-friday",
        destination: "/black-friday",
        permanent: true,
      },
    ];
  },
  async headers() {
    // Заборона вбудовування сайту в чужі iframe (захист від clickjacking і від
    // piggyback на referrer-обмежений Google API-ключ через сторонній iframe).
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "seobaza.com.ua",
      },
    ],
  },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  // Simplified config for Next.js 16 compatibility
});

export default withMDX(nextConfig);
