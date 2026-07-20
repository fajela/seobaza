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

        <div className="prose prose-lg dark:prose-invert max-w-none mt-14">
          <h2>Що таке граф знань</h2>
          <p>
            Граф знань складається з сутностей і звʼязків між ними: людина
            виступає на події, працює в компанії, знається на темі. Кожен факт у
            нашому графі має джерело і дату перевірки, тому завжди видно, звідки
            він узявся і наскільки йому вірити.
          </p>

          <h2>Чим це відрізняється від бази даних</h2>
          <p>
            Звичайна база даних тримає записи в таблицях і добре відповідає на
            запити, які передбачили наперед. У графі звʼязки самі є даними, тому
            питання про те, хто з ким виступав і на яких темах, розвʼязується
            одним обходом звʼязків, без нових таблиць і без join-ів.
          </p>

          <h2>Навіщо він спільноті</h2>
          <p>
            Google звіряє людей і бренди через такі самі звʼязки: сторінки з
            розміткою Person і sameAs допомагають панелям знань і AI-відповідям
            упізнавати наших спеціалістів. А ще це памʼять спільноти: хто що
            робив, де виступав і що з цього вийшло.
          </p>

          <h2>Чому не просто RAG</h2>
          <p>
            RAG шукає схожі шматки тексту і добре переказує документи. При цьому
            він не знає, що та сама людина в трьох джерелах названа трьома
            способами, і не тримає джерело кожного твердження. Граф гарантує
            обидві речі, а RAG поверх графа відповідає точніше, такий підхід
            називають GraphRAG.
          </p>

          <h2>Як почати свій</h2>
          <ol>
            <li>
              Визнач сутності і схему: які типи вузлів і звʼязків тобі потрібні.
              Ми стартували з пʼяти типів: Person, Organization, Event, Topic,
              Place.
            </li>
            <li>
              Збирай факти разом із джерелом і датою перевірки. У нас це форма
              спікера плюс перевірка кожного факту у відкритих джерелах.
            </li>
            <li>
              Тримай граф у форматі, з якого все генерується. У нас це один
              JSON-файл, з нього збираються Cypher для Neo4j і візуалізація.
            </li>
            <li>
              Виводь сутності на сайт сторінками з розміткою Person і sameAs,
              щоб граф читали і люди, і пошуковики.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
