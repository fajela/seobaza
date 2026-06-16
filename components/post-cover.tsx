import Image from "next/image";

/**
 * Cover image for post cards. Falls back to a branded gradient block with the
 * SEO BAZA wordmark when a post has no image (most articles, some news items),
 * so cards never render as empty grey boxes.
 */
export function PostCover({
  src,
  alt,
  label,
  sizes,
  priority,
  className = "",
}: {
  src?: string;
  alt: string;
  label?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes ?? "(max-width: 768px) 100vw, 33vw"}
        priority={priority}
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-primary via-primary/80 to-accent ${className}`}
      aria-hidden
    >
      <span className="px-4 text-center font-display text-lg font-bold tracking-tight text-white/90 drop-shadow-sm sm:text-xl">
        {label ?? "SEO BAZA"}
      </span>
    </div>
  );
}
