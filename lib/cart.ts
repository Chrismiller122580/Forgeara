import type { CartLine, ForgeProduct } from "@/lib/types";

export function linesFromProductIds(productIds: string[]): CartLine[] {
  const counts = new Map<string, number>();
  for (const id of productIds) {
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([productId, quantity]) => ({
    productId,
    quantity,
  }));
}

export function groupByStore(
  productIds: string[],
  products: ForgeProduct[]
) {
  const groups = new Map<string, { storeName: string; products: ForgeProduct[]; subtotal: number }>();

  for (const id of productIds) {
    const product = products.find((p) => p.id === id);
    if (!product) continue;
    const existing = groups.get(product.storeId) ?? {
      storeName: product.storeName,
      products: [],
      subtotal: 0,
    };
    existing.products.push(product);
    existing.subtotal += product.price;
    groups.set(product.storeId, existing);
  }

  return Array.from(groups.entries()).map(([storeId, data]) => ({
    storeId,
    ...data,
  }));
}