import { ENDLESS_MEMORY } from "../config";
import type { GameState, Mode } from "../types/game";
import { catalog, PRODUCTS } from "./catalog";
import { computeMetrics, selectCommentary } from "./commentary";
import { challengeNumber, dailyQuiz, istDateKey } from "./dailyChallenge";
import { createGame, gameResults, totalScore } from "./game";
import { KEYS, readJSON, removeKey, writeJSON } from "./persistence";
import { EVENTS, track } from "./analytics";
import { inPool, latestPool, selectQuiz } from "./quiz";
import { recordCompletion, EMPTY_STATS, type DailyStats } from "./streaks";

/** Glue between pure game logic and storage. */

export function loadActive(mode: Mode): GameState | null {
  const g = readJSON<GameState | null>(KEYS.active(mode), null);
  if (!g || g.version !== 1 || g.phase === "done") return null;
  if (mode === "daily" && g.dateKey !== istDateKey()) return null; // yesterday's unfinished game lapses
  if (g.rounds.some((r) => !catalog.getProduct(r.productId))) return null; // database changed under it
  return g;
}

export function saveActive(g: GameState): void {
  writeJSON(KEYS.active(g.mode), g);
}

export function loadDailyResult(dateKey: string): GameState | null {
  return readJSON<GameState | null>(KEYS.daily(dateKey), null);
}

export function loadStats(): DailyStats {
  return { ...EMPTY_STATS, ...readJSON<Partial<DailyStats>>(KEYS.stats, {}) };
}

export function startDaily(): GameState {
  const dateKey = istDateKey();
  const existing = loadActive("daily");
  if (existing) return existing;
  const g = createGame("daily", dailyQuiz(PRODUCTS, dateKey), {
    dateKey,
    challengeNumber: challengeNumber(dateKey),
    id: `daily-${dateKey}`,
  });
  saveActive(g);
  track(EVENTS.gameStart, gameParams(g));
  return g;
}

export function startEndless(resume = true): GameState {
  if (resume) {
    const existing = loadActive("endless");
    if (existing) return existing;
  }
  const recent = readJSON<string[][]>(KEYS.endlessRecent, []);
  const avoid = new Set(recent.flat());
  const g = createGame("endless", selectQuiz(inPool(PRODUCTS, latestPool()), Math.random, avoid));
  saveActive(g);
  track(EVENTS.gameStart, gameParams(g));
  return g;
}

/** Called once when the fifth round's reveal is dismissed. */
export function finishGame(g: GameState): GameState {
  const results = gameResults(g, catalog);
  const recentLines = readJSON<string[]>(KEYS.commentaryRecent, []);
  const commentary = g.commentary ?? selectCommentary(computeMetrics(results), Math.random, recentLines);
  const done: GameState = { ...g, commentary };
  writeJSON(KEYS.commentaryRecent, [commentary, ...recentLines].slice(0, 3));
  removeKey(KEYS.active(g.mode));

  if (g.mode === "daily" && g.dateKey) {
    if (!loadDailyResult(g.dateKey)) {
      writeJSON(KEYS.daily(g.dateKey), done);
      writeJSON(KEYS.stats, recordCompletion(loadStats(), g.dateKey));
      track(EVENTS.gameComplete, completeParams(done));
    }
  } else {
    const recent = readJSON<string[][]>(KEYS.endlessRecent, []);
    writeJSON(KEYS.endlessRecent, [g.rounds.map((r) => r.productId), ...recent].slice(0, ENDLESS_MEMORY));
    track(EVENTS.gameComplete, completeParams(done));
  }
  return done;
}

function gameParams(g: GameState) {
  return {
    game_mode: g.mode,
    ...(g.challengeNumber ? { challenge_number: g.challengeNumber } : {}),
  };
}

function completeParams(g: GameState) {
  return {
    ...gameParams(g),
    score: totalScore(g),
    rounds_missed: g.rounds.filter((r) => r.guess === null).length,
    rounds_excellent: g.rounds.filter((r) => (r.score ?? 0) >= 800).length,
    duration_sec: g.finishedAt ? Math.max(0, Math.round((g.finishedAt - g.startedAt) / 1000)) : 0,
  };
}
