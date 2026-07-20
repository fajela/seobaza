import Link from "next/link";
import { getAllKgPeople } from "@/lib/kg";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Граф знань SEO Baza: люди, компанії та події спільноти",
  description:
    "SEO Baza будує власний граф знань української SEO-спільноти. Всередині люди зі стабільними айді, компанії та події, кожен факт із джерелом. Загляньте.",
  alternates: { canonical: "https://seobaza.com.ua/kg" },
};

export default function KgIndexPage() {
  const peopleCount = getAllKgPeople().length;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-display mb-3">Граф знань SEO Baza</h1>
        <p className="text-muted-foreground mb-10 max-w-2xl">
          Ми будуємо власний граф знань української SEO-спільноти: люди, компанії,
          події і теми, повʼязані між собою. Кожен запис має стабільний
          ідентифікатор і джерело факту.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link href="/kg/person" className="block group">
            <div className="p-6 rounded-xl border border-border bg-secondary/20 group-hover:border-accent/50 group-hover:bg-secondary/40 transition-all">
              <h2 className="font-display text-xl mb-1 group-hover:text-accent transition-colors">
                Люди
              </h2>
              <p className="text-sm text-muted-foreground">
                {peopleCount} профіл{peopleCount === 1 ? "ь" : peopleCount < 5 ? "і" : "ів"}: спікери мітапів та експерти спільноти
              </p>
            </div>
          </Link>
          <div className="p-6 rounded-xl border border-dashed border-border bg-secondary/10">
            <h2 className="font-display text-xl mb-1 text-muted-foreground">
              Компанії та події
            </h2>
            <p className="text-sm text-muted-foreground">
              Уже в графі, сторінки скоро
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
