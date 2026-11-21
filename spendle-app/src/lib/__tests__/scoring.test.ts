import { calculateScore, differencePercent, scoreBand, scoreEmoji } from "../scoring";

describe("calculateScore", () => {
  it("gives 1000 for an exact guess", () => expect(calculateScore(500, 500)).toBe(1000));
  it("returns 0 for non-positive inputs", () => {
    expect(calculateScore(0, 100)).toBe(0);
    expect(calculateScore(-5, 100)).toBe(0);
    expect(calculateScore(100, 0)).toBe(0);
    expect(calculateScore(NaN, 100)).toBe(0);
  });
  it("scores half and double identically", () => {
    expect(calculateScore(50, 100)).toBe(calculateScore(200, 100));
    expect(calculateScore(50, 100)).toBe(125); // 1000 * 2^-3
  });
  it("is symmetric across scales", () => {
    expect(calculateScore(30, 20)).toBe(calculateScore(3_00_00_000, 2_00_00_000));
  });
  it("never exceeds 1000", () => {
    for (const g of [1, 99, 100, 101, 1e9]) expect(calculateScore(g, 100)).toBeLessThanOrEqual(1000);
  });
});

describe("differencePercent", () => {
  it("is positive for over, negative for under, zero for exact", () => {
    expect(differencePercent(120, 100)).toBeCloseTo(20);
    expect(differencePercent(18500, 22900)).toBeCloseTo(-19.21, 1);
    expect(differencePercent(100, 100)).toBe(0);
  });
});

describe("bands and emoji", () => {
  it.each([
    [1000, "excellent", "🟩"],
    [800, "excellent", "🟩"],
    [799, "close", "🟨"],
    [600, "close", "🟨"],
    [599, "not_quite", "🟧"],
    [400, "not_quite", "🟧"],
    [399, "way_off", "🟥"],
    [1, "way_off", "🟥"],
    [0, "missed", "⬛"],
  ])("%i → %s", (score, band, emoji) => {
    expect(scoreBand(score)).toBe(band);
    expect(scoreEmoji(score)).toBe(emoji);
  });
  it("a valid guess that rounds to 0 points is black", () => {
    expect(calculateScore(1, 1e9)).toBe(0);
    expect(scoreEmoji(calculateScore(1, 1e9))).toBe("⬛");
  });
});
