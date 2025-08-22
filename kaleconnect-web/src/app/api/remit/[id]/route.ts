import { NextRequest, NextResponse } from "next/server";
import { getRemit, progressRemit } from "@/lib/repository";
import { appendAudit } from "@/lib/audit";
import { get as sorobanGet } from "@/lib/soroban/remittance";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  // Tenta via Soroban primeiro (nota: contrato não tem progressão automática)
  const soroban = await sorobanGet(id);
  if (soroban) {
    const rec = { id: String(id), ...soroban };
    // Em Soroban não temos userId vinculado aqui; apenas retornamos o estado
    return NextResponse.json(rec);
  }

  // Fallback mock com progressão automática
  const before = getRemit(id);
  const rec = progressRemit(id) ?? before;
  if (!rec) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (rec.userId) {
    appendAudit(rec.userId, "remit.progress", { id: rec.id, prevStatus: before?.status, status: rec.status, provider: "mock" });
  }
  return NextResponse.json(rec);
}
