"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Анонімний лічильник для /stats: кліки по всіх посиланнях сайту і покази
 * рекламних блоків (елементи з атрибутом data-ad="<id>").
 * Показ рахуємо, коли блок щонайменше наполовину на екрані одну секунду,
 * один раз на перегляд сторінки. Події йдуть на /api/t через sendBeacon,
 * тому перехід за посиланням не гальмує.
 */

function send(payload: Record<string, string | undefined>) {
  const body = JSON.stringify(payload);
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/t", new Blob([body], { type: "text/plain" }));
  } else {
    fetch("/api/t", { method: "POST", body, keepalive: true }).catch(() => {});
  }
}

/** Внутрішні посилання зберігаємо як шлях, зовнішні як повну адресу без #. */
function normalize(a: HTMLAnchorElement): string | undefined {
  const raw = a.getAttribute("href");
  if (!raw || raw.startsWith("#") || raw.startsWith("javascript:")) return undefined;
  try {
    const u = new URL(a.href, location.href);
    if (u.protocol === "mailto:" || u.protocol === "tel:") return u.href;
    u.hash = "";
    if (u.host === location.host) return u.pathname + u.search;
    return u.href;
  } catch {
    return undefined;
  }
}

/** Текст, на який натиснули: видимий текст, або alt картинки, або aria-label. */
function linkText(a: HTMLAnchorElement): string | undefined {
  const t =
    a.innerText ||
    a.querySelector("img")?.getAttribute("alt") ||
    a.getAttribute("aria-label") ||
    a.getAttribute("title") ||
    "";
  const clean = t.replace(/\s+/g, " ").trim();
  return clean ? clean.slice(0, 100) : undefined;
}

export function LinkTracker() {
  const pathname = usePathname() ?? "/";

  // Кліки: один слухач на весь документ, включно з кліком колесом (нова вкладка).
  useEffect(() => {
    if (pathname.startsWith("/stats")) return;
    const onClick = (e: MouseEvent) => {
      if (e.type === "auxclick" && e.button !== 1) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const h = normalize(a);
      if (!h) return;
      const ad = (a.closest("[data-ad]") as HTMLElement | null)?.dataset.ad;
      send({ t: "c", h, p: location.pathname, a: ad, x: linkText(a) });
    };
    document.addEventListener("click", onClick, true);
    document.addEventListener("auxclick", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("auxclick", onClick, true);
    };
  }, [pathname]);

  // Покази рекламних блоків, заново на кожну сторінку.
  useEffect(() => {
    if (pathname.startsWith("/stats") || !("IntersectionObserver" in window)) return;
    const seen = new WeakSet<Element>();
    const timers = new Map<Element, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          const el = en.target as HTMLElement;
          if (seen.has(el)) continue;
          if (en.isIntersecting && en.intersectionRatio >= 0.5) {
            if (!timers.has(el)) {
              timers.set(
                el,
                window.setTimeout(() => {
                  seen.add(el);
                  io.unobserve(el);
                  send({ t: "v", p: location.pathname, a: el.dataset.ad });
                }, 1000),
              );
            }
          } else if (timers.has(el)) {
            clearTimeout(timers.get(el));
            timers.delete(el);
          }
        }
      },
      { threshold: [0, 0.5, 1] },
    );
    const scan = () =>
      document.querySelectorAll<HTMLElement>("[data-ad]").forEach((el) => {
        if (!seen.has(el)) io.observe(el);
      });
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      io.disconnect();
      timers.forEach((t) => clearTimeout(t));
    };
  }, [pathname]);

  return null;
}
