"use client";

import { useState } from "react";

/**
 * KgProfileTool — вбудований у статтю інтерактивний інструмент.
 *
 * Дозволяє знайти сутність у Google Knowledge Graph за назвою (або вставити
 * готовий KGMID) і згенерувати посилання на Google Search Profile
 * (https://profile.google.com/cp/{TOKEN}).
 *
 * Логіка кодування KGMID → Profile URL:
 *   байти = [0x0a, довжина_KGMID] + UTF-8(KGMID)  →  Base64  →  /cp/{Base64}
 *
 * Пошук сутностей працює на тому ж русі, що й тулза Fajela:
 * https://app.fajela.com/kg-search/
 */

// Окремий публічний ключ KG Search API для seobaza, обмежений по HTTP-реферерам
// на домени seobaza в Google Cloud Console.
const API_KEY = "AIzaSyBMjqWFtvGLLTVriVozZaifDXxahGad1i8";

interface KgEntity {
  name: string;
  kgmid: string;
  types: string[];
  description: string;
  image: string;
  score: number;
}

function profileUrlFromKgmid(kgmid: string): string {
  const id = kgmid.trim();
  // UTF-8 байти KGMID
  const idBytes = new TextEncoder().encode(id);
  // [0x0a (тег поля 1), довжина рядка, ...байти KGMID]
  const bytes = new Uint8Array(idBytes.length + 2);
  bytes[0] = 0x0a;
  bytes[1] = idBytes.length;
  bytes.set(idBytes, 2);
  // Base64
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  const b64 = typeof window !== "undefined" ? window.btoa(binary) : "";
  return `https://profile.google.com/cp/${b64}`;
}

function parseItem(item: {
  result?: {
    name?: string;
    "@id"?: string;
    "@type"?: string[];
    description?: string;
    detailedDescription?: { articleBody?: string };
    image?: { contentUrl?: string };
  };
  resultScore?: number;
}): KgEntity {
  const res = item.result || {};
  return {
    name: res.name || "(без назви)",
    kgmid: res["@id"] ? res["@id"].replace("kg:", "") : "",
    types: (res["@type"] || [])
      .map((t) => t.replace("schema:", ""))
      .filter((t) => t !== "Thing"),
    description: res.detailedDescription?.articleBody || res.description || "",
    image: res.image?.contentUrl || "",
    score: item.resultScore || 0,
  };
}

