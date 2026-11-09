import { pageMeta } from "@/lib/page-metadata";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { GoogleSearch } from "@/components/google-search";

export const metadata = pageMeta({
  title: "Пошук по сайту SEO Baza: новини, статті, відео",
  description:
    "Шукайте серед новин SEO, статей, бази знань, відео та профілів графа знань SEO Baza. Введіть запит і знайдіть потрібний матеріал!",
  path: "/search",
});

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <Breadcrumbs
          items={[
            { name: "Головна", href: "/" },
            { name: "Пошук", href: "/search" },
          ]}
        />
        <h1 className="text-4xl sm:text-5xl font-display mb-4 text-center bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Пошук по SEO Baza
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          Пошук охоплює новини, статті, базу знань, відео, події та граф знань.
          Результати видає Google.
        </p>
        <GoogleSearch />
      </div>
    </div>
  );
}
