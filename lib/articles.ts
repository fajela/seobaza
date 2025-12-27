import fs from "fs";
import path from "path";
import matter from "gray-matter";

const articlesDirectory = path.join(process.cwd(), "content/articles");

export interface ArticleMetadata {
  title: string;
  h1?: string;
  description: string;
  image?: string;
  author: string;
  authorLink?: string;
  editor?: string;
  editorLink?: string;
  date: string;
  tags: string[];
  slug: string;
}

export interface Article extends ArticleMetadata {
  content: string;
}

export function getArticleSlugs(): string[] {
  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }
  return fs.readdirSync(articlesDirectory);
}

export function getArticleBySlug(slug: string): Article {
  const realSlug = slug.replace(/\.mdx$/, "");
  const fullPath = path.join(articlesDirectory, `${realSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug: realSlug,
    title: data.title,
    h1: data.h1,
    description: data.description,
    image: data.image,
    author: data.author,
    authorLink: data.authorLink,
    editor: data.editor,
    editorLink: data.editorLink,
    date: data.date,
    tags: data.tags || [],
    content,
  };
}

export function getAllArticles(): ArticleMetadata[] {
  const slugs = getArticleSlugs();
  const articles = slugs
    .map((slug) => {
      try {
        return getArticleBySlug(slug);
      } catch {
        return null;
      }
    })
    .filter((article): article is Article => article !== null)
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return articles.map(({ content, ...metadata }) => metadata);
}
