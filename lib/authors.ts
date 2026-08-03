import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getAllArticles, type ArticleMetadata } from "./articles";
import { getNewsByAuthorName, type NewsMetadata } from "./news";

const authorsDirectory = path.join(process.cwd(), "content/authors");

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthorMetadata {
  slug: string;
  name: string;
  // English (or otherwise Latin-script) spelling of the name. An array when the
  // person is findable under more than one form — Google matches entities by
  // name string, so every form they actually use needs to be stated.
  alternateName?: string | string[];
  googleKgId?: string; // Google Knowledge Graph MID, e.g. "/g/11f3pg5hw6"
  role: string;
  bio: string;
  image?: string;
  telegram?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  website?: string; // personal website / blog
  fajelaAbout?: string; // Fajela consultancy "about" page
  company?: string; // worksFor organization (defaults to SEO BAZA when absent)
  companyUrl?: string;
  city?: string;
  topics?: string[]; // free-form expertise topics, rendered as knowsAbout chips
  sameAs?: string[]; // extra profile/mention URLs beyond the header socials
  expertise: string[]; // category slugs
}

export interface Author extends AuthorMetadata {
  content: string; // optional extended MDX bio
}

/** Normalize `alternateName` (string, array or absent) to a list. */
export function altNames(value?: string | string[]): string[] {
  if (!value) return [];
  return (Array.isArray(value) ? value : [value]).filter(Boolean);
}

/** Canonical Google Knowledge Graph entity URI for a MID like "/g/11f3pg5hw6". */
export function googleKgUrl(mid: string): string {
  return `https://g.co/kg${mid}`;
}

/**
 * Absolute form of a site-relative path, for markup values. Microdata hands
 * consumers the raw attribute, so a relative `src` leaves them resolving it
 * themselves — structured data values are always absolute.
 */
export function absoluteUrl(pathOrUrl: string): string {
  return pathOrUrl.startsWith("/")
    ? `https://seobaza.com.ua${pathOrUrl}`
    : pathOrUrl;
}

interface PersonLinks {
  telegram?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  website?: string;
  fajelaAbout?: string;
  sameAs?: string[];
  googleKgId?: string;
}

/**
 * Profiles shown to readers as chips, in display order, duplicates dropped.
 * Only real profiles a person would want clicked.
 */
export function profileUrls(person: PersonLinks): string[] {
  const urls = [
    person.telegram,
    person.linkedin,
    person.twitter,
    person.instagram,
    person.facebook,
    person.website,
    ...(person.sameAs ?? []),
  ].filter((u): u is string => Boolean(u));
  return [...new Set(urls)];
}

/**
 * sameAs values that belong in the markup but NOT on the page: the Google
 * Knowledge Graph entity URI and the Fajela about page. Returned without
 * anything already rendered as a visible chip, so no URL is a sameAs twice.
 */
export function hiddenSameAs(person: PersonLinks): string[] {
  const shown = new Set(profileUrls(person));
  const urls = [
    person.fajelaAbout,
    person.googleKgId ? googleKgUrl(person.googleKgId) : undefined,
  ].filter((u): u is string => Boolean(u));
  return [...new Set(urls)].filter((u) => !shown.has(u));
}

// ─── Read helpers ─────────────────────────────────────────────────────────────

export function getAuthorSlugs(): string[] {
  if (!fs.existsSync(authorsDirectory)) return [];
  return fs
    .readdirSync(authorsDirectory)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(".mdx", ""));
}

export function getAuthorBySlug(slug: string): Author {
  const fullPath = path.join(authorsDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
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

export function getAllAuthors(): AuthorMetadata[] {
  return getAuthorSlugs()
    .map((slug) => {
      try {
        const { content, ...meta } = getAuthorBySlug(slug);
        return meta;
      } catch {
        return null;
      }
    })
    .filter((a): a is AuthorMetadata => a !== null);
}

// ─── Article/news lookup ──────────────────────────────────────────────────────

export function getArticlesByAuthorName(
  authorName: string
): ArticleMetadata[] {
  return getAllArticles().filter(
    (a) => a.author.toLowerCase() === authorName.toLowerCase()
  );
}

export { getNewsByAuthorName };

/**
 * Resolve an author name (as found in MDX frontmatter) to its on-site slug.
 * Returns null if there is no author page for that name.
 */
export function getAuthorSlugByName(authorName: string): string | null {
  if (!authorName) return null;
  const target = authorName.trim().toLowerCase();
  for (const author of getAllAuthors()) {
    if (author.name.toLowerCase() === target) return author.slug;
    if (altNames(author.alternateName).some((n) => n.toLowerCase() === target)) {
      return author.slug;
    }
  }
  return null;
}
