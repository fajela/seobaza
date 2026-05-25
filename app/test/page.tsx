import Link from "next/link";
import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";

export const metadata = {
  title: "Тести SEO BAZA - Експерименти та дослідження",
  description: "SEO експерименти та тести від української спільноти",
  alternates: { canonical: "https://seobaza.com.ua/test" },
};

async function getTests() {
  const testsPath = path.join(process.cwd(), "content", "tests");

  try {
    const files = await fs.readdir(testsPath);
    const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

    const tests = await Promise.all(
      mdxFiles.map(async (file) => {
        const filePath = path.join(testsPath, file);
        const fileContent = await fs.readFile(filePath, "utf8");
        const { data } = matter(fileContent);

        return {
          slug: file.replace(".mdx", ""),
          title: data.title || "Untitled",
          description: data.description || "",
        };
      })
    );

    return tests;
  } catch (error) {
    return [];
  }
}

export default async function TestPage() {
  const tests = await getTests();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-display mb-6 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          SEO BAZA тестує
        </h1>
        <p className="text-lg text-muted-foreground mb-12">
          Експерименти, гіпотези та практичні перевірки від спільноти.
        </p>

        <div className="grid gap-6">
          {tests.map((test, index) => (
            <Link
              key={test.slug}
              href={`/test/${test.slug}`}
              className="block group"
            >
              <article className="bg-secondary/30 rounded-xl p-6 border border-border transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10">
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <h2 className="text-xl font-display mb-2 group-hover:text-accent transition-colors">
                      {test.title}
                    </h2>
                    <p className="text-muted-foreground">{test.description}</p>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="mt-12 p-6 bg-muted/30 rounded-xl border border-border">
          <p className="text-center text-muted-foreground">
            Є ідея для тесту? Напишіть{" "}
            <a
              href="https://t.me/fajela"
              target="_blank"

              className="text-primary hover:text-accent underline transition-colors"
            >
              @fajela
            </a>{" "}
            в Telegram
          </p>
        </div>
      </div>
    </div>
  );
}
