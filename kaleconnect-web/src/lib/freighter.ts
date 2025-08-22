"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
// Normalizador da API da Freighter para evitar problemas de interop ESM/CJS no dev (Turbopack)

async function wait(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

async function getInjectedFreighter(retries = 20, intervalMs = 500): Promise<any | undefined> {
  if (typeof window === "undefined") return undefined;
  
  // Primeira tentativa: verificar se já está disponível
  const anyWin: any = window as any;
  let g = anyWin?.freighterApi ?? anyWin?.freighter ?? anyWin?.window?.freighterApi;
  if (g) return g;

  // Aguardar a extensão se injetar (pode demorar após o carregamento da página)
  for (let i = 0; i < retries; i++) {
    g = anyWin?.freighterApi ?? anyWin?.freighter ?? anyWin?.window?.freighterApi;
    if (g && typeof g === 'object') {
      return g;
    }
    await wait(intervalMs);
  }
  return undefined;
}

export function isFreighterInstalled(): boolean {
  if (typeof window === "undefined") return false;
  const anyWin: any = window as any;
  
  // Verificar se a API está injetada
  const hasApi = !!(anyWin?.freighterApi || anyWin?.freighter);
  
  // Verificar se há indicações DOM da extensão
  const hasScript = document.querySelector('script[src*="freighter"]') !== null;
  const hasMeta = document.querySelector('meta[name*="freighter"]') !== null;
  
  return hasApi || hasScript || hasMeta;
}

export async function checkFreighterConnected(): Promise<boolean> {
  try {
    const mod: any = await import("@stellar/freighter-api");
    const fn = mod?.isConnected ?? mod?.default?.isConnected;
    if (typeof fn === "function") {
      const result = await fn();
      // Algumas versões retornam objeto { isConnected: boolean }
      if (typeof result === "object" && result !== null && "isConnected" in result) {
        return Boolean((result as any).isConnected);
      }
      return Boolean(result);
    }
  } catch {
    // segue para fallback
  }
  const g = await getInjectedFreighter();
  if (g && typeof g.isConnected === "function") {
    const r = await g.isConnected();
    if (typeof r === "object" && r !== null && "isConnected" in r) return Boolean(r.isConnected);
    return Boolean(r);
  }
  return false;
}

export async function getFreighterPublicKey(): Promise<string> {
  // Primeiro verificar se a extensão está instalada
  if (!isFreighterInstalled()) {
    throw new Error("Freighter não instalada");
  }

  try {
    const mod: any = await import("@stellar/freighter-api");
    
    // Solicitar acesso explicitamente
    const reqAccess = mod?.requestAccess ?? mod?.default?.requestAccess;
    if (typeof reqAccess === "function") {
      try { 
        await reqAccess(); 
      } catch (e) { 
        console.warn("Usuário pode ter cancelado o acesso:", e);
      }
    }

    const fn = mod?.getPublicKey ?? mod?.default?.getPublicKey;
    if (typeof fn === "function") {
      let pk: any;
      try {
        // Tentar com rede testnet primeiro
        pk = await fn({ network: "TESTNET" });
      } catch (e) {
        pk = await fn();
      }
      if (typeof pk === "string" && pk.length > 0) {
        return pk;
      }
    }
  } catch (e) {
    // Fallback para API injetada
  }

  // Fallback: tentar API injetada diretamente
  const g = await getInjectedFreighter();
  if (!g) {
    throw new Error("Freighter API indisponível");
  }

  if (typeof g.requestAccess === "function") {
    try { 
      await g.requestAccess(); 
    } catch (e) { 
      console.warn("Acesso negado:", e);
    }
  }

  if (typeof g.getPublicKey === "function") {
    let pk: any;
    try {
      pk = await g.getPublicKey({ network: "TESTNET" });
    } catch (e) {
      pk = await g.getPublicKey();
    }
    if (typeof pk === "string" && pk.length > 0) {
      return pk;
    }
  }

  throw new Error("Freighter API indisponível");
}
