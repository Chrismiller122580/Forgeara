import type { VehicleProfile } from "@/lib/types";

const VEHICLE_HINTS: Record<string, Partial<VehicleProfile>> = {
  mustang: { make: "Ford", model: "Mustang GT", year: 2024, bodyStyle: "Coupe" },
  ford: { make: "Ford", model: "Mustang GT", year: 2024, bodyStyle: "Coupe" },
  camaro: { make: "Chevrolet", model: "Camaro SS", year: 2023, bodyStyle: "Coupe" },
  bmw: { make: "BMW", model: "M4 Competition", year: 2024, bodyStyle: "Coupe" },
  tesla: { make: "Tesla", model: "Model 3 Performance", year: 2024, bodyStyle: "Sedan" },
  porsche: { make: "Porsche", model: "911 Carrera", year: 2024, bodyStyle: "Coupe" },
  supra: { make: "Toyota", model: "GR Supra", year: 2024, bodyStyle: "Coupe" },
  challenger: { make: "Dodge", model: "Challenger R/T", year: 2023, bodyStyle: "Coupe" },
};

const DEFAULT_VEHICLE: VehicleProfile = {
  make: "Ford",
  model: "Mustang GT",
  year: 2024,
  label: "2024 Ford Mustang GT",
  bodyStyle: "Coupe",
  confidence: 0.72,
};

function hashString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export async function detectVehicle(
  file?: File | null,
  photoUrl?: string | null
): Promise<VehicleProfile> {
  await new Promise((r) => setTimeout(r, 600));

  const hint = (file?.name ?? photoUrl ?? "").toLowerCase();
  for (const [key, profile] of Object.entries(VEHICLE_HINTS)) {
    if (hint.includes(key)) {
      return {
        make: profile.make!,
        model: profile.model!,
        year: profile.year!,
        label: `${profile.year} ${profile.make} ${profile.model}`,
        bodyStyle: profile.bodyStyle!,
        confidence: 0.91,
      };
    }
  }

  const seed = hashString(hint || "forgeara");
  const makes = Object.values(VEHICLE_HINTS);
  const pick = makes[seed % makes.length];

  return {
    make: pick.make!,
    model: pick.model!,
    year: pick.year!,
    label: `${pick.year} ${pick.make} ${pick.model}`,
    bodyStyle: pick.bodyStyle!,
    confidence: DEFAULT_VEHICLE.confidence + (seed % 15) / 100,
  };
}