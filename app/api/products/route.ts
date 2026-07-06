import { NextResponse } from "next/server";
import { PRODUCTS } from "@/lib/products";
import { fetchShopifyProducts, isShopifyLive } from "@/lib/shopify/client";
import type { ForgeProduct, ProductCategory } from "@/lib/types";

function mapShopifyToForge(node: Awaited<ReturnType<typeof fetchShopifyProducts>>[0]): ForgeProduct {
  const tag = node.tags[0]?.toLowerCase() ?? "exterior";
  const category = (["exterior", "wheels", "interior", "lighting", "performance"].includes(tag)
    ? tag
    : "exterior") as ProductCategory;

  return {
    id: node.id,
    name: node.title,
    category,
    price: parseFloat(node.priceRange.minVariantPrice.amount),
    imageUrl: node.featuredImage?.url,
    description: node.description,
    storeId: "forgeara-official",
    storeName: "Forgeara Official (Shopify Live)",
    shopifyVariantId: node.variants.edges[0]?.node.id,
    shopifyHandle: node.handle,
    tags: node.tags,
  };
}

export async function GET() {
  const source = isShopifyLive() ? "shopify" : "catalog";

  if (isShopifyLive()) {
    try {
      const live = await fetchShopifyProducts(24);
      const products = live.map(mapShopifyToForge);
      return NextResponse.json({ products, source, storeCount: 5 });
    } catch {
      // fall through to local catalog
    }
  }

  return NextResponse.json({
    products: PRODUCTS,
    source: "catalog",
    storeCount: 5,
  });
}