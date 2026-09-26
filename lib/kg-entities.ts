import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getAllKgPeople } from "./kg";

// ─── Entity hubs: /kg/<type>/<slug> ───────────────────────────────────────────
// One closed vocabulary for the whole site. Each entity is a file in
// content/kg/<type>/<slug>.mdx; materials reference entities through the
// `entities:` frontmatter field (entity slugs, or sb-ids for people).
// People keep their own loader (lib/kg.ts) and pages (/kg/person/<sb_id>).
// A hub renders only with `status: published`; drafts exist for tagging and
// validation but have no page, no sitemap entry and no links.

export const ENTITY_TYPES = ["concept", "tool", "org"] as const;
export type EntityType = (typeof ENTITY_TYPES)[number];

export const ENTITY_TYPE_LABELS: Record<EntityType, { one: string; many: string; schema: string }> = {
  concept: { one: "Концепт", many: "Концепти", schema: "https://schema.org/DefinedTerm" },
  tool: { one: "Інструмент", many: "Інструменти", schema: "https://schema.org/SoftwareApplication" },
  org: { one: "Компанія", many: "Компанії", schema: "https://schema.org/Organization" },
};

export interface KgEntity {
  slug: string;
  type: EntityType;
  name: string;
  /** Short description, 1-2 sentences; used as the hub lead and meta description. */
  description: string;
  status: "draft" | "published";
  /** Every surface form: spellings, transliterations, Ukrainian case forms. */
  aliases: string[];
  wikidata?: string;
  googleKgId?: string;
  sameAs: string[];
  /** Slugs (or sb-ids) of related entities. */
  related: string[];
  /** Old /tags/<slug> this hub replaces; gets a 301 once the hub is published. */
  replacesTag?: string;
  image?: string;
  content: string;
}

const kgDirectory = path.join(process.cwd(), "content/kg");
const contentDirectory = path.join(process.cwd(), "content");

function asList(value: unknown): string[] {
  if (!value) return [];
  return (Array.isArray(value) ? value : [value]).map(String).filter(Boolean);
}

let entityCache: KgEntity[] | null = null;

/** All entity files, drafts included. */
export function getAllEntities(): KgEntity[] {
  if (entityCache) return entityCache;
  const out: KgEntity[] = [];
  for (const type of ENTITY_TYPES) {
    const dir = path.join(kgDirectory, type);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"))) {
      const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
      out.push({
        slug: file.replace(/\.mdx$/, ""),
        type,
        name: data.name,
        description: data.description ?? "",
        status: data.status === "published" ? "published" : "draft",
        aliases: asList(data.aliases),
        wikidata: data.wikidata,
        googleKgId: data.googleKgId,
        sameAs: asList(data.sameAs),
        related: asList(data.related),
        replacesTag: data.replacesTag,
        image: data.image,
        content,
      });
    }
  }
  entityCache = out.sort((a, b) => a.name.localeCompare(b.name, "uk"));
  return entityCache;
}

export function getPublishedEntities(type?: EntityType): KgEntity[] {
  return getAllEntities().filter((e) => e.status === "published" && (!type || e.type === type));
}

export function getPublishedEntity(type: string, slug: string): KgEntity | undefined {
  return getPublishedEntities().find((e) => e.type === type && e.slug === slug);
}

export function entityUrl(e: Pick<KgEntity, "type" | "slug">): string {
  return `/kg/${e.type}/${e.slug}`;
}

export function isEntityType(value: string): value is EntityType {
  return (ENTITY_TYPES as readonly string[]).includes(value);
}

// ─── Materials tagged with entities ───────────────────────────────────────────

export interface TaggedMaterial {
  url: string;
  title: string;
  date: string;
  kind: "news" | "article" | "video" | "event" | "knowledge-base";
  entities: string[];
}

function* walkMdx(dir: string): Generator<string> {
  if (!fs.existsSync(dir)) return;
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) yield* walkMdx(p);
    else if (d.name.endsWith(".mdx")) yield p;
  }
}

