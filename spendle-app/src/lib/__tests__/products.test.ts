import { PRODUCTS } from "../../data/products";
import { eligible, inPool, MANDATORY } from "../quiz";
import { dailyQuiz, addDays } from "../dailyChallenge";

describe("product database", () => {
  it("keeps the 50 launch products and adds two 100-product refreshes, all with unique ids", () => {
    expect(inPool(PRODUCTS, 1)).toHaveLength(50);
    expect(inPool(PRODUCTS, 2)).toHaveLength(100);
    expect(inPool(PRODUCTS, 3)).toHaveLength(100);
    expect(new Set(PRODUCTS.map((p) => p.id)).size).toBe(250);
  });

  it("splits each refresh 30 / 20 / 30 / 20 across categories", () => {
    for (const pool of [2, 3]) {
      const n = (c: string) => inPool(PRODUCTS, pool).filter((p) => p.category === c).length;
      expect([n("grocery"), n("beauty"), n("luxury"), n("one_off")], `pool ${pool}`).toEqual([30, 20, 30, 20]);
    }
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

  it("each pool covers every mandatory category", () => {
    for (const n of [1, 2, 3]) {
      const pool = eligible(inPool(PRODUCTS, n));
      for (const c of MANDATORY) expect(pool.some((p) => p.category === c), `pool ${n} ${c}`).toBe(true);
    }
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
  it("every image a product points at exists locally", () => {
    for (const p of PRODUCTS.filter((p) => p.imageUrl)) {
      expect(p.imageUrl, p.id).toMatch(/^products\/.+\.webp$/);
      expect(existsSync(resolve(__dirname, "../../../public", p.imageUrl)), p.imageUrl).toBe(true);
    }
  });

  it("only the known plate-only product lacks a photo", () => {
    const noPhoto = PRODUCTS.filter((p) => p.active && !p.imageUrl).map((p) => p.id);
    expect(noPhoto).toEqual(["longines-master-collection-40"]);   // longines.com blocks image fetches
  });
});
