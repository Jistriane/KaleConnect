import { NextRequest, NextResponse } from "next/server";
import { getRate as getOracleRate } from "@/lib/soroban/rates";

// Very simple mock provider; in the future, replace with real provider(s)
const BASE_RATES: Record<string, number> = {
  "XLM->BRL": 1.9,
  "XLM->USD": 0.12,
  "USD->BRL": 5.2,
  "USDC->BRL": 5.2,
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from") || "XLM";
  const to = searchParams.get("to") || "BRL";
  const amount = Number(searchParams.get("amount") || 0);
  const key = `${from}->${to}`;

  // Tenta oracle primeiro
  const oracle = await getOracleRate(`${from}:${to}`);
  if (oracle) {
    const rate = oracle.price;
    const feeFraction = oracle.fee_bp / 10000; // basis points -> fração
    const feePct = feeFraction * 100; // em % para resposta
    const toAmount = Math.max(0, amount * rate * (1 - feeFraction));
    return NextResponse.json({ from, to, amount, rate, feePct, toAmount });
  }

  // Fallback mock
  const rate = BASE_RATES[key] ?? 1.0;
  const feePct = 0.8; // 0.8%
  const toAmount = Math.max(0, amount * rate * (1 - feePct / 100));
  return NextResponse.json({ from, to, amount, rate, feePct, toAmount });
}
