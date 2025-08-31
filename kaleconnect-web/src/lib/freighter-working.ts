"use client";

// SOLUÇÃO DEFINITIVA BASEADA NO CÓDIGO QUE FUNCIONA NO freighterClient.ts

async function turbopackSafeImport(module: string): Promise<any> {
  // Usar o mesmo padrão do freighterClient.ts que funciona
  const dynamicImport = new Function("m", "return import(m)") as (m: string) => Promise<unknown>;
  return await dynamicImport(module);
}

export function isFreighterInstalled(): boolean {
  if (typeof window === "undefined") return false;
  
  const win = window as any;
  
  // Verificações mais simples e diretas
  const hasFreighterApi = !!win?.freighterApi;
  const hasFreighter = !!win?.freighter;
  const hasScript = !!document.querySelector('script[src*="freighter"]');
  
  return hasFreighterApi || hasFreighter || hasScript;
}

export async function connectFreighterWorking(): Promise<string | null> {
  console.log('🚀 Conectando Freighter com método que FUNCIONA...');
  
  try {
    // Usar o padrão exato do freighterClient.ts
    const freighter = (await turbopackSafeImport("@stellar/freighter-api")) as any;
    
    console.log('📦 Freighter importado:', {
      hasGetPublicKey: typeof freighter?.getPublicKey,
      hasRequestAccess: typeof freighter?.requestAccess,
      hasIsConnected: typeof freighter?.isConnected,
      hasIsInstalled: typeof freighter?.isInstalled,
      keys: Object.keys(freighter || {})
    });
    
    // Verificar se está instalado
    if (freighter?.isInstalled && typeof freighter.isInstalled === "function") {
      const installed = await freighter.isInstalled();
      console.log('🔍 Freighter instalado:', installed);
      if (!installed) {
        throw new Error("Freighter não está instalado");
      }
    }
    
    // Executar requestAccess se disponível
    if (freighter?.requestAccess && typeof freighter.requestAccess === "function") {
      console.log('🔐 Executando requestAccess...');
      await freighter.requestAccess();
      console.log('✅ requestAccess executado');
    }
    
    // Obter chave pública - usando exatamente o mesmo padrão do freighterClient.ts
    const publicKey = await (freighter.getPublicKey?.({ network: "TESTNET" }) ?? freighter.getPublicKey?.());
    
    if (!publicKey || typeof publicKey !== "string") {
      throw new Error("Não foi possível obter a chave pública da Freighter");
    }
    
    console.log('✅ Freighter conectado com sucesso!');
    return publicKey;
    
  } catch (error) {
    console.error('❌ Erro ao conectar Freighter:', error);
    return null;
  }
}

export async function checkFreighterConnected(): Promise<boolean> {
  try {
    const freighter = (await turbopackSafeImport("@stellar/freighter-api")) as any;
    
    if (freighter?.isConnected && typeof freighter.isConnected === "function") {
      const result = await freighter.isConnected();
      return Boolean(result);
    }
    
    return false;
  } catch {
    return false;
  }
}
