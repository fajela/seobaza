"use client";

import { useCallback, useId, useRef, useState } from "react";

/**
 * Слайдер порівняння двох зображень «до / після» (як Image Comparer у ComfyUI).
 * Ліве зображення (before) видно зліва від повзунка, праве (after) справа.
 * Працює мишею, пальцем і клавіатурою (стрілки, Home/End).
 * Без JS показує обидва зображення одне під одним (noscript-фолбек нижче).
 *
 * У MDX:
 *   <ImageCompare
 *     before="/images/articles/synthid/cover-synthid.jpg"
 *     after="/images/articles/synthid/cover-no-synthid.jpg"
 *     beforeLabel="З SynthID"
 *     afterLabel="Без SynthID"
 *     beforeAlt="..."
 *     afterAlt="..."
 *     caption="Підпис під слайдером"
 *   />
 */
export function ImageCompare({
  before,
  after,
  beforeAlt,
  afterAlt,
  beforeLabel = "До",
  afterLabel = "Після",
  caption,
  width,
  height,
}: {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  beforeLabel?: string;
  afterLabel?: string;
  caption?: string;
  /** Розміри оригіналу, щоб блок не стрибав при завантаженні. */
  width?: number;
  height?: number;
}) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const id = useId();

  const update = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    setPos((x / rect.width) * 100);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    update(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging.current) update(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - step));
    else if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + step));
    else if (e.key === "Home") setPos(0);
    else if (e.key === "End") setPos(100);
    else return;
    e.preventDefault();
  };

  const ratio = width && height ? `${width} / ${height}` : undefined;

  return (
    <figure className="not-prose my-8">
      <div
        ref={ref}
        className="relative w-full select-none overflow-hidden rounded-xl border border-border bg-secondary touch-none cursor-ew-resize"
        style={ratio ? { aspectRatio: ratio } : undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* Праве (after) лежить знизу на всю ширину */}
        <img
          src={after}
          alt={afterAlt}
          width={width}
          height={height}
          loading="lazy"
          draggable={false}
          className="block w-full h-auto"
        />
        {/* Ліве (before) зверху, обрізане по позиції повзунка */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          aria-hidden="true"
        >
          <img
            src={before}
            alt=""
            width={width}
            height={height}
            loading="lazy"
            draggable={false}
            className="block w-full h-auto"
          />
        </div>
        {/* Лінія і ручка */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-accent"
          style={{ left: `calc(${pos}% - 1px)` }}
          aria-hidden="true"
        />
        <button
          type="button"
          role="slider"
          aria-label={`Порівняння: ${beforeLabel} і ${afterLabel}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-describedby={caption ? `${id}-cap` : undefined}
          onKeyDown={onKeyDown}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-accent text-black shadow-lg flex items-center justify-center text-lg font-bold focus:outline-none focus:ring-4 focus:ring-accent/40"
          style={{ left: `${pos}%` }}
        >
          ⇔
        </button>
        <span className="absolute left-2 top-2 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold text-white">
          {beforeLabel}
        </span>
        <span className="absolute right-2 top-2 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold text-white">
          {afterLabel}
        </span>
      </div>
      <noscript>
        <img src={before} alt={beforeAlt} className="block w-full mt-2" />
      </noscript>
      {caption && (
        <figcaption
          id={`${id}-cap`}
          className="mt-2 text-sm text-muted-foreground text-center"
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
