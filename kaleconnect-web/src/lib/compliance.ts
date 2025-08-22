// Regras simples de compliance (stub) e orientação KYC via Elisa (a implementar)
import type { Remit } from "@/lib/types";

const HIGH_VALUE_LIMIT = Number(process.env.COMPLIANCE_HIGH_VALUE_LIMIT ?? 1000);

export function checkHighValueRemit(remit: Remit): { highValue: boolean; limit: number } {
  return { highValue: remit.amount >= HIGH_VALUE_LIMIT, limit: HIGH_VALUE_LIMIT };
}

// Futuro: acoplar com ElisaOS para guidance de documentos conforme país/uso
export async function getKycGuidance(_userId: string, lang: 'pt' | 'en' = 'pt'): Promise<string> {
  return lang === 'pt'
    ? 'Para limites altos, envie documento de identidade, comprovante de residência e selfie. (stub)'
    : 'For high limits, please submit ID, proof of address, and a selfie. (stub)';
}
