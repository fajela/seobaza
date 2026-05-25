import Link from "next/link";
import { getAllCategoriesWithCounts } from "@/lib/articles";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Категорії — SEO BAZA",
  description:
    "Всі категорії матеріалів про SEO від української спільноти: лінкбілдинг, технічне SEO, AI та SEO, оновлення алгоритмів і багато іншого.",
  alternates: {
    canonical: "https://seobaza.com.ua/category",
  },
};

export default function CategoriesPage() {
  const categories = getAllCategoriesWithCounts();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-display mb-6 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Категорії
        </h1>
        <p className="text-lg text-muted-foreground mb-12">
          Статті українського SEO-ком'юніті, згруповані за темами
        </p>

        <div
          className="grid sm:grid-cols-2 gap-4"
          itemScope
          itemType="https://schema.org/ItemList"
        >
          <meta itemProp="numberOfItems" content={String(categories.length)} />
          {categories.map((category, i) => (
            <div
              key={category.slug}
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <meta itemProp="position" content={String(i + 1)} />
              <link itemProp="url" href={`https://seobaza.com.ua/category/${category.slug}`} />
              <Link href={`/category/${category.slug}`} className="block group">
                <div className="h-full bg-secondary/30 rounded-xl p-6 border border-border transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h2
                      itemProp="name"
                      className="text-xl font-display group-hover:text-accent transition-colors"
                    >
                      {category.displayName}
                    </h2>
                    {category.count > 0 && (
                      <span className="shrink-0 px-2 py-0.5 text-xs font-medium bg-accent/10 text-accent rounded-full">
                        {category.count}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {category.description}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
