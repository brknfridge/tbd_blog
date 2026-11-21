import { forwardRef, useImperativeHandle, useLayoutEffect, useRef } from "react";
import { formatDigits, formatINRWords, sanitizeDigits } from "../lib/formatting";

interface Props {
  digits: string;
  onChange: (digits: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  error?: string | null;
}

export interface PriceInputHandle {
  focus: () => void;
}

/**
 * Controlled text input with inputMode=numeric so phones show the number pad.
 * Commas are display-only; state holds bare digits.
 */
export const PriceInput = forwardRef<PriceInputHandle, Props>(function PriceInput(
  { digits, onChange, onSubmit, disabled, error },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const caretDigits = useRef<number | null>(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus({ preventScroll: true }),
  }));

  // Keep the caret after the same number of digits once commas move around.
  useLayoutEffect(() => {
    const el = inputRef.current;
    const want = caretDigits.current;
    if (!el || want === null || document.activeElement !== el) return;
    caretDigits.current = null;
    const text = el.value;
    let pos = 0;
    let seen = 0;
    while (pos < text.length && seen < want) {
      if (/\d/.test(text[pos]!)) seen++;
      pos++;
    }
    el.setSelectionRange(pos, pos);
  }, [digits]);

  const words = digits ? formatINRWords(Number(digits)) : null;

  return (
    <div className={`sp-price ${error ? "has-error" : ""} ${disabled ? "is-disabled" : ""}`}>
      <label className="sp-price__field">
        <span className="sp-price__prefix" aria-hidden="true">₹</span>
        <input
          ref={inputRef}
          className="sp-price__input"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="done"
          placeholder="Enter your guess"
          aria-label="Your price guess in rupees"
          aria-invalid={!!error}
          aria-describedby="sp-price-help"
          disabled={disabled}
          value={formatDigits(digits)}
          onChange={(e) => {
            const raw = e.target.value;
            const sel = e.target.selectionStart ?? raw.length;
            caretDigits.current = raw.slice(0, sel).replace(/\D/g, "").length;
            onChange(sanitizeDigits(raw));
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSubmit();
            }
          }}
        />
      </label>
      <p id="sp-price-help" className="sp-price__help" aria-live="polite">
        {error ? <span className="sp-price__error">{error}</span> : words ?? " "}
      </p>
    </div>
  );
});
