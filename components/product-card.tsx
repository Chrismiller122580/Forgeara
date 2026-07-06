"use client";

import type { ForgeProduct } from "@/lib/types";
import { Store, Star, Plus, Check } from "lucide-react";

export function ProductCard({
  product,
  applied,
  compatibility,
  onApply,
  compact,
}: {
  product: ForgeProduct;
  applied?: boolean;
  compatibility?: number;
  onApply: (p: ForgeProduct) => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onApply(product)}
      className={`group w-full rounded-xl border text-left transition ${
        applied
          ? "border-emerald-500/50 bg-emerald-500/10"
          : "border-zinc-800 bg-zinc-900/80 hover:border-emerald-500/30 hover:bg-zinc-800"
      } ${compact ? "p-3" : "p-4"}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {product.color && (
              <span
                className="h-3 w-3 shrink-0 rounded-full border border-zinc-600"
                style={{ backgroundColor: product.color }}
              />
            )}
            <span className={`font-medium truncate ${compact ? "text-sm" : ""}`}>
              {product.name}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
            <span className="inline-flex items-center gap-1">
              <Store className="h-3 w-3" />
              {product.storeName}
            </span>
            {product.rating && (
              <span className="inline-flex items-center gap-0.5 text-amber-400">
                <Star className="h-3 w-3 fill-current" />
                {product.rating}
              </span>
            )}
            {compatibility !== undefined && (
              <span className="text-emerald-400">{compatibility}% fit</span>
            )}
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="text-sm font-semibold text-emerald-400">
            ${product.price.toLocaleString()}
          </span>
          {applied ? (
            <Check className="h-4 w-4 text-emerald-400" />
          ) : (
            <Plus className="h-4 w-4 text-zinc-500 group-hover:text-emerald-400" />
          )}
        </div>
      </div>
    </button>
  );
}