import type { Band } from "../types/game";

/**
 * How fast points fall away with error. 3 was the launch value; 1.5 halves the penalty
 * (20% off: 512 -> 716; half/double: 125 -> 354) so strong players land in the 3.5-4k range.
 */
export const SCORE_STEEPNESS = 1.5;

/** Proportional accuracy: half and double the price score the same. */
export function calculateScore(guess: number, actual: number): number {
  if (!(guess > 0) || !(actual > 0)) return 0;
  const error = Math.abs(Math.log(guess / actual));
  return Math.round(1000 * Math.exp(-SCORE_STEEPNESS * error));
}

/** Positive = overestimated, negative = underestimated. */
export function differencePercent(guess: number, actual: number): number {
  return ((guess - actual) / actual) * 100;
}

export function scoreBand(score: number): Band {
  if (score >= 800) return "excellent";
  if (score >= 600) return "close";
  if (score >= 400) return "not_quite";
  if (score >= 1) return "way_off";
  return "missed";
}

export const BAND_EMOJI: Record<Band, string> = {
  excellent: "🟩",
  close: "🟨",
  not_quite: "🟧",
  way_off: "🟥",
  missed: "⬛",
};

export const BAND_LABEL: Record<Band, string> = {
  excellent: "Excellent",
  close: "Close",
  not_quite: "Not quite",
  way_off: "Way off",
  missed: "Missed",
};

export function scoreEmoji(score: number): string {
  return BAND_EMOJI[scoreBand(score)];
}
