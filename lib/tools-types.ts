import { slug } from "github-slugger";

// Типи каталогу без fs: їх імпортує клієнтський компонент tools-catalog.

/** Українські позначки. Ставити тільки з перевіреним джерелом у `uaSources`. */
export type UaMark = "in-ukraine" | "founded-by-ukrainians" | "supports-ukraine";

export const UA_MARK_LABELS: Record<UaMark, string> = {
  "in-ukraine": "Компанія в Україні",
  "founded-by-ukrainians": "Засновано українцями",
  "supports-ukraine": "Підтримує Україну",
};

export interface Tool {
  name: string;
  url: string;
  category: string;
  section: string;
  description: string;
  ua?: UaMark[];
  /** Джерело для кожної позначки з `ua`: URL сторінки, де це твердження знайдено. */
  uaSources?: Partial<Record<UaMark, string>>;
  /** Сутність графу знань, якою є цей сервіс (slug з content/kg). */
  entity?: string;
  /** Адреса сторінки сутності; заповнює сервер, тільки якщо сторінка опублікована. */
  entityHref?: string;
  /** Автори або засновники, які є людьми в графі (sb-id з content/kg/person). */
  people?: string[];
  /** Посилання на сторінки цих людей; заповнює сервер, тільки для публічних сторінок. */
  peopleRefs?: { name: string; href: string }[];
  /** Примітка редактору: що перевірити. Показується тільки в dev. */
  review?: string;
}

export interface ToolCategory {
  slug: string;
  name: string;
  h1: string;
  title: string;
  description: string;
  intro: string;
}

/** Каталог живе всередині графу знань: одна сторінка /kg/tool, категорії й розділи = якорі на ній
 * (рішення Олесі 25.10.2026: окремі сторінки категорій, можливо, згодом). */
export const TOOLS_BASE = "/kg/tool";

export function toolCategoryUrl(slug: string): string {
  return `${TOOLS_BASE}#${slug}`;
}

/** id якоря розділу: категорія + розділ, бо назви розділів повторюються між категоріями. */
export function toolSectionId(categorySlug: string, section: string): string {
  return `${categorySlug}--${slug(section)}`;
}
