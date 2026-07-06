import type { ForgeProduct, SmartInsight, VehicleProfile } from "@/lib/types";
import { PRODUCTS } from "@/lib/products";

function compatibilityScore(product: ForgeProduct, vehicle: VehicleProfile) {
  if (!product.compatibleVehicles?.length) return 0.75;
  const match = product.compatibleVehicles.some(
    (v) =>
      vehicle.model.includes(v) ||
      v.includes(vehicle.model.split(" ")[0]) ||
      vehicle.make.includes(v)
  );
  return match ? 0.95 : 0.55;
}

export function getSmartInsights(
  vehicle: VehicleProfile,
  appliedIds: string[],
  allProducts: ForgeProduct[] = PRODUCTS
): SmartInsight[] {
  const applied = new Set(appliedIds);
  const insights: SmartInsight[] = [];

  const categories = new Set(
    appliedIds.map((id) => allProducts.find((p) => p.id === id)?.category).filter(Boolean)
  );

  if (!categories.has("wheels") && !applied.has("bronze-rims")) {
    const rim = allProducts.find((p) => p.id === "bronze-rims");
    if (rim) {
      insights.push({
        type: "recommendation",
        title: "Complete the stance",
        message: `${Math.round(compatibilityScore(rim, vehicle) * 100)}% fit on your ${vehicle.model}. Bronze Forged Rims trending for ${vehicle.bodyStyle}s.`,
        productId: rim.id,
        score: compatibilityScore(rim, vehicle),
      });
    }
  }

  if (!categories.has("lighting")) {
    const led = allProducts.find((p) => p.id === "led-head");
    if (led) {
      insights.push({
        type: "trending",
        title: "Trending in your area",
        message: `LED Headlights — ${led.installs?.toLocaleString()} installs this month on ${vehicle.make} builds.`,
        productId: led.id,
      });
    }
  }

  if (categories.has("exterior") && !categories.has("performance")) {
    const splitter = allProducts.find((p) => p.id === "front-splitter");
    if (splitter) {
      insights.push({
        type: "recommendation",
        title: "Aero balance",
        message: "Pair your wrap with a carbon splitter for a track-ready look.",
        productId: splitter.id,
        score: 0.88,
      });
    }
  }

  const highCompat = allProducts
    .filter((p) => !applied.has(p.id))
    .map((p) => ({ product: p, score: compatibilityScore(p, vehicle) }))
    .filter((x) => x.score >= 0.9)
    .sort((a, b) => b.score - a.score)[0];

  if (highCompat) {
    insights.push({
      type: "compatibility",
      title: "Perfect match",
      message: `${highCompat.product.name} — ${Math.round(highCompat.score * 100)}% compatibility with your ${vehicle.label}.`,
      productId: highCompat.product.id,
      score: highCompat.score,
    });
  }

  const deal = allProducts.find((p) => p.id === "ambient-kit");
  if (deal && !applied.has(deal.id)) {
    insights.push({
      type: "deal",
      title: "Bundle savings",
      message: `Add ${deal.name} from Interior Luxe — 15% off when bundled with 2+ mods.`,
      productId: deal.id,
    });
  }

  return insights.slice(0, 4);
}

export function getCompatibilityScore(product: ForgeProduct, vehicle: VehicleProfile) {
  return Math.round(compatibilityScore(product, vehicle) * 100);
}