import type { Category } from "./product";

export type Mode = "daily" | "endless";

/** Which mandatory slot a round fills. */
export type Slot = Category | "wildcard";

export type Band = "excellent" | "close" | "not_quite" | "way_off" | "missed";

export interface RoundState {
  productId: string;
  slot: Slot;
  /** Epoch ms when the card became ready and the clock started. */
  readyAt: number | null;
  /** Epoch ms when the round ends. readyAt + ROUND_MS. Persisted so refresh can't reset it. */
  deadline: number | null;
  /** In-progress digits for the current round, restored on refresh. */
  draft: string;
  /** Final guess in rupees, or null for a missed round. */
  guess: number | null;
  score: number | null;
  timedOut: boolean;
  resolved: boolean;
}

export type Phase = "playing" | "reveal" | "done";

export interface GameState {
  version: 1;
  id: string;
  mode: Mode;
  /** IST calendar date (YYYY-MM-DD) for daily games. */
  dateKey: string | null;
  challengeNumber: number | null;
  rounds: RoundState[];
  current: number;
  phase: Phase;
  startedAt: number;
  finishedAt: number | null;
  commentary: string | null;
}

/** A resolved round joined with its product + answer, for results and commentary. */
export interface RoundResult {
  productId: string;
  brand: string;
  name: string;
  variant: string;
  category: Category;
  slot: Slot;
  imageUrl: string;
  guess: number | null;
  actual: number;
  score: number;
  band: Band;
  /** Signed % difference, null for missed rounds. */
  diffPercent: number | null;
  timedOut: boolean;
  priceSource: string;
  priceType: string;
  verifiedAt: string;
}
