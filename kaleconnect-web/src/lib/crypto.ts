// Utilidades criptográficas para auditoria e (base para) E2E.
// OBS: Para E2E real, as chaves devem ser geridas no cliente. Aqui expomos
// utilitários que podem ser usados pelos clientes e pelo servidor.

import { createHmac, randomBytes, createCipheriv, createDecipheriv } from "crypto";

const AUDIT_LOG_SECRET = process.env.AUDIT_LOG_SECRET || "dev_audit_secret";
const AES_SECRET = (process.env.APP_CRYPTO_SECRET || "dev_app_secret").padEnd(32, "0").slice(0, 32); // 32 bytes

export function hmacSha256(input: string): string {
  return createHmac("sha256", AUDIT_LOG_SECRET).update(input).digest("hex");
}

export type AesPayload = { iv: string; ct: string; tag: string };

export function aesGcmEncrypt(plaintext: string): AesPayload {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", Buffer.from(AES_SECRET), iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { iv: iv.toString("base64"), ct: enc.toString("base64"), tag: tag.toString("base64") };
}

export function aesGcmDecrypt(payload: AesPayload): string {
  const iv = Buffer.from(payload.iv, "base64");
  const tag = Buffer.from(payload.tag, "base64");
  const decipher = createDecipheriv("aes-256-gcm", Buffer.from(AES_SECRET), iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(Buffer.from(payload.ct, "base64")), decipher.final()]);
  return dec.toString("utf8");
}

// Derivação simples por usuário (não para produção):
export function deriveUserScopedSecret(userId: string): string {
  return hmacSha256(`user:${userId}:scope`);
}

// E2E com chave fornecida pelo cliente (base64 de 32 bytes)
export function aesGcmEncryptWithKey(plaintext: string, keyBase64: string): AesPayload {
  const key = Buffer.from(keyBase64, "base64");
  if (key.length !== 32) throw new Error("invalid_e2e_key_length");
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { iv: iv.toString("base64"), ct: enc.toString("base64"), tag: tag.toString("base64") };
}
