import { useState } from "react";
import { ArrowRight, Infinity as InfinityIcon, X } from "lucide-react";
import { Logo } from "../components/Logo";
import { ResultEmojis } from "../components/ResultEmojis";
import { useNow } from "../hooks";
import { challengeNumber, formatChallengeNumber, istDateKey, msUntilNextIstMidnight } from "../lib/dailyChallenge";
import { formatScore } from "../lib/formatting";
import { liveStreak } from "../lib/streaks";
import { loadActive, loadDailyResult, loadStats } from "../lib/session";
import { totalScore } from "../lib/game";

interface Props {
  onPlayDaily: () => void;
  onPlayEndless: () => void;
  onViewDaily: () => void;
}

function countdown(ms: number): string {
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

export function Home({ onPlayDaily, onPlayEndless, onViewDaily }: Props) {
  const now = useNow(30_000);
  const today = istDateKey(now);
  const number = formatChallengeNumber(challengeNumber(today));
  const done = loadDailyResult(today);
  const inProgress = !done && loadActive("daily");
  const endlessInProgress = loadActive("endless");
  const stats = loadStats();
  const streak = liveStreak(stats, today);
  const [rulesOpen, setRulesOpen] = useState(false);

  return (
    <main className="sp-home">
      <header className="sp-home__top">
        <a className="tbd-wordmark sp-header__tbd" href="/" aria-label="[tbd] home">tbd</a>
        <button type="button" className="sp-link-btn tbd-label tbd-label--sm" onClick={() => setRulesOpen(true)}>
          How to play
        </button>
      </header>

      <section className="sp-home__hero">
        <Logo size="lg" />
        <p className="sp-home__tagline">You think you know what things cost?</p>
        <p className="sp-home__explainer tbd-label tbd-label--sm">5 products · 20 seconds each · Guess the price</p>
      </section>

      <section className="sp-home__daily tbd-card">
        <div className="sp-home__daily-head">
          <span className="tbd-eyebrow">Daily {number}</span>
          {done ? (
            <span className="tbd-status tbd-status--positive sp-status-sm">Complete</span>
          ) : inProgress ? (
            <span className="tbd-status sp-status-sm">In progress</span>
          ) : (
            <span className="tbd-status sp-status-sm">Live</span>
          )}
        </div>

        {done ? (
          <>
            <div className="sp-home__done">
              <span className="sp-home__done-score">
                {formatScore(totalScore(done))}
                <span className="tbd-text-muted"> / 5,000</span>
              </span>
              <ResultEmojis scores={done.rounds.map((r) => r.score)} size="sm" />
            </div>
            <button type="button" className="tbd-btn sp-btn-block" onClick={onViewDaily}>
              View today's result <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
            </button>
            <p className="sp-home__next tbd-text-muted">Next Spendle in {countdown(msUntilNextIstMidnight(now))}</p>
          </>
        ) : (
          <button type="button" className="tbd-btn sp-btn-block" onClick={onPlayDaily}>
            {inProgress ? "Continue today's Spendle" : "Play today's Spendle"}
            <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
          </button>
        )}

        <button type="button" className="tbd-btn tbd-btn--ghost sp-btn-block" onClick={onPlayEndless}>
          {endlessInProgress ? "Continue endless" : "Endless mode"}
          <InfinityIcon size={16} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </section>

      <dl className="sp-home__stats">
        <div>
          <dt className="tbd-label tbd-label--sm tbd-text-muted">Streak</dt>
          <dd>{streak} {streak === 1 ? "day" : "days"}</dd>
        </div>
        <div>
          <dt className="tbd-label tbd-label--sm tbd-text-muted">Best</dt>
          <dd>{stats.longestStreak} {stats.longestStreak === 1 ? "day" : "days"}</dd>
        </div>
        <div>
          <dt className="tbd-label tbd-label--sm tbd-text-muted">Played</dt>
          <dd>{stats.played}</dd>
        </div>
      </dl>

      <footer className="sp-home__foot tbd-text-muted">
        A game by <a className="tbd-wordmark" href="/">tbd</a>. Prices are Indian MRP or official list prices, each with a source.
      </footer>

      {rulesOpen && <Rules onClose={() => setRulesOpen(false)} />}
    </main>
  );
}

export function Rules({ onClose }: { onClose: () => void }) {
  return (
    <div className="sp-modal" role="dialog" aria-modal="true" aria-labelledby="sp-rules-title" onClick={onClose}>
      <div className="sp-modal__panel tbd-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="sp-modal__close" onClick={onClose} aria-label="Close">
          <X size={18} strokeWidth={1.5} />
        </button>
        <span className="tbd-eyebrow">How to play</span>
        <h2 id="sp-rules-title" className="sp-modal__title">Five products. Twenty seconds each.</h2>
        <ol className="sp-rules">
          <li><strong>Guess the Indian retail price.</strong> MRP for packaged goods, official India price for luxury and electronics, ex-showroom for cars.</li>
          <li><strong>The clock starts when the product appears.</strong> Whatever you've typed locks in at zero. Blank scores nothing.</li>
          <li><strong>Closeness is proportional.</strong> Half the price and double the price score the same. Up to 1,000 a round.</li>
          <li><strong>Every game has</strong> one grocery, one beauty, one luxury, one big one-off purchase and one wildcard.</li>
          <li><strong>One daily game for everyone,</strong> resetting at midnight IST. Endless mode whenever you like.</li>
        </ol>
        <ul className="sp-legend">
          <li><span className="sp-tile sp-tile--inline sp-band--excellent" /> 800+ Excellent</li>
          <li><span className="sp-tile sp-tile--inline sp-band--close" /> 600+ Close</li>
          <li><span className="sp-tile sp-tile--inline sp-band--not_quite" /> 400+ Not quite</li>
          <li><span className="sp-tile sp-tile--inline sp-band--way_off" /> 1+ Way off</li>
          <li><span className="sp-tile sp-tile--inline sp-band--missed" /> 0 Missed</li>
        </ul>
        <button type="button" className="tbd-btn sp-btn-block" onClick={onClose}>Got it</button>
      </div>
    </div>
  );
}
