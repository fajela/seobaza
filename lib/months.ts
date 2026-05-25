/** Ukrainian month names (nominative, capitalized — for headers/breadcrumbs). */
export const UK_MONTH_NAMES: Record<string, string> = {
  "01": "Січень",
  "02": "Лютий",
  "03": "Березень",
  "04": "Квітень",
  "05": "Травень",
  "06": "Червень",
  "07": "Липень",
  "08": "Серпень",
  "09": "Вересень",
  "10": "Жовтень",
  "11": "Листопад",
  "12": "Грудень",
};

/** Ukrainian month names in genitive (for "новини травня"). */
export const UK_MONTH_GENITIVE: Record<string, string> = {
  "01": "січня",
  "02": "лютого",
  "03": "березня",
  "04": "квітня",
  "05": "травня",
  "06": "червня",
  "07": "липня",
  "08": "серпня",
  "09": "вересня",
  "10": "жовтня",
  "11": "листопада",
  "12": "грудня",
};

/** Transliterated Ukrainian month slugs (used in digest filenames). */
export const UK_MONTH_SLUG: Record<string, string> = {
  "01": "sichen",
  "02": "liutyi",
  "03": "berezen",
  "04": "kviten",
  "05": "traven",
  "06": "cherven",
  "07": "lypen",
  "08": "serpen",
  "09": "veresen",
  "10": "zhovten",
  "11": "lystopad",
  "12": "hruden",
};

export function ukMonthName(mm: string): string {
  return UK_MONTH_NAMES[mm] ?? mm;
}

/** Build the URL of the monthly digest post (regular post inside the month folder). */
export function digestUrl(year: string, mm: string): string {
  const slug = UK_MONTH_SLUG[mm];
  if (!slug) return `/news/${year}`;
  return `/news/${year}/${mm}/seo-novyny-${slug}-${year}`;
}
