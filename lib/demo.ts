export const DEMO_VEHICLE = {
  photoUrl: "/demo-vehicle.jpg",
  label: "2024 Ford Mustang GT",
} as const;

export const DEMO_APPLIED_MOD_IDS = ["wrap-red", "bronze-rims", "recaro"] as const;

export function isDemoMode(searchParams: URLSearchParams) {
  return searchParams.get("demo") === "true";
}