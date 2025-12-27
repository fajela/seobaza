import Link from "next/link";

export const metadata = {
  title: "База знань - SEO BAZA",
  description: "Корисні матеріали, гайди та документи для SEO-спеціалістів",
};

interface KnowledgeItem {
  title: string;
  description: string;
  url: string;
  type: "pdf" | "external" | "internal";
  tags: string[];
}

const knowledgeItems: KnowledgeItem[] = [
  {
    title: "Указівки для асесорів якості пошуку Google (українською)",
    description:
      "Скорочена версія Search Quality Rater Guidelines - документ, який використовують асесори Google для оцінки якості результатів пошуку",
    url: "/quality-raters-guidelines-short-ukrainian.pdf",
    type: "pdf",
    tags: ["Google", "Quality Raters", "E-E-A-T", "Переклад"],
  },
];

export default function KnowledgeBasePage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-display mb-6 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">База знань</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Корисні матеріали, гайди та документи для SEO-спеціалістів
        </p>

        <div className="grid gap-6">
          {knowledgeItems.map((item, index) => (
            <article
              key={index}
              className="bg-secondary/30 rounded-xl p-6 border border-border transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 group"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                  {item.type === "pdf" ? (
                    <svg
                      className="w-6 h-6 text-accent"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6 text-accent"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h2 className="text-xl font-display mb-2 group-hover:text-accent transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {item.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action */}
                  {item.type === "pdf" ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:text-accent font-medium transition-colors"
                    >
                      Відкрити PDF
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  ) : item.type === "external" ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:text-accent font-medium transition-colors"
                    >
                      Перейти
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  ) : (
                    <Link
                      href={item.url}
                      className="inline-flex items-center gap-2 text-primary hover:text-accent font-medium transition-colors"
                    >
                      Читати
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-12 p-6 bg-muted/30 rounded-xl border border-border">
          <h3 className="text-lg font-display mb-3">
            Хочете додати корисний матеріал?
          </h3>
          <p className="text-muted-foreground">
            Якщо у вас є корисні матеріали для спільноти, напишіть{" "}
            <a
              href="https://t.me/fajela"
              target="_blank"
              rel="noopener noreferrer"
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
