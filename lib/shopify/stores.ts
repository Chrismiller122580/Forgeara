import type { ShopifyStore } from "@/lib/types";

export const PARTNER_STORES: ShopifyStore[] = [
  {
    id: "forgeara-official",
    name: "Forgeara Official",
    slug: "forgeara-official",
    domain: "forgeara-official.myshopify.com",
    description: "Premium wraps, body kits, and exterior transformations.",
    specialty: ["exterior", "performance"],
    logoEmoji: "🛠️",
    rating: 4.9,
    productCount: 128,
    featured: true,
  },
  {
    id: "rimforge",
    name: "RimForge Co",
    slug: "rimforge",
    domain: "rimforge-co.myshopify.com",
    description: "Forged wheels, spacers, and fitment-perfect rim packages.",
    specialty: ["wheels"],
    logoEmoji: "🛞",
    rating: 4.8,
    productCount: 84,
    featured: true,
  },
  {
    id: "interior-luxe",
    name: "Interior Luxe",
    slug: "interior-luxe",
    domain: "interior-luxe.myshopify.com",
    description: "Recaro seats, alcantara, carbon trim, and cabin upgrades.",
    specialty: ["interior"],
    logoEmoji: "💺",
    rating: 4.9,
    productCount: 96,
    featured: true,
  },
  {
    id: "led-dynamics",
    name: "LED Dynamics",
    slug: "led-dynamics",
    domain: "led-dynamics.myshopify.com",
    description: "Headlights, underglow, DRL kits, and smart lighting.",
    specialty: ["lighting", "exterior"],
    logoEmoji: "💡",
    rating: 4.7,
    productCount: 62,
    featured: false,
  },
  {
    id: "track-spec",
    name: "TrackSpec Performance",
    slug: "track-spec",
    domain: "trackspec-performance.myshopify.com",
    description: "Coilovers, exhaust, aero, and track-ready hardware.",
    specialty: ["performance", "exterior"],
    logoEmoji: "🏁",
    rating: 4.8,
    productCount: 71,
    featured: false,
  },
];

export function getStoreById(id: string) {
  return PARTNER_STORES.find((s) => s.id === id);
}

export function getStoreCheckoutUrl(store: ShopifyStore, handle?: string) {
  if (handle) {
    return `https://${store.domain}/products/${handle}`;
  }
  return `https://${store.domain}/collections/all`;
}