import { useState } from "react";
import { Game } from "./pages/Game";
import { Home } from "./pages/Home";
import { Results } from "./pages/Results";
import { Header } from "./components/Header";
import { istDateKey } from "./lib/dailyChallenge";
import { storageAvailable } from "./lib/persistence";
import { InsufficientProductsError } from "./lib/quiz";
import { loadActive, loadDailyResult, startDaily, startEndless } from "./lib/session";
import { KEYS, readJSON, removeKey, writeJSON } from "./lib/persistence";
import type { GameState } from "./types/game";

type Screen =
  | { name: "home" }
  | { name: "game"; game: GameState }
  | { name: "results"; game: GameState }
  | { name: "error"; message: string };

export default function App() {
  // A refresh mid-game drops straight back into the round, clock still running.
  const [screen, setScreenState] = useState<Screen>(() => {
    const mode = readJSON<"daily" | "endless" | null>(KEYS.resume, null);
    const game = mode && loadActive(mode);
    return game ? { name: "game", game } : { name: "home" };
  });
  const setScreen = (s: Screen) => {
    if (s.name === "game") writeJSON(KEYS.resume, s.game.mode);
    else removeKey(KEYS.resume);
    setScreenState(s);
  };

  const go = (fn: () => GameState) => {
    try {
      setScreen({ name: "game", game: fn() });
    } catch (e) {
      const message =
        e instanceof InsufficientProductsError
          ? `${e.message} Spendle needs at least one verified product in every category.`
          : "Something went wrong starting the game.";
      setScreen({ name: "error", message });
    }
    window.scrollTo(0, 0);
  };

  const playDaily = () => {
    const done = loadDailyResult(istDateKey());
    if (done) setScreen({ name: "results", game: done });
    else go(startDaily);
  };
  const home = () => setScreen({ name: "home" });

  return (
    <>
      {!storageAvailable && (
        <p className="sp-banner" role="status">
          Your browser is blocking storage, so progress and streaks won't be saved after you leave.
        </p>
      )}
      {screen.name === "home" && (
        <Home onPlayDaily={playDaily} onPlayEndless={() => go(() => startEndless(true))} onViewDaily={playDaily} />
      )}
      {screen.name === "game" && (
        <Game
          key={screen.game.id}
          initial={screen.game}
          onHome={home}
          onFinish={(g) => setScreen({ name: "results", game: g })}
        />
      )}
      {screen.name === "results" && (
        <Results key={screen.game.id} game={screen.game} onHome={home} onEndless={() => go(() => startEndless(false))} />
      )}
      {screen.name === "error" && (
        <main className="sp-error">
          <Header onHome={home} />
          <h1 className="sp-error__title">Not enough products to play.</h1>
          <p className="tbd-text-muted">{screen.message}</p>
          <button type="button" className="tbd-btn" onClick={home}>Back to home</button>
        </main>
      )}
    </>
  );
}
