"use client";

import { useState } from "react";

export function Carousel({ srcs, alt = "" }: { srcs: string; alt?: string }) {
  const list = (srcs || "")
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
  const [i, setI] = useState(0);
  if (list.length === 0) return null;
  const n = list.length;
  const go = (d: number) => setI((p) => (p + d + n) % n);

  return (
    <figure className="my-6">
      <div className="relative mx-auto w-fit max-w-full overflow-hidden rounded-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={list[i]}
          alt={`${alt} ${i + 1} з ${n}`.trim()}
          loading="lazy"
          decoding="async"
          className="mx-auto block h-auto max-h-[80vh] w-auto max-w-full"
        />
        {n > 1 && (
          <>
            <button
              type="button"
              aria-label="Попереднє зображення"
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 px-3 py-2 text-lg leading-none text-white transition-colors hover:bg-black/80"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Наступне зображення"
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 px-3 py-2 text-lg leading-none text-white transition-colors hover:bg-black/80"
            >
              ›
            </button>
            <span className="absolute bottom-2 right-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">
              {i + 1} / {n}
            </span>
          </>
        )}
      </div>
      {n > 1 && (
        <div className="mt-3 flex items-center justify-center gap-2">
          {list.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Слайд ${idx + 1}`}
              onClick={() => setI(idx)}
              className={`h-2 w-2 rounded-full transition-colors ${
                idx === i ? "bg-gray-800 dark:bg-gray-200" : "bg-gray-300 dark:bg-gray-600"
              }`}
            />
          ))}
        </div>
      )}
    </figure>
  );
}
