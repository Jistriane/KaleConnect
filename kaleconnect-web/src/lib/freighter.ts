"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
// Normalizador da API da Freighter para evitar problemas de interop ESM/CJS no dev (Turbopack)

async function wait(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

// Função específica para aguardar que a API do Freighter fique totalmente disponível
export async function waitForFreighterAPI(maxWaitMs = 8000): Promise<boolean> {
  if (typeof window === "undefined") return false;
  
  console.log('🔍 Iniciando detecção do Freighter...');
  
  // Estratégia 1: Verificar se já está disponível imediatamente
  const anyWin: any = window as any;
  const immediateApi = anyWin?.freighterApi || anyWin?.freighter;
  if (immediateApi && typeof immediateApi === 'object') {
    console.log('✅ Freighter API encontrada imediatamente');
    return true;
  }
  
  // Estratégia 2: Tentar via módulo NPM
  try {
    const mod: any = await import("@stellar/freighter-api");
    if (mod?.isInstalled && typeof mod.isInstalled === 'function') {
      const installed = await mod.isInstalled();
      if (installed) {
        console.log('✅ Freighter disponível via módulo NPM');
        return true;
      }
    }
  } catch (error) {
    console.log('⚠️ Módulo NPM não funcionou:', error);
  }
  
  // Estratégia 3: Aguardar a API se injetar (com menos tentativas)
  const api = await getInjectedFreighter(10, 500); // 10 tentativas x 500ms = 5s max
  if (api) {
    console.log('✅ Freighter API disponível via injeção');
    return true;
  }
  
  console.warn('⚠️ Freighter API não detectada');
  return false;
}

async function getInjectedFreighter(): Promise<any | undefined> {
  if (typeof window === "undefined") return undefined;
  
  const anyWin: any = window as any;
  
  // Verificação simples e direta
  const api = anyWin?.freighterApi ?? anyWin?.freighter ?? anyWin?.window?.freighterApi;
  
  if (api && typeof api === 'object') {
    return api;
  }
  
  // Se não encontrou, aguardar um pouco (máximo 2 segundos)
  for (let i = 0; i < 4; i++) {
    await wait(500);
    const retryApi = anyWin?.freighterApi ?? anyWin?.freighter ?? anyWin?.window?.freighterApi;
    if (retryApi && typeof retryApi === 'object') {
      return retryApi;
    }
  }
  
  return undefined;
}

export function isFreighterInstalled(): boolean {
  if (typeof window === "undefined") return false;
  const anyWin: any = window as any;
  
  // Verificar se a API está injetada (mais simples)
  const api = anyWin?.freighterApi || anyWin?.freighter;
  const hasApi = !!(api && typeof api === 'object');
  
  // Verificar se há indicações DOM da extensão
  const hasScript = document.querySelector('script[src*="freighter"]') !== null;
  const hasMeta = document.querySelector('meta[name*="freighter"]') !== null;
  
  // Retornar true se há qualquer indicação da extensão
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
  // Estratégia 1: Tentar via módulo NPM (mais confiável)
  try {
    const mod: any = await import("@stellar/freighter-api");
    
    if (mod?.getPublicKey && typeof mod.getPublicKey === "function") {
      try {
        // Tentar com rede testnet
        const pk = await mod.getPublicKey({ network: "TESTNET" });
        if (typeof pk === "string" && pk.length > 0) {
          return pk;
        }
      } catch {
        // Tentar sem parâmetros
        const pk = await mod.getPublicKey();
        if (typeof pk === "string" && pk.length > 0) {
          return pk;
        }
      }
    }
  } catch {
    // Continua para próxima estratégia
  }

  // Estratégia 2: API injetada
  const api = await getInjectedFreighter();
  if (api && typeof api.getPublicKey === "function") {
    try {
      const pk = await api.getPublicKey();
      if (typeof pk === "string" && pk.length > 0) {
        return pk;
      }
    } catch {
      // Ignorar erro e continuar
    }
  }

  // Se chegou aqui, não conseguiu conectar
  throw new Error("Freighter não instalada ou inativa. Instale em https://freighter.app/ e desbloqueie a carteira.");
}
