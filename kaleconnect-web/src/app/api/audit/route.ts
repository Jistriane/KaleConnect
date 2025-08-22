import { NextRequest, NextResponse } from "next/server";
import { getUserAudit } from "@/lib/audit";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "missing userId" }, { status: 400 });
  const events = getUserAudit(userId);
  return NextResponse.json({ userId, events });
}
