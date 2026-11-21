import { PRODUCTS } from "../data/products";
import type { Answer, Product, PublicProduct } from "../types/product";
import type { Catalog } from "./game";

/**
 * The only module that joins presentation and answers. Swapping this for a
 * server call later (getAnswer after submit) is what makes the game cheat-resistant.
 */
const byId = new Map<string, Product>(PRODUCTS.map((p) => [p.id, p]));

export function toPublic(p: Product): PublicProduct {
  return { id: p.id, brand: p.brand, name: p.name, variant: p.variant, category: p.category, imageUrl: p.imageUrl };
}

export const catalog: Catalog = {
  getProduct(id) {
    const p = byId.get(id);
    return p && toPublic(p);
  },
  getAnswer(id): Answer | undefined {
    const p = byId.get(id);
    return p && { id: p.id, priceINR: p.priceINR, priceType: p.priceType, priceSource: p.priceSource, verifiedAt: p.verifiedAt };
  },
};

export function imageSrc(imageUrl: string): string {
  if (!imageUrl) return "";
  if (/^https?:\/\//.test(imageUrl)) return imageUrl;
  return import.meta.env.BASE_URL + imageUrl.replace(/^\//, "");
}

export function preloadImage(imageUrl: string): void {
  const src = imageSrc(imageUrl);
  if (src) new Image().src = src;
}

export { PRODUCTS };
