import { imageSize } from "image-size";
import fs from "fs";
import path from "path";

const BASE = "https://seobaza.com.ua";

export interface OgImage {
  url: string;
  width: number;
  height: number;
  type: string;
  alt: string;
}

const FALLBACK = {
  path: "/og-image.png",
  width: 640,
  height: 640,
  type: "image/png",
};

function mimeFor(ext: string): string {
  switch (ext.toLowerCase()) {
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".avif":
      return "image/avif";
    default:
      return "image/jpeg";
  }
}

/**
 * Build a complete OG image descriptor for a post.
 *
 * Reads the REAL dimensions of the image from disk at build time (via
 * image-size) so og:image:width / og:image:height match the file — declaring
 * wrong dimensions causes cropped or blank link previews on Facebook,
 * LinkedIn and Telegram. Falls back to the site default OG image when the post
 * has no image or the file can't be measured.
 */
export function buildOgImage(imagePath: string | undefined, alt: string): OgImage {
  const useFallback = (): OgImage => ({
    url: `${BASE}${FALLBACK.path}`,
    width: FALLBACK.width,
    height: FALLBACK.height,
    type: FALLBACK.type,
    alt,
  });

  if (!imagePath || !imagePath.startsWith("/")) return useFallback();

  try {
    const file = path.join(process.cwd(), "public", imagePath.replace(/^\//, ""));
    const dim = imageSize(fs.readFileSync(file));
    if (!dim.width || !dim.height) return useFallback();
    return {
      url: `${BASE}${imagePath}`,
      width: dim.width,
      height: dim.height,
      type: mimeFor(path.extname(imagePath)),
      alt,
    };
  } catch {
    return useFallback();
  }
}
