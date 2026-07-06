import { NextResponse } from "next/server";
import { upsertAccountFromSession, requireSession } from "@/lib/auth/session";

export async function GET() {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const account = await upsertAccountFromSession();

  return NextResponse.json({
    user: {
      sub: session.user.sub,
      name: session.user.name,
      email: session.user.email,
      picture: session.user.picture,
    },
    account,
  });
}