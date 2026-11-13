/**
 * Pre-build guard for the closed entity vocabulary (entity hubs /kg/<type>/<slug>).
 *
 * Invariants enforced:
 *  - every entity file in content/kg/{concept,tool,assistant,org,social,event,place,series}/ has a name and a
 *    valid status (a published hub also needs a description); slugs are unique across types and never
 *    look like a person sb-id;
 *  - no alias belongs to two entities (the tagger could not tell them apart);
 *  - `related` and every material's `entities:` point only at known ids:
 *    entity slugs, or people by their file slug from content/kg/person
 *    (oleksii-matuznyi). A bare sb-id there is an error: people are named, the
 *    site resolves the slug to the sb-id itself (lib/kg.ts resolveEntityId);
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
const TYPES = ["concept", "tool", "assistant", "org", "social", "event", "place", "series"];
const MATERIAL_DIRS = ["news", "articles", "videos", "events", "knowledge-base", "rating"];
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
const personSlugToId = new Map(); // oleksii-matuznyi -> sb0012
const personIdToSlug = new Map();
for await (const file of walk(path.join(KG, "person"))) {
  const { data } = matter(await fs.readFile(file, "utf8"));
  if (!data.kgId) continue;
  const slug = path.basename(file, ".mdx");
  personIds.add(String(data.kgId));
  personSlugToId.set(slug, String(data.kgId));
  personIdToSlug.set(String(data.kgId), slug);
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
    if (!data.description && data.status === "published") errors.push(`${rel(file)}: published hub needs a description`);
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

for (const slug of personSlugToId.keys())
  if (entities.has(slug)) errors.push(`content/kg/person/${slug}.mdx: slug "${slug}" is also an entity slug`);

const known = (id) => entities.has(id) || personSlugToId.has(id);
const resolve = (id) => personSlugToId.get(id) ?? id;
const sbHint = (id) => (personIds.has(id) ? ` (people go by name: use "${personIdToSlug.get(id)}")` : "");

for (const [slug, { file, data }] of entities) {
  for (const r of list(data.related)) if (!known(r)) errors.push(`${rel(file)}: related "${r}" is not a known entity or person${sbHint(r)}`);
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
      if (!known(id)) errors.push(`${rel(file)}: entities has unknown id "${id}"${sbHint(id) || " (add it to content/kg/ first)"}`);
      if (seen.has(resolve(id))) errors.push(`${rel(file)}: entities lists "${id}" twice`);
      seen.add(resolve(id));
    }
    const published = dir === "videos" ? data.status === "published" : data.status !== "draft";
    if (published) for (const id of seen) usage.set(id, (usage.get(id) ?? 0) + 1);
  }
}

// Tools catalog (/kg/tool): a row's `entity` must be a known entity.
const toolsFile = path.join(CONTENT, "tools", "tools.json");
try {
  const tools = JSON.parse(await fs.readFile(toolsFile, "utf8"));
  let blocked = {};
  try {
    blocked = JSON.parse(await fs.readFile(path.join(CONTENT, "tools", "blocklist.json"), "utf8")).domains ?? {};
  } catch {}
  for (const t of tools) {
    let host = "";
    try { host = new URL(t.url, "https://seobaza.com.ua").hostname.replace(/^www\./, ""); } catch {}
    for (const [d, why] of Object.entries(blocked))
      if (host === d || host.endsWith(`.${d}`)) errors.push(`${rel(toolsFile)}: "${t.name}" is on the blocklist (${d}: ${why})`);
    for (const id of t.people ?? []) if (!personIds.has(id)) errors.push(`${rel(toolsFile)}: "${t.name}" has unknown person "${id}"`);
    if (t.entity && !entities.has(t.entity)) errors.push(`${rel(toolsFile)}: "${t.name}" has unknown entity "${t.entity}" (add it to content/kg/ first)`);
  }
} catch (e) {
  if (e.code !== "ENOENT") errors.push(`${rel(toolsFile)}: ${e.message}`);
}
// Catalog categories/sections → concept entities (content/tools/concepts.json).
const conceptsFile = path.join(CONTENT, "tools", "concepts.json");
try {
  const map = JSON.parse(await fs.readFile(conceptsFile, "utf8"));
  for (const [key, id] of [...Object.entries(map.categories ?? {}), ...Object.entries(map.sections ?? {})]) {
    if (!entities.has(id)) errors.push(`${rel(conceptsFile)}: "${key}" points at unknown entity "${id}"`);
  }
} catch (e) {
  if (e.code !== "ENOENT") errors.push(`${rel(conceptsFile)}: ${e.message}`);
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
