import { NextRequest, NextResponse } from "next/server";
import { kycSessions } from "@/lib/memory";
import { appendAudit } from "@/lib/audit";
import { getStatus as sorobanGetStatus } from "@/lib/soroban/kyc";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });
  // Tentativa Soroban: usamos userId como id nesta demo
  const maybe = kycSessions.get(id);
  if (maybe) {
    const chain = await sorobanGetStatus(maybe.userId);
    if (chain) {
      const resp = { ...maybe, status: chain };
      appendAudit(maybe.userId, "kyc.status", { id: maybe.id, status: chain, provider: "soroban" });
      return NextResponse.json(resp);
    }
  }

  // Fallback mock
  const session = kycSessions.get(id);
  if (!session) return NextResponse.json({ error: "not found" }, { status: 404 });
  const prev = session.status;
  if (session.status === "pending") session.status = "review";
  else if (session.status === "review") session.status = "approved";
  appendAudit(session.userId, "kyc.status", { id: session.id, prevStatus: prev, status: session.status, provider: "mock" });
  return NextResponse.json(session);
}
