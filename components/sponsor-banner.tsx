/**
 * Спонсорський банер для сторінок відео/стрімів.
 * Семантика: <aside> з позначкою "Спонсор стріму", посилання rel="sponsored".
 * Використання в MDX (text пропом, щоб MDX не загортав його у вкладений <p>):
 *   <SponsorBanner name="Collaborator" url="https://..." text="— опис." />
 */
export function SponsorBanner({
  name,
  url,
  text,
  extraLinkText,
  extraUrl,
  extraText,
}: {
  name: string;
  url: string;
  text: string;
  /** Другий рядок усередині блока: лінк + хвіст (наприклад, дослідження спонсора). */
  extraLinkText?: string;
  extraUrl?: string;
  extraText?: string;
}) {
  return (
    <aside
      aria-label="Спонсор стріму"
      className="not-prose my-8 rounded-xl border-2 border-accent bg-accent/10 px-5 py-4"
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
        🤝 Спонсор стріму
      </p>
      <p className="m-0 leading-relaxed">
        <a
          href={url}
          target="_blank"
          rel="sponsored nofollow noopener"
          className="font-bold text-primary hover:text-accent underline transition-colors"
        >
          {name}
        </a>{" "}
        {text}
      </p>
      {extraUrl && extraLinkText && (
        <p className="m-0 mt-3 leading-relaxed">
          <a
            href={extraUrl}
            target="_blank"
            rel="sponsored nofollow noopener"
            className="text-primary hover:text-accent underline transition-colors"
          >
            {extraLinkText}
          </a>
          {extraText}
        </p>
      )}
    </aside>
  );
}
