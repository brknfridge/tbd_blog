import type { Category, Product } from "../types/product";
import { POOLS } from "../config";
import type { Slot } from "../types/game";
import { shuffle, type Rng } from "./randomizer";

export const MANDATORY: readonly Category[] = ["grocery", "beauty", "luxury", "one_off"];

export interface QuizPick {
  product: Product;
  slot: Slot;
}

export class InsufficientProductsError extends Error {
  constructor(public readonly missing: string[]) {
    super(
      missing.length
        ? `Not enough verified products in: ${missing.join(", ")}.`
        : "Not enough verified products to build a quiz.",
    );
    this.name = "InsufficientProductsError";
  }
}

export function productPool(p: Product): number {
  return p.pool ?? 1;
}

/** The pool live on an IST date: the last entry in POOLS whose `from` is on or before it. */
export function poolForDate(dateKey: string): number {
  let pool = POOLS[0]!.pool;
  for (const p of POOLS) if (p.from <= dateKey) pool = p.pool;
  return pool;
}

export function latestPool(): number {
  return Math.max(...POOLS.map((p) => p.pool));
}

export function inPool(products: readonly Product[], pool: number): Product[] {
  return products.filter((p) => productPool(p) === pool);
}

/** Only verified, priced, active records are ever playable. */
export function eligible(products: readonly Product[]): Product[] {
  return products
    .filter((p) => p.active && p.priceINR > 0 && p.priceSource && p.verifiedAt)
    .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

/**
 * One product per mandatory category plus one wildcard from any category,
 * all distinct, in random order. `avoid` is a soft exclusion: those ids are
 * skipped when there are enough alternatives in that category.
 */
export function selectQuiz(
  products: readonly Product[],
  rng: Rng,
  avoid: ReadonlySet<string> = new Set(),
): QuizPick[] {
  const pool = eligible(products);
  const missing = MANDATORY.filter((c) => !pool.some((p) => p.category === c));
  if (missing.length || pool.length < MANDATORY.length + 1) {
    throw new InsufficientProductsError(missing);
  }

  const chosen = new Set<string>();
  const picks: QuizPick[] = [];
  const prefer = (candidates: Product[]): Product => {
    const fresh = candidates.filter((p) => !avoid.has(p.id));
    const list = shuffle(fresh.length ? fresh : candidates, rng);
    return list[0]!;
  };

  for (const category of MANDATORY) {
    const candidates = pool.filter((p) => p.category === category && !chosen.has(p.id));
    const product = prefer(candidates);
    chosen.add(product.id);
    picks.push({ product, slot: category });
  }

  const rest = pool.filter((p) => !chosen.has(p.id));
  const wildcard = prefer(rest);
  picks.push({ product: wildcard, slot: "wildcard" });

  return shuffle(picks, rng);
}
