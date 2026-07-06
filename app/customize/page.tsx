"use client";

import { Suspense } from "react";
import { CustomizerApp } from "@/components/customizer-app";

export default function CustomizePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-zinc-400">
          Loading smart customizer…
        </div>
      }
    >
      <CustomizerApp />
    </Suspense>
  );
}