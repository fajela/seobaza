"use client";

import { useEffect, useRef } from "react";

export function TelegramWidget() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing content
    containerRef.current.innerHTML = "";

    // Create script element
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-post", "SEOBAZA/1256");
    script.setAttribute("data-width", "100%");
    script.async = true;

    containerRef.current.appendChild(script);

    return () => {
      // Cleanup on unmount
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <>
      <div ref={containerRef} />
      <noscript>
        <a
          href="https://t.me/SEOBAZA/1256"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center p-8 bg-secondary rounded-lg hover:bg-muted transition-colors"
        >
          Переглянути пост в Telegram
        </a>
      </noscript>
    </>
  );
}
