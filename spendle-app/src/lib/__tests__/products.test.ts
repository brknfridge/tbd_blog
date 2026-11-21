import { PRODUCTS } from "../../data/products";
import { eligible, MANDATORY } from "../quiz";
import { dailyQuiz, addDays } from "../dailyChallenge";

describe("product database", () => {
  it("has the 50 specified entries with unique ids", () => {
    expect(PRODUCTS).toHaveLength(50);
    expect(new Set(PRODUCTS.map((p) => p.id)).size).toBe(50);
  });

  it("every active product has a verified price, https source and date", () => {
    for (const p of PRODUCTS.filter((p) => p.active)) {
      expect(p.priceINR, p.id).toBeGreaterThan(0);
      expect(Number.isInteger(p.priceINR), p.id).toBe(true);
      expect(p.priceSource, p.id).toMatch(/^https:\/\//);
      expect(p.verifiedAt, p.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("inactive products explain why", () => {
    for (const p of PRODUCTS.filter((p) => !p.active)) expect(p.notes, p.id).toMatch(/INACTIVE/);
  });

  it("covers every mandatory category", () => {
    const pool = eligible(PRODUCTS);
    for (const c of MANDATORY) expect(pool.some((p) => p.category === c), c).toBe(true);
  });

  it("can build a valid daily quiz for every day of the next year", () => {
    for (let i = 0; i < 365; i++) {
      const quiz = dailyQuiz(PRODUCTS, addDays("2026-11-22", i));
      expect(quiz).toHaveLength(5);
      expect(new Set(quiz.map((q) => q.product.id)).size).toBe(5);
    }
  });
});

import { existsSync } from "node:fs";
import { resolve } from "node:path";

describe("product images", () => {
  it("every active product has a local image that exists", () => {
    for (const p of PRODUCTS.filter((p) => p.active)) {
      expect(p.imageUrl, p.id).toMatch(/^products\/.+\.webp$/);
      expect(existsSync(resolve(__dirname, "../../../public", p.imageUrl)), p.imageUrl).toBe(true);
    }
  });
});
