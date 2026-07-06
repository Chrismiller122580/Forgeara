import { NextRequest, NextResponse } from "next/server";
import { upsertAccountFromSession, requireSession } from "@/lib/auth/session";
import { createBuild, listBuildsForAccount } from "@/lib/db/builds";
import { PRODUCTS } from "@/lib/products";
import type { VehicleProfile } from "@/lib/types";

export async function GET() {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const account = await upsertAccountFromSession();
  if (!account) {
    return NextResponse.json({ error: "Account sync failed" }, { status: 500 });
  }

  const builds = await listBuildsForAccount(account.id);
  return NextResponse.json({ builds });
}

export async function POST(req: NextRequest) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json(
      { error: "Login required", loginUrl: "/auth/login?returnTo=/customize" },
      { status: 401 }
    );
  }

  const account = await upsertAccountFromSession();
  if (!account) {
    return NextResponse.json({ error: "Account sync failed" }, { status: 500 });
  }

  const body = await req.json();
  const appliedProductIds: string[] = body.appliedProductIds ?? [];
  const vehicle: VehicleProfile = body.vehicle;
  const photoUrl: string | null = body.photoUrl ?? null;
  const name: string = body.name ?? `My ${vehicle?.model ?? "Build"}`;

  if (!vehicle || !appliedProductIds.length) {
    return NextResponse.json(
      { error: "Vehicle and at least one mod required" },
      { status: 400 }
    );
  }

  const products = PRODUCTS.filter((p) => appliedProductIds.includes(p.id));
  const totalPrice = products.reduce((s, p) => s + p.price, 0);

  const build = await createBuild({
    accountId: account.id,
    name,
    vehicle,
    photoUrl,
    appliedProductIds,
    totalPrice,
  });

  return NextResponse.json({ build, persisted: account.persisted });
}