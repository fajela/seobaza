import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { AuthorMetadata } from "./authors";

const kgPersonDirectory = path.join(process.cwd(), "content/kg/person");

// ─── Types ────────────────────────────────────────────────────────────────────

// KG people reuse the author field set; kgId is the stable graph identifier
// (sb0002, sb0003, ...) and the URL segment: /kg/person/<kgId>.
export interface KgPersonMetadata extends AuthorMetadata {
  kgId: string;
  /** "backend" = in the graph (tagging, statistics) but no public page yet. */
  visibility: "public" | "backend";
  /** Explicit "member of the Ukrainian SEO community" for people kept in Latin script. */
  community?: boolean;
  /** Optional meta description (120-155 chars); falls back to the bio. */
  description?: string;
  /** Extra surface forms for finding mentions (case forms, other scripts). */
  aliases: string[];
}

export interface KgPerson extends KgPersonMetadata {
  content: string;
}

// ─── Read helpers ─────────────────────────────────────────────────────────────

function readPersonFile(filename: string): KgPerson {
  const fullPath = path.join(kgPersonDirectory, filename);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    kgId: data.kgId,
    visibility: data.visibility === "backend" ? "backend" : "public",
    community: data.community === true ? true : undefined,
    description: typeof data.description === "string" ? data.description : undefined,
    aliases: Array.isArray(data.aliases) ? data.aliases.map(String) : data.aliases ? [String(data.aliases)] : [],
    slug: filename.replace(".mdx", ""),
    name: data.name,
    alternateName: data.alternateName,
    googleKgId: data.googleKgId,
    role: data.role ?? "",
    bio: data.bio ?? "",
    image: data.image,
    telegram: data.telegram,
    linkedin: data.linkedin,
    twitter: data.twitter,
    instagram: data.instagram,
    facebook: data.facebook,
    website: data.website,
    fajelaAbout: data.fajelaAbout,
    company: data.company,
    companyUrl: data.companyUrl,
    companyGoogleKgId: data.companyGoogleKgId,
    podcast: data.podcast,
    podcastUrl: data.podcastUrl,
    podcastGoogleKgId: data.podcastGoogleKgId,
    podcastSameAs: data.podcastSameAs,
    podcastCoHosts: data.podcastCoHosts,
    city: data.city,
    topics: data.topics,
    sameAs: data.sameAs,
    expertise: data.expertise ?? [],
    content,
  };
}

/** People with a public page. Pass includeBackend for the whole graph
 *  (tagging, statistics, validation), where backend people have no page. */
export function getAllKgPeople(includeBackend = false): KgPerson[] {
  if (!fs.existsSync(kgPersonDirectory)) return [];
  return fs
    .readdirSync(kgPersonDirectory)
    .filter((f) => f.endsWith(".mdx"))
    .map(readPersonFile)
    .filter((p) => Boolean(p.kgId) && (includeBackend || p.visibility === "public"))
    .sort((a, b) => a.kgId.localeCompare(b.kgId));
}

export function getKgPersonIds(): string[] {
  return getAllKgPeople().map((p) => p.kgId);
}

export function getKgPersonById(kgId: string): KgPerson {
  const person = getAllKgPeople().find((p) => p.kgId === kgId);
  if (!person) throw new Error(`KG person not found: ${kgId}`);
  return person;
}
