import { SHARE_URL } from "../config";
import type { Mode } from "../types/game";
import { formatChallengeNumber } from "./dailyChallenge";
import { formatScore } from "./formatting";
import { scoreEmoji } from "./scoring";

export interface ShareInput {
  mode: Mode;
  challengeNumber: number | null;
  scores: readonly number[];
  commentary: string;
}

/** Spoiler-free: no product names, no prices. Emojis follow round order. */
export function buildShareText({ mode, challengeNumber, scores, commentary }: ShareInput): string {
  const total = scores.reduce((a, b) => a + b, 0);
  const label = mode === "daily" && challengeNumber ? formatChallengeNumber(challengeNumber) : "Endless";
  return [
    `spendle. 🛒 ${label}`,
    `${formatScore(total)} / 5,000`,
    scores.map(scoreEmoji).join(""),
    "",
    `"${commentary}"`,
    "",
    SHARE_URL,
  ].join("\n");
}

/** Clipboard API, falling back to a hidden textarea + execCommand. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-1000px";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export function canNativeShare(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

export async function nativeShare(text: string): Promise<"shared" | "cancelled" | "failed"> {
  try {
    await navigator.share({ text });
    return "shared";
  } catch (e) {
    return e instanceof DOMException && e.name === "AbortError" ? "cancelled" : "failed";
  }
}
