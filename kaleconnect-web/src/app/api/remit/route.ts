import { NextRequest, NextResponse } from "next/server";
import { createRemit } from "@/lib/repository";
import { appendAudit } from "@/lib/audit";
import { checkHighValueRemit } from "@/lib/compliance";
import { z } from "zod";
import { create as sorobanCreate } from "@/lib/soroban/remittance";

const BodySchema = z.object({
  from: z.string().min(1).default("XLM"),
  to: z.string().min(1).default("USDC"),
  amount: z.coerce.number().nonnegative().default(0),
  userId: z.string().min(1).default("anonymous"),
});

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => ({}));
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid body", issues: parsed.error.flatten() }, { status: 400 });
  }
  // Tenta via Soroban primeiro
  const sorobanId = await sorobanCreate(parsed.data.from, parsed.data.to, parsed.data.amount);
  if (sorobanId !== undefined) {
    const record = {
      id: String(sorobanId),
      from: parsed.data.from,
      to: parsed.data.to,
      amount: parsed.data.amount,
      feePct: 0.8,
      status: "created" as const,
      createdAt: new Date().toISOString(),
      userId: parsed.data.userId,
    };
    const compliance = checkHighValueRemit(record);
    appendAudit(parsed.data.userId, "remit.create", { input: parsed.data, record, compliance, provider: "soroban" });
    return NextResponse.json({ ...record, compliance }, { status: 201 });
  }

  // Fallback mock atual
  const record = createRemit(parsed.data);
  const compliance = checkHighValueRemit(record);
  appendAudit(parsed.data.userId, "remit.create", { input: parsed.data, record, compliance, provider: "mock" });
  return NextResponse.json({ ...record, compliance }, { status: 201 });
}
