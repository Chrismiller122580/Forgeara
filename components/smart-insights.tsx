"use client";

import type { SmartInsight, ForgeProduct } from "@/lib/types";
import { Sparkles, TrendingUp, Target, Tag } from "lucide-react";

const ICONS = {
  recommendation: Sparkles,
  compatibility: Target,
  deal: Tag,
  trending: TrendingUp,
};

export function SmartInsights({
  insights,
  onApply,
  products,
}: {
  insights: SmartInsight[];
  onApply: (p: ForgeProduct) => void;
  products: ForgeProduct[];
}) {
  if (!insights.length) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
        Forgeara AI
      </p>
      {insights.map((insight, i) => {
        const Icon = ICONS[insight.type];
        const product = insight.productId
          ? products.find((p) => p.id === insight.productId)
          : null;

        return (
          <div
            key={i}
            className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3"
          >
            <div className="flex gap-2">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{insight.title}</p>
                <p className="mt-0.5 text-xs text-zinc-400">{insight.message}</p>
                {product && (
                  <button
                    type="button"
                    onClick={() => onApply(product)}
                    className="mt-2 text-xs font-medium text-emerald-400 hover:underline"
                  >
                    + Add {product.name}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}