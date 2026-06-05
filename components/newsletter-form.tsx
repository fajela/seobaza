"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Props {
  /** "default" — boxed block with heading; "compact" — inline row (footer). */
  variant?: "default" | "compact";
  title?: string;
  description?: string;
  className?: string;
}

export function NewsletterForm({
  variant = "default",
  title = "Підпишіться на розсилку SEO BAZA",
  description = "Новини SEO, розбори та матеріали українською. Без спаму, відписатися можна будь-коли.",
  className = "",
}: Props) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setError("Введіть коректний email");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "");
      setStatus("success");
      setEmail("");
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Щось пішло не так. Спробуйте ще раз."
      );
      setStatus("error");
    }
  }

  const compact = variant === "compact";

  if (status === "success") {
    return (
      <div className={`${compact ? "" : "rounded-xl border border-border bg-secondary/30 p-6 text-center"} ${className}`}>
        <p className="font-display text-lg text-accent">Майже готово!</p>
        <p className="text-sm text-muted-foreground">
          Перевірте пошту і підтвердіть підписку.
        </p>
      </div>
    );
  }

  const form = (
    <form
      onSubmit={handleSubmit}
      className={compact ? "flex flex-col sm:flex-row gap-2 w-full max-w-md mx-auto" : "flex flex-col sm:flex-row gap-2"}
      noValidate
    >
      {/* Honeypot — hidden from users, catches bots */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="hidden"
        aria-hidden="true"
      />
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        aria-label="Email"
        className="flex-1 min-w-0 px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-6 py-3 rounded-lg bg-gradient-to-r from-accent to-primary text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 whitespace-nowrap"
      >
        {status === "loading" ? "Підписую…" : "Підписатися"}
      </button>
    </form>
  );

  if (compact) {
    return (
      <div className={className}>
        {title && <h2 className="text-xl font-display mb-2 text-center">{title}</h2>}
        {description && (
          <p className="text-sm text-muted-foreground mb-4 text-center max-w-md mx-auto">
            {description}
          </p>
        )}
        {form}
        {error && <p className="mt-2 text-sm text-red-500 text-center">{error}</p>}
      </div>
    );
  }

  return (
    <div className={`rounded-xl border border-border bg-secondary/30 p-6 ${className}`}>
      {title && <h2 className="text-2xl font-display mb-2">{title}</h2>}
      {description && <p className="text-muted-foreground mb-4">{description}</p>}
      {form}
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
