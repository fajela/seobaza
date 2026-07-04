import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import { REDIRECTS } from "./lib/redirects";

const nextConfig: NextConfig = {
  async redirects() {
    return REDIRECTS;
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
