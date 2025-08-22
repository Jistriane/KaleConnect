import { NextRequest, NextResponse } from "next/server";
import { getRate as getOracleRate } from "@/lib/soroban/rates";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from") || "XLM";
  const to = searchParams.get("to") || "BRL";
  const amount = Number(searchParams.get("amount") || 0);

  // Tenta oracle primeiro
  const oracle = await getOracleRate(`${from}:${to}`);
  if (oracle) {
    const rate = oracle.price;
    const feeFraction = oracle.fee_bp / 10000;
    const feePct = feeFraction * 100;
    const toAmount = Math.max(0, amount * rate * (1 - feeFraction));
    return NextResponse.json({ from, to, amount, rate, feePct, toAmount });
  }

  // Fallback mock simples
  const rate = from === "XLM" && to === "BRL" ? 1.9 : 1.0; // fictício
  const feePct = 0.8; // 0,8%
  const toAmount = Math.max(0, amount * rate * (1 - feePct / 100));

  return NextResponse.json({ from, to, amount, rate, feePct, toAmount });
}
