"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Camera,
  Upload,
  Sparkles,
  Store,
  Brain,
  Box,
  Smartphone,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { PARTNER_STORES } from "@/lib/shopify/stores";

export default function Home() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    setPhotoUrl(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-zinc-950 to-zinc-950" />
          <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-300">
              <Sparkles className="h-4 w-4" />
              The smartest vehicle customizer of 2027
            </div>
            <h1 className="mt-6 text-5xl font-bold leading-[1.1] tracking-tight sm:text-7xl">
              Snap. Forge.
              <br />
              <span className="bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">
                Shop Shopify.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
              AI detects your vehicle, scores every mod for fit, previews in 3D
              and AR, then checks out across curated Shopify partner stores —
              all from one forge.
            </p>

            <div className="mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-4 text-center">
              {[
                { v: "5", l: "Shopify stores" },
                { v: "18+", l: "Live parts" },
                { v: "94%", l: "AI fit score" },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 py-4">
                  <p className="text-2xl font-bold text-emerald-400">{s.v}</p>
                  <p className="text-xs text-zinc-500">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-xl px-4 pb-10 sm:px-6">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <div
            className="cursor-pointer rounded-3xl border-2 border-dashed border-zinc-700 bg-zinc-900/40 p-10 text-center transition hover:border-emerald-500/40"
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFile(e.dataTransfer.files[0]);
            }}
          >
            {photoUrl ? (
              <div className="space-y-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoUrl}
                  alt="Your vehicle"
                  className="mx-auto max-h-52 rounded-2xl object-cover shadow-lg"
                />
                <p className="font-medium text-emerald-400">
                  AI ready — open the smart customizer
                </p>
              </div>
            ) : (
              <>
                <Camera className="mx-auto mb-4 h-14 w-14 text-zinc-600" />
                <p className="text-lg font-semibold">Snap or upload your vehicle</p>
                <p className="mt-2 flex items-center justify-center gap-2 text-sm text-zinc-500">
                  <Upload className="h-4 w-4" />
                  Drag & drop supported
                </p>
              </>
            )}
          </div>
        </section>

        <section className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 pb-16 sm:flex-row sm:justify-center sm:px-6">
          <Link
            href="/customize?demo=true"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-8 py-4 text-lg font-semibold text-emerald-300 transition hover:bg-emerald-500/20 sm:w-auto"
          >
            Try Demo Car
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href={
              photoUrl
                ? `/customize?photo=${encodeURIComponent(photoUrl)}`
                : "/customize"
            }
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-black transition hover:bg-zinc-200 sm:w-auto"
          >
            Smart Customizer
          </Link>
        </section>

        <section className="border-y border-zinc-800/80 bg-zinc-900/30 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-center text-2xl font-bold">Why Forgeara wins in 2027</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Brain, title: "AI Fit Engine", desc: "Vehicle detection + compatibility scoring on every part" },
                { icon: Store, title: "Shopify Stores", desc: "Multi-store checkout across verified merchants" },
                { icon: Box, title: "3D + Photo", desc: "Live previews on your actual car or interactive model" },
                { icon: ShoppingBag, title: "One-Click Buy", desc: "Cart routes to the right Shopify store per mod" },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-zinc-800 p-5 transition hover:border-emerald-500/20"
                >
                  <Icon className="mb-3 h-8 w-8 text-emerald-400" />
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-zinc-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold">Shopify partner stores</h2>
                <p className="mt-1 text-zinc-500">Curated merchants, unified experience</p>
              </div>
              <Link href="/stores" className="text-sm text-emerald-400 hover:underline">
                View all
              </Link>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PARTNER_STORES.filter((s) => s.featured).map((store) => (
                <Link
                  key={store.id}
                  href={`/customize?store=${store.id}`}
                  className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 transition hover:border-emerald-500/30"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 text-2xl">
                    {store.logoEmoji}
                  </span>
                  <div>
                    <p className="font-medium">{store.name}</p>
                    <p className="text-xs text-zinc-500">{store.productCount}+ products</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-zinc-800 px-4 py-16 text-center sm:px-6">
          <div className="relative h-48 overflow-hidden rounded-2xl">
            <Image
              src="/demo-vehicle.jpg"
              alt="Demo vehicle"
              fill
              className="object-cover opacity-60"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/50">
              <Smartphone className="mb-2 h-8 w-8 text-emerald-400" />
              <p className="font-semibold">AR preview — Q2 2027</p>
              <p className="text-sm text-zinc-400">See mods on your driveway in real space</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800 py-8 text-center text-sm text-zinc-600">
        Forgeara 2027 • Next.js + Shopify Storefront + Prisma + AI • Built with Grok
      </footer>
    </div>
  );
}