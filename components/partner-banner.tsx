import { PARTNER, type Partner } from "@/lib/partner";

/**
 * Банер партнера місяця. Від 640px широкий креатив 3:1 768px завширшки (висота 256), на мобільних 300×250.
 * Якщо є варіанти для нічного режиму, у темі .dark показуємо їх.
 * Без партнера (PARTNER = null) нічого не рендерить.
 */
export function PartnerBanner({ className = "" }: { className?: string }) {
  if (!PARTNER) return null;
  const p = PARTNER;
  return (
    <aside
      aria-label="Партнер місяця"
      // id для лічильника показів і кліків (/stats)
      data-ad={`partner:${p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`}
      // Рекламний текст не має потрапляти у сніпети і витяги для AI-відповідей.
      data-nosnippet=""
      className={`not-prose ${className}`}
    >
      <a
        href={p.url}
        target="_blank"
        rel="sponsored nofollow noopener"
        className="block mx-auto max-w-[300px] sm:max-w-[768px] rounded-xl overflow-hidden border border-border hover:border-accent/50 transition-colors"
      >
        {p.wideDark || p.squareDark ? (
          <>
            <Creative wide={p.wide} square={p.square} alt={p.alt} className="dark:hidden" />
            <Creative
              wide={p.wideDark ?? p.wide}
              square={p.squareDark ?? p.square}
              alt={p.alt}
              className="hidden dark:block"
            />
          </>
        ) : (
          <Creative wide={p.wide} square={p.square} alt={p.alt} />
        )}
      </a>
    </aside>
  );
}

function Creative({
  wide,
  square,
  alt,
  className = "",
}: {
  wide: Partner["wide"];
  square: Partner["square"];
  alt: string;
  className?: string;
}) {
  return (
    <picture className={className}>
      <source media="(min-width: 640px)" srcSet={wide.src} width={wide.width} height={wide.height} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={square.src} alt={alt} width={square.width} height={square.height} className="block w-full h-auto" />
    </picture>
  );
}
