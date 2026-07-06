"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { SiteHeader } from "@/components/site-header";
import { PRODUCTS } from "@/lib/products";
import type { SavedBuild } from "@/lib/types";
import { ExternalLink } from "lucide-react";

const CarViewer = dynamic(
  () => import("@/components/car-viewer").then((m) => m.CarViewer),
  { ssr: false }
);

export default function SharedBuildPage() {
  const params = useParams();
  const id = params.id as string;
  const [build, setBuild] = useState<SavedBuild | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/builds/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setBuild(d?.build ?? null))
      .finally(() => setLoading(false));
  }, [id]);

  const mods = build
    ? PRODUCTS.filter((p) => build.appliedProductIds.includes(p.id))
    : [];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-zinc-400">
        Loading build…
      </div>
    );
  }

  if (!build) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <div className="mx-auto max-w-lg px-6 py-24 text-center">
          <h1 className="text-2xl font-bold">Build not found</h1>
          <p className="mt-2 text-zinc-400">
            This share link may have expired (server restart). Save builds again
            from the customizer.
          </p>
          <Link
            href="/customize?demo=true"
            className="mt-6 inline-block text-emerald-400 hover:underline"
          >
            Open demo customizer
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <p className="text-sm text-emerald-400">Shared Forgeara Build</p>
        <h1 className="mt-1 text-3xl font-bold">{build.name}</h1>
        <p className="mt-2 text-zinc-400">
          {build.vehicle.label} • {mods.length} mods • $
          {build.totalPrice.toLocaleString()}
        </p>

        <div className="mt-8 h-80 overflow-hidden rounded-2xl border border-zinc-800">
          <CarViewer appliedMods={mods} />
        </div>

        <ul className="mt-6 space-y-2">
          {mods.map((m) => (
            <li
              key={m.id}
              className="flex justify-between rounded-xl bg-zinc-900 px-4 py-3 text-sm"
            >
              <span>
                {m.name}{" "}
                <span className="text-zinc-500">via {m.storeName}</span>
              </span>
              <span className="text-emerald-400">${m.price.toLocaleString()}</span>
            </li>
          ))}
        </ul>

        <Link
          href="/customize?demo=true"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-medium text-black"
        >
          Forge your own
          <ExternalLink className="h-4 w-4" />
        </Link>
      </main>
    </div>
  );
}