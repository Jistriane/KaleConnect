// Camada de repositório (in-memory). Facilita trocar para persistência real depois.
import { kycSessions, remits } from "@/lib/memory";
import type { CreateRemitInput, KycSession, Remit } from "@/lib/types";

// -------- Remittance --------
export function createRemit(input: CreateRemitInput): Remit {
  const id = `remit_${Math.random().toString(36).slice(2, 10)}`;
  const feePct = 0.8;
  const record: Remit = {
    id,
    from: input.from,
    to: input.to,
    amount: input.amount,
    feePct,
    status: "created",
    createdAt: new Date().toISOString(),
    userId: input.userId,
  };
  remits.set(id, record);
  return record;
}

export function getRemit(id: string): Remit | undefined {
  return remits.get(id);
}

// Avança o status de forma mock: created -> submitted -> settled
export function progressRemit(id: string): Remit | undefined {
  const rec = remits.get(id);
  if (!rec) return undefined;
  if (rec.status === "created") rec.status = "submitted";
  else if (rec.status === "submitted") rec.status = "settled";
  return rec;
}

// -------- KYC --------
export function createKycSession(userId: string): KycSession {
  const id = `kyc_${Math.random().toString(36).slice(2, 10)}`;
  const session: KycSession = {
    id,
    userId,
    createdAt: new Date().toISOString(),
    status: "pending",
  };
  kycSessions.set(id, session);
  return session;
}

export function getKycSession(id: string): KycSession | undefined {
  return kycSessions.get(id);
}

// Avança o status mock: pending -> review -> approved
export function progressKyc(id: string): KycSession | undefined {
  const s = kycSessions.get(id);
  if (!s) return undefined;
  if (s.status === "pending") s.status = "review";
  else if (s.status === "review") s.status = "approved";
  return s;
}
