// Round person photo floated next to a rating entry. MDX usage:
// <RatingPhoto src="/authors/slug.jpg" alt="..." /> — string props only.
export function RatingPhoto({ src, alt }: { src?: string; alt?: string }) {
  if (!src) {
    return (
      <span
        aria-hidden="true"
        className="float-left mr-5 mb-3 flex h-28 w-28 items-center justify-center rounded-full bg-muted text-3xl text-muted-foreground"
      >
        ?
      </span>
    );
  }
  return (
    <img
      src={src}
      alt={alt ?? ""}
      width={112}
      height={112}
      loading="lazy"
      className="float-left mr-5 mb-3 h-28 w-28 rounded-full object-cover"
    />
  );
}
