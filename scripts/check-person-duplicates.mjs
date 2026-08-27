/**
 * Pre-build guard against duplicate person entities.
 *
 * Invariant enforced: the same person must not exist both as an author page
 * (content/authors/*.mdx) and as a KG person page (content/kg/person/*.mdx).
 * Two pages for one person mint two competing Person entities on the site
 * (identical name + sameAs, different itemIDs) and split search signals.
 *
 * Matching is by normalized `name` plus every `alternateName`, in both
 * directions, same logic as getAuthorSlugByName in lib/authors.ts.
 *
 * Runs as part of `npm run prebuild`. Fails the build with a clear message
 * naming both files; resolving the conflict is a deliberate decision, not
 * something to ship silently.
 */
import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";

const AUTHORS_DIR = path.join(process.cwd(), "content", "authors");
const KG_PERSON_DIR = path.join(process.cwd(), "content", "kg", "person");

function altNames(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function nameKeys(data) {
  return [data.name, ...altNames(data.alternateName)]
    .filter(Boolean)
    .map((n) => n.trim().toLowerCase());
}

async function readDir(dir) {
  try {
    const files = await fs.readdir(dir);
    const out = [];
    for (const f of files.filter((f) => f.endsWith(".mdx"))) {
      const raw = await fs.readFile(path.join(dir, f), "utf8");
      out.push({ file: path.join(dir, f), data: matter(raw).data });
    }
    return out;
  } catch {
    return [];
  }
}

const authors = await readDir(AUTHORS_DIR);
const kgPeople = await readDir(KG_PERSON_DIR);

const authorIndex = new Map();
for (const a of authors) {
  for (const key of nameKeys(a.data)) authorIndex.set(key, a);
}

const conflicts = [];
for (const p of kgPeople) {
  for (const key of nameKeys(p.data)) {
    if (authorIndex.has(key)) {
      const a = authorIndex.get(key);
      // A deliberate pair is fine: the author page carries kgId pointing at
      // this KG person, so it references the KG entity instead of minting its
      // own. Anything else is an accidental duplicate.
      if (a.data.kgId && a.data.kgId === p.data.kgId) break;
      conflicts.push({ name: key, author: a.file, kg: p.file });
      break;
    }
  }
}

if (conflicts.length > 0) {
  console.error("✖ Одна людина існує і як автор, і як сторінка графа знань:");
  for (const c of conflicts) {
    console.error(`  «${c.name}»`);
    console.error(`    автор:      ${c.author}`);
    console.error(`    граф знань: ${c.kg}`);
  }
  console.error(
    "Дубль сутності забороняється. Якщо це та сама людина, додайте kgId у frontmatter її сторінки автора (тоді сторінка автора посилається на сутність графа замість карбувати власну), і збирайте знову.",
  );
  process.exit(1);
}

console.log(
  `✓ Дублів людей нема (авторів: ${authors.length}, у графі: ${kgPeople.length})`,
);
