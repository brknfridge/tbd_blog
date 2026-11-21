import { Logo } from "./Logo";

export function Header({ onHome, right }: { onHome?: () => void; right?: React.ReactNode }) {
  return (
    <header className="sp-header">
      {onHome ? (
        <button type="button" className="sp-header__home" onClick={onHome} aria-label="spendle home">
          <Logo size="sm" />
        </button>
      ) : (
        <a className="tbd-wordmark sp-header__tbd" href="/" aria-label="[tbd] home">tbd</a>
      )}
      <div className="sp-header__right">{right}</div>
    </header>
  );
}
