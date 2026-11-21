/**
 * LocalStorage with an in-memory fallback. If storage is blocked (private mode,
 * disabled cookies) the game still plays; `storageAvailable` lets the UI say so.
 */
const PREFIX = "spendle:v1:";
const memory = new Map<string, string>();

function probe(): boolean {
  try {
    const k = PREFIX + "__probe";
    window.localStorage.setItem(k, "1");
    window.localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

export const storageAvailable: boolean = typeof window !== "undefined" && probe();

export function readJSON<T>(key: string, fallback: T): T {
  let raw: string | null | undefined;
  try {
    raw = storageAvailable ? window.localStorage.getItem(PREFIX + key) : memory.get(PREFIX + key);
  } catch {
    raw = memory.get(PREFIX + key);
  }
  if (raw == null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown): void {
  const raw = JSON.stringify(value);
  memory.set(PREFIX + key, raw);
  if (!storageAvailable) return;
  try {
    window.localStorage.setItem(PREFIX + key, raw);
  } catch {
    /* quota or blocked — memory copy keeps this session working */
  }
}

export function removeKey(key: string): void {
  memory.delete(PREFIX + key);
  if (!storageAvailable) return;
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    /* ignore */
  }
}

export const KEYS = {
  active: (mode: "daily" | "endless") => `active:${mode}`,
  daily: (dateKey: string) => `daily:${dateKey}`,
  stats: "stats",
  endlessRecent: "endless:recent",
  commentaryRecent: "commentary:recent",
  resume: "resume",
} as const;
