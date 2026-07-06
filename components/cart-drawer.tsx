"use client";

import type { ForgeProduct } from "@/lib/types";
import { X, ShoppingBag, ExternalLink, Loader2 } from "lucide-react";

type CheckoutResult = {
  mode: string;
  total: number;
  checkoutUrl?: string;
  checkouts?: {
    storeName: string;
    subtotal: number;
    itemCount: number;
    url: string;
  }[];
  message?: string;
};

export function CartDrawer({
  open,
  onClose,
  products,
  onCheckout,
  checkingOut,
  checkoutResult,
}: {
  open: boolean;
  onClose: () => void;
  products: ForgeProduct[];
  onCheckout: () => void;
  checkingOut: boolean;
  checkoutResult: CheckoutResult | null;
}) {
  const total = products.reduce((s, p) => s + p.price, 0);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-md flex-col bg-zinc-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 p-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <ShoppingBag className="h-5 w-5 text-emerald-400" />
            Cart ({products.length})
          </h2>
          <button type="button" onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {products.length === 0 ? (
            <p className="text-center text-zinc-500 py-8">Apply mods to add them to cart</p>
          ) : (
            products.map((p, i) => (
              <div key={`${p.id}-${i}`} className="flex justify-between rounded-xl bg-zinc-900 p-3">
                <div>
                  <p className="font-medium text-sm">{p.name}</p>
                  <p className="text-xs text-zinc-500">{p.storeName}</p>
                </div>
                <span className="text-sm text-emerald-400">${p.price.toLocaleString()}</span>
              </div>
            ))
          )}
        </div>

        {checkoutResult?.mode === "multi-store" && checkoutResult.checkouts && (
          <div className="border-t border-zinc-800 p-4 space-y-2">
            <p className="text-xs text-zinc-400">{checkoutResult.message}</p>
            {checkoutResult.checkouts.map((c) => (
              <a
                key={c.storeName}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl bg-zinc-900 p-3 text-sm hover:bg-zinc-800"
              >
                <span>{c.storeName} ({c.itemCount})</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  ${c.subtotal.toLocaleString()}
                  <ExternalLink className="h-3.5 w-3.5" />
                </span>
              </a>
            ))}
          </div>
        )}

        <div className="border-t border-zinc-800 p-4">
          <div className="mb-4 flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span className="text-emerald-400">${total.toLocaleString()}</span>
          </div>
          {checkoutResult?.checkoutUrl ? (
            <a
              href={checkoutResult.checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 font-bold text-black"
            >
              Complete Shopify Checkout
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : (
            <button
              type="button"
              onClick={onCheckout}
              disabled={!products.length || checkingOut}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 font-bold text-black disabled:opacity-50"
            >
              {checkingOut ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating checkout…
                </>
              ) : (
                "Checkout via Shopify Stores"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}