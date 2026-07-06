import { prisma } from "@/lib/prisma";
import { isDbConnected } from "@/lib/auth/session";
import * as memoryStore from "@/lib/builds/store";
import type { SavedBuild, VehicleProfile } from "@/lib/types";

function toSavedBuild(record: {
  id: string;
  name: string;
  vehicleData: unknown;
  photoUrl: string | null;
  mods: unknown;
  totalPrice: number;
  sharedUrl: string;
  createdAt: Date;
}): SavedBuild {
  const mods = record.mods as { appliedProductIds?: string[] };
  return {
    id: record.sharedUrl.replace("/build/", ""),
    name: record.name,
    vehicle: record.vehicleData as VehicleProfile,
    photoUrl: record.photoUrl,
    appliedProductIds: mods.appliedProductIds ?? [],
    totalPrice: record.totalPrice,
    createdAt: record.createdAt.toISOString(),
    shareUrl: record.sharedUrl,
  };
}

export async function createBuild(input: {
  accountId: string;
  name: string;
  vehicle: VehicleProfile;
  photoUrl: string | null;
  appliedProductIds: string[];
  totalPrice: number;
}): Promise<SavedBuild> {
  const shareId = crypto.randomUUID().slice(0, 8);
  const shareUrl = `/build/${shareId}`;

  if (await isDbConnected()) {
    const record = await prisma.userBuild.create({
      data: {
        accountId: input.accountId,
        name: input.name,
        vehicleData: input.vehicle,
        photoUrl: input.photoUrl,
        mods: { appliedProductIds: input.appliedProductIds },
        totalPrice: input.totalPrice,
        sharedUrl: shareUrl,
      },
    });
    return toSavedBuild(record);
  }

  const build: SavedBuild = {
    id: shareId,
    name: input.name,
    vehicle: input.vehicle,
    photoUrl: input.photoUrl,
    appliedProductIds: input.appliedProductIds,
    totalPrice: input.totalPrice,
    createdAt: new Date().toISOString(),
    shareUrl,
  };
  memoryStore.saveBuild(build);
  return build;
}

export async function getBuildByShareId(shareId: string): Promise<SavedBuild | null> {
  const shareUrl = `/build/${shareId}`;

  if (await isDbConnected()) {
    const record = await prisma.userBuild.findUnique({
      where: { sharedUrl: shareUrl },
    });
    if (record) return toSavedBuild(record);
  }

  return memoryStore.getBuild(shareId);
}

export async function listBuildsForAccount(accountId: string): Promise<SavedBuild[]> {
  if (await isDbConnected()) {
    const records = await prisma.userBuild.findMany({
      where: { accountId },
      orderBy: { createdAt: "desc" },
    });
    return records.map(toSavedBuild);
  }

  return memoryStore.listBuilds();
}