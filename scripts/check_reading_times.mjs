import fs from "fs";
import path from "path";
import matter from "gray-matter";

function compute(content) {
  const stripped = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*_~[\]()>!]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const wordCount = stripped.split(" ").filter(Boolean).length;
  return { wordCount, minutes: Math.max(1, Math.ceil(wordCount / 200)) };
}

const dir = path.resolve("../content/articles");
const files = fs.readdirSync(dir).filter(f => f.endsWith(".mdx"));
const rows = files.map(f => {
  const { content } = matter(fs.readFileSync(path.join(dir, f), "utf8"));
  const r = compute(content);
  return { file: f, chars: content.length, ...r };
}).sort((a, b) => b.minutes - a.minutes);

console.log("ALL articles by reading time:");
for (const r of rows) {
  console.log(`${r.minutes.toString().padStart(3)} хв  ${r.wordCount.toString().padStart(5)}w  ${r.chars.toString().padStart(5)}c  ${r.file}`);
}
