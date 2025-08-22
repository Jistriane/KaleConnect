// In-memory storage for demo purposes only. Do NOT use in production.
import type { KycSession, Remit } from "@/lib/types";

// Singletons (por processo)
export const kycSessions = new Map<string, KycSession>();
export const remits = new Map<string, Remit>();
