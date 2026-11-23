"use client";

import { useState } from "react";

// Promo code chip: one click copies the code. Used on /black-friday and in the
// Black Friday event .mdx pages (registered in app/events/[year]/[slug]).
export function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  function done() {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  // In-app browsers (Telegram, Instagram) often deny the async Clipboard API,
  // so fall back to a hidden textarea + execCommand("copy").
  function fallback() {
    const ta = document.createElement("textarea");
    ta.value = code;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, code.length);
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    document.body.removeChild(ta);
    if (ok) done();
  }

  function copy() {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(code).then(done).catch(fallback);
    } else {
      fallback();
    }
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
