/**
 * Pre-build guard for the closed entity vocabulary (entity hubs /kg/<type>/<slug>).
 *
 * Invariants enforced:
 *  - every entity file in content/kg/{concept,tool,org}/ has a name, a
 *    description and a valid status; slugs are unique across types and never
 *    look like a person sb-id;
 *  - no alias belongs to two entities (the tagger could not tell them apart);
 *  - `related` and every material's `entities:` point only at known ids
 *    (entity slugs or person sb-ids from content/kg/person);
 *  - a published hub has its own written intro and at least MIN_MATERIALS
 *    published materials, so no hub ships as a bare list of links.
 *
 * Runs as part of `npm run prebuild`. Fails the build naming the file; adding
 * a new entity is an editorial decision, not something to ship silently.
 */
import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT = path.join(process.cwd(), "content");
const KG = path.join(CONTENT, "kg");
const TYPES = ["concept", "tool", "org"];
const MATERIAL_DIRS = ["news", "articles", "videos", "events", "knowledge-base"];
const MIN_MATERIALS = 5;

const list = (v) => (!v ? [] : (Array.isArray(v) ? v : [v]).map(String).filter(Boolean));
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

const errors = [];

// People ids
const personIds = new Set();
for await (const file of walk(path.join(KG, "person"))) {
  const { data } = matter(await fs.readFile(file, "utf8"));
  if (data.kgId) personIds.add(String(data.kgId));
}

// Entities
const entities = new Map(); // slug -> { file, data, content }
const aliasOwner = new Map(); // lowercased alias -> slug
for (const type of TYPES) {
  for await (const file of walk(path.join(KG, type))) {
    const slug = path.basename(file, ".mdx");
    const { data, content } = matter(await fs.readFile(file, "utf8"));
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) errors.push(`${rel(file)}: slug must be lowercase latin kebab-case`);
    if (/^sb\d{4}$/.test(slug)) errors.push(`${rel(file)}: slug looks like a person sb-id`);
    if (entities.has(slug)) errors.push(`${rel(file)}: slug "${slug}" already used by ${rel(entities.get(slug).file)}`);
    if (!data.name) errors.push(`${rel(file)}: missing name`);
    if (!data.description) errors.push(`${rel(file)}: missing description`);
    if (data.status && !["draft", "published"].includes(data.status)) errors.push(`${rel(file)}: status must be draft or published`);
    if (data.wikidata && !/^Q\d+$/.test(String(data.wikidata))) errors.push(`${rel(file)}: wikidata must look like Q123`);
    entities.set(slug, { file, data, content, type });
    for (const alias of [data.name, ...list(data.aliases)].filter(Boolean)) {
      const key = String(alias).toLowerCase();
      const owner = aliasOwner.get(key);
      if (owner && owner !== slug) errors.push(`${rel(file)}: alias "${alias}" also belongs to "${owner}"`);
      else aliasOwner.set(key, slug);
    }
  }
}

const known = (id) => entities.has(id) || personIds.has(id);

for (const [slug, { file, data }] of entities) {
  for (const r of list(data.related)) if (!known(r)) errors.push(`${rel(file)}: related "${r}" is not a known entity or person`);
  if (list(data.related).includes(slug)) errors.push(`${rel(file)}: related points at itself`);
}

// Materials
const usage = new Map(); // id -> count of published materials
for (const dir of MATERIAL_DIRS) {
  for await (const file of walk(path.join(CONTENT, dir))) {
    const { data } = matter(await fs.readFile(file, "utf8"));
    const ids = list(data.entities);
    if (ids.length === 0) continue;
    const seen = new Set();
    for (const id of ids) {
      if (!known(id)) errors.push(`${rel(file)}: entities has unknown id "${id}" (add it to content/kg/ first)`);
      if (seen.has(id)) errors.push(`${rel(file)}: entities lists "${id}" twice`);
      seen.add(id);
    }
    const published = dir === "videos" ? data.status === "published" : data.status !== "draft";
    if (published) for (const id of seen) usage.set(id, (usage.get(id) ?? 0) + 1);
  }
}

for (const [slug, { file, data, content }] of entities) {
  if (data.status !== "published") continue;
  if (content.trim().length === 0) errors.push(`${rel(file)}: published hub needs its own intro text in the body`);
  const n = usage.get(slug) ?? 0;
  if (n < MIN_MATERIALS) errors.push(`${rel(file)}: published hub has ${n} materials, needs at least ${MIN_MATERIALS}`);
}

if (errors.length) {
  console.error(`\n✗ check-entities: ${errors.length} problem(s)\n`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error("");
  process.exit(1);
}
console.log(`✓ check-entities: ${entities.size} entities, ${personIds.size} people, ${[...usage.values()].reduce((a, b) => a + b, 0)} entity links in materials`);
