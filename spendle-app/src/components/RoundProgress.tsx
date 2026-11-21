import type { RoundState } from "../types/game";
import { scoreBand } from "../lib/scoring";

export function RoundProgress({ rounds, current }: { rounds: RoundState[]; current: number }) {
  return (
    <div className="sp-progress">
      <span className="tbd-label tbd-label--sm">
        Round {current + 1} of {rounds.length}
      </span>
      <ol className="sp-progress__pips" aria-hidden="true">
        {rounds.map((r, i) => (
          <li
            key={i}
            className={`sp-pip ${r.resolved ? `sp-band--${scoreBand(r.score ?? 0)}` : ""} ${i === current ? "is-current" : ""}`}
          />
        ))}
      </ol>
    </div>
  );
}
