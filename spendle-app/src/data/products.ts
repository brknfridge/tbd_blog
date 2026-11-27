import type { Product } from "../types/product";
import { LAUNCH_PRODUCTS } from "./products-launch";
import { REFRESH_PRODUCTS } from "./products-2026-11";
import { DECEMBER_PRODUCTS } from "./products-2026-12";

/**
 * Every product Spendle has ever used. Pools decide which set a game draws from (see POOLS in
 * config.ts); old pools stay here so completed games and streak history keep resolving.
 */
export const PRODUCTS: Product[] = [...LAUNCH_PRODUCTS, ...REFRESH_PRODUCTS, ...DECEMBER_PRODUCTS];
