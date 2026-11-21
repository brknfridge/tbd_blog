import { COMMENTARY, type CommentaryGroup } from "../data/commentary";
import type { Category } from "../types/product";
import type { RoundResult } from "../types/game";
import type { Rng } from "./randomizer";

export interface Metrics {
  total: number;
  average: number;
  categoryScores: Partial<Record<Category, number>>;
  bestCategory: Category | null;
  worstCategory: Category | null;
  overCount: number;
  underCount: number;
  avgSignedPercent: number | null;
  largestOver: RoundResult | null;
  largestUnder: RoundResult | null;
  excellentCount: number;
  missedCount: number;
}

export function computeMetrics(results: readonly RoundResult[]): Metrics {
  const total = results.reduce((s, r) => s + r.score, 0);
  const byCat = new Map<Category, number[]>();
  for (const r of results) byCat.set(r.category, [...(byCat.get(r.category) ?? []), r.score]);
  const categoryScores: Partial<Record<Category, number>> = {};
  for (const [c, scores] of byCat) categoryScores[c] = scores.reduce((a, b) => a + b, 0) / scores.length;

  const ranked = (Object.entries(categoryScores) as [Category, number][]).sort((a, b) => b[1] - a[1]);
  const valid = results.filter((r) => r.diffPercent !== null);
  const overs = valid.filter((r) => r.diffPercent! > 0).sort((a, b) => b.diffPercent! - a.diffPercent!);
  const unders = valid.filter((r) => r.diffPercent! < 0).sort((a, b) => a.diffPercent! - b.diffPercent!);

  return {
    total,
    average: results.length ? total / results.length : 0,
    categoryScores,
    bestCategory: ranked[0]?.[0] ?? null,
    worstCategory: ranked.length > 1 ? ranked[ranked.length - 1]![0] : null,
    overCount: overs.length,
    underCount: unders.length,
    avgSignedPercent: valid.length ? valid.reduce((s, r) => s + r.diffPercent!, 0) / valid.length : null,
    largestOver: overs[0] ?? null,
    largestUnder: unders[0] ?? null,
    excellentCount: results.filter((r) => r.band === "excellent").length,
    missedCount: results.filter((r) => r.guess === null).length,
  };
}

/** Priority: cross-category contrast → total performance → bias trend → balanced. */
export function commentaryGroup(m: Metrics): CommentaryGroup {
  const g = m.categoryScores.grocery;
  const l = m.categoryScores.luxury;
  const o = m.categoryScores.one_off;
  if (g !== undefined && l !== undefined && g >= 800 && l < 400) return "groceryNotLuxury";
  if (g !== undefined && l !== undefined && l >= 800 && g < 400) return "luxuryNotGrocery";
  if (g !== undefined && o !== undefined && o >= 800 && g < 400) return "oneOffNotGrocery";
  if (m.total >= 4000) return "excellent";
  if (m.total < 1500) return "poor";
  if (m.overCount >= 4) return "over";
  if (m.underCount >= 4) return "under";
  return "balanced";
}

/** Picks a line from the matched group, avoiding recently used lines when possible. */
export function selectCommentary(m: Metrics, rng: Rng, recent: readonly string[] = []): string {
  const lines: readonly string[] = COMMENTARY[commentaryGroup(m)];
  const fresh = lines.filter((l) => !recent.includes(l));
  const pool = fresh.length ? fresh : lines;
  return pool[Math.floor(rng() * pool.length)]!;
}

export const CATEGORY_LABEL: Record<Category, string> = {
  grocery: "Groceries",
  beauty: "Beauty & Personal Care",
  luxury: "Luxury",
  one_off: "One-Off Purchases",
};
