import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, upsertAccountFromSession } from "@/lib/auth/session";
import { listBuildsForAccount } from "@/lib/db/builds";
import { SiteHeader } from "@/components/site-header";
import { Car, ExternalLink, Plus } from "lucide-react";

export const metadata = {
  title: "My Garage — Forgeara",
  description: "Your saved vehicle builds",
};

export default async function GaragePage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/auth/login?returnTo=/garage");
  }

  const account = await upsertAccountFromSession();
  const builds = account ? await listBuildsForAccount(account.id) : [];

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-emerald-400">Welcome back</p>
            <h1 className="text-3xl font-bold">
              {session.user.name ?? session.user.email}&apos;s Garage
            </h1>
            <p className="mt-1 text-zinc-500">
              {account?.persisted
                ? "Builds saved to your account"
                : "Builds saved in session — add DATABASE_URL for permanent storage"}
            </p>
          </div>
          <Link
            href="/customize"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-black transition hover:bg-emerald-400"
          >
            <Plus className="h-4 w-4" />
            New build
          </Link>
        </div>

        {builds.length === 0 ? (
          <div className="mt-16 rounded-2xl border border-dashed border-zinc-800 py-16 text-center">
            <Car className="mx-auto h-12 w-12 text-zinc-600" />
            <p className="mt-4 text-lg font-medium">No builds yet</p>
            <p className="mt-2 text-sm text-zinc-500">
              Customize a vehicle and hit Save &amp; Share to store it here.
            </p>
            <Link
              href="/customize?demo=true"
              className="mt-6 inline-block text-emerald-400 hover:underline"
            >
              Start with the demo car
            </Link>
          </div>
        ) : (
          <ul className="mt-8 space-y-4">
            {builds.map((build) => (
              <li
                key={build.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5"
              >
                <div>
                  <p className="font-semibold">{build.name}</p>
                  <p className="text-sm text-zinc-500">
                    {build.vehicle.label} • {build.appliedProductIds.length} mods • $
                    {build.totalPrice.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-zinc-600">
                    {new Date(build.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Link
                  href={build.shareUrl}
                  className="inline-flex items-center gap-1 rounded-xl border border-zinc-700 px-4 py-2 text-sm transition hover:border-emerald-500/50 hover:text-emerald-400"
                >
                  View build
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}