// URL of a content file, mirroring the app/ routes. Returns null for files
// that have no public page.
function materialUrl(kind: TaggedMaterial["kind"], rel: string[]): string | null {
  const slug = rel[rel.length - 1].replace(/\.mdx$/, "");
  switch (kind) {
    case "news":
      // news/<year>/<month>/<slug> for posts, news/<year>/<slug> for digests
      return rel.length === 3 ? `/news/${rel[0]}/${rel[1]}/${slug}` : rel.length === 2 ? `/news/${rel[0]}/${slug}` : null;
    case "event":
      return rel.length === 2 ? `/events/${rel[0]}/${slug}` : null;
    case "article":
      return rel.length === 1 ? `/articles/${slug}` : null;
    case "video":
      return rel.length === 1 ? `/videos/${slug}` : null;
    case "knowledge-base":
      return rel.length === 1 ? `/knowledge-base/${slug}` : null;
  }
}

const MATERIAL_DIRS: Array<[TaggedMaterial["kind"], string]> = [
  ["news", "news"],
  ["article", "articles"],
  ["video", "videos"],
  ["event", "events"],
  ["knowledge-base", "knowledge-base"],
];

let materialCache: TaggedMaterial[] | null = null;

/** Every published material that carries at least one entity. */
export function getTaggedMaterials(): TaggedMaterial[] {
  if (materialCache) return materialCache;
  const out: TaggedMaterial[] = [];
  for (const [kind, dirName] of MATERIAL_DIRS) {
    const root = path.join(contentDirectory, dirName);
    for (const file of walkMdx(root)) {
      const { data } = matter(fs.readFileSync(file, "utf8"));
      const entities = asList(data.entities);
      if (entities.length === 0) continue;
      // Videos publish only on an explicit "published"; everything else hides on "draft".
      if (kind === "video" ? data.status !== "published" : data.status === "draft") continue;
      const url = materialUrl(kind, path.relative(root, file).split(path.sep));
      if (!url) continue;
      out.push({ url, title: data.h1 || data.title, date: data.date ? String(data.date).slice(0, 10) : "", kind, entities });
    }
  }
  materialCache = out.sort((a, b) => b.date.localeCompare(a.date));
  return materialCache;
}

export function getMaterialsForEntity(id: string): TaggedMaterial[] {
  return getTaggedMaterials().filter((m) => m.entities.includes(id));
}

// ─── Statistics for a hub ("значення і статистика") ───────────────────────────

export interface EntityRef {
  id: string;
  name: string;
  /** Present only when the target has a live page. */
  href?: string;
}

/** Resolve an entity id (slug or sb-id) to a display name and live URL. */
export function resolveEntityRef(id: string): EntityRef {
  const person = getAllKgPeople().find((p) => p.kgId === id);
  if (person) return { id, name: person.name, href: `/kg/person/${id}` };
  const entity = getAllEntities().find((e) => e.slug === id);
  if (!entity) return { id, name: id };
  return { id, name: entity.name, href: entity.status === "published" ? entityUrl(entity) : undefined };
}

export interface EntityStats {
  materialCount: number;
  firstDate?: string;
  lastDate?: string;
  byYear: Array<{ year: string; count: number }>;
  /** Entities that appear in the same materials, most frequent first. */
  coOccurring: Array<EntityRef & { count: number }>;
  /** People from the graph who appear in the same materials. */
  people: Array<EntityRef & { count: number }>;
}

export function getEntityStats(id: string): EntityStats {
  const materials = getMaterialsForEntity(id);
  const dates = materials.map((m) => m.date).filter(Boolean).sort();
  const years = new Map<string, number>();
  for (const d of dates) years.set(d.slice(0, 4), (years.get(d.slice(0, 4)) ?? 0) + 1);

  const counts = new Map<string, number>();
  for (const m of materials) for (const other of m.entities) if (other !== id) counts.set(other, (counts.get(other) ?? 0) + 1);
  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([other, count]) => ({ ...resolveEntityRef(other), count }));
  const isPerson = (r: EntityRef) => /^sb\d{4}$/.test(r.id);

  return {
    materialCount: materials.length,
    firstDate: dates[0],
    lastDate: dates[dates.length - 1],
    byYear: [...years.entries()].sort().map(([year, count]) => ({ year, count })),
    coOccurring: ranked.filter((r) => !isPerson(r)).slice(0, 10),
    people: ranked.filter(isPerson).slice(0, 10),
  };
}

/** "1 матеріал", "3 матеріали", "12 матеріалів", "21 матеріал". */
export function materialsLabel(n: number): string {
  const mod10 = n % 10, mod100 = n % 100;
  const form = mod10 === 1 && mod100 !== 11 ? "матеріал" : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14) ? "матеріали" : "матеріалів";
  return `${n} ${form}`;
}
