export type ProductCategory = "exterior" | "wheels" | "interior" | "lighting" | "performance";

export type ForgeProduct = {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  color?: string;
  imageUrl?: string;
  description?: string;
  storeId: string;
  storeName: string;
  shopifyVariantId?: string;
  shopifyHandle?: string;
  compatibleVehicles?: string[];
  tags?: string[];
  rating?: number;
  installs?: number;
};

export type ShopifyStore = {
  id: string;
  name: string;
  slug: string;
  domain: string;
  description: string;
  specialty: ProductCategory[];
  logoEmoji: string;
  rating: number;
  productCount: number;
  featured: boolean;
};

export type VehicleProfile = {
  make: string;
  model: string;
  year: number;
  label: string;
  bodyStyle: string;
  confidence: number;
};

export type SavedBuild = {
  id: string;
  name: string;
  vehicle: VehicleProfile;
  photoUrl: string | null;
  appliedProductIds: string[];
  totalPrice: number;
  createdAt: string;
  shareUrl: string;
};

export type CartLine = {
  productId: string;
  quantity: number;
};

export type SmartInsight = {
  type: "recommendation" | "compatibility" | "deal" | "trending";
  title: string;
  message: string;
  productId?: string;
  score?: number;
};