export function KgProfileTool() {
  const [mode, setMode] = useState<"name" | "kgmid">("name");
  const [query, setQuery] = useState("");
  const [kgmidInput, setKgmidInput] = useState("/g/11f2bzkqxz");
  const [results, setResults] = useState<KgEntity[]>([]);
  const [directUrl, setDirectUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [copied, setCopied] = useState("");

  async function searchByName() {
    const q = query.trim();
    if (!q) {
      setError("Введіть назву бренду, людини чи організації");
      return;
    }
    setError("");
    setLoading(true);
    setSearched(true);
    setResults([]);
    try {
      const p = new URLSearchParams({
        query: q,
        key: API_KEY,
        limit: "10",
        indent: "true",
      });
      const r = await fetch(
        `https://kgsearch.googleapis.com/v1/entities:search?${p}`
      );
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      const items = (data.itemListElement || []).map(parseItem) as KgEntity[];
      setResults(items.filter((e) => e.kgmid));
    } catch (e) {
      setError(
        "Не вдалося отримати дані від Google. Спробуйте ще раз або скористайтеся повною тулзою Fajela."
      );
    } finally {
      setLoading(false);
    }
  }

  function generateDirect() {
    const k = kgmidInput.trim();
    if (!k) {
      setError("Вставте KGMID, наприклад /g/11f2bzkqxz");
      return;
    }
    if (!/^\/[gm]\//.test(k)) {
      setError("KGMID має починатися з /g/ або /m/. Перевірте формат");
      return;
    }
    setError("");
    setDirectUrl(profileUrlFromKgmid(k));
  }

  function copy(text: string, id: string) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(id);
        setTimeout(() => setCopied(""), 1500);
      })
      .catch(() => {});
  }

  const inputClass =
    "flex-1 min-w-0 px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors";
  const btnClass =
    "px-5 py-3 rounded-lg bg-gradient-to-r from-accent to-primary text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 whitespace-nowrap";

  return (
    <div className="not-prose my-8 rounded-xl border border-border bg-secondary/30 p-6">
      <div className="mb-1 text-sm font-medium text-accent">
        🛠 Інструмент SEO BAZA
      </div>
      <h2 className="mb-1 mt-0 text-2xl font-display">
        Перевір сутність і згенеруй посилання на Google Search Profile
      </h2>
      <p className="mb-5 text-sm text-muted-foreground">
        Знайди свою сутність у Графі знань Google за назвою (або встав готовий
        KGMID) і отримай пряме посилання на свій профіль у форматі{" "}
        <code className="text-xs">profile.google.com/cp/…</code>
      </p>

      {/* Перемикач режимів */}
      <div className="mb-5 inline-flex rounded-lg border border-border p-1">
        <button
          type="button"
          onClick={() => {
            setMode("name");
            setError("");
          }}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
            mode === "name"
              ? "bg-accent text-white"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          За назвою
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("kgmid");
            setError("");
          }}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
            mode === "kgmid"
              ? "bg-accent text-white"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          За KGMID
        </button>
      </div>

      {/* Режим: пошук за назвою */}
      {mode === "name" && (
        <div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              className={inputClass}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchByName()}
              placeholder="Назва бренду, людини або організації…"
            />
            <button
              type="button"
              className={btnClass}
              onClick={searchByName}
              disabled={loading}
            >
              {loading ? "Шукаю…" : "Знайти"}
            </button>
          </div>

          {searched && !loading && results.length === 0 && !error && (
            <p className="mt-4 text-sm text-muted-foreground">
              Нічого не знайдено. Можливо, у цієї сутності ще немає запису в Графі
              знань. Або спробуйте іншу назву.
            </p>
          )}

          <div className="mt-4 flex flex-col gap-3">
            {results.map((e) => {
              const url = profileUrlFromKgmid(e.kgmid);
              return (
                <div
                  key={e.kgmid}
                  className="rounded-lg border border-border bg-background p-4"
                >
                  <div className="flex items-start gap-3">
                    {e.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={e.image}
                        alt={e.name}
                        className="h-12 w-12 flex-shrink-0 rounded object-cover"
                        loading="lazy"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="font-display text-lg">{e.name}</div>
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        {e.types.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="rounded bg-accent/10 px-2 py-0.5 text-xs text-accent"
                          >
                            {t}
                          </span>
                        ))}
                        <a
                          href={`https://www.google.com/search?kgmid=${encodeURIComponent(e.kgmid)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Відкрити сутність у Google"
                          className="text-xs text-muted-foreground hover:text-accent transition-colors"
                        >
                          <code className="text-xs">{e.kgmid}</code> ↗
                        </a>
                      </div>
                      {e.description && (
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {e.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3 sm:flex-row sm:items-center">
                    <code className="min-w-0 flex-1 break-all rounded bg-secondary/50 px-2 py-1.5 text-xs">
                      {url}
                    </code>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => copy(url, e.kgmid)}
                        className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:border-accent hover:text-accent transition-colors"
                      >
                        {copied === e.kgmid ? "Скопійовано!" : "Копіювати"}
                      </button>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md bg-gradient-to-r from-accent to-primary px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 transition-opacity"
                      >
                        Відкрити профіль ↗
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Режим: за KGMID */}
      {mode === "kgmid" && (
        <div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              className={inputClass}
              type="text"
              value={kgmidInput}
              onChange={(e) => setKgmidInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generateDirect()}
              placeholder="/g/11f2bzkqxz"
            />
            <button type="button" className={btnClass} onClick={generateDirect}>
              Згенерувати
            </button>
          </div>

          {directUrl && (
            <div className="mt-4 flex flex-col gap-2 rounded-lg border border-border bg-background p-4 sm:flex-row sm:items-center">
              <code className="min-w-0 flex-1 break-all rounded bg-secondary/50 px-2 py-1.5 text-xs">
                {directUrl}
              </code>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => copy(directUrl, "direct")}
                  className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:border-accent hover:text-accent transition-colors"
                >
                  {copied === "direct" ? "Скопійовано!" : "Копіювати"}
                </button>
                <a
                  href={directUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-gradient-to-r from-accent to-primary px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 transition-opacity"
                >
                  Відкрити профіль ↗
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      <p className="mt-5 border-t border-border pt-4 text-xs text-muted-foreground">
        Пошук працює на Google Knowledge Graph Search API. Повна версія з
        масовою перевіркою і відстеженням змін:{" "}
        <a
          href="https://app.fajela.com/kg-search/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          тулза Knowledge Graph Search від Fajela
        </a>
        .
      </p>
    </div>
  );
}
