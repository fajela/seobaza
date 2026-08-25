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
}: {
  name: string;
  url: string;
  text: string;
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
    </aside>
  );
}
