export type Category = "grocery" | "beauty" | "luxury" | "one_off";

export type PriceType = "MRP" | "official_list" | "ex_showroom" | "asking";

/** A record in the product database. `priceINR` is the answer. */
export interface Product {
  id: string;
  brand: string;
  name: string;
  variant: string;
  category: Category;
  /** Path under public/ (e.g. "products/maggi.webp") or empty for the typographic plate. */
  imageUrl: string;
  priceINR: number;
  priceType: PriceType;
  priceSource: string;
  verifiedAt: string;
  active: boolean;
  /** Research notes: pack-size substitutions, why a record is inactive, etc. */
  notes?: string;
}

/** What the guessing screen is allowed to see — no price, no source. */
export type PublicProduct = Pick<
  Product,
  "id" | "brand" | "name" | "variant" | "category" | "imageUrl"
>;

/** The answer half of a product, looked up only after a round resolves. */
export type Answer = Pick<Product, "id" | "priceINR" | "priceType" | "priceSource" | "verifiedAt">;
