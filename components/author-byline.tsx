import Image from "next/image";
import Link from "next/link";

export interface BylineAuthor {
  name: string;
  slug?: string;
  image?: string;
}

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Compact author byline for post cards: avatar (or initials fallback) + name,
 * with date/reading-time meta. Links to the author page only when one exists.
 */
export function AuthorByline({
  author,
  date,
  readingTime,
  size = 28,
  linkAuthor = true,
}: {
  author: BylineAuthor;
  date?: string;
  readingTime?: number;
  size?: number;
  /**
   * Render the author name as a link to their page. Set false when the byline
   * sits inside an element that is itself a link (nested <a> is invalid HTML).
   */
  linkAuthor?: boolean;
}) {
  const avatar = author.image ? (
    <Image
      src={author.image}
      alt={author.name}
      width={size}
      height={size}
      className="rounded-full object-cover"
    />
  ) : (
    <span
      aria-hidden
      style={{ width: size, height: size }}
      className="flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-[0.65rem] font-bold text-white"
    >
      {initialsOf(author.name)}
    </span>
  );

  const formattedDate = date
    ? new Date(date).toLocaleDateString("uk-UA", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  const name =
    author.slug && linkAuthor ? (
      <Link
        href={`/authors/${author.slug}`}
        className="font-medium text-foreground hover:text-accent transition-colors"
      >
        {author.name}
      </Link>
    ) : (
      <span className="font-medium text-foreground">{author.name}</span>
    );

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      {avatar}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 min-w-0">
        {name}
        {(formattedDate || readingTime) && (
          <span className="flex items-center gap-2">
            {formattedDate && <time dateTime={date}>{formattedDate}</time>}
            {readingTime && (
              <>
                {formattedDate && <span aria-hidden>·</span>}
                <span>{readingTime} хв</span>
              </>
            )}
          </span>
        )}
      </div>
    </div>
  );
}
