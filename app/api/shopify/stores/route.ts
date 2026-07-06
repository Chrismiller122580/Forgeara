import { NextResponse } from "next/server";
import { PARTNER_STORES } from "@/lib/shopify/stores";
import { getProductsByStore } from "@/lib/products";

export async function GET() {
  const stores = PARTNER_STORES.map((store) => ({
    ...store,
    products: getProductsByStore(store.id).slice(0, 4),
    liveProductCount: getProductsByStore(store.id).length,
  }));

  return NextResponse.json({ stores });
}