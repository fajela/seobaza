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
    city: data.city,
    topics: data.topics,
    sameAs: data.sameAs,
    expertise: data.expertise ?? [],
    content,
  };
}

export function getAllKgPeople(): KgPerson[] {
  if (!fs.existsSync(kgPersonDirectory)) return [];
  return fs
    .readdirSync(kgPersonDirectory)
    .filter((f) => f.endsWith(".mdx"))
    .map(readPersonFile)
    .filter((p) => Boolean(p.kgId))
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
