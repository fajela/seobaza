import fs from "fs";
import path from "path";

/**
 * Каталог SEO-сервісів (/kg/tool). Джерело: content/tools/tools.json, один запис = один сервіс.
 * Перенесено зі старої таблиці «Корисні сервіси та інструменти у SEO під бурж» (25.10.2026).
 */

import type { ToolCategory, Tool } from "./tools-types";
import { resolveEntityRef } from "./kg-entities";
import { toolSectionId } from "./tools-types";

export type { UaMark, Tool, ToolCategory } from "./tools-types";
export { UA_MARK_LABELS } from "./tools-types";

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    slug: "ai",
    name: "AI",
    h1: "AI-інструменти для SEO: асистенти, моделі, трекінг видимості",
    title: "AI-інструменти для SEO: асистенти, моделі й трекінг | SEO Baza",
    description:
      "ChatGPT, Claude, Gemini, відкриті моделі, генерація текстів і зображень, трекінг бренду в AI-пошуку: Waikay, Profound, Peec AI. Обери свій!",
    intro:
      "AI-асистенти, відкриті моделі, які можна запустити на своєму комп'ютері, генерація текстів і зображень та сервіси, що показують, як AI-пошук бачить твій бренд.",
  },
  {
    slug: "tekhnichnyi-audyt",
    name: "Технічний аудит",
    h1: "Інструменти для технічного SEO-аудиту",
    title: "Інструменти для технічного SEO-аудиту: краулери і логи | SEO Baza",
    description:
      "Краулери, аналіз логів, валідатори, швидкість сайту і JavaScript SEO: сервіси для технічної перевірки сайту. Обери інструмент під свою задачу!",
    intro:
      "Технічний аудит сайту починається з краулера, а далі йдуть логи сервера, дані Search Console, швидкість і рендеринг JavaScript. Тут зібрані сервіси для кожного з цих кроків.",
  },
  {
    slug: "semantyka-i-kontent",
    name: "Семантика і контент",
    h1: "Сервіси для збору семантики і роботи з контентом",
    title: "Сервіси для збору семантики і роботи з контентом | SEO Baza",
    description:
      "Збір ключових слів, кластеризація, перевірка позицій, унікальність і оптимізація текстів: інструменти для семантики. Знайди потрібний сервіс!",
    intro:
      "Збір ключових слів, частотність, кластеризація запитів, позиції в пошуку і підготовка текстів. Сервіси згруповані за етапами роботи з семантичним ядром і контентом.",
  },
  {
    slug: "linkbilding",
    name: "Лінкбілдинг",
    h1: "Інструменти для лінкбілдингу і аналізу посилань",
    title: "Інструменти для лінкбілдингу: бази посилань, outreach | SEO Baza",
    description:
      "Бази зворотних посилань, аудит профілю, outreach, пошук контактів, дропи і вебархів: сервіси для нарощування посилань. Переглянь увесь список!",
    intro:
      "Аналіз зворотних посилань, пошук донорів, outreach і робота з дропами. Список не є рекомендацією, частину сервісів додано, щоб було видно, як працюють інші.",
  },
  {
    slug: "lokalne-seo",
    name: "Локальне SEO",
    h1: "Інструменти для локального SEO і Google Business Profile",
    title: "Інструменти для локального SEO і Google Business Profile | SEO Baza",
    description:
      "Аудит і керування Google Business Profile, позиції в картах, citations і відгуки: сервіси для просування в локальному пошуку. Обери свій!",
    intro:
      "Просування бізнесу в Google Maps і локальній видачі: аудит профілю компанії, перевірка позицій у картах, каталоги citations і робота з відгуками.",
  },
  {
    slug: "ahentsii",
    name: "Агенції",
    h1: "Сервіси для SEO-агенцій: CRM, звіти, автоматизація",
    title: "Сервіси для SEO-агенцій: CRM, звіти й автоматизація | SEO Baza",
    description:
      "CRM, звіти для клієнтів, white label, трекери часу і планувальники: інструменти, які спрощують роботу SEO-агенції. Подивись добірку!",
    intro:
      "Інструменти для керування агенцією: звіти для клієнтів, CRM для продажів, white label сервіси, облік часу і планування задач команди.",
  },
  {
    slug: "partnerski-prohramy",
    name: "Партнерські програми",
    h1: "Партнерські програми для affiliate-сайтів",
    title: "Партнерські програми для affiliate-сайтів під бурж | SEO Baza",
    description:
      "Партнерські мережі для англомовних ринків з нішами, у яких вони найсильніші, і інструменти для affiliate-маркетингу. Знайди свою мережу!",
    intro:
      "Партнерські мережі для сайтів під англомовні ринки. Біля кожної вказані ніші, у яких мережа найсильніша. Умови виплат часто змінюються, актуальні є на сайті кожної мережі.",
  },
  {
    slug: "inshi",
    name: "Інші",
    h1: "Інші корисні сервіси для SEO: індексація, API, графи знань",
    title: "Сервіси для індексації, API і графів знань у SEO | SEO Baza",
    description:
      "Індексатори, API-сервіси, графи знань, генератори сайтів, інтелект-карти й аналіз даних: те, що не ввійшло в інші розділи. Подивись добірку!",
    intro:
      "Індексатори, SEO API, інструменти для графів знань, аналізу даних і планування. Усе, що не вмістилося в попередні категорії.",
  },
];

