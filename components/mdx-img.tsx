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
 * Renders a plain native `<img>` with the original `src` (no Next.js image
 * optimizer / `/_next/image?...` rewriting). For local images we read the
 * dimensions from disk at build time and set width/height so the browser
 * reserves space and avoids layout shift (CLS) — the URL stays clean.
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

  // Local images: read intrinsic dimensions so we can set width/height
  // (prevents CLS) while keeping the clean /images/... URL.
  let width: number | undefined;
  let height: number | undefined;
  if (src.startsWith("/")) {
    try {
      const filePath = path.join(process.cwd(), "public", src.replace(/^\//, ""));
      const dim = imageSize(fs.readFileSync(filePath));
      width = dim.width;
      height = dim.height;
    } catch {
      // unmeasurable — fall through with no dimensions
    }
  }

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
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
