import type { RoundResult } from "../types/game";
import { formatDate, formatINR, formatPercent } from "../lib/formatting";
import { CATEGORY_LABEL } from "../lib/commentary";
import { BAND_LABEL } from "../lib/scoring";

/** One row of the expandable post-game review. */
export function ScoreCard({ result, index }: { result: RoundResult; index: number }) {
  return (
    <li className="sp-review__item">
      <span className={`sp-tile sp-tile--inline sp-band--${result.band}`} aria-label={BAND_LABEL[result.band]} />
      <div className="sp-review__main">
        <span className="tbd-label tbd-label--sm tbd-text-muted">
          {String(index + 1).padStart(2, "0")} — {CATEGORY_LABEL[result.category]}
          {result.slot === "wildcard" ? " · Wildcard" : ""}
        </span>
        <span className="sp-review__name">
          {result.brand} {result.name}
        </span>
        <span className="sp-review__variant">{result.variant}</span>
        <dl className="sp-review__nums">
          <div><dt>Guess</dt><dd>{result.guess === null ? "Missed" : formatINR(result.guess)}</dd></div>
          <div><dt>Actual</dt><dd>{formatINR(result.actual)}</dd></div>
          <div><dt>Off by</dt><dd>{result.diffPercent === null ? "—" : formatPercent(result.diffPercent)}</dd></div>
          <div><dt>Score</dt><dd>{result.score}</dd></div>
        </dl>
        <a className="sp-review__source" href={result.priceSource} target="_blank" rel="noopener noreferrer">
          Source · verified {formatDate(result.verifiedAt)}
        </a>
      </div>
    </li>
  );
}
