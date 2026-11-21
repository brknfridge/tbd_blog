export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <span className={`sp-logo sp-logo--${size}`} aria-label="spendle.">
      spendle<span className="sp-logo__dot">.</span>
    </span>
  );
}
