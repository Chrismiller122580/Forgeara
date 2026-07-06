"use client";

import Image from "next/image";
import type { ForgeProduct } from "@/lib/types";

export function PhotoPreview({
  photoUrl,
  appliedMods,
}: {
  photoUrl: string | null;
  appliedMods: ForgeProduct[];
}) {
  if (!photoUrl) {
    return (
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-zinc-500">
        <span className="text-5xl mb-4">📸</span>
        <p>Snap or upload your vehicle to preview mods</p>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[320px] overflow-hidden">
      <Image
        src={photoUrl}
        alt="Your vehicle"
        fill
        className="object-cover"
        unoptimized
      />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
      {appliedMods.length > 0 && (
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
          {appliedMods.map((mod) => (
            <span
              key={mod.id}
              className="rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-medium text-black"
            >
              {mod.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}