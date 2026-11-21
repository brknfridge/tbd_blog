import { ROUNDS_PER_GAME } from "../config";
import type { GameState, Mode, RoundResult, RoundState } from "../types/game";
import type { Answer, PublicProduct } from "../types/product";
import { digitsToNumber } from "./formatting";
import type { QuizPick } from "./quiz";
import { calculateScore, differencePercent, scoreBand } from "./scoring";
import { deadlineFrom, isExpired } from "./timer";

export interface Catalog {
  getProduct(id: string): PublicProduct | undefined;
  getAnswer(id: string): Answer | undefined;
}

export function createGame(
  mode: Mode,
  picks: QuizPick[],
  opts: { dateKey?: string; challengeNumber?: number; now?: number; id?: string } = {},
): GameState {
  if (picks.length !== ROUNDS_PER_GAME) throw new Error(`A game needs ${ROUNDS_PER_GAME} products.`);
  const now = opts.now ?? Date.now();
  return {
    version: 1,
    id: opts.id ?? `${mode}-${now.toString(36)}`,
    mode,
    dateKey: opts.dateKey ?? null,
    challengeNumber: opts.challengeNumber ?? null,
    rounds: picks.map<RoundState>(({ product, slot }) => ({
      productId: product.id,
      slot,
      readyAt: null,
      deadline: null,
      draft: "",
      guess: null,
      score: null,
      timedOut: false,
      resolved: false,
    })),
    current: 0,
    phase: "playing",
    startedAt: now,
    finishedAt: null,
    commentary: null,
  };
}

export function currentRound(state: GameState): RoundState {
  return state.rounds[state.current]!;
}

function updateCurrent(state: GameState, patch: Partial<RoundState>): GameState {
  const rounds = state.rounds.slice();
  rounds[state.current] = { ...rounds[state.current]!, ...patch };
  return { ...state, rounds };
}

/** Starts the clock — called once the card and controls are on screen. Idempotent. */
export function markReady(state: GameState, now = Date.now()): GameState {
  const round = currentRound(state);
  if (state.phase !== "playing" || round.deadline !== null) return state;
  return updateCurrent(state, { readyAt: now, deadline: deadlineFrom(now) });
}

export function setDraft(state: GameState, draft: string): GameState {
  const round = currentRound(state);
  if (state.phase !== "playing" || round.resolved || round.draft === draft) return state;
  return updateCurrent(state, { draft });
}

/**
 * Locks the current round. Safe to call twice (button + timeout racing):
 * the second call is a no-op. A null/invalid guess scores 0.
 */
export function resolveRound(
  state: GameState,
  catalog: Catalog,
  input: { guess: number | null; timedOut: boolean },
): GameState {
  const round = currentRound(state);
  if (state.phase !== "playing" || round.resolved) return state;
  const answer = catalog.getAnswer(round.productId);
  const actual = answer?.priceINR ?? 0;
  const guess = input.guess !== null && input.guess > 0 ? input.guess : null;
  const score = guess !== null ? calculateScore(guess, actual) : 0;
  const next = updateCurrent(state, { guess, score, timedOut: input.timedOut, resolved: true });
  return { ...next, phase: "reveal" };
}

/** Called on load / tab return: a round whose deadline passed is resolved with its draft. */
export function resolveIfExpired(state: GameState, catalog: Catalog, now = Date.now()): GameState {
  const round = currentRound(state);
  if (state.phase !== "playing" || round.resolved || !isExpired(round.deadline, now)) return state;
  return resolveRound(state, catalog, { guess: digitsToNumber(round.draft), timedOut: true });
}

/** Manual only — the next round never starts on its own. */
export function advance(state: GameState, now = Date.now()): GameState {
  if (state.phase !== "reveal") return state;
  if (state.current + 1 < state.rounds.length) {
    return { ...state, current: state.current + 1, phase: "playing" };
  }
  return { ...state, phase: "done", finishedAt: now };
}

export function totalScore(state: GameState): number {
  return state.rounds.reduce((sum, r) => sum + (r.score ?? 0), 0);
}

export function roundResult(round: RoundState, catalog: Catalog): RoundResult | null {
  const product = catalog.getProduct(round.productId);
  const answer = catalog.getAnswer(round.productId);
  if (!product || !answer || !round.resolved) return null;
  const score = round.score ?? 0;
  return {
    productId: product.id,
    brand: product.brand,
    name: product.name,
    variant: product.variant,
    category: product.category,
    slot: round.slot,
    imageUrl: product.imageUrl,
    guess: round.guess,
    actual: answer.priceINR,
    score,
    band: scoreBand(score),
    diffPercent: round.guess !== null ? differencePercent(round.guess, answer.priceINR) : null,
    timedOut: round.timedOut,
    priceSource: answer.priceSource,
    priceType: answer.priceType,
    verifiedAt: answer.verifiedAt,
  };
}

export function gameResults(state: GameState, catalog: Catalog): RoundResult[] {
  return state.rounds
    .map((r) => roundResult(r, catalog))
    .filter((r): r is RoundResult => r !== null);
}
