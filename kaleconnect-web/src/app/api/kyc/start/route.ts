import { NextRequest, NextResponse } from "next/server";
import { createKycSession } from "@/lib/repository";
import { appendAudit } from "@/lib/audit";
import { getKycGuidance } from "@/lib/compliance";
import { z } from "zod";
import { start as sorobanStart } from "@/lib/soroban/kyc";

const BodySchema = z.object({ userId: z.string().min(1).default("anonymous") }).default({ userId: "anonymous" });

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => ({}));
  const parse = BodySchema.safeParse(json);
  if (!parse.success) {
    return NextResponse.json({ error: "invalid body", issues: parse.error.flatten() }, { status: 400 });
  }
  const { userId } = parse.data;
  // Tenta Soroban primeiro
  const ok = await sorobanStart(userId);
  if (ok) {
    const session = {
      id: `kyc_chain_${Math.random().toString(36).slice(2, 8)}`,
      userId,
      createdAt: new Date().toISOString(),
      status: "pending" as const,
    };
    appendAudit(userId, "kyc.start", { session, provider: "soroban" });
    const guidance = await getKycGuidance(userId, 'pt');
    return NextResponse.json({ ...session, guidance }, { status: 201 });
  }

  // Fallback mock
  const session = createKycSession(userId);
  appendAudit(userId, "kyc.start", { session, provider: "mock" });
  const guidance = await getKycGuidance(userId, 'pt');
  return NextResponse.json({ ...session, guidance }, { status: 201 });
}
