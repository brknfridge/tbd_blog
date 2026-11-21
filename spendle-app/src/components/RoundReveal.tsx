import { ArrowRight, ExternalLink } from "lucide-react";
import type { RoundResult } from "../types/game";
import { formatDate, formatINR, formatINRWords, formatPercent } from "../lib/formatting";
import { BAND_LABEL } from "../lib/scoring";
import { ProductCard } from "./ProductCard";

const PRICE_TYPE_LABEL: Record<string, string> = {
  MRP: "MRP",
  official_list: "Official India price",
  ex_showroom: "Ex-showroom price",
  asking: "Developer asking price",
};

function sourceHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

interface Props {
  result: RoundResult;
  isLast: boolean;
  onNext: () => void;
}

export function RoundReveal({ result, isLast, onNext }: Props) {
  const { guess, actual, diffPercent, score, band, timedOut } = result;
  const missed = guess === null;
  const diff = missed ? 0 : guess - actual;
  const verdict = missed
    ? "No guess locked in."
    : diffPercent === 0
      ? "Exact. To the rupee."
      : `You ${diff > 0 ? "overestimated" : "underestimated"} by ${formatPercent(Math.abs(diffPercent!)).replace("+", "")}.`;
  const actualWords = formatINRWords(actual);

  return (
    <section className="sp-reveal" aria-live="polite">
      {timedOut && <p className="sp-reveal__timesup tbd-label">Time's up!</p>}
      <ProductCard
        compact
        product={{ id: result.productId, brand: result.brand, name: result.name, variant: result.variant, category: result.category, imageUrl: result.imageUrl }}
      />

      <div className="sp-reveal__prices">
        <div className="sp-reveal__price">
          <span className="tbd-label tbd-label--sm tbd-text-muted">Your guess</span>
          <span className="sp-reveal__num sp-reveal__num--guess">{missed ? "—" : formatINR(guess)}</span>
        </div>
        <div className="sp-reveal__price">
          <span className="tbd-label tbd-label--sm tbd-text-muted">Actual price</span>
          <span className="sp-reveal__num">{formatINR(actual)}</span>
          {actualWords && <span className="sp-reveal__words">{actualWords}</span>}
        </div>
      </div>

      <p className="sp-reveal__verdict">{verdict}</p>
      {!missed && diff !== 0 && (
        <p className="sp-reveal__diff tbd-label tbd-label--sm tbd-text-muted">
          {diff > 0 ? "+" : "−"}
          {formatINR(Math.abs(diff))} · {formatPercent(diffPercent!)}
        </p>
      )}

      <div className={`sp-reveal__score sp-band--${band}`}>
        <span className={`sp-tile sp-tile--inline sp-band--${band}`} aria-hidden="true" />
        <span className="sp-reveal__points">
          <strong>{score.toLocaleString("en-IN")}</strong> / 1,000
        </span>
        <span className="tbd-label tbd-label--sm">{BAND_LABEL[band]}</span>
      </div>

      <button type="button" className="tbd-btn sp-btn-block" onClick={onNext} autoFocus>
        {isLast ? "See results" : "Next product"} <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
      </button>

      <p className="sp-reveal__source">
        {PRICE_TYPE_LABEL[result.priceType] ?? "Price"} via{" "}
        <a href={result.priceSource} target="_blank" rel="noopener noreferrer">
          {sourceHost(result.priceSource)} <ExternalLink size={11} strokeWidth={1.5} aria-hidden="true" />
        </a>{" "}
        · verified {formatDate(result.verifiedAt)}
      </p>
    </section>
  );
}
