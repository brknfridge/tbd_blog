import { selectQuiz, InsufficientProductsError, MANDATORY } from "../quiz";
import { seededRng, mulberry32 } from "../randomizer";
import { dailyQuiz, istDateKey, challengeNumber, formatChallengeNumber, msUntilNextIstMidnight } from "../dailyChallenge";
import { catalogOf, makeProduct } from "./fixtures";

const catalog = catalogOf({ grocery: 6, beauty: 4, luxury: 5, one_off: 4 });

describe("selectQuiz", () => {
  it("always returns 5 distinct products with each mandatory category and a wildcard", () => {
    for (let seed = 0; seed < 300; seed++) {
      const quiz = selectQuiz(catalog, mulberry32(seed));
      expect(quiz).toHaveLength(5);
      expect(new Set(quiz.map((q) => q.product.id)).size).toBe(5);
      for (const c of MANDATORY) {
        const slot = quiz.find((q) => q.slot === c)!;
        expect(slot.product.category).toBe(c);
      }
      expect(quiz.filter((q) => q.slot === "wildcard")).toHaveLength(1);
    }
  });

  it("randomises order — the wildcard is not always last", () => {
    const positions = new Set<number>();
    for (let seed = 0; seed < 50; seed++) positions.add(selectQuiz(catalog, mulberry32(seed)).findIndex((q) => q.slot === "wildcard"));
    expect(positions.size).toBeGreaterThan(3);
  });

  it("excludes inactive and unverified products", () => {
    const list = [
      ...catalogOf({ grocery: 1, beauty: 1, luxury: 1, one_off: 2 }),
      makeProduct("grocery", 0),
      makeProduct("grocery", 50, { active: false }),
      makeProduct("grocery", 50, { priceSource: "" }),
    ];
    for (let s = 0; s < 50; s++) {
      for (const q of selectQuiz(list, mulberry32(s))) {
        expect(q.product.active && q.product.priceINR > 0 && q.product.priceSource).toBeTruthy();
      }
    }
  });

  it("throws a clear error when a category is empty", () => {
    expect(() => selectQuiz(catalogOf({ grocery: 3, beauty: 3, luxury: 3 }), mulberry32(1))).toThrow(InsufficientProductsError);
    expect(() => selectQuiz(catalogOf({ grocery: 1, beauty: 1, luxury: 1, one_off: 1 }), mulberry32(1))).toThrow(InsufficientProductsError);
  });

  it("avoids recently used products when alternatives exist", () => {
    const first = selectQuiz(catalog, mulberry32(7));
    const avoid = new Set(first.map((q) => q.product.id));
    for (let s = 0; s < 50; s++) {
      const next = selectQuiz(catalog, mulberry32(s), avoid);
      for (const q of next) expect(avoid.has(q.product.id)).toBe(false);
    }
  });
});

describe("daily challenge", () => {
  it("is identical for the same date and differs across dates", () => {
    const a = dailyQuiz(catalog, "2026-11-22").map((q) => q.product.id);
    const b = dailyQuiz([...catalog].reverse(), "2026-11-22").map((q) => q.product.id);
    expect(a).toEqual(b);
    const days = new Set<string>();
    for (let d = 1; d <= 20; d++) days.add(dailyQuiz(catalog, `2026-12-${String(d).padStart(2, "0")}`).map((q) => q.product.id).join());
    expect(days.size).toBeGreaterThan(15);
  });

  it("seeded RNG is reproducible", () => {
    const r1 = seededRng("x"), r2 = seededRng("x");
    for (let i = 0; i < 10; i++) expect(r1()).toBe(r2());
  });

  it("uses the IST calendar date", () => {
    expect(istDateKey(Date.parse("2026-11-22T18:29:59Z"))).toBe("2026-11-22"); // 23:59:59 IST
    expect(istDateKey(Date.parse("2026-11-22T18:30:00Z"))).toBe("2026-11-23"); // midnight IST
    expect(msUntilNextIstMidnight(Date.parse("2026-11-22T18:29:00Z"))).toBe(60_000);
  });

  it("numbers challenges from the launch date", () => {
    expect(challengeNumber("2026-11-22", "2026-11-22")).toBe(1);
    expect(challengeNumber("2027-01-02", "2026-11-22")).toBe(42);
    expect(formatChallengeNumber(42)).toBe("#042");
  });
});
