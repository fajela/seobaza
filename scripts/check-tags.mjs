/**
 * Pre-build guard for the closed tag vocabulary (lib/taxonomy.ts TAGS).
 *
 * Every `tags:` value in news and articles must be a slug from TAGS or a tag
 * already replaced by a published entity hub. A tag
 * written from memory ("e-e-a-t" instead of "eeat", "links" instead of
 * "link-building") used to ship silently as a new empty /tags/ page.
 *
 * LEGACY lists the stray tags that already exist in the archive and are being
 * moved into entities one by one (kg/mapinh-smittievykh-tehiv.md). The list may
 * only shrink: a legacy tag that is no longer used anywhere fails the build
 * until it is removed from LEGACY, and nothing new may be added to it.
 *
 * Runs as part of `npm run prebuild`.
 */
import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT = path.join(process.cwd(), "content");
const DIRS = ["news", "articles"];

const LEGACY = new Set([
  "industry", "industry-news", "ai", "analytics", "indexing", "ads", "ppc",
  "discover", "meta", "social", "legal", "search-profiles",
  "e-e-a-t", "links", "linkbuilding",
]);

const rel = (p) => path.relative(process.cwd(), p);

async function* walk(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const d of entries) {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) yield* walk(p);
    else if (d.name.endsWith(".mdx")) yield p;
  }
}

const taxonomy = await fs.readFile(path.join(process.cwd(), "lib/taxonomy.ts"), "utf8");
const tagsBlock = taxonomy.slice(taxonomy.indexOf("export const TAGS"));
const known = new Set([...tagsBlock.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]));

// A tag replaced by a published entity hub (`replacesTag`) is valid: its
// /tags/ page already 301s to the hub and the chip links straight there.
for await (const file of walk(path.join(CONTENT, "kg"))) {
  const { data } = matter(await fs.readFile(file, "utf8"));
  if (data.status !== "published" || !data.replacesTag) continue;
  for (const t of Array.isArray(data.replacesTag) ? data.replacesTag : [data.replacesTag]) known.add(String(t));
}

const errors = [];
const usedLegacy = new Set();

for (const dir of DIRS) {
  for await (const file of walk(path.join(CONTENT, dir))) {
    const { data } = matter(await fs.readFile(file, "utf8"));
    if (data.status && data.status !== "published") continue;
    const tags = data.tags == null ? [] : Array.isArray(data.tags) ? data.tags : [data.tags];
    for (const raw of tags) {
      const tag = String(raw).trim();
      if (!tag) {
        errors.push(`${rel(file)}: empty tag`);
      } else if (known.has(tag)) {
        continue;
      } else if (LEGACY.has(tag)) {
        usedLegacy.add(tag);
      } else {
        errors.push(`${rel(file)}: tag "${tag}" is not in lib/taxonomy.ts TAGS (use the dictionary slug; a new tag needs Olesia's approval)`);
      }
    }
  }
}

for (const tag of LEGACY) {
  if (!usedLegacy.has(tag)) errors.push(`scripts/check-tags.mjs: legacy tag "${tag}" is no longer used, remove it from LEGACY`);
}

if (errors.length) {
  console.error(`✗ check-tags: ${errors.length} problem(s)`);
  for (const e of errors) console.error("  " + e);
  process.exit(1);
}
console.log(`✓ check-tags: all tags in the dictionary (${usedLegacy.size} legacy tags still being migrated)`);
