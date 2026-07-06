import { getAuth0 } from "@/lib/auth0";
import { isAuth0Configured } from "@/lib/auth/env";
import { prisma } from "@/lib/prisma";

export async function getSession() {
  const auth0 = getAuth0();
  if (!auth0) return null;
  try {
    return await auth0.getSession();
  } catch {
    return null;
  }
}

export async function requireSession() {
  const session = await getSession();
  if (!session?.user) {
    return null;
  }
  return session;
}

export async function isDbConnected() {
  if (!process.env.DATABASE_URL) return false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

export async function upsertAccountFromSession() {
  const session = await requireSession();
  if (!session) return null;

  const auth0Id = session.user.sub;
  const email = session.user.email;
  if (!auth0Id || !email) return null;

  if (!(await isDbConnected())) {
    return {
      id: auth0Id,
      auth0Id,
      email,
      name: session.user.name ?? null,
      picture: session.user.picture ?? null,
      persisted: false as const,
    };
  }

  const account = await prisma.account.upsert({
    where: { auth0Id },
    create: {
      auth0Id,
      email,
      name: session.user.name ?? null,
      picture: session.user.picture ?? null,
    },
    update: {
      email,
      name: session.user.name ?? null,
      picture: session.user.picture ?? null,
    },
  });

  return { ...account, persisted: true as const };
}