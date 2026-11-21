import { useEffect, useRef, useState } from "react";
import type { PublicProduct } from "../types/product";
import { imageSrc } from "../lib/catalog";
import { CATEGORY_LABEL } from "../lib/commentary";

const IMAGE_TIMEOUT_MS = 6000;

interface Props {
  product: PublicProduct;
  /** Fires once the card (image or fallback plate) is painted. */
  onReady?: () => void;
  compact?: boolean;
}

/** Typographic fallback in the [tbd] idiom: type and rules, no stock imagery. */
function Plate({ product }: { product: PublicProduct }) {
  return (
    <div className="sp-plate" aria-hidden="true">
      <span className="sp-plate__brand">{product.brand}</span>
      <span className="sp-plate__mark">{product.brand.charAt(0)}</span>
    </div>
  );
}

export function ProductCard({ product, onReady, compact }: Props) {
  const src = imageSrc(product.imageUrl);
  const [status, setStatus] = useState<"loading" | "loaded" | "fallback">(src ? "loading" : "fallback");
  const readyRef = useRef(onReady);
  readyRef.current = onReady;

  useEffect(() => {
    setStatus(src ? "loading" : "fallback");
  }, [src, product.id]);

  useEffect(() => {
    if (status === "loading") {
      const t = window.setTimeout(() => setStatus("fallback"), IMAGE_TIMEOUT_MS);
      return () => window.clearTimeout(t);
    }
    // Wait for the paint that shows the card before starting the clock. rAF can
    // be suspended in occluded windows, so a short timeout backs it up; the
    // visibility check in Game still holds the clock for hidden tabs.
    let fired = false;
    const fire = () => {
      if (fired) return;
      fired = true;
      readyRef.current?.();
    };
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(fire);
    });
    const fallback = window.setTimeout(fire, 150);
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      window.clearTimeout(fallback);
    };
  }, [status, product.id]);

  return (
    <article className={`sp-card ${compact ? "sp-card--compact" : ""}`}>
      <div className={`sp-card__media ${status === "loaded" ? "has-image" : ""}`}>
        {status !== "fallback" && src && (
          <img
            src={src}
            alt={`${product.brand} ${product.name}`}
            className={status === "loaded" ? "is-loaded" : ""}
            onLoad={() => setStatus("loaded")}
            onError={() => setStatus("fallback")}
            decoding="async"
          />
        )}
        {status === "loading" && <div className="sp-card__skeleton" aria-label="Loading product" />}
        {status === "fallback" && <Plate product={product} />}
      </div>
      <div className="sp-card__body">
        <div className="sp-card__meta">
          <span className="tbd-eyebrow sp-card__brand">{product.brand}</span>
          <span className="sp-card__cat">{CATEGORY_LABEL[product.category]}</span>
        </div>
        <h2 className="sp-card__name">{product.name}</h2>
        <p className="sp-card__variant">{product.variant}</p>
      </div>
    </article>
  );
}
