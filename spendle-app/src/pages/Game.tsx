import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CountdownTimer } from "../components/CountdownTimer";
import { Header } from "../components/Header";
import { PriceInput, type PriceInputHandle } from "../components/PriceInput";
import { ProductCard } from "../components/ProductCard";
import { RoundProgress } from "../components/RoundProgress";
import { RoundReveal } from "../components/RoundReveal";
import { useCountdown, useVisualViewportHeight } from "../hooks";
import { catalog, preloadImage } from "../lib/catalog";
import { formatChallengeNumber } from "../lib/dailyChallenge";
import { digitsToNumber } from "../lib/formatting";
import { advance, currentRound, markReady, resolveIfExpired, resolveRound, roundResult, setDraft } from "../lib/game";
import { finishGame, saveActive } from "../lib/session";
import type { GameState } from "../types/game";

interface Props {
  initial: GameState;
  onFinish: (g: GameState) => void;
  onHome: () => void;
}

export function Game({ initial, onFinish, onHome }: Props) {
  // Resolve anything that expired while the page was closed before first paint.
  const [game, setGame] = useState<GameState>(() => resolveIfExpired(initial, catalog));
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<PriceInputHandle>(null);
  useVisualViewportHeight();

  const round = currentRound(game);
  const product = useMemo(() => catalog.getProduct(round.productId)!, [round.productId]);

  useEffect(() => saveActive(game), [game]);

  // Starting the clock: only once the card is painted and the tab is visible.
  const handleReady = useCallback(() => {
    const start = () => setGame((g) => markReady(g));
    if (document.visibilityState === "visible") start();
    else {
      const onVis = () => {
        if (document.visibilityState === "visible") {
          document.removeEventListener("visibilitychange", onVis);
          start();
        }
      };
      document.addEventListener("visibilitychange", onVis);
    }
    inputRef.current?.focus();
  }, []);

  const handleExpire = useCallback(() => {
    setGame((g) => resolveIfExpired(g, catalog));
  }, []);

  const playing = game.phase === "playing";
  const seconds = useCountdown(playing ? round.deadline : null, handleExpire);

  const submit = useCallback(() => {
    const guess = digitsToNumber(round.draft);
    if (guess === null) {
      setError("Enter a price first.");
      inputRef.current?.focus();
      return;
    }
    setGame((g) => resolveRound(g, catalog, { guess, timedOut: false }));
  }, [round.draft]);

  const next = () => {
    const advanced = advance(game);
    if (advanced.phase === "done") {
      onFinish(finishGame(advanced));
      return;
    }
    setError(null);
    setGame(advanced);
    window.scrollTo(0, 0);
  };

  // Warm the next product's image while the player reads the reveal.
  useEffect(() => {
    if (game.phase !== "reveal") return;
    const upcoming = game.rounds[game.current + 1];
    const p = upcoming && catalog.getProduct(upcoming.productId);
    if (p) preloadImage(p.imageUrl);
  }, [game.phase, game.current, game.rounds]);

  const result = game.phase === "reveal" ? roundResult(round, catalog) : null;
  const modeLabel =
    game.mode === "daily" && game.challengeNumber ? `Daily ${formatChallengeNumber(game.challengeNumber)}` : "Endless";

  return (
    <main className={`sp-game ${playing ? "is-playing" : "is-reveal"}`}>
      <Header onHome={onHome} right={<span className="tbd-tag">{modeLabel}</span>} />
      <RoundProgress rounds={game.rounds} current={game.current} />

      {playing && (
        <form
          className="sp-game__play"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          noValidate
        >
          <CountdownTimer deadline={round.deadline} seconds={seconds} stopped={false} />
          <div className="sp-game__card">
            <ProductCard key={product.id} product={product} onReady={handleReady} />
          </div>
          <div className="sp-game__controls">
            <PriceInput
              ref={inputRef}
              digits={round.draft}
              onChange={(d) => {
                setError(null);
                setGame((g) => setDraft(g, d));
              }}
              onSubmit={submit}
              error={error}
            />
            <button type="submit" className="tbd-btn sp-btn-block sp-lockin" disabled={round.deadline === null}>
              Lock in
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </form>
      )}

      {result && <RoundReveal key={round.productId} result={result} isLast={game.current === game.rounds.length - 1} onNext={next} />}
    </main>
  );
}
