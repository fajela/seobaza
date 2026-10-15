/**
 * Партнер місяця: банерний ексклюзив на сайті.
 * Один партнер на період. Щоб зняти банер, поставити PARTNER = null.
 * Поки PARTNER не null, синя смуга анонсу і LiveBanner у статтях вимкнені.
 * Угода й матеріали: C:\seobaza\sponsors\<папка>\README.md
 */
export type Partner = {
  name: string;
  /** Куди веде банер (з міткою рекламодавця, не вигадувати). */
  url: string;
  /** Широкий креатив для екранів від 640px, шлях у public. */
  wide: { src: string; width: number; height: number };
  /** Креатив 300×250 для мобільних, шлях у public. */
  square: { src: string; width: number; height: number };
  alt: string;
  /** Період угоди, для довідки: банер сам не вимикається. */
  from: string;
  to: string;
};

export const PARTNER: Partner | null = {
  name: "Phoenix Project",
  url: "https://t.me/phoenixprojectsale_bot?start=seobaza",
  wide: { src: "/images/sponsors/phoenix-project-wide.jpg", width: 1940, height: 647 },
  square: { src: "/images/sponsors/phoenix-project-square.jpg", width: 600, height: 500 },
  alt: "Phoenix Project: лінкбілдинг під нішу й гео, стратегія, майданчики та розміщення",
  from: "2026-10-16",
  to: "2026-11-15",
};
