import { createGame, markReady, setDraft, resolveRound, resolveIfExpired, advance, totalScore, gameResults, type Catalog } from "../game";
import { selectQuiz } from "../quiz";
import { mulberry32 } from "../randomizer";
import { remainingMs, secondsLeft } from "../timer";
import { digitsToNumber } from "../formatting";
import { catalogOf } from "./fixtures";
import type { Product } from "../../types/product";

const products = catalogOf({ grocery: 3, beauty: 3, luxury: 3, one_off: 3 });
const byId = new Map<string, Product>(products.map((p) => [p.id, p]));
const catalog: Catalog = {
  getProduct: (id) => byId.get(id),
  getAnswer: (id) => byId.get(id),
};
const T0 = 1_000_000;

function newGame() {
  return createGame("endless", selectQuiz(products, mulberry32(3)), { now: T0 });
}

describe("round timer", () => {
  it("does not start until the card is ready", () => {
    const g = newGame();
    expect(g.rounds[0]!.deadline).toBeNull();
    expect(resolveIfExpired(g, catalog, T0 + 60_000)).toBe(g);
  });

  it("sets a 20s deadline once ready, and readiness is idempotent", () => {
    const g = markReady(newGame(), T0);
    expect(g.rounds[0]!.deadline).toBe(T0 + 20_000);
    expect(markReady(g, T0 + 5_000).rounds[0]!.deadline).toBe(T0 + 20_000);
  });

  it("counts real time, not ticks", () => {
    expect(remainingMs(T0 + 20_000, T0 + 7_250)).toBe(12_750);
    expect(secondsLeft(T0 + 20_000, T0 + 7_250)).toBe(13);
    expect(remainingMs(T0 + 20_000, T0 + 99_000)).toBe(0);
  });

  it("auto-submits the typed guess at timeout", () => {
    let g = markReady(newGame(), T0);
    const actual = byId.get(g.rounds[0]!.productId)!.priceINR;
    g = setDraft(g, String(actual));
    expect(resolveIfExpired(g, catalog, T0 + 19_999)).toBe(g); // not yet
    g = resolveIfExpired(g, catalog, T0 + 20_000);
    expect(g.phase).toBe("reveal");
    expect(g.rounds[0]).toMatchObject({ guess: actual, score: 1000, timedOut: true, resolved: true });
  });

  it("awards zero for an empty guess at timeout", () => {
    const g = resolveIfExpired(markReady(newGame(), T0), catalog, T0 + 25_000);
    expect(g.rounds[0]).toMatchObject({ guess: null, score: 0, timedOut: true });
  });

  it("ignores a second resolution (button + timeout race)", () => {
    let g = markReady(newGame(), T0);
    g = resolveRound(g, catalog, { guess: 100, timedOut: false });
    const again = resolveRound(g, catalog, { guess: 999, timedOut: true });
    expect(again).toBe(g);
    expect(resolveIfExpired(g, catalog, T0 + 99_000)).toBe(g);
  });

  it("survives a reload: restored state keeps the original deadline", () => {
    let g = markReady(newGame(), T0);
    g = setDraft(g, "250");
    const restored = JSON.parse(JSON.stringify(g));
    expect(markReady(restored, T0 + 10_000).rounds[0]!.deadline).toBe(T0 + 20_000);
    expect(digitsToNumber(restored.rounds[0].draft)).toBe(250);
  });
});

describe("game flow", () => {
  it("never advances on its own and caps at 5,000", () => {
    let g = newGame();
    for (let i = 0; i < 5; i++) {
      expect(g.phase).toBe("playing");
      expect(advance(g)).toBe(g); // can't skip an unresolved round
      g = markReady(g, T0);
      const actual = byId.get(g.rounds[g.current]!.productId)!.priceINR;
      g = resolveRound(g, catalog, { guess: actual, timedOut: false });
      expect(g.phase).toBe("reveal");
      g = advance(g, T0 + 1);
    }
    expect(g.phase).toBe("done");
    expect(totalScore(g)).toBe(5000);
    expect(gameResults(g, catalog)).toHaveLength(5);
  });
});
