/**
 * Внутрішньоконтентний банер поточного лайву. Один на сторінку, вставляється
 * після вступу перед першим H2 через MdxWithLiveBanner. Після стріму зняти
 * або перемкнути текст на запис.
 */
export function LiveBanner() {
  return (
    <aside
      aria-label="Анонс стріму"
      className="not-prose my-10 flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-border bg-secondary/30 px-5 py-4"
    >
      <div className="flex-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
          🔴 Наживо сьогодні о 18:30
        </p>
        <p className="font-bold text-lg leading-snug m-0">
          RAG для SEO. Що працює насправді?
        </p>
        <p className="text-sm text-muted-foreground m-0">
          Саша Хілова, Віра Сєчкіна і Олеся Коробка. Розіграш квитка на SERP Conf.
        </p>
      </div>
      <a
        href="https://www.youtube.com/watch?v=SWM1Cgd0QpE"
        target="_blank"
        rel="noopener"
        className="shrink-0 self-start sm:self-center px-4 py-2 rounded-lg bg-primary text-background text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Дивитися →
      </a>
    </aside>
  );
}