export function getToolCategory(slug: string): ToolCategory | undefined {
  return TOOL_CATEGORIES.find((c) => c.slug === slug);
}

let cache: Tool[] | null = null;

export function getAllTools(): Tool[] {
  if (cache) return cache;
  const file = path.join(process.cwd(), "content/tools/tools.json");
  const tools = (JSON.parse(fs.readFileSync(file, "utf8")) as Tool[]).map((t) =>
    ({
      ...t,
      ...(t.entity ? { entityHref: resolveEntityRef(t.entity).href } : {}),
      ...(t.people?.length
        ? {
            peopleRefs: t.people
              .map((id) => resolveEntityRef(id))
              .filter((r) => r.href)
              .map((r) => ({ name: r.name, href: r.href as string })),
          }
        : {}),
    })
  );
  // У dev без кешу, щоб правки tools.json було видно одразу.
  if (process.env.NODE_ENV === "production") cache = tools;
  return tools;
}

export function getToolsByCategory(slug: string): Tool[] {
  return getAllTools().filter((t) => t.category === slug);
}

export function getToolsForEntity(slug: string): Tool[] {
  return getAllTools().filter((t) => t.entity === slug);
}

// Прив'язка категорій і розділів каталогу до сутностей-концептів графу
// (content/tools/concepts.json, рішення Олесі 25.10.2026). Значення перевіряє check-entities.
interface ConceptMap {
  categories: Record<string, string>;
  sections: Record<string, string>;
}

let conceptCache: ConceptMap | null = null;

function getConceptMap(): ConceptMap {
  if (conceptCache && process.env.NODE_ENV === "production") return conceptCache;
  const file = path.join(process.cwd(), "content/tools/concepts.json");
  conceptCache = JSON.parse(fs.readFileSync(file, "utf8")) as ConceptMap;
  return conceptCache;
}

export interface ConceptLink {
  name: string;
  href: string;
}

/** Опублікований хаб концепту для slug; чернетки не лінкуємо. */
function conceptLink(id: string | undefined): ConceptLink | undefined {
  if (!id) return undefined;
  const ref = resolveEntityRef(id);
  return ref.href ? { name: ref.name, href: ref.href } : undefined;
}

/** Категорія → посилання на хаб концепту, тільки для опублікованих хабів. */
export function getCategoryConceptLinks(): Record<string, ConceptLink> {
  const out: Record<string, ConceptLink> = {};
  for (const [cat, id] of Object.entries(getConceptMap().categories)) {
    const link = conceptLink(id);
    if (link) out[cat] = link;
  }
  return out;
}

/** Розділ → посилання на хаб концепту, тільки для опублікованих хабів. */
export function getSectionConceptLinks(): Record<string, ConceptLink> {
  const out: Record<string, ConceptLink> = {};
  for (const [section, id] of Object.entries(getConceptMap().sections)) {
    const link = conceptLink(id);
    if (link) out[section] = link;
  }
  return out;
}

/** Що з каталогу прив'язано до концепту: категорії й розділи з кількістю сервісів. */
export function getCatalogLinksForConcept(id: string): { label: string; href: string; count: number }[] {
  const map = getConceptMap();
  const tools = getAllTools();
  const out: { label: string; href: string; count: number }[] = [];
  for (const [cat, c] of Object.entries(map.categories)) {
    if (c !== id) continue;
    const category = getToolCategory(cat);
    if (category)
      out.push({ label: category.h1, href: `/kg/tool#${cat}`, count: tools.filter((t) => t.category === cat).length });
  }
  for (const [section, c] of Object.entries(map.sections)) {
    if (c !== id) continue;
    for (const cat of TOOL_CATEGORIES) {
      const n = tools.filter((t) => t.category === cat.slug && t.section === section).length;
      if (n) out.push({ label: `${cat.name}: ${section}`, href: `/kg/tool#${toolSectionId(cat.slug, section)}`, count: n });
    }
  }
  return out;
}

// OG-картки каталогу (scripts/og-cards-tools.py), 1200×630 jpg.

/** OG-картинка для /kg/tool. */
export function getToolsOgImage(): { path: string; alt: string } {
  return {
    path: "/images/og/kg/seo-instrumenty-katalog-servisiv.jpg",
    alt: "Каталог SEO-інструментів і сервісів SEO Baza з українськими мітками",
  };
}
