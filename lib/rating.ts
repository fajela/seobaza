import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { computeReadingTime } from "./articles";

const RATING_DIR = path.join(process.cwd(), "content/rating");

export interface Rating {
  title: string;
  h1: string;
  description: string;
  date: string;
  time?: string;
  image?: string;
  author: string;
  readingTime: number;
  content: string;
}

/** The newest published monthly file (content/rating/YYYY-MM.mdx), shown at /rating. */
export function getCurrentRating(): Rating | null {
  if (!fs.existsSync(RATING_DIR)) return null;
  const files = fs
    .readdirSync(RATING_DIR)
    .filter((f) => /^\d{4}-\d{2}\.mdx$/.test(f))
    .sort()
    .reverse();
  for (const file of files) {
    const { data, content } = matter(fs.readFileSync(path.join(RATING_DIR, file), "utf8"));
    if (data.status === "draft") continue;
    return {
      title: String(data.title),
      h1: String(data.h1 || data.title),
      description: String(data.description ?? ""),
      date: data.date ? String(data.date).slice(0, 10) : "",
      time: typeof data.time === "string" ? data.time : undefined,
      image: typeof data.image === "string" ? data.image : undefined,
      author: String(data.author ?? "Олеся Коробка"),
      readingTime: computeReadingTime(content),
      content,
    };
  }
  return null;
}
