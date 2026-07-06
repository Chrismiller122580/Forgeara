import { NextRequest, NextResponse } from "next/server";
import { getBuildByShareId } from "@/lib/db/builds";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const build = await getBuildByShareId(id);

  if (!build) {
    return NextResponse.json({ error: "Build not found" }, { status: 404 });
  }

  return NextResponse.json({ build });
}