import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { appendAudit } from "@/lib/audit";
import { createRemit } from "@/lib/repository";

const BodySchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  amount: z.coerce.number().nonnegative(),
  userId: z.string().min(1).optional().default("anonymous"),
  txId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => ({}));
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid body", issues: parsed.error.flatten() }, { status: 400 });
  }
  // Apenas registra/audita a remessa que já foi assinada no cliente
  const record = createRemit({ from: parsed.data.from, to: parsed.data.to, amount: parsed.data.amount, userId: parsed.data.userId });
  appendAudit(parsed.data.userId ?? "anonymous", "remit.audit", { input: parsed.data, record, provider: "client.freighter" });
  return NextResponse.json({ ok: true, record }, { status: 201 });
}
