import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS } from "@/lib/products";
import { createShopifyCheckout, isShopifyLive } from "@/lib/shopify/client";
import { getStoreById, getStoreCheckoutUrl } from "@/lib/shopify/stores";
import { groupByStore } from "@/lib/cart";
import { requireSession, upsertAccountFromSession } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const productIds: string[] = body.productIds ?? [];

  if (!productIds.length) {
    return NextResponse.json({ error: "No products in cart" }, { status: 400 });
  }

  const session = await requireSession();
  if (!session) {
    return NextResponse.json(
      { error: "Login required to checkout", loginUrl: "/auth/login?returnTo=/customize" },
      { status: 401 }
    );
  }

  const account = await upsertAccountFromSession();
  const products = PRODUCTS.filter((p) => productIds.includes(p.id));
  const total = products.reduce((s, p) => s + p.price, 0);

  if (isShopifyLive()) {
    const lines = products
      .filter((p) => p.shopifyVariantId)
      .map((p) => ({
        merchandiseId: p.shopifyVariantId!,
        quantity: productIds.filter((id) => id === p.id).length,
      }));

    if (lines.length) {
      try {
        const cart = await createShopifyCheckout(lines);
        return NextResponse.json({
          mode: "shopify",
          checkoutUrl: cart?.checkoutUrl,
          total,
          userId: account?.id,
        });
      } catch (e) {
        return NextResponse.json(
          { error: e instanceof Error ? e.message : "Checkout failed" },
          { status: 500 }
        );
      }
    }
  }

  const storeGroups = groupByStore(productIds, PRODUCTS);
  const checkouts = storeGroups.map((g) => {
    const store = getStoreById(g.storeId);
    const handle = g.products[0]?.shopifyHandle;
    return {
      storeId: g.storeId,
      storeName: g.storeName,
      subtotal: g.subtotal,
      itemCount: g.products.length,
      url: store ? getStoreCheckoutUrl(store, handle) : "#",
    };
  });

  return NextResponse.json({
    mode: "multi-store",
    total,
    checkouts,
    userId: account?.id,
    userEmail: session.user.email,
    message: "Logged in — checkout splits across partner Shopify stores.",
  });
}