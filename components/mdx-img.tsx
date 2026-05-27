import Image from "next/image";
import { imageSize } from "image-size";
import path from "path";
import fs from "fs";

/**
 * Drop-in replacement for the default MDX `<a>` element.
 * External links (http/https) open in a new tab with rel="noopener noreferrer".
 * Internal links (/path) behave normally.
 */
export function MdxLink({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isExternal = href?.startsWith("http://") || href?.startsWith("https://");
  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  }
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}

/**
 * Drop-in replacement for the default MDX `<img>` element.
 *
 * - Reads dimensions from disk at build time for local images
 *   so Next.js can serve responsive WebP/AVIF with correct aspect ratio
 *   and prevent layout shift (CLS).
 * - Falls back to plain `<img>` for remote URLs or files we can't measure.
 * - All images are lazy-loaded; the per-page `image:` frontmatter (hero)
 *   stays a separate `<Image priority />` rendered by the page template.
 */
export function MdxImg({
  src,
  alt,
  title,
}: {
  src?: string;
  alt?: string;
  title?: string;
}) {
  if (!src) return null;

  // Remote / data URLs → fall back to native img (Next/Image needs config per host)
  if (!src.startsWith("/")) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={alt || ""}
        title={title}
        loading="lazy"
        decoding="async"
        className="rounded-lg"
      />
    );
  }

  try {
    const filePath = path.join(process.cwd(), "public", src.replace(/^\//, ""));
    const buf = fs.readFileSync(filePath);
    const dim = imageSize(buf);
    if (!dim.width || !dim.height) throw new Error("no dimensions");

    return (
      <Image
        src={src}
        alt={alt || ""}
        title={title}
        width={dim.width}
        height={dim.height}
        sizes="(max-width: 768px) 100vw, 768px"
        loading="lazy"
        className="rounded-lg h-auto w-full"
      />
    );
  } catch {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={alt || ""}
        title={title}
        loading="lazy"
        decoding="async"
        className="rounded-lg"
      />
    );
  }
}
