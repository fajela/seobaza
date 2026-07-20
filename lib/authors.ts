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
  alternateName?: string; // e.g. English transliteration for a Ukrainian-named author
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
    if (author.alternateName && author.alternateName.toLowerCase() === target) {
      return author.slug;
    }
  }
  return null;
}
