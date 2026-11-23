/** Spendle #001 is this IST date. Change before launch; numbers count up from here. */
export const LAUNCH_DATE = "2026-11-22";

/** Active guessing time per round. */
export const ROUND_MS = 20_000;

export const ROUNDS_PER_GAME = 5;

export const MAX_SCORE_PER_ROUND = 1000;

/** ₹100 crore. */
export const MAX_GUESS = 1_000_000_000;

export const SHARE_URL = "tbdonline.in/spendle";

/**
 * Product sets and the IST date each one takes over the daily challenge. A daily always draws from
 * the pool live on its date, so a mid-day deploy never changes a day's five products. Endless mode
 * uses the newest pool as soon as it ships.
 */
export const POOLS: readonly { pool: number; from: string }[] = [
  { pool: 1, from: "2026-11-22" },
  { pool: 2, from: "2026-11-24" },
];

/** How many past endless games' products to avoid repeating. */
export const ENDLESS_MEMORY = 2;
