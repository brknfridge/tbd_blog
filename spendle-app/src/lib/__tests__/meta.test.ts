import { recordCompletion, liveStreak, EMPTY_STATS } from "../streaks";
import { computeMetrics, commentaryGroup, selectCommentary } from "../commentary";
import { buildShareText } from "../sharing";
import { COMMENTARY } from "../../data/commentary";
import { mulberry32 } from "../randomizer";
import { scoreBand, differencePercent } from "../scoring";
import type { RoundResult } from "../../types/game";
import type { Category } from "../../types/product";

describe("streaks", () => {
  it("increments once per day and breaks on a gap", () => {
    let s = recordCompletion(EMPTY_STATS, "2026-11-20");
    s = recordCompletion(s, "2026-11-20");
    expect(s).toMatchObject({ currentStreak: 1, played: 1 });
    s = recordCompletion(s, "2026-11-21");
    s = recordCompletion(s, "2026-11-22");
    expect(s).toMatchObject({ currentStreak: 3, longestStreak: 3 });
    s = recordCompletion(s, "2026-11-24");
    expect(s).toMatchObject({ currentStreak: 1, longestStreak: 3, played: 4 });
  });
  it("crosses month and year boundaries", () => {
    const s = recordCompletion(recordCompletion(EMPTY_STATS, "2026-12-31"), "2027-01-01");
    expect(s.currentStreak).toBe(2);
  });
  it("shows a live streak only if yesterday or today was played", () => {
    const s = recordCompletion(recordCompletion(EMPTY_STATS, "2026-11-21"), "2026-11-22");
    expect(liveStreak(s, "2026-11-22")).toBe(2);
    expect(liveStreak(s, "2026-11-23")).toBe(2);
    expect(liveStreak(s, "2026-11-24")).toBe(0);
  });
});

function r(category: Category, guess: number | null, actual: number, score: number): RoundResult {
  return {
    productId: Math.random().toString(36), brand: "B", name: "N", variant: "V", category, slot: category, imageUrl: "",
    guess, actual, score, band: scoreBand(score),
    diffPercent: guess === null ? null : differencePercent(guess, actual),
    timedOut: false, priceSource: "", priceType: "MRP", verifiedAt: "",
  };
}

describe("commentary", () => {
  it("prioritises cross-category contrast", () => {
    const m = computeMetrics([r("grocery", 100, 100, 1000), r("luxury", 10, 100, 1), r("beauty", 100, 100, 1000), r("one_off", 100, 100, 1000), r("grocery", 100, 100, 1000)]);
    expect(m.total).toBeGreaterThanOrEqual(4000);
    expect(commentaryGroup(m)).toBe("groceryNotLuxury");
  });
  it("luxury strong, grocery weak", () => {
    expect(commentaryGroup(computeMetrics([r("luxury", 100, 100, 900), r("grocery", 300, 100, 100), r("beauty", 1, 1, 500), r("one_off", 1, 1, 500), r("beauty", 1, 1, 500)]))).toBe("luxuryNotGrocery");
  });
  it("one-off strong, grocery weak", () => {
    expect(commentaryGroup(computeMetrics([r("one_off", 100, 100, 900), r("grocery", 300, 100, 100), r("beauty", 1, 1, 500), r("luxury", 1, 1, 500), r("beauty", 1, 1, 500)]))).toBe("oneOffNotGrocery");
  });
  it("then exceptional totals", () => {
    const hi = computeMetrics(["grocery", "beauty", "luxury", "one_off", "beauty"].map((c) => r(c as Category, 110, 100, 850)));
    expect(commentaryGroup(hi)).toBe("excellent");
    const lo = computeMetrics(["grocery", "beauty", "luxury", "one_off", "beauty"].map((c) => r(c as Category, 50, 100, 200)));
    expect(commentaryGroup(lo)).toBe("poor");
  });
  it("then over/under trends", () => {
    const over = computeMetrics(["grocery", "beauty", "luxury", "one_off", "beauty"].map((c) => r(c as Category, 130, 100, 600)));
    expect(over.overCount).toBe(5);
    expect(commentaryGroup(over)).toBe("over");
    const under = computeMetrics(["grocery", "beauty", "luxury", "one_off", "beauty"].map((c) => r(c as Category, 80, 100, 600)));
    expect(commentaryGroup(under)).toBe("under");
  });
  it("falls back to balanced", () => {
    const m = computeMetrics([r("grocery", 130, 100, 600), r("beauty", 80, 100, 600), r("luxury", 130, 100, 600), r("one_off", 80, 100, 600), r("beauty", null, 100, 0)]);
    expect(m.missedCount).toBe(1);
    expect(commentaryGroup(m)).toBe("balanced");
  });
  it("tracks biggest over/underestimates", () => {
    const m = computeMetrics([r("grocery", 162, 100, 300), r("luxury", 73, 100, 500), r("beauty", 50, 100, 125), r("one_off", 110, 100, 900), r("beauty", 100, 100, 1000)]);
    expect(m.largestOver!.diffPercent).toBeCloseTo(62);
    expect(m.largestUnder!.diffPercent).toBeCloseTo(-50);
    expect(m.bestCategory).toBe("one_off");
  });
  it("avoids repeating the last line when alternatives exist", () => {
    const m = computeMetrics(["grocery", "beauty", "luxury", "one_off", "beauty"].map((c) => r(c as Category, 50, 100, 200)));
    const recent = COMMENTARY.poor.slice(0, 4) as string[];
    for (let s = 0; s < 20; s++) expect(selectCommentary(m, mulberry32(s), recent)).toBe(COMMENTARY.poor[4]);
  });
});

describe("share text", () => {
  const text = buildShareText({ mode: "daily", challengeNumber: 42, scores: [850, 650, 100, 900, 420], commentary: "The price tag fears you." });
  it("matches the Wordle-style format", () => {
    expect(text).toBe('spendle. 🛒 #042\n2,920 / 5,000\n🟩🟨🟥🟩🟧\n\n"The price tag fears you."\n\ntbdonline.in/spendle');
  });
  it("labels endless games", () => {
    expect(buildShareText({ mode: "endless", challengeNumber: null, scores: [0, 0, 0, 0, 0], commentary: "x" })).toContain("spendle. 🛒 Endless\n0 / 5,000\n⬛⬛⬛⬛⬛");
  });
  it("contains no spoilers", () => {
    expect(text).not.toMatch(/₹|Rolex|Amul/);
  });
});
