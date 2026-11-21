import { addDays } from "./dailyChallenge";

export interface DailyStats {
  currentStreak: number;
  longestStreak: number;
  lastCompleted: string | null;
  played: number;
}

export const EMPTY_STATS: DailyStats = { currentStreak: 0, longestStreak: 0, lastCompleted: null, played: 0 };

/** Increments once per IST date; a gap of a day or more restarts at 1. */
export function recordCompletion(stats: DailyStats, dateKey: string): DailyStats {
  if (stats.lastCompleted === dateKey) return stats;
  if (stats.lastCompleted && stats.lastCompleted > dateKey) return stats; // stale/out-of-order
  const continues = stats.lastCompleted !== null && addDays(stats.lastCompleted, 1) === dateKey;
  const currentStreak = continues ? stats.currentStreak + 1 : 1;
  return {
    currentStreak,
    longestStreak: Math.max(stats.longestStreak, currentStreak),
    lastCompleted: dateKey,
    played: stats.played + 1,
  };
}

/** The streak still alive today: completed today or yesterday, otherwise broken. */
export function liveStreak(stats: DailyStats, today: string): number {
  if (!stats.lastCompleted) return 0;
  if (stats.lastCompleted === today || addDays(stats.lastCompleted, 1) === today) return stats.currentStreak;
  return 0;
}
