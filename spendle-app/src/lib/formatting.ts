import { MAX_GUESS } from "../config";

/** Indian digit grouping: 12500000 → "1,25,00,000". */
export function groupIndian(n: number): string {
  const s = String(Math.trunc(Math.abs(n)));
  const sign = n < 0 ? "-" : "";
  if (s.length <= 3) return sign + s;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${sign}${rest},${last3}`;
}

export function formatINR(n: number): string {
  return (n < 0 ? "−₹" : "₹") + groupIndian(Math.abs(Math.round(n)));
}

/** "₹1.25 crore", "₹3.4 lakh" — a reading aid next to big numbers. */
export function formatINRWords(n: number): string | null {
  const abs = Math.abs(n);
  const trim = (x: number) => x.toFixed(2).replace(/\.?0+$/, "");
  if (abs >= 1e7) return `₹${trim(abs / 1e7)} crore`;
  if (abs >= 1e5) return `₹${trim(abs / 1e5)} lakh`;
  return null;
}

/** Strip everything but digits, drop leading zeros, cap at ₹100 crore. */
export function sanitizeDigits(raw: string): string {
  let digits = raw.replace(/\D/g, "").replace(/^0+/, "");
  // Cap length first so pasting a phone number doesn't create a huge number.
  if (digits.length > 10) digits = digits.slice(0, 10);
  if (digits && Number(digits) > MAX_GUESS) digits = String(MAX_GUESS);
  return digits;
}

export function digitsToNumber(digits: string): number | null {
  if (!digits) return null;
  const n = Number(digits);
  return Number.isFinite(n) && n > 0 && n <= MAX_GUESS ? n : null;
}

export function formatDigits(digits: string): string {
  return digits ? groupIndian(Number(digits)) : "";
}

/** "+19.2%", "−27%", "+1,150%", "0%". One decimal under 100%. */
export function formatPercent(p: number): string {
  const abs = Math.abs(p);
  const r = abs >= 100 ? Math.round(abs) : Math.round(abs * 10) / 10;
  if (r === 0) return "0%";
  const int = Math.trunc(r);
  const tenth = Math.round((r - int) * 10);
  return `${p > 0 ? "+" : "−"}${groupIndian(int)}${tenth ? "." + tenth : ""}%`;
}

export function formatScore(n: number): string {
  return groupIndian(n);
}

export function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}
