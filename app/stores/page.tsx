import { SiteHeader } from "@/components/site-header";
import { StoreCard } from "@/components/store-card";
import { PARTNER_STORES } from "@/lib/shopify/stores";
import { getProductsByStore } from "@/lib/products";
import Link from "next/link";

export const metadata = {
  title: "Shopify Partner Stores — Forgeara",
  description: "Browse 5+ curated Shopify stores for vehicle mods.",
};

export default function StoresPage() {
  const featured = PARTNER_STORES.filter((s) => s.featured);
  const more = PARTNER_STORES.filter((s) => !s.featured);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-emerald-400">
            Shopify Marketplace
          </p>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">
            Partner stores, one smart cart
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
            Forgeara routes your build across verified Shopify merchants — wraps,
            rims, interiors, lighting, and performance — with AI fit scoring on
            every part.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Partner stores", value: PARTNER_STORES.length },
            { label: "Live catalog parts", value: "18+" },
            { label: "AI fit accuracy", value: "94%" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 text-center"
            >
              <p className="text-3xl font-bold text-emerald-400">{stat.value}</p>
              <p className="mt-1 text-sm text-zinc-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <section className="mt-14">
          <h2 className="mb-6 text-xl font-semibold">Featured stores</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                products={getProductsByStore(store.id)}
              />
            ))}
          </div>
        </section>

        {more.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-6 text-xl font-semibold">More stores</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {more.map((store) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  products={getProductsByStore(store.id)}
                />
              ))}
            </div>
          </section>
        )}

        <div className="mt-16 text-center">
          <Link
            href="/customize?demo=true"
            className="inline-flex rounded-xl bg-emerald-500 px-8 py-4 font-bold text-black transition hover:bg-emerald-400"
          >
            Try the smart customizer
          </Link>
        </div>
      </main>
    </div>
  );
}