import type { SavedBuild } from "@/lib/types";

const builds = new Map<string, SavedBuild>();

export function saveBuild(build: SavedBuild) {
  builds.set(build.id, build);
  return build;
}

export function getBuild(id: string) {
  return builds.get(id) ?? null;
}

export function listBuilds() {
  return Array.from(builds.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}