import { callContract, getContractIds } from "./client";

export async function start(user: string): Promise<boolean> {
  const { kycRegistry } = getContractIds();
  if (!kycRegistry) return false;
  try {
    await callContract<void>(kycRegistry, "start", [user]);
    return true;
  } catch {
    return false;
  }
}

export async function getStatus(user: string): Promise<string | undefined> {
  const { kycRegistry } = getContractIds();
  if (!kycRegistry) return undefined;
  try {
    const res = await callContract<string>(kycRegistry, "get_status", [user]);
    return res;
  } catch {
    return undefined;
  }
}
