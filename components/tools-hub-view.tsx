import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ToolsCatalog } from "@/components/tools-catalog";
import { getCategoryConceptLinks, getSectionConceptLinks, TOOL_CATEGORIES, getAllTools, getToolsByCategory } from "@/lib/tools";
import { TOOLS_BASE, toolCategoryUrl } from "@/lib/tools-types";

/** /kg/tool: каталог сервісів. */
export function ToolsHubView() {
  const tools = getAllTools();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-5xl mx-auto">
        <Breadcrumbs items={[{ name: "Граф знань", href: "/kg" }, { name: "Інструменти", href: TOOLS_BASE }]} />
        <h1 className="text-4xl sm:text-5xl font-display mb-6 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          SEO-інструменти і сервіси в графі знань SEO Baza
        </h1>
        <p className="text-lg text-muted-foreground mb-4">
          {tools.length} SEO-інструментів і сервісів для просування під англомовні ринки: AI, технічний
          аудит, збір семантики, лінкбілдинг, локальне SEO і робота агенції.
        </p>
        <p className="text-muted-foreground mb-10">
          Список не є рекомендацією, відверто поганих сервісів тут немає.
        </p>

        <nav aria-label="Категорії" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          {TOOL_CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={toolCategoryUrl(c.slug)}
              className="rounded-xl p-4 border border-border bg-secondary/30 transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10"
            >
              <span className="block font-display text-lg">{c.name}</span>
              <span className="text-sm text-muted-foreground">{getToolsByCategory(c.slug).length} сервісів</span>
            </Link>
          ))}
        </nav>

        <ToolsCatalog
          tools={tools}
          categories={TOOL_CATEGORIES}
          showCategoryHeadings
          showReview={process.env.NODE_ENV === "development"}
          sectionConcepts={getSectionConceptLinks()}
          categoryConcepts={getCategoryConceptLinks()}
        />
      </div>
    </div>
  );
}
