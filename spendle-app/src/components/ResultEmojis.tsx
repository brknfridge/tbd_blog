import { scoreBand, BAND_LABEL } from "../lib/scoring";

/** Coloured tiles mirroring the shared emoji row, in round order. */
export function ResultEmojis({ scores, size = "md" }: { scores: (number | null)[]; size?: "sm" | "md" | "lg" }) {
  return (
    <ol className={`sp-tiles sp-tiles--${size}`} aria-label="Round results">
      {scores.map((s, i) => {
        const band = s === null ? null : scoreBand(s);
        return (
          <li
            key={i}
            className={`sp-tile ${band ? `sp-band--${band}` : "is-empty"}`}
            style={{ animationDelay: `${i * 60}ms` }}
            aria-label={band ? `Round ${i + 1}: ${BAND_LABEL[band]}` : `Round ${i + 1}: not played`}
          />
        );
      })}
    </ol>
  );
}
