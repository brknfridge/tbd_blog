import type { Product, Category } from "../../types/product";

let n = 0;
export function makeProduct(category: Category, price: number, overrides: Partial<Product> = {}): Product {
  n++;
  return {
    id: `${category}-${n}`,
    brand: "Brand",
    name: `Product ${n}`,
    variant: "1 unit",
    category,
    imageUrl: "",
    priceINR: price,
    priceType: "MRP",
    priceSource: "https://example.com",
    verifiedAt: "2026-11-22",
    active: true,
    ...overrides,
  };
}

export function catalogOf(counts: Partial<Record<Category, number>>): Product[] {
  const out: Product[] = [];
  for (const [c, k] of Object.entries(counts) as [Category, number][]) {
    for (let i = 0; i < k; i++) out.push(makeProduct(c, 100 * (i + 1)));
  }
  return out;
}
