/**
 * Pre-build guard against orphaned-404 news URLs.
 *
 * Bug this prevents (happened twice — 1645→1646, and the GSC AI-reports post):
 * a published news post's slug changes AFTER its URL has already shipped in
 * sitemap-news.xml and been discovered by Google. The old URL then 404s and sits
 * in Search Console as "Not found (404), referring page sitemap-news.xml".
 *
 * Invariant enforced: a news URL that was previously published (recorded in the
 * committed snapshot below) must never disappear from the current build without a
 * 301 redirect covering it in next.config.ts. That makes a slug rename impossible
 * to ship silently — you either keep the URL or add a redirect.
 *
 * Workflow:
 *   - `npm run check:news`          → verify (also runs as prebuild)
 *   - `npm run check:news -- --update` → after an intentional rename+redirect (or
 *                                        just adding posts), refresh the snapshot
 *
 * The snapshot lives at scripts/published-news-urls.json and IS committed.
 */
import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";

const NEWS_DIR = path.join(process.cwd(), "content", "news");
const SNAPSHOT = path.join(process.cwd(), "scripts", "published-news-urls.json");
const CONFIG = path.join(process.cwd(), "next.config.ts");
const UPDATE = process.argv.includes("--update");

async function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(full)));
    else if (e.name.endsWith(".mdx")) out.push(full);
  }
  return out;
}

/** Public URL path for a news .mdx, mirroring lib/sitemap-data.ts + lib/news.ts. */
function urlFor(file) {
  const rel = path.relative(NEWS_DIR, file).split(path.sep);
  const slug = rel[rel.length - 1].replace(/\.mdx$/, "");
  const year = rel[0];
  // content/news/YYYY/MM/slug.mdx → /news/YYYY/MM/slug   (individual posts)
  // content/news/YYYY/slug.mdx    → /news/YYYY/slug       (digests at year root)
  const month = rel.length === 3 ? rel[1] : undefined;
  return month ? `/news/${year}/${month}/${slug}` : `/news/${year}/${slug}`;
}

// Current published URL set
const files = await walk(NEWS_DIR);
const current = new Set();
for (const file of files) {
  const { data } = matter(await fs.readFile(file, "utf8"));
  if (data.status && data.status !== "published") continue;
  current.add(urlFor(file));
}

if (UPDATE) {
  const sorted = [...current].sort();
  await fs.writeFile(SNAPSHOT, JSON.stringify(sorted, null, 2) + "\n");
  console.log(`✓ Snapshot updated: ${sorted.length} published news URLs.`);
  process.exit(0);
}

// Previous snapshot
let snapshot = [];
try {
  snapshot = JSON.parse(await fs.readFile(SNAPSHOT, "utf8"));
} catch {
  console.error(
    "\n✗ No URL snapshot found. Create it once with:\n    npm run check:news -- --update\n"
  );
  process.exit(1);
}

// Redirect sources declared in next.config.ts (literal `source: "..."`)
let redirects = new Set();
try {
  const cfg = await fs.readFile(CONFIG, "utf8");
  for (const m of cfg.matchAll(/source:\s*["'`]([^"'`]+)["'`]/g)) redirects.add(m[1]);
} catch {
  /* config unreadable — treat as no redirects */
}

const orphaned = snapshot.filter((u) => !current.has(u) && !redirects.has(u));

if (orphaned.length) {
  console.error("\n✗ News URL check failed — previously-published URLs would 404:\n");
  for (const u of orphaned) console.error("  • " + u);
  console.error(
    "\nEach was in a shipped sitemap and is now gone. Either keep the slug, or add a\n" +
      "permanent redirect in next.config.ts, then run:  npm run check:news -- --update\n"
  );
  process.exit(1);
}

console.log(
  `✓ News URL check passed (${current.size} current, ${snapshot.length} in snapshot).`
);
