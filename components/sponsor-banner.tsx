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
  label = "🤝 Спонсор стріму",
  logo,
  logoAlt,
  items,
  extraLinkText,
  extraUrl,
  extraText,
}: {
  name: string;
  url: string;
  text: string;
  /** Підпис угорі блока: "Спонсор стріму" для відео, "Спонсор випуску" для дайджесту. */
  label?: string;
  /** Логотип спонсора, шлях у public. */
  logo?: string;
  logoAlt?: string;
  /** Перелік пунктів від спонсора, кожен окремим рядком. */
  items?: string[];
  /** Другий рядок усередині блока: лінк + хвіст (наприклад, дослідження спонсора). */
  extraLinkText?: string;
  extraUrl?: string;
  extraText?: string;
}) {
  return (
    <aside
      aria-label={label.replace(/^\W+\s*/, "")}
      className="not-prose my-8 rounded-xl border-2 border-accent bg-accent/10 px-5 py-4"
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
        {label}
      </p>
      {logo && (
        <img
          src={logo}
          alt={logoAlt ?? `Логотип ${name}`}
          width={1200}
          height={272}
          loading="lazy"
          className="mb-3 h-10 w-auto"
        />
      )}
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
      {items && items.length > 0 && (
        <ul className="m-0 mt-3 list-none space-y-1 p-0 leading-relaxed">
          {items.map((line) => (
            <li key={line} className="m-0">
              {line}
            </li>
          ))}
        </ul>
      )}
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
