"use client";

import { useState } from "react";

// Promo code chip: one click copies the code. Used on /black-friday and in the
// Black Friday event .mdx pages (registered in app/events/[year]/[slug]).
export function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => {});
  }

  return (
    <button
      type="button"
      onClick={copy}
      title="Скопіювати промокод"
      className="inline-flex items-center gap-2 align-middle px-3 py-1 rounded-lg border-2 border-dashed border-accent bg-background font-mono font-semibold hover:bg-accent/10 transition-colors"
    >
      <span>{code}</span>
      <span className="text-xs font-sans font-normal text-muted-foreground">
        {copied ? "✓ скопійовано" : "копіювати"}
      </span>
    </button>
  );
}
