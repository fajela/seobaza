"use client";

import { useMemo, useRef, useState } from "react";

/**
 * IndexingQuiz — вбудований у статтю інтерактивний квіз із мітапу SEO BAZA.
 *
 * Гра проста: для кожного SEO-фактора треба вгадати, чи це СИГНАЛ ДЛЯ
 * ІНДЕКСАЦІЇ (тобто чи впливає він на те, потрапить сторінка в індекс Google
 * чи ні), чи ні. Підступ у тому, що більшість факторів, які всі звикли
 * називати «важливими для SEO», насправді впливають на РАНЖУВАННЯ, а не на
 * індексацію.
 *
 * Джерело питань: data/quizzes/indexing-signals-quiz.xlsx
 * Правильні відповіді (isSignal) звірені з ключем Олесі.
 */

interface Factor {
  /** Українська назва фактора (основна). */
  uk: string;
  /** Англійська назва (як у першоджерелі). */
  en: string;
  /** true = це сигнал для індексації, false = ні. */
  isSignal: boolean;
}

// ПОРЯДОК — як у таблиці indexing-signals-quiz.xlsx.
// Відповіді (isSignal) — з ключа Search Central Live, підтвердженого Gary Illyes
// та Cherry Sireetorn Prommawin (слайд «Indexing signal or not?»).
const FACTORS: Factor[] = [
  { uk: "Вік та історія домену", en: "Domain Age & History", isSignal: false },
  { uk: "Країна", en: "Country", isSignal: true },
  { uk: "Мова", en: "Language", isSignal: true },
  { uk: "Структуровані дані", en: "Structured Data", isSignal: false },
  { uk: "XML-карта сайту", en: "XML Sitemap", isSignal: false },
  { uk: "HTTPS / Безпечний сайт", en: "HTTPS / Secure Site", isSignal: true },
  { uk: "Можливість сканування", en: "Crawlability", isSignal: false },
  { uk: "Основні показники вебсайту", en: "Core Web Vitals", isSignal: true },
  { uk: "Dofollow-посилання", en: "Dofollow Links", isSignal: true },
  { uk: "Швидкість зростання кількості посилань", en: "Link Velocity", isSignal: false },
  { uk: "Hreflang-теги", en: "Hreflang Tags", isSignal: true },
  { uk: "Логічна внутрішня перелінковка", en: "Logical Internal Linking", isSignal: false },
  { uk: "Зручність читання", en: "Readability", isSignal: false },
  { uk: "Тематичний авторитет", en: "Topical Authority", isSignal: false },
  { uk: "Глибина та повнота контенту", en: "Content Depth & Comprehensiveness", isSignal: false },
  { uk: "Відповідність намірам пошуку", en: "Matching Search Intent", isSignal: false },
  { uk: "Актуальність та свіжість контенту", en: "Content Recency & Freshness", isSignal: true },
  { uk: "Ключове слово в тегу H1", en: "Keyword in H1 Tag", isSignal: false },
  {
    uk: "EEAT: Досвід, експертність, авторитетність, достовірність",
    en: "E-E-A-T",
    isSignal: false,
  },
  { uk: "Порушення політик щодо спаму", en: "Spam Policies Violations", isSignal: true },
];

