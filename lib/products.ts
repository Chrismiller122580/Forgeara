import type { ForgeProduct, ProductCategory } from "@/lib/types";

export const PRODUCTS: ForgeProduct[] = [
  { id: "wrap-black", name: "Matte Black Wrap", category: "exterior", price: 1299, color: "#1a1a1a", storeId: "forgeara-official", storeName: "Forgeara Official", shopifyHandle: "matte-black-wrap", compatibleVehicles: ["Mustang", "Camaro", "Challenger"], tags: ["wrap", "matte"], rating: 4.9, installs: 1240 },
  { id: "wrap-red", name: "Candy Red Wrap", category: "exterior", price: 1399, color: "#c41e3a", storeId: "forgeara-official", storeName: "Forgeara Official", shopifyHandle: "candy-red-wrap", compatibleVehicles: ["Mustang", "Corvette", "BMW M4"], tags: ["wrap", "gloss"], rating: 4.8, installs: 890 },
  { id: "wrap-satin", name: "Satin Gunmetal Wrap", category: "exterior", price: 1349, color: "#4a4f54", storeId: "forgeara-official", storeName: "Forgeara Official", shopifyHandle: "satin-gunmetal-wrap", compatibleVehicles: ["Mustang", "Audi RS5", "Tesla Model 3"], tags: ["wrap", "satin"], rating: 4.9, installs: 2100 },
  { id: "hood-cf", name: "Carbon Fiber Hood", category: "exterior", price: 899, color: "#2d2d2d", storeId: "forgeara-official", storeName: "Forgeara Official", shopifyHandle: "carbon-fiber-hood", compatibleVehicles: ["Mustang", "Civic Type R"], tags: ["carbon", "hood"], rating: 4.7, installs: 560 },
  { id: "widebody-kit", name: "Widebody Aero Kit", category: "exterior", price: 4299, color: "#111111", storeId: "forgeara-official", storeName: "Forgeara Official", shopifyHandle: "widebody-aero-kit", compatibleVehicles: ["Mustang", "Supra"], tags: ["aero", "widebody"], rating: 4.9, installs: 312 },
  { id: "bronze-rims", name: "Bronze Forged Rims", category: "wheels", price: 2499, color: "#cd7f32", storeId: "rimforge", storeName: "RimForge Co", shopifyHandle: "bronze-forged-rims", compatibleVehicles: ["Mustang", "BMW M3", "Audi S4"], tags: ["forged", "19in"], rating: 4.9, installs: 780 },
  { id: "chrome-rims", name: "Chrome 20\" Rims", category: "wheels", price: 1899, color: "#c0c0c0", storeId: "rimforge", storeName: "RimForge Co", shopifyHandle: "chrome-20-rims", compatibleVehicles: ["Mustang", "Charger"], tags: ["chrome", "20in"], rating: 4.6, installs: 445 },
  { id: "mesh-rims", name: "Matte Black Mesh Rims", category: "wheels", price: 2199, color: "#1a1a1a", storeId: "rimforge", storeName: "RimForge Co", shopifyHandle: "matte-black-mesh-rims", compatibleVehicles: ["Mustang", "GTI", "Civic Type R"], tags: ["mesh", "matte"], rating: 4.8, installs: 920 },
  { id: "recaro", name: "Leather Recaro Seats", category: "interior", price: 1899, color: "#8b4513", storeId: "interior-luxe", storeName: "Interior Luxe", shopifyHandle: "leather-recaro-seats", compatibleVehicles: ["Mustang", "Golf R"], tags: ["seats", "leather"], rating: 4.9, installs: 640 },
  { id: "dash-trim", name: "Carbon Dash Trim", category: "interior", price: 449, color: "#333333", storeId: "interior-luxe", storeName: "Interior Luxe", shopifyHandle: "carbon-dash-trim", compatibleVehicles: ["Mustang", "BMW 3 Series"], tags: ["trim", "carbon"], rating: 4.7, installs: 1100 },
  { id: "steering", name: "Alcantara Steering Wheel", category: "interior", price: 699, color: "#1c1c1c", storeId: "interior-luxe", storeName: "Interior Luxe", shopifyHandle: "alcantara-steering-wheel", compatibleVehicles: ["Mustang", "Porsche 911"], tags: ["steering", "alcantara"], rating: 4.8, installs: 890 },
  { id: "ambient-kit", name: "64-Color Ambient Light Kit", category: "interior", price: 329, storeId: "interior-luxe", storeName: "Interior Luxe", shopifyHandle: "ambient-light-kit", compatibleVehicles: ["Mustang", "Tesla Model Y"], tags: ["ambient", "lighting"], rating: 4.6, installs: 2300 },
  { id: "led-under", name: "Red LED Underbody", category: "lighting", price: 399, color: "#ff1744", storeId: "led-dynamics", storeName: "LED Dynamics", shopifyHandle: "red-led-underbody", compatibleVehicles: ["Mustang", "Challenger"], tags: ["underglow", "rgb"], rating: 4.5, installs: 1560 },
  { id: "led-head", name: "LED Headlights", category: "lighting", price: 599, storeId: "led-dynamics", storeName: "LED Dynamics", shopifyHandle: "led-headlights", compatibleVehicles: ["Mustang", "Camaro"], tags: ["headlights", "drl"], rating: 4.8, installs: 720 },
  { id: "drl-strip", name: "Sequential DRL Strips", category: "lighting", price: 249, storeId: "led-dynamics", storeName: "LED Dynamics", shopifyHandle: "sequential-drl-strips", compatibleVehicles: ["Mustang", "Civic"], tags: ["drl", "sequential"], rating: 4.7, installs: 980 },
  { id: "coilovers", name: "Adjustable Coilover Kit", category: "performance", price: 1599, storeId: "track-spec", storeName: "TrackSpec Performance", shopifyHandle: "adjustable-coilover-kit", compatibleVehicles: ["Mustang", "BRZ", "Miata"], tags: ["suspension", "track"], rating: 4.9, installs: 410 },
  { id: "exhaust-catback", name: "Titanium Cat-Back Exhaust", category: "performance", price: 2199, storeId: "track-spec", storeName: "TrackSpec Performance", shopifyHandle: "titanium-catback-exhaust", compatibleVehicles: ["Mustang", "Corvette"], tags: ["exhaust", "titanium"], rating: 4.8, installs: 290 },
  { id: "front-splitter", name: "Carbon Front Splitter", category: "performance", price: 749, color: "#2a2a2a", storeId: "track-spec", storeName: "TrackSpec Performance", shopifyHandle: "carbon-front-splitter", compatibleVehicles: ["Mustang", "GT4"], tags: ["aero", "splitter"], rating: 4.7, installs: 520 },
];

export function getProductsByCategory(category: ProductCategory) {
  return PRODUCTS.filter((p) => p.category === category);
}

export function getProductById(id: string) {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductsByStore(storeId: string) {
  return PRODUCTS.filter((p) => p.storeId === storeId);
}

export type { ForgeProduct, ProductCategory };