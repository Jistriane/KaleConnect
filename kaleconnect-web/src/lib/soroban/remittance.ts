import { callContract, getContractIds } from "./client";

export type RemitInfo = {
  from: string;
  to: string;
  amount: number;
  status: string;
};

export async function create(from: string, to: string, amount: number): Promise<string | number | undefined> {
  const { remittance } = getContractIds();
  if (!remittance) return undefined;
  try {
    const id = await callContract<string | number>(remittance, "create", [from, to, amount]);
    return id;
  } catch {
    return undefined;
  }
}

export async function get(id: string | number): Promise<RemitInfo | undefined> {
  const { remittance } = getContractIds();
  if (!remittance) return undefined;
  try {
    const res = await callContract<RemitInfo>(remittance, "get", [id]);
    return res;
  } catch {
    return undefined;
  }
}
