import type { VehicleProfile } from "@/lib/types";
import { Scan, Loader2 } from "lucide-react";

export function VehicleBadge({
  vehicle,
  detecting,
}: {
  vehicle: VehicleProfile | null;
  detecting?: boolean;
}) {
  if (detecting) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm">
        <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
        <span className="text-emerald-300">AI scanning vehicle…</span>
      </div>
    );
  }

  if (!vehicle) return null;

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-1.5 text-sm">
      <Scan className="h-4 w-4 text-emerald-400" />
      <span className="font-medium">{vehicle.label}</span>
      <span className="text-zinc-500">
        {Math.round(vehicle.confidence * 100)}% match
      </span>
    </div>
  );
}