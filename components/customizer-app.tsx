"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Camera,
  Search,
  Share2,
  ShoppingBag,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { PhotoPreview } from "@/components/photo-preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/product-card";
import { SmartInsights } from "@/components/smart-insights";
import { CartDrawer } from "@/components/cart-drawer";
import { VehicleBadge } from "@/components/vehicle-badge";
import { PRODUCTS, getProductsByCategory } from "@/lib/products";
import { DEMO_APPLIED_MOD_IDS, DEMO_VEHICLE, isDemoMode } from "@/lib/demo";
import { detectVehicle } from "@/lib/ai/vehicle-detect";
import { getSmartInsights, getCompatibilityScore } from "@/lib/ai/recommendations";
import type { ForgeProduct, ProductCategory, VehicleProfile } from "@/lib/types";

const CarViewer = dynamic(
  () => import("@/components/car-viewer").then((m) => m.CarViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[320px] items-center justify-center text-zinc-500">
        Loading 3D viewer…
      </div>
    ),
  }
);

const CATEGORIES: ProductCategory[] = [
  "exterior",
  "wheels",
  "interior",
  "lighting",
  "performance",
];

export function CustomizerApp() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const demo = isDemoMode(searchParams);
  const storeFilter = searchParams.get("store");
  const initialPhoto = demo ? DEMO_VEHICLE.photoUrl : searchParams.get("photo");
  const fileRef = useRef<HTMLInputElement>(null);

  const [catalog, setCatalog] = useState<ForgeProduct[]>(PRODUCTS);
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialPhoto);
  const [previewMode, setPreviewMode] = useState<"photo" | "3d">(demo ? "3d" : "photo");
  const [appliedIds, setAppliedIds] = useState<string[]>(
    demo ? [...DEMO_APPLIED_MOD_IDS] : []
  );
  const [search, setSearch] = useState("");
  const [vehicle, setVehicle] = useState<VehicleProfile | null>(
    demo
      ? {
          make: "Ford",
          model: "Mustang GT",
          year: 2024,
          label: "2024 Ford Mustang GT",
          bodyStyle: "Coupe",
          confidence: 0.97,
        }
      : null
  );
  const [detecting, setDetecting] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState<{
    mode: string;
    total: number;
    checkoutUrl?: string;
    checkouts?: { storeName: string; subtotal: number; itemCount: number; url: string }[];
    message?: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [forgeStatus, setForgeStatus] = useState(
    demo
      ? "📸 Your Mustang in Cape Coral driveway loaded • 3 mods pre-forged"
      : "📸 Snap or upload your vehicle to start forging"
  );

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => {
        if (d.products?.length) setCatalog(d.products);
      })
      .catch(() => {});
  }, []);

  const appliedMods = useMemo(
    () =>
      appliedIds
        .map((id) => catalog.find((p) => p.id === id))
        .filter((p): p is ForgeProduct => !!p),
    [appliedIds, catalog]
  );

  const runDetection = useCallback(async (file?: File | null, url?: string | null) => {
    setDetecting(true);
    const detected = await detectVehicle(file, url);
    setVehicle(detected);
    setDetecting(false);
  }, []);

  useEffect(() => {
    if (demo || !photoUrl) return;
    let active = true;
    (async () => {
      setDetecting(true);
      const detected = await detectVehicle(null, photoUrl);
      if (active) {
        setVehicle(detected);
        setDetecting(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [demo, photoUrl]);

  const apply = useCallback((product: ForgeProduct) => {
    setAppliedIds((prev) => {
      if (prev.includes(product.id)) return prev;
      setForgeStatus(`🔥 Forged on your car: ${product.name} • 3D preview refreshed`);
      return [...prev, product.id];
    });
  }, []);

  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase();
    return catalog.filter((p) => {
      if (storeFilter && p.storeId !== storeFilter) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.storeName.toLowerCase().includes(q)
      );
    });
  }, [catalog, search, storeFilter]);

  const insights = useMemo(
    () =>
      vehicle
        ? getSmartInsights(vehicle, appliedIds, catalog)
        : [],
    [vehicle, appliedIds, catalog]
  );

  const totalPrice = appliedMods.reduce((sum, p) => sum + p.price, 0);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
    setPreviewMode("photo");
    setForgeStatus("📸 Photo uploaded • AI detecting your vehicle…");
    await runDetection(file, url);
    setForgeStatus("📸 Photo uploaded + AI detected your vehicle • Ready to forge");
  };

  const redirectToLogin = () => {
    window.location.href = "/auth/login?returnTo=/customize";
  };

  const handleSave = async () => {
    if (!vehicle) return;
    if (!appliedIds.length) return;
    setSaving(true);
    try {
      const res = await fetch("/api/builds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${vehicle.model} Build`,
          vehicle,
          photoUrl,
          appliedProductIds: appliedIds,
        }),
      });
      if (res.status === 401) {
        redirectToLogin();
        return;
      }
      if (!res.ok) {
        const err = await res.json();
        alert(err.error ?? "Save failed");
        return;
      }
      const { build, persisted } = await res.json();
      const fullUrl = `${window.location.origin}${build.shareUrl}`;
      await navigator.clipboard.writeText(fullUrl).catch(() => {});
      alert(
        `Build saved${persisted ? " to your garage" : ""}!\nShare link copied:\n${fullUrl}`
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    setCheckoutResult(null);
    try {
      const res = await fetch("/api/shopify/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds: appliedIds }),
      });
      if (res.status === 401) {
        setCartOpen(false);
        redirectToLogin();
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        alert(data.error ?? "Checkout failed");
        return;
      }
      setCheckoutResult(data);
    } catch {
      alert("Checkout failed — try again");
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SiteHeader cartCount={appliedMods.length} onCartClick={() => setCartOpen(true)} />

      <div className="mx-auto max-w-[90rem] px-4 py-6 sm:px-6">
        {!user && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm">
            <span className="text-zinc-300">
              Log in to save builds to your garage and checkout via Shopify.
            </span>
            <div className="flex shrink-0 gap-2">
              <a
                href="/auth/login?connection=google-oauth2&returnTo=/customize"
                className="rounded-lg border border-zinc-600 bg-zinc-900 px-4 py-1.5 font-medium text-zinc-200 hover:border-emerald-500/40"
              >
                Google
              </a>
              <a
                href="/auth/login?returnTo=/customize"
                className="rounded-lg bg-emerald-500 px-4 py-1.5 font-medium text-black hover:bg-emerald-400"
              >
                Log in
              </a>
            </div>
          </div>
        )}

        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-400" />
              <h1 className="text-3xl font-bold sm:text-4xl">Smart Customizer</h1>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <VehicleBadge vehicle={vehicle} detecting={detecting} />
              {storeFilter && (
                <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
                  Filtering: {catalog.find((p) => p.storeId === storeFilter)?.storeName}
                </span>
              )}
            </div>
          </div>
          {demo && (
            <Link
              href="/customize"
              className="text-sm text-zinc-400 underline-offset-4 hover:text-white hover:underline"
            >
              Exit Demo
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <aside className="space-y-4 lg:col-span-3">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-medium transition hover:bg-emerald-500"
            >
              <Camera className="h-5 w-5" />
              Snap or Upload
            </button>

            {vehicle && (
              <SmartInsights
                insights={insights}
                onApply={apply}
                products={catalog}
              />
            )}

            <Tabs defaultValue="exterior" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="exterior">Ext</TabsTrigger>
                <TabsTrigger value="wheels">Wheels</TabsTrigger>
                <TabsTrigger value="interior">Int</TabsTrigger>
              </TabsList>
              <TabsContent value="exterior" className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                {getProductsByCategory("exterior")
                  .filter((p) => !storeFilter || p.storeId === storeFilter)
                  .map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      applied={appliedIds.includes(p.id)}
                      compatibility={vehicle ? getCompatibilityScore(p, vehicle) : undefined}
                      onApply={apply}
                      compact
                    />
                  ))}
              </TabsContent>
              <TabsContent value="wheels" className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                {getProductsByCategory("wheels")
                  .filter((p) => !storeFilter || p.storeId === storeFilter)
                  .map((p) => (
                    <ProductCard key={p.id} product={p} applied={appliedIds.includes(p.id)} onApply={apply} compact />
                  ))}
              </TabsContent>
              <TabsContent value="interior" className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                {getProductsByCategory("interior")
                  .filter((p) => !storeFilter || p.storeId === storeFilter)
                  .map((p) => (
                    <ProductCard key={p.id} product={p} applied={appliedIds.includes(p.id)} onApply={apply} compact />
                  ))}
              </TabsContent>
            </Tabs>
          </aside>

          <section className="lg:col-span-6">
            <div className="overflow-hidden rounded-3xl border border-emerald-500/40 bg-zinc-900 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/20">
              <div className="border-b border-emerald-500/20 bg-emerald-500/5 px-4 py-2.5 text-center text-sm text-emerald-200">
                {forgeStatus}
              </div>
              <div className="flex flex-wrap gap-1 border-b border-zinc-800 p-2">
                {(["photo", "3d"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPreviewMode(mode)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      previewMode === mode
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {mode === "photo" ? "Photo View" : "3D Interactive"}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => alert("WebXR AR — launching Q2 2027 roadmap")}
                  className="ml-auto rounded-lg px-4 py-2 text-sm text-zinc-400 hover:text-emerald-400"
                >
                  AR Camera
                </button>
              </div>
              <div className="h-[34rem] bg-zinc-950 sm:h-[36rem]">
                {previewMode === "photo" ? (
                  <PhotoPreview photoUrl={photoUrl} appliedMods={appliedMods} />
                ) : (
                  <CarViewer appliedMods={appliedMods} />
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setAppliedIds([]);
                  setForgeStatus("↩️ Build reset • Snap or upload to forge again");
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-5 py-2.5 text-sm transition hover:bg-zinc-800"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !appliedMods.length}
                className="inline-flex items-center gap-2 rounded-xl bg-zinc-800 px-6 py-2.5 text-sm font-medium transition hover:bg-zinc-700 disabled:opacity-50"
              >
                <Share2 className="h-4 w-4" />
                {saving ? "Saving…" : "Save & Share"}
              </button>
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                disabled={!appliedMods.length}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-bold text-black transition hover:bg-emerald-400 disabled:opacity-50"
              >
                <ShoppingBag className="h-4 w-4" />
                Buy via Shopify (${totalPrice.toLocaleString()})
              </button>
            </div>
          </section>

          <aside className="lg:col-span-3">
            <div className="sticky top-20 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search 500+ parts & stores…"
                  className="w-full rounded-xl bg-zinc-800 py-3 pl-10 pr-4 text-sm outline-none ring-emerald-500/50 focus:ring-2"
                />
              </div>
              <div className="mt-3 flex gap-1 overflow-x-auto pb-1">
                {CATEGORIES.map((cat) => (
                  <span
                    key={cat}
                    className="shrink-0 rounded-full bg-zinc-800 px-2 py-0.5 text-xs capitalize text-zinc-400"
                  >
                    {cat}
                  </span>
                ))}
              </div>
              <div className="mt-4 max-h-[32rem] space-y-2 overflow-y-auto">
                {filteredProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    applied={appliedIds.includes(p.id)}
                    compatibility={vehicle ? getCompatibilityScore(p, vehicle) : undefined}
                    onApply={apply}
                  />
                ))}
              </div>
              {appliedMods.length > 0 && (
                <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm">
                  <p className="font-medium text-emerald-400">
                    {appliedMods.length} mods • ${totalPrice.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    From {new Set(appliedMods.map((m) => m.storeName)).size} Shopify stores
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        products={appliedMods}
        onCheckout={handleCheckout}
        checkingOut={checkingOut}
        checkoutResult={checkoutResult}
      />
    </div>
  );
}