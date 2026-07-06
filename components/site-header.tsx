"use client";

import Link from "next/link";
import { Sparkles, ShoppingBag, Store } from "lucide-react";
import { AuthButton } from "@/components/auth-button";

export function SiteHeader({
  cartCount = 0,
  onCartClick,
}: {
  cartCount?: number;
  onCartClick?: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[90rem] items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-emerald-400" />
          <div>
            <span className="text-xl font-bold tracking-tight">Forgeara</span>
            <span className="ml-2 hidden text-xs text-zinc-500 sm:inline">
              2027
            </span>
          </div>
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-zinc-400 md:flex">
          <Link
            href="/customize?demo=true"
            className="text-emerald-400 transition hover:text-emerald-300"
          >
            Demo
          </Link>
          <Link href="/customize" className="transition hover:text-white">
            Customizer
          </Link>
          <Link href="/garage" className="transition hover:text-white">
            Garage
          </Link>
          <Link
            href="/stores"
            className="inline-flex items-center gap-1 transition hover:text-white"
          >
            <Store className="h-3.5 w-3.5" />
            Shopify Stores
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          {onCartClick && (
            <button
              type="button"
              onClick={onCartClick}
              className="relative rounded-full border border-zinc-700 p-2 text-zinc-300 transition hover:border-emerald-500/50 hover:text-white"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-black">
                  {cartCount}
                </span>
              )}
            </button>
          )}
          <AuthButton />
        </div>
      </div>
    </header>
  );
}