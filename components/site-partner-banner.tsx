"use client";

import { usePathname } from "next/navigation";
import { PartnerBanner } from "./partner-banner";

/**
 * Банер партнера місяця під меню на всіх сторінках сайту.
 * На сторінках матеріалів (новина, стаття, відео, база знань) банер стоїть
 * усередині тексту після вступу, тому тут його не дублюємо.
 */
const IN_CONTENT = /^\/(news\/\d{4}\/[^/]+\/[^/]+|articles\/[^/]+|videos\/[^/]+|knowledge-base\/[^/]+)\/?$/;

export function SitePartnerBanner() {
  const pathname = usePathname() ?? "";
  if (IN_CONTENT.test(pathname)) return null;
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      <PartnerBanner />
    </div>
  );
}
