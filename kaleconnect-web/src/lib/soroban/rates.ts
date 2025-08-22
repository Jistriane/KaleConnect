import { callContract, getContractIds } from "./client";

export type RateInfo = {
  price: number; // i128 no contrato; aqui number
  fee_bp: number;
};

export async function getRate(pair: string): Promise<RateInfo | undefined> {
  // Formato esperado no contrato: "BASE:QUOTE", ex.: "XLM:BRL"
  const { ratesOracle } = getContractIds();
  if (!ratesOracle) return undefined;
  try {
    const res = await callContract<RateInfo>(ratesOracle, "get_rate", [pair]);
    return res;
  } catch {
    return undefined;
  }
}