export function IndexingQuiz() {
  // answers[i]: true = «сигнал», false = «не сигнал», undefined = ще не відповіли
  const [answers, setAnswers] = useState<(boolean | undefined)[]>(
    () => Array(FACTORS.length).fill(undefined)
  );
  const [checked, setChecked] = useState(false);

  const answeredCount = answers.filter((a) => a !== undefined).length;
  const allAnswered = answeredCount === FACTORS.length;

  const score = useMemo(
    () =>
      FACTORS.reduce(
        (acc, f, i) => (answers[i] === f.isSignal ? acc + 1 : acc),
        0
      ),
    [answers]
  );

  function pick(i: number, value: boolean) {
    if (checked) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[i] = value;
      return next;
    });
  }

  const resultRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  function check() {
    setChecked(true);
    setTimeout(
      () => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }),
      50
    );
  }

  function reset() {
    setAnswers(Array(FACTORS.length).fill(undefined));
    setChecked(false);
    setTimeout(
      () => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      50
    );
  }

  const pct = Math.round((score / FACTORS.length) * 100);

  const verdict =
    score >= 18
      ? "Майже все вгадав. Різницю між індексацією і ранжуванням ти відчуваєш добре."
      : score >= 13
        ? "Кілька разів сплутав фактори ранжування з сигналами індексації."
        : score >= 8
          ? "Половину відповідей дав правильно."
          : "Більшість факторів ранжування ти позначив як сигнали індексації.";

  return (
    <div className="not-prose my-8 rounded-xl border border-border bg-secondary/30 p-6">
      <div ref={topRef} className="mb-1 text-sm font-semibold text-primary">
        🧪 Квіз SEO BAZA
      </div>
      <h2 className="mb-1 mt-0 text-2xl font-display">
        Сигнал для індексації чи ні?
      </h2>
      <p className="mb-5 text-sm text-muted-foreground">
        Обери відповідь для кожного сигналу і перевір результат.
      </p>

      {/* Прогрес відповідей (поки не перевірили) */}
      {!checked && (
        <div className="mb-5">
          <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
            <span>Відповіли</span>
            <span>
              {answeredCount} / {FACTORS.length}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-primary transition-all"
              style={{ width: `${(answeredCount / FACTORS.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Список факторів */}
      <div className="flex flex-col gap-2">
        {FACTORS.map((f, i) => {
          const chosen = answers[i];
          const correct = checked && chosen === f.isSignal;
          const wrong = checked && chosen !== undefined && chosen !== f.isSignal;

          return (
            <div
              key={f.en}
              className={`rounded-lg border p-3 transition-colors sm:flex sm:items-center sm:justify-between sm:gap-4 ${
                correct
                  ? "border-green-500/50 bg-green-500/5"
                  : wrong
                    ? "border-red-500/50 bg-red-500/5"
                    : "border-border bg-background"
              }`}
            >
              <div className="min-w-0">
                <div className="font-medium text-foreground">
                  {i + 1}. {f.uk}
                </div>
                <div className="text-xs text-muted-foreground">{f.en}</div>
                {checked && (
                  <div className="mt-1 text-xs">
                    {correct ? (
                      <span className="text-green-600 dark:text-green-400">
                        ✓ Правильно
                      </span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400">
                        ✗ Правильна відповідь:{" "}
                        {f.isSignal ? "сигнал для індексації" : "не сигнал"}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-2 flex flex-shrink-0 gap-2 sm:mt-0">
                <button
                  type="button"
                  aria-label="Так"
                  onClick={() => pick(i, true)}
                  disabled={checked}
                  className={`w-11 rounded-md border px-3 py-1.5 text-base font-semibold leading-none transition-colors disabled:cursor-default ${
                    chosen === true
                      ? "border-accent bg-accent text-white"
                      : "border-border text-muted-foreground hover:border-accent hover:text-accent"
                  }`}
                >
                  ✓
                </button>
                <button
                  type="button"
                  aria-label="Ні"
                  onClick={() => pick(i, false)}
                  disabled={checked}
                  className={`w-11 rounded-md border px-3 py-1.5 text-base font-semibold leading-none transition-colors disabled:cursor-default ${
                    chosen === false
                      ? "border-accent bg-accent text-white"
                      : "border-border text-muted-foreground hover:border-accent hover:text-accent"
                  }`}
                >
                  ✗
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Дія + результат (внизу, під списком) */}
      <div ref={resultRef} className="mt-6 scroll-mt-24">
        {!checked ? (
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={check}
              disabled={!allAnswered}
              className="w-full rounded-lg bg-gradient-to-r from-accent to-primary px-6 py-3 text-base font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 sm:w-auto"
            >
              Перевірити результат
            </button>
            {!allAnswered && (
              <p className="text-xs text-muted-foreground">
                Залишилось відповісти: {FACTORS.length - answeredCount}
              </p>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-accent/40 bg-accent/5 p-6 text-center">
            <div className="text-sm font-semibold uppercase tracking-wide text-primary">
              🧪 Квіз SEO BAZA
            </div>
            <div className="mt-0.5 text-sm text-foreground">
              Сигнали індексації Google
            </div>
            <div className="mt-4 text-xs uppercase tracking-wide text-muted-foreground">
              Мій результат
            </div>
            <div className="my-1 font-display text-5xl font-bold text-foreground">
              {score}
              <span className="text-2xl text-muted-foreground">
                {" "}
                / {FACTORS.length}
              </span>
            </div>
            <div className="text-base font-semibold text-primary">
              {pct}% правильних
            </div>
            <p className="mx-auto mt-3 max-w-md text-sm text-foreground">
              {verdict}
            </p>
            <div className="mt-4 border-t border-accent/20 pt-3 text-xs text-muted-foreground">
              Пройди сам на seobaza.com.ua
            </div>
            <button
              type="button"
              onClick={reset}
              className="mt-4 rounded-lg border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
            >
              Пройти ще раз
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
