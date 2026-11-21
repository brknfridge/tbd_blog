import { ROUND_MS } from "../config";

export function deadlineFrom(readyAt: number, duration = ROUND_MS): number {
  return readyAt + duration;
}

/** Wall-clock based — survives throttled intervals, hidden tabs and reloads. */
export function remainingMs(deadline: number, now = Date.now()): number {
  return Math.max(0, deadline - now);
}

export function isExpired(deadline: number | null, now = Date.now()): boolean {
  return deadline !== null && now >= deadline;
}

export function secondsLeft(deadline: number, now = Date.now()): number {
  return Math.ceil(remainingMs(deadline, now) / 1000);
}
