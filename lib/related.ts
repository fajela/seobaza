// ─── "Схожі матеріали" by shared entities ─────────────────────────────────────
// Materials are related when they cover the same entities (hubs and people from
// the knowledge graph). A rare shared entity says more than a common one: two
// posts that both mention Google say little, two posts about INP say a lot, so
// each shared entity is weighted by inverse document frequency. Similarity is the
// cosine of the IDF-weighted entity sets, so a Friday digest tagged with forty
// entities does not beat a focused post that shares the two that matter. For news
// a recency decay keeps old posts from crowding out fresh ones; articles are
// evergreen and rank without it.

export interface RelatedCandidate {
  slug: string;
  date: string;
  entities?: string[];
}

/** Rank candidates by IDF-weighted shared entities; returns only those sharing at least one. */
export function rankByEntities<T extends RelatedCandidate>(
  current: T,
  pool: T[],
  limit: number,
  /** Days at which an item's score halves; null for evergreen content (articles). */
  halfLifeDays: number | null = 60,
): T[] {
  const mine = new Set(current.entities ?? []);
  if (mine.size === 0) return [];

  const df = new Map<string, number>();
  for (const item of pool) for (const e of new Set(item.entities ?? [])) df.set(e, (df.get(e) ?? 0) + 1);
  const n = pool.length;
  const idf = (e: string) => Math.log(1 + n / (df.get(e) ?? 1));

  const norm = (ids: Iterable<string>) => Math.sqrt([...ids].reduce((sum, e) => sum + idf(e) ** 2, 0));
  const mineNorm = norm(mine);

  const currentTime = new Date(current.date).getTime();
  return pool
    .filter((item) => item.slug !== current.slug)
    .map((item) => {
      const theirs = new Set(item.entities ?? []);
      const shared = [...theirs].filter((e) => mine.has(e));
      const cosine = shared.reduce((sum, e) => sum + idf(e) ** 2, 0) / (mineNorm * norm(theirs) || 1);
      const ageDays = Math.abs(currentTime - new Date(item.date).getTime()) / 86_400_000;
      const decay = halfLifeDays ? 1 + ageDays / halfLifeDays : 1;
      return { item, shared: shared.length, score: cosine / decay };
    })
    .filter((s) => s.shared > 0)
    .sort((a, b) => b.score - a.score || new Date(b.item.date).getTime() - new Date(a.item.date).getTime())
    .slice(0, limit)
    .map((s) => s.item);
}
