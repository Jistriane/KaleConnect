"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
// Helper para integrar a carteira xBull (Stellar) no navegador

async function wait(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

async function getInjectedXbull(retries = 20, intervalMs = 300): Promise<any | undefined> {
  if (typeof window === "undefined") return undefined;
  for (let i = 0; i < retries; i++) {
    const anyWin: any = window as any;
    // Possíveis nomes injetados pela extensão xBull (variando por versões/navegadores)
    const g = anyWin?.xBull ?? anyWin?.xbull ?? anyWin?.Xbull ?? anyWin?.xbullWallet ?? anyWin?.stellarXbull;
    if (g) return g;
    await wait(intervalMs);
  }
  return undefined;
}

export function isXbullAvailableSync(): boolean {
  if (typeof window === "undefined") return false;
  const anyWin: any = window as any;
  return Boolean(
    anyWin?.xBull || anyWin?.xbull || anyWin?.Xbull || anyWin?.xbullWallet || anyWin?.stellarXbull
  );
}

export async function isXbullAvailable(): Promise<boolean> {
  const g = await getInjectedXbull();
  return Boolean(g);
}

export async function getXbullPublicKey(): Promise<string> {
  // Tentativa 1: usar API injetada no window (variações de método)
  const g = await getInjectedXbull();
  if (!g) throw new Error("xBull API indisponível");

  // Alguns provedores expõem connect() que retorna a conta/chave
  if (typeof g.connect === "function") {
    try {
      const r = await g.connect({ network: "TESTNET" });
      // r pode ser string ou objeto com publicKey/address
      const pk = typeof r === "string" ? r : r?.publicKey ?? r?.address ?? r?.account;
      if (typeof pk === "string" && pk.length > 0) return pk;
    } catch {
      // continua para outras tentativas
    }
  }

  // Algumas versões expõem requestPublicKey()/getPublicKey()
  const candidates = ["requestPublicKey", "getPublicKey", "getAddress", "publicKey"] as const;
  for (const k of candidates) {
    const v: any = (g as any)[k];
    if (typeof v === "function") {
      try {
        const r = await v({ network: "TESTNET" });
        const pk = typeof r === "string" ? r : r?.publicKey ?? r?.address ?? r?.account;
        if (typeof pk === "string" && pk.length > 0) return pk;
      } catch {
        // tenta próximo
      }
    } else if (typeof v === "string" && v.length > 0) {
      return v;
    }
  }

  throw new Error("Não foi possível obter a public key da xBull");
}
