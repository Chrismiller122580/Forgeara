import Link from "next/link";
import type { ShopifyStore } from "@/lib/types";
import type { ForgeProduct } from "@/lib/types";
import { Star, ExternalLink, Package } from "lucide-react";

export function StoreCard({
  store,
  products,
}: {
  store: ShopifyStore;
  products?: ForgeProduct[];
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 transition hover:border-emerald-500/30">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 text-2xl">
            {store.logoEmoji}
          </span>
          <div>
            <h3 className="text-lg font-semibold">{store.name}</h3>
            <p className="text-sm text-zinc-500">{store.domain}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm text-amber-400">
          <Star className="h-4 w-4 fill-current" />
          {store.rating}
        </div>
      </div>
      <p className="mt-4 text-sm text-zinc-400">{store.description}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {store.specialty.map((s) => (
          <span
            key={s}
            className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs capitalize text-zinc-300"
          >
            {s}
          </span>
        ))}
      </div>
      {products && products.length > 0 && (
        <div className="mt-4 space-y-2 border-t border-zinc-800 pt-4">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Top parts
          </p>
          {products.slice(0, 3).map((p) => (
            <div key={p.id} className="flex justify-between text-sm">
              <span className="text-zinc-300">{p.name}</span>
              <span className="text-emerald-400">${p.price.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
          <Package className="h-3.5 w-3.5" />
          {store.productCount}+ products
        </span>
        <Link
          href={`/customize?store=${store.id}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-emerald-400 hover:text-emerald-300"
        >
          Shop store
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}