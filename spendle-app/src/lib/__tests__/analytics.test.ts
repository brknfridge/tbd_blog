import { vi } from "vitest";

const { track } = vi.hoisted(() => ({ track: vi.fn() }));
vi.mock("../analytics", async (orig) => ({ ...(await orig<typeof import("../analytics")>()), track }));

import { startDaily, startEndless, finishGame } from "../session";
import { catalog } from "../catalog";
import { markReady, resolveRound, advance } from "../game";
import type { GameState } from "../../types/game";

function playThrough(g: GameState): GameState {
  for (let i = 0; i < 5; i++) {
    g = markReady(g, 1_000);
    const actual = catalog.getAnswer(g.rounds[g.current]!.productId)!.priceINR;
    g = resolveRound(g, catalog, { guess: i === 4 ? null : actual, timedOut: i === 4 });
    g = advance(g, g.startedAt + 60_000);
  }
  return g;
}

describe("GA events", () => {
  beforeEach(() => { localStorage.clear(); track.mockClear(); });

  it("fires spendle_game_start once for a new daily game, not on resume", () => {
    const g = startDaily();
    startDaily(); // resume
    const starts = track.mock.calls.filter(([n]) => n === "spendle_game_start");
    expect(starts).toHaveLength(1);
    expect(starts[0]![1]).toMatchObject({ game_mode: "daily", challenge_number: g.challengeNumber });
  });

  it("fires spendle_game_complete once with the score, and never twice for the same daily", () => {
    const done = playThrough(startDaily());
    finishGame(done);
    finishGame(done); // a second finish for the same date is ignored
    const completes = track.mock.calls.filter(([n]) => n === "spendle_game_complete");
    expect(completes).toHaveLength(1);
    expect(completes[0]![1]).toMatchObject({ game_mode: "daily", score: 4000, rounds_missed: 1, rounds_excellent: 4, duration_sec: 60 });
  });

  it("tracks endless games without a challenge number", () => {
    const g = startEndless(false);
    finishGame(playThrough(g));
    const names = track.mock.calls.map(([n]) => n);
    expect(names).toEqual(["spendle_game_start", "spendle_game_complete"]);
    expect(track.mock.calls[0]![1]).toEqual({ game_mode: "endless" });
  });
});
