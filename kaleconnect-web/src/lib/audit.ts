// Auditoria criptográfica em memória com hash em cadeia por usuário
import { hmacSha256, aesGcmEncrypt } from "@/lib/crypto";

export type AuditEvent = {
  id: string;
  userId: string;
  ts: string; // ISO
  action: string; // ex: kyc.start, kyc.status, remit.create, remit.progress
  payloadRef: string; // HMAC do JSON do payload
  prevHash?: string; // hash do evento anterior na cadeia
  chainHash: string; // HMAC(action|ts|payloadRef|prevHash)
  encSnippet?: { iv: string; ct: string; tag: string }; // amostra criptografada opcional
};

const userChains = new Map<string, AuditEvent[]>();

export function getUserAudit(userId: string): AuditEvent[] {
  return userChains.get(userId) ?? [];
}

export function appendAudit(userId: string, action: string, payload: unknown): AuditEvent {
  const chain = userChains.get(userId) ?? [];
  const id = `evt_${Math.random().toString(36).slice(2, 10)}`;
  const ts = new Date().toISOString();
  const payloadJson = JSON.stringify(payload);
  const payloadRef = hmacSha256(payloadJson);
  const prevHash = chain.at(-1)?.chainHash;
  const base = `${action}|${ts}|${payloadRef}|${prevHash ?? ""}`;
  const chainHash = hmacSha256(base);
  const sampleText = payloadJson.slice(0, 256);
  const encSnippet = aesGcmEncrypt(sampleText);
  const evt: AuditEvent = { id, userId, ts, action, payloadRef, prevHash, chainHash, encSnippet };
  chain.push(evt);
  userChains.set(userId, chain);
  return evt;
}
