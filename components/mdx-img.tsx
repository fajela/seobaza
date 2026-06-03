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
      <a href={href} target="_blank" rel="nofollow noopener noreferrer" {...props}>
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
 * Keeps the clean original URL in `src` (no `/_next/image?...` rewriting of
 * the fallback) while still serving responsive variants via `srcset` through
 * the Next.js image optimizer. For local images we read the dimensions from
 * disk at build time and set width/height to avoid layout shift (CLS).
 */
// Next.js default deviceSizes — the widths next/image emits in srcset.
const DEVICE_SIZES = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];

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

  // Remote / data URLs → plain img, untouched.
  if (!src.startsWith("/")) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img src={src} alt={alt || ""} title={title} loading="lazy" decoding="async" className="rounded-lg" />
    );
  }

  // Local image: read intrinsic dimensions (prevents CLS).
  let width: number | undefined;
  let height: number | undefined;
  try {
    const filePath = path.join(process.cwd(), "public", src.replace(/^\//, ""));
    const dim = imageSize(fs.readFileSync(filePath));
    width = dim.width;
    height = dim.height;
  } catch {
    // unmeasurable — fall through with no dimensions
  }

  // Responsive srcset via the optimizer, but the fallback src stays clean.
  const srcSet = DEVICE_SIZES.map(
    (w) => `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=75 ${w}w`
  ).join(", ");

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes="(max-width: 768px) 100vw, 768px"
      alt={alt || ""}
      title={title}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      className="rounded-lg h-auto w-full"
    />
  );
}
