import { ROUND_MS } from "../config";

interface Props {
  deadline: number | null;
  seconds: number | null;
  stopped: boolean;
}

/**
 * The bar is a single CSS animation offset by elapsed time, so it stays smooth
 * without per-frame React renders and picks up exactly where it was after a reload.
 */
export function CountdownTimer({ deadline, seconds, stopped }: Props) {
  const started = deadline !== null;
  const elapsed = started ? Math.min(ROUND_MS, Math.max(0, ROUND_MS - (deadline - Date.now()))) : 0;
  const shown = seconds ?? Math.round(ROUND_MS / 1000);
  const urgent = started && !stopped && shown <= 5;
  return (
    <div className={`sp-timer ${urgent ? "is-urgent" : ""} ${started ? "" : "is-waiting"}`} role="timer" aria-live="off">
      <div className="sp-timer__row">
        <span className="tbd-label tbd-label--sm sp-timer__label">{started ? (stopped ? "Locked" : "Time left") : "Loading"}</span>
        <span className="sp-timer__secs" aria-label={`${shown} seconds left`}>
          {String(shown).padStart(2, "0")}
        </span>
      </div>
      <div className="sp-timer__track">
        <div
          key={deadline ?? "idle"}
          className={`sp-timer__bar ${started ? "is-running" : ""} ${stopped ? "is-stopped" : ""}`}
          style={started ? { animationDuration: `${ROUND_MS}ms`, animationDelay: `-${elapsed}ms` } : undefined}
        />
      </div>
    </div>
  );
}
