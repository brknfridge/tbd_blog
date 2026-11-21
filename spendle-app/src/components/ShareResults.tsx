import { useEffect, useRef, useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { canNativeShare, copyText, nativeShare } from "../lib/sharing";

export function ShareResults({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef<number>();
  const preRef = useRef<HTMLPreElement>(null);
  const shareable = canNativeShare();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    const ok = await copyText(text);
    setFailed(!ok);
    if (ok) {
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    } else if (preRef.current) {
      // Last resort: select the preview so the player can copy by hand.
      const range = document.createRange();
      range.selectNodeContents(preRef.current);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  };

  const share = async () => {
    const res = await nativeShare(text);
    if (res === "failed") copy();
  };

  return (
    <div className="sp-share">
      <pre ref={preRef} className="sp-share__preview" aria-label="Share preview">{text}</pre>
      <div className="sp-share__actions">
        <button type="button" className={`tbd-btn sp-btn-block ${copied ? "is-copied" : ""}`} onClick={copy}>
          {copied ? "Copied!" : "Copy results"}
          {copied ? <Check size={16} strokeWidth={1.5} aria-hidden="true" /> : <Copy size={16} strokeWidth={1.5} aria-hidden="true" />}
        </button>
        {shareable && (
          <button type="button" className="tbd-btn tbd-btn--ghost sp-btn-block" onClick={share}>
            Share <Share2 size={16} strokeWidth={1.5} aria-hidden="true" />
          </button>
        )}
      </div>
      <p className="sp-share__status" role="status">
        {failed ? "Couldn't reach the clipboard. The text above is selected — copy it manually." : " "}
      </p>
    </div>
  );
}
