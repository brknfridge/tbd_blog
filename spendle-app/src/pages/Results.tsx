import { useMemo, useState } from "react";
import { ArrowRight, ChevronDown, Infinity as InfinityIcon } from "lucide-react";
import { Header } from "../components/Header";
import { ResultEmojis } from "../components/ResultEmojis";
import { ScoreCard } from "../components/ScoreCard";
import { ShareResults } from "../components/ShareResults";
import { catalog } from "../lib/catalog";
import { CATEGORY_LABEL, computeMetrics } from "../lib/commentary";
import { formatChallengeNumber, istDateKey } from "../lib/dailyChallenge";
import { formatPercent, formatScore } from "../lib/formatting";
import { gameResults } from "../lib/game";
import { buildShareText } from "../lib/sharing";
import { liveStreak } from "../lib/streaks";
import { loadStats } from "../lib/session";
import { scoreBand } from "../lib/scoring";
import type { GameState } from "../types/game";
import type { Category } from "../types/product";

interface Props {
  game: GameState;
  onHome: () => void;
  onEndless: () => void;
}

export function Results({ game, onHome, onEndless }: Props) {
  const results = useMemo(() => gameResults(game, catalog), [game]);
  const metrics = useMemo(() => computeMetrics(results), [results]);
  const scores = game.rounds.map((r) => r.score ?? 0);
  const commentary = game.commentary ?? "";
  const shareText = buildShareText({ mode: game.mode, challengeNumber: game.challengeNumber, scores, commentary });
  const [reviewOpen, setReviewOpen] = useState(false);
  const streak = game.mode === "daily" ? liveStreak(loadStats(), istDateKey()) : 0;
  const label = game.mode === "daily" && game.challengeNumber ? `Daily ${formatChallengeNumber(game.challengeNumber)}` : "Endless mode";

  const cats = (Object.entries(metrics.categoryScores) as [Category, number][]).sort((a, b) => b[1] - a[1]);

  return (
    <main className="sp-results">
      <Header onHome={onHome} right={<span className="tbd-tag">{label}</span>} />

      <section className="sp-results__hero">
        <span className="tbd-eyebrow">{label}</span>
        <p className="sp-results__total">
          {formatScore(metrics.total)}
          <span className="sp-results__of"> / 5,000</span>
        </p>
        <ResultEmojis scores={scores} size="lg" />
        <blockquote className="sp-results__quote">{commentary}</blockquote>
        {game.mode === "daily" && streak > 0 && (
          <p className="tbd-status tbd-status--positive sp-results__streak">{streak}-day streak</p>
        )}
      </section>

      <ShareResults text={shareText} />

      <div className="sp-results__ctas">
        <button type="button" className="tbd-btn tbd-btn--ghost sp-btn-block" onClick={onEndless}>
          {game.mode === "daily" ? "Play endless mode" : "Play again"}
          <InfinityIcon size={16} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      <section className="sp-results__breakdown">
        <div className="sp-stat-grid">
          <div className="sp-stat">
            <span className="tbd-label tbd-label--sm tbd-text-muted">Best category</span>
            <span className="sp-stat__value">{metrics.bestCategory ? CATEGORY_LABEL[metrics.bestCategory] : "—"}</span>
          </div>
          <div className="sp-stat">
            <span className="tbd-label tbd-label--sm tbd-text-muted">Worst category</span>
            <span className="sp-stat__value">{metrics.worstCategory ? CATEGORY_LABEL[metrics.worstCategory] : "—"}</span>
          </div>
          <div className="sp-stat">
            <span className="tbd-label tbd-label--sm tbd-text-muted">Biggest overestimate</span>
            <span className="sp-stat__value">
              {metrics.largestOver ? (
                <>
                  {metrics.largestOver.brand} {metrics.largestOver.name}{" "}
                  <span className="sp-stat__delta">{formatPercent(metrics.largestOver.diffPercent!)}</span>
                </>
              ) : (
                "None"
              )}
            </span>
          </div>
          <div className="sp-stat">
            <span className="tbd-label tbd-label--sm tbd-text-muted">Biggest underestimate</span>
            <span className="sp-stat__value">
              {metrics.largestUnder ? (
                <>
                  {metrics.largestUnder.brand} {metrics.largestUnder.name}{" "}
                  <span className="sp-stat__delta">{formatPercent(metrics.largestUnder.diffPercent!)}</span>
                </>
              ) : (
                "None"
              )}
            </span>
          </div>
        </div>

        <ul className="sp-cats">
          {cats.map(([c, avg]) => (
            <li key={c} className="tbd-metric">
              <span className="tbd-metric__label">{CATEGORY_LABEL[c]}</span>
              <span className="tbd-metric__value">
                <span className={`sp-tile sp-tile--inline sp-band--${scoreBand(Math.round(avg))}`} aria-hidden="true" />{" "}
                {Math.round(avg)}
              </span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="sp-review__toggle tbd-label tbd-label--sm"
          aria-expanded={reviewOpen}
          onClick={() => setReviewOpen((o) => !o)}
        >
          Review all five products
          <ChevronDown size={16} strokeWidth={1.5} className={reviewOpen ? "is-open" : ""} aria-hidden="true" />
        </button>
        {reviewOpen && (
          <ol className="sp-review">
            {results.map((r, i) => (
              <ScoreCard key={r.productId} result={r} index={i} />
            ))}
          </ol>
        )}
      </section>

      <button type="button" className="sp-link-btn tbd-label tbd-label--sm sp-results__home" onClick={onHome}>
        Back to home <ArrowRight size={14} strokeWidth={1.5} aria-hidden="true" />
      </button>
    </main>
  );
}
