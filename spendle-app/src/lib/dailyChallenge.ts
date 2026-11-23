import { LAUNCH_DATE } from "../config";
import type { Product } from "../types/product";
import { seededRng } from "./randomizer";
import { inPool, poolForDate, selectQuiz, type QuizPick } from "./quiz";

const IST_OFFSET_MS = 330 * 60 * 1000; // India has no DST.
const DAY_MS = 86_400_000;

/** The IST calendar date for an instant, as YYYY-MM-DD. */
export function istDateKey(now: Date | number = Date.now()): string {
  const t = typeof now === "number" ? now : now.getTime();
  return new Date(t + IST_OFFSET_MS).toISOString().slice(0, 10);
}

function dayIndex(dateKey: string): number {
  return Math.round(Date.parse(dateKey + "T00:00:00Z") / DAY_MS);
}

export function addDays(dateKey: string, days: number): string {
  return new Date((dayIndex(dateKey) + days) * DAY_MS).toISOString().slice(0, 10);
}

export function daysBetween(a: string, b: string): number {
  return dayIndex(b) - dayIndex(a);
}

/** Spendle #001 is LAUNCH_DATE. */
export function challengeNumber(dateKey: string, launch = LAUNCH_DATE): number {
  return Math.max(1, daysBetween(launch, dateKey) + 1);
}

export function formatChallengeNumber(n: number): string {
  return "#" + String(n).padStart(3, "0");
}

export function msUntilNextIstMidnight(now = Date.now()): number {
  const ist = now + IST_OFFSET_MS;
  return DAY_MS - (ist % DAY_MS);
}

/** Identical for every player on the same IST date (given the same database). */
export function dailyQuiz(products: readonly Product[], dateKey: string): QuizPick[] {
  return selectQuiz(inPool(products, poolForDate(dateKey)), seededRng(`spendle-daily-${dateKey}`));
}
