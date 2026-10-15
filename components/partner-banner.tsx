import { PARTNER } from "@/lib/partner";

/**
 * Банер партнера місяця. Від 640px широкий креатив 3:1 768px завширшки (висота 256), на мобільних 300×250.
 * Без партнера (PARTNER = null) нічого не рендерить.
 */
export function PartnerBanner({ className = "" }: { className?: string }) {
  if (!PARTNER) return null;
  const p = PARTNER;
  return (
    <aside
      aria-label="Партнер місяця"
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
        <picture>
          <source
            media="(min-width: 640px)"
            srcSet={p.wide.src}
            width={p.wide.width}
            height={p.wide.height}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.square.src}
            alt={p.alt}
            width={p.square.width}
            height={p.square.height}
            className="block w-full h-auto"
          />
        </picture>
      </a>
    </aside>
  );
}
